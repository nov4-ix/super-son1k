#!/bin/bash

# 🚀 Configuración Manual de Railway - Guía Completa
echo "🚀 CONFIGURACIÓN MANUAL DE RAILWAY"
echo "=================================="
echo ""

# Crear archivo de configuración optimizado
cat > railway-config-optimized.json << 'EOF'
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

# Crear archivo de configuración TOML
cat > railway-config-optimized.toml << 'EOF'
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

# Crear ZIP final optimizado
echo "📦 Creando ZIP final optimizado..."
zip -r son1kvers3-backend-railway-FINAL.zip backend/ railway-config-optimized.json railway-config-optimized.toml

# Copiar a Downloads
cp son1kvers3-backend-railway-FINAL.zip ~/Downloads/

echo ""
echo "🎯 CONFIGURACIÓN RAILWAY COMPLETADA"
echo "=================================="
echo ""
echo "📦 ARCHIVOS CREADOS:"
echo "  ✅ son1kvers3-backend-railway-FINAL.zip - Backend completo"
echo "  ✅ railway-config-optimized.json - Configuración JSON"
echo "  ✅ railway-config-optimized.toml - Configuración TOML"
echo ""
echo "🔧 VARIABLES CONFIGURADAS:"
echo "  🐍 PYTHON_VERSION=3.12"
echo "  🌐 HOST=0.0.0.0"
echo "  🔌 PORT=8000"
echo "  🔑 JWT_SECRET_KEY=configurado"
echo "  🌍 CORS_ORIGINS=configurado"
echo "  🛡️ ALLOWED_HOSTS=configurado"
echo ""
echo "🚀 COMANDO DE INICIO:"
echo "  cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "📋 INSTRUCCIONES MANUALES:"
echo "1. 🌐 Ve a https://railway.app"
echo "2. ➕ Crea nuevo proyecto: 'son1kvers3-backend-v2'"
echo "3. 📤 Sube: son1kvers3-backend-railway-FINAL.zip"
echo "4. ⚙️ Configura variables de entorno (ya incluidas)"
echo "5. 🚀 Deploy automático"
echo ""
echo "🔗 URLS DE ACCESO:"
echo "  🌐 Railway: https://railway.app"
echo "  📦 Archivo: ~/Downloads/son1kvers3-backend-railway-FINAL.zip"
echo ""
echo "✅ ¡Railway configurado y listo para deploy manual!"
