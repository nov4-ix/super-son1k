import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NexusResponsive from './components/NexusResponsive';
import ModeToggle from './components/ModeToggle';
import './AppModeManager.css';

/**
 * 🎯 App Mode Manager
 * Gestor principal que alterna entre Modo Clásico y Modo Nexus
 * 
 * 🔐 EASTER EGG: Ctrl+Alt+H para activar Modo Nexus
 */

const AppModeManager = () => {
  const [currentMode, setCurrentMode] = useState('classic');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNexusUnlock, setShowNexusUnlock] = useState(false);
  const [nexusUnlocked, setNexusUnlocked] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  // Cargar modo guardado y estado de desbloqueo
  useEffect(() => {
    const savedMode = localStorage.getItem('app_mode');
    const nexusUnlockedStatus = localStorage.getItem('nexus_unlocked');
    
    if (nexusUnlockedStatus === 'true') {
      setNexusUnlocked(true);
    }
    
    if (savedMode && nexusUnlockedStatus === 'true') {
      setCurrentMode(savedMode);
    }
  }, []);

  // Guardar modo cuando cambia
  useEffect(() => {
    localStorage.setItem('app_mode', currentMode);
  }, [currentMode]);

  // Función para desbloquear Nexus
  const unlockNexus = () => {
    if (!nexusUnlocked) {
      setShowNexusUnlock(true);
      setNexusUnlocked(true);
      localStorage.setItem('nexus_unlocked', 'true');
      
      // Auto-cambiar a Nexus después de la animación
      setTimeout(() => {
        handleModeChange('nexus');
      }, 3000);
    } else {
      // Si ya está desbloqueado, solo cambiar de modo
      handleModeChange('nexus');
    }
  };

  // 🔐 EASTER EGG: Detectar Ctrl+Alt+H
  useEffect(() => {
    const handleKeyCombo = (e) => {
      // Ctrl+Alt+H (o Cmd+Alt+H en Mac)
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        unlockNexus();
      }
    };

    window.addEventListener('keydown', handleKeyCombo);
    return () => window.removeEventListener('keydown', handleKeyCombo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nexusUnlocked]);

  // 🔐 EASTER EGG: Botón secreto en el footer (7 clicks)
  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);

    if (newCount >= 7) {
      unlockNexus();
      setSecretClickCount(0);
    }

    // Reset counter después de 3 segundos de inactividad
    setTimeout(() => {
      setSecretClickCount(0);
    }, 3000);
  };

  const handleModeChange = (newMode) => {
    if (newMode === currentMode) return;

    setIsTransitioning(true);
    
    // Delay para animación de transición
    setTimeout(() => {
      setCurrentMode(newMode);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="app-mode-manager">
      {/* Toggle de modo (solo visible si Nexus está desbloqueado) */}
      {nexusUnlocked && (
        <ModeToggle 
          currentMode={currentMode} 
          onModeChange={handleModeChange} 
        />
      )}

      {/* 🔐 ANIMACIÓN DE DESBLOQUEO DEL NEXUS */}
      <AnimatePresence>
        {showNexusUnlock && (
          <motion.div
            className="nexus-unlock-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setTimeout(() => setShowNexusUnlock(false), 3000);
            }}
          >
            <div className="unlock-content">
              <motion.div
                className="unlock-circle"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="unlock-ring"></div>
                <div className="unlock-ring"></div>
                <div className="unlock-ring"></div>
              </motion.div>

              <motion.div
                className="unlock-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="unlock-title glitch" data-text="NEXUS DESBLOQUEADO">
                  NEXUS DESBLOQUEADO
                </h1>
                <p className="unlock-subtitle">
                  "Donde el silencio se convierte en sinfonía"
                </p>
                <p className="unlock-message">
                  Has descubierto el núcleo del Son1kVers3
                </p>
              </motion.div>

              <motion.div
                className="unlock-particles"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="unlock-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de transición */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="transition-content">
              <div className="transition-spinner"></div>
              <p className="transition-text">
                {currentMode === 'classic' 
                  ? 'Entrando al Nexus...' 
                  : 'Volviendo al Modo Clásico...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Renderizado condicional de modos */}
      <AnimatePresence mode="wait">
        {currentMode === 'nexus' ? (
          <motion.div
            key="nexus"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <NexusResponsive />
          </motion.div>
        ) : (
          <motion.div
            key="classic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ClassicMode />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 🎯 Classic Mode Component
 * Interfaz clásica funcional para usuarios que prefieren simplicidad
 */
const ClassicMode = () => {
  const [activeTab, setActiveTab] = useState('ghost-studio');

  const tabs = [
    { id: 'ghost-studio', name: 'Ghost Studio', icon: '🎵' },
    { id: 'clone-station', name: 'Clone Station', icon: '🎤' },
    { id: 'nova-post', name: 'Nova Post', icon: '🚀' },
    { id: 'marketplace', name: 'Marketplace', icon: '🛒' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="classic-mode">
      {/* Header clásico */}
      <header className="classic-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">Son1kVers3</span>
          </div>
        </div>

        <nav className="classic-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="header-right">
          <button className="header-btn">
            <span>🔔</span>
          </button>
          <button className="header-btn">
            <span>👤</span>
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="classic-content">
        <div className="content-container">
          {activeTab === 'ghost-studio' && (
            <div className="module-view">
              <h1>🎵 Ghost Studio</h1>
              <p>Interfaz clásica de producción musical</p>
              {/* Aquí iría el componente ModernGhostStudio o versión clásica */}
            </div>
          )}

          {activeTab === 'clone-station' && (
            <div className="module-view">
              <h1>🎤 Clone Station</h1>
              <p>Interfaz clásica de clonación vocal</p>
              {/* Aquí iría el componente ModernCloneStation o versión clásica */}
            </div>
          )}

          {activeTab === 'nova-post' && (
            <div className="module-view">
              <h1>🚀 Nova Post Pilot</h1>
              <p>Interfaz clásica de marketing digital</p>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="module-view">
              <h1>🛒 Marketplace</h1>
              <p>Tienda de recursos y modelos</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="module-view">
              <h1>⚙️ Settings</h1>
              <p>Configuración de la aplicación</p>
            </div>
          )}
        </div>
      </main>

      {/* 🔐 FOOTER CON BOTÓN SECRETO */}
      <footer className="classic-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-text">© 2025 Son1kVers3 - La Divina Liga del No Silencio</span>
          </div>
          
          <div className="footer-center">
            {/* 🔐 EASTER EGG: Botón secreto (7 clicks) */}
            <button 
              className={`secret-button ${secretClickCount > 0 ? 'pulsing' : ''}`}
              onClick={handleSecretClick}
              title={secretClickCount > 0 ? `${secretClickCount}/7` : ''}
            >
              <span className="secret-icon">🌌</span>
            </button>
          </div>

          <div className="footer-right">
            <span className="footer-hint">
              {!nexusUnlocked && secretClickCount > 0 && (
                <span className="hint-text fade-in">
                  {secretClickCount < 7 ? `${7 - secretClickCount} más...` : '¡Desbloqueado!'}
                </span>
              )}
              {!nexusUnlocked && secretClickCount === 0 && (
                <span className="hint-text-subtle">Presiona Ctrl+Alt+H</span>
              )}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppModeManager;
