# 🚀 Son1kVers3 Enhanced v2.0 - Instrucciones de Deploy

## 📋 **RESUMEN DEL SISTEMA**

Son1kVers3 Enhanced es un sistema completo de generación musical con IA local que incluye:

- 🎵 **Generación Musical** con Web Audio API
- 🎤 **Clone Station** (so-VITS + Bark)
- 🚀 **Nova Post Pilot** (Análisis de redes sociales)
- 🎛️ **DAW Editor** (Editor de música estilo DAW)
- 👻 **Ghost Studio** (Análisis de audio)
- 📊 **Analytics** (Métricas en tiempo real)
- 🎮 **Nexus Interface** (Interfaz cyberpunk inmersiva)
- 🤖 **IA local** con Ollama (Qwen 2.5:7b)
- 🎨 **Logo oficial** de Son1kVers3

## 🛠️ **REQUISITOS DEL SISTEMA**

### **Backend (Python 3.12+)**
- Python 3.12 o superior
- pip (gestor de paquetes de Python)
- Ollama (servidor de IA local)

### **Frontend (Node.js 18+)**
- Node.js 18 o superior
- npm (gestor de paquetes de Node.js)

### **Servicios Externos (Opcionales)**
- Redis (para cache y colas)
- Suno AI (para generación musical)
- ElevenLabs (para clonación de voz)
- Azure Cognitive Services (para clonación de voz)

## 🚀 **INSTALACIÓN RÁPIDA**

### **1. Clonar el repositorio**
```bash
git clone https://github.com/nov4-ix/son1kvers3-enhanced.git
cd son1kvers3-enhanced
```

### **2. Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus API keys
```

### **3. Instalar dependencias**
```bash
# Backend
cd backend
pip install -r requirements-simple.txt

# Frontend
cd ../frontend
npm install
```

### **4. Configurar Ollama**
```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Descargar modelo Qwen
ollama pull qwen2.5:7b
```

### **5. Iniciar servicios**
```bash
# Desde el directorio raíz
./start.sh
```

## 🌐 **DEPLOY EN PLATAFORMAS CLOUD**

### **Railway (Recomendado para Backend)**
1. Ve a [Railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `son1kvers3-enhanced`
4. Configura las variables de entorno
5. Deploy automático

### **Vercel (Recomendado para Frontend)**
1. Ve a [Vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `son1kvers3-enhanced`
4. Configura el directorio de build: `frontend`
5. Deploy automático

### **Heroku (Alternativo)**
1. Instala Heroku CLI
2. Login: `heroku login`
3. Crear app: `heroku create son1kvers3-enhanced`
4. Configurar variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

## 🔧 **CONFIGURACIÓN AVANZADA**

### **Variables de Entorno Requeridas**
```bash
# JWT
JWT_SECRET_KEY=tu_secreto_jwt_aqui
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Base de datos
DATABASE_URL=sqlite:///./son1kvers3.db

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# Suno AI (Opcional)
SUNO_AI_COOKIES=tu_cookie_suno_aqui

# APIs Externas (Opcionales)
ELEVENLABS_API_KEY=tu_api_key_elevenlabs
AZURE_SPEECH_KEY=tu_api_key_azure
RESEMBLE_API_KEY=tu_api_key_resemble
```

### **Configuración de Ollama**
```bash
# Crear archivo de configuración
cat > ollama_config.json << EOF
{
  "models": {
    "qwen2.5:7b": {
      "description": "Modelo principal para análisis musical",
      "max_tokens": 4096,
      "temperature": 0.7
    }
  },
  "server": {
    "host": "0.0.0.0",
    "port": 11434
  }
}
EOF
```

## 📊 **MONITOREO Y MANTENIMIENTO**

### **Verificar estado de servicios**
```bash
./monitor.sh
```

### **Logs del sistema**
```bash
# Backend
tail -f logs/backend.log

# Frontend
tail -f logs/frontend.log

# Ollama
ollama logs
```

### **Reiniciar servicios**
```bash
./stop.sh
./start.sh
```

## 🎯 **FUNCIONALIDADES PRINCIPALES**

### **1. Generación Musical**
- Síntesis en tiempo real con Web Audio API
- Efectos de audio profesionales (reverb, delay, EQ)
- Exportación a WAV de alta calidad
- Control de BPM y estructura musical

### **2. Clone Station**
- Clonación de voz con so-VITS y Bark
- Múltiples modelos de IA
- Configuración de velocidad y tono
- Soporte para diferentes idiomas

### **3. Nova Post Pilot**
- Análisis de algoritmos de redes sociales
- Generación de contenido viral
- Optimización de horarios de publicación
- Métricas de engagement

### **4. DAW Editor**
- Editor de música estilo DAW
- Múltiples pistas de audio
- Efectos en tiempo real
- Exportación de proyectos

### **5. Ghost Studio**
- Análisis avanzado de audio
- Detección de patrones musicales
- Recomendaciones de mejora
- Métricas de calidad

## 🔒 **SEGURIDAD**

- Autenticación JWT
- Validación de entrada
- Rate limiting
- CORS configurado
- Variables de entorno seguras

## 📈 **ESCALABILIDAD**

- Arquitectura modular
- Servicios independientes
- Cache con Redis
- Colas de procesamiento
- Load balancing ready

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: Puerto en uso**
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
lsof -i :8000

# Matar proceso
kill -9 PID
```

### **Error: Ollama no responde**
```bash
# Reiniciar Ollama
ollama serve
```

### **Error: Dependencias faltantes**
```bash
# Reinstalar dependencias
cd frontend && npm install
cd ../backend && pip install -r requirements-simple.txt
```

## 📞 **SOPORTE**

- GitHub Issues: [Reportar problemas](https://github.com/nov4-ix/son1kvers3-enhanced/issues)
- Email: dev@son1kvers3.com
- Discord: [Servidor de la comunidad](https://discord.gg/son1kvers3)

## 📄 **LICENCIA**

MIT License - Ver archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ por el equipo de Son1kVers3**


