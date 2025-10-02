/**
 * 🔺 ALVAE Sigil - Sigilo Sonoro Reactivo
 * Símbolo sagrado que representa la fusión entre Alma (AL), Vibración (VA) y Energía (E)
 * Totem digital que identifica a un ser sonoro consciente dentro del Son1kVerse
 */

import React, { useState, useEffect, useRef } from 'react';
import './ALVAESigil.css';

const ALVAESigil = ({ 
  level = 10, 
  size = 'medium', 
  showLevel = true, 
  showName = true,
  isActive = false,
  audioLevel = 0 // 0-100, para reactividad al sonido
}) => {
  const [pulsing, setPulsing] = useState(false);
  const [vibrationState, setVibrationState] = useState('dormant');
  const sigilRef = useRef(null);

  // Determinar el estado vibracional basado en el nivel
  const getVibrationState = (level) => {
    if (level >= 100) return 'harmony';
    if (level >= 75) return 'resonance';
    if (level >= 50) return 'echo';
    if (level >= 25) return 'whisper';
    return 'silence';
  };

  // Obtener información del nivel ALVAE
  const getLevelInfo = (level) => {
    const levels = {
      silence: { name: 'Silencioso', vibration: 'Alma despertando', color: '#2a2a3e' },
      whisper: { name: 'Susurro', vibration: 'Latido emergente', color: '#4a4a6e' },
      echo: { name: 'Eco', vibration: 'Vibración consciente', color: '#6a6a9e' },
      resonance: { name: 'Resonancia', vibration: 'Energía sincronizada', color: '#8a8ace' },
      harmony: { name: 'Armonía', vibration: 'Afinación vibracional completa', color: '#aaaaff' }
    };
    
    const state = getVibrationState(level);
    return levels[state] || levels.silence;
  };

  const levelInfo = getLevelInfo(level);

  // Efecto de pulsación basado en audio
  useEffect(() => {
    if (audioLevel > 30) {
      setPulsing(true);
      const timeout = setTimeout(() => setPulsing(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [audioLevel]);

  // Actualizar estado vibracional
  useEffect(() => {
    setVibrationState(getVibrationState(level));
  }, [level]);

  // Generar puntos del fractal triangular
  const generateFractalPoints = () => {
    const baseSize = size === 'small' ? 30 : size === 'large' ? 80 : 50;
    const intensity = Math.min(level / 100, 1);
    
    // Triángulo principal
    const mainTriangle = [
      [baseSize, 0],
      [-baseSize/2, baseSize * 0.866],
      [-baseSize/2, -baseSize * 0.866]
    ];

    // Fractales internos basados en el nivel
    const fractals = [];
    if (level >= 25) {
      // Triángulo interno
      fractals.push([
        [baseSize * 0.5, 0],
        [-baseSize * 0.25, baseSize * 0.433],
        [-baseSize * 0.25, -baseSize * 0.433]
      ]);
    }
    
    if (level >= 50) {
      // Nodos conectivos
      fractals.push([
        [0, baseSize * 0.3],
        [-baseSize * 0.15, -baseSize * 0.15],
        [baseSize * 0.15, -baseSize * 0.15]
      ]);
    }

    return { mainTriangle, fractals, intensity };
  };

  const { mainTriangle, fractals, intensity } = generateFractalPoints();

  return (
    <div className={`alvae-sigil ${size} ${vibrationState} ${pulsing ? 'pulsing' : ''} ${isActive ? 'active' : ''}`}>
      <div className="sigil-container" ref={sigilRef}>
        {/* SVG del Sigilo */}
        <svg 
          className="sigil-svg" 
          viewBox="-100 -100 200 200"
          style={{ '--audio-level': audioLevel / 100 }}
        >
          {/* Aura energética */}
          <defs>
            <radialGradient id={`aura-${level}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={levelInfo.color} stopOpacity="0.3" />
              <stop offset="70%" stopColor={levelInfo.color} stopOpacity="0.1" />
              <stop offset="100%" stopColor={levelInfo.color} stopOpacity="0" />
            </radialGradient>
            
            {/* Filtro de resplandor */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Aura de fondo */}
          <circle 
            cx="0" 
            cy="0" 
            r="90" 
            fill={`url(#aura-${level})`}
            className="sigil-aura"
          />

          {/* Triángulo principal */}
          <polygon
            points={mainTriangle.map(p => p.join(',')).join(' ')}
            fill="none"
            stroke={levelInfo.color}
            strokeWidth="2"
            filter="url(#glow)"
            className="main-triangle"
          />

          {/* Fractales internos */}
          {fractals.map((fractal, index) => (
            <polygon
              key={index}
              points={fractal.map(p => p.join(',')).join(' ')}
              fill="none"
              stroke={levelInfo.color}
              strokeWidth="1"
              opacity={0.7}
              className={`fractal fractal-${index}`}
            />
          ))}

          {/* Nodos de conexión */}
          {level >= 75 && (
            <>
              <circle cx="0" cy="-30" r="3" fill={levelInfo.color} className="connection-node" />
              <circle cx="-26" cy="15" r="3" fill={levelInfo.color} className="connection-node" />
              <circle cx="26" cy="15" r="3" fill={levelInfo.color} className="connection-node" />
            </>
          )}

          {/* Centro energético */}
          <circle 
            cx="0" 
            cy="0" 
            r={3 + (intensity * 5)} 
            fill={levelInfo.color}
            className="energy-core"
          />

          {/* Rayo central (símbolo de energía) */}
          {level >= 100 && (
            <path
              d="M 0,-20 L 8,0 L 0,20 L -8,0 Z"
              fill={levelInfo.color}
              className="energy-bolt"
            />
          )}
        </svg>

        {/* Información del nivel */}
        {showLevel && (
          <div className="level-info">
            <div className="level-number">{level}</div>
            {showName && (
              <div className="level-details">
                <div className="level-name">{levelInfo.name}</div>
                <div className="vibration-state">{levelInfo.vibration}</div>
      </div>
            )}
      </div>
        )}

      {/* Partículas de energía */}
        {isActive && (
          <div className="energy-particles">
            {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
                  '--delay': `${i * 0.2}s`,
                  '--color': levelInfo.color 
            }}
          />
        ))}
      </div>
        )}
      </div>

      {/* Tooltip con información del sigilo */}
      <div className="sigil-tooltip">
        <h4>ALVAE - Sigilo Sonoro</h4>
        <p><strong>AL</strong>ma + <strong>V</strong>ibr<strong>A</strong>ción + <strong>E</strong>nergía</p>
        <p>Totem digital del ser sonoro consciente</p>
        <div className="components">
          <div><strong>A:</strong> Esencia individual</div>
          <div><strong>L/V:</strong> Movimiento sonoro</div>
          <div><strong>AE:</strong> Impulso creativo infinito</div>
        </div>
      </div>
    </div>
  );
};

export default ALVAESigil;