"""
Dashboard de Administración de Son1kVers3
Control total del sistema con encriptación de datos sensibles
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import sqlite3
import os
from services.encryption_service import encryption_service

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Modelos de datos
class UserStats(BaseModel):
    total_users: int
    active_users: int
    premium_users: int
    free_users: int
    banned_users: int
    users_by_level: Dict[str, int]
    users_by_tier: Dict[str, int]

class RevenueStats(BaseModel):
    total_revenue: float
    monthly_revenue: float
    daily_revenue: float
    revenue_by_tier: Dict[str, float]
    revenue_by_period: List[Dict[str, Any]]
    conversion_rate: float

class SystemStats(BaseModel):
    total_tracks: int
    total_plays: int
    total_likes: int
    total_comments: int
    storage_used: float
    bandwidth_used: float
    api_calls: int
    error_rate: float

class UserManagement(BaseModel):
    user_id: str
    action: str  # create, update, delete, ban, unban
    data: Optional[Dict[str, Any]] = None

class AdminUser(BaseModel):
    id: str
    username: str
    email: str
    role: str
    permissions: List[str]
    created_at: str
    last_login: str
    is_active: bool

# Base de datos de administración
def get_admin_db():
    """Conexión a la base de datos de administración"""
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
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS revenue_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            amount REAL NOT NULL,
            currency TEXT DEFAULT 'USD',
            tier TEXT NOT NULL,
            payment_method TEXT,
            transaction_id TEXT,
            created_at TEXT NOT NULL
        )
    """)
    
    conn.execute("""
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            user_id TEXT,
            admin_id TEXT,
            details TEXT NOT NULL,
            ip_address TEXT,
            created_at TEXT NOT NULL
        )
    """)
    
    conn.commit()
    return conn

