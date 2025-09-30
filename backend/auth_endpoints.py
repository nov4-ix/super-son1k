"""
Endpoints de Autenticación Son1kVers3
Login, registro y gestión de sesiones
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
from auth_service import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Modelos de datos
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user: Optional[Dict[str, Any]] = None
    token: Optional[str] = None

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    tier: str = "Free"
    level: str = "Silencioso"

class UserProfile(BaseModel):
    user_id: str
    username: str
    email: str
    role: str
    tier: str
    level: str
    alvae_symbol: str
    permissions: list
    created_at: str
    last_login: Optional[str]

# Función para obtener el token del header
def get_token(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization:
        return None
    
    if authorization.startswith("Bearer "):
        return authorization[7:]
    
    return authorization

# Función para verificar autenticación
def get_current_user(token: Optional[str] = Depends(get_token)) -> Dict[str, Any]:
    if not token:
        raise HTTPException(status_code=401, detail="Token de autenticación requerido")
    
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    
    return user

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Inicia sesión de usuario"""
    try:
        user = auth_service.authenticate_user(login_data.email, login_data.password)
        
        if not user:
            return LoginResponse(
                success=False,
                message="Credenciales inválidas"
            )
        
        return LoginResponse(
            success=True,
            message="Login exitoso",
            user=user,
            token=user["token"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el login: {str(e)}")

@router.post("/register", response_model=LoginResponse)
async def register(register_data: RegisterRequest):
    """Registra un nuevo usuario"""
    try:
        # Generar ID único para el usuario
        import uuid
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        
        # Crear datos del usuario
        user_data = {
            "id": user_id,
            "username": register_data.username,
            "email": register_data.email,
            "password": register_data.password,
            "role": "user",
            "permissions": ["read", "create"],
            "tier": register_data.tier,
            "level": register_data.level,
            "alvae_symbol": "ALVAE"
        }
        
        # Crear usuario
        success = auth_service.create_user(user_data)
        
        if not success:
            return LoginResponse(
                success=False,
                message="Error creando usuario. El email ya existe."
            )
        
        # Autenticar al usuario recién creado
        user = auth_service.authenticate_user(register_data.email, register_data.password)
        
        return LoginResponse(
            success=True,
            message="Usuario registrado exitosamente",
            user=user,
            token=user["token"] if user else None
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el registro: {str(e)}")

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Obtiene el perfil del usuario actual"""
    try:
        user_id = current_user["user_id"]
        user_data = auth_service.get_user_by_id(user_id)
        
        if not user_data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return UserProfile(
            user_id=user_data["user_id"],
            username=user_data["username"],
            email=user_data["email"],
            role=user_data["role"],
            tier=user_data["tier"],
            level=user_data["level"],
            alvae_symbol=user_data["alvae_symbol"],
            permissions=user_data["permissions"],
            created_at=user_data["created_at"],
            last_login=user_data["last_login"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo perfil: {str(e)}")

@router.put("/profile")
async def update_profile(
    profile_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Actualiza el perfil del usuario actual"""
    try:
        user_id = current_user["user_id"]
        
        # Agregar campos permitidos para actualización
        allowed_fields = ["username", "email", "phone", "billing_address"]
        update_data = {k: v for k, v in profile_data.items() if k in allowed_fields}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay campos válidos para actualizar")
        
        success = auth_service.update_user(user_id, update_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Error actualizando perfil")
        
        return {"success": True, "message": "Perfil actualizado exitosamente"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error actualizando perfil: {str(e)}")

@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Cambia la contraseña del usuario actual"""
    try:
        user_id = current_user["user_id"]
        
        # Verificar contraseña actual
        user_data = auth_service.get_user_by_id(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Obtener hash de contraseña actual de la base de datos
        import sqlite3
        conn = sqlite3.connect("/tmp/admin.db")
        conn.row_factory = sqlite3.Row
        
        user_db = conn.execute("""
            SELECT password_hash FROM admin_users WHERE id = ?
        """, (user_id,)).fetchone()
        
        conn.close()
        
        if not user_db or not auth_service.verify_password(old_password, user_db["password_hash"]):
            raise HTTPException(status_code=400, detail="Contraseña actual incorrecta")
        
        # Actualizar contraseña
        success = auth_service.update_user(user_id, {"password": new_password})
        
        if not success:
            raise HTTPException(status_code=500, detail="Error cambiando contraseña")
        
        return {"success": True, "message": "Contraseña cambiada exitosamente"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cambiando contraseña: {str(e)}")

@router.post("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Cierra sesión del usuario actual"""
    # En un sistema real, aquí invalidarías el token
    # Por ahora, solo devolvemos un mensaje de éxito
    return {"success": True, "message": "Sesión cerrada exitosamente"}

@router.get("/verify-token")
async def verify_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Verifica si el token es válido"""
    return {
        "valid": True,
        "user": {
            "user_id": current_user["user_id"],
            "username": current_user["username"],
            "email": current_user["email"],
            "role": current_user["role"],
            "tier": current_user["tier"],
            "level": current_user["level"],
            "alvae_symbol": current_user["alvae_symbol"]
        }
    }
