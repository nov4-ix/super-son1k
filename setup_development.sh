#!/bin/bash
# 🎵 Son1kVers3 Enhanced - Setup Development Environment
# Script para configurar el entorno de desarrollo

echo "🚀 Configurando Son1kVers3 Enhanced para desarrollo..."

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "✅ Archivo .env creado desde env.example"
else
    echo "✅ Archivo .env ya existe"
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p backend/uploads
mkdir -p backend/output
mkdir -p backend/logs
mkdir -p backend/models/sovits
mkdir -p backend/models/bark
mkdir -p frontend/build

echo "✅ Directorios creados"

# Instalar dependencias del backend
echo "🐍 Instalando dependencias de Python..."
cd backend
if [ -f requirements.txt ]; then
    pip install -r requirements.txt
    echo "✅ Dependencias de Python instaladas"
else
    echo "⚠️ requirements.txt no encontrado"
fi

# Instalar dependencias simplificadas
if [ -f requirements-simple.txt ]; then
    pip install -r requirements-simple.txt
    echo "✅ Dependencias simplificadas instaladas"
fi

cd ..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias de Node.js..."
cd frontend
if [ -f package.json ]; then
    npm install
    echo "✅ Dependencias de Node.js instaladas"
else
    echo "⚠️ package.json no encontrado"
fi

cd ..

# Verificar instalación
echo "🔍 Verificando instalación..."

# Verificar Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 disponible: $(python3 --version)"
else
    echo "❌ Python3 no encontrado"
fi

# Verificar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js disponible: $(node --version)"
else
    echo "❌ Node.js no encontrado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    echo "✅ npm disponible: $(npm --version)"
else
    echo "❌ npm no encontrado"
fi

echo ""
echo "🎵 Son1kVers3 Enhanced configurado para desarrollo!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar variables en .env si es necesario"
echo "2. Iniciar backend: cd backend && python main.py"
echo "3. Iniciar frontend: cd frontend && npm start"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   Docs:     http://localhost:8000/docs"
echo ""
echo "🎉 ¡Listo para generar música!"
