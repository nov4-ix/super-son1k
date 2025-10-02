#!/usr/bin/env python3
"""
🚀 Nova Post Pilot Service
Servicio de marketing de contenido con IA Qwen
Análisis de redes sociales, ganchos virales y publicación automatizada
"""

import asyncio
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class NovaPostPilotService:
    """Servicio completo de marketing de contenido con IA"""
    
    def __init__(self):
        self.qwen_api_url = "http://localhost:11434/api/generate"  # Ollama con Qwen
        self.social_algorithms = {
            "instagram": {
                "name": "Instagram",
                "peak_hours": ["19:00-21:00", "12:00-13:00"],
                "content_types": ["visual", "stories", "reels", "carousel"],
                "engagement_factor": "visual-first",
                "hashtag_limit": 30,
                "algorithm_type": "engagement-based"
            },
            "tiktok": {
                "name": "TikTok", 
                "peak_hours": ["18:00-20:00", "21:00-23:00"],
                "content_types": ["video", "trending", "music"],
                "engagement_factor": "completion-rate",
                "hashtag_limit": 5,
                "algorithm_type": "for-you-page"
            },
            "twitter": {
                "name": "Twitter/X",
                "peak_hours": ["09:00-10:00", "19:00-20:00"],
                "content_types": ["text", "threads", "news"],
                "engagement_factor": "real-time",
                "hashtag_limit": 3,
                "algorithm_type": "chronological-engagement"
            },
            "youtube": {
                "name": "YouTube",
                "peak_hours": ["20:00-22:00", "14:00-16:00"],
                "content_types": ["long-form", "shorts", "tutorials"],
                "engagement_factor": "watch-time",
                "hashtag_limit": 15,
                "algorithm_type": "watch-time-based"
            },
            "linkedin": {
                "name": "LinkedIn",
                "peak_hours": ["08:00-09:00", "17:00-18:00"],
                "content_types": ["professional", "articles", "insights"],
                "engagement_factor": "professional-value",
                "hashtag_limit": 5,
                "algorithm_type": "professional-relevance"
            }
        }
        
    async def analyze_market_with_qwen(self, content_profile: Dict) -> Dict:
        """Analizar mercado usando IA Qwen"""
        try:
            prompt = f"""
            Actúa como un experto en marketing digital y análisis de redes sociales.
            
            Analiza el siguiente perfil de contenido musical:
            - Tipo de contenido: {content_profile.get('content_type')}
            - Nicho musical: {content_profile.get('niche')}
            - Audiencia objetivo: {content_profile.get('target_audience')}
            - Tono: {content_profile.get('tone')}
            
            Proporciona un análisis detallado que incluya:
            1. Tamaño estimado del mercado
            2. Nivel de competencia (Bajo/Medio/Alto)
            3. 4 temas trending relevantes
            4. Insights de audiencia (edad, plataforma principal, horarios)
            5. 4 oportunidades específicas de crecimiento
            
            Responde en formato JSON válido.
            """
            
            response = await self._call_qwen_api(prompt)
            
            if response:
                return self._parse_market_analysis(response)
            else:
                return self._get_fallback_analysis(content_profile)
                
        except Exception as e:
            logger.error(f"Error en análisis de mercado: {e}")
            return self._get_fallback_analysis(content_profile)
    
    async def generate_viral_hooks(self, content_profile: Dict, market_analysis: Dict) -> List[Dict]:
        """Generar ganchos virales especializados por plataforma"""
        try:
            hooks = []
            
            for platform, algorithm in self.social_algorithms.items():
                prompt = f"""
                Crea un gancho viral específico para {platform} ({algorithm['name']}) considerando:
                
                Perfil de contenido:
                - Nicho: {content_profile.get('niche')}
                - Tipo: {content_profile.get('content_type')}
                - Tono: {content_profile.get('tone')}
                
                Algoritmo de {platform}:
                - Factor de engagement: {algorithm['engagement_factor']}
                - Tipos de contenido: {', '.join(algorithm['content_types'])}
                - Límite de hashtags: {algorithm['hashtag_limit']}
                
                Tendencias actuales: {', '.join(market_analysis.get('trending_topics', []))}
                
                Crea un gancho que:
                1. Sea específico para el algoritmo de {platform}
                2. Use el tono {content_profile.get('tone')}
                3. Incorpore elementos virales probados
                4. Sea relevante para el nicho {content_profile.get('niche')}
                
                Responde solo con el texto del gancho, máximo 280 caracteres.
                """
                
                hook_text = await self._call_qwen_api(prompt)
                
                if hook_text:
                    hook = {
                        "platform": platform,
                        "type": self._determine_hook_type(hook_text, platform),
                        "text": hook_text.strip(),
                        "engagement": self._predict_engagement(hook_text, platform),
                        "reason": self._get_hook_reasoning(platform, algorithm)
                    }
                    hooks.append(hook)
            
            return hooks
            
        except Exception as e:
            logger.error(f"Error generando ganchos virales: {e}")
            return self._get_fallback_hooks(content_profile)
    
    async def calculate_optimal_times(self, content_profile: Dict, target_timezone: str = "UTC-5") -> Dict:
        """Calcular horarios óptimos personalizados"""
        try:
            optimal_times = {}
            
            for platform, algorithm in self.social_algorithms.items():
                # Personalizar horarios basado en el perfil
                base_engagement = self._calculate_base_engagement(content_profile, platform)
                
                optimal_times[platform] = {
                    "peak_hours": algorithm["peak_hours"],
                    "timezone": target_timezone,
                    "engagement_prediction": base_engagement,
                    "best_days": self._get_best_days(platform, content_profile),
                    "content_suggestions": self._get_content_suggestions(platform, content_profile)
                }
            
            return optimal_times
            
        except Exception as e:
            logger.error(f"Error calculando horarios óptimos: {e}")
            return self._get_fallback_times()
    
    async def schedule_post(self, platform: str, content: str, datetime_str: str, user_id: str) -> Dict:
        """Programar publicación automática"""
        try:
            # En producción, aquí se integraría con APIs reales de redes sociales
            scheduled_post = {
                "id": f"post_{datetime.now().timestamp()}",
                "platform": platform,
                "content": content,
                "scheduled_time": datetime_str,
                "user_id": user_id,
                "status": "scheduled",
                "created_at": datetime.now().isoformat()
            }
            
            # Simular guardado en base de datos
            logger.info(f"Post programado: {scheduled_post}")
            
            return {
                "success": True,
                "post_id": scheduled_post["id"],
                "message": f"Post programado para {platform} el {datetime_str}"
            }
            
        except Exception as e:
            logger.error(f"Error programando post: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def publish_post(self, post_id: str) -> Dict:
        """Publicar contenido automáticamente"""
        try:
            # En producción, aquí se ejecutaría la publicación real
            # Integración con APIs de Instagram, TikTok, Twitter, etc.
            
            logger.info(f"Publicando post {post_id}")
            
            return {
                "success": True,
                "post_id": post_id,
                "published_at": datetime.now().isoformat(),
                "engagement": {
                    "views": 0,
                    "likes": 0,
                    "comments": 0,
                    "shares": 0
                }
            }
            
        except Exception as e:
            logger.error(f"Error publicando post: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _call_qwen_api(self, prompt: str) -> Optional[str]:
        """Llamar a la API de Qwen a través de Ollama"""
        try:
            payload = {
                "model": "qwen2.5",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 1000
                }
            }
            
            response = requests.post(
                self.qwen_api_url,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "").strip()
            else:
                logger.warning(f"Qwen API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error llamando a Qwen API: {e}")
            return None
    
    def _parse_market_analysis(self, response: str) -> Dict:
        """Parsear respuesta de análisis de mercado"""
        try:
            # Intentar parsear JSON
            return json.loads(response)
        except:
            # Fallback si no es JSON válido
            return self._extract_analysis_from_text(response)
    
    def _get_fallback_analysis(self, content_profile: Dict) -> Dict:
        """Análisis de mercado de respaldo"""
        return {
            "market_size": 750000,
            "competition": "Medio",
            "trending_topics": [
                "AI Music Production",
                "Bedroom Pop Revival", 
                "Vintage Synthesizers",
                "Collaborative Remixes"
            ],
            "audience_insights": {
                "age_range": "18-34",
                "primary_platform": "Instagram",
                "engagement_time": "19:00-21:00",
                "interests": ["Music Production", "Indie Artists", "New Releases"]
            },
            "opportunities": [
                "Colaboraciones con artistas emergentes",
                "Contenido educativo sobre producción",
                "Participación en challenges virales",
                "Lanzamientos en horarios óptimos"
            ]
        }
    
    def _get_fallback_hooks(self, content_profile: Dict) -> List[Dict]:
        """Ganchos virales de respaldo"""
        niche = content_profile.get('niche', 'música')
        
        return [
            {
                "platform": "instagram",
                "type": "Question Hook",
                "text": f"¿Qué pasaría si combinaras {niche} con IA? 🤖🎵",
                "engagement": "high",
                "reason": "Las preguntas generan comentarios y engagement"
            },
            {
                "platform": "tiktok", 
                "type": "Trend Hook",
                "text": f"POV: Cuando descubres que la IA puede hacer {niche} mejor que tú 😱",
                "engagement": "viral",
                "reason": "POV y emociones fuertes funcionan en TikTok"
            },
            {
                "platform": "twitter",
                "type": "Controversy Hook", 
                "text": f"Unpopular opinion: La IA nunca reemplazará la creatividad humana en {niche}",
                "engagement": "medium",
                "reason": "Las opiniones controvertidas generan debate"
            }
        ]
    
    def _determine_hook_type(self, text: str, platform: str) -> str:
        """Determinar tipo de gancho basado en el texto"""
        text_lower = text.lower()
        
        if "?" in text:
            return "Question Hook"
        elif "pov:" in text_lower:
            return "POV Hook"
        elif "unpopular" in text_lower or "controversial" in text_lower:
            return "Controversy Hook"
        elif "cómo" in text_lower or "tutorial" in text_lower:
            return "Tutorial Hook"
        else:
            return "Engagement Hook"
    
    def _predict_engagement(self, text: str, platform: str) -> str:
        """Predecir nivel de engagement"""
        # Algoritmo simple basado en características del texto
        score = 0
        
        if "?" in text:
            score += 2
        if any(emoji in text for emoji in ["🤖", "🎵", "😱", "🔥", "💯"]):
            score += 1
        if len(text) < 100:
            score += 1
        if platform == "tiktok" and "pov" in text.lower():
            score += 2
            
        if score >= 4:
            return "viral"
        elif score >= 2:
            return "high"
        else:
            return "medium"
    
    def _get_hook_reasoning(self, platform: str, algorithm: Dict) -> str:
        """Obtener razón del gancho"""
        reasons = {
            "instagram": "Las preguntas y contenido visual generan alto engagement",
            "tiktok": "POV y emociones fuertes funcionan con el algoritmo For You",
            "twitter": "Contenido que genera debate aumenta la interacción",
            "youtube": "Títulos educativos mejoran el tiempo de visualización",
            "linkedin": "Contenido profesional y educativo tiene mejor alcance"
        }
        
        return reasons.get(platform, "Optimizado para el algoritmo de la plataforma")
    
    def _calculate_base_engagement(self, content_profile: Dict, platform: str) -> int:
        """Calcular engagement base esperado"""
        base = 70
        
        # Ajustar según nicho
        niche = content_profile.get('niche', '').lower()
        if 'electronic' in niche or 'edm' in niche:
            base += 10
        if 'hip-hop' in niche or 'rap' in niche:
            base += 15
        
        # Ajustar según plataforma
        if platform == 'tiktok':
            base += 10
        elif platform == 'instagram':
            base += 5
            
        return min(base, 95)  # Máximo 95%
    
    def _get_best_days(self, platform: str, content_profile: Dict) -> List[str]:
        """Obtener mejores días para publicar"""
        platform_days = {
            "instagram": ["Martes", "Miércoles", "Jueves"],
            "tiktok": ["Martes", "Jueves", "Viernes"],
            "twitter": ["Lunes", "Miércoles", "Viernes"],
            "youtube": ["Jueves", "Viernes", "Sábado"],
            "linkedin": ["Martes", "Miércoles", "Jueves"]
        }
        
        return platform_days.get(platform, ["Martes", "Miércoles", "Jueves"])
    
    def _get_content_suggestions(self, platform: str, content_profile: Dict) -> List[str]:
        """Obtener sugerencias de contenido por plataforma"""
        suggestions = {
            "instagram": ["Stories con proceso creativo", "Reels de snippets", "Carousels educativos"],
            "tiktok": ["Challenges musicales", "Behind the scenes", "Tutoriales rápidos"],
            "twitter": ["Threads sobre proceso", "Polls de preferencias", "Updates en tiempo real"],
            "youtube": ["Tutoriales completos", "Vlogs de estudio", "Análisis de tracks"],
            "linkedin": ["Artículos sobre industria", "Insights profesionales", "Networking posts"]
        }
        
        return suggestions.get(platform, ["Contenido regular", "Interacción con audiencia"])
    
    def _get_fallback_times(self) -> Dict:
        """Horarios óptimos de respaldo"""
        return {
            platform: {
                "peak_hours": data["peak_hours"],
                "timezone": "UTC-5",
                "engagement_prediction": 75,
                "best_days": ["Martes", "Miércoles", "Jueves"],
                "content_suggestions": ["Contenido regular"]
            }
            for platform, data in self.social_algorithms.items()
        }
