#!/usr/bin/env python3
"""
Herramienta Externa de Desencriptación para Son1kVers3
Solo para administradores autorizados - Desencripta datos sensibles
"""

import os
import sys
import json
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from typing import Dict, Any, Optional
import argparse
from datetime import datetime

class ExternalDecryptionTool:
    def __init__(self):
        # Claves de encriptación (deben coincidir con el sistema principal)
        self.master_key = os.getenv("MASTER_ENCRYPTION_KEY", "son1kvers3_master_key_2024_ultra_secure")
        self.domain_key = os.getenv("DOMAIN_ENCRYPTION_KEY", "son1kvers3_domain_key_2024")
        self.salt = os.getenv("ENCRYPTION_SALT", "son1kvers3_salt_2024").encode()
        
        # Generar claves de encriptación derivadas
        self.encryption_key = self._derive_key(self.master_key, self.salt)
        self.domain_encryption_key = self._derive_key(self.domain_key, self.salt)
        
        self.cipher = Fernet(self.encryption_key)
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

    def decrypt_domain_data(self, encrypted_domain_data: str) -> Dict[str, Any]:
        """Desencripta datos críticos del dominio"""
        return self.decrypt_data(encrypted_domain_data, use_domain_key=True)

    def decrypt_audit_log(self, encrypted_audit_log: str) -> Dict[str, Any]:
        """Desencripta un log de auditoría"""
        return self.decrypt_data(encrypted_audit_log)

    def batch_decrypt_users(self, encrypted_users: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Desencripta múltiples usuarios en lote"""
        decrypted_users = []
        
        for user in encrypted_users:
            try:
                decrypted_user = self.decrypt_user_data(user)
                decrypted_users.append(decrypted_user)
            except Exception as e:
                print(f"Error desencriptando usuario {user.get('id', 'unknown')}: {str(e)}")
                decrypted_users.append({
                    **user,
                    "decryption_error": str(e)
                })
        
        return decrypted_users

    def export_decrypted_data(self, data: Any, filename: str = None) -> str:
        """Exporta datos desencriptados a archivo JSON"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"decrypted_data_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
        
        return filename

    def verify_encryption_integrity(self, encrypted_data: str, use_domain_key: bool = False) -> bool:
        """Verifica la integridad de los datos encriptados"""
        try:
            self.decrypt_data(encrypted_data, use_domain_key)
            return True
        except:
            return False

def main():
    parser = argparse.ArgumentParser(description='Herramienta Externa de Desencriptación Son1kVers3')
    parser.add_argument('--mode', choices=['user', 'domain', 'audit', 'batch'], required=True,
                       help='Modo de desencriptación')
    parser.add_argument('--input', required=True, help='Archivo de entrada con datos encriptados')
    parser.add_argument('--output', help='Archivo de salida (opcional)')
    parser.add_argument('--domain-key', action='store_true', help='Usar clave de dominio')
    parser.add_argument('--verify', action='store_true', help='Solo verificar integridad')
    
    args = parser.parse_args()
    
    # Verificar autenticación
    admin_token = input("Ingrese el token de administrador: ")
    if admin_token != os.getenv("ADMIN_TOKEN", "son1kvers3_admin_2024"):
        print("❌ Token de administrador inválido")
        sys.exit(1)
    
    tool = ExternalDecryptionTool()
    
    try:
        # Cargar datos de entrada
        with open(args.input, 'r', encoding='utf-8') as f:
            input_data = json.load(f)
        
        print(f"🔓 Iniciando desencriptación en modo: {args.mode}")
        
        if args.verify:
            # Solo verificar integridad
            if isinstance(input_data, str):
                is_valid = tool.verify_encryption_integrity(input_data, args.domain_key)
                print(f"✅ Integridad: {'Válida' if is_valid else 'Inválida'}")
            else:
                print("❌ Error: Los datos de verificación deben ser una cadena encriptada")
            return
        
        # Desencriptar según el modo
        if args.mode == 'user':
            if isinstance(input_data, list):
                decrypted_data = tool.batch_decrypt_users(input_data)
            else:
                decrypted_data = tool.decrypt_user_data(input_data)
        
        elif args.mode == 'domain':
            if isinstance(input_data, str):
                decrypted_data = tool.decrypt_domain_data(input_data)
            else:
                print("❌ Error: Los datos de dominio deben ser una cadena encriptada")
                return
        
        elif args.mode == 'audit':
            if isinstance(input_data, str):
                decrypted_data = tool.decrypt_audit_log(input_data)
            else:
                print("❌ Error: Los logs de auditoría deben ser una cadena encriptada")
                return
        
        elif args.mode == 'batch':
            decrypted_data = tool.batch_decrypt_users(input_data)
        
        # Exportar resultados
        output_file = tool.export_decrypted_data(decrypted_data, args.output)
        
        print(f"✅ Desencriptación completada exitosamente")
        print(f"📁 Archivo de salida: {output_file}")
        print(f"📊 Elementos procesados: {len(decrypted_data) if isinstance(decrypted_data, list) else 1}")
        
        # Mostrar resumen
        if isinstance(decrypted_data, list):
            print(f"📈 Resumen:")
            for i, item in enumerate(decrypted_data[:5]):  # Mostrar solo los primeros 5
                if 'decryption_error' in item:
                    print(f"  {i+1}. ❌ Error: {item['decryption_error']}")
                else:
                    print(f"  {i+1}. ✅ {item.get('id', 'unknown')} - {item.get('username', 'unknown')}")
            
            if len(decrypted_data) > 5:
                print(f"  ... y {len(decrypted_data) - 5} elementos más")
        else:
            print(f"📄 Datos desencriptados: {json.dumps(decrypted_data, indent=2, ensure_ascii=False)}")
    
    except FileNotFoundError:
        print(f"❌ Error: No se encontró el archivo {args.input}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error durante la desencriptación: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()

