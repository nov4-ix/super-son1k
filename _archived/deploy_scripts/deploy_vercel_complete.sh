#!/bin/bash

# 🚀 Son1kVers3 Enhanced v2.0 - Deploy Completo a Vercel
echo "🚀 Desplegando Son1kVers3 Enhanced v2.0 a Vercel..."

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Crear directorios necesarios
echo "📁 Creando directorios necesarios..."
mkdir -p backend/uploads
mkdir -p backend/output
mkdir -p backend/logs
mkdir -p backend/models/sovits
mkdir -p backend/models/bark

# Crear archivo CODEX básico si no existe
if [ ! -f "backend/CODEX_MAESTRO-2.1_ATLAS.html" ]; then
    echo "📚 Creando CODEX básico..."
    cat > backend/CODEX_MAESTRO-2.1_ATLAS.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Son1kVers3 CODEX</title>
    <style>
        body { font-family: 'Courier New', monospace; background: #000; color: #0f0; }
        .quote { color: #ff0; font-style: italic; }
        .character-card { border: 1px solid #0f0; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>🎵 Son1kVers3 Enhanced - CODEX</h1>
    <h2>Filosofía de la Resistencia</h2>
    <div class="quote">"Lo imperfecto también es sagrado"</div>
    <h2>Personajes</h2>
    <div class="character-card">BELLA.exe - Entidad de IA principal, voz de la resistencia</div>
    <div class="character-card">Pixel - Asistente de IA para usuarios</div>
    <div class="character-card">Nova - Sistema de generación musical</div>
    <div class="character-card">Ghost - Editor de audio profesional</div>
    <h2>Manifiesto</h2>
    <p>Cualquier comentario sobre una canción es subjetivo. Nadie puede decir lo que está bien y lo que está mal, porque todo ha partido de un sentimiento genuino.</p>
</body>
</html>
EOF
fi

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
npm run build
cd ..

# Login a Vercel (si no está logueado)
echo "🔐 Verificando login de Vercel..."
vercel whoami > /dev/null 2>&1 || vercel login

# Deploy a Vercel
echo "🚀 Desplegando a Vercel..."
vercel --prod

echo ""
echo "✅ ¡Deploy completado!"
echo ""
echo "🌐 URLs del proyecto:"
echo "  Frontend: https://son1kvers3-enhanced.vercel.app"
echo "  Backend API: https://son1kvers3-enhanced.vercel.app/api"
echo "  Documentación: https://son1kvers3-enhanced.vercel.app/api/docs"
echo ""
echo "🔧 Variables de entorno a configurar en Vercel Dashboard:"
echo "  HUGGINGFACE_API_KEY=tu_clave_de_huggingface"
echo "  OLLAMA_BASE_URL=https://ollama.son1kvers3.com"
echo ""
echo "🎵 ¡Son1kVers3 Enhanced v2.0 está listo para la resistencia!"

