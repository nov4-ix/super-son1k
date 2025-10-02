#!/usr/bin/env python3
"""
🌐 Prompt Translator - Traductor de Prompts Español → Inglés
Sistema REAL de traducción usando Ollama para Suno Cover
"""

import requests
import json
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class PromptTranslator:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model = "qwen2.5:7b"
        
        # Cache de traducciones para evitar re-traducir prompts comunes
        self.translation_cache = {}
        
        # Patrones para detectar si un prompt ya está en inglés
        self.english_indicators = [
            'verse', 'chorus', 'bridge', 'intro', 'outro',
            'guitar', 'drums', 'bass', 'vocals', 'piano',
            'rock', 'pop', 'jazz', 'blues', 'electronic',
            'the', 'and', 'with', 'about', 'love', 'song'
        ]
        
    def translate_prompt(self, spanish_prompt: str) -> Dict[str, str]:
        """
        Traducir prompt de español a inglés para Suno Cover
        Automático e invisible al usuario
        """
        try:
            # Verificar cache primero
            if spanish_prompt in self.translation_cache:
                cached = self.translation_cache[spanish_prompt]
                return {
                    "success": True,
                    "spanish": spanish_prompt,
                    "english": cached,
                    "model": self.model,
                    "cached": True
                }
            
            # Detectar si ya está en inglés
            if self._is_likely_english(spanish_prompt):
                return {
                    "success": True,
                    "spanish": spanish_prompt,
                    "english": spanish_prompt,  # No traducir
                    "model": self.model,
                    "already_english": True
                }
            
            # Crear prompt de traducción específico para música
            translation_prompt = f"""
Traduce este prompt musical de español a inglés para Suno AI. 
Mantén el estilo musical, género, tempo y emociones.
Solo devuelve la traducción en inglés, sin explicaciones.

Prompt en español: "{spanish_prompt}"

Traducción en inglés:"""

            # Llamar a Ollama
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": translation_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "top_p": 0.9,
                        "max_tokens": 200
                    }
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                english_prompt = result.get("response", "").strip()
                
                # Limpiar la respuesta
                english_prompt = self._clean_translation(english_prompt)
                
                # Guardar en cache
                self.translation_cache[spanish_prompt] = english_prompt
                
                return {
                    "success": True,
                    "spanish": spanish_prompt,
                    "english": english_prompt,
                    "model": self.model,
                    "cached": False
                }
            else:
                logger.error(f"Error en traducción: {response.status_code}")
                return {
                    "success": False,
                    "error": f"Error de Ollama: {response.status_code}",
                    "spanish": spanish_prompt,
                    "english": spanish_prompt  # Fallback
                }
                
        except Exception as e:
            logger.error(f"Error traduciendo prompt: {e}")
            return {
                "success": False,
                "error": str(e),
                "spanish": spanish_prompt,
                "english": spanish_prompt  # Fallback
            }
    
    def _clean_translation(self, text: str) -> str:
        """Limpiar la traducción de Ollama"""
        # Remover prefijos comunes
        prefixes = [
            "Traducción en inglés:",
            "English translation:",
            "Here's the translation:",
            "The English version is:"
        ]
        
        for prefix in prefixes:
            if text.startswith(prefix):
                text = text[len(prefix):].strip()
        
        # Remover comillas extra
        text = text.strip('"\'')
        
        return text
    
    def _is_likely_english(self, text: str) -> bool:
        """Detectar si el texto probablemente ya está en inglés"""
        text_lower = text.lower()
        english_word_count = 0
        total_words = len(text.split())
        
        if total_words == 0:
            return False
        
        # Contar palabras en inglés
        for indicator in self.english_indicators:
            if indicator in text_lower:
                english_word_count += text_lower.count(indicator)
        
        # Si más del 30% son palabras en inglés, probablemente ya está en inglés
        english_ratio = english_word_count / total_words
        return english_ratio > 0.3
    
    def auto_translate_for_suno(self, prompt: str) -> str:
        """
        Traducción automática para Suno - devuelve solo el prompt en inglés
        Método principal para usar en endpoints
        """
        result = self.translate_prompt(prompt)
        if result["success"]:
            return result["english"]
        else:
            # Fallback: devolver el prompt original si falla la traducción
            logger.warning(f"Traducción falló, usando prompt original: {result.get('error', 'Unknown error')}")
            return prompt
    
    def translate_batch(self, prompts: List[str]) -> List[Dict[str, str]]:
        """Traducir múltiples prompts"""
        results = []
        for prompt in prompts:
            result = self.translate_prompt(prompt)
            results.append(result)
        return results

# Instancia global
translator = PromptTranslator()

def translate_music_prompt(spanish_prompt: str) -> Dict[str, str]:
    """Función de conveniencia para traducir prompts musicales"""
    return translator.translate_prompt(spanish_prompt)

def auto_translate_for_suno(spanish_prompt: str) -> str:
    """Función de conveniencia para traducción automática a Suno"""
    return translator.auto_translate_for_suno(spanish_prompt)