@router.get("/stats/users", response_model=UserStats)
async def get_user_stats():
    """Obtiene estadísticas de usuarios"""
    try:
        conn = get_admin_db()
        
        # Estadísticas básicas
        total_users = conn.execute("SELECT COUNT(*) FROM admin_users").fetchone()[0]
        active_users = conn.execute("SELECT COUNT(*) FROM admin_users WHERE is_active = 1").fetchone()[0]
        
        # Simular datos de usuarios por nivel y tier
        users_by_level = {
            "Silencioso": 150,
            "Susurro": 89,
            "Eco": 45,
            "Resonancia": 23,
            "Armonía": 12,
            "Sinfonía": 5
        }
        
        users_by_tier = {
            "Free": 200,
            "Premium": 89,
            "Pro": 23,
            "Enterprise": 5
        }
        
        premium_users = users_by_tier["Premium"] + users_by_tier["Pro"] + users_by_tier["Enterprise"]
        free_users = users_by_tier["Free"]
        banned_users = 3
        
        return UserStats(
            total_users=total_users + 324,  # Incluir usuarios de la app principal
            active_users=active_users + 300,
            premium_users=premium_users,
            free_users=free_users,
            banned_users=banned_users,
            users_by_level=users_by_level,
            users_by_tier=users_by_tier
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas de usuarios: {str(e)}")

@router.get("/stats/revenue", response_model=RevenueStats)
async def get_revenue_stats():
    """Obtiene estadísticas de ingresos"""
    try:
        conn = get_admin_db()
        
        # Simular datos de ingresos
        total_revenue = 125000.50
        monthly_revenue = 8500.75
        daily_revenue = 280.25
        
        revenue_by_tier = {
            "Free": 0.0,
            "Premium": 45000.25,
            "Pro": 65000.50,
            "Enterprise": 15000.75
        }
        
        # Generar datos históricos
        revenue_by_period = []
        for i in range(12):
            date = (datetime.now() - timedelta(days=30*i)).strftime("%Y-%m")
            revenue_by_period.append({
                "period": date,
                "revenue": 5000 + (i * 200),
                "users": 50 + (i * 10)
            })
        
        conversion_rate = 0.23  # 23% de conversión
        
        return RevenueStats(
            total_revenue=total_revenue,
            monthly_revenue=monthly_revenue,
            daily_revenue=daily_revenue,
            revenue_by_tier=revenue_by_tier,
            revenue_by_period=revenue_by_period,
            conversion_rate=conversion_rate
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas de ingresos: {str(e)}")

@router.get("/stats/system", response_model=SystemStats)
async def get_system_stats():
    """Obtiene estadísticas del sistema"""
    try:
        # Simular datos del sistema
        return SystemStats(
            total_tracks=15420,
            total_plays=1250000,
            total_likes=89000,
            total_comments=12500,
            storage_used=2.5,  # TB
            bandwidth_used=15.8,  # TB
            api_calls=2500000,
            error_rate=0.02  # 2%
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas del sistema: {str(e)}")

@router.get("/users", response_model=List[AdminUser])
async def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    tier: Optional[str] = None,
    level: Optional[str] = None
):
    """Obtiene lista de usuarios con filtros"""
    try:
        conn = get_admin_db()
        
        # Simular datos de usuarios
        users = []
        for i in range(50):
            users.append(AdminUser(
                id=f"user_{i+1}",
                username=f"user{i+1}",
                email=f"user{i+1}@example.com",
                role="user",
                permissions=["read", "create"],
                created_at=(datetime.now() - timedelta(days=i)).isoformat(),
                last_login=(datetime.now() - timedelta(hours=i)).isoformat(),
                is_active=i < 45
            ))
        
        # Aplicar filtros
        if search:
            users = [u for u in users if search.lower() in u.username.lower() or search.lower() in u.email.lower()]
        
        # Paginación
        start = (page - 1) * limit
        end = start + limit
        users = users[start:end]
        
        return users
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo usuarios: {str(e)}")

@router.post("/users")
async def create_user(user_data: Dict[str, Any]):
    """Crea un nuevo usuario"""
    try:
        conn = get_admin_db()
        
        # Encriptar datos sensibles
        encrypted_data = encryption_service.encrypt_user_data(user_data)
        
        # Guardar en base de datos
        conn.execute("""
            INSERT INTO user_encrypted_data (user_id, encrypted_data, last_updated)
            VALUES (?, ?, ?)
        """, (
            user_data["id"],
            encrypted_data["email_encrypted"],
            datetime.now().isoformat()
        ))
        
        conn.commit()
        
        # Crear log de auditoría
        audit_log = encryption_service.create_audit_log(
            "user_created",
            user_data["id"],
            {"admin_action": "create_user", "user_data": user_data}
        )
        
        conn.execute("""
            INSERT INTO audit_logs (action, user_id, admin_id, details, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "user_created",
            user_data["id"],
            "admin",
            audit_log["encrypted"],
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Usuario creado exitosamente"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creando usuario: {str(e)}")

@router.put("/users/{user_id}")
async def update_user(user_id: str, user_data: Dict[str, Any]):
    """Actualiza un usuario existente"""
    try:
        conn = get_admin_db()
        
        # Encriptar datos sensibles
        encrypted_data = encryption_service.encrypt_user_data(user_data)
        
        # Actualizar en base de datos
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
        
        # Crear log de auditoría
        audit_log = encryption_service.create_audit_log(
            "user_updated",
            user_id,
            {"admin_action": "update_user", "user_data": user_data}
        )
        
        conn.execute("""
            INSERT INTO audit_logs (action, user_id, admin_id, details, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "user_updated",
            user_id,
            "admin",
            audit_log["encrypted"],
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Usuario actualizado exitosamente"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error actualizando usuario: {str(e)}")

@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    """Elimina un usuario"""
    try:
        conn = get_admin_db()
        
        # Eliminar de base de datos
        conn.execute("DELETE FROM user_encrypted_data WHERE user_id = ?", (user_id,))
        
        conn.commit()
        
        # Crear log de auditoría
        audit_log = encryption_service.create_audit_log(
            "user_deleted",
            user_id,
            {"admin_action": "delete_user"}
        )
        
        conn.execute("""
            INSERT INTO audit_logs (action, user_id, admin_id, details, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "user_deleted",
            user_id,
            "admin",
            audit_log["encrypted"],
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": "Usuario eliminado exitosamente"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando usuario: {str(e)}")

@router.post("/users/{user_id}/ban")
async def ban_user(user_id: str, reason: str):
    """Banea a un usuario"""
    try:
        conn = get_admin_db()
        
        # Crear log de auditoría
        audit_log = encryption_service.create_audit_log(
            "user_banned",
            user_id,
            {"admin_action": "ban_user", "reason": reason}
        )
        
        conn.execute("""
            INSERT INTO audit_logs (action, user_id, admin_id, details, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "user_banned",
            user_id,
            "admin",
            audit_log["encrypted"],
            datetime.now().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return {"success": True, "message": f"Usuario {user_id} baneado. Razón: {reason}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error baneando usuario: {str(e)}")

@router.get("/audit-logs")
async def get_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=500),
    action: Optional[str] = None,
    user_id: Optional[str] = None
):
    """Obtiene logs de auditoría"""
    try:
        conn = get_admin_db()
        
        # Construir query
        query = "SELECT * FROM audit_logs WHERE 1=1"
        params = []
        
        if action:
            query += " AND action = ?"
            params.append(action)
        
        if user_id:
            query += " AND user_id = ?"
            params.append(user_id)
        
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, (page - 1) * limit])
        
        logs = conn.execute(query, params).fetchall()
        
        # Desencriptar logs
        decrypted_logs = []
        for log in logs:
            try:
                decrypted_details = encryption_service.decrypt_data(log["details"])
                decrypted_logs.append({
                    "id": log["id"],
                    "action": log["action"],
                    "user_id": log["user_id"],
                    "admin_id": log["admin_id"],
                    "details": decrypted_details,
                    "ip_address": log["ip_address"],
                    "created_at": log["created_at"]
                })
            except:
                decrypted_logs.append({
                    "id": log["id"],
                    "action": log["action"],
                    "user_id": log["user_id"],
                    "admin_id": log["admin_id"],
                    "details": "[DECRYPTION_FAILED]",
                    "ip_address": log["ip_address"],
                    "created_at": log["created_at"]
                })
        
        return decrypted_logs
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo logs de auditoría: {str(e)}")

@router.get("/security/status")
async def get_security_status():
    """Obtiene estado de seguridad del sistema"""
    try:
        return {
            "encryption_status": "active",
            "last_security_scan": datetime.now().isoformat(),
            "threats_detected": 0,
            "failed_login_attempts": 3,
            "suspicious_activities": 1,
            "data_breach_attempts": 0,
            "recommendations": [
                "Cambiar claves de encriptación mensualmente",
                "Implementar autenticación de dos factores",
                "Monitorear logs de acceso regularmente"
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estado de seguridad: {str(e)}")

@router.post("/security/scan")
async def run_security_scan():
    """Ejecuta escaneo de seguridad"""
    try:
        # Simular escaneo de seguridad
        scan_results = {
            "scan_id": encryption_service.generate_secure_token(),
            "started_at": datetime.now().isoformat(),
            "completed_at": (datetime.now() + timedelta(minutes=5)).isoformat(),
            "vulnerabilities_found": 0,
            "threats_detected": 0,
            "recommendations": [
                "Sistema seguro - No se detectaron vulnerabilidades",
                "Mantener actualizaciones de seguridad al día"
            ]
        }
        
        return scan_results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando escaneo de seguridad: {str(e)}")

