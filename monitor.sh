#!/bin/bash

# Script de monitoreo para Son1kVers3 Enhanced

echo "📊 Monitoreo de Son1kVers3 Enhanced"
echo "=================================="

# Verificar Ollama
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama: Funcionando"
else
    echo "❌ Ollama: No disponible"
fi

# Verificar Backend
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend: Funcionando"
else
    echo "❌ Backend: No disponible"
fi

# Verificar Frontend
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Funcionando"
else
    echo "❌ Frontend: No disponible"
fi

# Verificar Redis
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: Funcionando"
else
    echo "❌ Redis: No disponible"
fi

echo "=================================="
