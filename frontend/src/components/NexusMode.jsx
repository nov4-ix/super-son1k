import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useNexusState from '../hooks/useNexusState';
import './NexusMode.css';

/**
 * 🌌 NEXUS MODE - Hub Central Inmersivo
 * "En el núcleo del Son1kVers3, donde el silencio se convierte en sinfonía"
 * - La Divina Liga del No Silencio
 */

const NexusMode = () => {
  const {
    activeModule,
    setActiveModule,
    nexusState,
    toggleNexus,
    userIdentity
  } = useNexusState();

  const [showManifesto, setShowManifesto] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const canvasRef = useRef(null);

  // Manifiesto de la Divina Liga del No Silencio
  const manifesto = [
    '> INICIANDO PROTOCOLO NEXUS...',
    '> CONECTANDO CON LA DIVINA LIGA DEL NO SILENCIO...',
    '> ',
    '> "En el principio fue el Verbo, y el Verbo era Música"',
    '> "Donde el silencio termina, nuestra sinfonía comienza"',
    '> ',
    '> ALVAE ACTIVADO: Sigilo del Creador',
    '> IDENTIDAD VERIFICADA: ' + (userIdentity?.name || 'OPERADOR'),
    '> ',
    '> BIENVENIDO AL NÚCLEO DEL SON1KVERS3',
    '> ',
    '> SISTEMAS DISPONIBLES: TODOS',
    '> NIVEL DE ACCESO: MÁXIMO',
    '> ',
    '> "Que la música fluya a través de ti..."',
    '> ',
    '> NEXUS LISTO.'
  ];

  // Módulos del Nexus con posiciones radiales
  const modules = [
    {
      id: 'ghost-studio',
      name: 'Ghost Studio',
      icon: '🎵',
      color: '#FF006E',
      angle: 0,
      description: 'Producción Musical IA',
      glitchText: 'G̴H̴O̴S̴T̴_̴S̴T̴U̴D̴I̴O̴'
    },
    {
      id: 'clone-station',
      name: 'Clone Station',
      icon: '🎤',
      color: '#8338EC',
      angle: 51.43,
      description: 'Clonación Vocal',
      glitchText: 'C̷L̷O̷N̷E̷_̷S̷T̷A̷T̷I̷O̷N̷'
    },
    {
      id: 'nova-post',
      name: 'Nova Post Pilot',
      icon: '🚀',
      color: '#3A86FF',
      angle: 102.86,
      description: 'Marketing Digital IA',
      glitchText: 'N̸O̸V̸A̸_̸P̸O̸S̸T̸'
    },
    {
      id: 'memory-archive',
      name: 'Memory Archive',
      icon: '🧠',
      color: '#FB5607',
      angle: 154.29,
      description: 'Archivo de Proyectos',
      glitchText: 'M̶E̶M̶O̶R̶Y̶_̶A̶R̶C̶H̶I̶V̶E̶'
    },
    {
      id: 'px-com',
      name: 'PX-COM',
      icon: '💬',
      color: '#FFBE0B',
      angle: 205.71,
      description: 'Asistente IA Pixel',
      glitchText: 'P̴X̴-̴C̴O̴M̴'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      icon: '🛒',
      color: '#06FFA5',
      angle: 257.14,
      description: 'Tienda de Recursos',
      glitchText: 'M̷A̷R̷K̷E̷T̷P̷L̷A̷C̷E̷'
    },
    {
      id: 'collaboration',
      name: 'Collaboration Hub',
      icon: '👥',
      color: '#FF006E',
      angle: 308.57,
      description: 'Colaboración en Tiempo Real',
      glitchText: 'C̸O̸L̸L̸A̸B̸_̸H̸U̸B̸'
    }
  ];

  // Efecto de terminal animado
  useEffect(() => {
    if (!showManifesto) return;

    let currentLine = 0;
    let currentChar = 0;
    let text = '';

    const typeInterval = setInterval(() => {
      if (currentLine >= manifesto.length) {
        clearInterval(typeInterval);
        setTimeout(() => setShowManifesto(false), 2000);
        return;
      }

      const line = manifesto[currentLine];
      
      if (currentChar < line.length) {
        text += line[currentChar];
        setTerminalText(text);
        currentChar++;
      } else {
        text += '\n';
        setTerminalText(text);
        currentLine++;
        currentChar = 0;
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [showManifesto]);

  // Efecto de partículas en canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
        this.color = ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5'][Math.floor(Math.random() * 4)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Conectar partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(131, 56, 236, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Activar glitch en ALVAE
  const handleAlvaeClick = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 1000);
  };

  // Calcular posición radial
  const getModulePosition = (angle, radius = 280) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius
    };
  };

  return (
    <div className="nexus-mode">
      {/* Canvas de partículas */}
      <canvas ref={canvasRef} className="nexus-canvas" />

      {/* Overlay de grid cyberpunk */}
      <div className="cyber-grid" />

      {/* Manifiesto inicial */}
      <AnimatePresence>
        {showManifesto && (
          <motion.div
            className="manifesto-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">NEXUS PROTOCOL v3.0</span>
              </div>
              <pre className="terminal-content">{terminalText}</pre>
              <div className="terminal-cursor">_</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Núcleo central - ALVAE */}
      <motion.div
        className={`nexus-core ${glitchActive ? 'glitch-active' : ''}`}
        onClick={handleAlvaeClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="core-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
        </div>

        <motion.div
          className="core-center"
          animate={{
            boxShadow: [
              '0 0 20px #8338EC',
              '0 0 40px #FF006E',
              '0 0 60px #3A86FF',
              '0 0 40px #FF006E',
              '0 0 20px #8338EC'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="alvae-symbol">
            <span className="alvae-text">ALVAE</span>
            <div className="alvae-glow"></div>
          </div>
        </motion.div>

        <div className="core-label">
          <span className="user-name">{userIdentity?.name || 'OPERADOR'}</span>
          <span className="user-role">Sigilo Activador</span>
        </div>
      </motion.div>

      {/* Módulos radiales */}
      <div className="modules-container">
        {modules.map((module, index) => {
          const position = getModulePosition(module.angle);
          const isActive = activeModule === module.id;

          return (
            <motion.div
              key={module.id}
              className={`module-node ${isActive ? 'active' : ''}`}
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveModule(module.id)}
            >
              {/* Línea de conexión al núcleo */}
              <svg className="connection-line" width="300" height="300">
                <line
                  x1="150"
                  y1="150"
                  x2={150 - position.x}
                  y2={150 - position.y}
                  stroke={module.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animated-line"
                />
              </svg>

              {/* Nodo del módulo */}
              <div
                className="module-circle"
                style={{
                  borderColor: module.color,
                  boxShadow: `0 0 20px ${module.color}`
                }}
              >
                <span className="module-icon">{module.icon}</span>
                <div className="module-pulse" style={{ background: module.color }}></div>
              </div>

              {/* Etiqueta del módulo */}
              <div className="module-label">
                <span className="module-name">{module.name}</span>
                <span className="module-desc">{module.description}</span>
              </div>

              {/* Efecto glitch en hover */}
              <div className="module-glitch" data-text={module.glitchText}>
                {module.glitchText}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Panel lateral del módulo activo */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            className="module-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div className="panel-header">
              <h2>{modules.find(m => m.id === activeModule)?.name}</h2>
              <button className="close-panel" onClick={() => setActiveModule(null)}>
                ×
              </button>
            </div>

            <div className="panel-content">
              {/* Aquí se renderiza el componente del módulo */}
              <ModuleRenderer moduleId={activeModule} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD inferior */}
      <div className="nexus-hud">
        <div className="hud-section">
          <span className="hud-label">SISTEMA</span>
          <span className="hud-value status-online">ONLINE</span>
        </div>
        <div className="hud-section">
          <span className="hud-label">MÓDULOS</span>
          <span className="hud-value">{modules.length}/7</span>
        </div>
        <div className="hud-section">
          <span className="hud-label">CONEXIÓN</span>
          <span className="hud-value status-secure">SEGURA</span>
        </div>
        <div className="hud-section">
          <span className="hud-label">NIVEL</span>
          <span className="hud-value">MÁXIMO</span>
        </div>
      </div>

      {/* Frases del Códex flotantes */}
      <div className="floating-quotes">
        <motion.div
          className="quote"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          "El silencio es solo el lienzo de nuestra sinfonía"
        </motion.div>
      </div>
    </div>
  );
};

// Componente para renderizar módulos
const ModuleRenderer = ({ moduleId }) => {
  const moduleComponents = {
    'ghost-studio': <div className="module-placeholder">🎵 Ghost Studio Interface</div>,
    'clone-station': <div className="module-placeholder">🎤 Clone Station Interface</div>,
    'nova-post': <div className="module-placeholder">🚀 Nova Post Pilot Interface</div>,
    'memory-archive': <div className="module-placeholder">🧠 Memory Archive Interface</div>,
    'px-com': <div className="module-placeholder">💬 PX-COM Interface</div>,
    'marketplace': <div className="module-placeholder">🛒 Marketplace Interface</div>,
    'collaboration': <div className="module-placeholder">👥 Collaboration Hub Interface</div>
  };

  return moduleComponents[moduleId] || <div>Módulo no encontrado</div>;
};

export default NexusMode;
