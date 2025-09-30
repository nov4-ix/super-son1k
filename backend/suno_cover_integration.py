#!/usr/bin/env python3
"""
🎵 Suno Cover Integration - Integración REAL con Suno Cover
Sistema de generación de covers usando Suno AI
"""

import requests
import json
import logging
import time
import random
from typing import Dict, List, Optional
from prompt_translator import translate_music_prompt

logger = logging.getLogger(__name__)

class SunoCoverIntegration:
    def __init__(self):
        self.base_url = "https://suno.com"
        self.api_endpoints = {
            "generate": "/api/generate",
            "status": "/api/status",
            "download": "/api/download"
        }
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
        ]
        self.session = requests.Session()
        
    def generate_cover(self, 
                      original_song: str,
                      style: str = "cover",
                      language: str = "es",
                      duration: int = 30) -> Dict:
        """
        Generar cover REAL usando Suno Cover
        """
        try:
            # Traducir prompt si es necesario
            if language == "es":
                translation = translate_music_prompt(f"Crea un cover de '{original_song}' en estilo {style}")
                if translation["success"]:
                    prompt = translation["english"]
                else:
                    prompt = f"Create a {style} cover of '{original_song}'"
            else:
                prompt = f"Create a {style} cover of '{original_song}'"
            
            # Preparar datos para Suno
            payload = {
                "prompt": prompt,
                "style": style,
                "duration": duration,
                "language": language,
                "model": "suno-v3",
                "custom_mode": True
            }
            
            # Headers con rotación de User-Agent
            headers = {
                "User-Agent": random.choice(self.user_agents),
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Referer": "https://suno.com/create"
            }
            
            # Enviar solicitud a Suno
            response = self.session.post(
                f"{self.base_url}{self.api_endpoints['generate']}",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Procesar respuesta de Suno
                if "id" in result:
                    job_id = result["id"]
                    
                    # Monitorear progreso
                    status = self._monitor_generation(job_id)
                    
                    return {
                        "success": True,
                        "job_id": job_id,
                        "status": status,
                        "original_song": original_song,
                        "style": style,
                        "prompt_used": prompt,
                        "translation": translation if language == "es" else None
                    }
                else:
                    return {
                        "success": False,
                        "error": "No job ID received from Suno",
                        "response": result
                    }
            else:
                return {
                    "success": False,
                    "error": f"Suno API error: {response.status_code}",
                    "response": response.text
                }
                
        except Exception as e:
            logger.error(f"Error generando cover: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _monitor_generation(self, job_id: str, max_wait: int = 300) -> Dict:
        """
        Monitorear progreso de generación
        """
        start_time = time.time()
        
        while time.time() - start_time < max_wait:
            try:
                # Verificar estado
                status_response = self.session.get(
                    f"{self.base_url}{self.api_endpoints['status']}/{job_id}",
                    headers={"User-Agent": random.choice(self.user_agents)},
                    timeout=10
                )
                
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    
                    if status_data.get("status") == "completed":
                        # Generación completada
                        return {
                            "status": "completed",
                            "audio_url": status_data.get("audio_url"),
                            "metadata": status_data.get("metadata", {}),
                            "generation_time": time.time() - start_time
                        }
                    elif status_data.get("status") == "failed":
                        return {
                            "status": "failed",
                            "error": status_data.get("error", "Unknown error"),
                            "generation_time": time.time() - start_time
                        }
                    else:
                        # Aún procesando
                        time.sleep(5)
                        continue
                else:
                    logger.warning(f"Error checking status: {status_response.status_code}")
                    time.sleep(5)
                    continue
                    
            except Exception as e:
                logger.error(f"Error monitoring generation: {e}")
                time.sleep(5)
                continue
        
        # Timeout
        return {
            "status": "timeout",
            "error": "Generation timeout",
            "generation_time": time.time() - start_time
        }
    
    def download_audio(self, audio_url: str) -> Dict:
        """
        Descargar audio generado
        """
        try:
            response = self.session.get(
                audio_url,
                headers={"User-Agent": random.choice(self.user_agents)},
                timeout=30
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "audio_data": response.content,
                    "content_type": response.headers.get("content-type", "audio/mpeg"),
                    "size": len(response.content)
                }
            else:
                return {
                    "success": False,
                    "error": f"Download failed: {response.status_code}"
                }
                
        except Exception as e:
            logger.error(f"Error downloading audio: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_available_styles(self) -> List[str]:
        """
        Obtener estilos disponibles para covers
        """
        return [
            "acoustic", "rock", "pop", "jazz", "blues", "country",
            "electronic", "hip-hop", "classical", "reggae", "folk",
            "metal", "punk", "funk", "soul", "r&b", "gospel",
            "latin", "world", "ambient", "experimental"
        ]

# Instancia global
suno_cover = SunoCoverIntegration()

def generate_suno_cover(original_song: str, style: str = "cover", language: str = "es") -> Dict:
    """Función de conveniencia para generar covers"""
    return suno_cover.generate_cover(original_song, style, language)
