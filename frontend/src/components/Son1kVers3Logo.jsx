/**
 * 🔺👁️ Son1kVers3 Official Logo
 * Logo oficial: Triángulo con ojo - Símbolo del universo Son1kVers3
 * Representa la visión omnisciente de La Resistencia
 */

import React, { useState, useEffect } from 'react';
import './Son1kVers3Logo.css';

const Son1kVers3Logo = ({ 
  size = 'medium', 
  animated = true, 
  interactive = false,
  showText = true,
  variant = 'full', // 'full', 'icon', 'minimal'
  glowIntensity = 0.5,
  onActivate = null
}) => {
  const [isActive, setIsActive] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Animación del pulso del ojo
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 50);
    
    return () => clearInterval(interval);
  }, [animated]);

  const handleClick = () => {
    if (interactive) {
      setIsActive(true);
      if (onActivate) {
        onActivate();
      }
      setTimeout(() => setIsActive(false), 2000);
    }
  };

  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium', 
    large: 'logo-large',
    xlarge: 'logo-xlarge'
  };

  const logoClasses = [
    'son1kvers3-logo',
    sizeClasses[size],
    animated ? 'animated' : '',
    interactive ? 'interactive' : '',
    isActive ? 'active' : '',
    variant
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={logoClasses}
      onClick={handleClick}
      style={{
        '--glow-intensity': glowIntensity,
        '--pulse-phase': pulsePhase
      }}
      role={interactive ? 'button' : 'img'}
      aria-label="Son1kVers3 Logo - Triángulo con Ojo"
      tabIndex={interactive ? 0 : -1}
    >
      {/* SVG del Logo Oficial */}
      <svg 
        className="logo-svg" 
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definiciones de gradientes y filtros */}
        <defs>
          {/* Gradiente para el triángulo */}
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#00bfff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
          
          {/* Gradiente para el ojo */}
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#00bfff" />
            <stop offset="70%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          
          {/* Gradiente para la pupila */}
          <radialGradient id="pupilGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" />
            <stop offset="80%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#00bfff" />
          </radialGradient>
          
          {/* Filtro de resplandor */}
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Filtro de resplandor intenso */}
          <filter id="intenseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Patrón de circuitos */}
          <pattern id="circuitPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="transparent"/>
            <path d="M0,10 L20,10 M10,0 L10,20" stroke="#00bfff" strokeWidth="0.5" opacity="0.3"/>
            <circle cx="10" cy="10" r="1" fill="#00bfff" opacity="0.5"/>
          </pattern>
        </defs>

        {/* Aura de fondo */}
        <circle 
          cx="100" 
          cy="100" 
          r="90" 
          fill="url(#circuitPattern)"
          opacity="0.1"
          className="logo-aura"
        />

        {/* Círculos concéntricos de fondo */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="#00bfff" strokeWidth="0.5" opacity="0.2" className="bg-circle"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#ff49c3" strokeWidth="0.3" opacity="0.15" className="bg-circle"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#ffcc00" strokeWidth="0.2" opacity="0.1" className="bg-circle"/>

        {/* Líneas radiales */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x1 = 100 + Math.cos(angle) * 50;
          const y1 = 100 + Math.sin(angle) * 50;
          const x2 = 100 + Math.cos(angle) * 75;
          const y2 = 100 + Math.sin(angle) * 75;
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#00bfff"
              strokeWidth="0.5"
              opacity="0.3"
              className="radial-line"
              style={{ '--delay': `${i * 0.1}s` }}
            />
          );
        })}

        {/* Triángulo principal */}
        <polygon
          points="100,30 170,150 30,150"
          fill="none"
          stroke="url(#triangleGradient)"
          strokeWidth="3"
          filter="url(#logoGlow)"
          className="main-triangle"
        />
        
        {/* Triángulo interior */}
        <polygon
          points="100,45 155,135 45,135"
          fill="none"
          stroke="#00bfff"
          strokeWidth="1.5"
          opacity="0.6"
          className="inner-triangle"
        />

        {/* Ojo - Parte blanca */}
        <ellipse
          cx="100"
          cy="100"
          rx="35"
          ry="25"
          fill="url(#eyeGradient)"
          filter="url(#logoGlow)"
          className="eye-white"
        />
        
        {/* Iris */}
        <circle
          cx="100"
          cy="100"
          r="18"
          fill="#00bfff"
          opacity="0.8"
          className="eye-iris"
        />
        
        {/* Pupila */}
        <circle
          cx="100"
          cy="100"
          r="8"
          fill="url(#pupilGradient)"
          className="eye-pupil"
        />
        
        {/* Reflejo en el ojo */}
        <ellipse
          cx="95"
          cy="95"
          rx="3"
          ry="5"
          fill="#ffffff"
          opacity="0.9"
          className="eye-reflection"
        />

        {/* Párpados (líneas superiores e inferiores) */}
        <path
          d="M 65,100 Q 100,85 135,100"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.7"
          className="eyelid-top"
        />
        <path
          d="M 65,100 Q 100,115 135,100"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.7"
          className="eyelid-bottom"
        />

        {/* Elementos decorativos en las esquinas del triángulo */}
        <circle cx="100" cy="35" r="3" fill="#ffcc00" className="triangle-node"/>
        <circle cx="165" cy="145" r="3" fill="#ff49c3" className="triangle-node"/>
        <circle cx="35" cy="145" r="3" fill="#00bfff" className="triangle-node"/>

        {/* Texto ALVAE en la base (si es variant full) */}
        {variant === 'full' && (
          <text
            x="100"
            y="170"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="8"
            fontFamily="monospace"
            opacity="0.7"
            className="alvae-text"
          >
            ALVAE
          </text>
        )}
      </svg>

      {/* Texto del logo */}
      {showText && variant !== 'icon' && (
        <div className="logo-text">
          <h1 className="logo-title">SON1KVERS3</h1>
          {variant === 'full' && (
            <p className="logo-subtitle">La Resistencia Sonora</p>
          )}
        </div>
      )}

      {/* Efectos de activación */}
      {isActive && (
        <div className="activation-effects">
          <div className="activation-pulse"></div>
          <div className="activation-rings">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="activation-ring"
                style={{ '--delay': `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Partículas de energía */}
      {animated && (
        <div className="logo-particles">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="energy-particle"
              style={{ 
                '--delay': `${i * 0.3}s`,
                '--angle': `${i * 60}deg`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Son1kVers3Logo;