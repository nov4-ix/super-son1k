#!/usr/bin/env python3
"""
🎤 Voice Cloning Backend - so-VITS & Bark Integration
Backend optimizado para so-VITS-SVC 4.0 y Bark
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from pydantic import BaseModel
import httpx
import asyncio
import os
import uuid
import json
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import subprocess
import tempfile
import shutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Voice Cloning API - so-VITS & Bark", version="2.0.0")
security = HTTPBearer()

# Configuration
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MODELS_DIR = os.getenv("MODELS_DIR", "./models")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "./output")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

# Ensure directories exist
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Models
class VoiceCloneRequest(BaseModel):
    text: str
    voice_settings: Dict[str, Any] = {}
    model_preference: Optional[str] = None

class VoiceCloneResponse(BaseModel):
    success: bool
    audio_url: str
    model_used: str
    duration: float
    quality: str
    tier: str
    usage_stats: Dict[str, Any]

class VoiceUploadRequest(BaseModel):
    voice_name: str
    description: Optional[str] = None

class VoiceTrainingRequest(BaseModel):
    voice_id: str
    training_data: Dict[str, Any]

# User tier management
def get_user_tier(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get user tier from JWT token"""
    if credentials.credentials:
        return "pro"  # Default to pro for testing
    return "free"

def check_tier_limits(tier: str, operation: str) -> bool:
    """Check if user can perform operation based on tier"""
    limits = {
        "free": {
            "voice_clone": {"monthly_minutes": 30, "max_duration": 30},
            "voice_upload": False,
            "voice_training": False
        },
        "pro": {
            "voice_clone": {"monthly_minutes": 300, "max_duration": 120},
            "voice_upload": True,
            "voice_training": False
        },
        "enterprise": {
            "voice_clone": {"monthly_minutes": 1800, "max_duration": 600},
            "voice_upload": True,
            "voice_training": True
        }
    }
    
    return limits.get(tier, limits["free"]).get(operation, False)

# so-VITS and Bark specific functions
class SoVITSProcessor:
    def __init__(self):
        self.model_id = "lj1995/VoiceConversionWebUI"
        self.api_url = "https://api-inference.huggingface.co/models"
    
    async def process_voice_conversion(self, audio_file: UploadFile, text: str, settings: Dict[str, Any]) -> Dict[str, Any]:
        """Process voice conversion using so-VITS-SVC 4.0"""
        try:
            # Save uploaded file temporarily
            temp_file = f"{UPLOAD_DIR}/temp_{uuid.uuid4()}_{audio_file.filename}"
            with open(temp_file, "wb") as buffer:
                content = await audio_file.read()
                buffer.write(content)
            
            # Prepare request for so-VITS
            files = {
                "audio": (audio_file.filename, open(temp_file, "rb"), "audio/wav"),
                "text": text
            }
            
            headers = {
                "Authorization": f"Bearer {HUGGINGFACE_API_KEY}"
            }
            
            # Make request to so-VITS
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/{self.model_id}",
                    files=files,
                    headers=headers,
                    timeout=120.0
                )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"so-VITS API error: {response.text}"
                )
            
            # Save result
            result_id = str(uuid.uuid4())
            result_path = f"{OUTPUT_DIR}/sovits_{result_id}.wav"
            
            with open(result_path, "wb") as f:
                f.write(response.content)
            
            # Clean up temp file
            os.remove(temp_file)
            
            return {
                "audio_url": f"/api/audio/{result_id}",
                "duration": self.estimate_duration(response.content),
                "model_info": {
                    "name": "so-VITS-SVC 4.0",
                    "provider": "huggingface",
                    "features": ["voice_conversion", "real_time", "multilingual"]
                }
            }
            
        except Exception as e:
            logger.error(f"so-VITS processing error: {e}")
            raise HTTPException(status_code=500, detail=f"so-VITS processing failed: {str(e)}")

    def estimate_duration(self, audio_content: bytes) -> float:
        """Estimate audio duration from content"""
        # Simple estimation based on file size
        # In a real implementation, you'd use librosa or similar
        return 30.0  # Default 30 seconds

