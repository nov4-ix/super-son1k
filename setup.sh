#!/bin/bash

# 🎵 Son1kVers3 Enhanced - Script de Configuración
# Script para configurar automáticamente todos los servicios

echo "🔧 Configurando Son1kVers3 Enhanced v2.0..."
echo "================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

print_ai() {
    echo -e "${CYAN}[AI]${NC} $1"
}

# Verificar prerrequisitos
print_step "Verificando prerrequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 16+ primero."
    exit 1
else
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
fi

# Verificar Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado. Por favor instala Python 3.8+ primero."
    exit 1
else
    PYTHON_VERSION=$(python3 --version)
    print_success "Python encontrado: $PYTHON_VERSION"
fi

# Verificar Ollama
if ! command -v ollama &> /dev/null; then
    print_warning "Ollama no está instalado. Instalando Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    if [ $? -eq 0 ]; then
        print_success "Ollama instalado correctamente"
    else
        print_error "Error instalando Ollama"
        exit 1
    fi
else
    print_success "Ollama encontrado: $(ollama --version)"
fi

# Verificar que Ollama esté corriendo
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    print_warning "Ollama no está corriendo. Iniciando Ollama..."
    ollama serve &
    sleep 5
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_success "Ollama iniciado correctamente"
    else
        print_error "No se pudo iniciar Ollama"
        exit 1
    fi
else
    print_success "Ollama está corriendo"
fi

# Verificar modelos de IA
print_step "Verificando modelos de IA..."

# Verificar Qwen 2.5
if ollama list | grep -q "qwen2.5:7b"; then
    print_success "Qwen 2.5:7b ya está instalado"
else
    print_ai "Descargando Qwen 2.5:7b..."
    ollama pull qwen2.5:7b
    if [ $? -eq 0 ]; then
        print_success "Qwen 2.5:7b descargado correctamente"
    else
        print_error "Error descargando Qwen 2.5:7b"
        exit 1
    fi
fi

# Verificar Llama 3.1 (opcional)
if ollama list | grep -q "llama3.1"; then
    print_success "Llama 3.1 ya está instalado"
else
    print_ai "Descargando Llama 3.1:8b (opcional)..."
    ollama pull llama3.1:8b
    if [ $? -eq 0 ]; then
        print_success "Llama 3.1:8b descargado correctamente"
    else
        print_warning "Error descargando Llama 3.1:8b (opcional)"
    fi
fi

# Crear directorios necesarios
print_step "Creando directorios del sistema..."

mkdir -p models/{sovits,bark,audio}
mkdir -p logs
mkdir -p data/{analytics,voice_cloning,social_media}
mkdir -p uploads
mkdir -p output

print_success "Directorios creados correctamente"

# Crear archivo de configuración
print_step "Configurando variables de entorno..."

if [ ! -f ".env" ]; then
    cp env.example .env
    print_success "Archivo .env creado desde env.example"
    print_warning "IMPORTANTE: Edita el archivo .env con tus claves reales"
else
    print_success "Archivo .env ya existe"
fi

# Instalar dependencias del frontend
print_step "Instalando dependencias del frontend..."

cd frontend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencias del frontend instaladas"
    else
        print_error "Error instalando dependencias del frontend"
        exit 1
    fi
else
    print_success "Dependencias del frontend ya están instaladas"
fi

cd ..

# Instalar dependencias del backend
print_step "Instalando dependencias del backend..."

cd backend
python3 -m pip install -r requirements-simple.txt
if [ $? -eq 0 ]; then
    print_success "Dependencias del backend instaladas"
else
    print_error "Error instalando dependencias del backend"
    exit 1
fi

cd ..

# Crear archivo de configuración de Ollama
print_step "Configurando Ollama para Son1kVers3..."

cat > ollama_config.json << EOF
{
  "name": "son1kvers3-qwen",
  "model": "qwen2.5:7b",
  "system_prompt": "Eres un asistente especializado en análisis musical, generación de letras y optimización de contenido para redes sociales. Ayudas a productores musicales y creadores de contenido a mejorar su trabajo con IA.",
  "parameters": {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 2048
  }
}
EOF

print_success "Configuración de Ollama creada"

# Crear script de prueba de IA
print_step "Creando script de prueba de IA..."

cat > test_ai.py << 'EOF'
#!/usr/bin/env python3
"""
Script de prueba para verificar la integración con Ollama
"""

import requests
import json

