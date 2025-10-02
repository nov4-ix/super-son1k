#!/usr/bin/env python3
"""
🎵 The Creator Endpoints
API para la herramienta principal de generación musical
"""

from fastapi import APIRouter, HTTPException
from the_creator_service import TheCreatorService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/the-creator", tags=["the-creator"])

# Inicializar servicio
creator_service = TheCreatorService()

@router.get("/status")
async def get_creator_status():
    """Estado de The Creator"""
    return {
        "status": "active",
        "version": "2.0 Pro",
        "features": [
            "Intelligent lyrics generation with Qwen AI",
            "Literary resources control (metaphor, personification, etc.)",
            "Lyrics improvement and optimization",
            "Style-based prompt generation",
            "Random creative prompts",
            "Automatic Spanish to English translation",
            "Suno API integration",
            "Complete music generation workflow"
        ],
        "integrations": {
            "qwen_ai": "connected",
            "suno_api": "ready",
            "translation_service": "active"
        },
        "literary_resources": list(creator_service.literary_resources.keys())
    }

@router.post("/generate-lyrics")
async def generate_lyrics(request: dict):
    """Generar letras con recursos literarios usando Qwen"""
    try:
        config = {
            "theme": request.get("theme", ""),
            "mood": request.get("mood", "neutral"),
            "language": request.get("language", "spanish"),
            "length": request.get("length", "medium"),
            "expressiveness": request.get("expressiveness", 50),
            "literary_resources": request.get("literary_resources", {})
        }
        
        if not config["theme"]:
            raise HTTPException(status_code=400, detail="theme es requerido")
        
        result = await creator_service.generate_lyrics_with_qwen(config)
        
        return result
        
    except Exception as e:
        logger.error(f"Error generando letras: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/improve-lyrics")
async def improve_lyrics(request: dict):
    """Mejorar letras existentes"""
    try:
        original_lyrics = request.get("original_lyrics", "")
        improvements = request.get("improvements", [])
        expressiveness = request.get("expressiveness", 50)
        
        if not original_lyrics:
            raise HTTPException(status_code=400, detail="original_lyrics es requerido")
        
        result = await creator_service.improve_lyrics(original_lyrics, improvements, expressiveness)
        
        return result
        
    except Exception as e:
        logger.error(f"Error mejorando letras: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-prompt")
async def generate_prompt_from_style(request: dict):
    """Generar prompt basado en estilo musical"""
    try:
        style = request.get("style", "")
        title = request.get("title", "")
        has_lyrics = request.get("has_lyrics", False)
        
        if not style:
            raise HTTPException(status_code=400, detail="style es requerido")
        
        result = await creator_service.generate_prompt_from_style(style, title, has_lyrics)
        
        return result
        
    except Exception as e:
        logger.error(f"Error generando prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/random-prompt")
async def generate_random_prompt(request: dict):
    """Generar prompt aleatorio creativo"""
    try:
        style = request.get("style", "any")
        creativity_level = request.get("creativity_level", "high")
        
        result = await creator_service.generate_random_creative_prompt(style)
        
        return result
        
    except Exception as e:
        logger.error(f"Error generando prompt aleatorio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-music")
async def generate_complete_music(request: dict):
    """Generar música completa con The Creator"""
    try:
        config = request.get("config", {})
        lyrics_config = request.get("lyrics_config", {})
        
        if not config.get("style") and not config.get("customPrompt"):
            raise HTTPException(status_code=400, detail="style o customPrompt es requerido")
        
        result = await creator_service.generate_complete_music(config, lyrics_config)
        
        return result
        
    except Exception as e:
        logger.error(f"Error generando música: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/styles")
async def get_musical_styles():
    """Obtener estilos musicales disponibles"""
    return {
        "success": True,
        "styles": creator_service.get_musical_styles()
    }

@router.get("/themes")
async def get_random_themes():
    """Obtener temas aleatorios para letras"""
    return {
        "success": True,
        "themes": creator_service.get_random_themes()
    }

@router.get("/literary-resources")
async def get_literary_resources():
    """Obtener información de recursos literarios"""
    return {
        "success": True,
        "resources": creator_service.get_literary_resources_info()
    }
