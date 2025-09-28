#!/bin/bash

# 🚀 Son1kVers3 Enhanced v2.0 - Deploy Backend
echo "🚀 Desplegando Backend de Son1kVers3 Enhanced v2.0"

# Crear archivo ZIP del backend
echo "📦 Creando archivo ZIP del backend..."
zip -r son1kvers3-backend-complete.zip backend/ -x "backend/__pycache__/*" "backend/*.pyc"

echo "✅ Archivo ZIP creado: son1kvers3-backend-complete.zip"
echo ""
echo "🌐 OPCIONES DE DEPLOY:"
echo "1. Railway: Sube el archivo ZIP a railway.app"
echo "2. Heroku: Usa 'git push heroku main'"
echo "3. Render: Sube el archivo ZIP a render.com"
echo ""
echo "📋 INSTRUCCIONES RÁPIDAS:"
echo "1. Ve a https://railway.app"
echo "2. Crea nuevo proyecto"
echo "3. Sube el archivo son1kvers3-backend-complete.zip"
echo "4. Configura variables de entorno"
echo "5. Deploy automático"
echo ""
echo "🔧 Variables de entorno necesarias:"
echo "NODE_ENV=production"
echo "PYTHON_VERSION=3.12"
echo "JWT_SECRET_KEY=tu_secreto_aqui"
echo "DATABASE_URL=sqlite:///./son1kvers3.db"
echo ""
echo "✅ Backend listo para deploy!"
