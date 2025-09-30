#!/usr/bin/env python3
"""
👥 Community Endpoints - Sistema de Colaboraciones y Likes
Endpoints para el sistema de comunidad musical
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import json
import os
from datetime import datetime

router = APIRouter(prefix="/api/community", tags=["community"])

# Modelos de datos
class Track(BaseModel):
    id: int
    title: str
    artist: str
    likes: int = 0
    comments: int = 0
    shares: int = 0
    duration: str
    genre: str
    cover_url: Optional[str] = None
    audio_url: str
    liked: bool = False

class Collaboration(BaseModel):
    id: int
    title: str
    participants: List[str]
    status: str
    progress: int
    deadline: str

class UserStats(BaseModel):
    total_likes: int = 0
    total_comments: int = 0
    total_shares: int = 0
    rank: int = 0

class LikeRequest(BaseModel):
    track_id: int

class CommentRequest(BaseModel):
    track_id: int
    comment: str

class ShareRequest(BaseModel):
    track_id: int

# Base de datos
def get_db_connection():
    # Usar directorio temporal en Vercel
    db_path = os.getenv("DATABASE_PATH", "community.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_community_db():
    """Inicializar base de datos de comunidad"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabla de tracks
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            shares INTEGER DEFAULT 0,
            duration TEXT,
            genre TEXT,
            cover_url TEXT,
            audio_url TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de likes por usuario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            track_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (track_id) REFERENCES tracks (id),
            UNIQUE(user_id, track_id)
        )
    ''')
    
    # Tabla de comentarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            track_id INTEGER NOT NULL,
            user_id TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (track_id) REFERENCES tracks (id)
        )
    ''')
    
    # Tabla de colaboraciones
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS collaborations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            participants TEXT NOT NULL,  -- JSON array
            status TEXT DEFAULT 'En progreso',
            progress INTEGER DEFAULT 0,
            deadline TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de moderación y baneos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS moderation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            violation_type TEXT NOT NULL,
            violation_description TEXT,
            action_taken TEXT NOT NULL,  -- warning, mute, ban
            moderator_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NULL
        )
    ''')
    
    # Tabla de usuarios baneados
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS banned_users (
            user_id TEXT PRIMARY KEY,
            ban_reason TEXT NOT NULL,
            banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NULL,
            is_permanent BOOLEAN DEFAULT FALSE
        )
    ''')
    
    # Insertar datos de ejemplo
    cursor.execute('SELECT COUNT(*) FROM tracks')
    if cursor.fetchone()[0] == 0:
        sample_tracks = [
            ("Cyberpunk Dreams", "Pixel_Pro", 1247, 89, 156, "3:24", "Electronic", "/covers/cyberpunk.jpg", "/audio/cyberpunk.mp3"),
            ("Neon Nights", "Ghost_Master", 892, 67, 98, "2:58", "Synthwave", "/covers/neon.jpg", "/audio/neon.mp3"),
            ("Digital Resistance", "Quantum_Beat", 756, 45, 123, "4:12", "Industrial", "/covers/resistance.jpg", "/audio/resistance.mp3"),
            ("Matrix Symphony", "Resistance_Alpha", 634, 34, 87, "5:30", "Ambient", "/covers/matrix.jpg", "/audio/matrix.mp3"),
            ("Glitch Protocol", "Neon_Producer", 523, 28, 76, "3:45", "Glitch", "/covers/glitch.jpg", "/audio/glitch.mp3")
        ]
        
        cursor.executemany('''
            INSERT INTO tracks (title, artist, likes, comments, shares, duration, genre, cover_url, audio_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_tracks)
        
        # Colaboraciones de ejemplo
        sample_collaborations = [
            ("Proyecto Colaborativo: Matrix Symphony", '["Pixel_Pro", "Ghost_Master", "Quantum_Beat"]', "En progreso", 75, "2024-10-15"),
            ("Remix Challenge: Cyberpunk Anthems", '["Resistance_Alpha", "Neon_Producer"]', "Completado", 100, "2024-10-10"),
            ("Album Colectivo: Digital Resistance", '["Pixel_Pro", "Quantum_Beat", "Neon_Producer"]', "En progreso", 45, "2024-11-01")
        ]
        
        cursor.executemany('''
            INSERT INTO collaborations (title, participants, status, progress, deadline)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_collaborations)
    
    conn.commit()
    conn.close()

# Inicializar base de datos al importar
init_community_db()

