"""
Servicio de Encriptación para Datos Sensibles
Protege información crítica del dominio y usuarios
"""

import os
import base64
import hashlib
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from typing import Dict, Any, Optional
import json
from datetime import datetime

class EncryptionService:
    def __init__(self):
        # Clave maestra para encriptación (en producción debe estar en variables de entorno)
        self.master_key = os.getenv("MASTER_ENCRYPTION_KEY", "son1kvers3_master_key_2024_ultra_secure")
        self.salt = os.getenv("ENCRYPTION_SALT", "son1kvers3_salt_2024").encode()
        
        # Generar clave de encriptación derivada
        self.encryption_key = self._derive_key(self.master_key, self.salt)
        self.cipher = Fernet(self.encryption_key)
        
        # Clave para datos del dominio (separada)
        self.domain_key = os.getenv("DOMAIN_ENCRYPTION_KEY", "son1kvers3_domain_key_2024")
        self.domain_encryption_key = self._derive_key(self.domain_key, self.salt)
        self.domain_cipher = Fernet(self.domain_encryption_key)

    def _derive_key(self, password: str, salt: bytes) -> bytes:
        """Deriva una clave de encriptación usando PBKDF2"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key

    def encrypt_data(self, data: Any, use_domain_key: bool = False) -> str:
        """Encripta datos sensibles"""
        try:
            # Convertir datos a JSON
            json_data = json.dumps(data, default=str)
            
            # Encriptar
            if use_domain_key:
                encrypted_data = self.domain_cipher.encrypt(json_data.encode())
            else:
                encrypted_data = self.cipher.encrypt(json_data.encode())
            
            # Codificar en base64 para almacenamiento
            return base64.urlsafe_b64encode(encrypted_data).decode()
        except Exception as e:
            raise Exception(f"Error encriptando datos: {str(e)}")

    def decrypt_data(self, encrypted_data: str, use_domain_key: bool = False) -> Any:
        """Desencripta datos sensibles"""
        try:
            # Decodificar base64
            encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
            
            # Desencriptar
            if use_domain_key:
                decrypted_data = self.domain_cipher.decrypt(encrypted_bytes)
            else:
                decrypted_data = self.cipher.decrypt(encrypted_bytes)
            
            # Convertir de JSON
            return json.loads(decrypted_data.decode())
        except Exception as e:
            raise Exception(f"Error desencriptando datos: {str(e)}")

    def encrypt_user_data(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Encripta datos específicos de usuario"""
        sensitive_fields = [
            'email', 'phone', 'payment_info', 'billing_address',
            'credit_card', 'bank_account', 'personal_id', 'real_name'
        ]
        
        encrypted_data = user_data.copy()
        
        for field in sensitive_fields:
            if field in encrypted_data and encrypted_data[field]:
                encrypted_data[f"{field}_encrypted"] = self.encrypt_data(encrypted_data[field])
                encrypted_data[field] = "[ENCRYPTED]"
        
        return encrypted_data

    def decrypt_user_data(self, encrypted_user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Desencripta datos específicos de usuario"""
        decrypted_data = encrypted_user_data.copy()
        
        for key, value in encrypted_user_data.items():
            if key.endswith('_encrypted') and value != "[ENCRYPTED]":
                original_field = key.replace('_encrypted', '')
                try:
                    decrypted_data[original_field] = self.decrypt_data(value)
                    decrypted_data[key] = "[DECRYPTED]"
                except:
                    decrypted_data[original_field] = "[DECRYPTION_FAILED]"
        
        return decrypted_data

    def encrypt_domain_data(self, domain_data: Dict[str, Any]) -> str:
        """Encripta datos críticos del dominio"""
        return self.encrypt_data(domain_data, use_domain_key=True)

    def decrypt_domain_data(self, encrypted_domain_data: str) -> Dict[str, Any]:
        """Desencripta datos críticos del dominio"""
        return self.decrypt_data(encrypted_domain_data, use_domain_key=True)

    def hash_password(self, password: str) -> str:
        """Crea hash seguro de contraseña"""
        salt = os.urandom(32)
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return base64.urlsafe_b64encode(salt + pwdhash).decode()

    def verify_password(self, password: str, hashed: str) -> bool:
        """Verifica contraseña contra hash"""
        try:
            decoded = base64.urlsafe_b64decode(hashed)
            salt = decoded[:32]
            pwdhash = decoded[32:]
            return pwdhash == hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        except:
            return False

    def generate_secure_token(self, length: int = 32) -> str:
        """Genera token seguro aleatorio"""
        return base64.urlsafe_b64encode(os.urandom(length)).decode()

    def create_audit_log(self, action: str, user_id: str, details: Dict[str, Any]) -> Dict[str, Any]:
        """Crea log de auditoría encriptado"""
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action,
            "user_id": user_id,
            "details": details,
            "ip_address": details.get("ip_address", "unknown"),
            "user_agent": details.get("user_agent", "unknown")
        }
        
        return {
            "raw": audit_entry,
            "encrypted": self.encrypt_data(audit_entry)
        }

# Instancia global del servicio de encriptación
encryption_service = EncryptionService()

