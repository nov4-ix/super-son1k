# 🧹 Instrucciones para Limpiar Vercel

## 🎯 Objetivo

Eliminar todos los deploys anteriores y dejar **SOLO** este como oficial.

---

## 📋 PASO 1: Eliminar Proyectos Viejos en Vercel

### Opción A: Desde Vercel Dashboard (Recomendado)

1. **Ve a:** https://vercel.com/dashboard

2. **Identifica proyectos viejos de Son1kVers3:**
   - Pueden tener nombres como:
     - `son1kvers3`
     - `son1kvers3-nexus`
     - `son1kvers3-enhanced`
     - `son1kvers3-frontend`
     - Cualquier variación del nombre

3. **Para CADA proyecto viejo:**
   
   a) Click en el proyecto
   
   b) Ve a "Settings" (⚙️ arriba a la derecha)
   
   c) Scroll hasta abajo → "Delete Project"
   
   d) Escribe el nombre del proyecto para confirmar
   
   e) Click "Delete"

4. **Repite** hasta que solo queden 0 proyectos de Son1kVers3

### Opción B: Desde CLI (Más rápido)

```bash
# 1. Login en Vercel
vercel login

# 2. Listar todos tus proyectos
vercel ls

# 3. Eliminar cada proyecto viejo
vercel rm <nombre-proyecto>

# Ejemplo:
# vercel rm son1kvers3-old
# vercel rm son1kvers3-nexus
# vercel rm son1kvers3-test
```

---

## 📋 PASO 2: Crear Deploy Oficial y Único

### Opción 1: Deploy desde Vercel UI (Más control)

1. **Ve a:** https://vercel.com/new

2. **Import Git Repository:**
   - Click en "Import Git Repository"
   - Selecciona tu repositorio de GitHub
   - Branch: `cursor/fix-son1kvers3-frontend-errors-and-issues-7d93`

3. **Configuración del Proyecto:**
   
   **Project Name:** `son1kvers3-official` (o el que prefieras)
   
   **Framework Preset:** `Create React App`
   
   **Root Directory:** `frontend`
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `build`
   
   **Install Command:** `npm install`

4. **Environment Variables:**
   
   Agrega estas 3 variables:
   ```
   NODE_ENV=production
   GENERATE_SOURCEMAP=false
   CI=false
   ```

5. **Click "Deploy"**

6. **Espera 2-3 minutos...**

7. **¡Listo!** Tendrás tu URL oficial

### Opción 2: Deploy desde CLI (Más rápido)

```bash
# 1. Navega al frontend
cd frontend

# 2. Deploy a producción
vercel --prod

# Responde las preguntas:
# - Set up and deploy? → Y
# - Which scope? → [tu cuenta]
# - Link to existing project? → N
# - Project name? → son1kvers3-official
# - In which directory? → ./
# - Override settings? → N

# 3. Espera el deploy...

# 4. ¡Listo! Te dará la URL
```

---

## 📋 PASO 3: Configurar como Proyecto Oficial

### A. Configurar Dominio Personalizado (Opcional)

1. En el proyecto deployado, ve a **Settings → Domains**

2. **Agregar dominio:**
   - Si tienes dominio: `son1kvers3.com`
   - Vercel te dará instrucciones de DNS

3. **O usar subdominio de Vercel:**
   - Por defecto: `son1kvers3-official.vercel.app`
   - Es gratis y funciona perfecto

### B. Configurar Production Branch

1. Ve a **Settings → Git**

2. **Production Branch:** 
   - Cambia a: `cursor/fix-son1kvers3-frontend-errors-and-issues-7d93`
   - O merge esta rama a `main` y usa `main`

3. **Save**

Ahora cada push a esta rama hará deploy automático.

### C. Bloquear Deploys de Otras Ramas (Opcional)

1. Ve a **Settings → Git**

2. **Ignored Build Step:**
   ```bash
   # Solo deployar desde la rama principal
   if [ "$VERCEL_GIT_COMMIT_REF" != "cursor/fix-son1kvers3-frontend-errors-and-issues-7d93" ]; then exit 1; fi
   ```

3. Esto previene deploys accidentales de otras ramas

---

## 📋 PASO 4: Verificar Deploy Oficial

### Checklist de Verificación:

Abre estas URLs y verifica:

**1. Landing Page:**
```
https://tu-proyecto.vercel.app/
```
- [ ] Carga correctamente
- [ ] Logo y título visibles
- [ ] Botones de navegación funcionan
- [ ] Prueba `Ctrl+Alt+H` → debe ir a Nexus

