# 🌌 NEXUS MODE - Quick Start Guide

## "Donde el silencio se convierte en sinfonía"

---

## 🚀 Instalación Rápida

### 1. Instalar Dependencias

```bash
cd frontend
npm install framer-motion
```

### 2. Importar Componentes

En tu `App.jsx` o punto de entrada:

```jsx
import AppModeManager from './AppModeManager';

function App() {
  return <AppModeManager />;
}

export default App;
```

### 3. Ejecutar la Aplicación

```bash
npm start
```

---

## 🎯 Uso Básico

### Alternar entre Modos

El toggle en la esquina superior derecha permite cambiar entre:

- **Modo Clásico** 🎯 - Interfaz tradicional y funcional
- **Modo Nexus** 🌌 - Experiencia inmersiva cyberpunk

### Navegación en Nexus

1. **Click en ALVAE** (centro) → Activa efecto glitch
2. **Click en módulo** → Abre panel lateral
3. **Hover sobre módulo** → Muestra información
4. **Click en ×** → Cierra panel

---

## ➕ Añadir un Nuevo Módulo (3 pasos)

### Paso 1: Definir en `NexusMode.jsx`

```javascript
const modules = [
  // ... módulos existentes
  {
    id: 'mi-modulo',
    name: 'Mi Módulo',
    icon: '🆕',
    color: '#FF6B6B',
    angle: 360,  // 0-360 grados
    description: 'Mi descripción',
    glitchText: 'M̴I̴_̴M̴O̴D̴U̴L̴O̴'
  }
];
```

### Paso 2: Crear Componente

```jsx
// components/MiModulo.jsx
import React from 'react';

const MiModulo = () => {
  return (
    <div className="mi-modulo">
      <h2>Mi Módulo</h2>
      {/* Tu interfaz aquí */}
    </div>
  );
};

export default MiModulo;
```

### Paso 3: Registrar en `ModuleRenderer`

```javascript
const ModuleRenderer = ({ moduleId }) => {
  const moduleComponents = {
    // ... existentes
    'mi-modulo': <MiModulo />
  };

  return moduleComponents[moduleId] || <div>No encontrado</div>;
};
```

---

## 🎨 Personalización Rápida

### Cambiar Colores

En `NexusMode.css`:

```css
:root {
  --neon-pink: #FF006E;      /* Tu color */
  --neon-purple: #8338EC;    /* Tu color */
  --neon-blue: #3A86FF;      /* Tu color */
}
```

### Cambiar Velocidad de Animaciones

```css
.ring-1 {
  animation: rotate 10s linear infinite;  /* Cambiar 10s */
}
```

### Desactivar Partículas

```javascript
const { updateNexusConfig } = useNexusState();
updateNexusConfig({ particlesEnabled: false });
```

---

## 🔧 Configuración del Hook

### Uso Básico

```javascript
import useNexusState from '../hooks/useNexusState';

function MiComponente() {
  const {
    activeModule,
    setActiveModule,
    userIdentity,
    triggerGlitch
  } = useNexusState();

  return (
    <button onClick={() => setActiveModule('ghost-studio')}>
      Abrir Ghost Studio
    </button>
  );
}
```

### Actualizar Identidad del Usuario

```javascript
const { setUserIdentity } = useNexusState();

setUserIdentity({
  name: 'MAESTRO',
  role: 'Creador Supremo',
  level: 'DIVINO',
  alvaeStatus: 'ACTIVO'
});
```

### Agregar Notificaciones

```javascript
const { addModuleNotification } = useNexusState();

addModuleNotification('nova-post', 5);  // +5 notificaciones
```

---

## 📊 Obtener Estadísticas

```javascript
const { getNexusStats } = useNexusState();

const stats = getNexusStats();
console.log(stats);
// {
//   totalNotifications: 11,
//   unlockedModules: 7,
//   totalModules: 7,
//   navigationDepth: 3,
//   isActive: true
// }
```

---

## 🎮 Atajos de Teclado (Próximamente)

