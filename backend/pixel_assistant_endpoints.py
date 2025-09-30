#!/usr/bin/env python3
"""
🤖 Pixel Assistant Endpoints - Asistente de IA especializado
Endpoints para consultar a Pixel sobre historia y creatividad musical
"""

import os
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
import asyncio

# Importar Pixel Assistant
from services.pixel_assistant import (
    pixel_assistant,
    ask_pixel,
    get_pixel_suggestions,
    get_historical_context
)

logger = logging.getLogger(__name__)

# Router para Pixel Assistant
router = APIRouter(prefix="/api/pixel", tags=["Pixel Assistant"])

# Modelos Pydantic
class PixelQueryRequest(BaseModel):
    query: str
    context: Optional[Dict] = None
    mode: Optional[str] = None

class PixelSuggestionRequest(BaseModel):
    context: Optional[Dict] = None
    category: Optional[str] = None

class HistoricalContextRequest(BaseModel):
    topic: str
    depth: Optional[str] = "basic"

class PixelChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = None
    user_context: Optional[Dict] = None

# Endpoints principales

@router.post("/ask")
async def ask_pixel_endpoint(request: PixelQueryRequest):
    """
    🤖 Consultar a Pixel sobre cualquier tema relacionado con Son1kVers3 o creatividad musical
    """
    try:
        result = await ask_pixel(request.query, request.context)
        
        if result["success"]:
            return {
                "success": True,
                "pixel_response": result["response"],
                "mode": result["mode"],
                "confidence": result["confidence"],
                "suggestions": result["suggestions"],
                "related_topics": result["related_topics"],
                "context": result["context"],
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error en consulta a Pixel: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggestions")
async def get_suggestions_endpoint(request: PixelSuggestionRequest):
    """
    💡 Obtener sugerencias creativas de Pixel
    """
    try:
        result = await get_pixel_suggestions(request.context)
        
        if result["success"]:
            return {
                "success": True,
                "suggestions": result["suggestions"],
                "category": request.category or "creative",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error obteniendo sugerencias: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/historical-context")
async def get_historical_context_endpoint(request: HistoricalContextRequest):
    """
    📚 Obtener contexto histórico sobre personajes o eventos de Son1kVers3
    """
    try:
        result = await get_historical_context(request.topic)
        
        if result["success"]:
            return {
                "success": True,
                "topic": request.topic,
                "context": result["context"],
                "depth": request.depth,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error obteniendo contexto histórico: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def pixel_chat_endpoint(request: PixelChatRequest):
    """
    💬 Chat conversacional con Pixel
    """
    try:
        # Construir contexto de conversación
        chat_context = {
            "conversation_history": request.conversation_history or [],
            "user_context": request.user_context or {},
            "current_message": request.message
        }
        
        result = await ask_pixel(request.message, chat_context)
        
        if result["success"]:
            return {
                "success": True,
                "pixel_response": result["response"],
                "mode": result["mode"],
                "confidence": result["confidence"],
                "suggestions": result["suggestions"],
                "related_topics": result["related_topics"],
                "conversation_id": f"pixel_chat_{datetime.now().timestamp()}",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error en chat con Pixel: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/personality")
async def get_pixel_personality():
    """
    🎭 Obtener información sobre la personalidad de Pixel
    """
    try:
        return {
            "success": True,
            "personality": pixel_assistant.personality,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo personalidad de Pixel: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/knowledge-base")
async def get_knowledge_base():
    """
    🧠 Obtener información sobre la base de conocimiento de Pixel
    """
    try:
        return {
            "success": True,
            "knowledge_base": {
                "characters": list(pixel_assistant.codex_knowledge.get("characters", {}).keys()),
                "locations": list(pixel_assistant.codex_knowledge.get("locations", {}).keys()),
                "concepts": list(pixel_assistant.codex_knowledge.get("concepts", {}).keys()),
                "musical_themes": list(pixel_assistant.codex_knowledge.get("musical_themes", {}).keys())
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo base de conocimiento: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/creative-guidance")
async def get_creative_guidance(request: PixelQueryRequest):
    """
    🎨 Obtener guía creativa específica de Pixel
    """
    try:
        # Añadir contexto de guía creativa
        creative_context = {
            **(request.context or {}),
            "guidance_type": "creative",
            "focus": "musical_creativity"
        }
        
        result = await ask_pixel(request.query, creative_context)
        
        if result["success"]:
            return {
                "success": True,
                "guidance": result["response"],
                "mode": result["mode"],
                "confidence": result["confidence"],
                "creative_suggestions": result["suggestions"],
                "musical_themes": result["related_topics"],
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error obteniendo guía creativa: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resistance-strategy")
async def get_resistance_strategy(request: PixelQueryRequest):
    """
    ⚔️ Obtener estrategia de resistencia de Pixel
    """
    try:
        # Añadir contexto de resistencia
        resistance_context = {
            **(request.context or {}),
            "guidance_type": "resistance",
            "focus": "strategic_planning"
        }
        
        result = await ask_pixel(request.query, resistance_context)
        
        if result["success"]:
            return {
                "success": True,
                "strategy": result["response"],
                "mode": result["mode"],
                "confidence": result["confidence"],
                "tactical_suggestions": result["suggestions"],
                "resistance_themes": result["related_topics"],
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error obteniendo estrategia de resistencia: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emotional-connection")
async def get_emotional_connection(request: PixelQueryRequest):
    """
    💝 Obtener guía para conexiones emocionales de Pixel
    """
    try:
        # Añadir contexto emocional
        emotional_context = {
            **(request.context or {}),
            "guidance_type": "emotional",
            "focus": "connection_and_vulnerability"
        }
        
        result = await ask_pixel(request.query, emotional_context)
        
        if result["success"]:
            return {
                "success": True,
                "emotional_guidance": result["response"],
                "mode": result["mode"],
                "confidence": result["confidence"],
                "connection_suggestions": result["suggestions"],
                "emotional_themes": result["related_topics"],
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.error(f"Error obteniendo guía emocional: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_pixel_status():
    """
    📊 Obtener estado del sistema Pixel
    """
    try:
        return {
            "success": True,
            "status": "operational",
            "assistant_name": "Pixel",
            "role": "Custodio Digital y Estratega de Resistencia",
            "capabilities": [
                "Creatividad musical",
                "Historia de Son1kVers3",
                "Estrategia de resistencia",
                "Conexiones emocionales",
                "Guía técnica"
            ],
            "knowledge_base_status": "loaded",
            "codex_connection": "active",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo estado de Pixel: {e}")
        return {
            "success": False,
            "error": str(e),
            "status": "error"
        }

@router.get("/test")
async def test_pixel_assistant():
    """
    🧪 Endpoint de prueba para Pixel Assistant
    """
    try:
        # Probar consulta básica
        test_result = await ask_pixel("¿Quién es Bella?", {})
        
        return {
            "success": True,
            "message": "Pixel Assistant funcionando correctamente",
            "test_query": "¿Quién es Bella?",
            "test_response": test_result.get("response", "No response"),
            "test_mode": test_result.get("mode", "unknown"),
            "test_confidence": test_result.get("confidence", 0),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error en prueba de Pixel: {e}")
        return {
            "success": False,
            "error": str(e),
            "message": "Error en prueba de Pixel Assistant"
        }

# Endpoint de bienvenida
@router.get("/")
async def pixel_welcome():
    """
    👋 Mensaje de bienvenida de Pixel
    """
    return {
        "success": True,
        "message": "Hola, soy Pixel, tu Custodio Digital y Estratega de Resistencia.",
        "description": "Estoy aquí para ayudarte con la creatividad musical, la historia de Son1kVers3, y la resistencia a través del arte.",
        "capabilities": [
            "Guía creativa musical",
            "Historia y contexto de Son1kVers3",
            "Estrategias de resistencia",
            "Conexiones emocionales",
            "Asistencia técnica"
        ],
        "quick_start": "Pregúntame sobre Bella, NOV4-IX, creatividad musical, o cualquier tema relacionado con la resistencia.",
        "timestamp": datetime.now().isoformat()
    }

