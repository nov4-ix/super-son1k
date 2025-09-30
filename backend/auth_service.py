"""
Servicio de Autenticación Son1kVers3
Maneja login, registro y gestión de sesiones
"""

import os
import hashlib
import base64
import sqlite3
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from services.encryption_service import encryption_service

class AuthService:
    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "son1kvers3_jwt_secret_2024")
        self.algorithm = "HS256"
        self.token_expiry = timedelta(hours=24)
        
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

    def get_db_connection(self):
        """Conexión a la base de datos de usuarios"""
        db_path = os.getenv("ADMIN_DB_PATH", "/tmp/admin.db")
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Autentica un usuario"""
        try:
            conn = self.get_db_connection()
            
            # Buscar usuario por email
            user = conn.execute("""
                SELECT * FROM admin_users 
                WHERE email = ? AND is_active = 1
            """, (email,)).fetchone()
            
            if not user:
                conn.close()
                return None
            
            # Verificar contraseña
            if not self.verify_password(password, user["password_hash"]):
                conn.close()
                return None
            
            # Actualizar último login
            conn.execute("""
                UPDATE admin_users 
                SET last_login = ? 
                WHERE id = ?
            """, (datetime.now().isoformat(), user["id"]))
            
            conn.commit()
            conn.close()
            
            # Crear token JWT
            token_payload = {
                "user_id": user["id"],
                "email": user["email"],
                "username": user["username"],
                "role": user["role"],
                "tier": user["tier"],
                "level": user["level"],
                "alvae_symbol": user["alvae_symbol"],
                "permissions": user["permissions"].split(","),
                "exp": datetime.utcnow() + self.token_expiry
            }
            
            token = jwt.encode(token_payload, self.secret_key, algorithm=self.algorithm)
            
            return {
                "user_id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"],
                "tier": user["tier"],
                "level": user["level"],
                "alvae_symbol": user["alvae_symbol"],
                "permissions": user["permissions"].split(","),
                "token": token,
                "expires_at": (datetime.utcnow() + self.token_expiry).isoformat()
            }
            
        except Exception as e:
            print(f"Error authenticating user: {str(e)}")
            return None

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verifica un token JWT"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene información de usuario por ID"""
        try:
            conn = self.get_db_connection()
            
            user = conn.execute("""
                SELECT * FROM admin_users 
                WHERE id = ? AND is_active = 1
            """, (user_id,)).fetchone()
            
            conn.close()
            
            if not user:
                return None
            
            return {
                "user_id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"],
                "tier": user["tier"],
                "level": user["level"],
                "alvae_symbol": user["alvae_symbol"],
                "permissions": user["permissions"].split(","),
                "created_at": user["created_at"],
                "last_login": user["last_login"]
            }
            
        except Exception as e:
            print(f"Error getting user: {str(e)}")
            return None

    def create_user(self, user_data: Dict[str, Any]) -> bool:
        """Crea un nuevo usuario"""
        try:
            conn = self.get_db_connection()
            
            # Verificar si el usuario ya existe
            existing = conn.execute("""
                SELECT id FROM admin_users 
                WHERE id = ? OR email = ?
            """, (user_data["id"], user_data["email"])).fetchone()
            
            if existing:
                conn.close()
                return False
            
            # Crear usuario
            conn.execute("""
                INSERT INTO admin_users (
                    id, username, email, password_hash, role, permissions,
                    tier, level, alvae_symbol, created_at, is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_data["id"],
                user_data["username"],
                user_data["email"],
                self.hash_password(user_data["password"]),
                user_data["role"],
                ",".join(user_data["permissions"]),
                user_data["tier"],
                user_data["level"],
                user_data["alvae_symbol"],
                datetime.now().isoformat(),
                True
            ))
            
            # Crear datos encriptados
            encrypted_user_data = {
                "email": user_data["email"],
                "real_name": user_data["username"],
                "phone": user_data.get("phone", ""),
                "billing_address": user_data.get("billing_address", ""),
                "payment_info": user_data.get("payment_info", ""),
                "personal_id": user_data["id"]
            }
            
            encrypted_data = encryption_service.encrypt_user_data(encrypted_user_data)
            
            conn.execute("""
                INSERT INTO user_encrypted_data (user_id, encrypted_data, last_updated)
                VALUES (?, ?, ?)
            """, (
                user_data["id"],
                encrypted_data["email_encrypted"],
                datetime.now().isoformat()
            ))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return False

    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> bool:
        """Actualiza un usuario existente"""
        try:
            conn = self.get_db_connection()
            
            # Actualizar datos básicos
            update_fields = []
            params = []
            
            if "username" in user_data:
                update_fields.append("username = ?")
                params.append(user_data["username"])
            
            if "email" in user_data:
                update_fields.append("email = ?")
                params.append(user_data["email"])
            
            if "role" in user_data:
                update_fields.append("role = ?")
                params.append(user_data["role"])
            
            if "permissions" in user_data:
                update_fields.append("permissions = ?")
                params.append(",".join(user_data["permissions"]))
            
            if "tier" in user_data:
                update_fields.append("tier = ?")
                params.append(user_data["tier"])
            
            if "level" in user_data:
                update_fields.append("level = ?")
                params.append(user_data["level"])
            
            if "alvae_symbol" in user_data:
                update_fields.append("alvae_symbol = ?")
                params.append(user_data["alvae_symbol"])
            
            if "password" in user_data:
                update_fields.append("password_hash = ?")
                params.append(self.hash_password(user_data["password"]))
            
            if update_fields:
                update_fields.append("last_updated = ?")
                params.append(datetime.now().isoformat())
                params.append(user_id)
                
                query = f"UPDATE admin_users SET {', '.join(update_fields)} WHERE id = ?"
                conn.execute(query, params)
            
            # Actualizar datos encriptados si es necesario
            if any(field in user_data for field in ["email", "real_name", "phone", "billing_address", "payment_info"]):
                encrypted_user_data = {
                    "email": user_data.get("email", ""),
                    "real_name": user_data.get("username", ""),
                    "phone": user_data.get("phone", ""),
                    "billing_address": user_data.get("billing_address", ""),
                    "payment_info": user_data.get("payment_info", ""),
                    "personal_id": user_id
                }
                
                encrypted_data = encryption_service.encrypt_user_data(encrypted_user_data)
                
                conn.execute("""
                    UPDATE user_encrypted_data 
                    SET encrypted_data = ?, last_updated = ?
                    WHERE user_id = ?
                """, (
                    encrypted_data["email_encrypted"],
                    datetime.now().isoformat(),
                    user_id
                ))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            return False

    def delete_user(self, user_id: str) -> bool:
        """Elimina un usuario (soft delete)"""
        try:
            conn = self.get_db_connection()
            
            # Soft delete - marcar como inactivo
            conn.execute("""
                UPDATE admin_users 
                SET is_active = 0, last_updated = ?
                WHERE id = ?
            """, (datetime.now().isoformat(), user_id))
            
            conn.commit()
            conn.close()
            
            return True
            
        except Exception as e:
            print(f"Error deleting user: {str(e)}")
            return False

# Instancia global del servicio de autenticación
auth_service = AuthService()
