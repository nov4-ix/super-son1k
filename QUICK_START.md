# 🚀 Son1kVers3 Enhanced - Quick Start Guide

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar Dependencias del Backend

```bash
cd backend
pip install -r requirements.txt
```

**Nota:** Algunas dependencias de IA (torch, transformers) son grandes. Para desarrollo rápido, puedes comentarlas temporalmente.

### 2. Configurar Variables de Entorno

```bash
# Crear archivo .env en el directorio backend
cat > backend/.env << EOF
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Security
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Database
DATABASE_URL=sqlite:///./son1kvers3.db

# Optional: Redis
# REDIS_URL=redis://localhost:6379

# Optional: External APIs
# SPOTIFY_CLIENT_ID=your_spotify_client_id
# SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
# STRIPE_SECRET_KEY=your_stripe_secret_key
EOF
```

### 3. Iniciar el Backend

```bash
cd backend
python3 main.py
```

El servidor estará disponible en:
- API: http://localhost:8000
- Documentación: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 4. Instalar Dependencias del Frontend

```bash
cd frontend
npm install
```

### 5. Iniciar el Frontend

```bash
cd frontend
npm start
```

La aplicación estará disponible en: http://localhost:3000

---

## ✅ Verificar que Todo Funciona

### Opción 1: Verificación Automática

```bash
# Desde el directorio raíz
./run_all_verifications.sh
```

### Opción 2: Verificación Manual

1. **Backend Health Check**
   ```bash
   curl http://localhost:8000/health
   ```
   
   Respuesta esperada:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-10-02T18:00:00",
     "version": "2.0.0"
   }
   ```

2. **Frontend**
   - Abrir http://localhost:3000
   - Deberías ver la interfaz de Son1kVers3

3. **API Documentation**
   - Abrir http://localhost:8000/docs
   - Explorar los 119 endpoints disponibles

---

## 🎯 Características Principales

### 1. Ghost Studio (Generación Musical)
- Endpoint: `POST /api/ghost-studio/generate`
- Genera música con IA

### 2. Clone Station (Clonación de Voz)
- Endpoint: `POST /api/clone-station/clone`
- Clona voces con IA

### 3. Nova Post Pilot (Social Media)
- Endpoint: `POST /api/nova-post/analyze`
- Analiza y optimiza contenido para redes sociales

### 4. The Creator (Generación Completa)
- Endpoint: `POST /api/the-creator/generate-music`
- Genera música, letras y cover art

### 5. Resistance DAW Pro (Plugins de Audio)
- 9 plugins profesionales de audio
- EQ, Compresores, Reverb, Saturación, Limiter, etc.

---

## 🔧 Comandos Útiles

### Backend

```bash
# Iniciar servidor de desarrollo
cd backend && python3 main.py

# Iniciar con recarga automática
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ver logs
tail -f backend/logs/app.log

# Ejecutar tests (si están implementados)
cd backend && pytest
```

### Frontend

```bash
# Iniciar desarrollo
cd frontend && npm start

# Build para producción
cd frontend && npm run build

# Servir build de producción
cd frontend && npm run preview
```

### Verificación

```bash
# Verificar plugins
./verify_plugins.sh

# Verificar endpoints
python3 verify_endpoints.py

# Probar conexiones API
./test_api_connections.sh

# Ejecutar todas las verificaciones
./run_all_verifications.sh
```

---

## 📚 Documentación

### Documentos Principales

1. **FINAL_VERIFICATION_SUMMARY.md** - Resumen completo del sistema
2. **ENDPOINTS_MAPPING.md** - Referencia de todos los endpoints
3. **SYSTEM_VERIFICATION_REPORT.md** - Reporte detallado de verificación
4. **PLUGIN_SYSTEM_COMPLETION.md** - Documentación de plugins
5. **ADVANCED_FEATURES_DOCUMENTATION.md** - Funcionalidades avanzadas

### API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🐛 Troubleshooting

### Problema: "ModuleNotFoundError"

**Solución:**
```bash
cd backend
pip install -r requirements.txt
```

### Problema: "Port 8000 already in use"

**Solución:**
```bash
# Cambiar puerto en .env
PORT=8001

# O matar el proceso en el puerto 8000
lsof -ti:8000 | xargs kill -9
```

### Problema: "CORS error" en el frontend

**Solución:**
```bash
# Verificar que CORS_ORIGINS en .env incluya tu frontend
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Problema: "Database error"

