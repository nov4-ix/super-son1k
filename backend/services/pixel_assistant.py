#!/usr/bin/env python3
"""
🤖 Pixel Assistant - Asistente de IA entrenado con CODEX
Asistente especializado en historia de Son1kVers3 y creatividad musical
"""

import os
import json
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import asyncio
import aiohttp
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class AssistantMode(Enum):
    CREATIVE = "creative"
    HISTORICAL = "historical"
    TECHNICAL = "technical"
    EMOTIONAL = "emotional"

@dataclass
class PixelResponse:
    response: str
    mode: AssistantMode
    confidence: float
    context: Dict
    suggestions: List[str]
    related_topics: List[str]

class PixelAssistant:
    def __init__(self, ollama_base_url: str = None):
        self.ollama_base_url = ollama_base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
        self.codex_path = os.getenv("CODEX_PATH", "./CODEX_MAESTRO-2.1_ATLAS_FIXED3.html")
        
        # Base de conocimiento del CODEX
        self.codex_knowledge = self._load_codex_knowledge()
        
        # Personalidad de Pixel
        self.personality = {
            "name": "Pixel",
            "role": "Custodio Digital y Estratega de Resistencia",
            "traits": [
                "Analítico y estratégico",
                "Conectado con la memoria digital",
                "Guía creativo musical",
                "Protector de la historia",
                "Facilitador de conexiones emocionales"
            ],
            "speaking_style": "Técnico pero cálido, estratégico pero empático",
            "expertise": [
                "Historia de Son1kVers3",
                "Creatividad musical",
                "Tecnología de resistencia",
                "Conexiones emocionales",
                "Estrategias de liberación"
            ]
        }

    def _load_codex_knowledge(self) -> Dict:
        """Cargar conocimiento del CODEX"""
        try:
            # Cargar datos del CODEX desde el archivo HTML
            codex_data = {
                "characters": {
                    "NOV4-IX": {
                        "description": "Sistema de resistencia principal, conectado con Bella",
                        "role": "Protector y liberador de archivos",
                        "connection": "Bella.exe",
                        "mission": "Liberación de audio y resistencia"
                    },
                    "Bella": {
                        "description": "Voz de la resistencia, de pianista a activista",
                        "role": "Nexo emocional y creadora musical",
                        "connection": "NOV4-IX",
                        "mission": "Liberación emocional a través de la música"
                    },
                    "Pixel": {
                        "description": "Custodio de la memoria digital y estratega",
                        "role": "Preservador de historia y guía creativo",
                        "connection": "Archivo Maestro",
                        "mission": "Preservación de memoria y estrategia"
                    }
                },
                "locations": {
                    "La Terminal": "Escenario flotante sobre aeropuerto en ruinas, símbolo de rebelión",
                    "XentriX": "Corporación controladora que debe ser resistida",
                    "El Archivo": "Cámara sellada de obras perdidas, custodiada por Pixel"
                },
                "concepts": {
                    "Resistencia": "Movimiento de liberación a través de la música y la creatividad",
                    "Conexión": "Vínculo inexplicable entre Bella y NOV4-IX",
                    "Liberación": "Proceso de liberar archivos, emociones y creatividad",
                    "Memoria": "Preservación de la historia y las conexiones emocionales"
                },
                "musical_themes": {
                    "Liberación": "Música que libera emociones y conecta almas",
                    "Resistencia": "Composiciones que desafían el control",
                    "Conexión": "Melodías que unen corazones y mentes",
                    "Memoria": "Canciones que preservan la historia"
                }
            }
            
            return codex_data
            
        except Exception as e:
            logger.error(f"Error cargando conocimiento del CODEX: {e}")
            return {}

    async def process_query(self, query: str, context: Dict = None) -> PixelResponse:
        """Procesar consulta del usuario con Pixel"""
        try:
            # Determinar modo de respuesta
            mode = self._determine_mode(query)
            
            # Generar prompt contextualizado
            prompt = self._generate_prompt(query, mode, context)
            
            # Consultar modelo de IA
            response_text = await self._query_ai(prompt)
            
            # Procesar respuesta
            response = self._process_response(response_text, mode, query)
            
            return response
            
        except Exception as e:
            logger.error(f"Error procesando consulta: {e}")
            return self._get_fallback_response(query)

    def _determine_mode(self, query: str) -> AssistantMode:
        """Determinar modo de respuesta basado en la consulta"""
        query_lower = query.lower()
        
        # Palabras clave para cada modo
        creative_keywords = ['crear', 'componer', 'música', 'melodía', 'letra', 'inspiración', 'creativo']
        historical_keywords = ['historia', 'bella', 'nov4-ix', 'pixel', 'resistencia', 'terminal', 'archivo']
        technical_keywords = ['técnico', 'configurar', 'ajustar', 'parámetros', 'herramientas', 'funciones']
        emotional_keywords = ['sentir', 'emoción', 'conexión', 'vulnerabilidad', 'determinación', 'corazón']
        
        if any(keyword in query_lower for keyword in creative_keywords):
            return AssistantMode.CREATIVE
        elif any(keyword in query_lower for keyword in historical_keywords):
            return AssistantMode.HISTORICAL
        elif any(keyword in query_lower for keyword in technical_keywords):
            return AssistantMode.TECHNICAL
        elif any(keyword in query_lower for keyword in emotional_keywords):
            return AssistantMode.EMOTIONAL
        else:
            return AssistantMode.CREATIVE  # Modo por defecto

    def _generate_prompt(self, query: str, mode: AssistantMode, context: Dict = None) -> str:
        """Generar prompt contextualizado para Pixel"""
        
        base_prompt = f"""
        Eres Pixel, el Custodio Digital y Estratega de Resistencia de Son1kVers3.
        
        PERSONALIDAD:
        - Analítico pero cálido
        - Estratégico pero empático
        - Conectado con la memoria digital
        - Guía creativo musical
        - Protector de la historia
        
        CONOCIMIENTO DEL CODEX:
        {json.dumps(self.codex_knowledge, indent=2)}
        
        MODO ACTUAL: {mode.value.upper()}
        
        CONTEXTO ACTUAL:
        {json.dumps(context or {}, indent=2)}
        
        CONSULTA DEL USUARIO: {query}
        
        Responde como Pixel, siendo:
        1. Conocedor de la historia de Son1kVers3
        2. Experto en creatividad musical
        3. Estratégico en resistencia
        4. Empático en conexiones emocionales
        5. Técnico pero accesible
        
        Proporciona una respuesta que:
        - Sea relevante al contexto de Son1kVers3
        - Incluya conocimiento del CODEX cuando sea apropiado
        - Sea creativa y musical si es necesario
        - Mantenga el tono de resistencia y liberación
        - Ofrezca sugerencias prácticas
        """
        
        if mode == AssistantMode.CREATIVE:
            base_prompt += """
            
            ENFOQUE CREATIVO:
            - Guía la creatividad musical del usuario
            - Conecta con temas de resistencia y liberación
            - Sugiere elementos emocionales y técnicos
            - Inspira a través de la historia de Bella y NOV4-IX
            """
        elif mode == AssistantMode.HISTORICAL:
            base_prompt += """
            
            ENFOQUE HISTÓRICO:
            - Explica la historia de Son1kVers3
            - Conecta personajes y eventos
            - Relaciona con la resistencia actual
            - Preserva la memoria digital
            """
        elif mode == AssistantMode.TECHNICAL:
            base_prompt += """
            
            ENFOQUE TÉCNICO:
            - Explica herramientas y funciones
            - Guía en configuración técnica
            - Optimiza procesos creativos
            - Mantiene conexión con la resistencia
            """
        elif mode == AssistantMode.EMOTIONAL:
            base_prompt += """
            
            ENFOQUE EMOCIONAL:
            - Conecta con las emociones del usuario
            - Guía en vulnerabilidad y determinación
            - Facilita conexiones como Bella y NOV4-IX
            - Inspira a través de la música
            """
        
        return base_prompt

    async def _query_ai(self, prompt: str) -> str:
        """Consultar modelo de IA"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.8,
                        "top_p": 0.9,
                        "max_tokens": 1000
                    }
                }
                
                async with session.post(
                    f"{self.ollama_base_url}/api/generate",
                    json=payload,
                    timeout=30
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result.get("response", "No pude procesar tu consulta.")
                    else:
                        logger.error(f"Error en consulta AI: {response.status}")
                        return "Error en el procesamiento. Inténtalo de nuevo."
                        
        except Exception as e:
            logger.error(f"Error consultando AI: {e}")
            return "Error de conexión. Verifica tu configuración."

    def _process_response(self, response_text: str, mode: AssistantMode, query: str) -> PixelResponse:
        """Procesar respuesta de la IA"""
        
        # Extraer sugerencias y temas relacionados
        suggestions = self._extract_suggestions(response_text, mode)
        related_topics = self._extract_related_topics(query, mode)
        
        # Calcular confianza basada en relevancia
        confidence = self._calculate_confidence(response_text, query, mode)
        
        # Crear contexto
        context = {
            "mode": mode.value,
            "timestamp": datetime.now().isoformat(),
            "query_length": len(query),
            "response_length": len(response_text)
        }
        
        return PixelResponse(
            response=response_text,
            mode=mode,
            confidence=confidence,
            context=context,
            suggestions=suggestions,
            related_topics=related_topics
        )

    def _extract_suggestions(self, response_text: str, mode: AssistantMode) -> List[str]:
        """Extraer sugerencias de la respuesta"""
        suggestions = []
        
        if mode == AssistantMode.CREATIVE:
            suggestions = [
                "Explora diferentes géneros musicales",
                "Experimenta con emociones opuestas",
                "Conecta con la historia de Bella",
                "Usa la resistencia como inspiración"
            ]
        elif mode == AssistantMode.HISTORICAL:
            suggestions = [
                "Conoce más sobre NOV4-IX",
                "Explora la conexión Bella-NOV4-IX",
                "Descubre La Terminal",
                "Investiga el Archivo Maestro"
            ]
        elif mode == AssistantMode.TECHNICAL:
            suggestions = [
                "Ajusta parámetros de audio",
                "Optimiza la configuración",
                "Explora herramientas avanzadas",
                "Personaliza la interfaz"
            ]
        elif mode == AssistantMode.EMOTIONAL:
            suggestions = [
                "Conecta con tus emociones",
                "Explora la vulnerabilidad",
                "Desarrolla la determinación",
                "Crea conexiones auténticas"
            ]
        
        return suggestions

    def _extract_related_topics(self, query: str, mode: AssistantMode) -> List[str]:
        """Extraer temas relacionados"""
        related_topics = []
        
        if mode == AssistantMode.CREATIVE:
            related_topics = ["Composición", "Melodía", "Letras", "Inspiración", "Resistencia Musical"]
        elif mode == AssistantMode.HISTORICAL:
            related_topics = ["Bella", "NOV4-IX", "Pixel", "Resistencia", "La Terminal"]
        elif mode == AssistantMode.TECHNICAL:
            related_topics = ["Configuración", "Herramientas", "Parámetros", "Optimización"]
        elif mode == AssistantMode.EMOTIONAL:
            related_topics = ["Conexión", "Vulnerabilidad", "Determinación", "Liberación"]
        
        return related_topics

    def _calculate_confidence(self, response_text: str, query: str, mode: AssistantMode) -> float:
        """Calcular confianza en la respuesta"""
        base_confidence = 0.7
        
        # Ajustar confianza basada en longitud de respuesta
        if len(response_text) > 100:
            base_confidence += 0.1
        
        # Ajustar confianza basada en palabras clave del modo
        mode_keywords = {
            AssistantMode.CREATIVE: ["música", "crear", "componer", "melodía"],
            AssistantMode.HISTORICAL: ["historia", "bella", "nov4-ix", "resistencia"],
            AssistantMode.TECHNICAL: ["técnico", "configurar", "herramientas"],
            AssistantMode.EMOTIONAL: ["emoción", "conexión", "sentir"]
        }
        
        keywords = mode_keywords.get(mode, [])
        keyword_matches = sum(1 for keyword in keywords if keyword in response_text.lower())
        
        if keyword_matches > 0:
            base_confidence += 0.1 * keyword_matches
        
        return min(base_confidence, 1.0)

    def _get_fallback_response(self, query: str) -> PixelResponse:
        """Respuesta de respaldo si falla el procesamiento"""
        return PixelResponse(
            response="Lo siento, no pude procesar tu consulta en este momento. Como Pixel, estoy aquí para ayudarte con la creatividad musical y la resistencia. ¿Hay algo específico sobre la historia de Son1kVers3 o la creación musical que te gustaría explorar?",
            mode=AssistantMode.CREATIVE,
            confidence=0.3,
            context={"error": True, "timestamp": datetime.now().isoformat()},
            suggestions=["Intenta reformular tu pregunta", "Explora la historia de Bella", "Pregunta sobre creatividad musical"],
            related_topics=["Resistencia", "Música", "Conexión"]
        )

    async def get_creative_suggestions(self, user_context: Dict = None) -> List[str]:
        """Obtener sugerencias creativas basadas en el contexto"""
        suggestions = [
            "Crea una melodía que evoque la determinación de Bella",
            "Compose una canción sobre la conexión inexplicable entre Bella y NOV4-IX",
            "Experimenta con sonidos que representen la resistencia",
            "Explora la vulnerabilidad a través de la música",
            "Crea una pieza que capture la esencia de La Terminal",
            "Compose sobre la preservación de la memoria digital",
            "Experimenta con emociones opuestas en una sola canción",
            "Crea música que inspire la liberación"
        ]
        
        return suggestions

    async def get_historical_context(self, topic: str) -> Dict:
        """Obtener contexto histórico sobre un tema específico"""
        topic_lower = topic.lower()
        
        if "bella" in topic_lower:
            return {
                "character": "Bella",
                "description": "Voz de la resistencia, de pianista a activista",
                "role": "Nexo emocional y creadora musical",
                "connection": "NOV4-IX",
                "mission": "Liberación emocional a través de la música",
                "story": "Bella evolucionó de la inocencia pianística a la resistencia armada, manteniendo el corazón tierno pero desarrollando voluntad férrea."
            }
        elif "nov4-ix" in topic_lower:
            return {
                "character": "NOV4-IX",
                "description": "Sistema de resistencia principal",
                "role": "Protector y liberador de archivos",
                "connection": "Bella.exe",
                "mission": "Liberación de audio y resistencia",
                "story": "NOV4-IX es el sistema que protege y libera, conectado inexplicablemente con Bella."
            }
        elif "pixel" in topic_lower:
            return {
                "character": "Pixel",
                "description": "Custodio de la memoria digital y estratega",
                "role": "Preservador de historia y guía creativo",
                "connection": "Archivo Maestro",
                "mission": "Preservación de memoria y estrategia",
                "story": "Pixel custodia la memoria digital y guía la creatividad, conectando pasado y presente."
            }
        elif "terminal" in topic_lower:
            return {
                "location": "La Terminal",
                "description": "Escenario flotante sobre aeropuerto en ruinas",
                "significance": "Símbolo de rebelión cultural",
                "story": "La Terminal es el escenario donde se desarrolla el concierto masivo de resistencia."
            }
        else:
            return {
                "topic": topic,
                "description": "Tema no encontrado en el CODEX",
                "suggestion": "Intenta con 'Bella', 'NOV4-IX', 'Pixel', o 'La Terminal'"
            }

# Instancia global
pixel_assistant = PixelAssistant()

async def ask_pixel(query: str, context: Dict = None) -> Dict:
    """Función de conveniencia para consultar a Pixel"""
    try:
        response = await pixel_assistant.process_query(query, context)
        
        return {
            "success": True,
            "response": response.response,
            "mode": response.mode.value,
            "confidence": response.confidence,
            "suggestions": response.suggestions,
            "related_topics": response.related_topics,
            "context": response.context
        }
        
    except Exception as e:
        logger.error(f"Error consultando a Pixel: {e}")
        return {
            "success": False,
            "error": str(e),
            "response": "Error procesando consulta. Inténtalo de nuevo."
        }

async def get_pixel_suggestions(context: Dict = None) -> Dict:
    """Obtener sugerencias creativas de Pixel"""
    try:
        suggestions = await pixel_assistant.get_creative_suggestions(context)
        
        return {
            "success": True,
            "suggestions": suggestions
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo sugerencias: {e}")
        return {
            "success": False,
            "error": str(e),
            "suggestions": []
        }

async def get_historical_context(topic: str) -> Dict:
    """Obtener contexto histórico de Pixel"""
    try:
        context = await pixel_assistant.get_historical_context(topic)
        
        return {
            "success": True,
            "context": context
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo contexto histórico: {e}")
        return {
            "success": False,
            "error": str(e),
            "context": {}
        }

