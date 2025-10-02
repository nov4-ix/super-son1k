#!/usr/bin/env python3
"""
🚀 Son1kVers3 Enhanced - Nova Post Enhanced Endpoints
Sistema avanzado de publicación en redes sociales con IA Qwen
"""

from fastapi import APIRouter, HTTPException
from nova_post_pilot_service import NovaPostPilotService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/nova-post", tags=["nova-post"])

# Inicializar servicio
nova_pilot = NovaPostPilotService()

@router.get("/status")
async def get_nova_post_status():
    """Estado del sistema Nova Post"""
    return {
        "status": "active",
        "ai_engine": "qwen2.5",
        "social_platforms": ["instagram", "twitter", "tiktok", "youtube", "linkedin"],
        "auto_posting": "enabled",
        "features": [
            "Market analysis with AI",
            "Viral hooks generation", 
            "Optimal timing calculation",
            "Automated publishing",
            "Engagement tracking"
        ]
    }

@router.post("/analyze-market")
async def analyze_market(content_profile: dict):
    """Analizar mercado con IA Qwen"""
    try:
        analysis = await nova_pilot.analyze_market_with_qwen(content_profile)
        return {
            "success": True,
            "analysis": analysis
        }
    except Exception as e:
        logger.error(f"Error en análisis de mercado: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-hooks")
async def generate_viral_hooks(request: dict):
    """Generar ganchos virales especializados"""
    try:
        content_profile = request.get("content_profile", {})
        market_analysis = request.get("market_analysis", {})
        
        hooks = await nova_pilot.generate_viral_hooks(content_profile, market_analysis)
        
        return {
            "success": True,
            "hooks": hooks
        }
    except Exception as e:
        logger.error(f"Error generando ganchos: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/calculate-times")
async def calculate_optimal_times(request: dict):
    """Calcular horarios óptimos personalizados"""
    try:
        content_profile = request.get("content_profile", {})
        timezone = request.get("timezone", "UTC-5")
        
        times = await nova_pilot.calculate_optimal_times(content_profile, timezone)
        
        return {
            "success": True,
            "optimal_times": times
        }
    except Exception as e:
        logger.error(f"Error calculando horarios: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-post")
async def schedule_post(request: dict):
    """Programar publicación"""
    try:
        platform = request.get("platform")
        content = request.get("content")
        datetime_str = request.get("datetime")
        user_id = request.get("user_id", "anonymous")
        
        result = await nova_pilot.schedule_post(platform, content, datetime_str, user_id)
        
        return result
    except Exception as e:
        logger.error(f"Error programando post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/publish/{post_id}")
async def publish_scheduled_post(post_id: str):
    """Publicar post programado"""
    try:
        result = await nova_pilot.publish_post(post_id)
        return result
    except Exception as e:
        logger.error(f"Error publicando post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/algorithms")
async def get_social_algorithms():
    """Obtener información de algoritmos de redes sociales"""
    return {
        "success": True,
        "algorithms": nova_pilot.social_algorithms
    }