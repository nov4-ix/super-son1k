/**
 * 🌌 Nexus Portal - Portal Central del Códex
 * Experiencia inmersiva exacta basada en las imágenes proporcionadas
 * Círculo luminoso que se abre en pétalos digitales
 */

import React, { useState, useEffect, useRef } from 'react';
import './NexusPortal.css';
import GhostStudio from './GhostStudio';
import TheCreator from './TheCreator';
import CodexViewer from './CodexViewer';
import CommunityHub from './CommunityHub';
import CloneStation from './CloneStation';
import CyberpunkTerminal from './CyberpunkTerminal';

const NexusPortal = () => {
  const [portalState, setPortalState] = useState('lobby'); // 'lobby', 'opening', 'expanded', 'immersed'
  const [selectedSection, setSelectedSection] = useState(null);
  const [glitchTexts, setGlitchTexts] = useState(['ALVAE', 'Resistencia', 'Son1kVers3']);
  const [circleEnergy, setCircleEnergy] = useState(0);
  const [userTotem, setUserTotem] = useState({
    symbols: ['👁️'],
    colors: ['#00FFE7'],
    vibration: 'neutral',
    level: 1
  });
  const [showTerminal, setShowTerminal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);

  // Secciones del portal (pétalos) - exacto como en las imágenes
  const portalSections = [
    {
      id: 'ghost_studio',
      name: 'GHOST STUDIO',
      icon: '◇',
      position: { x: -200, y: -100 },
      color: '#00FFE7',
      description: 'Herramienta central de análisis y transformación',
      component: GhostStudio
    },
    {
      id: 'clone_station',
      name: 'CLONE STATION', 
      icon: '○',
      position: { x: 200, y: -100 },
      color: '#ff6b6b',
      description: 'Clonación de voz con so-VITS y Bark',
      component: CloneStation
    },
    {
      id: 'codex',
      name: 'CODEX',
      icon: '👤',
      position: { x: 200, y: 100 },
      color: '#8b5cf6',
      description: 'Historia interactiva del universo',
      component: CodexViewer
    },
    {
      id: 'la_liga',
      name: 'LA LIGA',
      icon: '📖',
      position: { x: -200, y: 100 },
      color: '#FFC107',
      description: 'Comunidad de la Divina Liga del No Silencio',
      component: CommunityHub
    }
  ];

  // Inicializar efectos
  useEffect(() => {
    initializePortalEffects();
    startGlitchAnimation();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializePortalEffects = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Partículas de fondo
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#00FFE7' : '#8b5cf6'
      });
    }

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
  };

  const startGlitchAnimation = () => {
    setInterval(() => {
      setGlitchTexts(prev => {
        const newTexts = [...prev];
        const randomIndex = Math.floor(Math.random() * newTexts.length);
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const originalText = ['ALVAE', 'Resistencia', 'Son1kVers3'][randomIndex];
        
        // Glitch temporal
        newTexts[randomIndex] = originalText.split('').map(char => 
          Math.random() > 0.8 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('');
        
        // Restaurar después de 200ms
        setTimeout(() => {
          setGlitchTexts(current => {
            const restored = [...current];
            restored[randomIndex] = originalText;
            return restored;
          });
        }, 200);
        
        return newTexts;
      });
    }, 3000);
  };

  // Manejar click en el círculo central
  const handleCircleClick = () => {
    if (portalState === 'lobby') {
      setPortalState('opening');
      setCircleEnergy(100);
      
      // Sonido de activación
      playPortalSound();
      
      setTimeout(() => {
        setPortalState('expanded');
      }, 1500);
    }
  };

  const playPortalSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.warn('Audio context no disponible:', error);
    }
  };

  // Manejar selección de sección
  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setPortalState('immersed');
    
    // Actualizar totem del usuario
    updateUserTotem(section);
    
    // Efecto de transición
    createSectionTransition(section.color);
  };

  const updateUserTotem = (section) => {
    setUserTotem(prev => ({
      symbols: [...new Set([...prev.symbols, section.icon])],
      colors: [...new Set([...prev.colors, section.color])],
      vibration: section.id.includes('ghost') ? 'haunted' :
                 section.id.includes('clone') ? 'vocal' :
                 section.id.includes('codex') ? 'wise' :
                 section.id.includes('liga') ? 'warrior' : 'creative',
      level: Math.min(prev.level + 1, 5)
    }));
  };

  const createSectionTransition = (color) => {
    const transition = document.createElement('div');
    transition.className = 'section-transition-effect';
    transition.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      background: ${color};
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: nexus-section-expand 1.2s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
    `;
    
    document.body.appendChild(transition);
    
    setTimeout(() => {
      document.body.removeChild(transition);
    }, 1200);
  };

  // Renderizar lobby
  const renderLobby = () => (
    <div className="nexus-lobby">
      {/* Textos glitch flotantes */}
      <div className="glitch-texts">
        {glitchTexts.map((text, index) => (
          <div
            key={index}
            className={`glitch-text glitch-${index}`}
            style={{
              left: `${[20, 70, 45][index]}%`,
              top: `${[25, 30, 70][index]}%`,
              color: ['#00FFE7', '#8b5cf6', '#ff6b6b'][index]
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Círculo central luminoso */}
      <div className="portal-center">
        <div 
          className={`central-circle ${portalState === 'opening' ? 'opening' : ''}`}
          onClick={handleCircleClick}
          style={{ '--energy-level': `${circleEnergy}%` }}
        >
          <div className="circle-core">
            <div className="energy-rings">
              <div className="energy-ring ring-1"></div>
              <div className="energy-ring ring-2"></div>
              <div className="energy-ring ring-3"></div>
            </div>
            <div className="circle-center">
              <div className="center-glow"></div>
            </div>
          </div>
        </div>
        
        {portalState === 'lobby' && (
          <div className="portal-instruction">
            <p>Toca el portal para acceder al Nexus</p>
            <div className="instruction-pulse">↑</div>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar estado expandido con pétalos
  const renderExpanded = () => (
    <div className="nexus-expanded">
      {/* Círculo central expandido */}
      <div className="expanded-center">
        <div className="nexus-title">NEXUS</div>
        <div className="nexus-subtitle">Portal del Códex</div>
      </div>

      {/* Pétalos/Secciones */}
      <div className="portal-petals">
        {portalSections.map((section, index) => (
          <div
            key={section.id}
            className="portal-petal"
            style={{
              left: `calc(50% + ${section.position.x}px)`,
              top: `calc(50% + ${section.position.y}px)`,
              borderColor: section.color,
              animationDelay: `${index * 0.2}s`
            }}
            onClick={() => handleSectionSelect(section)}
          >
            <div className="petal-content">
              <div className="petal-icon" style={{ color: section.color }}>
                {section.icon}
              </div>
              <div className="petal-name" style={{ color: section.color }}>
                {section.name}
              </div>
              <div className="petal-description">
                {section.description}
              </div>
            </div>
            <div className="petal-glow" style={{ backgroundColor: section.color }}></div>
          </div>
        ))}
      </div>

      {/* Instrucciones */}
      <div className="expanded-instructions">
        <p>Selecciona una sección para sumergirte en el universo</p>
      </div>
    </div>
  );

  // Renderizar estado inmersivo
  const renderImmersed = () => (
    <div className="nexus-immersed">
      <div className="immersed-header">
        <button 
          className="back-to-portal"
          onClick={() => setPortalState('expanded')}
        >
          ← Volver al Portal
        </button>
        
        <div className="section-title" style={{ color: selectedSection?.color }}>
          <span className="section-icon">{selectedSection?.icon}</span>
          <h2>{selectedSection?.name}</h2>
        </div>
        
        <div className="user-totem">
          <div className="totem-core" style={{ borderColor: userTotem.colors[0] }}>
            <div className="totem-symbols">
              {userTotem.symbols.slice(0, 3).map((symbol, index) => (
                <span
                  key={index}
                  className="totem-symbol"
                  style={{ color: userTotem.colors[index % userTotem.colors.length] }}
                >
                  {symbol}
                </span>
              ))}
            </div>
            <div className="totem-level">Nivel {userTotem.level}</div>
          </div>
        </div>
      </div>

      <div className="immersed-content">
        {selectedSection && React.createElement(selectedSection.component, { services: {} })}
      </div>
    </div>
  );

  // Renderizar mapa inmersivo
  const renderImmersiveMap = () => (
    <div className="immersive-map-overlay">
      <div className="map-container">
        <div className="map-header">
          <h2>🌌 Mapa del Universo Son1kVers3</h2>
          <button onClick={() => setShowMap(false)}>✕</button>
        </div>
        
        <div className="galaxy-map">
          {/* Nodos de locaciones */}
          {[
            { name: 'La Terminal', x: 20, y: 30, color: '#00FFE7', size: 'large' },
            { name: 'Ghost Studio', x: 70, y: 25, color: '#ff6b6b', size: 'medium' },
            { name: 'El Archivo', x: 75, y: 70, color: '#8b5cf6', size: 'medium' },
            { name: 'Dead Zone', x: 25, y: 75, color: '#666666', size: 'small' },
            { name: 'Estudio Fantasma', x: 50, y: 50, color: '#10b981', size: 'large' }
          ].map((location, index) => (
            <div
              key={location.name}
              className={`map-node ${location.size}`}
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                borderColor: location.color,
                animationDelay: `${index * 0.3}s`
              }}
            >
              <div className="node-pulse" style={{ borderColor: location.color }}></div>
              <div className="node-core" style={{ backgroundColor: location.color }}></div>
              <div className="node-label" style={{ color: location.color }}>
                {location.name}
              </div>
            </div>
          ))}
          
          {/* Conexiones entre nodos */}
          <svg className="connection-lines">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00FFE7" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            <path
              d="M 20% 30% Q 35% 15% 50% 50%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="connection-path"
            />
            <path
              d="M 50% 50% Q 65% 35% 70% 25%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="connection-path"
            />
            <path
              d="M 70% 25% Q 85% 50% 75% 70%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="connection-path"
            />
            <path
              d="M 75% 70% Q 50% 85% 25% 75%"
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="connection-path"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`nexus-portal ${portalState}`}>
      {/* Canvas de fondo */}
      <canvas
        ref={canvasRef}
        className="nexus-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Header minimalista */}
      <header className="nexus-header">
        <div className="header-left">
          <span className="nexus-brand">NEXUS</span>
          <span className="nexus-tagline">Portal del Códex</span>
        </div>
        
        <div className="header-controls">
          <button 
            className="control-orb"
            onClick={() => setShowTerminal(!showTerminal)}
            title="Terminal Cyberpunk"
          >
            💻
          </button>
          <button 
            className="control-orb"
            onClick={() => setShowMap(!showMap)}
            title="Mapa Inmersivo"
          >
            🌌
          </button>
          <button 
            className="control-orb"
            onClick={() => setUserTotem(prev => ({ ...prev, level: Math.min(prev.level + 1, 5) }))}
            title="Aumentar Inmersión"
          >
            🚀
          </button>
        </div>
      </header>

      {/* Contenido principal según estado */}
      <main className="nexus-main">
        {portalState === 'lobby' && renderLobby()}
        {portalState === 'expanded' && renderExpanded()}
        {portalState === 'immersed' && renderImmersed()}
      </main>

      {/* Terminal Cyberpunk */}
      {showTerminal && (
        <CyberpunkTerminal 
          isVisible={showTerminal}
          onClose={() => setShowTerminal(false)}
        />
      )}

      {/* Mapa Inmersivo */}
      {showMap && renderImmersiveMap()}

      {/* Footer */}
      <footer className="nexus-footer">
        <span>Son1kVers3 • Nexus Portal • "Lo imperfecto también es sagrado"</span>
      </footer>

      {/* Estilos dinámicos */}
      <style jsx>{`
        @keyframes nexus-section-expand {
          0% {
            width: 20px;
            height: 20px;
            opacity: 1;
          }
          100% {
            width: 100vw;
            height: 100vh;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default NexusPortal;
