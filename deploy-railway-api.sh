#!/bin/bash

# 🚀 Deploy a Railway usando API
echo "🚀 Desplegando a Railway usando API..."

# Configurar token
RAILWAY_TOKEN="fd0c91b4-a5ee-413a-b919-621ce98ca9bd"

# Crear proyecto
echo "📦 Creando proyecto en Railway..."
PROJECT_RESPONSE=$(curl -X POST \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "son1kvers3-backend"}' \
  https://backboard.railway.app/graphql/v1)

echo "Proyecto creado: $PROJECT_RESPONSE"

# Subir archivo
echo "📤 Subiendo archivo a Railway..."
curl -X POST \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -F "file=@son1kvers3-backend-railway-FIXED.zip" \
  https://backboard.railway.app/graphql/v1

echo "✅ Deploy completado"