**Solución:**
```bash
# El sistema creará automáticamente la base de datos SQLite
# Si hay problemas, eliminar y reiniciar:
rm backend/son1kvers3.db
python3 backend/main.py
```

---

## 🔐 Configuración de Producción

### Variables de Entorno Requeridas

```bash
# Security (IMPORTANTE: Cambiar en producción)
JWT_SECRET_KEY=generate-a-strong-random-key-here
JWT_ALGORITHM=HS256

# Database (Usar PostgreSQL en producción)
DATABASE_URL=postgresql://user:password@localhost:5432/son1kvers3

# Redis (Recomendado para producción)
REDIS_URL=redis://localhost:6379

# CORS (Configurar dominios de producción)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# External APIs
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Checklist de Producción

- [ ] Cambiar JWT_SECRET_KEY a valor seguro
- [ ] Configurar PostgreSQL en lugar de SQLite
- [ ] Configurar Redis para caching
- [ ] Configurar CORS con dominios de producción
- [ ] Configurar SSL/TLS
- [ ] Configurar backups automáticos
- [ ] Configurar monitoring (Prometheus/Grafana)
- [ ] Configurar log aggregation
- [ ] Implementar rate limiting a nivel de infraestructura
- [ ] Configurar CDN para assets estáticos

---

## 📊 Endpoints Principales

### Health Checks

```bash
# Health check básico
curl http://localhost:8000/health

# Health check detallado
curl http://localhost:8000/health/detailed

# Estado de servicios
curl http://localhost:8000/api/status
```

### Authentication

```bash
# Registrar usuario
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass","username":"testuser"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass"}'
```

### Ghost Studio

```bash
# Generar música
curl -X POST http://localhost:8000/api/ghost-studio/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Epic orchestral music","duration":30,"style":"cinematic"}'
```

### Community

```bash
# Obtener top tracks
curl http://localhost:8000/api/community/top-tracks

# Obtener colaboraciones
curl http://localhost:8000/api/community/collaborations
```

---

## 🎨 Interfaz de Usuario

### Componentes Principales

1. **Classic Interface** - Interfaz clásica de generación
2. **Nexus Mode** - Modo avanzado con terminal
3. **Ghost Studio Pro** - Estudio de producción
4. **Clone Station** - Clonación de voz
5. **Nova Post Pilot** - Gestión de redes sociales
6. **Resistance DAW Pro** - DAW con plugins
7. **Community Hub** - Comunidad y colaboración
8. **Admin Dashboard** - Panel de administración

### Plugins de Audio (Resistance DAW Pro)

1. **ALVAE Equalizer** - EQ paramétrico de 8 bandas
2. **Sonic Compressor** - Compresor estilo CLA-76
3. **Resistance Compressor** - Compresor avanzado
4. **Vocal Compressor** - Optimizado para voces
5. **De-Esser** - Control de sibilantes
6. **Stereo Enhancer** - Mejora de imagen estéreo
7. **Reverb Chamber** - Reverberación profesional
8. **Saturator Pro** - Saturación armónica
9. **Limiter Pro** - Limitador brickwall

---

## 🚀 Deployment

### Docker (Recomendado)

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

### Manual

```bash
# Backend
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000

# Frontend
cd frontend
npm run build
serve -s build -p 3000
```

---

## 📈 Monitoring

### Health Checks

```bash
# Kubernetes liveness probe
curl http://localhost:8000/health/live

# Kubernetes readiness probe
curl http://localhost:8000/health/ready
```

### Metrics

```bash
# System metrics
curl http://localhost:8000/api/monitoring/metrics/system

# Performance metrics
curl http://localhost:8000/api/monitoring/performance/metrics
```

---

## 🎉 ¡Listo!

Tu sistema Son1kVers3 Enhanced está ahora funcionando. 

### Próximos Pasos

1. Explorar la documentación en `/docs`
2. Probar los diferentes endpoints
3. Experimentar con los plugins de audio
4. Generar tu primera canción con IA
5. Clonar tu primera voz
6. Publicar en redes sociales con Nova Post Pilot

### Soporte

- Documentación: http://localhost:8000/docs
- Issues: Revisar logs en `backend/logs/`
- Verificación: `./run_all_verifications.sh`

---

**🎵 ¡Disfruta creando música con IA! 🚀**
