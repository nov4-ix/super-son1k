#!/bin/bash

# 🌐 Son1kVers3 Enhanced v2.0 - Integración con Dominio Existente
echo "🌐 Integrando con son1kvers3.com existente..."

# Crear archivo de configuración para reemplazar el sitio actual
echo "⚙️ Creando configuración para reemplazo del sitio actual..."
cat > vercel-replace.json << 'EOF'
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
  },
  "alias": ["son1kvers3.com", "www.son1kvers3.com"]
}
EOF

# Crear archivo de configuración para subdominio
echo "🔧 Creando configuración para subdominio..."
cat > vercel-subdomain.json << 'EOF'
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
    "REACT_APP_API_URL": "https://api.son1kvers3.com",
    "REACT_APP_VERSION": "2.0",
    "REACT_APP_ENVIRONMENT": "production"
  },
  "alias": ["enhanced.son1kvers3.com", "v2.son1kvers3.com"]
}
EOF

# Crear archivo de configuración para API subdomain
echo "🔧 Creando configuración para API subdomain..."
cat > railway-api.json << 'EOF'
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
    "ALLOWED_HOSTS": "son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,api.son1kvers3.com",
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

echo "✅ Archivos de configuración creados:"
echo "  ⚙️ vercel-replace.json - Reemplazar sitio actual"
echo "  ⚙️ vercel-subdomain.json - Subdominio enhanced/v2"
echo "  🔧 railway-api.json - API subdomain"
echo ""
echo "🌐 OPCIONES DE INTEGRACIÓN:"
echo ""
echo "OPCIÓN 1: 🎯 REEMPLAZAR SITIO ACTUAL"
echo "  - Ve a https://vercel.com"
echo "  - Encuentra el proyecto actual de son1kvers3.com"
echo "  - Reemplaza el contenido con frontend/build/"
echo "  - Usa vercel-replace.json"
echo ""
echo "OPCIÓN 2: 🔗 SUBDOMINIO ENHANCED"
echo "  - Ve a https://vercel.com"
echo "  - Crea nuevo proyecto"
echo "  - Sube frontend/build/"
echo "  - Configura dominio: enhanced.son1kvers3.com"
echo "  - Usa vercel-subdomain.json"
echo ""
echo "OPCIÓN 3: 🔗 SUBDOMINIO V2"
echo "  - Ve a https://vercel.com"
echo "  - Crea nuevo proyecto"
echo "  - Sube frontend/build/"
echo "  - Configura dominio: v2.son1kvers3.com"
echo "  - Usa vercel-subdomain.json"
echo ""
echo "OPCIÓN 4: 🔧 API SUBDOMAIN"
echo "  - Ve a https://railway.app"
echo "  - Crea nuevo proyecto"
echo "  - Sube backend ZIP"
echo "  - Configura dominio: api.son1kvers3.com"
echo "  - Usa railway-api.json"
echo ""
echo "🎯 RECOMENDACIÓN:"
echo "  - Usar OPCIÓN 2 (enhanced.son1kvers3.com)"
echo "  - Mantener sitio actual intacto"
echo "  - Crear API en api.son1kvers3.com"
echo "  - Integrar gradualmente"
echo ""
echo "✅ ¡Sistema listo para integración con dominio existente!"


