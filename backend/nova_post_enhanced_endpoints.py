#!/usr/bin/env python3
"""
🚀 Nova Post Enhanced Endpoints - Sistema Completo de Publicación Automática
Integración de análisis de algoritmos, calendarización y publicación automática
"""

import os
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
import asyncio

# Importar servicios
from services.social_media_analyzer import (
    social_analyzer, 
    analyze_social_media_algorithm,
    generate_optimal_content_for_platform
)
from services.auto_posting_system import (
    auto_posting_system,
    schedule_music_post,
    get_scheduled_posts
)

logger = logging.getLogger(__name__)

# Router para Nova Post Enhanced
router = APIRouter(prefix="/api/nova-post", tags=["Nova Post Enhanced"])

# Modelos Pydantic
class AlgorithmAnalysisRequest(BaseModel):
    platform: str
    user_data: Optional[Dict] = None

class ContentOptimizationRequest(BaseModel):
    platform: str
    content_data: Dict
    user_preferences: Optional[Dict] = None

class SchedulePostRequest(BaseModel):
    platform: str
    content_data: Dict
    scheduled_time: Optional[str] = None
    user_preferences: Optional[Dict] = None

class MultiPlatformScheduleRequest(BaseModel):
    platforms: List[str]
    content_data: Dict
    scheduled_time: Optional[str] = None
    user_preferences: Optional[Dict] = None

class PlatformCredentialsRequest(BaseModel):
    platform: str
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[str] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None

# Endpoints principales

@router.post("/analyze-algorithm")
async def analyze_algorithm(request: AlgorithmAnalysisRequest):
    """
    🔍 Analizar algoritmo de plataforma específica con Qwen 2.5
    """
    try:
        result = await analyze_social_media_algorithm(
            request.platform, 
            request.user_data
        )
        
        if result["success"]:
            return {
                "success": True,
                "platform": request.platform,
                "analysis": result["insight"],
                "analyzed_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error analizando algoritmo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize-content")
