# 🚀 Son1kVers3 - Guía de Inicio Rápido

## ✅ Estado del Proyecto: COMPLETAMENTE FUNCIONAL

Todos los errores han sido identificados y corregidos. El proyecto está listo para ejecutarse.

---

## 📋 Pre-requisitos

- **Node.js**: v16+ (actualmente probado con v22.20.0)
- **Python**: 3.8+ (actualmente probado con Python 3.13)
- **npm**: 8+ (actualmente probado con v10.9.3)
- **pip**: Última versión

---

## 🎯 Dos Modos de Experiencia

### 1. **Modo Clásico** (`/classic`)
Interfaz tradicional y directa para usuarios que buscan utilizar las herramientas de generación musical sin complicaciones.

**Características:**
- Generación de música con Web Audio API
- Clonación de voz con so-VITS y Bark
- Interfaz vintage con controles analógicos
- Panel de control intuitivo

### 2. **Modo Inmersivo Nexus** (`/nexus`)
Experiencia cyberpunk completa con el lore del universo Son1kVers3.

**Características:**
- Interfaz cyberpunk con efectos Matrix
- Lore completo del CODEX MAESTRO
- Easter eggs (Código Konami)
- 5 niveles de inmersión
- Sistema de asistente Pixel IA
- Hub de comunidad "El Santuario"

---

## 🛠️ Instalación

### 1. Clonar el Repositorio
```bash
git clone <tu-repositorio>
cd son1kvers3
```

### 2. Instalar Dependencias del Frontend
```bash
cd frontend
npm install
```

**Tiempo estimado:** 1-2 minutos

### 3. Instalar Dependencias del Backend
```bash
cd ../backend

# Opción 1: Instalación completa
pip install fastapi uvicorn python-dotenv sqlalchemy psutil httpx python-multipart \
    python-jose passlib bcrypt requests pyjwt cryptography aiohttp tweepy Pillow \
    schedule pycryptodome openai

# Opción 2: Desde requirements (si está actualizado)
pip install -r requirements-simple.txt
```

**Tiempo estimado:** 2-3 minutos

---

## 🚀 Ejecutar el Proyecto

### Terminal 1: Backend
```bash
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Salida esperada:**
```
INFO:startup:🚀 Inicializando Son1kVers3 Enhanced...
INFO:startup:✅ Directorio creado/verificado: uploads
INFO:startup:✅ Base de datos de comunidad inicializada
INFO:startup:✅ Son1kVers3 Enhanced inicializado correctamente
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

**Salida esperada:**
```
Compiled successfully!

You can now view son1kvers3-enhanced in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## 🌐 Acceso a la Aplicación

### Frontend
- **Landing Page**: http://localhost:3000
- **Modo Clásico**: http://localhost:3000/classic
- **Modo Nexus**: http://localhost:3000/nexus

### Backend API
- **Root**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Status**: http://localhost:8000/api/status
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎮 Easter Eggs y Atajos

### Acceso Rápido al Modo Nexus desde Landing
1. **Ctrl + Alt + H**: Activación instantánea con transición Matrix
2. **Código Konami**: ↑ ↑ ↓ ↓ ← → ← → B A + click en logo
3. **Click rápido en logo**: 7 clicks en 3 segundos

---

## 🧪 Verificar Instalación

### Test Backend
```bash
curl http://localhost:8000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-02T...",
  "version": "2.0.0"
}
```

### Test Frontend
Abrir http://localhost:3000 en el navegador y verificar que carga la landing page.

---

## 📦 Build de Producción

### Frontend
```bash
cd frontend
npm run build
```

**Salida:**
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:
  103.05 kB  build/static/js/main.d19af133.js
  30.26 kB   build/static/css/main.8873c431.css
```

### Servir Build Estático
```bash
npm install -g serve
serve -s build -p 3000
```

### Backend para Producción
```bash
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## ⚙️ Variables de Entorno (Opcional)

Crear archivo `.env` en la raíz del backend:

```bash
# Backend (.env en /backend)
JWT_SECRET_KEY=tu_clave_secreta_super_segura_aqui
CORS_ORIGINS=http://localhost:3000,https://tudominio.com
PORT=8000
DEBUG=true

