"""
Endpoints para el sistema de moderación de contenido
Protege la creatividad y los sentimientos de los creadores
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.content_moderation import moderate_content, content_moderator, ModerationAction

router = APIRouter(prefix="/api/moderation", tags=["moderation"])

class ModerationRequest(BaseModel):
    content: str
    content_type: str = "comment"  # comment, post, chat
    user_id: Optional[str] = None

class ModerationResponse(BaseModel):
    action: str
    confidence: float
    reason: str
    detected_patterns: list
    suggested_replacement: Optional[str] = None
    is_approved: bool
    requires_action: bool

class BanUserRequest(BaseModel):
    user_id: str
    reason: str

class CensorContentRequest(BaseModel):
    content_id: str
    replacement_text: Optional[str] = None

@router.post("/moderate", response_model=ModerationResponse)
async def moderate_content_endpoint(request: ModerationRequest):
    """
    Modera contenido (comentarios, posts, mensajes de chat)
    """
    try:
        result = await moderate_content(
            content=request.content,
            content_type=request.content_type,
            user_id=request.user_id
        )
        
        return ModerationResponse(
            action=result.action.value,
            confidence=result.confidence,
            reason=result.reason,
            detected_patterns=result.detected_patterns,
            suggested_replacement=result.suggested_replacement,
            is_approved=result.action == ModerationAction.APPROVE,
            requires_action=result.action in [ModerationAction.CENSOR, ModerationAction.BAN]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error moderando contenido: {str(e)}")

@router.get("/guidelines")
async def get_moderation_guidelines():
    """
    Obtiene las pautas de moderación para mostrar a los usuarios
    """
    try:
        guidelines = content_moderator.get_moderation_guidelines()
        return guidelines
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo pautas: {str(e)}")

@router.get("/history/{user_id}")
async def get_user_moderation_history(user_id: str):
    """
    Obtiene el historial de moderación de un usuario
    """
    try:
        history = await content_moderator.get_user_moderation_history(user_id)
        return history
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo historial: {str(e)}")

@router.post("/ban")
async def ban_user(request: BanUserRequest):
    """
    Banea a un usuario permanentemente
    """
    try:
        success = await content_moderator.ban_user(request.user_id, request.reason)
        
        if success:
            return {
                "success": True,
                "message": f"Usuario {request.user_id} baneado permanentemente",
                "reason": request.reason
            }
        else:
            raise HTTPException(status_code=400, detail="No se pudo banear al usuario")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error baneando usuario: {str(e)}")

@router.post("/censor")
async def censor_content(request: CensorContentRequest):
    """
    Censura contenido específico
    """
    try:
        success = await content_moderator.censor_content(
            request.content_id, 
            request.replacement_text
        )
        
        if success:
            return {
                "success": True,
                "message": f"Contenido {request.content_id} censurado",
                "replacement": request.replacement_text
            }
        else:
            raise HTTPException(status_code=400, detail="No se pudo censurar el contenido")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error censurando contenido: {str(e)}")

@router.get("/stats")
async def get_moderation_stats():
    """
    Obtiene estadísticas de moderación
    """
    try:
        # En una implementación real, esto consultaría la base de datos
        stats = {
            "total_moderated": 0,
            "approved": 0,
            "warned": 0,
            "censored": 0,
            "banned": 0,
            "destructive_patterns_detected": 0,
            "spam_patterns_detected": 0,
            "toxic_patterns_detected": 0,
            "constructive_patterns_detected": 0
        }
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas: {str(e)}")

@router.post("/test-patterns")
async def test_moderation_patterns(content: str):
    """
    Endpoint para probar patrones de moderación (solo para desarrollo)
    """
    try:
        # Probar todos los tipos de contenido
        comment_result = await moderate_content(content, "comment")
        post_result = await moderate_content(content, "post")
        chat_result = await moderate_content(content, "chat")
        
        return {
            "original_content": content,
            "comment_moderation": {
                "action": comment_result.action.value,
                "confidence": comment_result.confidence,
                "reason": comment_result.reason,
                "detected_patterns": comment_result.detected_patterns
            },
            "post_moderation": {
                "action": post_result.action.value,
                "confidence": post_result.confidence,
                "reason": post_result.reason,
                "detected_patterns": post_result.detected_patterns
            },
            "chat_moderation": {
                "action": chat_result.action.value,
                "confidence": chat_result.confidence,
                "reason": chat_result.reason,
                "detected_patterns": chat_result.detected_patterns
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error probando patrones: {str(e)}")

