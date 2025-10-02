#!/usr/bin/env python3
"""
🎵 The Creator Service
Servicio principal de generación musical con IA
Generador de letras con recursos literarios y Qwen
"""

import asyncio
import json
import requests
import random
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class TheCreatorService:
    """Servicio completo de The Creator"""
    
    def __init__(self):
        self.qwen_api_url = "http://localhost:11434/api/generate"
        self.suno_api_url = "https://api.suno.ai/generate"
        
        # Recursos literarios y sus descripciones
        self.literary_resources = {
            "metaphor": {
                "name": "Metáfora",
                "description": "Comparaciones implícitas que enriquecen el significado",
                "examples": ["Tu voz es miel", "Corazón de piedra", "Lluvia de recuerdos"]
            },
            "personification": {
                "name": "Personificación", 
                "description": "Dar cualidades humanas a objetos o conceptos",
                "examples": ["La guitarra llora", "El viento susurra", "La noche abraza"]
            },
            "objectification": {
                "name": "Cosificación",
                "description": "Convertir sentimientos en objetos tangibles",
                "examples": ["Guardar el amor en una caja", "Romper el silencio", "Construir sueños"]
            },
            "hyperbole": {
                "name": "Hipérbole",
                "description": "Exageración expresiva para enfatizar emociones",
                "examples": ["Te amo hasta el infinito", "Lloré un océano", "Mil años esperando"]
            },
            "poetry": {
                "name": "Poesía",
                "description": "Ritmo, rima y musicalidad en las palabras",
                "examples": ["Rimas consonantes", "Aliteraciones", "Ritmo métrico"]
            },
            "narrative": {
                "name": "Narrativa Coherente",
                "description": "Historia clara con inicio, desarrollo y conclusión",
                "examples": ["Estructura temporal", "Personajes definidos", "Arco narrativo"]
            }
        }
    
    async def generate_lyrics_with_qwen(self, config: Dict) -> Dict:
        """Generar letras usando Qwen con recursos literarios"""
        try:
            theme = config.get("theme", "")
            mood = config.get("mood", "neutral")
            language = config.get("language", "spanish")
            length = config.get("length", "medium")
            expressiveness = config.get("expressiveness", 50)
            literary_resources = config.get("literary_resources", {})
            
            # Construir prompt para Qwen
            prompt = self._build_lyrics_prompt(
                theme, mood, language, length, expressiveness, literary_resources
            )
            
            # Llamar a Qwen
            lyrics = await self._call_qwen_for_lyrics(prompt)
            
            if lyrics:
                return {
                    "success": True,
                    "lyrics": lyrics,
                    "config_used": config,
                    "resources_applied": literary_resources
                }
            else:
                return self._get_fallback_lyrics(theme, mood, language)
                
        except Exception as e:
            logger.error(f"Error generando letras: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def improve_lyrics(self, original_lyrics: str, improvements: List[str], expressiveness: int) -> Dict:
        """Mejorar letras existentes alineando métricas y reduciendo repeticiones"""
        try:
            improvement_prompt = f"""
            Actúa como un experto letrista y poeta. Mejora las siguientes letras aplicando estas mejoras:
            
            Mejoras solicitadas: {', '.join(improvements)}
            Nivel de expresividad: {expressiveness}/100
            
            Letras originales:
            {original_lyrics}
            
            Instrucciones específicas:
            - Si 'align_metrics' está incluido: Alinea la métrica y el ritmo de los versos
            - Si 'reduce_repetition' está incluido: Reduce palabras y frases repetitivas
            - Si 'improve_cadence' está incluido: Mejora la cadencia y fluidez
            - Si 'enhance_rhyme_scheme' está incluido: Fortalece el esquema de rimas
            - Si 'strengthen_narrative' está incluido: Mejora la coherencia narrativa
            
            Mantén la esencia y el mensaje original, pero hazlo más pulido y profesional.
            Responde solo con las letras mejoradas.
            """
            
            improved_lyrics = await self._call_qwen_api(improvement_prompt)
            
            if improved_lyrics:
                return {
                    "success": True,
                    "improved_lyrics": improved_lyrics,
                    "improvements_applied": improvements,
                    "original_lyrics": original_lyrics
                }
            else:
                return {
                    "success": False,
                    "error": "No se pudieron mejorar las letras"
                }
                
        except Exception as e:
            logger.error(f"Error mejorando letras: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_prompt_from_style(self, style: str, title: str = "", has_lyrics: bool = False) -> Dict:
        """Generar prompt basado en estilo musical"""
        try:
            prompt_generation = f"""
            Crea un prompt detallado para generar música con las siguientes características:
            
            Estilo musical: {style}
            Título: {title if title else "Sin título"}
            Incluye letras: {"Sí" if has_lyrics else "No"}
            
            El prompt debe incluir:
            - Género musical específico
            - Instrumentación detallada
            - Características de producción
            - Ambiente y mood
            - Elementos técnicos (BPM, tonalidad si es relevante)
            
            Responde solo con el prompt, máximo 200 palabras.
            """
            
            generated_prompt = await self._call_qwen_api(prompt_generation)
            
            if generated_prompt:
                return {
                    "success": True,
                    "prompt": generated_prompt,
                    "based_on": {"style": style, "title": title}
                }
            else:
                return self._get_fallback_prompt(style)
                
        except Exception as e:
            logger.error(f"Error generando prompt: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_random_creative_prompt(self, style: str = "any") -> Dict:
        """Generar prompt aleatorio creativo"""
        try:
            random_prompt_request = f"""
            Crea un prompt musical completamente creativo e inesperado.
            
            Estilo base: {style if style != "any" else "cualquier género"}
            
            Incluye elementos únicos como:
            - Combinaciones de géneros inusuales
            - Instrumentos no convencionales
            - Ambientes sonoros creativos
            - Conceptos artísticos innovadores
            
            Sé creativo y sorprendente. Responde solo con el prompt.
            """
            
            creative_prompt = await self._call_qwen_api(random_prompt_request)
            
            if creative_prompt:
                return {
                    "success": True,
                    "prompt": creative_prompt,
                    "type": "random_creative"
                }
            else:
                return self._get_random_fallback_prompt()
                
        except Exception as e:
            logger.error(f"Error generando prompt aleatorio: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_complete_music(self, config: Dict, lyrics_config: Dict) -> Dict:
        """Generar música completa con The Creator"""
        try:
            # Construir prompt final
            if config.get("useCustomPrompt") and config.get("customPrompt"):
                base_prompt = config["customPrompt"]
            else:
                base_prompt = f"Canción de {config.get('style', 'música')} "
                if config.get("title"):
                    base_prompt += f"titulada '{config['title']}'"
            
            # Agregar información de letras si existen
            if config.get("lyrics"):
                base_prompt += f". Con letras en {lyrics_config.get('language', 'español')}"
                base_prompt += f", mood {lyrics_config.get('mood', 'neutral')}"
            
            # Traducir al inglés
            english_prompt = await self._translate_to_english(base_prompt)
            
            # Generar con Suno
            generated_audio = await self._generate_with_suno(english_prompt, config)
            
            return {
                "success": True,
                "track": {
                    "audio_url": generated_audio["url"],
                    "title": config.get("title", "Nueva Creación"),
                    "duration": generated_audio["duration"],
                    "quality": "professional",
                    "style": config.get("style"),
                    "lyrics": config.get("lyrics"),
                    "prompt_used": base_prompt,
                    "english_prompt": english_prompt,
                    "created_at": generated_audio["created_at"]
                }
            }
            
        except Exception as e:
            logger.error(f"Error generando música completa: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _build_lyrics_prompt(self, theme: str, mood: str, language: str, 
                           length: str, expressiveness: int, resources: Dict) -> str:
        """Construir prompt para generación de letras"""
        
        prompt = f"""
        Actúa como un letrista profesional y poeta experto. Crea letras de canción con las siguientes características:
        
        Tema: {theme}
        Estado de ánimo: {mood}
        Idioma: {language}
        Longitud: {length}
        Nivel de expresividad: {expressiveness}/100
        
        Recursos literarios a aplicar según el nivel de expresividad:
        """
        
        for resource, level in resources.items():
            resource_info = self.literary_resources.get(resource, {})
            if level == 'high':
                prompt += f"\n- {resource_info.get('name', resource)}: Usar abundantemente"
            elif level == 'medium':
                prompt += f"\n- {resource_info.get('name', resource)}: Usar moderadamente"
            elif level == 'low':
                prompt += f"\n- {resource_info.get('name', resource)}: Usar sutilmente"
        
        prompt += f"""
        
        Estructura sugerida según longitud:
        - Short: 1-2 versos + coro
        - Medium: 2-3 versos + coro + puente opcional
        - Long: 3+ versos + coro + puente + outro
        
        Requisitos:
        1. Coherencia narrativa clara
        2. Rimas naturales y fluidas
        3. Métrica consistente
        4. Lenguaje poético pero accesible
        5. Emoción auténtica
        
        Responde solo con las letras, sin explicaciones adicionales.
        """
        
        return prompt
    
    async def _call_qwen_api(self, prompt: str) -> Optional[str]:
        """Llamar a la API de Qwen"""
        try:
            payload = {
                "model": "qwen2.5",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.8,
                    "top_p": 0.9,
                    "max_tokens": 1000
                }
            }
            
            response = requests.post(
                self.qwen_api_url,
                json=payload,
                timeout=45
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "").strip()
            else:
                logger.warning(f"Qwen API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error llamando a Qwen: {e}")
            return None
    
    async def _call_qwen_for_lyrics(self, prompt: str) -> Optional[str]:
        """Llamada específica para generación de letras"""
        return await self._call_qwen_api(prompt)
    
    async def _translate_to_english(self, spanish_text: str) -> str:
        """Traducir texto al inglés para Suno"""
        translation_prompt = f"""
        Traduce el siguiente prompt musical al inglés manteniendo todos los términos técnicos y musicales correctos:
        
        {spanish_text}
        
        Responde solo con la traducción en inglés.
        """
        
        english_text = await self._call_qwen_api(translation_prompt)
        
        if english_text:
            return english_text
        else:
            # Fallback básico
            return self._basic_spanish_to_english(spanish_text)
    
    async def _generate_with_suno(self, prompt: str, config: Dict) -> Dict:
        """Generar música con Suno API"""
        try:
            suno_config = {
                "prompt": prompt,
                "title": config.get("title", ""),
                "lyrics": config.get("lyrics", ""),
                "style": config.get("style", ""),
                "duration": 180,
                "quality": "high"
            }
            
            # En producción, llamar a Suno real
            # response = requests.post(self.suno_api_url, json=suno_config)
            
            # Simular por ahora
            await asyncio.sleep(3)
            
            return {
                "url": f"/api/audio/creator_generated_{int(asyncio.get_event_loop().time())}.wav",
                "duration": "3:00",
                "created_at": asyncio.get_event_loop().time()
            }
            
        except Exception as e:
            logger.error(f"Error con Suno: {e}")
            raise
    
    def _basic_spanish_to_english(self, text: str) -> str:
        """Traducción básica español-inglés"""
        translations = {
            "canción": "song", "música": "music", "guitarra": "guitar",
            "piano": "piano", "batería": "drums", "bajo": "bass",
            "voz": "vocals", "coro": "chorus", "verso": "verse",
            "amor": "love", "corazón": "heart", "vida": "life",
            "sueño": "dream", "tiempo": "time", "noche": "night",
            "día": "day", "sol": "sun", "luna": "moon",
            "expresivo": "expressive", "emocional": "emotional",
            "melancólico": "melancholic", "feliz": "happy",
            "triste": "sad", "enérgico": "energetic"
        }
        
        english_text = text.lower()
        for spanish, english in translations.items():
            english_text = english_text.replace(spanish, english)
        
        return english_text
    
    def _get_fallback_lyrics(self, theme: str, mood: str, language: str) -> Dict:
        """Letras de respaldo si falla Qwen"""
        fallback_lyrics = {
            "spanish": f"""
            [Verso 1]
            En este mundo de {theme.lower() if theme else 'sueños'}
            Donde el {mood} se hace canción
            Cada nota cuenta una historia
            Cada acorde, una emoción
            
            [Coro]
            Y seguimos adelante
            Con la música en el corazón
            Creando nuevos caminos
            Con cada nueva canción
            
            [Verso 2]
            Las palabras se vuelven melodía
            Los sentimientos, armonía
            En este espacio de creación
            Donde nace la poesía
            """,
            "english": f"""
            [Verse 1]
            In this world of {theme.lower() if theme else 'dreams'}
            Where {mood} becomes a song
            Every note tells a story
            Every chord, an emotion strong
            
            [Chorus]
            And we keep moving forward
            With music in our heart
            Creating new pathways
            With every brand new start
            
            [Verse 2]
            Words become melody
            Feelings turn to harmony
            In this space of creation
            Where poetry runs free
            """
        }
        
        return {
            "success": True,
            "lyrics": fallback_lyrics.get(language, fallback_lyrics["spanish"]),
            "source": "fallback"
        }
    
    def _get_fallback_prompt(self, style: str) -> Dict:
        """Prompt de respaldo"""
        prompts = {
            "Indie Rock": "Indie rock song with jangly guitars, driving drums, and heartfelt vocals",
            "Electronic": "Electronic music with synthesizers, drum machines, and atmospheric pads",
            "Hip-Hop": "Hip-hop track with strong beats, bass, and rhythmic vocals",
            "Pop": "Pop song with catchy melody, modern production, and radio-friendly sound"
        }
        
        return {
            "success": True,
            "prompt": prompts.get(style, "Musical composition with professional production"),
            "source": "fallback"
        }
    
    def _get_random_fallback_prompt(self) -> Dict:
        """Prompt aleatorio de respaldo"""
        random_prompts = [
            "Dreamy synthwave track with nostalgic melodies and retro atmosphere",
            "Energetic funk song with groovy bass lines and tight drums",
            "Ambient electronic piece with ethereal pads and subtle percussion",
            "Acoustic folk ballad with fingerpicked guitar and intimate vocals",
            "Jazz fusion instrumental with complex harmonies and improvisation",
            "Lo-fi hip-hop beat with vinyl crackle and mellow vibes"
        ]
        
        return {
            "success": True,
            "prompt": random.choice(random_prompts),
            "type": "random_fallback"
        }
    
    def get_musical_styles(self) -> List[str]:
        """Obtener lista de estilos musicales"""
        return [
            'Indie Rock', 'Electronic Pop', 'Hip-Hop', 'Reggaeton', 'Trap',
            'Folk Acoustic', 'Jazz Fusion', 'Synthwave', 'Lo-Fi Hip-Hop',
            'Alternative Rock', 'Dream Pop', 'Bedroom Pop', 'Ambient',
            'Latin Pop', 'Bossa Nova', 'Funk', 'Soul', 'R&B', 'Blues',
            'Country', 'Reggae', 'Ska', 'Punk', 'Metal', 'Classical'
        ]
    
    def get_random_themes(self) -> List[str]:
        """Obtener temas aleatorios para letras"""
        return [
            'Un amor perdido en la ciudad',
            'La lucha contra las adversidades', 
            'Nostalgia por los días de juventud',
            'Sueños que se hacen realidad',
            'La belleza de lo imperfecto',
            'Resistencia contra el sistema',
            'Encuentro con uno mismo',
            'La magia de los pequeños momentos',
            'Viaje hacia lo desconocido',
            'La fuerza de la amistad',
            'Libertad y autodescubrimiento',
            'El paso del tiempo',
            'Conexión con la naturaleza',
            'Superación personal',
            'Amor incondicional'
        ]
    
    def get_literary_resources_info(self) -> Dict:
        """Obtener información de recursos literarios"""
        return self.literary_resources
