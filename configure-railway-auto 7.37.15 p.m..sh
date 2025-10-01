#!/bin/bash

# 🚀 Configuración Automática de Railway
echo "🚀 Configurando Railway automáticamente..."

# Configurar token
export RAILWAY_TOKEN="fd0c91b4-a5ee-413a-b919-621ce98ca9bd"

# Crear archivo de configuración Railway
cat > railway.toml << 'EOF'
[build]
builder = "nixpacks"
buildCommand = "pip install -r backend/requirements-simple.txt"

[deploy]
startCommand = "cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 3

[env]
NODE_ENV = "production"
PYTHON_VERSION = "3.12"
PYTHONPATH = "/app/backend"
HOST = "0.0.0.0"
PORT = "8000"
JWT_SECRET_KEY = "son1kvers3_enhanced_production_secret_key_2024_railway_secure"
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = "60"
DATABASE_URL = "sqlite:///./son1kvers3.db"
CORS_ORIGINS = "https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com,https://son1kvers3-enhanced-9763d5l68-son1kvers3s-projects-c805d053.vercel.app,http://localhost:3000,http://127.0.0.1:3000"
ALLOWED_HOSTS = "son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com,son1kvers3-enhanced-9763d5l68-son1kvers3s-projects-c805d053.vercel.app,localhost,127.0.0.1"
UPLOAD_DIR = "./uploads/"
OUTPUT_DIR = "./output/"
LOGS_DIR = "./logs/"
DEBUG = "false"
HEALTH_CHECK_ENABLED = "true"
METRICS_ENABLED = "true"
RAILWAY_ENVIRONMENT = "production"
EOF

# Crear archivo de configuración JSON
cat > railway.json << 'EOF'
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

# Crear ZIP con configuración completa
echo "📦 Creando ZIP con configuración completa..."
zip -r son1kvers3-backend-railway-COMPLETE.zip backend/ railway.toml railway.json

# Copiar a Downloads
cp son1kvers3-backend-railway-COMPLETE.zip ~/Downloads/

echo "✅ Configuración Railway completada:"
echo "  📦 son1kvers3-backend-railway-COMPLETE.zip - Backend completo"
echo "  ⚙️ railway.toml - Configuración TOML"
echo "  ⚙️ railway.json - Configuración JSON"
echo ""
echo "🔧 VARIABLES CONFIGURADAS:"
echo "  HOST=0.0.0.0"
echo "  PORT=8000"
echo "  PYTHONPATH=/app/backend"
echo "  PYTHON_VERSION=3.12"
echo "  CORS_ORIGINS=configurado"
echo "  ALLOWED_HOSTS=configurado"
echo ""
echo "🚀 COMANDO DE INICIO:"
echo "  cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "📋 INSTRUCCIONES:"
echo "1. Ve a https://railway.app"
echo "2. Crea nuevo proyecto"
echo "3. Sube son1kvers3-backend-railway-COMPLETE.zip"
echo "4. Deploy automático"
echo ""
echo "✅ ¡Railway configurado y listo para deploy!"
