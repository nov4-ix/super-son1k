#!/usr/bin/env python3
"""
🎤 Clone Station Endpoints
API para clonación vocal profesional con so-VITS, Bark y Waves
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from clone_station_service import CloneStationService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/clone-station", tags=["clone-station"])

# Inicializar servicio
clone_service = CloneStationService()

@router.get("/status")
async def get_clone_station_status():
    """Estado de Clone Station"""
    waves_status = clone_service.validate_waves_connection()
    
    return {
        "status": "active",
        "engines": {
            "so_vits": "ready",
            "bark": "ready"
        },
        "waves_integration": waves_status["status"] if waves_status["success"] else "error",
        "features": [
            "Voice model training",
            "Text-to-speech cloning",
            "Voice transfer to tracks",
            "Professional Waves processing",
            "Multiple export formats"
        ]
    }

@router.post("/train-model")
async def train_voice_model(
    audio_file: UploadFile = File(...),
    model_name: str = "user_voice",
    engine: str = "so-vits"
):
    """Entrenar modelo de voz personalizado"""
    try:
        # Guardar archivo temporal
        temp_path = f"temp/{audio_file.filename}"
        with open(temp_path, "wb") as buffer:
            content = await audio_file.read()
            buffer.write(content)
        
        # Entrenar modelo
        result = await clone_service.train_voice_model(temp_path, model_name, engine)
        
        return result
        
    except Exception as e:
        logger.error(f"Error entrenando modelo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/clone-text")
async def clone_voice_from_text(request: dict):
    """Clonar voz a partir de texto"""
    try:
        model_id = request.get("model_id")
        text = request.get("text")
        settings = request.get("settings", {})
        
        if not model_id or not text:
            raise HTTPException(status_code=400, detail="model_id y text son requeridos")
        
        result = await clone_service.clone_voice_text(model_id, text, settings)
        
        return result
        
    except Exception as e:
        logger.error(f"Error clonando texto: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/transfer-voice")
async def transfer_voice_to_track(
    target_audio: UploadFile = File(...),
    model_id: str = None,
    settings: dict = None
):
    """Transferir voz clonada a una pista existente"""
    try:
        if not model_id:
            raise HTTPException(status_code=400, detail="model_id es requerido")
        
        # Guardar archivo temporal
        temp_path = f"temp/{target_audio.filename}"
        with open(temp_path, "wb") as buffer:
            content = await target_audio.read()
            buffer.write(content)
        
        # Transferir voz
        result = await clone_service.transfer_voice_to_track(model_id, temp_path, settings or {})
        
        return result
        
    except Exception as e:
        logger.error(f"Error transfiriendo voz: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/apply-waves-effects")
async def apply_waves_effects(request: dict):
    """Aplicar efectos profesionales Waves"""
    try:
        audio_path = request.get("audio_path")
        effects_config = request.get("effects", {})
        
        if not audio_path:
            raise HTTPException(status_code=400, detail="audio_path es requerido")
        
        result = await clone_service.apply_waves_effects(audio_path, effects_config)
        
        return result
        
    except Exception as e:
        logger.error(f"Error aplicando efectos Waves: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/waves/plugins")
async def get_waves_plugins():
    """Obtener información de plugins Waves disponibles"""
    return {
        "success": True,
        "plugins": clone_service.waves_plugins
    }

@router.get("/waves/validate")
async def validate_waves_connection():
    """Validar conexión con Waves"""
    return clone_service.validate_waves_connection()

@router.get("/presets")
async def get_effect_presets():
    """Obtener presets de efectos"""
    return {
        "success": True,
        "presets": clone_service.get_effect_presets()
    }

@router.get("/engines")
async def get_voice_engines():
    """Obtener información de motores de clonación"""
    return {
        "success": True,
        "engines": clone_service.voice_engines
    }
