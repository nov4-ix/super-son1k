#!/usr/bin/env python3
"""
👻 Ghost Studio Endpoints
API para la herramienta que democratiza la música
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from ghost_studio_service import GhostStudioService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ghost-studio", tags=["ghost-studio"])

# Inicializar servicio
ghost_service = GhostStudioService()

@router.get("/status")
async def get_ghost_studio_status():
    """Estado de Ghost Studio"""
    return {
        "status": "active",
        "version": "2.0 Pro",
        "features": [
            "Intelligent audio analysis",
            "Genre, BPM, and key detection", 
            "Arrangement suggestions",
            "Characteristic knobs (expresividad, rareza, trash, etc.)",
            "Automatic prompt translation to English",
            "Suno API integration",
            "Professional post-processing"
        ],
        "analysis_models": {
            "genre_classifier": "ready",
            "bpm_detector": "ready", 
            "key_detector": "ready",
            "structure_analyzer": "ready"
        },
        "integrations": {
            "suno_api": "connected",
            "translation_service": "ready",
            "post_processing": "active"
        }
    }

@router.post("/analyze")
async def analyze_audio_track(
    audio: UploadFile = File(...),
    settings: str = "{}"
):
    """Analizar pista de audio con IA"""
    try:
        # Validar archivo
        temp_path = f"temp/{audio.filename}"
        with open(temp_path, "wb") as buffer:
            content = await audio.read()
            buffer.write(content)
        
        # Validar archivo
        validation = ghost_service.validate_audio_file(temp_path)
        if not validation["valid"]:
            raise HTTPException(status_code=400, detail=validation["error"])
        
        # Parsear configuración
        import json
        analysis_settings = json.loads(settings)
        
        # Analizar
        result = await ghost_service.analyze_audio_track(temp_path, analysis_settings)
        
        return result
        
    except Exception as e:
        logger.error(f"Error analizando audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate")
async def generate_professional_track(request: dict):
    """Generar pista profesional con Ghost Studio"""
    try:
        original_analysis = request.get("original_analysis", {})
        arrangement_knobs = request.get("arrangement_knobs", {})
        analysis_settings = request.get("analysis_settings", {})
        custom_prompt = request.get("prompt")
        translate_to_english = request.get("translate_to_english", True)
        
        if not original_analysis:
            raise HTTPException(status_code=400, detail="original_analysis es requerido")
        
        result = await ghost_service.generate_professional_track(
            original_analysis,
            arrangement_knobs,
            analysis_settings,
            custom_prompt
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error generando pista: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate-prompt")
async def translate_prompt(request: dict):
    """Traducir prompt al inglés para Suno"""
    try:
        spanish_prompt = request.get("prompt", "")
        
        if not spanish_prompt:
            raise HTTPException(status_code=400, detail="prompt es requerido")
        
        english_prompt = await ghost_service._translate_prompt_to_english(spanish_prompt)
        
        return {
            "success": True,
            "original_prompt": spanish_prompt,
            "english_prompt": english_prompt
        }
        
    except Exception as e:
        logger.error(f"Error traduciendo prompt: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/knobs/descriptions")
async def get_knob_descriptions():
    """Obtener descripciones de las perillas características"""
    return {
        "success": True,
        "knobs": ghost_service.get_knob_descriptions()
    }

@router.get("/presets/analysis")
async def get_analysis_presets():
    """Obtener presets de análisis"""
    return {
        "success": True,
        "presets": ghost_service.get_analysis_presets()
    }

@router.post("/validate-audio")
async def validate_audio_file(audio: UploadFile = File(...)):
    """Validar archivo de audio antes de procesamiento"""
    try:
        temp_path = f"temp/{audio.filename}"
        with open(temp_path, "wb") as buffer:
            content = await audio.read()
            buffer.write(content)
        
        validation = ghost_service.validate_audio_file(temp_path)
        
        return {
            "success": validation["valid"],
            "validation": validation
        }
        
    except Exception as e:
        logger.error(f"Error validando audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/examples")
async def get_demo_examples():
    """Obtener ejemplos de maquetas procesadas"""
    return {
        "success": True,
        "examples": [
            {
                "name": "Indie Bedroom Demo",
                "original": "Guitarra + voz grabada en celular",
                "result": "Producción indie completa con batería, bajo y arreglos",
                "knobs_used": {"expresividad": 80, "garage": 90, "vintage": 75}
            },
            {
                "name": "Piano Ballad Sketch", 
                "original": "Piano + melodía tarareada",
                "result": "Balada orquestal con cuerdas y arreglo profesional",
                "knobs_used": {"expresividad": 95, "atmosphere": 85, "vintage": 60}
            },
            {
                "name": "Hip-Hop Beat Idea",
                "original": "Beat básico + línea de bajo",
                "result": "Track de hip-hop completo con samples y efectos",
                "knobs_used": {"groove": 95, "trash": 70, "experimental": 60}
            }
        ]
    }