@router.get("/top-tracks")
async def get_top_tracks(limit: int = 10):
    """Obtener canciones más likeadas"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM tracks 
        ORDER BY likes DESC 
        LIMIT ?
    ''', (limit,))
    
    tracks = []
    for row in cursor.fetchall():
        tracks.append({
            "id": row["id"],
            "title": row["title"],
            "artist": row["artist"],
            "likes": row["likes"],
            "comments": row["comments"],
            "shares": row["shares"],
            "duration": row["duration"],
            "genre": row["genre"],
            "coverUrl": row["cover_url"],
            "audioUrl": row["audio_url"],
            "liked": False  # Se verificaría con el usuario actual
        })
    
    conn.close()
    return {"tracks": tracks}

@router.get("/collaborations")
async def get_collaborations():
    """Obtener colaboraciones activas"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM collaborations 
        ORDER BY created_at DESC
    ''')
    
    collaborations = []
    for row in cursor.fetchall():
        collaborations.append({
            "id": row["id"],
            "title": row["title"],
            "participants": json.loads(row["participants"]),
            "status": row["status"],
            "progress": row["progress"],
            "deadline": row["deadline"]
        })
    
    conn.close()
    return {"collaborations": collaborations}

@router.get("/user-stats")
async def get_user_stats(user_id: str = "default_user"):
    """Obtener estadísticas del usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Contar likes del usuario
    cursor.execute('SELECT COUNT(*) FROM user_likes WHERE user_id = ?', (user_id,))
    total_likes = cursor.fetchone()[0]
    
    # Contar comentarios del usuario
    cursor.execute('SELECT COUNT(*) FROM comments WHERE user_id = ?', (user_id,))
    total_comments = cursor.fetchone()[0]
    
    # Contar shares (simulado)
    total_shares = total_likes // 2  # Aproximación
    
    # Calcular ranking (simulado)
    rank = max(1, 100 - total_likes)
    
    conn.close()
    
    return {
        "totalLikes": total_likes,
        "totalComments": total_comments,
        "totalShares": total_shares,
        "rank": rank
    }

@router.post("/like/{track_id}")
async def like_track(track_id: int, user_id: str = "default_user"):
    """Dar like a una canción"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Verificar si ya le dio like
        cursor.execute('''
            SELECT id FROM user_likes 
            WHERE user_id = ? AND track_id = ?
        ''', (user_id, track_id))
        
        if cursor.fetchone():
            return {"message": "Ya le diste like a esta canción"}
        
        # Agregar like
        cursor.execute('''
            INSERT INTO user_likes (user_id, track_id) 
            VALUES (?, ?)
        ''', (user_id, track_id))
        
        # Incrementar contador de likes
        cursor.execute('''
            UPDATE tracks 
            SET likes = likes + 1 
            WHERE id = ?
        ''', (track_id,))
        
        conn.commit()
        return {"message": "Like agregado correctamente"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.post("/comment/{track_id}")
async def comment_track(track_id: int, request: CommentRequest, user_id: str = "default_user"):
    """Comentar una canción"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Agregar comentario
        cursor.execute('''
            INSERT INTO comments (track_id, user_id, comment) 
            VALUES (?, ?, ?)
        ''', (track_id, user_id, request.comment))
        
        # Incrementar contador de comentarios
        cursor.execute('''
            UPDATE tracks 
            SET comments = comments + 1 
            WHERE id = ?
        ''', (track_id,))
        
        conn.commit()
        return {"message": "Comentario agregado correctamente"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.post("/share/{track_id}")
async def share_track(track_id: int, user_id: str = "default_user"):
    """Compartir una canción"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Incrementar contador de shares
        cursor.execute('''
            UPDATE tracks 
            SET shares = shares + 1 
            WHERE id = ?
        ''', (track_id,))
        
        conn.commit()
        return {"message": "Share registrado correctamente"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.post("/add-track")
async def add_track(track: Track):
    """Agregar nueva canción a la comunidad"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO tracks (title, artist, duration, genre, cover_url, audio_url)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (track.title, track.artist, track.duration, track.genre, track.cover_url, track.audio_url))
        
        conn.commit()
        return {"message": "Canción agregada correctamente", "id": cursor.lastrowid}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/resistance-message")
async def get_resistance_message():
    """Obtener mensaje de la resistencia"""
    return {
        "message": "Lo imperfecto también es sagrado",
        "manifesto": "Cualquier comentario sobre una canción es subjetivo. Nadie puede decir lo que está bien y lo que está mal, porque todo ha partido de un sentimiento genuino.",
        "warning": "Cualquier persona sorprendida haciendo comentarios destructivos, corre el riesgo de no poder participar más en chats, comentarios o definitivamente baneo de la plataforma.",
        "signature": "BELLA.exe - La Liga del No Silencio"
    }

# Funciones de moderación
def is_user_banned(user_id: str) -> bool:
    """Verificar si un usuario está baneado"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id FROM banned_users 
        WHERE user_id = ? AND (expires_at IS NULL OR expires_at > datetime('now'))
    ''', (user_id,))
    
    result = cursor.fetchone() is not None
    conn.close()
    return result

