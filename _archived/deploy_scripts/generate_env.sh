#!/bin/bash
# 🎵 Son1kVers3 Enhanced - Generador de .env
# Script para crear automáticamente el archivo .env

echo "🎵 Generando archivo .env para Son1kVers3 Enhanced..."

# Verificar si ya existe un .env
if [ -f .env ]; then
    echo "⚠️  El archivo .env ya existe."
    read -p "¿Quieres sobrescribirlo? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Operación cancelada."
        exit 1
    fi
fi

# Generar JWT secret aleatorio
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "son1kvers3_enhanced_$(date +%s)_secret_key_2024")

# Crear el archivo .env
cat > .env << EOF
# 🎵 Son1kVers3 Enhanced - Configuración de Entorno
# Generado automáticamente el $(date)

# ===========================================
# CONFIGURACIÓN PRINCIPAL
# ===========================================
NODE_ENV=development
DEBUG=true
PORT=8000
HOST=0.0.0.0

# ===========================================
# FRONTEND CONFIGURATION
# ===========================================
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_OLLAMA_URL=http://localhost:11434
REACT_APP_VOICE_CLONING_URL=http://localhost:8002
REACT_APP_NOVA_POST_URL=http://localhost:8001
REACT_APP_ANALYTICS_URL=http://localhost:8003
REACT_APP_STEALTH_URL=http://localhost:8004

# ===========================================
# BACKEND CONFIGURATION
# ===========================================
# Base de datos
DATABASE_URL=sqlite:///./son1kvers3.db
DATABASE_PATH=./son1kvers3.db

# Redis (opcional para desarrollo)
REDIS_URL=redis://localhost:6379

# ===========================================
# IA Y MODELOS
# ===========================================
# Ollama
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_BASE_URL=http://localhost:11434

# Hugging Face (opcional - reemplaza con tu API key)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Suno AI (opcional - reemplaza con tu API key)
SUNO_API_KEY=sk_404be84f94774fc7a6d8350b52ee6842
SUNO_API_BASE_URL=https://sunoapi.com/api
SUNO_GENERATE_PATH=/v1/generate
SUNO_REQUEST_TIMEOUT=60
SUNO_MAX_RETRIES=4
SUNO_MAX_CONCURRENCY=20
SUNO_SANITIZE_PROMPTS=true

# ===========================================
# VOICE CLONING
# ===========================================
# so-VITS-SVC
SOVITS_MODEL_PATH=./models/sovits
VOICE_CLONING_ENABLED=true

# Bark
BARK_MODEL_PATH=./models/bark

# ===========================================
# REDES SOCIALES (opcional)
# ===========================================
# Instagram
INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here

# TikTok
TIKTOK_ACCESS_TOKEN=your_tiktok_token_here

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key_here

# Twitter/X
TWITTER_API_KEY=your_twitter_api_key_here

# ===========================================
# SEGURIDAD
# ===========================================
# JWT
JWT_SECRET_KEY=${JWT_SECRET}
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001

# ===========================================
# DIRECTORIOS
# ===========================================
UPLOAD_DIR=./uploads/
OUTPUT_DIR=./output/
LOGS_DIR=./logs/
MODELS_DIR=./models/

# ===========================================
# SERVICIOS
# ===========================================
NOVA_POST_ENABLED=true
SOCIAL_MEDIA_ANALYSIS=true
GHOST_STUDIO_ENABLED=true
AUDIO_ANALYSIS_ENABLED=true
ANALYTICS_ENABLED=true
METRICS_COLLECTION=true
DAW_EDITOR_ENABLED=true
AUDIO_EXPORT_ENABLED=true
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true

# ===========================================
# PROXY CONFIGURATION (opcional)
# ===========================================
PROXY_LIST=
PROXY_ROTATION_ENABLED=false

# ===========================================
# DEVELOPMENT FLAGS
# ===========================================
ENABLE_DEBUG_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_ERROR_REPORTING=true
EOF

echo "✅ Archivo .env generado exitosamente!"
echo ""
echo "📍 Ubicación: $(pwd)/.env"
echo ""
echo "🔑 JWT Secret generado: ${JWT_SECRET}"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Revisa y configura las API keys que necesites"
echo "   - Las APIs opcionales funcionarán en modo fallback sin keys"
echo "   - El JWT secret se generó automáticamente"
echo ""
echo "🚀 Para comenzar:"
echo "   1. Revisa el archivo .env generado"
echo "   2. Configura las API keys que tengas"
echo "   3. Ejecuta: ./setup_development.sh"
echo ""
echo "🎵 ¡Son1kVers3 Enhanced listo para configurar!"
