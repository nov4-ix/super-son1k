# 🚀 Guía de Deployment en Vercel - Son1kVers3

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en GitHub (para conectar el repositorio)
- El proyecto debe estar en un repositorio de GitHub

---

## 🔧 Configuración para Vercel

### Opción 1: Deploy desde la UI de Vercel (Recomendado)

#### 1. Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New"** → **"Project"**
3. Importa tu repositorio de GitHub
4. Selecciona el repositorio `son1kvers3`

#### 2. Configurar el Proyecto

**Framework Preset:** Create React App

**Root Directory:** `frontend`

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```bash
build
```

**Install Command:**
```bash
npm install
```

#### 3. Variables de Entorno

En la sección "Environment Variables" agrega:

```bash
# Producción
NODE_ENV=production
GENERATE_SOURCEMAP=false
CI=false

# API Backend (opcional - si tienes backend desplegado)
REACT_APP_API_BASE_URL=https://tu-backend.vercel.app
```

#### 4. Deploy

Click en **"Deploy"** y espera a que termine el build (2-3 minutos)

---

### Opción 2: Deploy desde CLI

#### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

Desde la raíz del proyecto:

```bash
# Deploy de prueba
vercel

# Deploy a producción
vercel --prod
```

---

## 🎯 Configuración de Rutas

El archivo `vercel.json` ya está configurado para manejar:

- `/` - Landing Page
- `/classic` - Modo Clásico
- `/nexus` - Modo Inmersivo Nexus
- Todas las rutas redirigen a `index.html` (SPA routing)

---

## 🔒 Variables de Entorno Recomendadas

### Frontend en Vercel

```bash
# Básicas
NODE_ENV=production
GENERATE_SOURCEMAP=false
CI=false

# URLs de servicios (si aplica)
REACT_APP_API_BASE_URL=https://tu-backend.vercel.app
REACT_APP_OLLAMA_URL=https://tu-ollama-service.com
REACT_APP_VOICE_CLONING_URL=https://tu-voice-service.com
```

---

## 🚨 Solución de Problemas Comunes

### Error: "Build Failed"

**Solución 1:** Verifica que `react-scripts` esté en la versión correcta
```json
"react-scripts": "5.0.1"
```

**Solución 2:** Agrega `CI=false` a las variables de entorno para ignorar warnings

### Error: "Routes not working"

**Solución:** Verifica que `vercel.json` esté en la raíz del proyecto con las rutas correctas

### Error: "Out of Memory"

**Solución:** Agrega en `vercel.json`:
```json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

---

## 📊 Verificación Post-Deploy

Después del deploy, verifica:

1. **Landing Page** funciona: `https://tu-proyecto.vercel.app/`
2. **Modo Clásico** funciona: `https://tu-proyecto.vercel.app/classic`
3. **Modo Nexus** funciona: `https://tu-proyecto.vercel.app/nexus`
4. **Routing** funciona: Refresh en cualquier ruta no da 404
5. **Assets** cargan: CSS, JS, imágenes

---

## 🌐 Dominio Personalizado (Opcional)

### Configurar Dominio

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Add tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

### Ejemplo:
- `son1kvers3.com` → Landing
- `app.son1kvers3.com` → Aplicación
- `nexus.son1kvers3.com` → Modo Inmersivo

---

## 🔄 Deploy Automático

Vercel hace deploy automático cuando:

1. Haces push a la rama principal (main/master)
2. Creas un Pull Request (preview deployment)
3. Mergeas un PR

### Branches:
- `main` → Producción
- Otras ramas → Preview deployments

---

## 📈 Monitoreo y Analytics

Vercel proporciona:

- **Analytics:** Visitas, performance, etc.
- **Logs:** Build logs y runtime logs
- **Speed Insights:** Core Web Vitals
- **Real-time:** Deployments en tiempo real

Accede desde: Dashboard → Tu Proyecto → Analytics

---

## 🎨 Preview Deployments

Cada commit en cualquier rama crea un preview deployment con URL única:

```
https://son1kvers3-{branch}-{usuario}.vercel.app
```

Útil para:
- Testing de features
- Review de Pull Requests
- Compartir con el equipo

---

## 🔧 Comandos Útiles de Vercel CLI

```bash
# Ver información del proyecto
vercel ls

# Ver logs en tiempo real
vercel logs

# Eliminar un deployment
vercel rm [deployment-url]

# Ver detalles del deployment
vercel inspect [deployment-url]

# Promover preview a producción
vercel promote [deployment-url]
```

---

## 📱 Testing en Vercel

### URLs de Testing:

1. **Production:** `https://tu-proyecto.vercel.app`
2. **Preview:** `https://tu-proyecto-{branch}.vercel.app`
3. **Development:** Local con `npm start`

### Checklist de Testing:

- [ ] Landing page carga correctamente
- [ ] Navegación entre modos funciona
- [ ] Easter eggs funcionan (Ctrl+Alt+H, Konami Code)
- [ ] Responsive en móvil
- [ ] Assets se cargan (imágenes, fonts, etc.)
- [ ] Console sin errores críticos
- [ ] Performance aceptable (Lighthouse > 80)

---

## 🎯 Optimizaciones para Producción

### 1. Performance

Ya configurado en el build:
- ✅ Minificación de JS/CSS
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Gzip compression (automático en Vercel)
- ✅ Sin sourcemaps en producción

### 2. SEO (Opcional)

Agregar en `public/index.html`:

```html
<meta name="description" content="Son1kVers3 - Generación Musical con IA">
<meta property="og:title" content="Son1kVers3 Nexus">
<meta property="og:description" content="Plataforma de generación musical avanzada">
<meta property="og:image" content="/og-image.jpg">
```

### 3. PWA (Ya configurado)

El proyecto tiene `sw.js` para Progressive Web App

---

## 🔐 Seguridad

### Headers de Seguridad

Agregar en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 💰 Costos

### Plan Free de Vercel incluye:

- ✅ Deployments ilimitados
- ✅ 100 GB bandwidth/mes
- ✅ HTTPS automático
- ✅ Preview deployments
- ✅ Analytics básico
- ⚠️ Límite de 6,000 minutos de build/mes

**Para Son1kVers3:** El plan Free es suficiente para desarrollo y testing

---

## 📞 Soporte

Si hay problemas con el deployment:

1. **Logs de Build:** Vercel Dashboard → Deployments → Build Logs
2. **Documentación:** https://vercel.com/docs
3. **Soporte:** https://vercel.com/support
4. **Community:** https://github.com/vercel/vercel/discussions

---

## ✅ Checklist Final

Antes de hacer deploy a producción:

- [ ] Build local funciona (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] `vercel.json` correcto
- [ ] Rutas probadas localmente
- [ ] Easter eggs funcionan
- [ ] Performance optimizada
- [ ] No hay API keys expuestas en el código
- [ ] README actualizado con URL de producción

---

## 🎉 ¡Listo para Deploy!

Una vez configurado, tu Son1kVers3 estará disponible en:

```
https://son1kvers3.vercel.app/          → Landing Page
https://son1kvers3.vercel.app/classic   → Modo Clásico
https://son1kvers3.vercel.app/nexus     → Modo Inmersivo Nexus
```

**¡Disfruta compartiendo tu universo musical con el mundo!** 🎵✨

---

**Última actualización:** 2025-10-02  
**Versión:** 2.0.0  
**Deploy Status:** ✅ Ready for Vercel