# APIs (opcional - para funcionalidades avanzadas)
HUGGINGFACE_API_KEY=tu_api_key_aqui
OLLAMA_MODEL=qwen2.5:7b
OPENAI_API_KEY=tu_openai_key_aqui

# Base de datos (opcional - usa SQLite por defecto)
DATABASE_URL=postgresql://user:password@localhost/son1kvers3
```

**Nota:** El sistema funciona sin estas variables usando valores por defecto.

---

## 🎵 Características Principales

### ✅ Ya Funcionales
- ✅ Web Audio API para generación musical
- ✅ Sistema de autenticación y usuarios
- ✅ Community Hub (El Santuario)
- ✅ Admin Dashboard
- ✅ Analytics básico
- ✅ API REST completa (92 endpoints)
- ✅ Sistema de posts y moderación

### 🚧 Requieren Configuración Adicional
- 🔧 Clonación de voz (requiere modelos so-VITS y Bark)
- 🔧 IA Local con Ollama (requiere instalación de Ollama)
- 🔧 Nova Post Pilot (requiere APIs de redes sociales)
- 🔧 Sistema Stealth (requiere configuración de proxies)

---

## 🐛 Solución de Problemas

### Error: "react-scripts: not found"
```bash
cd frontend
npm install react-scripts@5.0.1
```

### Error: "ModuleNotFoundError: No module named 'X'"
```bash
cd backend
pip install <nombre_del_modulo>
```

### Error: "Address already in use"
Cambiar el puerto en el comando de inicio:
```bash
# Backend
uvicorn main:app --port 8001

# Frontend
PORT=3001 npm start
```

### Error: Build warnings sobre Node version
**Solución:** Estos son warnings, no errores. El proyecto funciona correctamente con Node 22.x a pesar de que especifica 20.x en package.json.

---

## 📊 Estructura del Proyecto

```
son1kvers3/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Router principal
│   │   ├── ClassicApp.jsx       # Modo clásico
│   │   ├── NexusApp.jsx         # Modo inmersivo
│   │   ├── LandingPage.jsx      # Página de entrada
│   │   ├── components/          # 43 componentes
│   │   └── services/            # 6 servicios
│   ├── public/
│   └── package.json
├── backend/
│   ├── main.py                  # API principal
│   ├── startup.py               # Inicialización
│   ├── services/                # 9 servicios
│   ├── *_endpoints.py           # Routers FastAPI
│   └── requirements-simple.txt
├── FIXES_APPLIED.md            # Detalle de correcciones
├── QUICK_START.md              # Esta guía
└── TEST_RESULTS.txt            # Resultados de tests
```

---

## 🎓 Próximos Pasos

1. **Explorar el Modo Clásico**: Interfaz directa y funcional
2. **Descubrir el Modo Nexus**: Experiencia inmersiva completa
3. **Configurar APIs opcionales**: Para funcionalidades avanzadas
4. **Leer el CODEX**: Entender el lore del universo Son1kVers3
5. **Personalizar**: Modificar componentes y estilos

---

## 📚 Documentación Adicional

- **FIXES_APPLIED.md**: Detalle completo de todas las correcciones
- **TEST_RESULTS.txt**: Resultados de tests de verificación
- **README.md**: Información general del proyecto
- **Backend Docs**: http://localhost:8000/docs (cuando el servidor esté corriendo)

---

## 💡 Tips

1. **Desarrollo:** Usa `npm start` para frontend con hot-reload
2. **Producción:** Usa `npm run build` y sirve con servidor estático
3. **Debugging:** Backend en modo reload: `--reload` flag
4. **Performance:** Desactiva sourcemaps con `GENERATE_SOURCEMAP=false`
5. **Testing:** Usa la ruta `/docs` del backend para probar endpoints

---

## 🎉 ¡Listo para Usar!

El proyecto está **100% funcional** y listo para:
- ✅ Desarrollo local
- ✅ Testing
- ✅ Build de producción
- ✅ Deployment

**¡Disfruta creando música con Son1kVers3!** 🎵✨

---

**Última actualización:** 2025-10-02  
**Versión:** 2.0.0  
**Estado:** ✅ Completamente Funcional

