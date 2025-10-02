#!/usr/bin/env python3
"""
👻 Ghost Studio Service
Servicio que democratiza la música - Analizador + Generador + Traductor
Transforma cualquier maqueta en producción profesional
"""

import asyncio
import os
import json
import requests
from pathlib import Path
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class GhostStudioService:
    """Servicio completo de Ghost Studio"""
    
    def __init__(self):
        self.temp_dir = Path("temp/ghost_studio")
        self.output_dir = Path("output/ghost_studio")
        self.models_dir = Path("models/audio_analysis")
        
        # Crear directorios
        for directory in [self.temp_dir, self.output_dir, self.models_dir]:
            directory.mkdir(parents=True, exist_ok=True)
        
        # URLs de servicios
        self.suno_api_url = "https://api.suno.ai/generate"  # API de Suno
        self.translation_api_url = "http://localhost:11434/api/generate"  # Ollama para traducción
        
        # Configuración de análisis de audio
        self.analysis_models = {
            "genre_classifier": "models/genre_classifier.pkl",
            "bpm_detector": "librosa",
            "key_detector": "librosa + chromagram",
            "structure_analyzer": "madmom + librosa"
        }
    
    async def analyze_audio_track(self, audio_file_path: str, settings: Dict) -> Dict:
        """Analizar pista de audio con IA"""
        try:
            logger.info(f"Analizando pista: {audio_file_path}")
            
            # En producción, usar librosa, madmom, y modelos de ML
            analysis = await self._perform_audio_analysis(audio_file_path)
            
            # Generar sugerencias basadas en análisis
            suggestions = await self._generate_arrangement_suggestions(analysis, settings)
            
            return {
                "success": True,
                "analysis": {
                    **analysis,
                    **suggestions
                }
            }
            
        except Exception as e:
            logger.error(f"Error analizando audio: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_professional_track(self, 
                                        original_analysis: Dict, 
                                        arrangement_knobs: Dict, 
                                        analysis_settings: Dict,
                                        custom_prompt: str = None) -> Dict:
        """Generar pista profesional con Ghost Studio"""
        try:
            logger.info("Iniciando generación con Ghost Studio")
            
            # 1. Construir prompt inteligente
            prompt = custom_prompt or await self._build_intelligent_prompt(
                original_analysis, 
                arrangement_knobs, 
                analysis_settings
            )
            
            # 2. Traducir prompt al inglés para Suno
            english_prompt = await self._translate_prompt_to_english(prompt)
            
            # 3. Generar con Suno API
            generated_audio = await self._generate_with_suno(english_prompt, original_analysis)
            
            # 4. Post-procesar si es necesario
            final_audio = await self._post_process_generated_audio(
                generated_audio, 
                arrangement_knobs
            )
            
            return {
                "success": True,
                "generated_track": {
                    "audio_url": final_audio["url"],
                    "duration": final_audio["duration"],
                    "quality": "professional",
                    "format": "wav",
                    "processing_time": final_audio["processing_time"],
                    "original_prompt": prompt,
                    "english_prompt": english_prompt,
                    "knobs_applied": arrangement_knobs,
                    "suno_response": generated_audio.get("metadata", {})
                }
            }
            
        except Exception as e:
            logger.error(f"Error generando pista: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _perform_audio_analysis(self, audio_path: str) -> Dict:
        """Realizar análisis completo de audio"""
        try:
            # En producción, usar librosa y otros
            # import librosa
            # y, sr = librosa.load(audio_path)
            # tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            # chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            # key = detect_key_from_chroma(chroma)
            
            # Simular análisis por ahora
            await asyncio.sleep(2)
            
            return {
                "genre": "Indie Rock",
                "genre_confidence": 87,
                "bpm": 128,
                "key": "C Major",
                "scale": "Major",
                "structure": "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
                "duration": 180,
                "instruments_detected": ["guitar", "vocals", "basic_drums"],
                "energy_level": 0.7,
                "danceability": 0.6,
                "acousticness": 0.4,
                "valence": 0.8
            }
            
        except Exception as e:
            logger.error(f"Error en análisis de audio: {e}")
            raise
    
    async def _generate_arrangement_suggestions(self, analysis: Dict, settings: Dict) -> Dict:
        """Generar sugerencias de arreglo basadas en análisis"""
        try:
            # Sugerir instrumentos basado en género y estructura
            genre_instruments = {
                "Indie Rock": ["electric_guitar", "bass_guitar", "drums", "synthesizer", "backing_vocals"],
                "Electronic": ["synthesizer", "drum_machine", "bass_synth", "pad", "arp"],
                "Hip-Hop": ["drums", "bass", "piano", "strings", "vocal_chops"],
                "Pop": ["piano", "guitar", "bass", "drums", "strings", "synth_pad"]
            }
            
            suggested_instruments = genre_instruments.get(
                analysis.get("genre", "Pop"), 
                ["piano", "guitar", "bass", "drums"]
            )
            
            # Sugerencias de arreglo
            arrangement_suggestions = [
                f"Agregar {', '.join(suggested_instruments[:3])} para enriquecer la base rítmica",
                f"Incorporar armonías vocales en el coro",
                f"Añadir break instrumental en el puente",
                f"Mejorar la dinámica entre verso y coro"
            ]
            
            return {
                "suggested_instruments": suggested_instruments,
                "arrangement_suggestions": arrangement_suggestions,
                "complexity_level": "intermediate",
                "estimated_generation_time": "45-60 segundos"
            }
            
        except Exception as e:
            logger.error(f"Error generando sugerencias: {e}")
            raise
    
    async def _build_intelligent_prompt(self, analysis: Dict, knobs: Dict, settings: Dict) -> str:
        """Construir prompt inteligente basado en análisis y perillas"""
        try:
            prompt_parts = []
            
            # Base del género (si se preserva)
            if settings.get("preserveGenre", True):
                prompt_parts.append(f"Canción de {analysis.get('genre', 'música')}")
            
            # BPM (si se preserva)
            if settings.get("preserveBPM", True):
                prompt_parts.append(f"a {analysis.get('bpm', 120)} BPM")
            
            # Tonalidad (si se preserva)
            if settings.get("preserveKey", True):
                prompt_parts.append(f"en {analysis.get('key', 'C Major')}")
            
            # Aplicar perillas características
            if knobs.get("expresividad", 0) > 70:
                prompt_parts.append("con interpretación muy expresiva y emocional")
            
            if knobs.get("rareza", 0) > 70:
                prompt_parts.append("con elementos únicos e inesperados")
            
            if knobs.get("trash", 0) > 60:
                prompt_parts.append("con texturas lo-fi y carácter sucio")
            
            if knobs.get("garage", 0) > 70:
                prompt_parts.append("con estética garage cruda y auténtica")
            
            if knobs.get("vintage", 0) > 70:
                prompt_parts.append("con sonidos vintage y analógicos")
            
            if knobs.get("experimental", 0) > 70:
                prompt_parts.append("con elementos experimentales y vanguardistas")
            
            if knobs.get("groove", 0) > 80:
                prompt_parts.append("extremadamente groovy y rítmico")
            
            if knobs.get("atmosphere", 0) > 70:
                prompt_parts.append("con ricas texturas atmosféricas")
            
            # Instrumentación (si se mejora)
            if settings.get("enhanceInstrumentation", True):
                instruments = analysis.get("suggested_instruments", [])
                if instruments:
                    prompt_parts.append(f"con {', '.join(instruments[:3])}")
            
            # Arreglo profesional
            if settings.get("addArrangement", True):
                prompt_parts.append("con arreglo y producción profesional")
            
            # Unir todas las partes
            prompt = ", ".join(prompt_parts)
            
            # Agregar contexto de calidad
            prompt += ". Producción de alta calidad, mezcla profesional, masterización completa."
            
            return prompt
            
        except Exception as e:
            logger.error(f"Error construyendo prompt: {e}")
            return "Canción con producción profesional"
    
    async def _translate_prompt_to_english(self, spanish_prompt: str) -> str:
        """Traducir prompt al inglés para mejor respuesta de Suno"""
        try:
            translation_prompt = f"""
            Traduce el siguiente prompt musical al inglés de manera precisa y técnica.
            Mantén todos los términos musicales y técnicos correctos.
            
            Prompt en español: {spanish_prompt}
            
            Responde solo con la traducción en inglés, sin explicaciones adicionales.
            """
            
            response = await self._call_translation_api(translation_prompt)
            
            if response and response.strip():
                return response.strip()
            else:
                # Fallback: traducción básica
                return self._basic_translation(spanish_prompt)
                
        except Exception as e:
            logger.error(f"Error traduciendo prompt: {e}")
            return self._basic_translation(spanish_prompt)
    
    async def _generate_with_suno(self, english_prompt: str, analysis: Dict) -> Dict:
        """Generar audio con Suno API"""
        try:
            logger.info(f"Generando con Suno: {english_prompt}")
            
            # Configuración para Suno
            suno_config = {
                "prompt": english_prompt,
                "duration": min(analysis.get("duration", 180), 240),  # Máximo 4 minutos
                "style": analysis.get("genre", "pop"),
                "bpm": analysis.get("bpm", 120),
                "key": analysis.get("key", "C"),
                "quality": "high",
                "format": "wav"
            }
            
            # En producción, llamar a Suno API real
            # response = requests.post(self.suno_api_url, json=suno_config)
            
            # Simular generación por ahora
            await asyncio.sleep(3)
            
            return {
                "audio_url": f"/api/audio/ghost_studio_generated_{int(asyncio.get_event_loop().time())}.wav",
                "duration": suno_config["duration"],
                "metadata": {
                    "prompt_used": english_prompt,
                    "suno_config": suno_config,
                    "generation_id": f"suno_{int(asyncio.get_event_loop().time())}"
                }
            }
            
        except Exception as e:
            logger.error(f"Error con Suno API: {e}")
            raise
    
    async def _post_process_generated_audio(self, generated_audio: Dict, knobs: Dict) -> Dict:
        """Post-procesar audio generado según perillas"""
        try:
            # Aplicar post-procesamiento basado en perillas
            processing_effects = []
            
            if knobs.get("trash", 0) > 60:
                processing_effects.append("lo_fi_filter")
            
            if knobs.get("vintage", 0) > 70:
                processing_effects.append("tape_saturation")
            
            if knobs.get("atmosphere", 0) > 70:
                processing_effects.append("ambient_reverb")
            
            # En producción, aplicar efectos reales
            # processed_url = await self._apply_post_effects(generated_audio["audio_url"], processing_effects)
            
            # Simular procesamiento
            await asyncio.sleep(1)
            
            return {
                "url": generated_audio["audio_url"],
                "duration": f"{generated_audio['duration']}s",
                "processing_time": "15s",
                "effects_applied": processing_effects
            }
            
        except Exception as e:
            logger.error(f"Error en post-procesamiento: {e}")
            raise
    
    async def _call_translation_api(self, prompt: str) -> Optional[str]:
        """Llamar API de traducción (Ollama)"""
        try:
            payload = {
                "model": "qwen2.5",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,  # Baja temperatura para traducción precisa
                    "top_p": 0.9,
                    "max_tokens": 500
                }
            }
            
            response = requests.post(
                self.translation_api_url,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", "").strip()
            else:
                logger.warning(f"Translation API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error llamando API de traducción: {e}")
            return None
    
    def _basic_translation(self, spanish_prompt: str) -> str:
        """Traducción básica de respaldo"""
        translations = {
            "canción": "song",
            "música": "music",
            "guitarra": "guitar",
            "piano": "piano",
            "batería": "drums",
            "bajo": "bass",
            "voz": "vocals",
            "coro": "chorus",
            "verso": "verse",
            "puente": "bridge",
            "expresiva": "expressive",
            "emocional": "emotional",
            "experimental": "experimental",
            "vintage": "vintage",
            "garage": "garage",
            "atmosférica": "atmospheric",
            "profesional": "professional",
            "producción": "production",
            "mezcla": "mixing",
            "masterización": "mastering",
            "indie": "indie",
            "rock": "rock",
            "pop": "pop",
            "electrónica": "electronic",
            "hip-hop": "hip-hop",
            "jazz": "jazz",
            "clásica": "classical",
            "folk": "folk",
            "reggaeton": "reggaeton",
            "trap": "trap"
        }
        
        english_prompt = spanish_prompt.lower()
        for spanish, english in translations.items():
            english_prompt = english_prompt.replace(spanish, english)
        
        return english_prompt
    
    def get_knob_descriptions(self) -> Dict:
        """Obtener descripciones de las perillas características"""
        return {
            "expresividad": {
                "name": "Expresividad",
                "description": "Intensidad emocional y expresiva de la interpretación",
                "low": "Interpretación contenida y sutil",
                "high": "Interpretación muy expresiva y emocional"
            },
            "rareza": {
                "name": "Rareza", 
                "description": "Elementos únicos, inesperados y creativos",
                "low": "Arreglo convencional y predecible",
                "high": "Elementos únicos e inesperados"
            },
            "trash": {
                "name": "Trash",
                "description": "Texturas lo-fi, imperfecciones y carácter 'sucio'",
                "low": "Sonido limpio y pulido",
                "high": "Texturas lo-fi y gritty"
            },
            "garage": {
                "name": "Garage",
                "description": "Estética cruda, indie y auténtica",
                "low": "Producción pulida y comercial",
                "high": "Estética garage cruda y auténtica"
            },
            "vintage": {
                "name": "Vintage",
                "description": "Sonidos retro, analógicos y nostálgicos",
                "low": "Sonidos modernos y digitales",
                "high": "Sonidos vintage y analógicos"
            },
            "experimental": {
                "name": "Experimental",
                "description": "Elementos vanguardistas y experimentales",
                "low": "Estructura musical tradicional",
                "high": "Elementos experimentales y vanguardistas"
            },
            "groove": {
                "name": "Groove",
                "description": "Qué tan 'groovy' y rítmico será el resultado",
                "low": "Ritmo básico y directo",
                "high": "Extremadamente groovy y rítmico"
            },
            "atmosphere": {
                "name": "Atmosphere",
                "description": "Ambiente, texturas y espacialidad sonora",
                "low": "Sonido directo y seco",
                "high": "Ricas texturas atmosféricas"
            }
        }
    
    def get_analysis_presets(self) -> Dict:
        """Obtener presets de análisis para diferentes estilos"""
        return {
            "preserve_original": {
                "name": "Preservar Original",
                "description": "Mantiene la esencia de tu maqueta",
                "settings": {
                    "preserveGenre": True,
                    "preserveBPM": True, 
                    "preserveKey": True,
                    "preserveStructure": True,
                    "enhanceInstrumentation": True,
                    "addArrangement": True
                }
            },
            "creative_freedom": {
                "name": "Libertad Creativa",
                "description": "Permite cambios completos de género y estilo",
                "settings": {
                    "preserveGenre": False,
                    "preserveBPM": False,
                    "preserveKey": False, 
                    "preserveStructure": False,
                    "enhanceInstrumentation": True,
                    "addArrangement": True
                }
            },
            "enhance_only": {
                "name": "Solo Mejorar",
                "description": "Mejora calidad sin cambiar la esencia",
                "settings": {
                    "preserveGenre": True,
                    "preserveBPM": True,
                    "preserveKey": True,
                    "preserveStructure": True,
                    "enhanceInstrumentation": True,
                    "addArrangement": False
                }
            }
        }
    
    def validate_audio_file(self, file_path: str) -> Dict:
        """Validar archivo de audio"""
        try:
            # En producción, usar librosa o similar para validar
            file_size = os.path.getsize(file_path)
            
            if file_size > 50 * 1024 * 1024:  # 50MB
                return {
                    "valid": False,
                    "error": "Archivo demasiado grande (máx. 50MB)"
                }
            
            # Verificar formato
            valid_extensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg']
            if not any(file_path.lower().endswith(ext) for ext in valid_extensions):
                return {
                    "valid": False,
                    "error": "Formato no soportado"
                }
            
            return {
                "valid": True,
                "size_mb": file_size / 1024 / 1024,
                "format": Path(file_path).suffix
            }
            
        except Exception as e:
            logger.error(f"Error validando archivo: {e}")
            return {
                "valid": False,
                "error": str(e)
            }