class BarkProcessor:
    def __init__(self):
        self.model_id = "suno/bark"
        self.api_url = "https://api-inference.huggingface.co/models"
    
    async def process_text_to_speech(self, text: str, settings: Dict[str, Any]) -> Dict[str, Any]:
        """Process text-to-speech using Bark"""
        try:
            # Prepare text with emotion and language settings
            processed_text = self.prepare_text_for_bark(text, settings)
            
            # Prepare request for Bark
            payload = {
                "inputs": processed_text,
                "parameters": {
                    "max_length": 256,
                    "do_sample": True,
                    "temperature": 0.7,
                    "top_p": 0.9
                }
            }
            
            headers = {
                "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
                "Content-Type": "application/json"
            }
            
            # Make request to Bark
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/{self.model_id}",
                    json=payload,
                    headers=headers,
                    timeout=120.0
                )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Bark API error: {response.text}"
                )
            
            # Save result
            result_id = str(uuid.uuid4())
            result_path = f"{OUTPUT_DIR}/bark_{result_id}.wav"
            
            with open(result_path, "wb") as f:
                f.write(response.content)
            
            return {
                "audio_url": f"/api/audio/{result_id}",
                "duration": self.estimate_duration(response.content),
                "model_info": {
                    "name": "Bark Voice Cloning",
                    "provider": "huggingface",
                    "features": ["text_to_speech", "voice_cloning", "emotion_control", "multilingual"]
                }
            }
            
        except Exception as e:
            logger.error(f"Bark processing error: {e}")
            raise HTTPException(status_code=500, detail=f"Bark processing failed: {str(e)}")

    def prepare_text_for_bark(self, text: str, settings: Dict[str, Any]) -> str:
        """Prepare text with emotion and language markers for Bark"""
        emotion = settings.get('emotion', 'neutral')
        language = settings.get('language', 'es')
        
        # Add emotion markers for Bark
        emotion_markers = {
            'happy': '[laughing]',
            'sad': '[sighing]',
            'angry': '[shouting]',
            'fearful': '[whispering]',
            'surprised': '[exclaiming]',
            'disgusted': '[disgusted]',
            'neutral': ''
        }
        
        emotion_marker = emotion_markers.get(emotion, '')
        
        # Add language marker
        language_markers = {
            'es': '[SPANISH]',
            'en': '[ENGLISH]',
            'fr': '[FRENCH]',
            'de': '[GERMAN]',
            'it': '[ITALIAN]',
            'pt': '[PORTUGUESE]',
            'ja': '[JAPANESE]',
            'ko': '[KOREAN]',
            'zh': '[CHINESE]'
        }
        
        language_marker = language_markers.get(language, '[SPANISH]')
        
        # Combine markers with text
        if emotion_marker and language_marker:
            return f"{language_marker} {emotion_marker} {text}"
        elif language_marker:
            return f"{language_marker} {text}"
        elif emotion_marker:
            return f"{emotion_marker} {text}"
        else:
            return text

    def estimate_duration(self, audio_content: bytes) -> float:
        """Estimate audio duration from content"""
        # Simple estimation based on file size
        # In a real implementation, you'd use librosa or similar
        return 60.0  # Default 60 seconds for Bark

# Initialize processors
sovits_processor = SoVITSProcessor()
bark_processor = BarkProcessor()

# API Endpoints
@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "Voice Cloning API - so-VITS & Bark", 
        "version": "2.0.0",
        "models": {
            "so-vits": "so-VITS-SVC 4.0",
            "bark": "Bark Voice Cloning"
        }
    }

@app.post("/api/voice/clone", response_model=VoiceCloneResponse)
async def clone_voice(
    audio_file: UploadFile = File(...),
    request: VoiceCloneRequest = Depends(),
    tier: str = Depends(get_user_tier)
):
    """Clone voice using so-VITS or Bark based on use case"""
    
    if not check_tier_limits(tier, "voice_clone"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Voice cloning not available for your tier"
        )
    
    try:
        # Determine which model to use based on use case
        use_case = request.voice_settings.get('useCase', 'general')
        model_preference = request.model_preference or request.voice_settings.get('model')
        
        if use_case == 'voice_conversion' or (model_preference and 'so-vits' in model_preference):
            # Use so-VITS for voice conversion
            result = await sovits_processor.process_voice_conversion(
                audio_file, 
                request.text, 
                request.voice_settings
            )
            model_used = "so-VITS-SVC 4.0"
            quality = "high"
            
        elif use_case == 'text_to_speech' or (model_preference and 'bark' in model_preference):
            # Use Bark for text-to-speech
            result = await bark_processor.process_text_to_speech(
                request.text, 
                request.voice_settings
            )
            model_used = "Bark Voice Cloning"
            quality = "high"
            
        else:
            # Default to so-VITS for general use
            result = await sovits_processor.process_voice_conversion(
                audio_file, 
                request.text, 
                request.voice_settings
            )
            model_used = "so-VITS-SVC 4.0"
            quality = "high"
        
        # Update usage stats
        update_usage_stats(tier, result["duration"])
        
        return VoiceCloneResponse(
            success=True,
            audio_url=result["audio_url"],
            model_used=model_used,
            duration=result["duration"],
            quality=quality,
            tier=tier,
            usage_stats=get_usage_stats(tier)
        )
        
    except Exception as e:
        logger.error(f"Voice cloning failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Voice cloning failed: {str(e)}"
        )

