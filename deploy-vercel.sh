#!/bin/bash

# 🚀 Son1kVers3 Deploy Script para Vercel
# Ejecutar: chmod +x deploy-vercel.sh && ./deploy-vercel.sh

echo "🎵 Iniciando deploy de Son1kVers3 en Vercel..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
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

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI no está instalado. Instálalo con: npm i -g vercel"
    exit 1
fi

print_status "Verificando configuración..."

# Verificar archivos de configuración
if [ ! -f "vercel.json" ]; then
    print_warning "No se encontró vercel.json en la raíz. Usando configuración por defecto."
fi

if [ ! -f "frontend/vercel.json" ]; then
    print_warning "No se encontró frontend/vercel.json. Usando configuración por defecto."
fi

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    print_error "Error instalando dependencias del frontend"
    exit 1
fi

# Build del frontend
print_status "Construyendo frontend..."
npm run build:vercel
if [ $? -ne 0 ]; then
    print_error "Error construyendo frontend"
    exit 1
fi

cd ..

# Instalar dependencias del backend
print_status "Instalando dependencias del backend..."
cd backend
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    print_error "Error instalando dependencias del backend"
    exit 1
fi

cd ..

# Verificar variables de entorno
print_status "Verificando variables de entorno..."
if [ ! -f ".env.local" ]; then
    print_warning "No se encontró .env.local. Copiando desde .env.example..."
    cp .env.example .env.local
    print_warning "IMPORTANTE: Configura las variables en .env.local antes de hacer deploy"
fi

# Deploy a Vercel
print_status "Haciendo deploy a Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Deploy completado exitosamente!"
    print_status "Tu aplicación está disponible en: https://son1kvers3.vercel.app"
else
    print_error "Error en el deploy"
    exit 1
fi

print_success "🎉 Son1kVers3 desplegado exitosamente en Vercel!"
print_status "Próximos pasos:"
print_status "1. Configura las variables de entorno en el dashboard de Vercel"
print_status "2. Verifica que todos los servicios estén funcionando"
print_status "3. Configura el dominio personalizado si es necesario"