#!/bin/bash

# 🌐 Son1kVers3 Enhanced v2.0 - Integración a Producción
echo "🌐 Integrando Son1kVers3 Enhanced v2.0 a son1kvers3.com..."

# Crear build de producción del frontend
echo "📦 Creando build de producción del frontend..."
cd frontend
npm run build
cd ..

# Crear archivo de configuración para Vercel con dominio personalizado
echo "⚙️ Configurando Vercel para son1kvers3.com..."
cat > vercel-production.json << 'EOF'
{
  "version": 2,
  "name": "son1kvers3-enhanced",
  "builds": [
    {
      "src": "frontend/build/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/build/$1"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://son1kvers3-backend.railway.app",
    "REACT_APP_VERSION": "2.0",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
EOF

# Crear archivo de configuración para Railway con dominio personalizado
echo "🔧 Configurando Railway para backend..."
cat > railway-production.json << 'EOF'
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
    "CORS_ORIGINS": "https://son1kvers3.com,https://www.son1kvers3.com,https://son1kvers3-enhanced.vercel.app",
    "ALLOWED_HOSTS": "son1kvers3.com,www.son1kvers3.com,son1kvers3-enhanced.vercel.app",
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

# Crear archivo de configuración para Heroku con dominio personalizado
echo "🔧 Configurando Heroku para backend..."
cat > heroku-production.json << 'EOF'
{
  "name": "son1kvers3-enhanced-backend",
  "description": "Son1kVers3 Enhanced v2.0 Backend API",
  "keywords": ["music", "ai", "voice-cloning", "daw", "analytics"],
  "website": "https://son1kvers3.com",
  "repository": "https://github.com/nov4-ix/son1kvers3-enhanced",
  "success_url": "/health",
  "env": {
    "NODE_ENV": "production",
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
    "CORS_ORIGINS": "https://son1kvers3.com,https://www.son1kvers3.com,https://son1kvers3-enhanced.vercel.app",
    "ALLOWED_HOSTS": "son1kvers3.com,www.son1kvers3.com,son1kvers3-enhanced.vercel.app",
    "UPLOAD_DIR": "./uploads/",
    "OUTPUT_DIR": "./output/",
    "LOGS_DIR": "./logs/",
    "HOST": "0.0.0.0",
    "PORT": "8000",
    "DEBUG": "false",
    "HEALTH_CHECK_ENABLED": "true",
    "METRICS_ENABLED": "true"
  },
  "formation": {
    "web": {
      "quantity": 1,
      "size": "basic"
    }
  },
  "buildpacks": [
    {
      "url": "heroku/python"
    }
  ]
}
EOF

# Crear archivo de configuración para Render con dominio personalizado
echo "🔧 Configurando Render para backend..."
cat > render-production.yaml << 'EOF'
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
        value: https://son1kvers3.com,https://www.son1kvers3.com,https://son1kvers3-enhanced.vercel.app
      - key: ALLOWED_HOSTS
        value: son1kvers3.com,www.son1kvers3.com,son1kvers3-enhanced.vercel.app
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

echo "✅ Archivos de configuración creados:"
echo "  📦 frontend/build/ - Build de producción"
echo "  ⚙️ vercel-production.json - Configuración Vercel"
echo "  🔧 railway-production.json - Configuración Railway"
echo "  🔧 heroku-production.json - Configuración Heroku"
echo "  🔧 render-production.yaml - Configuración Render"
echo ""
echo "🌐 INSTRUCCIONES DE INTEGRACIÓN:"
echo ""
echo "1. 🎯 FRONTEND (Vercel):"
echo "   - Ve a https://vercel.com"
echo "   - Crea nuevo proyecto"
echo "   - Sube la carpeta frontend/build/"
echo "   - Configura dominio: son1kvers3.com"
echo "   - Usa vercel-production.json"
echo ""
echo "2. 🔧 BACKEND (Railway/Heroku/Render):"
echo "   - Elige una plataforma"
echo "   - Sube el archivo ZIP del backend"
echo "   - Configura las variables de entorno"
echo "   - Obtén la URL del backend"
echo ""
echo "3. 🔗 CONEXIÓN:"
echo "   - Actualiza REACT_APP_API_URL en Vercel"
echo "   - Configura CORS en el backend"
echo "   - Prueba la integración"
echo ""
echo "4. 🌐 DOMINIO:"
echo "   - Configura DNS para son1kvers3.com"
echo "   - Apunta a Vercel (frontend)"
echo "   - Configura subdominio para API"
echo ""
echo "✅ ¡Sistema listo para integración a son1kvers3.com!"


