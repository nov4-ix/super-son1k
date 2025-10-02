#!/usr/bin/env python3
"""
🌐 Translation Endpoints - Endpoints para Traducción Automática
Integración con el servicio de traducción automática para Suno
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

from .services.auto_translation_service import auto_translation_service, process_prompt_for_suno, get_spanish_prompt_buttons
from .prompt_translator import auto_translate_for_suno

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/translation", tags=["translation"])

class PromptTranslationRequest(BaseModel):
    prompt: str
    show_translation: Optional[bool] = False

class BatchTranslationRequest(BaseModel):
    prompts: List[str]

class TranslationResponse(BaseModel):
    success: bool
    original: str
    translated: str
    cached: Optional[bool] = False
    already_english: Optional[bool] = False
    error: Optional[str] = None

@router.post("/prompt", response_model=TranslationResponse)
async def translate_prompt(request: PromptTranslationRequest):
    """
    Traducir un prompt de español a inglés para Suno
    El usuario ve el prompt original, pero se envía traducido a Suno
    """
    try:
        result = process_prompt_for_suno(request.prompt, request.show_translation)
        
        return TranslationResponse(
            success=result["success"],
            original=result["original"],
            translated=result["translated"],
            cached=result.get("predefined", False),
            already_english=False,
            error=result.get("error")
        )
        
    except Exception as e:
        logger.error(f"Error en traducción de prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/batch", response_model=List[TranslationResponse])
async def translate_batch_prompts(request: BatchTranslationRequest):
    """Traducir múltiples prompts en lote"""
    try:
        results = auto_translation_service.process_batch_prompts(request.prompts)
        
        return [
            TranslationResponse(
                success=result["success"],
                original=result["original"],
                translated=result["translated"],
                cached=result.get("predefined", False),
                error=result.get("error")
            )
            for result in results
        ]
        
    except Exception as e:
        logger.error(f"Error en traducción en lote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/spanish-buttons")
async def get_spanish_buttons():
    """
    Obtener botones de prompts predefinidos en español
    Para mostrar en la interfaz de usuario
    """
    try:
        buttons = get_spanish_prompt_buttons()
        
        return {
            "success": True,
            "buttons": buttons,
            "count": len(buttons)
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo botones en español: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/suggestions/{category}")
async def get_prompt_suggestions(category: str):
    """
    Obtener sugerencias de prompts por categoría
    Categorías: generos, emociones, instrumentos, all
    """
    try:
        suggestions = auto_translation_service.get_spanish_prompt_suggestions(category)
        
        return {
            "success": True,
            "category": category,
            "suggestions": suggestions,
            "count": len(suggestions)
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo sugerencias: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/add-custom")
async def add_custom_translation(spanish: str, english: str):
    """Agregar traducción personalizada al sistema"""
    try:
        success = auto_translation_service.add_custom_translation(spanish, english)
        
        if success:
            return {
                "success": True,
                "message": f"Traducción agregada: '{spanish}' -> '{english}'"
            }
        else:
            raise HTTPException(status_code=400, detail="Error agregando traducción personalizada")
            
    except Exception as e:
        logger.error(f"Error agregando traducción personalizada: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_translation_stats():
    """Obtener estadísticas del servicio de traducción"""
    try:
        stats = auto_translation_service.get_translation_stats()
        
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo estadísticas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint de conveniencia para integración directa con Suno
@router.post("/for-suno")
async def translate_for_suno(prompt: str):
    """
    Endpoint optimizado para integración directa con Suno
    Devuelve solo el prompt traducido, sin metadatos
    """
    try:
        translated_prompt = auto_translate_for_suno(prompt)
        
        return {
            "success": True,
            "prompt": translated_prompt
        }
        
    except Exception as e:
        logger.error(f"Error en traducción para Suno: {e}")
        return {
            "success": False,
            "prompt": prompt,  # Fallback al original
            "error": str(e)
        }

# Middleware para logging de traducciones
@router.middleware("http")
async def log_translations(request, call_next):
    """Log de todas las traducciones para análisis"""
    response = await call_next(request)
    
    # Log solo para endpoints de traducción
    if request.url.path.startswith("/api/translation/"):
        logger.info(f"Translation request: {request.method} {request.url.path}")
    
    return response
