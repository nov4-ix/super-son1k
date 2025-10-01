#!/bin/bash

# 🚀 Corrección Automática del Backend en Railway
echo "🚀 Iniciando corrección automática del backend en Railway..."

# Configurar variables de entorno críticas
echo "⚙️ Configurando variables de entorno críticas..."

# Crear archivo de configuración para Railway
cat > railway-config-fix.json << 'EOF'
{
  "build": {
    "builder": "nixpacks",
    "buildCommand": "pip install -r backend/requirements-simple.txt"
  },
  "deploy": {
    "startCommand": "cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  },
  "env": {
    "NODE_ENV": "production",
    "PYTHON_VERSION": "3.12",
    "PYTHONPATH": "/app/backend",
    "HOST": "0.0.0.0",
    "PORT": "8000",
    "JWT_SECRET_KEY": "son1kvers3_enhanced_production_secret_key_2024_railway_secure",
    "JWT_ALGORITHM": "HS256",
    "JWT_ACCESS_TOKEN_EXPIRE_MINUTES": "60",
    "DATABASE_URL": "sqlite:///./son1kvers3.db",
    "CORS_ORIGINS": "https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com,https://son1kvers3-enhanced-9763d5l68-son1kvers3s-projects-c805d053.vercel.app,http://localhost:3000,http://127.0.0.1:3000",
    "ALLOWED_HOSTS": "son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com,son1kvers3-enhanced-9763d5l68-son1kvers3s-projects-c805d053.vercel.app,localhost,127.0.0.1",
    "UPLOAD_DIR": "./uploads/",
    "OUTPUT_DIR": "./output/",
    "LOGS_DIR": "./logs/",
    "DEBUG": "false",
    "HEALTH_CHECK_ENABLED": "true",
    "METRICS_ENABLED": "true",
    "RAILWAY_ENVIRONMENT": "production"
  }
}
EOF

# Crear ZIP con configuración corregida
echo "📦 Creando ZIP con configuración corregida..."
zip -r son1kvers3-backend-railway-CORRECTED.zip backend/ railway-config-fix.json

# Copiar a Downloads
cp son1kvers3-backend-railway-CORRECTED.zip ~/Downloads/

echo "✅ Archivos de corrección creados:"
echo "  📦 son1kvers3-backend-railway-CORRECTED.zip - Backend corregido"
echo "  ⚙️ railway-config-fix.json - Configuración optimizada"
echo ""
echo "🔧 VARIABLES CRÍTICAS PARA RAILWAY:"
echo "  HOST=0.0.0.0"
echo "  PORT=8000"
echo "  PYTHONPATH=/app/backend"
echo "  PYTHON_VERSION=3.12"
echo ""
echo "🚀 COMANDO DE INICIO CORREGIDO:"
echo "  cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "📋 INSTRUCCIONES:"
echo "1. Ve a https://railway.app"
echo "2. Encuentra el proyecto 'ir'"
echo "3. Sube son1kvers3-backend-railway-CORRECTED.zip"
echo "4. Configura las variables de entorno"
echo "5. Deploy"
echo ""
echo "✅ ¡Backend listo para corrección!"
