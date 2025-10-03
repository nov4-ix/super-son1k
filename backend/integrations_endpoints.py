#!/usr/bin/env python3
"""
🔗 Integrations API Endpoints
Endpoints para integraciones con servicios externos
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime
from integrations_system import (
    spotify_integration,
    apple_music_integration,
    social_media_integration,
    marketing_tools_integration,
    cloud_services_integration
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])

# ============= MODELOS DE DATOS =============

class SpotifyAuthRequest(BaseModel):
    client_id: str
    client_secret: str

class CreatePlaylistRequest(BaseModel):
    user_id: str
    name: str
    description: Optional[str] = ""
    public: bool = True

class SocialMediaPostRequest(BaseModel):
    platform: str
    content: Dict[str, Any]
    credentials: Dict[str, str]

class SchedulePostRequest(BaseModel):
    platform: str
    content: Dict[str, Any]
    scheduled_time: str
    credentials: Dict[str, str]

class CloudUploadRequest(BaseModel):
    provider: str
    file_data: Dict[str, Any]
    credentials: Dict[str, str]

class CloudAIRequest(BaseModel):
    provider: str
    task: str
    data: Dict[str, Any]
    credentials: Dict[str, str]


# ============= SPOTIFY ENDPOINTS =============

@router.post("/spotify/authenticate")
async def authenticate_spotify(request: SpotifyAuthRequest):
    """Autenticar con Spotify"""
    try:
        spotify_integration.client_id = request.client_id
        spotify_integration.client_secret = request.client_secret
        result = await spotify_integration.authenticate()
        return result
    except Exception as e:
        logger.error(f"Error authenticating with Spotify: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/spotify/create-playlist")
async def create_spotify_playlist(request: CreatePlaylistRequest):
    """Crear playlist en Spotify"""
    try:
        result = await spotify_integration.create_playlist(
            request.user_id,
            request.name,
            request.description,
            request.public
        )
        return result
    except Exception as e:
        logger.error(f"Error creating Spotify playlist: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/spotify/search")
async def search_spotify(query: str, limit: int = 20):
    """Buscar tracks en Spotify"""
    try:
        result = await spotify_integration.search_tracks(query, limit)
        return result
    except Exception as e:
        logger.error(f"Error searching Spotify: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/spotify/upload-track")
async def upload_to_spotify(track_data: Dict[str, Any]):
    """Información sobre cómo subir tracks a Spotify"""
    try:
        result = await spotify_integration.upload_track(track_data)
        return result
    except Exception as e:
        logger.error(f"Error with Spotify upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= APPLE MUSIC ENDPOINTS =============

@router.get("/apple-music/search")
async def search_apple_music(query: str, types: str = "songs", limit: int = 25):
    """Buscar en Apple Music"""
    try:
        types_list = types.split(",")
        result = await apple_music_integration.search_catalog(query, types_list, limit)
        return result
    except Exception as e:
        logger.error(f"Error searching Apple Music: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/apple-music/track/{track_id}")
async def get_apple_music_track(track_id: str):
    """Obtener información de track de Apple Music"""
    try:
        result = await apple_music_integration.get_track_info(track_id)
        return result
    except Exception as e:
        logger.error(f"Error getting Apple Music track: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= SOCIAL MEDIA ENDPOINTS =============

@router.post("/social-media/post")
async def post_to_social_media(request: SocialMediaPostRequest):
    """Publicar contenido en red social"""
    try:
        result = await social_media_integration.post_to_platform(
            request.platform,
            request.content,
            request.credentials
        )
        return result
    except Exception as e:
        logger.error(f"Error posting to social media: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/social-media/schedule")
async def schedule_social_media_post(request: SchedulePostRequest):
    """Programar publicación en red social"""
    try:
        scheduled_time = datetime.fromisoformat(request.scheduled_time)
        result = await social_media_integration.schedule_post(
            request.platform,
            request.content,
            scheduled_time,
            request.credentials
        )
        return result
    except Exception as e:
        logger.error(f"Error scheduling post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/social-media/analytics/{platform}/{post_id}")
async def get_social_media_analytics(platform: str, post_id: str, credentials: Dict[str, str] = {}):
    """Obtener analytics de publicación"""
    try:
        result = await social_media_integration.get_analytics(platform, post_id, credentials)
        return result
    except Exception as e:
        logger.error(f"Error getting social media analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/social-media/platforms")
async def get_supported_platforms():
    """Obtener plataformas soportadas"""
    return {
        "success": True,
        "platforms": list(social_media_integration.platforms.keys()),
        "details": {
            "instagram": {"features": ["posts", "stories", "reels"], "analytics": True},
            "tiktok": {"features": ["videos"], "analytics": True},
            "twitter": {"features": ["tweets", "threads"], "analytics": True},
            "youtube": {"features": ["videos", "shorts"], "analytics": True}
        }
    }


# ============= MARKETING TOOLS ENDPOINTS =============

@router.post("/marketing/schedule-campaign")
async def schedule_marketing_campaign(tool: str, campaign_data: Dict[str, Any], credentials: Dict[str, str]):
    """Programar campaña de marketing"""
    try:
        result = await marketing_tools_integration.schedule_campaign(tool, campaign_data, credentials)
        return result
    except Exception as e:
        logger.error(f"Error scheduling marketing campaign: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/marketing/tools")
async def get_marketing_tools():
    """Obtener herramientas de marketing soportadas"""
    return {
        "success": True,
        "tools": list(marketing_tools_integration.tools.keys()),
        "details": {
            "hootsuite": {"features": ["Social media scheduling", "Analytics"], "pricing": "Paid"},
            "buffer": {"features": ["Social media scheduling", "Publishing"], "pricing": "Freemium"},
            "mailchimp": {"features": ["Email campaigns", "Automation"], "pricing": "Freemium"}
        }
    }


# ============= CLOUD SERVICES ENDPOINTS =============

@router.post("/cloud/upload")
async def upload_to_cloud(request: CloudUploadRequest):
    """Subir archivo a almacenamiento cloud"""
    try:
        result = await cloud_services_integration.upload_to_storage(
            request.provider,
            request.file_data,
            request.credentials
        )
        return result
    except Exception as e:
        logger.error(f"Error uploading to cloud: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cloud/ai-process")
async def process_with_cloud_ai(request: CloudAIRequest):
    """Procesar con servicios de IA cloud"""
    try:
        result = await cloud_services_integration.process_with_ai(
            request.provider,
            request.task,
            request.data,
            request.credentials
        )
        return result
    except Exception as e:
        logger.error(f"Error processing with cloud AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cloud/providers")
async def get_cloud_providers():
    """Obtener proveedores cloud soportados"""
    return {
        "success": True,
        "providers": list(cloud_services_integration.providers.keys()),
        "details": {
            "aws": {
                "services": ["S3 Storage", "SageMaker AI", "Lambda Functions"],
                "regions": ["us-east-1", "us-west-2", "eu-west-1"]
            },
            "gcp": {
                "services": ["Cloud Storage", "Vertex AI", "Cloud Functions"],
                "regions": ["us-central1", "europe-west1", "asia-east1"]
            },
            "azure": {
                "services": ["Blob Storage", "Cognitive Services", "Azure Functions"],
                "regions": ["eastus", "westeurope", "southeastasia"]
            }
        }
    }


# ============= INTEGRATION STATUS ENDPOINT =============

@router.get("/status")
async def get_integrations_status():
    """Obtener estado de todas las integraciones"""
    return {
        "success": True,
        "integrations": {
            "spotify": {
                "status": "active" if spotify_integration.access_token else "inactive",
                "authenticated": bool(spotify_integration.access_token)
            },
            "apple_music": {
                "status": "active" if apple_music_integration.developer_token else "inactive",
                "authenticated": bool(apple_music_integration.developer_token)
            },
            "social_media": {
                "status": "active",
                "platforms": len(social_media_integration.platforms)
            },
            "marketing_tools": {
                "status": "active",
                "tools": len(marketing_tools_integration.tools)
            },
            "cloud_services": {
                "status": "active",
                "providers": len(cloud_services_integration.providers)
            }
        },
        "timestamp": datetime.now().isoformat()
    }
