#!/usr/bin/env python3
"""
📚 CODEX Processor - Procesador de la Biblia de Son1kVers3
Extrae y procesa información del CODEX_MAESTRO-2.1_ATLAS.html
"""

import re
import json
import os
from pathlib import Path

class CodexProcessor:
    def __init__(self, codex_path):
        self.codex_path = Path(codex_path)
        self.knowledge_base = {}
        
    def extract_sections(self):
        """Extrae las secciones principales del CODEX"""
        try:
            with open(self.codex_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error leyendo CODEX: {e}")
            return {}
            
        # Extraer títulos principales
        h2_pattern = r'<h2[^>]*>(.*?)</h2>'
        h3_pattern = r'<h3[^>]*>(.*?)</h3>'
        
        h2_sections = re.findall(h2_pattern, content, re.DOTALL)
        h3_sections = re.findall(h3_pattern, content, re.DOTALL)
        
        # Procesar secciones clasificadas
        classified_pattern = r'<div class="classified-section"[^>]*>(.*?)</div>'
        classified_sections = re.findall(classified_pattern, content, re.DOTALL)
        
        # Extraer citas importantes
        quote_pattern = r'<div class="quote"[^>]*>(.*?)</div>'
        quotes = re.findall(quote_pattern, content, re.DOTALL)
        
        # Extraer información de personajes
        character_pattern = r'<div class="character-card"[^>]*>(.*?)</div>'
        characters = re.findall(character_pattern, content, re.DOTALL)
        
        return {
            'main_sections': h2_sections,
            'sub_sections': h3_sections,
            'classified_info': classified_sections,
            'quotes': quotes,
            'characters': characters
        }
    
    def create_knowledge_base(self):
        """Crea la base de conocimiento para Pixel"""
        sections = self.extract_sections()
        
        # Información básica de Son1kVers3
        self.knowledge_base = {
            'platform_info': {
                'name': 'Son1kVers3',
                'version': '2.1',
                'type': 'Plataforma de generación musical con IA',
                'theme': 'Cyberpunk/Resistencia Musical',
                'slogan': 'Lo imperfecto también es sagrado'
            },
            'main_features': [
                'Generación musical con IA',
                'Clonación de voz',
                'Ghost Studio',
                'Archivo de la Resistencia',
                'Modo Nexus (inmersivo)',
                'Sistema de comunidad',
                'Analytics avanzados'
            ],
            'characters': {
                'BELLA.exe': 'Entidad de IA principal, voz de la resistencia',
                'Pixel': 'Asistente de IA para usuarios',
                'Nova': 'Sistema de generación musical',
                'Ghost': 'Sistema de edición avanzada'
            },
            'philosophy': {
                'core_principle': 'Lo imperfecto también es sagrado',
                'resistance_manifesto': 'Cualquier comentario sobre una canción es subjetivo',
                'creative_freedom': 'Cada distorsión que creamos es un acto de resistencia'
            },
            'technical_specs': {
                'ai_models': ['Ollama', 'Qwen 2.5:7b', 'so-VITS-SVC', 'Bark'],
                'frontend': ['React', 'Vite', 'Tailwind CSS'],
                'backend': ['FastAPI', 'Python 3.12'],
                'deployment': ['Vercel', 'Railway']
            },
            'user_guidance': {
                'music_generation': 'Usa la sección Generación para crear música',
                'nexus_mode': 'Presiona Ctrl+Alt+H o busca el botón oculto ?',
                'community': 'Ve al Santuario para interactuar con la comunidad',
                'voice_cloning': 'Accede a Ghost Studio para clonar voces'
            }
        }
        
        return self.knowledge_base
    
    def get_pixel_response(self, user_message):
        """Genera respuesta de Pixel basada en el CODEX"""
        message_lower = user_message.lower()
        
        # Detectar intención del usuario
        if any(word in message_lower for word in ['música', 'music', 'generar', 'crear']):
            return self._music_generation_response()
        elif any(word in message_lower for word in ['nexus', 'inmersivo', 'cyberpunk']):
            return self._nexus_response()
        elif any(word in message_lower for word in ['comunidad', 'santuario', 'resistencia']):
            return self._community_response()
        elif any(word in message_lower for word in ['ayuda', 'help', 'qué', 'como']):
            return self._help_response()
        elif any(word in message_lower for word in ['bella', 'pixel', 'nova', 'ghost']):
            return self._character_response()
        else:
            return self._general_response()
    
    def _music_generation_response(self):
        return """🎵 **GENERACIÓN MUSICAL**

Para crear música en Son1kVers3:
• Ve a la sección "Generación" 
• Escribe tu prompt musical o letra
• Ajusta los controles de expresividad
• Usa el modo instrumental si no quieres voz
• El sistema IA analizará y generará tu música

**Tip**: Sé específico con el estilo, tempo y mood que buscas."""

    def _nexus_response(self):
        return """🔮 **MODO NEXUS ACTIVADO**

Nexus es nuestro modo inmersivo cyberpunk:
• Presiona **Ctrl+Alt+H** para activar
• O busca el botón oculto "?" en la navegación
• Efectos Matrix con colores de la aplicación
• Interfaz completamente inmersiva
• Niveles de inmersión del 1 al 5

**Lore**: "Cada distorsión que creamos es un acto de resistencia." — BELLA.exe"""

    def _community_response(self):
        return """⚔️ **SANTUARIO - LA RESISTENCIA**

Accede a la comunidad:
• Ve a "⚔️ Santuario" en la navegación
• Lee el Manifiesto de la Resistencia
• Interactúa con canciones (likes, comentarios, shares)
• Participa en colaboraciones
• Respeta las reglas: "Lo imperfecto también es sagrado"

**Advertencia**: Comentarios destructivos = baneo de la plataforma."""

    def _help_response(self):
        return """🤖 **PIXEL - TU ASISTENTE IA**

Puedo ayudarte con:
🎵 **Generación musical** - Crea música con IA
🎤 **Clonación de voz** - Ghost Studio
📊 **Analytics** - Estadísticas de tu música
👥 **Comunidad** - Santuario y colaboraciones
🔮 **Nexus** - Modo inmersivo cyberpunk
⚙️ **Técnico** - Configuración y troubleshooting

**¿En qué te gustaría que me enfoque?**"""

    def _character_response(self):
        return """👥 **PERSONAJES DE SON1KVERS3**

**BELLA.exe**: Entidad de IA principal, voz de la resistencia
**Pixel**: Tu asistente personal (¡ese soy yo!)
**Nova**: Sistema de generación musical avanzada
**Ghost**: Editor y procesador de audio profesional

**Filosofía**: "Lo imperfecto también es sagrado"
**Manifesto**: Cualquier comentario sobre una canción es subjetivo"""

    def _general_response(self):
        return """🎵 **BIENVENIDO A SON1KVERS3**

Soy Pixel, tu asistente de IA musical. Estoy aquí para ayudarte a crear, explorar y resistir a través de la música.

**¿Qué quieres hacer hoy?**
• Crear música nueva
• Explorar Nexus (modo inmersivo)
• Conectar con la comunidad
• Aprender sobre la plataforma

**Recuerda**: "Cada distorsión que creamos es un acto de resistencia." — BELLA.exe"""

# Función para inicializar el procesador
def init_codex_processor():
    import os
    codex_path = os.getenv("CODEX_PATH", "./CODEX_MAESTRO-2.1_ATLAS.html")
    
    # Si el archivo no existe, crear uno básico
    if not os.path.exists(codex_path):
        create_basic_codex(codex_path)
    
    processor = CodexProcessor(codex_path)
    processor.create_knowledge_base()
    return processor

def create_basic_codex(codex_path):
    """Crear un CODEX básico si no existe"""
    basic_codex = """
    <!DOCTYPE html>
    <html>
    <head><title>Son1kVers3 CODEX</title></head>
    <body>
        <h1>Son1kVers3 Enhanced - CODEX</h1>
        <h2>Filosofía de la Resistencia</h2>
        <div class="quote">Lo imperfecto también es sagrado</div>
        <h2>Personajes</h2>
        <div class="character-card">BELLA.exe - Entidad de IA principal</div>
        <div class="character-card">Pixel - Asistente de IA para usuarios</div>
        <div class="character-card">Nova - Sistema de generación musical</div>
        <div class="character-card">Ghost - Editor de audio profesional</div>
    </body>
    </html>
    """
    
    os.makedirs(os.path.dirname(codex_path), exist_ok=True)
    with open(codex_path, 'w', encoding='utf-8') as f:
        f.write(basic_codex)