async def optimize_content(request: ContentOptimizationRequest):
    """
    🎯 Optimizar contenido para plataforma específica
    """
    try:
        result = await generate_optimal_content_for_platform(
            request.platform,
            request.content_data
        )
        
        if result["success"]:
            return {
                "success": True,
                "platform": request.platform,
                "optimized_content": result["optimal_content"],
                "optimized_at": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error optimizando contenido: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-post")
async def schedule_post(request: SchedulePostRequest):
    """
    📅 Programar post para publicación automática
    """
    try:
        result = await schedule_music_post(
            request.platform,
            request.content_data,
            request.scheduled_time
        )
        
        if result["success"]:
            return {
                "success": True,
                "post_id": result["post_id"],
                "platform": request.platform,
                "scheduled_time": result["scheduled_time"],
                "algorithm_score": result["algorithm_score"],
                "hashtags": result["hashtags"],
                "message": result["message"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error programando post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-multi-platform")
async def schedule_multi_platform(request: MultiPlatformScheduleRequest):
    """
    🌐 Programar post en múltiples plataformas simultáneamente
    """
    try:
        results = []
        
        for platform in request.platforms:
            result = await schedule_music_post(
                platform,
                request.content_data,
                request.scheduled_time
            )
            results.append({
                "platform": platform,
                "result": result
            })
        
        successful_platforms = [r for r in results if r["result"]["success"]]
        failed_platforms = [r for r in results if not r["result"]["success"]]
        
        return {
            "success": len(successful_platforms) > 0,
            "total_platforms": len(request.platforms),
            "successful": len(successful_platforms),
            "failed": len(failed_platforms),
            "results": results,
            "scheduled_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error programando multi-plataforma: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/scheduled-posts")
async def get_scheduled_posts_endpoint(platform: Optional[str] = None):
    """
    📋 Obtener posts programados
    """
    try:
        result = await get_scheduled_posts(platform)
        
        if result["success"]:
            return {
                "success": True,
                "posts": result["posts"],
                "count": result["count"],
                "platform_filter": platform
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error obteniendo posts programados: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/cancel-post/{post_id}")
async def cancel_scheduled_post(post_id: str):
    """
    ❌ Cancelar post programado
    """
    try:
        result = await auto_posting_system.cancel_scheduled_post(post_id)
        
        if result["success"]:
            return {
                "success": True,
                "post_id": post_id,
                "message": result["message"]
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error cancelando post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/set-credentials")
async def set_platform_credentials(request: PlatformCredentialsRequest):
    """
    🔑 Configurar credenciales de plataforma
    """
    try:
        # Guardar credenciales en base de datos
        conn = auto_posting_system.db_path
        import sqlite3
        
        conn_db = sqlite3.connect(conn)
        cursor = conn_db.cursor()
        
        cursor.execute("""
            INSERT OR REPLACE INTO platform_credentials 
            (platform, access_token, refresh_token, expires_at, api_key, api_secret, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            request.platform,
            request.access_token,
            request.refresh_token,
            request.expires_at,
            request.api_key,
            request.api_secret,
            datetime.now().isoformat()
        ))
        
        conn_db.commit()
        conn_db.close()
        
        return {
            "success": True,
            "platform": request.platform,
            "message": "Credenciales configuradas exitosamente",
            "updated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error configurando credenciales: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending-analysis/{platform}")
async def get_trending_analysis(platform: str, category: str = "music"):
    """
    📈 Obtener análisis de tendencias para plataforma
    """
    try:
        from services.social_media_analyzer import Platform
        platform_enum = Platform(platform.lower())
        
        result = await social_analyzer.get_trending_analysis(platform_enum, category)
        
        return {
            "success": True,
            "platform": platform,
            "category": category,
            "trending_analysis": result,
            "analyzed_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo análisis de tendencias: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bulk-optimize")
async def bulk_optimize_content(platforms: List[str], content_data: Dict):
    """
    🚀 Optimizar contenido para múltiples plataformas
    """
    try:
        results = []
        
        for platform in platforms:
            result = await generate_optimal_content_for_platform(
                platform,
                content_data
            )
            results.append({
                "platform": platform,
                "result": result
            })
        
        return {
            "success": True,
            "platforms": platforms,
            "results": results,
            "optimized_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error en optimización masiva: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/algorithm-insights")
async def get_algorithm_insights(platform: Optional[str] = None):
    """
    🧠 Obtener insights de algoritmos almacenados
    """
    try:
        import sqlite3
        
        conn = sqlite3.connect(auto_posting_system.db_path)
        cursor = conn.cursor()
        
        query = "SELECT * FROM algorithm_analysis WHERE 1=1"
        params = []
        
        if platform:
            query += " AND platform = ?"
            params.append(platform)
        
        query += " ORDER BY created_at DESC LIMIT 50"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        insights = []
        for row in rows:
            insights.append({
                "id": row[0],
                "platform": row[1],
                "analysis_data": json.loads(row[2]),
                "algorithm_score": row[3],
                "created_at": row[4]
            })
        
        return {
            "success": True,
            "insights": insights,
            "count": len(insights),
            "platform_filter": platform
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo insights: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/smart-schedule")
async def smart_schedule_post(request: MultiPlatformScheduleRequest):
    """
    🤖 Programación inteligente con análisis automático de algoritmos
    """
    try:
        # Analizar algoritmos de todas las plataformas
        algorithm_insights = {}
        for platform in request.platforms:
            analysis = await analyze_social_media_algorithm(platform)
            if analysis["success"]:
                algorithm_insights[platform] = analysis["insight"]
        
        # Calcular horarios óptimos
        optimal_times = {}
        for platform, insight in algorithm_insights.items():
            optimal_times[platform] = insight.get("optimal_times", ["12:00"])[0]
        
        # Programar posts con horarios optimizados
        results = []
        for platform in request.platforms:
            optimal_time = optimal_times.get(platform, "12:00")
            
            # Calcular datetime óptimo
            hour, minute = map(int, optimal_time.split(":"))
            tomorrow = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)
            if tomorrow <= datetime.now():
                tomorrow += timedelta(days=1)
            
            result = await schedule_music_post(
                platform,
                request.content_data,
                tomorrow.isoformat()
            )
            
            results.append({
                "platform": platform,
                "optimal_time": optimal_time,
                "scheduled_time": tomorrow.isoformat(),
                "algorithm_score": algorithm_insights.get(platform, {}).get("algorithm_score", 75.0),
                "result": result
            })
        
        return {
            "success": True,
            "smart_scheduling": True,
            "algorithm_insights": algorithm_insights,
            "optimal_times": optimal_times,
            "results": results,
            "scheduled_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error en programación inteligente: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/system-status")
async def get_system_status():
    """
    📊 Estado del sistema Nova Post Enhanced
    """
    try:
        # Obtener estadísticas
        posts_result = await get_scheduled_posts()
        total_posts = posts_result.get("count", 0) if posts_result.get("success") else 0
        
        # Obtener posts por estado
        scheduled_posts = await auto_posting_system.get_scheduled_posts(status="scheduled")
        published_posts = await auto_posting_system.get_scheduled_posts(status="published")
        failed_posts = await auto_posting_system.get_scheduled_posts(status="failed")
        
        return {
            "success": True,
            "system_status": "operational",
            "scheduler_running": auto_posting_system.scheduler_running,
            "statistics": {
                "total_posts": total_posts,
                "scheduled": len(scheduled_posts),
                "published": len(published_posts),
                "failed": len(failed_posts)
            },
            "supported_platforms": ["instagram", "tiktok", "youtube", "twitter"],
            "features": [
                "algorithm_analysis",
                "content_optimization",
                "auto_scheduling",
                "multi_platform_posting",
                "trending_analysis",
                "smart_scheduling"
            ],
            "checked_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo estado del sistema: {e}")
        return {
            "success": False,
            "error": str(e),
            "system_status": "error"
        }

# Endpoint de prueba
@router.get("/test")
async def test_nova_post_enhanced():
    """
    🧪 Endpoint de prueba para Nova Post Enhanced
    """
    return {
        "success": True,
        "message": "Nova Post Enhanced funcionando correctamente",
        "version": "2.0.0",
        "features": [
            "Análisis de algoritmos con Qwen 2.5",
            "Optimización de contenido automática",
            "Programación inteligente de posts",
            "Publicación multi-plataforma",
            "Análisis de tendencias",
            "Sistema de credenciales",
            "Monitoreo en tiempo real"
        ],
        "timestamp": datetime.now().isoformat()
    }

