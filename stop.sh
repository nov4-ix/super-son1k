#!/bin/bash

# 🎵 Son1kVers3 Enhanced - Script de Parada
# Script para detener todos los servicios del sistema

echo "🛑 Deteniendo Son1kVers3 Enhanced v2.0..."
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

# Función para detener servicio
stop_service() {
    local service_name=$1
    local pid_file="${service_name}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            print_status "Deteniendo $service_name (PID: $pid)..."
            kill $pid
            sleep 2
            
            # Verificar si el proceso aún está corriendo
            if ps -p $pid > /dev/null 2>&1; then
                print_warning "Forzando cierre de $service_name..."
                kill -9 $pid
            fi
            
            print_success "$service_name detenido correctamente"
        else
            print_warning "$service_name no estaba corriendo"
        fi
        rm -f "$pid_file"
    else
        print_warning "No se encontró archivo PID para $service_name"
    fi
}

# Detener servicios
stop_service "frontend"
stop_service "backend"

# Detener procesos por puerto (por si acaso)
print_status "Verificando procesos en puertos 3000 y 8000..."

# Detener procesos en puerto 3000 (frontend)
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Detener procesos en puerto 8000 (backend)
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

print_success "================================================"
print_success "🛑 Son1kVers3 Enhanced v2.0 detenido correctamente!"
print_success "================================================"


