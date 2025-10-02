#!/bin/bash

# 🚀 Deploy Automático a Railway - Son1kVers3 Enhanced v2.0
echo "🚀 Iniciando deploy automático a Railway..."

# Verificar que el ZIP existe
if [ ! -f "son1kvers3-backend-railway.zip" ]; then
    echo "❌ Error: son1kvers3-backend-railway.zip no encontrado"
    echo "Ejecuta primero: ./deploy_railway_now.sh"
    exit 1
fi

# Crear archivo de configuración Railway
echo "⚙️ Creando configuración Railway..."
cat > railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "pip install -r backend/requirements-simple.txt"
  },
  "deploy": {
    "startCommand": "cd backend && python3 main.py",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  },
  "env": {
    "NODE_ENV": "production",
    "PYTHON_VERSION": "3.12",
    "PYTHONPATH": "/app/backend",
    "JWT_SECRET_KEY": "son1kvers3_enhanced_production_secret_key_2024_railway_secure",
    "JWT_ALGORITHM": "HS256",
    "JWT_ACCESS_TOKEN_EXPIRE_MINUTES": "60",
    "DATABASE_URL": "sqlite:///./son1kvers3.db",
    "OLLAMA_BASE_URL": "http://localhost:11434",
    "OLLAMA_MODEL": "qwen2.5:7b",
    "SOVITS_MODEL_PATH": "./models/sovits/",
    "BARK_MODEL_PATH": "./models/bark/",
    "VOICE_CLONING_ENABLED": "true",
    "NOVA_POST_ENABLED": "true",
    "SOCIAL_MEDIA_ANALYSIS": "true",
    "GHOST_STUDIO_ENABLED": "true",
    "AUDIO_ANALYSIS_ENABLED": "true",
    "ANALYTICS_ENABLED": "true",
    "METRICS_COLLECTION": "true",
    "DAW_EDITOR_ENABLED": "true",
    "AUDIO_EXPORT_ENABLED": "true",
    "CORS_ORIGINS": "https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com,https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app,http://localhost:3000,http://127.0.0.1:3000",
    "ALLOWED_HOSTS": "son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com,son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app,localhost,127.0.0.1",
    "UPLOAD_DIR": "./uploads/",
    "OUTPUT_DIR": "./output/",
    "LOGS_DIR": "./logs/",
    "HOST": "0.0.0.0",
    "PORT": "8000",
    "DEBUG": "false",
    "HEALTH_CHECK_ENABLED": "true",
    "METRICS_ENABLED": "true",
    "RAILWAY_ENVIRONMENT": "production",
    "RAILWAY_STATIC_URL": "https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app",
    "RAILWAY_PUBLIC_DOMAIN": "backend-api.son1kvers3.com"
  }
}
EOF

# Crear archivo de configuración TOML
echo "⚙️ Creando configuración TOML..."
cat > railway.toml << 'EOF'
[build]
builder = "nixpacks"
buildCommand = "pip install -r backend/requirements-simple.txt"

[deploy]
startCommand = "cd backend && python3 main.py"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[env]
NODE_ENV = "production"
PYTHON_VERSION = "3.12"
PYTHONPATH = "/app/backend"
JWT_SECRET_KEY = "son1kvers3_enhanced_production_secret_key_2024_railway_secure"
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = "60"
DATABASE_URL = "sqlite:///./son1kvers3.db"
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "qwen2.5:7b"
SOVITS_MODEL_PATH = "./models/sovits/"
BARK_MODEL_PATH = "./models/bark/"
VOICE_CLONING_ENABLED = "true"
NOVA_POST_ENABLED = "true"
SOCIAL_MEDIA_ANALYSIS = "true"
GHOST_STUDIO_ENABLED = "true"
AUDIO_ANALYSIS_ENABLED = "true"
ANALYTICS_ENABLED = "true"
METRICS_COLLECTION = "true"
DAW_EDITOR_ENABLED = "true"
AUDIO_EXPORT_ENABLED = "true"
CORS_ORIGINS = "https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com,https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app,http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_HOSTS = "son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com,son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app,localhost,127.0.0.1"
UPLOAD_DIR = "./uploads/"
OUTPUT_DIR = "./output/"
LOGS_DIR = "./logs/"
HOST = "0.0.0.0"
PORT = "8000"
DEBUG = "false"
HEALTH_CHECK_ENABLED = "true"
METRICS_ENABLED = "true"
RAILWAY_ENVIRONMENT = "production"
RAILWAY_STATIC_URL = "https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app"
RAILWAY_PUBLIC_DOMAIN = "backend-api.son1kvers3.com"
EOF

# Crear ZIP actualizado
echo "📦 Creando ZIP actualizado..."
zip -r son1kvers3-backend-railway-final.zip backend/ railway.json railway.toml

echo "✅ Archivos de deploy creados:"
echo "  📦 son1kvers3-backend-railway-final.zip - Backend completo"
echo "  ⚙️ railway.json - Configuración JSON"
echo "  ⚙️ railway.toml - Configuración TOML"
echo ""
echo "🌐 INSTRUCCIONES DE DEPLOY:"
echo ""
echo "1. 🚀 Ve a https://railway.app"
echo "2. 🔑 Inicia sesión con tu cuenta"
echo "3. ➕ Clic en 'New Project'"
echo "4. 📁 Selecciona 'Deploy from folder'"
echo "5. 📤 Sube: son1kvers3-backend-railway-final.zip"
echo "6. ⚙️ Configura variables de entorno (ver RAILWAY_DEPLOY_GUIDE.md)"
echo "7. 🚀 Clic en 'Deploy'"
echo "8. ⏱️ Espera 2-5 minutos"
echo "9. 🔗 Copia la URL del backend"
echo "10. 🌐 Configura DNS con esa URL"
echo ""
echo "📋 DESPUÉS DEL DEPLOY:"
echo "  - Copia la URL del backend (ej: https://son1kvers3-backend-production.up.railway.app)"
echo "  - Configura DNS: backend-api.son1kvers3.com → [URL_DEL_BACKEND]"
echo "  - Prueba: https://backend-api.son1kvers3.com/health"
echo ""
echo "✅ ¡Backend listo para deploy en Railway!"
