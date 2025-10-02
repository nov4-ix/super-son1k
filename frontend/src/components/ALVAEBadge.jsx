import React, { useState, useEffect } from 'react';
import './ALVAEBadge.css';

const ALVAEBadge = ({ 
  level = 0, 
  size = 'medium', 
  animated = true, 
  interactive = false,
  showLevel = true,
  showName = true,
  className = '',
  onClick = null 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  // Niveles de ALVAE - Sigilo Sonoro
  // AL (Alma) + VA (Vibración) + E (Energía)
  const alvaeLevels = {
    0: { 
      name: 'Silencioso', 
      color: '#2a2a3e', 
      description: 'Alma despertando - Sigilo dormante',
      vibration: 'Alma despertando',
      glow: 'rgba(42, 42, 62, 0.3)'
    },
    25: { 
      name: 'Susurro', 
      color: '#4a4a6e', 
      description: 'Latido emergente - Primeras vibraciones',
      vibration: 'Latido emergente',
      glow: 'rgba(74, 74, 110, 0.4)'
    },
    50: { 
      name: 'Eco', 
      color: '#6a6a9e', 
      description: 'Vibración consciente - Resonancia media',
      vibration: 'Vibración consciente',
      glow: 'rgba(106, 106, 158, 0.5)'
    },
    75: { 
      name: 'Resonancia', 
      color: '#8a8ace', 
      description: 'Energía sincronizada - Maestría intermedia',
      vibration: 'Energía sincronizada',
      glow: 'rgba(138, 138, 206, 0.6)'
    },
    90: { 
      name: 'Armonía', 
      color: '#aaaaff', 
      description: 'Afinación vibracional completa',
      vibration: 'Afinación vibracional completa',
      glow: 'rgba(170, 170, 255, 0.7)'
    },
    100: { 
      name: 'Sinfonía', 
      color: '#ccccff', 
      description: 'Ser sonoro consciente - Totem digital activado',
      vibration: 'Totem digital activado',
      glow: 'rgba(204, 204, 255, 0.8)'
    }
  };

  // Obtener nivel de ALVAE
  const getALVAELevel = (level) => {
    const levels = Object.keys(alvaeLevels).map(Number).sort((a, b) => b - a);
    for (const l of levels) {
      if (level >= l) {
        return alvaeLevels[l];
      }
    }
    return alvaeLevels[0];
  };

  const currentLevel = getALVAELevel(level);
  const isActive = level > 0;

  // Configuración de tamaños
  const sizeClasses = {
    small: 'badge-small',
    medium: 'badge-medium',
    large: 'badge-large',
    xlarge: 'badge-xlarge'
  };

  // Efectos de activación
  useEffect(() => {
    if (isActivated) {
      const timer = setTimeout(() => {
        setIsActivated(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActivated]);

  const handleClick = () => {
    if (interactive && onClick) {
      setIsActivated(true);
      onClick({
        level,
        name: currentLevel.name,
        description: currentLevel.description
      });
    }
  };

  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false);
    }
  };

  const badgeClasses = [
    'alvae-badge',
    sizeClasses[size],
    isActive ? 'active' : 'inactive',
    animated ? 'animated' : '',
    interactive ? 'interactive' : '',
    isHovered ? 'hovered' : '',
    isActivated ? 'activated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={badgeClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={interactive ? 'button' : 'img'}
      aria-label={`ALVAE Badge - Nivel ${currentLevel.name}`}
      tabIndex={interactive ? 0 : -1}
      style={{
        '--alvae-color': currentLevel.color,
        '--alvae-glow': currentLevel.glow,
        '--alvae-level': level
      }}
    >
      {/* Círculo exterior */}
      <div className="badge-circle">
        <div className="circle-outer"></div>
        <div className="circle-inner"></div>
        <div className="circle-glow"></div>
      </div>

      {/* Rayo central */}
      <div className="badge-lightning">
        <div className="lightning-bolt"></div>
        <div className="lightning-glow"></div>
      </div>

      {/* Geometría fractal */}
      <div className="badge-fractals">
        <div className="fractal-triangle fractal-1"></div>
        <div className="fractal-triangle fractal-2"></div>
        <div className="fractal-triangle fractal-3"></div>
        <div className="fractal-triangle fractal-4"></div>
      </div>

      {/* Nodos conectivos */}
      <div className="badge-nodes">
        <div className="node node-1"></div>
        <div className="node node-2"></div>
        <div className="node node-3"></div>
        <div className="node node-4"></div>
        <div className="node node-5"></div>
        <div className="node node-6"></div>
      </div>

      {/* Conexiones */}
      <div className="badge-connections">
        <div className="connection connection-1"></div>
        <div className="connection connection-2"></div>
        <div className="connection connection-3"></div>
      </div>

      {/* Efectos de energía */}
      <div className="badge-energy">
        <div className="energy-ring energy-ring-1"></div>
        <div className="energy-ring energy-ring-2"></div>
        <div className="energy-pulse"></div>
      </div>

      {/* Partículas */}
      <div className="badge-particles">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              '--particle-delay': `${i * 0.2}s`,
              '--particle-angle': `${i * 45}deg`
            }}
          />
        ))}
      </div>

      {/* Texto ALVAE */}
      {showName && (
        <div className="badge-text">
          <span className="alvae-label">ALVAE</span>
        </div>
      )}

      {/* Nivel */}
      {showLevel && (
        <div className="badge-level">
          <span className="level-number">{level}%</span>
          <span className="level-name">{currentLevel.name}</span>
        </div>
      )}

      {/* Efectos de activación */}
      {isActivated && (
        <div className="activation-effects">
          <div className="activation-ring"></div>
          <div className="activation-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default ALVAEBadge;

