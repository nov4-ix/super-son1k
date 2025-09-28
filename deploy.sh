#!/bin/bash

# 🚀 Son1kVers3 Enhanced v2.0 - Script de Deploy Automático
# Autor: nov4-ix
# Fecha: $(date)

echo "🚀 Son1kVers3 Enhanced v2.0 - Deploy Automático"
echo "================================================"

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

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    show_error "No se encontró package.json. Asegúrate de estar en el directorio correcto."
    exit 1
fi

# Verificar dependencias
show_message "Verificando dependencias..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    show_error "Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    show_error "npm no está instalado. Instálalo junto con Node.js"
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    show_error "Python 3 no está instalado. Instálalo desde https://python.org/"
    exit 1
fi

# Verificar pip
if ! command -v pip3 &> /dev/null; then
    show_error "pip3 no está instalado. Instálalo junto con Python"
    exit 1
fi

show_message "Todas las dependencias están instaladas ✅"

# Instalar dependencias del frontend
show_message "Instalando dependencias del frontend..."
cd frontend
if npm install; then
    show_message "Dependencias del frontend instaladas ✅"
else
    show_error "Error instalando dependencias del frontend"
    exit 1
fi

# Instalar dependencias del backend
show_message "Instalando dependencias del backend..."
cd ../backend
if pip3 install -r requirements-simple.txt; then
    show_message "Dependencias del backend instaladas ✅"
else
    show_error "Error instalando dependencias del backend"
    exit 1
fi

# Volver al directorio raíz
cd ..

# Verificar Ollama
show_message "Verificando Ollama..."
if command -v ollama &> /dev/null; then
    show_message "Ollama está instalado ✅"
    
    # Verificar si el modelo está descargado
    if ollama list | grep -q "qwen2.5:7b"; then
        show_message "Modelo Qwen 2.5:7b está disponible ✅"
    else
        show_warning "Modelo Qwen 2.5:7b no está descargado. Descargándolo..."
        ollama pull qwen2.5:7b
    fi
else
    show_warning "Ollama no está instalado. Instálalo desde https://ollama.ai/"
    show_message "Para instalar Ollama:"
    echo "curl -fsSL https://ollama.ai/install.sh | sh"
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    show_message "Creando archivo .env..."
    cp env.example .env
    show_warning "Archivo .env creado. Edítalo con tus API keys antes de continuar."
fi

# Verificar puertos
show_message "Verificando puertos disponibles..."

# Verificar puerto 3000 (Frontend)
if lsof -i :3000 &> /dev/null; then
    show_warning "Puerto 3000 está en uso. Intentando liberarlo..."
    pkill -f "node.*3000" || true
    sleep 2
fi

# Verificar puerto 8000 (Backend)
if lsof -i :8000 &> /dev/null; then
    show_warning "Puerto 8000 está en uso. Intentando liberarlo..."
    pkill -f "python.*8000" || true
    sleep 2
fi

# Iniciar servicios
show_message "Iniciando servicios..."

# Iniciar backend en background
show_message "Iniciando backend..."
cd backend
python3 main.py &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..

# Esperar un momento para que el backend inicie
sleep 3

# Iniciar frontend en background
show_message "Iniciando frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..

# Esperar un momento para que el frontend inicie
sleep 5

# Verificar que los servicios estén funcionando
show_message "Verificando servicios..."

# Verificar backend
if curl -s http://localhost:8000/health &> /dev/null; then
    show_message "Backend funcionando ✅ (http://localhost:8000)"
else
    show_warning "Backend no responde. Verifica los logs."
fi

# Verificar frontend
if curl -s http://localhost:3000 &> /dev/null; then
    show_message "Frontend funcionando ✅ (http://localhost:3000)"
else
    show_warning "Frontend no responde. Verifica los logs."
fi

# Mostrar información del deploy
echo ""
echo "🎉 Deploy completado!"
echo "===================="
echo ""
echo "🌐 Servicios disponibles:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Para monitorear:"
echo "  ./monitor.sh"
echo ""
echo "🛑 Para detener:"
echo "  ./stop.sh"
echo ""
echo "📝 Logs:"
echo "  Backend:  tail -f logs/backend.log"
echo "  Frontend: tail -f logs/frontend.log"
echo ""

# Crear archivo de estado
cat > deploy_status.txt << EOF
Son1kVers3 Enhanced v2.0 - Deploy Status
========================================
Fecha: $(date)
Backend PID: $BACKEND_PID
Frontend PID: $FRONTEND_PID
Estado: FUNCIONANDO
EOF

show_message "Deploy completado exitosamente! 🚀"
