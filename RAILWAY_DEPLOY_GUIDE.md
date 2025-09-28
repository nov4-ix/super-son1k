# 🚀 Guía de Deploy a Railway - Son1kVers3 Enhanced v2.0

## 📋 **PASO A PASO PARA SUBIR A RAILWAY:**

### **Paso 1: Acceder a Railway**
1. **Ve a**: https://railway.app
2. **Inicia sesión** con tu cuenta (GitHub/Google)
3. **Clic en**: "New Project"

### **Paso 2: Crear Nuevo Proyecto**
1. **Selecciona**: "Deploy from GitHub repo" o "Deploy from template"
2. **Si usas GitHub**: Conecta tu repositorio
3. **Si usas template**: Selecciona "Empty Project"

### **Paso 3: Subir el Backend**
1. **Clic en**: "Deploy from folder"
2. **Sube el archivo**: `son1kvers3-backend-railway.zip`
3. **Railway extraerá** automáticamente el contenido

### **Paso 4: Configurar Variables de Entorno**
1. **Ve a**: "Variables" tab
2. **Añade las siguientes variables**:

```
NODE_ENV=production
PYTHON_VERSION=3.12
PYTHONPATH=/app/backend
JWT_SECRET_KEY=son1kvers3_enhanced_production_secret_key_2024_railway_secure
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=sqlite:///./son1kvers3.db
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
SOVITS_MODEL_PATH=./models/sovits/
BARK_MODEL_PATH=./models/bark/
VOICE_CLONING_ENABLED=true
NOVA_POST_ENABLED=true
SOCIAL_MEDIA_ANALYSIS=true
GHOST_STUDIO_ENABLED=true
AUDIO_ANALYSIS_ENABLED=true
ANALYTICS_ENABLED=true
METRICS_COLLECTION=true
DAW_EDITOR_ENABLED=true
AUDIO_EXPORT_ENABLED=true
CORS_ORIGINS=https://son1kvers3.com,https://www.son1kvers3.com,https://enhanced.son1kvers3.com,https://v2.son1kvers3.com,https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app,http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=son1kvers3.com,www.son1kvers3.com,enhanced.son1kvers3.com,v2.son1kvers3.com,backend-api.son1kvers3.com,server.son1kvers3.com,app.son1kvers3.com,son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app,localhost,127.0.0.1
UPLOAD_DIR=./uploads/
OUTPUT_DIR=./output/
LOGS_DIR=./logs/
HOST=0.0.0.0
PORT=8000
DEBUG=false
HEALTH_CHECK_ENABLED=true
METRICS_ENABLED=true
RAILWAY_ENVIRONMENT=production
RAILWAY_STATIC_URL=https://son1kvers3-enhanced-ogbt2pvop-son1kvers3s-projects.vercel.app
RAILWAY_PUBLIC_DOMAIN=backend-api.son1kvers3.com
```

### **Paso 5: Configurar Build Settings**
1. **Ve a**: "Settings" tab
2. **Build Command**: `pip install -r backend/requirements-simple.txt`
3. **Start Command**: `cd backend && python3 main.py`
4. **Health Check Path**: `/health`

### **Paso 6: Deploy**
1. **Clic en**: "Deploy"
2. **Espera** a que termine el build (2-5 minutos)
3. **Verifica** que el deploy sea exitoso

### **Paso 7: Obtener URL del Backend**
1. **Ve a**: "Deployments" tab
2. **Copia la URL** del backend (ej: `https://son1kvers3-backend-production.up.railway.app`)
3. **Esta será tu URL** para configurar DNS

## 🌐 **CONFIGURACIÓN DNS:**

### **URL del Backend:**
```
https://[TU-BACKEND-URL].up.railway.app
```

### **Registros DNS a Configurar:**
```
Tipo: CNAME
Nombre: backend-api
Valor: [TU-BACKEND-URL].up.railway.app
TTL: 300

Tipo: CNAME
Nombre: server
Valor: [TU-BACKEND-URL].up.railway.app
TTL: 300

Tipo: CNAME
Nombre: app
Valor: [TU-BACKEND-URL].up.railway.app
TTL: 300
```

## 🔍 **VERIFICACIÓN:**

### **1. Verificar Backend:**
```bash
curl https://[TU-BACKEND-URL].up.railway.app/health
```

### **2. Verificar DNS:**
```bash
nslookup backend-api.son1kvers3.com
```

### **3. Verificar Integración:**
- Frontend: https://enhanced.son1kvers3.com
- Backend: https://backend-api.son1kvers3.com
- API Docs: https://backend-api.son1kvers3.com/docs

## 🎯 **RESULTADO FINAL:**

- **Frontend**: https://enhanced.son1kvers3.com
- **Backend**: https://backend-api.son1kvers3.com
- **API Docs**: https://backend-api.son1kvers3.com/docs
- **Sistema**: Completamente funcional

---

**¡Sistema desplegado y funcionando!** 🎵🚀✨
