#!/usr/bin/env python3
"""
🌐 Auto Translation Service - Servicio de Traducción Automática
Integración transparente con Suno para traducir prompts automáticamente
El usuario ve prompts en español, pero se envían en inglés a Suno
"""

import logging
from typing import Dict, List, Optional, Tuple
from ..prompt_translator import auto_translate_for_suno, translator

logger = logging.getLogger(__name__)

class AutoTranslationService:
    """Servicio de traducción automática para Suno"""
    
    def __init__(self):
        self.enabled = True
        self.fallback_to_original = True
        
        # Prompts predefinidos en español con sus traducciones
        self.predefined_prompts = {
            # Géneros musicales
            "rock energético con guitarra eléctrica": "energetic rock with electric guitar",
            "balada romántica con piano": "romantic ballad with piano",
            "reggaeton moderno con bajo potente": "modern reggaeton with powerful bass",
            "jazz suave con saxofón": "smooth jazz with saxophone",
            "pop comercial pegadizo": "catchy commercial pop",
            "trap urbano con sintetizadores": "urban trap with synthesizers",
            "cumbia colombiana tradicional": "traditional colombian cumbia",
            "salsa brava con trompetas": "salsa brava with trumpets",
            "bachata sensual con guitarra": "sensual bachata with guitar",
            "merengue festivo y bailable": "festive and danceable merengue",
            
            # Emociones y estilos
            "canción triste y melancólica": "sad and melancholic song",
            "tema alegre y festivo": "happy and festive song",
            "música relajante y tranquila": "relaxing and calm music",
            "ritmo enérgico y motivador": "energetic and motivating rhythm",
            "ambiente nostálgico y emotivo": "nostalgic and emotional atmosphere",
            "sonido agresivo y potente": "aggressive and powerful sound",
            "melodía dulce y romántica": "sweet and romantic melody",
            "beat urbano y moderno": "urban and modern beat",
            
            # Instrumentos
            "con guitarra acústica": "with acoustic guitar",
            "con batería potente": "with powerful drums",
            "con bajo eléctrico": "with electric bass",
            "con piano clásico": "with classical piano",
            "con violín emotivo": "with emotional violin",
            "con trompeta brillante": "with bright trumpet",
            "con saxofón suave": "with smooth saxophone",
            "con sintetizadores modernos": "with modern synthesizers",
        }
    
    def process_prompt_for_suno(self, spanish_prompt: str, show_translation: bool = False) -> Dict[str, str]:
        """
        Procesar prompt para Suno: traducir automáticamente pero mostrar original al usuario
        
        Args:
            spanish_prompt: Prompt en español del usuario
            show_translation: Si mostrar la traducción al usuario (debug)
            
        Returns:
            Dict con prompt original y traducido
        """
        try:
            # Verificar si hay traducción predefinida
            english_prompt = self.predefined_prompts.get(spanish_prompt.lower())
            
            if not english_prompt:
                # Usar el traductor automático
                english_prompt = auto_translate_for_suno(spanish_prompt)
            
            result = {
                "original": spanish_prompt,  # Lo que ve el usuario
                "translated": english_prompt,  # Lo que se envía a Suno
                "success": True,
                "predefined": spanish_prompt.lower() in self.predefined_prompts
            }
            
            if show_translation:
                result["show_translation"] = True
            
            logger.info(f"Prompt procesado: '{spanish_prompt}' -> '{english_prompt}'")
            return result
            
        except Exception as e:
            logger.error(f"Error procesando prompt: {e}")
            return {
                "original": spanish_prompt,
                "translated": spanish_prompt if self.fallback_to_original else "",
                "success": False,
                "error": str(e)
            }
    
    def process_batch_prompts(self, spanish_prompts: List[str]) -> List[Dict[str, str]]:
        """Procesar múltiples prompts"""
        results = []
        for prompt in spanish_prompts:
            result = self.process_prompt_for_suno(prompt)
            results.append(result)
        return results
    
    def get_spanish_prompt_suggestions(self, category: str = "all") -> List[str]:
        """
        Obtener sugerencias de prompts en español para mostrar al usuario
        """
        suggestions = {
            "generos": [
                "rock energético con guitarra eléctrica",
                "balada romántica con piano",
                "reggaeton moderno con bajo potente",
                "jazz suave con saxofón",
                "pop comercial pegadizo",
                "trap urbano con sintetizadores",
                "cumbia colombiana tradicional",
                "salsa brava con trompetas"
            ],
            "emociones": [
                "canción triste y melancólica",
                "tema alegre y festivo",
                "música relajante y tranquila",
                "ritmo enérgico y motivador",
                "ambiente nostálgico y emotivo",
                "sonido agresivo y potente",
                "melodía dulce y romántica"
            ],
            "instrumentos": [
                "con guitarra acústica",
                "con batería potente",
                "con bajo eléctrico",
                "con piano clásico",
                "con violín emotivo",
                "con trompeta brillante",
                "con saxofón suave",
                "con sintetizadores modernos"
            ]
        }
        
        if category == "all":
            all_suggestions = []
            for cat_suggestions in suggestions.values():
                all_suggestions.extend(cat_suggestions)
            return all_suggestions
        
        return suggestions.get(category, [])
    
    def add_custom_translation(self, spanish: str, english: str) -> bool:
        """Agregar traducción personalizada"""
        try:
            self.predefined_prompts[spanish.lower()] = english
            logger.info(f"Traducción personalizada agregada: '{spanish}' -> '{english}'")
            return True
        except Exception as e:
            logger.error(f"Error agregando traducción personalizada: {e}")
            return False
    
    def get_translation_stats(self) -> Dict:
        """Obtener estadísticas de traducción"""
        return {
            "predefined_count": len(self.predefined_prompts),
            "cache_size": len(translator.translation_cache),
            "enabled": self.enabled,
            "fallback_enabled": self.fallback_to_original
        }
    
    def generate_spanish_prompt_buttons(self) -> List[Dict[str, str]]:
        """
        Generar botones de prompts en español para la interfaz
        Estos se muestran al usuario y se traducen automáticamente
        """
        buttons = [
            # Géneros populares
            {"text": "🎸 Rock Energético", "prompt": "rock energético con guitarra eléctrica y batería potente"},
            {"text": "💕 Balada Romántica", "prompt": "balada romántica con piano y cuerdas emotivas"},
            {"text": "🔥 Reggaeton Moderno", "prompt": "reggaeton moderno con bajo potente y sintetizadores"},
            {"text": "🎷 Jazz Suave", "prompt": "jazz suave con saxofón y piano relajante"},
            {"text": "⭐ Pop Comercial", "prompt": "pop comercial pegadizo con melodía memorable"},
            {"text": "🏙️ Trap Urbano", "prompt": "trap urbano con sintetizadores y hi-hats rápidos"},
            
            # Estilos latinos
            {"text": "🇨🇴 Cumbia Colombiana", "prompt": "cumbia colombiana tradicional con acordeón"},
            {"text": "💃 Salsa Brava", "prompt": "salsa brava con trompetas y percusión latina"},
            {"text": "🌹 Bachata Sensual", "prompt": "bachata sensual con guitarra y bongos"},
            {"text": "🎉 Merengue Festivo", "prompt": "merengue festivo y bailable con acordeón"},
            
            # Emociones
            {"text": "😢 Canción Triste", "prompt": "canción triste y melancólica con piano solo"},
            {"text": "😊 Tema Alegre", "prompt": "tema alegre y festivo con instrumentos brillantes"},
            {"text": "🧘 Música Relajante", "prompt": "música relajante y tranquila para meditar"},
            {"text": "💪 Ritmo Motivador", "prompt": "ritmo enérgico y motivador para entrenar"},
            
            # Instrumentos destacados
            {"text": "🎸 Guitarra Acústica", "prompt": "canción folk con guitarra acústica principal"},
            {"text": "🎹 Piano Clásico", "prompt": "pieza instrumental con piano clásico emotivo"},
            {"text": "🎺 Trompeta Brillante", "prompt": "tema festivo con trompeta brillante y sección de vientos"},
            {"text": "🎻 Violín Emotivo", "prompt": "melodía emotiva con violín y orquesta de cuerdas"}
        ]
        
        return buttons

# Instancia global del servicio
auto_translation_service = AutoTranslationService()

# Funciones de conveniencia
def process_prompt_for_suno(spanish_prompt: str) -> Dict[str, str]:
    """Función de conveniencia para procesar prompts"""
    return auto_translation_service.process_prompt_for_suno(spanish_prompt)

def get_spanish_prompt_buttons() -> List[Dict[str, str]]:
    """Función de conveniencia para obtener botones de prompts"""
    return auto_translation_service.generate_spanish_prompt_buttons()