def check_comment_toxicity(comment: str) -> dict:
    """Verificar toxicidad en comentarios (optimizado)"""
    # Lista expandida de palabras tóxicas
    toxic_keywords = [
        'odio', 'basura', 'mierda', 'estúpido', 'idiota', 'tonto', 'imbécil',
        'hate', 'trash', 'stupid', 'idiot', 'dumb', 'sucks', 'crap',
        'puto', 'puta', 'joder', 'coño', 'fuck', 'shit', 'damn',
        'feo', 'ugly', 'asqueroso', 'disgusting', 'repugnante'
    ]
    
    # Palabras que indican spam
    spam_keywords = [
        'comprar', 'venta', 'oferta', 'descuento', 'gratis', 'click aquí',
        'buy', 'sale', 'offer', 'discount', 'free', 'click here'
    ]
    
    comment_lower = comment.lower()
    
    # Verificar toxicidad
    toxic_words = [kw for kw in toxic_keywords if kw in comment_lower]
    toxic_count = len(toxic_words)
    
    # Verificar spam
    spam_words = [kw for kw in spam_keywords if kw in comment_lower]
    spam_count = len(spam_words)
    
    # Calcular nivel de toxicidad
    toxicity_level = min((toxic_count * 25) + (spam_count * 15), 100)
    
    return {
        "is_toxic": toxic_count > 0 or spam_count > 2,
        "is_spam": spam_count > 2,
        "toxicity_level": toxicity_level,
        "detected_keywords": toxic_words,
        "spam_keywords": spam_words,
        "comment_length": len(comment),
        "suspicious_patterns": [
            "repeated_chars" if any(comment.count(c) > 5 for c in set(comment.lower()) if c.isalpha()) else None,
            "all_caps" if comment.isupper() and len(comment) > 10 else None,
            "excessive_punctuation" if comment.count('!') > 3 or comment.count('?') > 3 else None
        ]
    }

@router.post("/moderate/comment")
async def moderate_comment(request: CommentRequest, user_id: str = "default_user"):
    """Moderar comentario antes de publicarlo"""
    
    # Verificar si el usuario está baneado
    if is_user_banned(user_id):
        raise HTTPException(status_code=403, detail="Usuario baneado de la plataforma")
    
    # Verificar toxicidad
    toxicity_check = check_comment_toxicity(request.comment)
    
    if toxicity_check["is_toxic"]:
        # Registrar violación
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO moderation (user_id, violation_type, violation_description, action_taken, moderator_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id, 
            "toxic_comment", 
            f"Comentario tóxico detectado: {request.comment[:100]}...",
            "warning",
            "system"
        ))
        
        conn.commit()
        conn.close()
        
        raise HTTPException(
            status_code=400, 
            detail={
                "message": "Comentario rechazado por contenido tóxico",
                "warning": "Has recibido una advertencia. Comentarios destructivos pueden resultar en baneo.",
                "toxicity_level": toxicity_check["toxicity_level"]
            }
        )
    
    # Si no es tóxico, proceder con el comentario normal
    return await comment_track(request.track_id, request, user_id)

@router.post("/moderate/ban-user")
async def ban_user(user_id: str, reason: str, moderator_id: str = "admin"):
    """Banear usuario (solo para moderadores)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Agregar a usuarios baneados
        cursor.execute('''
            INSERT OR REPLACE INTO banned_users (user_id, ban_reason, is_permanent)
            VALUES (?, ?, ?)
        ''', (user_id, reason, True))
        
        # Registrar acción de moderación
        cursor.execute('''
            INSERT INTO moderation (user_id, violation_type, violation_description, action_taken, moderator_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, "ban", reason, "ban", moderator_id))
        
        conn.commit()
        return {"message": f"Usuario {user_id} baneado permanentemente", "reason": reason}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/moderate/check-user/{user_id}")
async def check_user_status(user_id: str):
    """Verificar estado de moderación de un usuario"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verificar baneos
    cursor.execute('''
        SELECT * FROM banned_users 
        WHERE user_id = ? AND (expires_at IS NULL OR expires_at > datetime('now'))
    ''', (user_id,))
    
    ban_info = cursor.fetchone()
    
    # Verificar advertencias recientes
    cursor.execute('''
        SELECT COUNT(*) FROM moderation 
        WHERE user_id = ? AND action_taken = 'warning' 
        AND created_at > datetime('now', '-30 days')
    ''', (user_id,))
    
    warnings_count = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "user_id": user_id,
        "is_banned": ban_info is not None,
        "ban_reason": ban_info["ban_reason"] if ban_info else None,
        "warnings_last_30_days": warnings_count,
        "status": "banned" if ban_info else "active"
    }
