#!/usr/bin/env python3
"""
📅 Auto Posting System - Nova Post Pilot Enhanced
Sistema de calendarización y publicación automática con Qwen 2.5
"""

import os
import json
import logging
import asyncio
import aiohttp
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import sqlite3
import schedule
import time
from threading import Thread

logger = logging.getLogger(__name__)

class PostStatus(Enum):
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ContentType(Enum):
    MUSIC = "music"
    VIDEO = "video"
    IMAGE = "image"
    TEXT = "text"
    STORY = "story"
    REEL = "reel"

@dataclass
class ScheduledPost:
    id: str
    platform: str
    content_type: ContentType
    content_data: Dict
    scheduled_time: datetime
    status: PostStatus
    algorithm_score: float
    hashtags: List[str]
    optimal_time: str
    created_at: datetime
    published_at: Optional[datetime] = None
    error_message: Optional[str] = None

@dataclass
class PlatformCredentials:
    platform: str
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[datetime] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None

class AutoPostingSystem:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or os.getenv("DATABASE_PATH", "nova_post.db")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
        self.credentials = {}
        self.scheduler_running = False
        
        # Inicializar base de datos
        self._init_database()
        
        # Inicializar scheduler
        self._start_scheduler()

    def _init_database(self):
        """Inicializar base de datos SQLite"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Tabla de posts programados
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS scheduled_posts (
                    id TEXT PRIMARY KEY,
                    platform TEXT NOT NULL,
                    content_type TEXT NOT NULL,
                    content_data TEXT NOT NULL,
                    scheduled_time TEXT NOT NULL,
                    status TEXT NOT NULL,
                    algorithm_score REAL,
                    hashtags TEXT,
                    optimal_time TEXT,
                    created_at TEXT NOT NULL,
                    published_at TEXT,
                    error_message TEXT
                )
            """)
            
            # Tabla de credenciales de plataformas
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS platform_credentials (
                    platform TEXT PRIMARY KEY,
                    access_token TEXT NOT NULL,
                    refresh_token TEXT,
                    expires_at TEXT,
                    api_key TEXT,
                    api_secret TEXT,
                    updated_at TEXT NOT NULL
                )
            """)
            
            # Tabla de análisis de algoritmos
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS algorithm_analysis (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL,
                    analysis_data TEXT NOT NULL,
                    algorithm_score REAL,
                    created_at TEXT NOT NULL
                )
            """)
            
            conn.commit()
            conn.close()
            logger.info("Base de datos inicializada correctamente")
            
        except Exception as e:
            logger.error(f"Error inicializando base de datos: {e}")

    def _start_scheduler(self):
        """Iniciar scheduler en hilo separado"""
        if not self.scheduler_running:
            self.scheduler_running = True
            scheduler_thread = Thread(target=self._run_scheduler, daemon=True)
            scheduler_thread.start()
            logger.info("Scheduler iniciado")

    def _run_scheduler(self):
        """Ejecutar scheduler en loop"""
        while self.scheduler_running:
            try:
                schedule.run_pending()
                time.sleep(60)  # Verificar cada minuto
            except Exception as e:
                logger.error(f"Error en scheduler: {e}")
                time.sleep(60)

    async def schedule_post(self, platform: str, content_data: Dict, 
                          scheduled_time: datetime = None, 
                          user_preferences: Dict = None) -> Dict:
        """Programar un post para publicación automática"""
        try:
            # Generar ID único
            post_id = f"{platform}_{int(datetime.now().timestamp())}"
            
            # Analizar algoritmo para optimización
            algorithm_analysis = await self._analyze_algorithm(platform, content_data)
            
            # Calcular tiempo óptimo si no se especifica
            if not scheduled_time:
                scheduled_time = self._calculate_optimal_time(algorithm_analysis)
            
            # Crear post programado
            scheduled_post = ScheduledPost(
                id=post_id,
                platform=platform,
                content_type=ContentType(content_data.get("type", "music")),
                content_data=content_data,
                scheduled_time=scheduled_time,
                status=PostStatus.SCHEDULED,
                algorithm_score=algorithm_analysis.get("algorithm_score", 75.0),
                hashtags=algorithm_analysis.get("hashtags", []),
                optimal_time=algorithm_analysis.get("optimal_time", "12:00"),
                created_at=datetime.now()
            )
            
            # Guardar en base de datos
            self._save_scheduled_post(scheduled_post)
            
            # Programar publicación
            self._schedule_publication(scheduled_post)
            
            return {
                "success": True,
                "post_id": post_id,
                "platform": platform,
                "scheduled_time": scheduled_time.isoformat(),
                "algorithm_score": algorithm_analysis.get("algorithm_score", 75.0),
                "hashtags": algorithm_analysis.get("hashtags", []),
                "message": "Post programado exitosamente"
            }
            
        except Exception as e:
            logger.error(f"Error programando post: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _analyze_algorithm(self, platform: str, content_data: Dict) -> Dict:
        """Analizar algoritmo de la plataforma con Qwen"""
        try:
            prompt = f"""
            Analiza el algoritmo de {platform} para optimizar este contenido:
            
            Tipo: {content_data.get("type", "music")}
            Título: {content_data.get("title", "")}
            Descripción: {content_data.get("description", "")}
            Duración: {content_data.get("duration", "")}
            
            Proporciona:
            1. algorithm_score: Score de optimización (0-100)
            2. optimal_time: Horario óptimo de publicación
            3. hashtags: Lista de hashtags optimizados
            4. content_suggestions: Sugerencias de mejora
            5. engagement_prediction: Predicción de engagement
            """
            
            async with aiohttp.ClientSession() as session:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 1000
                    }
                }
                
                async with session.post(
                    f"{self.ollama_base_url}/api/generate",
                    json=payload,
                    timeout=30
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        analysis = json.loads(result.get("response", "{}"))
                        return analysis
                    else:
                        logger.error(f"Error analizando algoritmo: {response.status}")
                        return self._get_fallback_analysis(platform)
                        
        except Exception as e:
            logger.error(f"Error en análisis de algoritmo: {e}")
            return self._get_fallback_analysis(platform)

    def _get_fallback_analysis(self, platform: str) -> Dict:
        """Análisis de respaldo si falla Qwen"""
        fallback_times = {
            "instagram": "12:00",
            "tiktok": "18:00",
            "youtube": "14:00",
            "twitter": "09:00"
        }
        
        return {
            "algorithm_score": 60.0,
            "optimal_time": fallback_times.get(platform, "12:00"),
            "hashtags": ["#music", "#viral", "#trending"],
            "content_suggestions": ["Usar colores vibrantes", "Añadir texto llamativo"],
            "engagement_prediction": 75.0
        }

    def _calculate_optimal_time(self, algorithm_analysis: Dict) -> datetime:
        """Calcular tiempo óptimo de publicación"""
        optimal_time_str = algorithm_analysis.get("optimal_time", "12:00")
        
        try:
            # Parsear tiempo óptimo
            hour, minute = map(int, optimal_time_str.split(":"))
            
            # Calcular para el próximo día
            tomorrow = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)
            if tomorrow <= datetime.now():
                tomorrow += timedelta(days=1)
            
            return tomorrow
            
        except Exception as e:
            logger.error(f"Error calculando tiempo óptimo: {e}")
            # Fallback: publicar en 1 hora
            return datetime.now() + timedelta(hours=1)

    def _save_scheduled_post(self, post: ScheduledPost):
        """Guardar post programado en base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT OR REPLACE INTO scheduled_posts 
                (id, platform, content_type, content_data, scheduled_time, status, 
                 algorithm_score, hashtags, optimal_time, created_at, published_at, error_message)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                post.id,
                post.platform,
                post.content_type.value,
                json.dumps(post.content_data),
                post.scheduled_time.isoformat(),
                post.status.value,
                post.algorithm_score,
                json.dumps(post.hashtags),
                post.optimal_time,
                post.created_at.isoformat(),
                post.published_at.isoformat() if post.published_at else None,
                post.error_message
            ))
            
            conn.commit()
            conn.close()
            logger.info(f"Post {post.id} guardado en base de datos")
            
        except Exception as e:
            logger.error(f"Error guardando post: {e}")

    def _schedule_publication(self, post: ScheduledPost):
        """Programar publicación usando schedule"""
        try:
            # Programar publicación
            schedule.every().day.at(post.scheduled_time.strftime("%H:%M")).do(
                self._publish_post, post.id
            )
            
            logger.info(f"Post {post.id} programado para {post.scheduled_time}")
            
        except Exception as e:
            logger.error(f"Error programando publicación: {e}")

    async def _publish_post(self, post_id: str):
        """Publicar post programado"""
        try:
            # Obtener post de base de datos
            post = self._get_scheduled_post(post_id)
            if not post:
                logger.error(f"Post {post_id} no encontrado")
                return
            
            # Verificar credenciales
            credentials = self._get_platform_credentials(post.platform)
            if not credentials:
                logger.error(f"Credenciales no encontradas para {post.platform}")
                self._update_post_status(post_id, PostStatus.FAILED, "Credenciales no encontradas")
                return
            
            # Publicar según plataforma
            success = await self._publish_to_platform(post, credentials)
            
            if success:
                self._update_post_status(post_id, PostStatus.PUBLISHED)
                logger.info(f"Post {post_id} publicado exitosamente")
            else:
                self._update_post_status(post_id, PostStatus.FAILED, "Error en publicación")
                logger.error(f"Error publicando post {post_id}")
                
        except Exception as e:
            logger.error(f"Error en publicación de post {post_id}: {e}")
            self._update_post_status(post_id, PostStatus.FAILED, str(e))

    async def _publish_to_platform(self, post: ScheduledPost, credentials: PlatformCredentials) -> bool:
        """Publicar a plataforma específica"""
        try:
            if post.platform.lower() == "instagram":
                return await self._publish_to_instagram(post, credentials)
            elif post.platform.lower() == "tiktok":
                return await self._publish_to_tiktok(post, credentials)
            elif post.platform.lower() == "youtube":
                return await self._publish_to_youtube(post, credentials)
            elif post.platform.lower() == "twitter":
                return await self._publish_to_twitter(post, credentials)
            else:
                logger.error(f"Plataforma {post.platform} no soportada")
                return False
                
        except Exception as e:
            logger.error(f"Error publicando a {post.platform}: {e}")
            return False

    async def _publish_to_instagram(self, post: ScheduledPost, credentials: PlatformCredentials) -> bool:
        """Publicar a Instagram"""
        try:
            # Implementar API de Instagram
            # Por ahora, simular publicación exitosa
            logger.info(f"Publicando a Instagram: {post.content_data.get('title', '')}")
            return True
            
        except Exception as e:
            logger.error(f"Error publicando a Instagram: {e}")
            return False

    async def _publish_to_tiktok(self, post: ScheduledPost, credentials: PlatformCredentials) -> bool:
        """Publicar a TikTok"""
        try:
            # Implementar API de TikTok
            # Por ahora, simular publicación exitosa
            logger.info(f"Publicando a TikTok: {post.content_data.get('title', '')}")
            return True
            
        except Exception as e:
            logger.error(f"Error publicando a TikTok: {e}")
            return False

    async def _publish_to_youtube(self, post: ScheduledPost, credentials: PlatformCredentials) -> bool:
        """Publicar a YouTube"""
        try:
            # Implementar API de YouTube
            # Por ahora, simular publicación exitosa
            logger.info(f"Publicando a YouTube: {post.content_data.get('title', '')}")
            return True
            
        except Exception as e:
            logger.error(f"Error publicando a YouTube: {e}")
            return False

    async def _publish_to_twitter(self, post: ScheduledPost, credentials: PlatformCredentials) -> bool:
        """Publicar a Twitter"""
        try:
            # Implementar API de Twitter
            # Por ahora, simular publicación exitosa
            logger.info(f"Publicando a Twitter: {post.content_data.get('title', '')}")
            return True
            
        except Exception as e:
            logger.error(f"Error publicando a Twitter: {e}")
            return False

    def _get_scheduled_post(self, post_id: str) -> Optional[ScheduledPost]:
        """Obtener post programado de base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT * FROM scheduled_posts WHERE id = ?
            """, (post_id,))
            
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return ScheduledPost(
                    id=row[0],
                    platform=row[1],
                    content_type=ContentType(row[2]),
                    content_data=json.loads(row[3]),
                    scheduled_time=datetime.fromisoformat(row[4]),
                    status=PostStatus(row[5]),
                    algorithm_score=row[6],
                    hashtags=json.loads(row[7]) if row[7] else [],
                    optimal_time=row[8],
                    created_at=datetime.fromisoformat(row[9]),
                    published_at=datetime.fromisoformat(row[10]) if row[10] else None,
                    error_message=row[11]
                )
            
            return None
            
        except Exception as e:
            logger.error(f"Error obteniendo post {post_id}: {e}")
            return None

    def _update_post_status(self, post_id: str, status: PostStatus, error_message: str = None):
        """Actualizar estado de post"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                UPDATE scheduled_posts 
                SET status = ?, published_at = ?, error_message = ?
                WHERE id = ?
            """, (
                status.value,
                datetime.now().isoformat() if status == PostStatus.PUBLISHED else None,
                error_message,
                post_id
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error actualizando estado de post {post_id}: {e}")

    def _get_platform_credentials(self, platform: str) -> Optional[PlatformCredentials]:
        """Obtener credenciales de plataforma"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT * FROM platform_credentials WHERE platform = ?
            """, (platform,))
            
            row = cursor.fetchone()
            conn.close()
            
            if row:
                return PlatformCredentials(
                    platform=row[0],
                    access_token=row[1],
                    refresh_token=row[2],
                    expires_at=datetime.fromisoformat(row[3]) if row[3] else None,
                    api_key=row[4],
                    api_secret=row[5]
                )
            
            return None
            
        except Exception as e:
            logger.error(f"Error obteniendo credenciales de {platform}: {e}")
            return None

    async def get_scheduled_posts(self, platform: str = None, status: str = None) -> List[Dict]:
        """Obtener posts programados"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            query = "SELECT * FROM scheduled_posts WHERE 1=1"
            params = []
            
            if platform:
                query += " AND platform = ?"
                params.append(platform)
            
            if status:
                query += " AND status = ?"
                params.append(status)
            
            query += " ORDER BY scheduled_time ASC"
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            conn.close()
            
            posts = []
            for row in rows:
                posts.append({
                    "id": row[0],
                    "platform": row[1],
                    "content_type": row[2],
                    "content_data": json.loads(row[3]),
                    "scheduled_time": row[4],
                    "status": row[5],
                    "algorithm_score": row[6],
                    "hashtags": json.loads(row[7]) if row[7] else [],
                    "optimal_time": row[8],
                    "created_at": row[9],
                    "published_at": row[10],
                    "error_message": row[11]
                })
            
            return posts
            
        except Exception as e:
            logger.error(f"Error obteniendo posts programados: {e}")
            return []

    async def cancel_scheduled_post(self, post_id: str) -> Dict:
        """Cancelar post programado"""
        try:
            self._update_post_status(post_id, PostStatus.CANCELLED)
            
            return {
                "success": True,
                "message": f"Post {post_id} cancelado exitosamente"
            }
            
        except Exception as e:
            logger.error(f"Error cancelando post {post_id}: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def stop_scheduler(self):
        """Detener scheduler"""
        self.scheduler_running = False
        schedule.clear()
        logger.info("Scheduler detenido")

# Instancia global
auto_posting_system = AutoPostingSystem()

async def schedule_music_post(platform: str, content_data: Dict, 
                            scheduled_time: str = None) -> Dict:
    """Función de conveniencia para programar post de música"""
    try:
        scheduled_datetime = None
        if scheduled_time:
            scheduled_datetime = datetime.fromisoformat(scheduled_time)
        
        result = await auto_posting_system.schedule_post(
            platform, content_data, scheduled_datetime
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error programando post de música: {e}")
        return {
            "success": False,
            "error": str(e)
        }

async def get_scheduled_posts(platform: str = None) -> Dict:
    """Obtener posts programados"""
    try:
        posts = await auto_posting_system.get_scheduled_posts(platform)
        
        return {
            "success": True,
            "posts": posts,
            "count": len(posts)
        }
        
    except Exception as e:
        logger.error(f"Error obteniendo posts programados: {e}")
        return {
            "success": False,
            "error": str(e)
        }

