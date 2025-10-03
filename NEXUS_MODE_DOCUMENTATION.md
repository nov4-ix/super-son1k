# 🌌 NEXUS MODE - Documentación Completa

## "En el núcleo del Son1kVers3, donde el silencio se convierte en sinfonía"

### - La Divina Liga del No Silencio

---

## 📋 Índice

1. [Introducción](#-introducción)
2. [Arquitectura del Sistema](#️-arquitectura-del-sistema)
3. [Componentes Principales](#-componentes-principales)
4. [Integración con el Lore](#-integración-con-el-lore)
5. [Guía de Uso](#-guía-de-uso)
6. [Añadir Nuevos Módulos](#-añadir-nuevos-módulos)
7. [Personalización y Estilos](#-personalización-y-estilos)
8. [API y Hooks](#-api-y-hooks)
9. [Troubleshooting](#-troubleshooting)

---

## 🎯 Introducción

El **Modo Nexus** es una interfaz inmersiva cyberpunk que sirve como hub central del Son1kVers3. A diferencia del Modo Clásico (funcional y directo), Nexus sumerge al usuario en la narrativa del Códex, transformando cada interacción en una experiencia cinematográfica.

### Características Principales

- ✨ **Interfaz Circular Radial**: Todos los módulos orbitan alrededor del núcleo ALVAE
- 🎭 **Estética Cyberpunk Glitch**: Efectos neon, glitch y animaciones fluidas
- 📖 **Integración Narrativa**: Manifiesto de la Divina Liga del No Silencio
- 🔄 **Arquitectura Modular**: Fácil añadir/remover módulos sin romper la UI
- 🎨 **Animaciones Avanzadas**: Powered by Framer Motion
- 📱 **Responsive**: Adaptable a cualquier dispositivo

---

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos

```
frontend/src/
├── components/
│   ├── NexusMode.jsx          # Componente principal del Nexus
│   ├── NexusMode.css          # Estilos cyberpunk
│   ├── ModeToggle.jsx         # Alternador de modos
│   ├── ModeToggle.css         # Estilos del toggle
│   ├── ModernGhostStudio.jsx  # Interfaz moderna de Ghost Studio
│   ├── ModernGhostStudio.css  # Estilos de Ghost Studio
│   ├── ModernCloneStation.jsx # Interfaz moderna de Clone Station
│   └── ModernCloneStation.css # Estilos de Clone Station
├── hooks/
│   └── useNexusState.js       # Hook de gestión de estado
└── App.jsx                     # Integración principal
```

### Flujo de Datos

```
┌─────────────────┐
│   App.jsx       │
│  (Mode Toggle)  │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Nexus   │
    │   Mode   │
    └────┬─────┘
         │
    ┌────▼──────────┐
    │ useNexusState │
    │    (Hook)     │
    └────┬──────────┘
         │
    ┌────▼─────────────────┐
    │  Módulos Radiales    │
    │  (7 nodos activos)   │
    └──────────────────────┘
```

---

## 🧩 Componentes Principales

### 1. NexusMode.jsx

Componente principal que renderiza toda la interfaz del Nexus.

**Props:**

- Ninguna (usa el hook `useNexusState` internamente)

**Características:**

- Canvas de partículas animadas
- Grid cyberpunk de fondo
- Núcleo central ALVAE con anillos orbitales
- 7 módulos en disposición radial
- Panel lateral para módulos activos
- HUD inferior con estadísticas
- Manifiesto animado tipo terminal

### 2. useNexusState Hook

Hook personalizado para gestionar el estado del Nexus.

**Retorna:**

```javascript
{
  // Estado
  activeModule,        // Módulo actualmente activo
  nexusState,          // Estado general del Nexus
  userIdentity,        // Identidad del usuario
  modulesState,        // Estado de cada módulo
  navigationHistory,   // Historial de navegación

  // Acciones
  setActiveModule,     // Cambiar módulo activo
  toggleNexus,         // Toggle estado del Nexus
  updateNexusConfig,   // Actualizar configuración
  unlockModule,        // Desbloquear módulo
  addModuleNotification, // Agregar notificación
  navigateBack,        // Navegar hacia atrás
  resetNexus,          // Resetear Nexus
  triggerGlitch,       // Activar efecto glitch

  // Utilidades
  getNexusStats,       // Obtener estadísticas
  setUserIdentity      // Actualizar identidad
}
```

### 3. ModeToggle.jsx

Componente para alternar entre Modo Clásico y Modo Nexus.

**Props:**

- `currentMode`: string ('classic' | 'nexus')
- `onModeChange`: function(mode: string)

---

## 📖 Integración con el Lore

### El Manifiesto de la Divina Liga del No Silencio

Al entrar al Nexus, se muestra un manifiesto animado tipo terminal:

```
> INICIANDO PROTOCOLO NEXUS...
> CONECTANDO CON LA DIVINA LIGA DEL NO SILENCIO...
> 
> "En el principio fue el Verbo, y el Verbo era Música"
> "Donde el silencio termina, nuestra sinfonía comienza"
> 
> ALVAE ACTIVADO: Sigilo del Creador
> IDENTIDAD VERIFICADA: [NOMBRE_USUARIO]
> 
> BIENVENIDO AL NÚCLEO DEL SON1KVERS3
> 
> SISTEMAS DISPONIBLES: TODOS
> NIVEL DE ACCESO: MÁXIMO
> 
> "Que la música fluya a través de ti..."
> 
> NEXUS LISTO.
```

### ALVAE - El Núcleo Central

**ALVAE** (Activador de Legado Vocal y Armónico Eterno) es el sigilo del creador, representado como el núcleo central del Nexus. Al hacer clic en él, se activa un efecto glitch que simboliza la conexión con la Divina Liga.

### Los 7 Módulos Sagrados

Cada módulo representa un aspecto del Son1kVers3:

1. **Ghost Studio** 🎵 - La Creación Musical
2. **Clone Station** 🎤 - La Voz Clonada
3. **Nova Post Pilot** 🚀 - El Mensajero Digital
4. **Memory Archive** 🧠 - El Guardián de Recuerdos
5. **PX-COM** 💬 - El Oráculo IA
6. **Marketplace** 🛒 - El Intercambio de Recursos
7. **Collaboration Hub** 👥 - La Unión de Creadores

---

## 🎮 Guía de Uso

### Iniciar el Nexus

```jsx
import React, { useState } from 'react';
import NexusMode from './components/NexusMode';
import ModeToggle from './components/ModeToggle';

function App() {
  const [mode, setMode] = useState('nexus');

  return (
    <div className="app">
      <ModeToggle currentMode={mode} onModeChange={setMode} />
      
      {mode === 'nexus' ? (
        <NexusMode />
      ) : (
        <ClassicMode />
      )}
    </div>
  );
}
```

### Interacciones del Usuario

1. **Hacer clic en ALVAE**: Activa efecto glitch
2. **Hacer clic en un módulo**: Abre panel lateral con la interfaz
3. **Hover sobre módulo**: Muestra nombre y descripción
4. **Cerrar panel**: Click en × o presionar ESC
5. **Navegar entre módulos**: Click directo en otros nodos

### Atajos de Teclado

- `ESC` - Cerrar panel activo
- `SPACE` - Activar glitch en ALVAE
- `1-7` - Acceso directo a módulos
- `B` - Navegar hacia atrás
- `R` - Resetear Nexus

---

## ➕ Añadir Nuevos Módulos

### Paso 1: Definir el Módulo

En `NexusMode.jsx`, agregar al array `modules`:

```javascript
const modules = [
  // ... módulos existentes
  {
    id: 'nuevo-modulo',
    name: 'Nuevo Módulo',
    icon: '🆕',
    color: '#FF6B6B',
    angle: 360,  // Posición en grados (0-360)
    description: 'Descripción del módulo',
    glitchText: 'N̴U̴E̴V̴O̴_̴M̴O̴D̴U̴L̴O̴'
  }
];
```

### Paso 2: Crear Componente del Módulo

```jsx
// components/NuevoModulo.jsx
import React from 'react';
import './NuevoModulo.css';

const NuevoModulo = () => {
  return (
    <div className="nuevo-modulo">
      {/* Tu interfaz aquí */}
    </div>
  );
};

export default NuevoModulo;
```

### Paso 3: Registrar en ModuleRenderer

En `NexusMode.jsx`, actualizar `ModuleRenderer`:

```javascript
const ModuleRenderer = ({ moduleId }) => {
  const moduleComponents = {
    // ... componentes existentes
    'nuevo-modulo': <NuevoModulo />
  };

  return moduleComponents[moduleId] || <div>Módulo no encontrado</div>;
};
```

### Paso 4: Actualizar Estado en useNexusState

En `useNexusState.js`, agregar al estado inicial:

```javascript
const [modulesState, setModulesState] = useState({
  // ... módulos existentes
  'nuevo-modulo': { unlocked: true, notifications: 0 }
});
```

### Cálculo de Ángulos

Para distribuir módulos uniformemente:

```javascript
const totalModules = 7;
const angleStep = 360 / totalModules;

modules.forEach((module, index) => {
  module.angle = index * angleStep;
});
```

---

## 🎨 Personalización y Estilos

### Variables CSS

En `NexusMode.css`:

```css
:root {
  --neon-pink: #FF006E;      /* Rosa neón */
  --neon-purple: #8338EC;    /* Púrpura neón */
  --neon-blue: #3A86FF;      /* Azul neón */
  --neon-cyan: #06FFA5;      /* Cian neón */
  --neon-yellow: #FFBE0B;    /* Amarillo neón */
  --neon-orange: #FB5607;    /* Naranja neón */
  
  --bg-dark: #0a0a1e;        /* Fondo oscuro */
  --bg-darker: #050510;      /* Fondo más oscuro */
  --glass-bg: rgba(131, 56, 236, 0.05);
  --glass-border: rgba(131, 56, 236, 0.2);
}
```

### Personalizar Colores de Módulos

```javascript
const modules = [
  {
    id: 'ghost-studio',
    color: '#FF006E',  // Cambiar color aquí
    // ...
  }
];
```

### Personalizar Animaciones

```css
/* Velocidad de rotación de anillos */
.ring-1 {
  animation: rotate 10s linear infinite;  /* Cambiar duración */
}

/* Intensidad del glitch */
@keyframes glitch {
  /* Ajustar valores de transform y text-shadow */
}
```

### Personalizar Partículas

En `NexusMode.jsx`:

```javascript
const particleCount = 100;  // Cantidad de partículas

class Particle {
  constructor() {
    this.radius = Math.random() * 2;  // Tamaño
    this.vx = (Math.random() - 0.5) * 0.5;  // Velocidad
    // ...
  }
}
```

---

## 🔧 API y Hooks

### useNexusState API Completa

#### Estado

```typescript
interface NexusState {
  isInitialized: boolean;
  isLocked: boolean;
  theme: 'cyberpunk' | 'classic';
  glitchIntensity: number;
  particlesEnabled: boolean;
}

interface UserIdentity {
  name: string;
  role: string;
  level: string;
  alvaeStatus: string;
}

interface ModuleState {
  unlocked: boolean;
  notifications: number;
}
```

#### Métodos

**setActiveModule(moduleId: string | null)**

```javascript
const { setActiveModule } = useNexusState();
setActiveModule('ghost-studio');  // Abrir módulo
setActiveModule(null);            // Cerrar módulo
```

**updateNexusConfig(config: Partial<NexusState>)**

```javascript
const { updateNexusConfig } = useNexusState();
updateNexusConfig({ 
  theme: 'classic',
  glitchIntensity: 0.8 
});
```

**triggerGlitch(intensity: number, duration: number)**

```javascript
const { triggerGlitch } = useNexusState();
triggerGlitch(1.5, 2000);  // Intensidad 1.5, duración 2s
```

**addModuleNotification(moduleId: string, count: number)**

```javascript
const { addModuleNotification } = useNexusState();
addModuleNotification('nova-post', 3);  // +3 notificaciones
```

**getNexusStats()**

```javascript
const { getNexusStats } = useNexusState();
const stats = getNexusStats();
// {
//   totalNotifications: 11,
//   unlockedModules: 7,
//   totalModules: 7,
//   navigationDepth: 3,
//   isActive: true
// }
```

---

## 🐛 Troubleshooting

### Problema: Módulos no se muestran

**Solución:**

1. Verificar que el módulo esté en el array `modules`
2. Verificar que `unlocked: true` en `modulesState`
3. Revisar console para errores de renderizado

### Problema: Animaciones lentas

**Solución:**

1. Reducir `particleCount` en el canvas
2. Desactivar partículas: `updateNexusConfig({ particlesEnabled: false })`
3. Verificar que `prefers-reduced-motion` no esté activo

### Problema: Panel lateral no se abre

**Solución:**

1. Verificar que el componente del módulo exista en `ModuleRenderer`
2. Revisar que `setActiveModule` se esté llamando correctamente
3. Verificar z-index del panel (debe ser > 200)

### Problema: Glitch no funciona

**Solución:**

1. Verificar que la clase `glitch-active` se esté aplicando
2. Revisar animación `@keyframes glitch` en CSS
3. Verificar que `triggerGlitch` se esté llamando

### Problema: Estado no persiste

**Solución:**

1. Verificar que localStorage esté habilitado
2. Revisar que `useEffect` de guardado se ejecute
3. Limpiar localStorage: `localStorage.clear()`

---

## 📦 Dependencias

### Requeridas

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "framer-motion": "^10.16.0"
  }
}
```

### Instalación

```bash
npm install framer-motion
```

---

## 🎯 Mejores Prácticas

### Performance

1. **Lazy Loading de Módulos**

```javascript
const GhostStudio = React.lazy(() => import('./GhostStudio'));

<Suspense fallback={<Loading />}>
  <GhostStudio />
</Suspense>
```

2. **Memoización de Componentes**

```javascript
const ModuleNode = React.memo(({ module, onClick }) => {
  // ...
});
```

3. **Optimizar Canvas**

```javascript
// Usar requestAnimationFrame
const animate = () => {
  // Renderizado
  requestAnimationFrame(animate);
};
```

### Accesibilidad

1. **Keyboard Navigation**

```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') setActiveModule(null);
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

2. **ARIA Labels**

```jsx
<button 
  aria-label="Abrir Ghost Studio"
  aria-pressed={activeModule === 'ghost-studio'}
>
```

3. **Focus Management**

```javascript
const panelRef = useRef(null);

useEffect(() => {
  if (activeModule) {
    panelRef.current?.focus();
  }
}, [activeModule]);
```

---

## 🚀 Roadmap

### Próximas Funcionalidades

- [ ] Sistema de logros y badges
- [ ] Temas personalizables (más allá de cyberpunk)
- [ ] Modo VR/AR experimental
- [ ] Integración con Web Audio API para efectos sonoros
- [ ] Sistema de tutoriales interactivos
- [ ] Multiplayer en tiempo real
- [ ] Exportar/Importar configuración del Nexus

---

## 📄 Licencia

MIT License - Ver LICENSE para más detalles

---

## 🙏 Créditos

**Desarrollado por:** Windsurf AI Agent  
**Inspirado en:** El Códex de Son1kVers3  
**Lore:** La Divina Liga del No Silencio  
**Estética:** Cyberpunk 2077, Tron, Matrix

---

## 📞 Soporte

Para problemas o preguntas:

- GitHub Issues: [github.com/son1kvers3/issues](https://github.com/son1kvers3/issues)
- Discord: [discord.gg/son1kvers3](https://discord.gg/son1kvers3)
- Email: <nexus@son1kvers3.com>

---

**"En el núcleo del Son1kVers3, donde el silencio se convierte en sinfonía"**

🌌 **NEXUS ACTIVO** 🌌