**2. Modo Clásico:**
```
https://tu-proyecto.vercel.app/classic
```
- [ ] Interfaz vintage carga
- [ ] Controles visibles
- [ ] Header funciona

**3. Modo Nexus:**
```
https://tu-proyecto.vercel.app/nexus
```
- [ ] Interfaz cyberpunk carga
- [ ] Header con navegación visible
- [ ] Prueba `Ctrl+P` → debe abrir Pixel Assistant
- [ ] Navegación entre secciones funciona

**4. Routing SPA:**
- [ ] Refresh en `/classic` no da 404
- [ ] Refresh en `/nexus` no da 404
- [ ] Navegación directa a rutas funciona
- [ ] Assets (CSS, JS) cargan correctamente

**5. Mobile:**
- [ ] Abre en móvil
- [ ] Responsive funciona
- [ ] Navegación táctil funciona

---

## 📋 PASO 5: Configuraciones Adicionales (Opcional)

### A. Analytics de Vercel

1. Ve a **Analytics** en el dashboard del proyecto

2. Verás:
   - Visitas
   - Performance
   - Core Web Vitals

3. Es gratis hasta cierto límite

### B. Protección con Password (Para Beta Privada)

1. Ve a **Settings → Deployment Protection**

2. **Enable Password Protection**

3. Establece password para beta testers

4. Solo quienes tengan el password podrán acceder

### C. Custom 404 Page (Opcional)

Vercel usa `index.html` para SPA routing, ya está configurado.

---

## 🚨 Troubleshooting

### ❌ "Build Failed"

**Verifica:**
```bash
# Local:
cd frontend
npm run build

# Si falla local, arreglar primero
```

**Solución común:**
- Asegúrate `CI=false` en env vars de Vercel
- Verifica `react-scripts: 5.0.1` en package.json

---

### ❌ "404 en rutas"

**Verifica:**
- `frontend/vercel.json` existe
- Tiene configuración de routing SPA

**Solución:**
El archivo ya existe y está correcto.

---

### ❌ "Assets no cargan"

**Solución:**
1. Hard refresh: `Ctrl + Shift + R`
2. Verifica build/static/ tiene archivos
3. Check browser console por errores

---

## 📊 RESUMEN DE LIMPIEZA

### Antes:
```
❌ 5+ proyectos de Son1kVers3 en Vercel
❌ Deploys de diferentes ramas
❌ Configuraciones mezcladas
❌ URLs múltiples confusas
```

### Después:
```
✅ 1 proyecto oficial: son1kvers3-official
✅ 1 branch: cursor/fix-son1kvers3-frontend-errors-and-issues-7d93
✅ 1 URL principal: https://son1kvers3-official.vercel.app
✅ Configuración limpia y clara
```

---

## 🎯 COMANDOS RÁPIDOS

### Para eliminar proyecto viejo:
```bash
vercel rm <nombre-proyecto-viejo>
```

### Para ver proyectos actuales:
```bash
vercel ls
```

### Para deploy del oficial:
```bash
cd frontend && vercel --prod
```

### Para ver logs:
```bash
vercel logs <url-del-deploy>
```

---

## ✅ CHECKLIST FINAL

- [ ] Eliminados todos los proyectos viejos de Vercel
- [ ] Creado 1 proyecto oficial nuevo
- [ ] Configurado correctamente (frontend root, build cmd, etc)
- [ ] Agregadas environment variables
- [ ] Deploy exitoso
- [ ] Verificadas las 3 rutas (/, /classic, /nexus)
- [ ] Testeado en desktop
- [ ] Testeado en mobile
- [ ] URL oficial documentada
- [ ] Listo para compartir con beta testers

---

## 🎉 RESULTADO FINAL

Después de seguir estos pasos tendrás:

**1 Proyecto Oficial:**
- Nombre: `son1kvers3-official`
- URL: `https://son1kvers3-official.vercel.app`
- Branch: `cursor/fix-son1kvers3-frontend-errors-and-issues-7d93`
- Estado: ✅ Producción

**0 Proyectos Viejos:**
- Todos eliminados
- Sin confusión
- Sin duplicados

**Deploy Automático:**
- Cada push a la branch → auto-deploy
- Sin intervención manual
- URL siempre actualizada

---

## 📞 URLs Finales

Después de completar, tu proyecto estará en:

```
🌐 Principal: https://son1kvers3-official.vercel.app/
🎵 Clásico:  https://son1kvers3-official.vercel.app/classic
🌆 Nexus:    https://son1kvers3-official.vercel.app/nexus
```

**¡Listo para Beta!** 🚀

---

**Fecha:** 2025-10-02  
**Versión:** 2.0.0  
**Estado:** ✅ Ready for Production