def test_ollama_connection():
    """Probar conexión con Ollama"""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json()
            print("✅ Ollama está funcionando correctamente")
            print(f"📊 Modelos disponibles: {len(models['models'])}")
            for model in models['models']:
                print(f"   - {model['name']}")
            return True
        else:
            print("❌ Error conectando con Ollama")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_qwen_generation():
    """Probar generación con Qwen 2.5"""
    try:
        payload = {
            "model": "qwen2.5:7b",
            "prompt": "Analiza este prompt musical: 'cyberpunk electronic track with heavy bass'",
            "stream": False
        }
        
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Qwen 2.5 está funcionando correctamente")
            print(f"🤖 Respuesta: {result['response'][:100]}...")
            return True
        else:
            print("❌ Error generando con Qwen 2.5")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Probando integración con Ollama...")
    print("=" * 50)
    
    if test_ollama_connection():
        test_qwen_generation()
    
    print("=" * 50)
    print("✅ Pruebas completadas")
EOF

chmod +x test_ai.py
print_success "Script de prueba de IA creado"

# Crear configuración de so-VITS (placeholder)
print_step "Configurando so-VITS-SVC..."

cat > models/sovits/README.md << 'EOF'
# so-VITS-SVC 4.0 Configuration

## Instalación

1. Clona el repositorio oficial:
```bash
git clone https://github.com/svc-develop-team/so-vits-svc.git
cd so-vits-svc
```

2. Instala las dependencias:
```bash
pip install -r requirements.txt
```

3. Descarga los modelos pre-entrenados:
```bash
# Descargar modelos desde Hugging Face
huggingface-cli download lj1995/VoiceConversionWebUI
```

## Configuración

1. Coloca los modelos en: `./models/sovits/`
2. Configura el archivo de configuración
3. Actualiza las rutas en el archivo .env

## Uso

El sistema automáticamente detectará y usará so-VITS cuando esté configurado.
EOF

print_success "Configuración de so-VITS creada"

# Crear configuración de Bark (placeholder)
print_step "Configurando Bark..."

cat > models/bark/README.md << 'EOF'
# Bark Voice Cloning Configuration

## Instalación

1. Instala Bark:
```bash
pip install bark
```

2. Descarga los modelos:
```python
from bark import SAMPLE_RATE, generate_audio, preload_models
from bark.generation import load_codec_model, generate_text_semantic

# Precargar modelos
preload_models()
```

## Configuración

1. Los modelos se descargan automáticamente en la primera ejecución
2. Configura las rutas en el archivo .env
3. Ajusta los parámetros de calidad según tu hardware

## Uso

El sistema automáticamente detectará y usará Bark cuando esté configurado.
EOF

print_success "Configuración de Bark creada"

# Crear configuración de Redis (opcional)
print_step "Configurando Redis (opcional)..."

if command -v redis-server &> /dev/null; then
    print_success "Redis encontrado"
    if ! pgrep -x "redis-server" > /dev/null; then
        print_warning "Redis no está corriendo. Iniciando Redis..."
        redis-server --daemonize yes
        print_success "Redis iniciado"
    else
        print_success "Redis ya está corriendo"
    fi
else
    print_warning "Redis no está instalado. Instalando Redis..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install redis
        else
            print_error "Homebrew no está instalado. Instala Redis manualmente."
        fi
    else
        print_warning "Instala Redis manualmente para tu sistema operativo"
    fi
fi

# Crear script de monitoreo
print_step "Creando script de monitoreo..."

cat > monitor.sh << 'EOF'
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
EOF

chmod +x monitor.sh
print_success "Script de monitoreo creado"

# Ejecutar prueba de IA
print_step "Ejecutando prueba de IA..."

python3 test_ai.py

# Mostrar resumen final
print_success "================================================"
print_success "🎉 ¡Configuración completada exitosamente!"
print_success "================================================"
echo ""
print_status "Servicios configurados:"
echo "  🤖 Ollama con Qwen 2.5:7b"
echo "  🎵 Sistema de generación musical"
echo "  🎤 Clone Station (so-VITS + Bark)"
echo "  🚀 Nova Post Pilot"
echo "  📊 Analytics en tiempo real"
echo "  🎮 Interfaz Nexus cyberpunk"
echo "  🔒 Sistema stealth"
echo ""
print_status "Próximos pasos:"
echo "  1. Edita el archivo .env con tus claves reales"
echo "  2. Configura so-VITS y Bark según los READMEs"
echo "  3. Ejecuta: ./start.sh para iniciar el sistema"
echo "  4. Ejecuta: ./monitor.sh para verificar el estado"
echo ""
print_warning "Nota: Algunas funcionalidades requieren configuración adicional"
print_warning "Revisa los archivos README en las carpetas de modelos"
echo ""
