import React, { useState, useEffect, useRef } from 'react';
import './ALVAESigil.css';

const ALVAESigil = ({ 
  size = 'medium', 
  interactive = true, 
  soundReactive = false,
  audioContext = null,
  className = '',
  onActivation = null 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [vibrationLevel, setVibrationLevel] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [soulResonance, setSoulResonance] = useState(0);
  const [isPulsating, setIsPulsating] = useState(false);
  const [fractalLevel, setFractalLevel] = useState(0);
  
  const sigilRef = useRef(null);
  const animationRef = useRef(null);
  const audioAnalyserRef = useRef(null);

  // Configuración de tamaños
  const sizeClasses = {
    small: 'alvae-small',
    medium: 'alvae-medium',
    large: 'alvae-large',
    xlarge: 'alvae-xlarge'
  };

  // Efectos de sonido reactivo
  useEffect(() => {
    if (soundReactive && audioContext) {
      setupAudioReactivity();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [soundReactive, audioContext]);

  const setupAudioReactivity = () => {
    if (!audioContext) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    audioAnalyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateSigil = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calcular niveles de vibración basados en frecuencias bajas
      const lowFreq = dataArray.slice(0, 32).reduce((a, b) => a + b) / 32;
      const midFreq = dataArray.slice(32, 128).reduce((a, b) => a + b) / 96;
      const highFreq = dataArray.slice(128, 256).reduce((a, b) => a + b) / 128;
      
      setVibrationLevel(lowFreq / 255);
      setEnergyLevel(midFreq / 255);
      setSoulResonance(highFreq / 255);
      
      // Activar pulsación si hay suficiente energía
      setIsPulsating(energyLevel > 0.3);
      
      // Calcular nivel fractal basado en complejidad del audio
      const complexity = dataArray.reduce((a, b) => a + Math.abs(b - 128), 0) / dataArray.length;
      setFractalLevel(complexity / 128);
      
      animationRef.current = requestAnimationFrame(updateSigil);
    };
    
    updateSigil();
  };

  // Efectos de activación
  const handleActivation = () => {
    if (!interactive) return;
    
    setIsActive(true);
    setIsPulsating(true);
    
    // Efecto de activación gradual
    setTimeout(() => {
      setSoulResonance(1);
    }, 200);
    
    setTimeout(() => {
      setVibrationLevel(1);
    }, 400);
    
    setTimeout(() => {
      setEnergyLevel(1);
    }, 600);
    
    setTimeout(() => {
      setFractalLevel(1);
    }, 800);
    
    if (onActivation) {
      onActivation({
        soul: soulResonance,
        vibration: vibrationLevel,
        energy: energyLevel,
        fractal: fractalLevel
      });
    }
  };

  // Efectos de hover
  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsPulsating(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsPulsating(false);
  };

  // Efectos de click
  const handleClick = () => {
    if (!interactive) return;
    handleActivation();
  };

  const sigilClasses = [
    'alvae-sigil',
    sizeClasses[size],
    interactive ? 'interactive' : '',
    isActive ? 'active' : '',
    isPulsating ? 'pulsating' : '',
    soundReactive ? 'sound-reactive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={sigilRef}
      className={sigilClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={interactive ? 'button' : 'img'}
      aria-label="ALVAE Sigil - Sigilo Sonoro de Son1kVers3"
      tabIndex={interactive ? 0 : -1}
      style={{
        '--vibration-level': vibrationLevel,
        '--energy-level': energyLevel,
        '--soul-resonance': soulResonance,
        '--fractal-level': fractalLevel
      }}
    >
      {/* Círculo exterior - Alma (AL) */}
      <div className="alvae-circle">
        <div className="circle-outer"></div>
        <div className="circle-inner"></div>
        <div className="circle-glow"></div>
      </div>

      {/* Rayo central - Vibración (VA) */}
      <div className="alvae-lightning">
        <div className="lightning-bolt">
          <div className="bolt-main"></div>
          <div className="bolt-branch bolt-branch-1"></div>
          <div className="bolt-branch bolt-branch-2"></div>
          <div className="bolt-branch bolt-branch-3"></div>
        </div>
        <div className="lightning-glow"></div>
      </div>

      {/* Geometría fractal - Energía (E) */}
      <div className="alvae-fractals">
        <div className="fractal-triangle fractal-1"></div>
        <div className="fractal-triangle fractal-2"></div>
        <div className="fractal-triangle fractal-3"></div>
        <div className="fractal-triangle fractal-4"></div>
        <div className="fractal-triangle fractal-5"></div>
        <div className="fractal-triangle fractal-6"></div>
      </div>

      {/* Nodos conectivos */}
      <div className="alvae-nodes">
        <div className="node node-1"></div>
        <div className="node node-2"></div>
        <div className="node node-3"></div>
        <div className="node node-4"></div>
        <div className="node node-5"></div>
        <div className="node node-6"></div>
        <div className="node node-7"></div>
        <div className="node node-8"></div>
      </div>

      {/* Conexiones entre nodos */}
      <div className="alvae-connections">
        <div className="connection connection-1"></div>
        <div className="connection connection-2"></div>
        <div className="connection connection-3"></div>
        <div className="connection connection-4"></div>
        <div className="connection connection-5"></div>
        <div className="connection connection-6"></div>
      </div>

      {/* Efectos de energía */}
      <div className="alvae-energy-effects">
        <div className="energy-ring energy-ring-1"></div>
        <div className="energy-ring energy-ring-2"></div>
        <div className="energy-ring energy-ring-3"></div>
        <div className="energy-pulse"></div>
      </div>

      {/* Partículas de energía */}
      <div className="alvae-particles">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              '--particle-delay': `${i * 0.1}s`,
              '--particle-angle': `${i * 30}deg`
            }}
          />
        ))}
      </div>

      {/* Texto ALVAE */}
      <div className="alvae-text">
        <span className="alvae-label">ALVAE</span>
        <div className="alvae-subtitle">
          <span className="soul-label">AL</span>
          <span className="vibration-label">VA</span>
          <span className="energy-label">E</span>
        </div>
      </div>

      {/* Indicadores de estado */}
      <div className="alvae-status">
        <div className="status-indicator soul-indicator">
          <span className="indicator-label">Alma</span>
          <div className="indicator-bar">
            <div 
              className="indicator-fill"
              style={{ width: `${soulResonance * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="status-indicator vibration-indicator">
          <span className="indicator-label">Vibración</span>
          <div className="indicator-bar">
            <div 
              className="indicator-fill"
              style={{ width: `${vibrationLevel * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="status-indicator energy-indicator">
          <span className="indicator-label">Energía</span>
          <div className="indicator-bar">
            <div 
              className="indicator-fill"
              style={{ width: `${energyLevel * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ALVAESigil;

