#!/usr/bin/env python3
"""
🎨 UX Enhancement System
Sistema avanzado de mejora de experiencia de usuario para Son1kVers3
Incluye: tutoriales interactivos, preview en tiempo real, drag & drop mejorado, shortcuts de teclado
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Any, Callable
import logging
import webbrowser
from threading import Thread

logger = logging.getLogger(__name__)

class UXEnhancementSystem:
    """Sistema completo de mejora de UX"""

    def __init__(self):
        self.tutorial_steps = {}
        self.keyboard_shortcuts = {}
        self.preview_cache = {}
        self.drag_drop_handlers = {}

        # Estado del tutorial
        self.current_tutorial = None
        self.tutorial_progress = {}

        # Configuración de preview
        self.preview_debounce_ms = 300
        self.last_preview_update = 0

        # Inicializar componentes
        self._initialize_tutorials()
        self._initialize_shortcuts()
        self._initialize_drag_drop_handlers()

    def _initialize_tutorials(self):
        """Inicializar tutoriales interactivos"""
        self.tutorial_steps = {
            "ghost_studio": [
                {
                    "id": "welcome",
                    "title": "🎵 Bienvenido a Ghost Studio",
                    "content": "Aquí puedes generar música profesional con IA. Vamos a explorar las funciones principales.",
                    "target": ".ghost-studio-container",
                    "position": "center",
                    "actions": ["next"]
                },
                {
                    "id": "prompt_input",
                    "title": "📝 Prompt Musical",
                    "content": "Describe tu canción aquí. Sé específico sobre género, mood, instrumentos y estilo.",
                    "target": ".prompt-input-area",
                    "position": "bottom",
                    "actions": ["next", "skip"]
                },
                {
                    "id": "style_selection",
                    "title": "🎸 Selección de Estilo",
                    "content": "Elige entre más de 20 estilos musicales. ¡Prueba diferentes combinaciones!",
                    "target": ".style-selector",
                    "position": "right",
                    "actions": ["next", "previous"]
                },
                {
                    "id": "lyrics_section",
                    "title": "📖 Letras y Voces",
                    "content": "Agrega letras personalizadas o deja que la IA las genere automáticamente.",
                    "target": ".lyrics-section",
                    "position": "top",
                    "actions": ["next", "previous"]
                },
                {
                    "id": "generate_button",
                    "title": "🚀 Generar Música",
                    "content": "¡Haz clic aquí para crear tu canción! El proceso toma unos segundos.",
                    "target": ".generate-button",
                    "position": "top",
                    "actions": ["next", "previous"]
                },
                {
                    "id": "preview_player",
                    "title": "🎵 Reproductor de Preview",
                    "content": "Aquí aparecerá tu canción generada. Puedes descargarla o compartirla.",
                    "target": ".preview-player",
                    "position": "left",
                    "actions": ["finish", "previous"]
                }
            ],
            "clone_station": [
                {
                    "id": "voice_upload",
                    "title": "🎤 Subida de Voz",
                    "content": "Sube muestras de tu voz para crear clones personalizados.",
                    "target": ".voice-upload-zone",
                    "position": "center"
                },
                {
                    "id": "voice_settings",
                    "title": "⚙️ Configuración de Voz",
                    "content": "Ajusta tono, velocidad y emociones para personalizar tu voz clonada.",
                    "target": ".voice-settings",
                    "position": "right"
                },
                {
                    "id": "text_to_speech",
                    "title": "📝 Texto a Voz",
                    "content": "Convierte texto en voz usando diferentes modos especializados.",
                    "target": ".tts-section",
                    "position": "bottom"
                }
            ],
            "nova_post_pilot": [
                {
                    "id": "content_analysis",
                    "title": "📊 Análisis de Contenido",
                    "content": "Analiza tu contenido para optimizar el engagement en redes sociales.",
                    "target": ".content-analyzer",
                    "position": "center"
                },
                {
                    "id": "viral_hooks",
                    "title": "🎣 Ganchos Virales",
                    "content": "Genera ganchos personalizados que capturan la atención del público.",
                    "target": ".viral-hooks-generator",
                    "position": "right"
                },
                {
                    "id": "posting_schedule",
                    "title": "⏰ Programación Óptima",
                    "content": "Programa publicaciones en los mejores horarios para cada plataforma.",
                    "target": ".posting-scheduler",
                    "position": "left"
                }
            ]
        }

    def _initialize_shortcuts(self):
        """Inicializar shortcuts de teclado"""
        self.keyboard_shortcuts = {
            # Navegación general
            "ctrl+tab": "next_tab",
            "ctrl+shift+tab": "previous_tab",
            "ctrl+s": "save_project",
            "ctrl+n": "new_project",
            "ctrl+o": "open_project",
            "ctrl+z": "undo",
            "ctrl+y": "redo",

            # Ghost Studio
            "ctrl+g": "generate_music",
            "ctrl+p": "focus_prompt",
            "ctrl+l": "focus_lyrics",
            "ctrl+enter": "quick_generate",
            "space": "play_pause_preview",

            # Clone Station
            "ctrl+u": "upload_voice_sample",
            "ctrl+r": "record_voice_sample",
            "ctrl+t": "toggle_tts_mode",
            "ctrl+m": "modulate_voice",

            # Nova Post Pilot
            "ctrl+a": "analyze_content",
            "ctrl+h": "generate_viral_hooks",
            "ctrl+shift+p": "optimize_schedule",

            # Tutoriales
            "f1": "start_tutorial",
            "escape": "close_tutorial",
            "ctrl+?": "show_shortcuts"
        }

    def _initialize_drag_drop_handlers(self):
        """Inicializar manejadores de drag & drop mejorados"""
        self.drag_drop_handlers = {
            "audio_files": {
                "extensions": [".mp3", ".wav", ".flac", ".ogg"],
                "max_size": 50 * 1024 * 1024,  # 50MB
                "handler": self._handle_audio_drop
            },
            "voice_samples": {
                "extensions": [".wav", ".mp3"],
                "max_size": 10 * 1024 * 1024,  # 10MB
                "handler": self._handle_voice_sample_drop
            },
            "images": {
                "extensions": [".jpg", ".jpeg", ".png", ".gif"],
                "max_size": 5 * 1024 * 1024,  # 5MB
                "handler": self._handle_image_drop
            }
        }

    def start_tutorial(self, tutorial_name: str, user_id: str = "default") -> Dict:
        """Iniciar un tutorial interactivo"""
        if tutorial_name not in self.tutorial_steps:
            return {"success": False, "error": "Tutorial no encontrado"}

        self.current_tutorial = tutorial_name
        self.tutorial_progress[user_id] = {
            "current_step": 0,
            "completed_steps": [],
            "start_time": time.time()
        }

        first_step = self.tutorial_steps[tutorial_name][0]

        return {
            "success": True,
            "tutorial": tutorial_name,
            "step": first_step,
            "total_steps": len(self.tutorial_steps[tutorial_name]),
            "progress": 0
        }

    def next_tutorial_step(self, user_id: str = "default") -> Dict:
        """Avanzar al siguiente paso del tutorial"""
        if not self.current_tutorial or user_id not in self.tutorial_progress:
            return {"success": False, "error": "No hay tutorial activo"}

        progress = self.tutorial_progress[user_id]
        current_step_idx = progress["current_step"]

        if current_step_idx >= len(self.tutorial_steps[self.current_tutorial]) - 1:
            return {"success": False, "error": "Tutorial completado"}

        progress["current_step"] += 1
        progress["completed_steps"].append(current_step_idx)

        next_step = self.tutorial_steps[self.current_tutorial][progress["current_step"]]
        completed_steps = len(progress["completed_steps"])
        total_steps = len(self.tutorial_steps[self.current_tutorial])

        return {
            "success": True,
            "step": next_step,
            "progress": (completed_steps / total_steps) * 100,
            "completed_steps": completed_steps,
            "total_steps": total_steps
        }

    def previous_tutorial_step(self, user_id: str = "default") -> Dict:
        """Retroceder al paso anterior del tutorial"""
        if not self.current_tutorial or user_id not in self.tutorial_progress:
            return {"success": False, "error": "No hay tutorial activo"}

        progress = self.tutorial_progress[user_id]
        current_step_idx = progress["current_step"]

        if current_step_idx <= 0:
            return {"success": False, "error": "Primer paso del tutorial"}

        progress["current_step"] -= 1
        if current_step_idx in progress["completed_steps"]:
            progress["completed_steps"].remove(current_step_idx)

        prev_step = self.tutorial_steps[self.current_tutorial][progress["current_step"]]
        completed_steps = len(progress["completed_steps"])
        total_steps = len(self.tutorial_steps[self.current_tutorial])

        return {
            "success": True,
            "step": prev_step,
            "progress": (completed_steps / total_steps) * 100,
            "completed_steps": completed_steps,
            "total_steps": total_steps
        }

    def complete_tutorial(self, user_id: str = "default") -> Dict:
        """Completar tutorial y guardar progreso"""
        if not self.current_tutorial or user_id not in self.tutorial_progress:
            return {"success": False, "error": "No hay tutorial activo"}

        progress = self.tutorial_progress[user_id]
        progress["completed_at"] = time.time()
        duration = progress["completed_at"] - progress["start_time"]

        # Aquí se guardaría en base de datos en producción
        logger.info(f"Tutorial {self.current_tutorial} completado por usuario {user_id} en {duration:.2f}s")

        # Limpiar estado
        self.current_tutorial = None
        del self.tutorial_progress[user_id]

        return {
            "success": True,
            "tutorial": self.current_tutorial,
            "duration_seconds": duration,
            "message": "¡Tutorial completado exitosamente!"
        }

    def get_keyboard_shortcuts_help(self) -> Dict:
        """Obtener ayuda de shortcuts de teclado"""
        return {
            "shortcuts": self.keyboard_shortcuts,
            "categories": {
                "General": ["ctrl+tab", "ctrl+s", "ctrl+n", "ctrl+z", "ctrl+y"],
                "Ghost Studio": ["ctrl+g", "ctrl+p", "ctrl+l", "space"],
                "Clone Station": ["ctrl+u", "ctrl+r", "ctrl+t", "ctrl+m"],
                "Nova Post Pilot": ["ctrl+a", "ctrl+h", "ctrl+shift+p"],
                "Tutoriales": ["f1", "escape", "ctrl+?"]
            }
        }

    def handle_keyboard_shortcut(self, shortcut: str, context: str) -> Dict:
        """Manejar shortcut de teclado"""
        action = self.keyboard_shortcuts.get(shortcut)
        if not action:
            return {"success": False, "error": "Shortcut no reconocido"}

        # Aquí se implementarían las acciones específicas
        logger.info(f"Ejecutando acción '{action}' desde shortcut '{shortcut}' en contexto '{context}'")

        return {
            "success": True,
            "action": action,
            "shortcut": shortcut,
            "context": context,
            "message": f"Acción '{action}' ejecutada"
        }

    async def update_realtime_preview(self, component_id: str, data: Dict, debounce: bool = True) -> Dict:
        """Actualizar preview en tiempo real con debouncing"""
        current_time = time.time() * 1000

        if debounce and (current_time - self.last_preview_update) < self.preview_debounce_ms:
            # Programar actualización diferida
            await asyncio.sleep(self.preview_debounce_ms / 1000)
            return await self._perform_preview_update(component_id, data)

        self.last_preview_update = current_time
        return await self._perform_preview_update(component_id, data)

    async def _perform_preview_update(self, component_id: str, data: Dict) -> Dict:
        """Realizar actualización de preview"""
        # Cachear datos de preview
        self.preview_cache[component_id] = {
            "data": data,
            "timestamp": time.time(),
            "version": data.get("version", 1)
        }

        # Aquí se enviaría la actualización al frontend
        logger.info(f"Preview actualizado para componente {component_id}")

        return {
            "success": True,
            "component_id": component_id,
            "updated_at": time.time(),
            "cached": True
        }

    def _handle_audio_drop(self, files: List[Dict], target_element: str) -> Dict:
        """Manejar archivos de audio arrastrados"""
        processed_files = []

        for file_info in files:
            file_path = file_info.get("path")
            file_size = file_info.get("size", 0)

            # Validar archivo
            if file_size > self.drag_drop_handlers["audio_files"]["max_size"]:
                return {
                    "success": False,
                    "error": f"Archivo muy grande. Máximo {self.drag_drop_handlers['audio_files']['max_size'] / (1024*1024):.1f}MB"
                }

            # Procesar archivo
            processed_files.append({
                "name": file_info.get("name"),
                "path": file_path,
                "size": file_size,
                "type": "audio",
                "status": "processed"
            })

        return {
            "success": True,
            "files": processed_files,
            "count": len(processed_files),
            "target_element": target_element
        }

    def _handle_voice_sample_drop(self, files: List[Dict], target_element: str) -> Dict:
        """Manejar muestras de voz arrastradas"""
        processed_files = []

        for file_info in files:
            # Validar extensión
            file_name = file_info.get("name", "").lower()
            valid_extensions = self.drag_drop_handlers["voice_samples"]["extensions"]

            if not any(file_name.endswith(ext) for ext in valid_extensions):
                return {
                    "success": False,
                    "error": f"Formato no válido. Solo {', '.join(valid_extensions)}"
                }

            processed_files.append({
                "name": file_info.get("name"),
                "type": "voice_sample",
                "status": "ready_for_processing"
            })

        return {
            "success": True,
            "files": processed_files,
            "message": "Muestras de voz listas para procesamiento"
        }

    def _handle_image_drop(self, files: List[Dict], target_element: str) -> Dict:
        """Manejar imágenes arrastradas"""
        return {
            "success": True,
            "files": files,
            "type": "images",
            "target_element": target_element
        }

    def get_drag_drop_config(self) -> Dict:
        """Obtener configuración de drag & drop"""
        return {
            "handlers": self.drag_drop_handlers,
            "animations": {
                "drop_zone_highlight": "border-dashed border-2 border-blue-500 bg-blue-50",
                "file_preview": "transform scale-105 transition-transform duration-200",
                "drag_over": "opacity-75"
            },
            "feedback": {
                "success": "Archivo cargado exitosamente",
                "error": "Error al cargar archivo",
                "progress": "Procesando archivo..."
            }
        }

    def create_interactive_hint(self, element_id: str, hint_text: str, position: str = "top") -> Dict:
        """Crear pista interactiva para elementos UI"""
        return {
            "element_id": element_id,
            "hint_text": hint_text,
            "position": position,
            "show_delay": 1000,  # ms
            "hide_delay": 3000,  # ms
            "animation": "fade-in-up"
        }

    def get_tutorial_progress(self, user_id: str = "default") -> Dict:
        """Obtener progreso de tutoriales del usuario"""
        return self.tutorial_progress.get(user_id, {})

    def reset_tutorial_progress(self, user_id: str = "default") -> Dict:
        """Reiniciar progreso de tutoriales"""
        if user_id in self.tutorial_progress:
            del self.tutorial_progress[user_id]

        return {"success": True, "message": "Progreso de tutoriales reiniciado"}

# Instancia global del sistema UX
ux_enhancer = UXEnhancementSystem()

# Funciones de utilidad para integración
def get_ux_tips_for_component(component_name: str) -> List[str]:
    """Obtener tips UX para un componente específico"""
    tips = {
        "ghost_studio": [
            "Usa Ctrl+G para generar música rápidamente",
            "Presiona Space para reproducir/pausar la preview",
            "Arrastra archivos de audio directamente al área de trabajo"
        ],
        "clone_station": [
            "Sube múltiples muestras de voz para mejores resultados",
            "Usa Ctrl+U para subir muestras rápidamente",
            "Experimenta con diferentes emociones y acentos"
        ],
        "nova_post_pilot": [
            "Analiza tu contenido antes de generar ganchos",
            "Programa publicaciones en horarios óptimos",
            "Usa Ctrl+A para análisis rápido de contenido"
        ]
    }

    return tips.get(component_name, ["Explora las funciones disponibles"])

def validate_user_input(input_data: Dict, validation_rules: Dict) -> Dict:
    """Validar entrada del usuario con reglas personalizables"""
    errors = []
    warnings = []

    for field, rules in validation_rules.items():
        value = input_data.get(field)

        # Validar requerido
        if rules.get("required") and not value:
            errors.append(f"El campo '{field}' es requerido")
            continue

        # Validar longitud mínima/máxima
        if value and "min_length" in rules:
            if len(str(value)) < rules["min_length"]:
                errors.append(f"El campo '{field}' debe tener al menos {rules['min_length']} caracteres")

        if value and "max_length" in rules:
            if len(str(value)) > rules["max_length"]:
                errors.append(f"El campo '{field}' no puede exceder {rules['max_length']} caracteres")

        # Validar patrón regex
        if value and "pattern" in rules:
            import re
            if not re.match(rules["pattern"], str(value)):
                errors.append(f"El campo '{field}' no tiene el formato correcto")

        # Validar valores permitidos
        if value and "allowed_values" in rules:
            if value not in rules["allowed_values"]:
                errors.append(f"El campo '{field}' debe ser uno de: {', '.join(rules['allowed_values'])}")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }
