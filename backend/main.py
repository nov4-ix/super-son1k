#!/usr/bin/env python3
"""
🎵 Son1kVers3 Enhanced - Backend Principal
Sistema de generación musical avanzado con IA
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import logging
from datetime import datetime

# Importar endpoints de comunidad
from community_endpoints import router as community_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Son1kVers3 Enhanced API",
    description="Sistema de generación musical avanzado con IA",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - Configuración dinámica
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(community_router)

# Importar e incluir nuevos sistemas
from waves_integration import waves_router
from store_system import store_router
from nova_post_enhanced_endpoints import router as nova_post_router
from pixel_assistant_endpoints import router as pixel_router
from content_moderation_endpoints import router as moderation_router
from admin_dashboard import router as admin_router
from auth_endpoints import router as auth_router

app.include_router(waves_router)
app.include_router(store_router)
app.include_router(nova_post_router)
app.include_router(pixel_router)
app.include_router(moderation_router)
app.include_router(admin_router)
app.include_router(auth_router)

# Importar el procesador del CODEX
from codex_processor import init_codex_processor

# Inicializar el procesador del CODEX
codex_processor = init_codex_processor()

# Pixel AI Assistant endpoint
@app.post("/api/pixel/chat")
async def pixel_chat(request: dict):
    """Endpoint para el asistente Pixel con conocimiento del CODEX"""
    try:
        message = request.get("message", "")
        history = request.get("history", [])
        
        # Usar el procesador del CODEX para generar respuesta inteligente
        response = codex_processor.get_pixel_response(message)
        
        return {"response": response}
        
    except Exception as e:
        logger.error(f"Error en pixel chat: {e}")
        return {"response": "Lo siento, hubo un error. Por favor, inténtalo de nuevo."}

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Son1kVers3 Enhanced API v2.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "web_audio": "active",
            "voice_cloning": "active",
            "nova_post_pilot": "active",
            "analytics": "active",
            "stealth_system": "active"
        }
    }

@app.get("/health")
async def health_check():
    """Health check básico"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

@app.get("/health/detailed")
async def detailed_health_check():
    """Health check detallado con verificación de servicios"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "services": {},
        "environment": {},
        "performance": {}
    }
    
    # Verificar servicios críticos
    try:
        # Verificar base de datos de comunidad
        from community_endpoints import get_db_connection
        conn = get_db_connection()
        conn.execute("SELECT 1")
        conn.close()
        health_status["services"]["community_db"] = "healthy"
    except Exception as e:
        health_status["services"]["community_db"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"
    
    # Verificar directorios
    required_dirs = ["uploads", "output", "logs", "models"]
    for dir_name in required_dirs:
        dir_path = os.getenv(f"{dir_name.upper()}_DIR", f"./{dir_name}")
        if os.path.exists(dir_path) and os.access(dir_path, os.W_OK):
            health_status["services"][f"{dir_name}_dir"] = "healthy"
        else:
            health_status["services"][f"{dir_name}_dir"] = "unhealthy"
            health_status["status"] = "degraded"
    
    # Verificar variables de entorno críticas
    critical_env_vars = ["JWT_SECRET_KEY", "CORS_ORIGINS"]
    for var in critical_env_vars:
        if os.getenv(var):
            health_status["environment"][var] = "set"
        else:
            health_status["environment"][var] = "missing"
            health_status["status"] = "degraded"
    
    # Verificar memoria y recursos
    import psutil
    memory = psutil.virtual_memory()
    health_status["performance"] = {
        "memory_usage_percent": memory.percent,
        "memory_available_gb": round(memory.available / (1024**3), 2),
        "cpu_count": psutil.cpu_count()
    }
    
    return health_status

@app.get("/health/ready")
async def readiness_check():
    """Kubernetes readiness probe"""
    try:
        # Verificar que todos los servicios críticos están listos
        from community_endpoints import get_db_connection
        conn = get_db_connection()
        conn.execute("SELECT 1")
        conn.close()
        
        return {"status": "ready", "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service not ready: {str(e)}")

@app.get("/health/live")
async def liveness_check():
    """Kubernetes liveness probe"""
    return {"status": "alive", "timestamp": datetime.now().isoformat()}

# API endpoints
@app.get("/api/status")
async def get_status():
    return {
        "status": "online",
        "services": {
            "web_audio_generator": "ready",
            "voice_cloning": "ready",
            "nova_post_pilot": "ready",
            "analytics": "ready",
            "stealth_system": "ready"
        },
        "features": [
            "Real-time music generation",
            "Voice cloning with so-VITS & Bark",
            "AI-powered social media analysis",
            "Real-time analytics",
            "Stealth system with account rotation"
        ]
    }

# Music generation endpoints
@app.post("/api/music/generate")
async def generate_music(request: dict):
    """Generate music using Web Audio API"""
    try:
        # This would integrate with the WebAudioGenerator service
        return {
            "success": True,
            "message": "Music generation endpoint ready",
            "audio_url": "/api/audio/generated_track.wav"
        }
    except Exception as e:
        logger.error(f"Music generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Voice cloning endpoints
@app.post("/api/voice/clone")
async def clone_voice(request: dict):
    """Clone voice using so-VITS or Bark"""
    try:
        # This would integrate with the VoiceCloningService
        return {
            "success": True,
            "message": "Voice cloning endpoint ready",
            "audio_url": "/api/audio/cloned_voice.wav"
        }
    except Exception as e:
        logger.error(f"Voice cloning error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Social media endpoints
@app.post("/api/social/analyze")
async def analyze_social_media(request: dict):
    """Analyze social media with Nova Post Pilot"""
    try:
        # This would integrate with the NovaPostPilotService
        return {
            "success": True,
            "message": "Social media analysis endpoint ready",
            "analysis": {
                "engagement_rate": 4.8,
                "optimal_posting_times": ["6-9 PM", "8-10 PM"],
                "trending_topics": ["#AIMusic", "#MusicTech"]
            }
        }
    except Exception as e:
        logger.error(f"Social media analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Analytics endpoints
@app.get("/api/analytics/dashboard")
async def get_analytics_dashboard():
    """Get analytics dashboard data"""
    try:
        # This would integrate with the AnalyticsService
        return {
            "success": True,
            "message": "Analytics dashboard endpoint ready",
            "metrics": {
                "total_plays": 1250,
                "engagement_rate": 4.8,
                "growth_rate": 15.2
            }
        }
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Stealth system endpoints
@app.get("/api/stealth/status")
async def get_stealth_status():
    """Get stealth system status"""
    try:
        # This would integrate with the StealthSystem
        return {
            "success": True,
            "message": "Stealth system endpoint ready",
            "status": {
                "active_accounts": 3,
                "rotation_enabled": True,
                "stealth_level": 8
            }
        }
    except Exception as e:
        logger.error(f"Stealth system error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Get configuration from environment variables
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    logger.info(f"Starting Son1kVers3 Enhanced API on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    
    # Run the application
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )


