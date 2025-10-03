#!/usr/bin/env python3
"""
🎨 UX Enhancement API Endpoints
Endpoints para el sistema de mejora de experiencia de usuario
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import logging
from ux_enhancement_system import ux_enhancer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ux", tags=["UX Enhancement"])

# Modelos de datos
class TutorialStartRequest(BaseModel):
    tutorial_name: str
    user_id: Optional[str] = "default"

class ShortcutRequest(BaseModel):
    shortcut: str
    component: str
    context: str

class FileDropRequest(BaseModel):
    files: List[Dict[str, Any]]
    target_element: str
    component: str

# Endpoints de tutoriales
@router.post("/start-tutorial")
async def start_tutorial(request: TutorialStartRequest):
    """Iniciar un tutorial interactivo"""
    try:
        result = ux_enhancer.start_tutorial(request.tutorial_name, request.user_id)
        return result
    except Exception as e:
        logger.error(f"Error starting tutorial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/next-tutorial-step")
async def next_tutorial_step(user_id: str = "default"):
    """Avanzar al siguiente paso del tutorial"""
    try:
        result = ux_enhancer.next_tutorial_step(user_id)
        return result
    except Exception as e:
        logger.error(f"Error advancing tutorial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/previous-tutorial-step")
async def previous_tutorial_step(user_id: str = "default"):
    """Retroceder al paso anterior del tutorial"""
    try:
        result = ux_enhancer.previous_tutorial_step(user_id)
        return result
    except Exception as e:
        logger.error(f"Error going back in tutorial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/complete-tutorial")
async def complete_tutorial(user_id: str = "default"):
    """Completar tutorial actual"""
    try:
        result = ux_enhancer.complete_tutorial(user_id)
        return result
    except Exception as e:
        logger.error(f"Error completing tutorial: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tutorial-progress")
async def get_tutorial_progress(user_id: str = "default"):
    """Obtener progreso del tutorial"""
    try:
        progress = ux_enhancer.get_tutorial_progress(user_id)
        return {"success": True, "progress": progress}
    except Exception as e:
        logger.error(f"Error getting tutorial progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de shortcuts
@router.get("/keyboard-shortcuts")
async def get_keyboard_shortcuts():
    """Obtener lista de shortcuts de teclado"""
    try:
        shortcuts = ux_enhancer.get_keyboard_shortcuts_help()
        return shortcuts
    except Exception as e:
        logger.error(f"Error getting shortcuts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/handle-shortcut")
async def handle_shortcut(request: ShortcutRequest):
    """Manejar ejecución de shortcut"""
    try:
        result = ux_enhancer.handle_keyboard_shortcut(
            request.shortcut,
            request.context
        )
        return result
    except Exception as e:
        logger.error(f"Error handling shortcut: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de drag & drop
@router.get("/drag-drop-config")
async def get_drag_drop_config():
    """Obtener configuración de drag & drop"""
    try:
        config = ux_enhancer.get_drag_drop_config()
        return config
    except Exception as e:
        logger.error(f"Error getting drag & drop config: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de preview en tiempo real
@router.post("/update-preview")
async def update_preview(component_id: str, data: Dict[str, Any], debounce: bool = True):
    """Actualizar preview en tiempo real"""
    try:
        result = await ux_enhancer.update_realtime_preview(component_id, data, debounce)
        return result
    except Exception as e:
        logger.error(f"Error updating preview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de utilidades
@router.get("/tips/{component_name}")
async def get_component_tips(component_name: str):
    """Obtener tips para un componente específico"""
    try:
        from ux_enhancement_system import get_ux_tips_for_component
        tips = get_ux_tips_for_component(component_name)
        return {"success": True, "tips": tips, "component": component_name}
    except Exception as e:
        logger.error(f"Error getting tips: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate-input")
async def validate_input(input_data: Dict[str, Any], validation_rules: Dict[str, Any]):
    """Validar entrada del usuario"""
    try:
        from ux_enhancement_system import validate_user_input
        result = validate_user_input(input_data, validation_rules)
        return result
    except Exception as e:
        logger.error(f"Error validating input: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset-tutorial-progress")
async def reset_tutorial_progress(user_id: str = "default"):
    """Reiniciar progreso de tutoriales"""
    try:
        result = ux_enhancer.reset_tutorial_progress(user_id)
        return result
    except Exception as e:
        logger.error(f"Error resetting tutorial progress: {e}")
        raise HTTPException(status_code=500, detail=str(e))
