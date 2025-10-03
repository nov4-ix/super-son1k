import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useNexusState from '../hooks/useNexusState';
import './NexusModeMobile.css';

/**
 * 🌌 NEXUS MODE MOBILE
 * Versión optimizada para móviles y tablets
 */

const NexusModeMobile = () => {
  const {
    activeModule,
    setActiveModule,
    userIdentity,
    modulesState
  } = useNexusState();

  const [showManifesto, setShowManifesto] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  const manifesto = [
    '> NEXUS MOBILE',
    '> INICIANDO...',
    '> ',
    '> ALVAE ACTIVO',
    '> USUARIO: ' + (userIdentity?.name || 'OPERADOR'),
    '> ',
    '> SISTEMAS: ONLINE',
    '> ',
    '> NEXUS LISTO.'
  ];

  const modules = [
    {
      id: 'ghost-studio',
      name: 'Ghost Studio',
      icon: '🎵',
      color: '#FF006E',
      description: 'Producción Musical'
    },
    {
      id: 'clone-station',
      name: 'Clone Station',
      icon: '🎤',
      color: '#8338EC',
      description: 'Clonación Vocal'
    },
    {
      id: 'nova-post',
      name: 'Nova Post',
      icon: '🚀',
      color: '#3A86FF',
      description: 'Marketing Digital'
    },
    {
      id: 'memory-archive',
      name: 'Memory',
      icon: '🧠',
      color: '#FB5607',
      description: 'Archivo'
    },
    {
      id: 'px-com',
      name: 'Pixel',
      icon: '💬',
      color: '#FFBE0B',
      description: 'Asistente IA'
    },
    {
      id: 'marketplace',
      name: 'Market',
      icon: '🛒',
      color: '#06FFA5',
      description: 'Tienda'
    }
  ];

  useEffect(() => {
    if (!showManifesto) return;

    let currentLine = 0;
    let text = '';

    const typeInterval = setInterval(() => {
      if (currentLine >= manifesto.length) {
        clearInterval(typeInterval);
        setTimeout(() => setShowManifesto(false), 1500);
        return;
      }

      text += manifesto[currentLine] + '\n';
      setTerminalText(text);
      currentLine++;
    }, 150);

    return () => clearInterval(typeInterval);
  }, [showManifesto]);

  return (
    <div className="nexus-mobile">
      {/* Manifiesto */}
      <AnimatePresence>
        {showManifesto && (
          <motion.div
            className="mobile-manifesto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mobile-terminal">
              <pre>{terminalText}</pre>
              <div className="terminal-cursor">_</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mobile-header">
        <div className="header-left">
          <div className="alvae-icon">🌌</div>
          <div className="header-info">
            <h1>NEXUS</h1>
            <p>{userIdentity?.name || 'OPERADOR'}</p>
          </div>
        </div>
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Módulos Grid */}
      <div className="modules-grid">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            className="module-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveModule(module.id)}
            style={{ borderColor: module.color }}
          >
            <div className="module-icon" style={{ background: module.color }}>
              <span>{module.icon}</span>
            </div>
            <div className="module-info">
              <h3>{module.name}</h3>
              <p>{module.description}</p>
            </div>
            {modulesState[module.id]?.notifications > 0 && (
              <div className="module-badge">
                {modulesState[module.id].notifications}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Panel del Módulo */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            className="module-panel-mobile"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="panel-header-mobile">
              <div className="panel-title">
                <span className="panel-icon">
                  {modules.find(m => m.id === activeModule)?.icon}
                </span>
                <h2>{modules.find(m => m.id === activeModule)?.name}</h2>
              </div>
              <button 
                className="panel-close"
                onClick={() => setActiveModule(null)}
              >
                ✕
              </button>
            </div>
            <div className="panel-content-mobile">
              <ModuleRenderer moduleId={activeModule} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Lateral */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="side-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="menu-header">
              <h3>NEXUS MENU</h3>
              <button onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            <div className="menu-content">
              <div className="menu-section">
                <h4>Usuario</h4>
                <p className="user-info">
                  <span className="info-label">Nombre:</span>
                  <span className="info-value">{userIdentity?.name}</span>
                </p>
                <p className="user-info">
                  <span className="info-label">Rol:</span>
                  <span className="info-value">{userIdentity?.role}</span>
                </p>
                <p className="user-info">
                  <span className="info-label">Nivel:</span>
                  <span className="info-value">{userIdentity?.level}</span>
                </p>
              </div>

              <div className="menu-section">
                <h4>Configuración</h4>
                <button className="menu-btn">⚙️ Ajustes</button>
                <button className="menu-btn">🎨 Temas</button>
                <button className="menu-btn">📊 Estadísticas</button>
              </div>

              <div className="menu-section">
                <h4>Ayuda</h4>
                <button className="menu-btn">📖 Guía</button>
                <button className="menu-btn">💬 Soporte</button>
                <button className="menu-btn">ℹ️ Acerca de</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn active">
          <span>🏠</span>
          <span>Inicio</span>
        </button>
        <button className="nav-btn">
          <span>🎵</span>
          <span>Crear</span>
        </button>
        <button className="nav-btn">
          <span>📚</span>
          <span>Biblioteca</span>
        </button>
        <button className="nav-btn" onClick={() => setMenuOpen(true)}>
          <span>👤</span>
          <span>Perfil</span>
        </button>
      </div>
    </div>
  );
};

const ModuleRenderer = ({ moduleId }) => {
  const moduleComponents = {
    'ghost-studio': (
      <div className="module-placeholder">
        <div className="placeholder-icon">🎵</div>
        <h3>Ghost Studio</h3>
        <p>Interfaz de producción musical optimizada para móvil</p>
        <button className="action-btn">Crear Track</button>
      </div>
    ),
    'clone-station': (
      <div className="module-placeholder">
        <div className="placeholder-icon">🎤</div>
        <h3>Clone Station</h3>
        <p>Clonación de voz en tu dispositivo</p>
        <button className="action-btn">Clonar Voz</button>
      </div>
    ),
    'nova-post': (
      <div className="module-placeholder">
        <div className="placeholder-icon">🚀</div>
        <h3>Nova Post Pilot</h3>
        <p>Marketing digital desde tu móvil</p>
        <button className="action-btn">Crear Post</button>
      </div>
    ),
    'memory-archive': (
      <div className="module-placeholder">
        <div className="placeholder-icon">🧠</div>
        <h3>Memory Archive</h3>
        <p>Tus proyectos guardados</p>
        <button className="action-btn">Ver Proyectos</button>
      </div>
    ),
    'px-com': (
      <div className="module-placeholder">
        <div className="placeholder-icon">💬</div>
        <h3>Pixel Assistant</h3>
        <p>Tu asistente IA personal</p>
        <button className="action-btn">Chatear</button>
      </div>
    ),
    'marketplace': (
      <div className="module-placeholder">
        <div className="placeholder-icon">🛒</div>
        <h3>Marketplace</h3>
        <p>Tienda de recursos</p>
        <button className="action-btn">Explorar</button>
      </div>
    )
  };

  return moduleComponents[moduleId] || <div>Módulo no encontrado</div>;
};

export default NexusModeMobile;
