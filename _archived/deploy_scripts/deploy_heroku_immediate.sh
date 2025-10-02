#!/bin/bash

# 🚀 Son1kVers3 Enhanced v2.0 - Deploy Inmediato a Heroku
echo "🚀 Desplegando Son1kVers3 Enhanced v2.0 a Heroku..."

# Crear archivo ZIP para Heroku
echo "📦 Creando archivo ZIP para Heroku..."
cd backend
zip -r ../son1kvers3-heroku-deploy.zip . -x "*.pyc" "__pycache__/*" "*.log" "*.pid"
cd ..

# Crear Procfile para Heroku
echo "⚙️ Creando Procfile para Heroku..."
cat > backend/Procfile << 'EOF'
web: python3 main.py
EOF

# Crear runtime.txt
echo "🔧 Creando runtime.txt..."
cat > backend/runtime.txt << 'EOF'
python-3.12.0
EOF

# Crear archivo de variables de entorno para Heroku
echo "🔧 Creando variables de entorno para Heroku..."
cat > .env.heroku << 'EOF'
NODE_ENV=production
JWT_SECRET_KEY=son1kvers3_enhanced_production_secret_key_2024
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./son1kvers3.db
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
SOVITS_MODEL_PATH=./models/sovits/
BARK_MODEL_PATH=./models/bark/
VOICE_CLONING_ENABLED=true
NOVA_POST_ENABLED=true
SOCIAL_MEDIA_ANALYSIS=true
GHOST_STUDIO_ENABLED=true
AUDIO_ANALYSIS_ENABLED=true
ANALYTICS_ENABLED=true
METRICS_COLLECTION=true
DAW_EDITOR_ENABLED=true
AUDIO_EXPORT_ENABLED=true
CORS_ORIGINS=http://localhost:3000,https://son1kvers3-enhanced.vercel.app,https://son1kvers3.com
ALLOWED_HOSTS=localhost,127.0.0.1,son1kvers3-enhanced.vercel.app,son1kvers3.com
UPLOAD_DIR=./uploads/
OUTPUT_DIR=./output/
LOGS_DIR=./logs/
HOST=0.0.0.0
PORT=8000
DEBUG=false
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true
EOF

echo "✅ Archivos creados:"
echo "  📦 son1kvers3-heroku-deploy.zip"
echo "  ⚙️ backend/Procfile"
echo "  🔧 backend/runtime.txt"
echo "  🔧 .env.heroku"
echo ""
echo "🌐 INSTRUCCIONES DE DEPLOY A HEROKU:"
echo "1. Ve a https://heroku.com"
echo "2. Crea nueva app: son1kvers3-enhanced-backend"
echo "3. Sube el archivo son1kvers3-heroku-deploy.zip"
echo "4. Configura las variables de entorno desde .env.heroku"
echo "5. Deploy automático"
echo ""
echo "🔗 URLs después del deploy:"
echo "  🌐 Frontend: https://son1kvers3-enhanced.vercel.app"
echo "  🔧 Backend: https://son1kvers3-enhanced-backend.herokuapp.com"
echo "  📚 API Docs: https://son1kvers3-enhanced-backend.herokuapp.com/docs"
echo ""
echo "✅ ¡Backend listo para deploy en Heroku!"