Puedes implementar atajos personalizados:

```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    switch(e.key) {
      case 'Escape':
        setActiveModule(null);
        break;
      case '1':
        setActiveModule('ghost-studio');
        break;
      case '2':
        setActiveModule('clone-station');
        break;
      // ... más atajos
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 🐛 Solución Rápida de Problemas

### Módulos no aparecen
```javascript
// Verificar que esté desbloqueado
const { unlockModule } = useNexusState();
unlockModule('mi-modulo');
```

### Animaciones lentas
```javascript
// Reducir partículas
const particleCount = 50;  // En lugar de 100
```

### Panel no se abre
```javascript
// Verificar que el componente existe
const moduleComponents = {
  'mi-modulo': <MiModulo />  // ← Debe estar aquí
};
```

---

## 📦 Estructura de Archivos Mínima

```
frontend/src/
├── components/
│   ├── NexusMode.jsx          ← Componente principal
│   ├── NexusMode.css          ← Estilos
│   ├── ModeToggle.jsx         ← Toggle de modos
│   └── ModeToggle.css         ← Estilos del toggle
├── hooks/
│   └── useNexusState.js       ← Hook de estado
├── AppModeManager.jsx         ← Gestor de modos
├── AppModeManager.css         ← Estilos del gestor
└── App.jsx                    ← Punto de entrada
```

---

## 🎨 Ejemplos de Uso

### Ejemplo 1: Módulo Simple

```jsx
const MiModulo = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🎵 Mi Módulo Musical</h2>
      <p>Contenido de mi módulo</p>
      <button>Acción Principal</button>
    </div>
  );
};
```

### Ejemplo 2: Módulo con Estado

```jsx
const MiModulo = () => {
  const [data, setData] = useState(null);
  const { triggerGlitch } = useNexusState();

  const handleAction = () => {
    triggerGlitch(1.5, 1000);
    // Tu lógica aquí
  };

  return (
    <div>
      <h2>Mi Módulo</h2>
      <button onClick={handleAction}>Activar Glitch</button>
    </div>
  );
};
```

### Ejemplo 3: Módulo con API

```jsx
const MiModulo = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('/api/tracks')
      .then(res => res.json())
      .then(data => setTracks(data));
  }, []);

  return (
    <div>
      <h2>Mis Tracks</h2>
      {tracks.map(track => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  );
};
```

---

## 🎯 Checklist de Implementación

- [ ] Instalar `framer-motion`
- [ ] Copiar archivos del Nexus a `src/components/`
- [ ] Copiar `useNexusState.js` a `src/hooks/`
- [ ] Copiar `AppModeManager.jsx` a `src/`
- [ ] Actualizar `App.jsx` para usar `AppModeManager`
- [ ] Probar alternancia entre modos
- [ ] Verificar que todos los módulos se muestran
- [ ] Personalizar colores y estilos
- [ ] Agregar tus propios módulos

---

## 📚 Recursos Adicionales

- **Documentación Completa**: `NEXUS_MODE_DOCUMENTATION.md`
- **Framer Motion Docs**: https://www.framer.com/motion/
- **React Hooks**: https://react.dev/reference/react

---

## 🆘 Ayuda Rápida

### Resetear Nexus Completamente

```javascript
localStorage.clear();
window.location.reload();
```

### Ver Estado Actual

```javascript
console.log(localStorage.getItem('nexus_state'));
console.log(localStorage.getItem('nexus_user'));
```

### Forzar Modo Específico

```javascript
localStorage.setItem('app_mode', 'nexus');  // o 'classic'
window.location.reload();
```

---

## 🎉 ¡Listo!

Tu Modo Nexus está configurado. Ahora puedes:

1. ✨ Explorar la interfaz inmersiva
2. 🎨 Personalizar colores y animaciones
3. ➕ Agregar tus propios módulos
4. 🚀 Integrar con tu backend

**"Que la música fluya a través de ti..."**

🌌 **NEXUS ACTIVO** 🌌