@app.get("/api/voice/models")
async def get_available_models(tier: str = Depends(get_user_tier)):
    """Get available voice models for user tier"""
    
    models = {
        "free": [
            {
                "id": "so-vits-4.0",
                "name": "so-VITS-SVC 4.0",
                "provider": "huggingface",
                "model_id": "lj1995/VoiceConversionWebUI",
                "quality": "high",
                "max_duration": 30,
                "languages": ["es", "en", "ja", "ko", "zh"],
                "description": "Modelo de conversión de voz de alta calidad",
                "features": ["voice_conversion", "real_time", "multilingual"]
            },
            {
                "id": "bark-voice",
                "name": "Bark Voice Cloning",
                "provider": "huggingface",
                "model_id": "suno/bark",
                "quality": "high",
                "max_duration": 60,
                "languages": ["es", "en", "fr", "de", "it", "pt", "ja", "ko", "zh"],
                "description": "Modelo de clonación de voz con síntesis de texto a voz",
                "features": ["text_to_speech", "voice_cloning", "emotion_control", "multilingual"]
            }
        ],
        "pro": [
            {
                "id": "so-vits-4.0-pro",
                "name": "so-VITS-SVC 4.0 Pro",
                "provider": "huggingface",
                "model_id": "lj1995/VoiceConversionWebUI",
                "quality": "premium",
                "max_duration": 120,
                "languages": ["es", "en", "fr", "de", "it", "pt", "ja", "ko", "zh"],
                "description": "Versión Pro con mayor duración y calidad mejorada",
                "features": ["voice_conversion", "real_time", "multilingual", "extended_duration"]
            },
            {
                "id": "bark-pro",
                "name": "Bark Pro Voice Cloning",
                "provider": "huggingface",
                "model_id": "suno/bark",
                "quality": "premium",
                "max_duration": 180,
                "languages": ["es", "en", "fr", "de", "it", "pt", "ja", "ko", "zh"],
                "description": "Bark Pro con duración extendida y control emocional avanzado",
                "features": ["text_to_speech", "voice_cloning", "emotion_control", "multilingual", "extended_duration"]
            }
        ],
        "enterprise": [
            {
                "id": "so-vits-4.0-enterprise",
                "name": "so-VITS-SVC 4.0 Enterprise",
                "provider": "huggingface",
                "model_id": "lj1995/VoiceConversionWebUI",
                "quality": "professional",
                "max_duration": 300,
                "languages": ["es", "en", "fr", "de", "it", "pt", "ja", "ko", "zh", "ru", "ar"],
                "description": "Versión Enterprise con máxima calidad y soporte completo",
                "features": ["voice_conversion", "real_time", "multilingual", "extended_duration", "custom_training"]
            },
            {
                "id": "bark-enterprise",
                "name": "Bark Enterprise Voice Cloning",
                "provider": "huggingface",
                "model_id": "suno/bark",
                "quality": "professional",
                "max_duration": 600,
                "languages": ["es", "en", "fr", "de", "it", "pt", "ja", "ko", "zh", "ru", "ar"],
                "description": "Bark Enterprise con máxima duración y control completo",
                "features": ["text_to_speech", "voice_cloning", "emotion_control", "multilingual", "extended_duration", "custom_training"]
            }
        ]
    }
    
    return {
        "tier": tier,
        "models": models.get(tier, models["free"]),
        "limits": get_tier_limits(tier)
    }

@app.get("/api/voice/usage")
async def get_usage_stats(tier: str = Depends(get_user_tier)):
    """Get user usage statistics"""
    return get_usage_stats(tier)

# Audio serving endpoint
@app.get("/api/audio/{audio_id}")
async def serve_audio(audio_id: str):
    """Serve generated audio files"""
    
    # Try different file patterns
    possible_files = [
        f"{OUTPUT_DIR}/sovits_{audio_id}.wav",
        f"{OUTPUT_DIR}/bark_{audio_id}.wav",
        f"{OUTPUT_DIR}/{audio_id}.wav"
    ]
    
    for file_path in possible_files:
        if os.path.exists(file_path):
            return FileResponse(file_path, media_type="audio/wav")
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Audio file not found"
    )

# Helper functions
def get_usage_stats(tier: str) -> Dict[str, Any]:
    """Get user usage statistics"""
    return {
        "tier": tier,
        "monthly_minutes_used": 0,
        "monthly_requests_used": 0,
        "limits": get_tier_limits(tier)
    }

def get_tier_limits(tier: str) -> Dict[str, Any]:
    """Get tier limits"""
    limits = {
        "free": {
            "monthly_minutes": 30,
            "max_duration": 30,
            "quality": "high"
        },
        "pro": {
            "monthly_minutes": 300,
            "max_duration": 120,
            "quality": "premium"
        },
        "enterprise": {
            "monthly_minutes": 1800,
            "max_duration": 600,
            "quality": "professional"
        }
    }
    
    return limits.get(tier, limits["free"])

def update_usage_stats(tier: str, duration: float):
    """Update usage statistics"""
    logger.info(f"Usage updated for tier {tier}: {duration} seconds")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)


