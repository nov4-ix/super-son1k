"""
Sistema de Moderación de Contenido para El Santuario
Protege la creatividad y los sentimientos de los creadores
"""

import re
import asyncio
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class ModerationAction(Enum):
    APPROVE = "approve"
    WARN = "warn"
    CENSOR = "censor"
    BAN = "ban"

@dataclass
class ModerationResult:
    action: ModerationAction
    confidence: float
    reason: str
    detected_patterns: List[str]
    suggested_replacement: Optional[str] = None

class ContentModerator:
    def __init__(self):
        # Palabras y frases destructivas (críticas negativas)
        self.destructive_patterns = [
            # Críticas destructivas directas
            r'\b(es\s+una\s+basura|es\s+horrible|es\s+terrible|es\s+malo|es\s+feo)\b',
            r'\b(no\s+me\s+gusta|odio|detesto|asco)\b',
            r'\b(que\s+asco|que\s+horror|que\s+basura)\b',
            r'\b(no\s+sirve|no\s+vales|no\s+tienes\s+talent)\b',
            r'\b(perdiste\s+el\s+tiempo|desperdicio)\b',
            
            # Críticas sobre habilidades
            r'\b(no\s+sabes\s+cantar|no\s+sabes\s+tocar|no\s+sabes\s+componer)\b',
            r'\b(no\s+tienes\s+oído|no\s+tienes\s+ritmo|no\s+tienes\s+estilo)\b',
            r'\b(aprende\s+a\s+cantar|aprende\s+a\s+tocar|aprende\s+música)\b',
            
            # Críticas sobre el arte en general
            r'\b(esto\s+no\s+es\s+música|esto\s+no\s+es\s+arte)\b',
            r'\b(no\s+entendí\s+nada|no\s+se\s+entiende)\b',
            r'\b(está\s+mal\s+hecho|está\s+mal\s+compuesto)\b',
            
            # Frases despectivas
            r'\b(patético|ridículo|estúpido|idiota|tonto)\b',
            r'\b(no\s+vales\s+nada|no\s+sirves|no\s+eres\s+bueno)\b',
            r'\b(mejor\s+dedícate\s+a\s+otra\s+cosa|mejor\s+deja\s+la\s+música)\b',
            
            # Críticas sobre el estilo
            r'\b(ese\s+estilo\s+no\s+sirve|ese\s+género\s+es\s+malo)\b',
            r'\b(no\s+te\s+queda\s+bien|no\s+es\s+tu\s+estilo)\b',
            
            # Críticas sobre la calidad técnica
            r'\b(está\s+mal\s+grabado|está\s+mal\s+mezclado|está\s+mal\s+masterizado)\b',
            r'\b(se\s+oye\s+mal|se\s+oye\s+terrible|se\s+oye\s+horrible)\b',
            
            # Frases en inglés
            r'\b(this\s+is\s+trash|this\s+is\s+terrible|this\s+sucks)\b',
            r'\b(you\s+can\'t\s+sing|you\s+can\'t\s+play|you\s+can\'t\s+compose)\b',
            r'\b(this\s+is\s+not\s+music|this\s+is\s+not\s+art)\b',
            r'\b(pathetic|ridiculous|stupid|idiot|dumb)\b',
        ]
        
        # Patrones de spam
        self.spam_patterns = [
            r'\b(comprar|venta|oferta|descuento|gratis|click\s+aquí)\b',
            r'\b(buy|sale|offer|discount|free|click\s+here)\b',
            r'\b(visita\s+mi\s+canal|suscríbete|like\s+y\s+comparte)\b',
            r'\b(visita\s+mi\s+instagram|sígueme\s+en|follow\s+me)\b',
        ]
        
        # Patrones de toxicidad general
        self.toxic_patterns = [
            r'\b(odio|hate|basura|mierda|estúpido|idiota)\b',
            r'\b(puto|puta|joder|coño|fuck|shit|damn)\b',
            r'\b(feo|ugly|asqueroso|disgusting|repugnante)\b',
        ]
        
        # Patrones de comentarios constructivos (para contrarrestar)
        self.constructive_patterns = [
            r'\b(me\s+gusta|me\s+encanta|me\s+parece\s+bueno)\b',
            r'\b(interesante|curioso|diferente|único)\b',
            r'\b(buena\s+idea|buen\s+intento|bien\s+hecho)\b',
            r'\b(gracias\s+por\s+compartir|gracias\s+por\s+la\s+música)\b',
            r'\b(continúa\s+así|sigue\s+creando|sigue\s+experimentando)\b',
            r'\b(me\s+inspira|me\s+motiva|me\s+emociona)\b',
        ]
        
        # Compilar regex para mejor rendimiento
        self.destructive_regex = [re.compile(pattern, re.IGNORECASE) for pattern in self.destructive_patterns]
        self.spam_regex = [re.compile(pattern, re.IGNORECASE) for pattern in self.spam_patterns]
        self.toxic_regex = [re.compile(pattern, re.IGNORECASE) for pattern in self.toxic_patterns]
        self.constructive_regex = [re.compile(pattern, re.IGNORECASE) for pattern in self.constructive_patterns]

    async def moderate_comment(self, comment: str, user_id: str = None) -> ModerationResult:
        """
        Modera un comentario y determina la acción a tomar
        """
        comment_lower = comment.lower()
        
        # Detectar patrones destructivos
        destructive_matches = []
        for regex in self.destructive_regex:
            matches = regex.findall(comment_lower)
            destructive_matches.extend(matches)
        
        # Detectar spam
        spam_matches = []
        for regex in self.spam_regex:
            matches = regex.findall(comment_lower)
            spam_matches.extend(matches)
        
        # Detectar toxicidad general
        toxic_matches = []
        for regex in self.toxic_regex:
            matches = regex.findall(comment_lower)
            toxic_matches.extend(matches)
        
        # Detectar comentarios constructivos
        constructive_matches = []
        for regex in self.constructive_regex:
            matches = regex.findall(comment_lower)
            constructive_matches.extend(matches)
        
        # Calcular puntuación de moderación
        destructive_score = len(destructive_matches) * 3  # Peso alto para críticas destructivas
        spam_score = len(spam_matches) * 2
        toxic_score = len(toxic_matches) * 2
        constructive_score = len(constructive_matches) * 1
        
        total_negative = destructive_score + spam_score + toxic_score
        total_positive = constructive_score
        
        # Determinar acción basada en puntuación
        if total_negative >= 6:  # Múltiples patrones destructivos
            return ModerationResult(
                action=ModerationAction.BAN,
                confidence=0.9,
                reason="Múltiples críticas destructivas detectadas. Banea permanente por violar la política de respeto a los creadores.",
                detected_patterns=destructive_matches + spam_matches + toxic_matches
            )
        elif total_negative >= 3:  # Patrones destructivos moderados
            return ModerationResult(
                action=ModerationAction.CENSOR,
                confidence=0.8,
                reason="Críticas destructivas detectadas. Comentario censurado para proteger al creador.",
                detected_patterns=destructive_matches + spam_matches + toxic_matches,
                suggested_replacement="Tu comentario ha sido censurado por contener críticas destructivas. Recuerda que cada obra de arte es subjetiva y merece respeto."
            )
        elif total_negative >= 1:  # Patrones destructivos leves
            return ModerationResult(
                action=ModerationAction.WARN,
                confidence=0.7,
                reason="Posible crítica destructiva detectada. Advertencia enviada al usuario.",
                detected_patterns=destructive_matches + spam_matches + toxic_matches
            )
        else:
            return ModerationResult(
                action=ModerationAction.APPROVE,
                confidence=0.9,
                reason="Comentario aprobado. No se detectaron patrones destructivos.",
                detected_patterns=[]
            )

    async def moderate_post(self, post_content: str, user_id: str = None) -> ModerationResult:
        """
        Modera un post del feed
        """
        # Los posts tienen reglas más estrictas
        result = await self.moderate_comment(post_content, user_id)
        
        # Si es un post, ser más estricto
        if result.action == ModerationAction.WARN:
            result.action = ModerationAction.CENSOR
            result.confidence = min(result.confidence + 0.1, 1.0)
            result.reason = "Post censurado por contener críticas destructivas. Los posts deben promover la creatividad y el respeto."
        
        return result

    async def moderate_chat_message(self, message: str, user_id: str = None) -> ModerationResult:
        """
        Modera un mensaje del chat
        """
        # El chat tiene reglas más estrictas que los comentarios
        result = await self.moderate_comment(message, user_id)
        
        # Si es un mensaje de chat, ser más estricto
        if result.action == ModerationAction.WARN:
            result.action = ModerationAction.CENSOR
            result.confidence = min(result.confidence + 0.1, 1.0)
            result.reason = "Mensaje censurado por contener críticas destructivas. El chat debe ser un espacio seguro para todos."
        
        return result

    def get_moderation_guidelines(self) -> Dict[str, str]:
        """
        Retorna las pautas de moderación para mostrar a los usuarios
        """
        return {
            "title": "Política de Moderación del Santuario",
            "description": "Protegemos la creatividad y los sentimientos de todos los creadores",
            "rules": [
                "✅ Respeta los sentimientos del creador - cada obra viene del corazón",
                "✅ Comparte opiniones constructivas y respetuosas",
                "✅ Celebra la diversidad creativa y los diferentes estilos",
                "✅ Recuerda que el arte es subjetivo - no hay bien o mal",
                "❌ No critiques destructivamente - daña la creatividad",
                "❌ No uses lenguaje tóxico o despectivo",
                "❌ No hagas spam o promociones no solicitadas",
                "⚠️ Banea permanente para reincidentes - sin excepciones"
            ],
            "examples": {
                "constructive": [
                    "Me gusta la atmósfera que creaste",
                    "Interesante uso de los instrumentos",
                    "Gracias por compartir tu creatividad",
                    "Continúa experimentando con nuevos sonidos"
                ],
                "destructive": [
                    "Esto es una basura",
                    "No sabes cantar",
                    "Mejor dedícate a otra cosa",
                    "Está mal hecho"
                ]
            }
        }

    async def get_user_moderation_history(self, user_id: str) -> Dict[str, any]:
        """
        Obtiene el historial de moderación de un usuario
        """
        # En una implementación real, esto consultaría la base de datos
        return {
            "user_id": user_id,
            "total_warnings": 0,
            "total_censors": 0,
            "total_bans": 0,
            "last_moderation": None,
            "is_banned": False,
            "ban_reason": None
        }

    async def ban_user(self, user_id: str, reason: str) -> bool:
        """
        Banea a un usuario permanentemente
        """
        # En una implementación real, esto actualizaría la base de datos
        print(f"🚫 Usuario {user_id} baneado permanentemente. Razón: {reason}")
        return True

    async def censor_content(self, content_id: str, replacement_text: str = None) -> bool:
        """
        Censura contenido específico
        """
        # En una implementación real, esto actualizaría la base de datos
        replacement = replacement_text or "Este contenido ha sido censurado por violar las políticas de respeto a los creadores."
        print(f"🚫 Contenido {content_id} censurado. Reemplazo: {replacement}")
        return True

# Instancia global del moderador
content_moderator = ContentModerator()

# Función de conveniencia para usar en endpoints
async def moderate_content(content: str, content_type: str = "comment", user_id: str = None) -> ModerationResult:
    """
    Función de conveniencia para moderar contenido
    """
    if content_type == "post":
        return await content_moderator.moderate_post(content, user_id)
    elif content_type == "chat":
        return await content_moderator.moderate_chat_message(content, user_id)
    else:
        return await content_moderator.moderate_comment(content, user_id)

