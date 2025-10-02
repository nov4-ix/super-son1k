#!/bin/bash

# 🚀 Son1kVers3 Enhanced v2.0 - Deploy Inmediato a Render
echo "🚀 Desplegando Son1kVers3 Enhanced v2.0 a Render..."

# Crear archivo ZIP para Render
echo "📦 Creando archivo ZIP para Render..."
cd backend
zip -r ../son1kvers3-render-deploy.zip . -x "*.pyc" "__pycache__/*" "*.log" "*.pid"
cd ..

# Crear archivo de configuración para Render
echo "⚙️ Creando configuración para Render..."
cat > render.yaml << 'EOF'
services:
  - type: web
    name: son1kvers3-backend
    env: python
    buildCommand: pip install -r requirements-simple.txt
    startCommand: python3 main.py
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
        value: http://localhost:3000,https://son1kvers3-enhanced.vercel.app,https://son1kvers3.com
      - key: ALLOWED_HOSTS
        value: localhost,127.0.0.1,son1kvers3-enhanced.vercel.app,son1kvers3.com
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

echo "✅ Archivos creados:"
echo "  📦 son1kvers3-render-deploy.zip"
echo "  ⚙️ render.yaml"
echo ""
echo "🌐 INSTRUCCIONES DE DEPLOY A RENDER:"
echo "1. Ve a https://render.com"
echo "2. Crea nuevo Web Service"
echo "3. Sube el archivo son1kvers3-render-deploy.zip"
echo "4. Usa el archivo render.yaml para configuración"
echo "5. Deploy automático"
echo ""
echo "🔗 URLs después del deploy:"
echo "  🌐 Frontend: https://son1kvers3-enhanced.vercel.app"
echo "  🔧 Backend: https://son1kvers3-backend.onrender.com"
echo "  📚 API Docs: https://son1kvers3-backend.onrender.com/docs"
echo ""
echo "✅ ¡Backend listo para deploy en Render!"


