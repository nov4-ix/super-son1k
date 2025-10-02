#!/bin/bash

# 📊 Monitoreo de Integración Son1kVers3 Enhanced v2.0
echo "📊 Monitoreando integración de Son1kVers3 Enhanced v2.0..."

# Verificar frontend
echo "🌐 Verificando frontend..."
curl -s -I https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app | head -1

# Verificar backend (cuando esté desplegado)
echo "🔧 Verificando backend..."
curl -s -I https://api.son1kvers3.com | head -1 || echo "Backend no desplegado aún"

# Verificar integración
echo "🔗 Verificando integración..."
curl -s https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app | grep -o "Son1kVers3 Enhanced" || echo "Frontend no responde correctamente"

echo "✅ Monitoreo completado"
