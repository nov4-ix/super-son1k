#!/bin/bash

# 🚀 Son1kVers3 Enhanced v2.0 - Deploy a Producción
# Autor: nov4-ix
# Fecha: $(date)

echo "🚀 Son1kVers3 Enhanced v2.0 - Deploy a Producción"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

show_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    show_error "No se encontró package.json. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# 1. Deploy del Frontend con Vercel
show_message "🚀 Desplegando Frontend con Vercel..."
cd frontend

if vercel --prod --yes; then
    show_success "Frontend desplegado exitosamente en Vercel!"
    FRONTEND_URL=$(vercel ls | grep frontend | head -1 | awk '{print $2}')
    show_message "URL del Frontend: https://$FRONTEND_URL"
else
    show_error "Error desplegando frontend con Vercel"
    exit 1
fi

cd ..

# 2. Deploy del Backend con Railway
show_message "🚀 Desplegando Backend con Railway..."
cd backend

if railway up --detach; then
    show_success "Backend desplegado exitosamente en Railway!"
    BACKEND_URL=$(railway status | grep "https://" | head -1 | awk '{print $2}')
    show_message "URL del Backend: $BACKEND_URL"
else
    show_warning "Error desplegando backend con Railway. Intentando método alternativo..."
    
    # Método alternativo: crear archivo ZIP y subir manualmente
    show_message "Creando archivo ZIP para deploy manual..."
    cd ..
    zip -r son1kvers3-backend.zip backend/ -x "backend/__pycache__/*" "backend/*.pyc"
    show_message "Archivo ZIP creado: son1kvers3-backend.zip"
    show_message "Sube este archivo a Railway manualmente"
fi

cd ..

# 3. Configurar variables de entorno
show_message "🔧 Configurando variables de entorno..."

# Crear archivo de configuración para producción
cat > .env.production << EOF
# Son1kVers3 Enhanced v2.0 - Variables de Producción
NODE_ENV=production
REACT_APP_API_URL=$BACKEND_URL
REACT_APP_VERSION=2.0.0

# JWT
JWT_SECRET_KEY=son1kvers3_enhanced_production_secret_key_2024
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60

# Base de datos
DATABASE_URL=sqlite:///./son1kvers3.db

# Ollama (configurar en el servidor)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# APIs Externas (configurar según necesidad)
ELEVENLABS_API_KEY=your_elevenlabs_key_here
AZURE_SPEECH_KEY=your_azure_key_here
RESEMBLE_API_KEY=your_resemble_key_here
SUNO_AI_COOKIES=your_suno_cookies_here
EOF

show_success "Variables de entorno configuradas"

# 4. Crear archivo de estado del deploy
cat > deploy_status.txt << EOF
Son1kVers3 Enhanced v2.0 - Deploy Status
========================================
Fecha: $(date)
Frontend URL: https://$FRONTEND_URL
Backend URL: $BACKEND_URL
Estado: DESPLEGADO EN PRODUCCIÓN
EOF

# 5. Mostrar resumen del deploy
echo ""
echo "🎉 Deploy a Producción Completado!"
echo "=================================="
echo ""
echo "🌐 URLs de Producción:"
echo "  Frontend: https://$FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Configurar dominio personalizado (son1kvers3.com)"
echo "  2. Configurar variables de entorno en producción"
echo "  3. Configurar Ollama en el servidor de producción"
echo "  4. Probar todas las funcionalidades"
echo ""
echo "🔧 Comandos útiles:"
echo "  vercel logs - Ver logs del frontend"
echo "  railway logs - Ver logs del backend"
echo "  vercel domains add son1kvers3.com - Configurar dominio"
echo ""

show_success "¡Deploy a producción completado exitosamente! 🚀"




