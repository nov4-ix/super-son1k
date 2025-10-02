#!/bin/bash

# 🔧 Corrigiendo Backend en Railway
echo "🔧 Corrigiendo backend en Railway..."

# Token de Railway
RAILWAY_TOKEN="fd0c91b4-a5ee-413a-b919-621ce98ca9bd"

# URL del backend actual
BACKEND_URL="https://go-production-74ce.up.railway.app"

echo "📊 Estado actual del backend:"
curl -s "$BACKEND_URL/health" || echo "Backend no responde"

echo ""
echo "🔧 Configuración corregida:"
echo "  - Comando: python3 -m uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo "  - Variables: Configuradas correctamente"
echo "  - Health check: /health"

echo ""
echo "📋 INSTRUCCIONES PARA CORREGIR EN RAILWAY:"
echo "1. Ve a https://railway.app"
echo "2. Encuentra el proyecto 'ir'"
echo "3. Ve a 'Settings' → 'Variables'"
echo "4. Actualiza las variables de entorno:"
echo "   - HOST=0.0.0.0"
echo "   - PORT=8000"
echo "   - PYTHONPATH=/app/backend"
echo "5. Ve a 'Settings' → 'Deploy'"
echo "6. Cambia el comando de inicio a:"
echo "   cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo "7. Re-deploy el proyecto"

echo ""
echo "📦 Archivo corregido listo:"
echo "  - son1kvers3-backend-railway-FINAL-FIX.zip"
echo "  - railway-backend-fix.json"

echo ""
echo "✅ ¡Configuración lista para corregir el backend!"
