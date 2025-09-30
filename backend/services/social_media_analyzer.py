#!/usr/bin/env python3
"""
🚀 Social Media Algorithm Analyzer - Nova Post Pilot Enhanced
Análisis profundo de algoritmos de redes sociales con Qwen 2.5
"""

import os
import json
import logging
import requests
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import asyncio
import aiohttp
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class Platform(Enum):
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    YOUTUBE = "youtube"
    TWITTER = "twitter"
    FACEBOOK = "facebook"
    LINKEDIN = "linkedin"

@dataclass
class AlgorithmInsight:
    platform: Platform
    optimal_times: List[str]
    content_preferences: Dict[str, float]
    engagement_factors: Dict[str, float]
    hashtag_strategy: List[str]
    posting_frequency: Dict[str, int]
    content_length: Dict[str, int]
    visual_elements: List[str]
    audio_preferences: Dict[str, float]
    trending_topics: List[str]
    competitor_analysis: Dict[str, float]
    algorithm_score: float
    recommendations: List[str]

class SocialMediaAnalyzer:
    def __init__(self, ollama_base_url: str = None):
        self.ollama_base_url = ollama_base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
        
        # Base de datos de algoritmos (actualizada constantemente)
        self.algorithm_database = {
            Platform.INSTAGRAM: {
                "factors": {
                    "engagement_rate": 0.35,
                    "recency": 0.25,
                    "relevance": 0.20,
                    "relationship": 0.15,
                    "frequency": 0.05
                },
                "optimal_times": ["09:00-11:00", "13:00-15:00", "17:00-19:00"],
                "content_preferences": {
                    "reels": 0.40,
                    "posts": 0.30,
                    "stories": 0.20,
                    "igtv": 0.10
                },
                "hashtag_strategy": {
                    "popular": 3,
                    "niche": 5,
                    "branded": 2,
                    "location": 1
                }
            },
            Platform.TIKTOK: {
                "factors": {
                    "completion_rate": 0.30,
                    "engagement_rate": 0.25,
                    "shares": 0.20,
                    "comments": 0.15,
                    "likes": 0.10
                },
                "optimal_times": ["06:00-09:00", "12:00-15:00", "19:00-22:00"],
                "content_preferences": {
                    "trending_sounds": 0.35,
                    "original_audio": 0.25,
                    "music": 0.20,
                    "voiceover": 0.20
                },
                "video_length": {
                    "optimal": 15,
                    "max": 60,
                    "min": 3
                }
            },
            Platform.YOUTUBE: {
                "factors": {
                    "watch_time": 0.40,
                    "click_through_rate": 0.25,
                    "engagement": 0.20,
                    "subscriber_activity": 0.15
                },
                "optimal_times": ["14:00-16:00", "20:00-22:00"],
                "content_preferences": {
                    "tutorials": 0.30,
                    "entertainment": 0.25,
                    "music": 0.20,
                    "gaming": 0.15,
                    "lifestyle": 0.10
                },
                "thumbnail_strategy": {
                    "bright_colors": 0.30,
                    "faces": 0.25,
                    "text": 0.20,
                    "contrast": 0.15,
                    "emotions": 0.10
                }
            },
            Platform.TWITTER: {
                "factors": {
                    "engagement_rate": 0.30,
                    "retweets": 0.25,
                    "replies": 0.20,
                    "clicks": 0.15,
                    "recency": 0.10
                },
                "optimal_times": ["09:00-10:00", "12:00-13:00", "15:00-16:00", "17:00-18:00"],
                "content_preferences": {
                    "threads": 0.35,
                    "images": 0.25,
                    "videos": 0.20,
                    "polls": 0.10,
                    "text_only": 0.10
                },
                "character_optimization": {
                    "optimal": 280,
                    "thread_length": 5,
                    "hashtags": 2
                }
            }
        }

    async def analyze_platform_algorithm(self, platform: Platform, user_data: Dict = None) -> AlgorithmInsight:
        """
        Analizar algoritmo de plataforma específica con Qwen
        """
        try:
            # Obtener datos base del algoritmo
            base_data = self.algorithm_database.get(platform, {})
            
            # Generar prompt para Qwen
            prompt = self._generate_analysis_prompt(platform, base_data, user_data)
            
            # Consultar Qwen
            qwen_response = await self._query_qwen(prompt)
            
            # Procesar respuesta
            insight = self._process_qwen_response(platform, qwen_response, base_data)
            
            return insight
            
        except Exception as e:
            logger.error(f"Error analizando algoritmo de {platform.value}: {e}")
            return self._get_fallback_insight(platform)

    def _generate_analysis_prompt(self, platform: Platform, base_data: Dict, user_data: Dict = None) -> str:
        """Generar prompt optimizado para Qwen"""
        
        platform_info = {
            Platform.INSTAGRAM: "Instagram con enfoque en Reels y engagement visual",
            Platform.TIKTOK: "TikTok con énfasis en tendencias y contenido viral",
            Platform.YOUTUBE: "YouTube con prioridad en watch time y retención",
            Platform.TWITTER: "Twitter con enfoque en engagement y conversaciones"
        }
        
        prompt = f"""
        Eres un experto en algoritmos de redes sociales. Analiza {platform_info[platform]} y proporciona insights específicos para optimizar contenido musical.

        Datos del algoritmo actual:
        {json.dumps(base_data, indent=2)}

        Datos del usuario (si disponibles):
        {json.dumps(user_data or {}, indent=2)}

        Proporciona un análisis detallado en formato JSON con:
        1. optimal_times: Horarios óptimos de publicación
        2. content_preferences: Preferencias de contenido con scores
        3. engagement_factors: Factores de engagement con pesos
        4. hashtag_strategy: Estrategia de hashtags específica
        5. posting_frequency: Frecuencia óptima de publicación
        6. content_length: Longitud óptima de contenido
        7. visual_elements: Elementos visuales recomendados
        8. audio_preferences: Preferencias de audio para música
        9. trending_topics: Temas trending relevantes
        10. competitor_analysis: Análisis de competencia
        11. algorithm_score: Score de optimización (0-100)
        12. recommendations: Recomendaciones específicas

        Enfócate en contenido musical y creativo. Sé específico y actionable.
        """
        
        return prompt

    async def _query_qwen(self, prompt: str) -> Dict:
        """Consultar Qwen 2.5 con el prompt"""
        try:
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 2000
                    }
                }
                
                async with session.post(
                    f"{self.ollama_base_url}/api/generate",
                    json=payload,
                    timeout=30
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return json.loads(result.get("response", "{}"))
                    else:
                        logger.error(f"Error en consulta Qwen: {response.status}")
                        return {}
                        
        except Exception as e:
            logger.error(f"Error consultando Qwen: {e}")
            return {}

    def _process_qwen_response(self, platform: Platform, qwen_response: Dict, base_data: Dict) -> AlgorithmInsight:
        """Procesar respuesta de Qwen y crear AlgorithmInsight"""
        
        # Extraer datos de la respuesta de Qwen
        optimal_times = qwen_response.get("optimal_times", base_data.get("optimal_times", []))
        content_preferences = qwen_response.get("content_preferences", base_data.get("content_preferences", {}))
        engagement_factors = qwen_response.get("engagement_factors", base_data.get("factors", {}))
        hashtag_strategy = qwen_response.get("hashtag_strategy", [])
        posting_frequency = qwen_response.get("posting_frequency", {})
        content_length = qwen_response.get("content_length", {})
        visual_elements = qwen_response.get("visual_elements", [])
        audio_preferences = qwen_response.get("audio_preferences", {})
        trending_topics = qwen_response.get("trending_topics", [])
        competitor_analysis = qwen_response.get("competitor_analysis", {})
        algorithm_score = qwen_response.get("algorithm_score", 75.0)
        recommendations = qwen_response.get("recommendations", [])
        
        return AlgorithmInsight(
            platform=platform,
            optimal_times=optimal_times,
            content_preferences=content_preferences,
            engagement_factors=engagement_factors,
            hashtag_strategy=hashtag_strategy,
            posting_frequency=posting_frequency,
            content_length=content_length,
            visual_elements=visual_elements,
            audio_preferences=audio_preferences,
            trending_topics=trending_topics,
            competitor_analysis=competitor_analysis,
            algorithm_score=algorithm_score,
            recommendations=recommendations
        )

    def _get_fallback_insight(self, platform: Platform) -> AlgorithmInsight:
        """Obtener insight de respaldo si falla el análisis"""
        base_data = self.algorithm_database.get(platform, {})
        
        return AlgorithmInsight(
            platform=platform,
            optimal_times=base_data.get("optimal_times", []),
            content_preferences=base_data.get("content_preferences", {}),
            engagement_factors=base_data.get("factors", {}),
            hashtag_strategy=[],
            posting_frequency={},
            content_length={},
            visual_elements=[],
            audio_preferences={},
            trending_topics=[],
            competitor_analysis={},
            algorithm_score=50.0,
            recommendations=["Usar datos de respaldo - análisis completo no disponible"]
        )

    async def analyze_multiple_platforms(self, platforms: List[Platform], user_data: Dict = None) -> Dict[Platform, AlgorithmInsight]:
        """Analizar múltiples plataformas simultáneamente"""
        tasks = []
        for platform in platforms:
            task = self.analyze_platform_algorithm(platform, user_data)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        platform_insights = {}
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(f"Error analizando {platforms[i].value}: {result}")
                platform_insights[platforms[i]] = self._get_fallback_insight(platforms[i])
            else:
                platform_insights[platforms[i]] = result
        
        return platform_insights

    async def generate_optimal_content(self, platform: Platform, insight: AlgorithmInsight, 
                                     content_type: str = "music", user_prompt: str = "") -> Dict:
        """Generar contenido óptimo basado en insights del algoritmo"""
        
        prompt = f"""
        Genera contenido optimizado para {platform.value} basado en estos insights:
        
        Algoritmo Score: {insight.algorithm_score}
        Horarios óptimos: {insight.optimal_times}
        Preferencias de contenido: {insight.content_preferences}
        Factores de engagement: {insight.engagement_factors}
        Estrategia de hashtags: {insight.hashtag_strategy}
        Temas trending: {insight.trending_topics}
        Recomendaciones: {insight.recommendations}
        
        Tipo de contenido: {content_type}
        Prompt del usuario: {user_prompt}
        
        Genera:
        1. Título optimizado
        2. Descripción con hashtags
        3. Horario de publicación recomendado
        4. Elementos visuales sugeridos
        5. Estrategia de engagement
        6. Call-to-action
        """
        
        qwen_response = await self._query_qwen(prompt)
        
        return {
            "platform": platform.value,
            "optimized_content": qwen_response,
            "algorithm_score": insight.algorithm_score,
            "posting_time": insight.optimal_times[0] if insight.optimal_times else "12:00",
            "hashtags": insight.hashtag_strategy[:5] if insight.hashtag_strategy else [],
            "trending_topics": insight.trending_topics[:3] if insight.trending_topics else []
        }

    async def schedule_optimal_posts(self, platforms: List[Platform], content_data: Dict, 
                                   user_preferences: Dict = None) -> List[Dict]:
        """Programar publicaciones óptimas en múltiples plataformas"""
        
        scheduled_posts = []
        
        for platform in platforms:
            insight = await self.analyze_platform_algorithm(platform, user_preferences)
            optimal_content = await self.generate_optimal_content(platform, insight, 
                                                                content_data.get("type", "music"),
                                                                content_data.get("prompt", ""))
            
            # Calcular horario óptimo
            optimal_time = self._calculate_optimal_time(insight.optimal_times)
            
            scheduled_post = {
                "platform": platform.value,
                "content": optimal_content,
                "scheduled_time": optimal_time,
                "algorithm_score": insight.algorithm_score,
                "status": "scheduled",
                "created_at": datetime.now().isoformat()
            }
            
            scheduled_posts.append(scheduled_post)
        
        return scheduled_posts

    def _calculate_optimal_time(self, optimal_times: List[str]) -> str:
        """Calcular horario óptimo basado en análisis"""
        if not optimal_times:
            return "12:00"
        
        # Por ahora, usar el primer horario óptimo
        # En el futuro, se puede implementar lógica más sofisticada
        return optimal_times[0]

    async def get_trending_analysis(self, platform: Platform, category: str = "music") -> Dict:
        """Obtener análisis de tendencias para una plataforma específica"""
        
        prompt = f"""
        Analiza las tendencias actuales en {platform.value} para la categoría {category}.
        
        Proporciona:
        1. Hashtags trending
        2. Temas populares
        3. Formatos de contenido exitosos
        4. Horarios de mayor actividad
        5. Competidores destacados
        6. Oportunidades de contenido
        7. Predicciones para próximos días
        """
        
        qwen_response = await self._query_qwen(prompt)
        
        return {
            "platform": platform.value,
            "category": category,
            "trending_analysis": qwen_response,
            "analyzed_at": datetime.now().isoformat()
        }

# Instancia global
social_analyzer = SocialMediaAnalyzer()

async def analyze_social_media_algorithm(platform: str, user_data: Dict = None) -> Dict:
    """Función de conveniencia para analizar algoritmo"""
    try:
        platform_enum = Platform(platform.lower())
        insight = await social_analyzer.analyze_platform_algorithm(platform_enum, user_data)
        
        return {
            "success": True,
            "platform": platform,
            "insight": {
                "optimal_times": insight.optimal_times,
                "content_preferences": insight.content_preferences,
                "engagement_factors": insight.engagement_factors,
                "hashtag_strategy": insight.hashtag_strategy,
                "algorithm_score": insight.algorithm_score,
                "recommendations": insight.recommendations
            }
        }
    except Exception as e:
        logger.error(f"Error en análisis de algoritmo: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def generate_optimal_content_for_platform(platform: str, content_data: Dict) -> Dict:
    """Generar contenido óptimo para una plataforma específica"""
    try:
        platform_enum = Platform(platform.lower())
        insight = await social_analyzer.analyze_platform_algorithm(platform_enum)
        optimal_content = await social_analyzer.generate_optimal_content(
            platform_enum, insight, 
            content_data.get("type", "music"),
            content_data.get("prompt", "")
        )
        
        return {
            "success": True,
            "platform": platform,
            "optimal_content": optimal_content
        }
    except Exception as e:
        logger.error(f"Error generando contenido óptimo: {e}")
        return {
            "success": False,
            "error": str(e)
        }

