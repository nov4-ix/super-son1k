#!/bin/bash

# 🚀 Deploy Inmediato a Railway - Son1kVers3 Enhanced v2.0
echo "🚀 Desplegando backend a Railway inmediatamente..."

# Crear archivo de configuración para Railway
echo "⚙️ Creando configuración para Railway..."
cat > railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd backend && python3 main.py",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  },
  "env": {
    "NODE_ENV": "production",
    "PYTHON_VERSION": "3.12",
    "JWT_SECRET_KEY": "son1kvers3_enhanced_production_secret_key_2024",
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
    "CORS_ORIGINS": "https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com",
    "ALLOWED_HOSTS": "son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com",
    "UPLOAD_DIR": "./uploads/",
    "OUTPUT_DIR": "./output/",
    "LOGS_DIR": "./logs/",
    "HOST": "0.0.0.0",
    "PORT": "8000",
    "DEBUG": "false",
    "HEALTH_CHECK_ENABLED": "true",
    "METRICS_ENABLED": "true"
  }
}
EOF

# Crear archivo de configuración para Heroku
echo "⚙️ Creando configuración para Heroku..."
cat > Procfile << 'EOF'
web: cd backend && python3 main.py
EOF

cat > runtime.txt << 'EOF'
python-3.12.0
EOF

# Crear archivo de configuración para Render
echo "⚙️ Creando configuración para Render..."
cat > render.yaml << 'EOF'
services:
  - type: web
    name: son1kvers3-backend
    env: python
    buildCommand: pip install -r backend/requirements-simple.txt
    startCommand: cd backend && python3 main.py
    envVars:
      - key: NODE_ENV
        value: production
      - key: PYTHON_VERSION
        value: 3.12
      - key: JWT_SECRET_KEY
        value: son1kvers3_enhanced_production_secret_key_2024
      - key: JWT_ALGORITHM
        value: HS256
      - key: JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        value: 60
      - key: DATABASE_URL
        value: sqlite:///./son1kvers3.db
      - key: OLLAMA_BASE_URL
        value: http://localhost:11434
      - key: OLLAMA_MODEL
        value: qwen2.5:7b
      - key: SOVITS_MODEL_PATH
        value: ./models/sovits/
      - key: BARK_MODEL_PATH
        value: ./models/bark/
      - key: VOICE_CLONING_ENABLED
        value: true
      - key: NOVA_POST_ENABLED
        value: true
      - key: SOCIAL_MEDIA_ANALYSIS
        value: true
      - key: GHOST_STUDIO_ENABLED
        value: true
      - key: AUDIO_ANALYSIS_ENABLED
        value: true
      - key: ANALYTICS_ENABLED
        value: true
      - key: METRICS_COLLECTION
        value: true
      - key: DAW_EDITOR_ENABLED
        value: true
      - key: AUDIO_EXPORT_ENABLED
        value: true
      - key: CORS_ORIGINS
        value: https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com
      - key: ALLOWED_HOSTS
        value: son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com
      - key: UPLOAD_DIR
        value: ./uploads/
      - key: OUTPUT_DIR
        value: ./output/
      - key: LOGS_DIR
        value: ./logs/
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: 8000
      - key: DEBUG
        value: false
      - key: HEALTH_CHECK_ENABLED
        value: true
      - key: METRICS_ENABLED
        value: true
EOF

# Crear ZIP del backend
echo "📦 Creando ZIP del backend..."
zip -r son1kvers3-backend-railway.zip backend/ railway.json Procfile runtime.txt render.yaml

echo "✅ Archivos de deploy creados:"
echo "  📦 son1kvers3-backend-railway.zip - Backend para Railway"
echo "  ⚙️ railway.json - Configuración Railway"
echo "  ⚙️ Procfile - Configuración Heroku"
echo "  ⚙️ runtime.txt - Python version"
echo "  ⚙️ render.yaml - Configuración Render"
echo ""
echo "🌐 INSTRUCCIONES DE DEPLOY:"
echo ""
echo "1. 🚀 RAILWAY (Recomendado):"
echo "   - Ve a https://railway.app"
echo "   - Crea nuevo proyecto"
echo "   - Sube son1kvers3-backend-railway.zip"
echo "   - Configura variables de entorno"
echo "   - Deploy automático"
echo ""
echo "2. 🔧 HEROKU:"
echo "   - Ve a https://heroku.com"
echo "   - Crea nueva app"
echo "   - Sube son1kvers3-backend-railway.zip"
echo "   - Configura variables de entorno"
echo "   - Deploy automático"
echo ""
echo "3. 🌐 RENDER:"
echo "   - Ve a https://render.com"
echo "   - Crea nuevo servicio web"
echo "   - Sube son1kvers3-backend-railway.zip"
echo "   - Configura variables de entorno"
echo "   - Deploy automático"
echo ""
echo "4. 🔗 DESPUÉS DEL DEPLOY:"
echo "   - Copia la URL del backend desplegado"
echo "   - Configura DNS con esa URL"
echo "   - Prueba la integración"
echo ""
echo "✅ ¡Backend listo para deploy!"
