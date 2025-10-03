#!/usr/bin/env python3
"""
🚀 Advanced Features API Endpoints
Endpoints para funcionalidades avanzadas: colaboración, versionado, marketplace, API pública
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime
from advanced_features_system import (
    collaboration_system,
    versioning_system,
    marketplace_system,
    api_system
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/advanced", tags=["Advanced Features"])

# ============= MODELOS DE DATOS =============

# Colaboración
class CreateCollaborationRequest(BaseModel):
    project_id: str
    user_id: str
    user_name: str

class JoinCollaborationRequest(BaseModel):
    session_id: str
    user_id: str
    user_name: str

class UpdateCursorRequest(BaseModel):
    session_id: str
    user_id: str
    cursor_data: Dict[str, Any]

class BroadcastChangeRequest(BaseModel):
    session_id: str
    user_id: str
    change_data: Dict[str, Any]

# Versionado
class CreateVersionRequest(BaseModel):
    project_id: str
    user_id: str
    data: Dict[str, Any]
    message: Optional[str] = ""

class CreateBranchRequest(BaseModel):
    project_id: str
    branch_name: str
    from_version: Optional[str] = None

# Marketplace
class ListItemRequest(BaseModel):
    seller_id: str
    item_data: Dict[str, Any]

class RateItemRequest(BaseModel):
    user_id: str
    item_id: str
    rating: int

# API Pública
class GenerateAPIKeyRequest(BaseModel):
    user_id: str
    app_name: str
    tier: str = "free"


# ============= ENDPOINTS DE COLABORACIÓN =============

@router.post("/collaboration/create-session")
async def create_collaboration_session(request: CreateCollaborationRequest):
    """Crear sesión de colaboración en tiempo real"""
    try:
        result = await collaboration_system.create_collaboration_session(
            request.project_id,
            request.user_id,
            request.user_name
        )
        return result
    except Exception as e:
        logger.error(f"Error creating collaboration session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collaboration/join-session")
async def join_collaboration_session(request: JoinCollaborationRequest):
    """Unirse a sesión de colaboración"""
    try:
        result = await collaboration_system.join_collaboration_session(
            request.session_id,
            request.user_id,
            request.user_name
        )
        return result
    except Exception as e:
        logger.error(f"Error joining collaboration session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collaboration/update-cursor")
async def update_user_cursor(request: UpdateCursorRequest):
    """Actualizar posición del cursor del usuario"""
    try:
        result = await collaboration_system.update_user_cursor(
            request.session_id,
            request.user_id,
            request.cursor_data
        )
        return result
    except Exception as e:
        logger.error(f"Error updating cursor: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collaboration/broadcast-change")
async def broadcast_change(request: BroadcastChangeRequest):
    """Transmitir cambio a todos los colaboradores"""
    try:
        result = await collaboration_system.broadcast_change(
            request.session_id,
            request.user_id,
            request.change_data
        )
        return result
    except Exception as e:
        logger.error(f"Error broadcasting change: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collaboration/lock-element")
async def lock_element(session_id: str, user_id: str, element_id: str):
    """Bloquear elemento para edición exclusiva"""
    try:
        result = await collaboration_system.lock_element(session_id, user_id, element_id)
        return result
    except Exception as e:
        logger.error(f"Error locking element: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collaboration/unlock-element")
async def unlock_element(session_id: str, element_id: str):
    """Desbloquear elemento"""
    try:
        result = await collaboration_system.unlock_element(session_id, element_id)
        return result
    except Exception as e:
        logger.error(f"Error unlocking element: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= ENDPOINTS DE VERSIONADO =============

@router.post("/versioning/create-version")
async def create_version(request: CreateVersionRequest):
    """Crear nueva versión del proyecto"""
    try:
        result = await versioning_system.create_version(
            request.project_id,
            request.user_id,
            request.data,
            request.message
        )
        return result
    except Exception as e:
        logger.error(f"Error creating version: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/versioning/history/{project_id}")
async def get_version_history(project_id: str, limit: int = 50):
    """Obtener historial de versiones"""
    try:
        result = await versioning_system.get_version_history(project_id, limit)
        return result
    except Exception as e:
        logger.error(f"Error getting version history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/versioning/restore/{project_id}/{version_id}")
async def restore_version(project_id: str, version_id: str):
    """Restaurar versión específica"""
    try:
        result = await versioning_system.restore_version(project_id, version_id)
        return result
    except Exception as e:
        logger.error(f"Error restoring version: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/versioning/compare/{project_id}")
async def compare_versions(project_id: str, version_id_1: str, version_id_2: str):
    """Comparar dos versiones"""
    try:
        result = await versioning_system.compare_versions(project_id, version_id_1, version_id_2)
        return result
    except Exception as e:
        logger.error(f"Error comparing versions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/versioning/create-branch")
async def create_branch(request: CreateBranchRequest):
    """Crear rama de desarrollo"""
    try:
        result = await versioning_system.create_branch(
            request.project_id,
            request.branch_name,
            request.from_version
        )
        return result
    except Exception as e:
        logger.error(f"Error creating branch: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= ENDPOINTS DE MARKETPLACE =============

@router.post("/marketplace/list-item")
async def list_marketplace_item(request: ListItemRequest):
    """Listar item en el marketplace"""
    try:
        result = await marketplace_system.list_item(request.seller_id, request.item_data)
        return result
    except Exception as e:
        logger.error(f"Error listing item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/marketplace/search")
async def search_marketplace(
    query: str = "",
    category: str = "",
    min_price: float = 0,
    max_price: float = float('inf')
):
    """Buscar items en el marketplace"""
    try:
        result = await marketplace_system.search_marketplace(query, category, min_price, max_price)
        return result
    except Exception as e:
        logger.error(f"Error searching marketplace: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/marketplace/purchase/{item_id}")
async def purchase_item(item_id: str, user_id: str):
    """Comprar item del marketplace"""
    try:
        result = await marketplace_system.purchase_item(user_id, item_id)
        return result
    except Exception as e:
        logger.error(f"Error purchasing item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/marketplace/rate")
async def rate_item(request: RateItemRequest):
    """Calificar item del marketplace"""
    try:
        result = await marketplace_system.rate_item(
            request.user_id,
            request.item_id,
            request.rating
        )
        return result
    except Exception as e:
        logger.error(f"Error rating item: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/marketplace/categories")
async def get_marketplace_categories():
    """Obtener categorías del marketplace"""
    return {
        "success": True,
        "categories": marketplace_system.categories
    }


# ============= ENDPOINTS DE API PÚBLICA =============

@router.post("/public-api/generate-key")
async def generate_api_key(request: GenerateAPIKeyRequest):
    """Generar API key para desarrollador"""
    try:
        result = await api_system.generate_api_key(
            request.user_id,
            request.app_name,
            request.tier
        )
        return result
    except Exception as e:
        logger.error(f"Error generating API key: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/public-api/validate")
async def validate_api_key(api_key: str = Header(..., alias="X-API-Key")):
    """Validar API key"""
    try:
        result = await api_system.validate_api_key(api_key)
        return result
    except Exception as e:
        logger.error(f"Error validating API key: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/public-api/rate-limit")
async def check_rate_limit(api_key: str = Header(..., alias="X-API-Key")):
    """Verificar rate limit"""
    try:
        result = await api_system.check_rate_limit(api_key)
        return result
    except Exception as e:
        logger.error(f"Error checking rate limit: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/public-api/usage-stats")
async def get_usage_stats(api_key: str = Header(..., alias="X-API-Key")):
    """Obtener estadísticas de uso de API"""
    try:
        result = await api_system.get_usage_stats(api_key)
        return result
    except Exception as e:
        logger.error(f"Error getting usage stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/public-api/tiers")
async def get_api_tiers():
    """Obtener información de tiers de API"""
    return {
        "success": True,
        "tiers": {
            "free": {
                "rate_limit": 100,
                "price": 0,
                "features": ["Basic endpoints", "100 requests/hour"]
            },
            "basic": {
                "rate_limit": 1000,
                "price": 9.99,
                "features": ["All endpoints", "1000 requests/hour", "Email support"]
            },
            "pro": {
                "rate_limit": 10000,
                "price": 49.99,
                "features": ["All endpoints", "10000 requests/hour", "Priority support", "Webhooks"]
            },
            "enterprise": {
                "rate_limit": -1,
                "price": "Custom",
                "features": ["Unlimited requests", "Dedicated support", "Custom integrations", "SLA"]
            }
        }
    }
