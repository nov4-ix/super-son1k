#!/usr/bin/env python3
"""
🏛️ Son1kVers3 Enhanced - Community Endpoints
Sistema de comunidad y santuario
"""

from fastapi import APIRouter, HTTPException
import sqlite3
import os
from datetime import datetime

router = APIRouter(prefix="/api/community", tags=["community"])

def get_db_connection():
    """Obtener conexión a la base de datos SQLite"""
    db_path = os.path.join(os.getcwd(), "community.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    
    # Crear tabla si no existe
    conn.execute("""
        CREATE TABLE IF NOT EXISTS community_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            author TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            likes INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    
    return conn

@router.get("/posts")
async def get_community_posts():
    """Obtener posts de la comunidad"""
    try:
        conn = get_db_connection()
        posts = conn.execute(
            "SELECT * FROM community_posts ORDER BY created_at DESC LIMIT 10"
        ).fetchall()
        conn.close()
        
        return {
            "success": True,
            "posts": [dict(post) for post in posts]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/posts")
async def create_community_post(post_data: dict):
    """Crear un nuevo post en la comunidad"""
    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO community_posts (title, content, author) VALUES (?, ?, ?)",
            (post_data.get("title"), post_data.get("content"), post_data.get("author"))
        )
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Post creado exitosamente"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_community_status():
    """Obtener estado de la comunidad"""
    return {
        "status": "active",
        "members": 1337,
        "posts": 42,
        "sanctuary_level": "Resonancia"
    }