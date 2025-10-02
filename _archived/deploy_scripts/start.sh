#!/bin/bash

# 🎵 Son1kVers3 Enhanced - Script de Inicio
# Script para iniciar todos los servicios del sistema

echo "🚀 Iniciando Son1kVers3 Enhanced v2.0..."
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "README.md" ]; then
    print_error "No se encontró README.md. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 16+ primero."
    exit 1
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado. Por favor instala Python 3.8+ primero."
    exit 1
fi

print_status "Verificando dependencias..."

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencias del frontend instaladas correctamente"
    else
        print_error "Error instalando dependencias del frontend"
        exit 1
    fi
else
    print_success "Dependencias del frontend ya están instaladas"
fi

# Instalar dependencias del backend
print_status "Instalando dependencias del backend..."
cd ../backend
if [ ! -f "requirements-simple.txt" ]; then
    print_error "No se encontró requirements-simple.txt"
    exit 1
fi

python3 -m pip install -r requirements-simple.txt
if [ $? -eq 0 ]; then
    print_success "Dependencias del backend instaladas correctamente"
else
    print_error "Error instalando dependencias del backend"
    exit 1
fi

# Volver al directorio raíz
cd ..

print_status "Iniciando servicios..."

# Función para iniciar servicios en background
start_service() {
    local service_name=$1
    local command=$2
    local port=$3
    
    print_status "Iniciando $service_name en puerto $port..."
    $command &
    local pid=$!
    echo $pid > "${service_name}.pid"
    print_success "$service_name iniciado con PID $pid"
}

# Iniciar backend
start_service "backend" "cd backend && python3 main.py" "8000"

# Esperar un momento para que el backend se inicie
sleep 3

# Iniciar frontend
start_service "frontend" "cd frontend && npm start" "3000"

print_success "================================================"
print_success "🎵 Son1kVers3 Enhanced v2.0 iniciado correctamente!"
print_success "================================================"
echo ""
print_status "Servicios disponibles:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔧 Backend API: http://localhost:8000"
echo "  📚 API Docs: http://localhost:8000/docs"
echo ""
print_status "Para detener los servicios, ejecuta: ./stop.sh"
echo ""
print_warning "Nota: Asegúrate de tener Ollama instalado y configurado para usar la IA local"
print_warning "Nota: Para clonación de voz, necesitarás configurar so-VITS y Bark"
echo ""

# Mostrar logs del backend
print_status "Mostrando logs del backend (Ctrl+C para salir)..."
wait


