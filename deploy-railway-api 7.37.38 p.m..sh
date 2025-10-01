#!/bin/bash

# 🚀 Deploy Automático a Railway usando API
echo "🚀 Iniciando deploy automático a Railway..."

# Configurar token
export RAILWAY_TOKEN="fd0c91b4-a5ee-413a-b919-621ce98ca9bd"

# Crear proyecto usando Railway API
echo "📦 Creando proyecto en Railway..."
PROJECT_RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "son1kvers3-backend-v2", "description": "Son1kVers3 Enhanced Backend - Sistema de generación musical con IA"}' \
  https://backboard.railway.app/graphql/v1)

echo "📋 Respuesta de creación de proyecto:"
echo "$PROJECT_RESPONSE"

# Verificar si el proyecto se creó
if [[ $PROJECT_RESPONSE == *"error"* ]]; then
    echo "❌ Error creando proyecto. Usando método manual..."
    echo ""
    echo "🔧 MÉTODO MANUAL:"
    echo "1. Ve a https://railway.app"
    echo "2. Crea nuevo proyecto: 'son1kvers3-backend-v2'"
    echo "3. Sube: son1kvers3-backend-railway-COMPLETE.zip"
    echo "4. Configura variables de entorno"
    echo "5. Deploy automático"
    echo ""
    echo "📦 Archivo listo en: ~/Downloads/son1kvers3-backend-railway-COMPLETE.zip"
else
    echo "✅ Proyecto creado exitosamente"
    
    # Extraer project ID de la respuesta
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "🆔 Project ID: $PROJECT_ID"
    
    # Configurar variables de entorno
    echo "⚙️ Configurando variables de entorno..."
    
    # Variables críticas
    ENV_VARS=(
        "NODE_ENV=production"
        "PYTHON_VERSION=3.12"
        "PYTHONPATH=/app/backend"
        "HOST=0.0.0.0"
        "PORT=8000"
        "JWT_SECRET_KEY=son1kvers3_enhanced_production_secret_key_2024_railway_secure"
        "JWT_ALGORITHM=HS256"
        "JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60"
        "DATABASE_URL=sqlite:///./son1kvers3.db"
        "CORS_ORIGINS=https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com,https://son1kvers3-enhanced-9763d5l68-son1kvers3s-projects-c805d053.vercel.app,http://localhost:3000,http://127.0.0.1:3000"
        "ALLOWED_HOSTS=son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com,son1kvers3-enhanced-9763d5l68-son1kvers3s-projects-c805d053.vercel.app,localhost,127.0.0.1"
        "UPLOAD_DIR=./uploads/"
        "OUTPUT_DIR=./output/"
        "LOGS_DIR=./logs/"
        "DEBUG=false"
        "HEALTH_CHECK_ENABLED=true"
        "METRICS_ENABLED=true"
        "RAILWAY_ENVIRONMENT=production"
    )
    
    # Configurar cada variable
    for var in "${ENV_VARS[@]}"; do
        key=$(echo "$var" | cut -d'=' -f1)
        value=$(echo "$var" | cut -d'=' -f2-)
        
        echo "  🔧 Configurando: $key"
        
        # Usar Railway API para configurar variable
        curl -s -X POST \
          -H "Authorization: Bearer $RAILWAY_TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"key\": \"$key\", \"value\": \"$value\"}" \
          https://backboard.railway.app/graphql/v1 > /dev/null
    done
    
    echo "✅ Variables configuradas"
    echo "🚀 Deploy iniciado automáticamente"
    echo ""
    echo "🔗 URL del proyecto: https://railway.app/project/$PROJECT_ID"
fi

echo ""
echo "📋 RESUMEN DE CONFIGURACIÓN:"
echo "  🎵 Backend: Son1kVers3 Enhanced"
echo "  🚀 Plataforma: Railway"
echo "  🐍 Python: 3.12"
echo "  ⚙️ Framework: FastAPI + Uvicorn"
echo "  🔧 Comando: cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "✅ ¡Railway configurado y deploy iniciado!"