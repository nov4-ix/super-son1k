"""
Script de Inicialización de Usuarios Son1kVers3
Crea cuentas de administrador, testers y enterprise
"""

import sqlite3
import os
import hashlib
import base64
from datetime import datetime
from services.encryption_service import encryption_service

def hash_password(password: str) -> str:
    """Crea hash seguro de contraseña"""
    salt = os.urandom(32)
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return base64.urlsafe_b64encode(salt + pwdhash).decode()

def create_users():
    """Crea las cuentas de usuarios iniciales"""
    
    # Configurar base de datos
    db_path = os.getenv("ADMIN_DB_PATH", "/tmp/admin.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    
    # Crear tablas si no existen
    conn.execute("""
        CREATE TABLE IF NOT EXISTS admin_users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            permissions TEXT NOT NULL,
            tier TEXT NOT NULL,
            level TEXT NOT NULL,
            alvae_symbol TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_login TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS user_encrypted_data (
            user_id TEXT PRIMARY KEY,
            encrypted_data TEXT NOT NULL,
            last_updated TEXT NOT NULL
        )
    """)
    
    # Datos de usuarios a crear
    users_data = [
        # Administrador principal
        {
            "id": "admin_nov4ix",
            "username": "Nov4-ix",
            "email": "nov4-ix@son1kvers3.com",
            "password": "admin123!",
            "role": "admin",
            "permissions": ["read", "write", "delete", "admin", "moderate"],
            "tier": "Enterprise",
            "level": "Sinfonía",
            "alvae_symbol": "ALVAE"
        },
        
        # Cuenta Enterprise del socio
        {
            "id": "enterprise_partner",
            "username": "Enterprise-Partner",
            "email": "pro.enterprise@son1kvers3.com",
            "password": "admin123!",
            "role": "enterprise",
            "permissions": ["read", "write", "moderate"],
            "tier": "Enterprise",
            "level": "Sinfonía",
            "alvae_symbol": "ALVAE"
        }
    ]
    
    # Agregar 10 cuentas Pro para testers
    for i in range(1, 11):
        users_data.append({
            "id": f"pro_tester_{i}",
            "username": f"Pro-Tester{i}",
            "email": f"pro.tester{i}@son1kvers3.com",
            "password": "Premium123!",
            "role": "pro_tester",
            "permissions": ["read", "write", "test"],
            "tier": "Pro",
            "level": "Armonía",
            "alvae_symbol": "ALVAE"
        })
    
    # Crear usuarios
    for user_data in users_data:
        try:
            # Verificar si el usuario ya existe
            existing = conn.execute(
                "SELECT id FROM admin_users WHERE id = ? OR email = ?", 
                (user_data["id"], user_data["email"])
            ).fetchone()
            
            if existing:
                print(f"⚠️  Usuario {user_data['username']} ya existe, actualizando...")
                # Actualizar usuario existente
                conn.execute("""
                    UPDATE admin_users SET
                        username = ?, email = ?, password_hash = ?, role = ?,
                        permissions = ?, tier = ?, level = ?, alvae_symbol = ?,
                        last_updated = ?
                    WHERE id = ?
                """, (
                    user_data["username"],
                    user_data["email"],
                    hash_password(user_data["password"]),
                    user_data["role"],
                    ",".join(user_data["permissions"]),
                    user_data["tier"],
                    user_data["level"],
                    user_data["alvae_symbol"],
                    datetime.now().isoformat(),
                    user_data["id"]
                ))
            else:
                # Crear nuevo usuario
                conn.execute("""
                    INSERT INTO admin_users (
                        id, username, email, password_hash, role, permissions,
                        tier, level, alvae_symbol, created_at, is_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_data["id"],
                    user_data["username"],
                    user_data["email"],
                    hash_password(user_data["password"]),
                    user_data["role"],
                    ",".join(user_data["permissions"]),
                    user_data["tier"],
                    user_data["level"],
                    user_data["alvae_symbol"],
                    datetime.now().isoformat(),
                    True
                ))
            
            # Crear datos encriptados del usuario
            encrypted_user_data = {
                "email": user_data["email"],
                "real_name": user_data["username"],
                "phone": "",
                "billing_address": "",
                "payment_info": "",
                "personal_id": user_data["id"]
            }
            
            encrypted_data = encryption_service.encrypt_user_data(encrypted_user_data)
            
            # Guardar datos encriptados
            conn.execute("""
                INSERT OR REPLACE INTO user_encrypted_data (user_id, encrypted_data, last_updated)
                VALUES (?, ?, ?)
            """, (
                user_data["id"],
                encrypted_data["email_encrypted"],
                datetime.now().isoformat()
            ))
            
            print(f"✅ Usuario {user_data['username']} ({user_data['tier']}) creado exitosamente")
            
        except Exception as e:
            print(f"❌ Error creando usuario {user_data['username']}: {str(e)}")
    
    conn.commit()
    conn.close()
    
    print("\n🎉 Inicialización de usuarios completada!")
    print(f"📊 Total de usuarios creados: {len(users_data)}")
    print("👑 Administrador: Nov4-ix (nov4-ix@son1kvers3.com)")
    print("🏢 Enterprise: Enterprise-Partner (pro.enterprise@son1kvers3.com)")
    print("🧪 Testers Pro: pro.tester1@son1kvers3.com - pro.tester10@son1kvers3.com")
    print("🔐 Todas las cuentas incluyen el símbolo ALVAE en el nickname")

if __name__ == "__main__":
    create_users()
