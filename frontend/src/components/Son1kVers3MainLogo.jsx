/**
 * 🔺 Son1kVers3 Main Logo - Logo Principal
 * Triángulo con ojo - Logo oficial que lleva al frontend clásico
 */

import React, { useState, useRef, useEffect } from 'react';
import './Son1kVers3MainLogo.css';

const Son1kVers3MainLogo = ({ 
  size = 'large', 
  interactive = true, 
  onActivate = null 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  
  const logoRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (interactive) {
      startPulseAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [interactive]);

  const startPulseAnimation = () => {
    const animate = () => {
      const time = Date.now() * 0.001;
      setRotationAngle(time * 2); // Rotación muy lenta
      setPulseIntensity(1 + Math.sin(time) * 0.1); // Pulso sutil
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const handleLogoClick = () => {
    if (!interactive) return;
    
    setIsActive(true);
    setShowTransition(true);
    
    // Efecto de activación
    playActivationEffect();
    
    // Animación de transición al frontend clásico
    setTimeout(() => {
      if (onActivate) {
        onActivate();
      } else {
        // Redirigir al frontend clásico
        window.location.href = '/classic';
      }
    }, 2000);
  };

  const playActivationEffect = () => {
    // Efecto visual de activación
    const logo = logoRef.current;
    if (!logo) return;
    
    logo.style.transform = 'scale(1.2)';
    logo.style.filter = 'brightness(2) saturate(2)';
    
    setTimeout(() => {
      logo.style.transform = 'scale(1)';
      logo.style.filter = 'brightness(1) saturate(1)';
    }, 300);
    
    // Crear ondas expansivas
    createRippleEffect();
  };

  const createRippleEffect = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'logo-ripple';
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          border: 2px solid #00FFE7;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: logo-ripple 2s ease-out;
          pointer-events: none;
          z-index: 1000;
        `;
        
        logoRef.current?.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 2000);
      }, i * 200);
    }
  };

  const getSizeClass = () => {
    const sizes = {
      small: 'logo-small',
      medium: 'logo-medium',
      large: 'logo-large',
      massive: 'logo-massive'
    };
    return sizes[size] || sizes.large;
  };

  return (
    <div className="son1k-main-logo-container">
      {/* Transición al frontend clásico */}
      {showTransition && (
        <div className="classic-transition">
          <div className="transition-overlay">
            <div className="transition-text">
              <h2>Entrando al Estudio...</h2>
              <p>Preparando herramientas musicales</p>
            </div>
            <div className="transition-loader">
              <div className="loader-triangle"></div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={logoRef}
        className={`son1k-main-logo ${getSizeClass()} ${isActive ? 'active' : ''}`}
        onClick={handleLogoClick}
        style={{
          transform: `rotate(${rotationAngle}deg) scale(${pulseIntensity})`,
          cursor: interactive ? 'pointer' : 'default'
        }}
      >
        {/* Triángulo principal */}
        <div className="logo-triangle">
          <div className="triangle-border"></div>
          <div className="triangle-inner">
            {/* Ojo central */}
            <div className="logo-eye">
              <div className="eye-outer">
                <div className="eye-iris">
                  <div className="eye-pupil">
                    <div className="eye-reflection"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Efectos de energía */}
        <div className="logo-energy">
          <div className="energy-ring ring-1"></div>
          <div className="energy-ring ring-2"></div>
          <div className="energy-ring ring-3"></div>
        </div>
        
        {/* Partículas de activación */}
        {isActive && (
          <div className="logo-particles">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="energy-particle"
                style={{
                  left: `${50 + Math.cos((i * 30) * Math.PI / 180) * 40}%`,
                  top: `${50 + Math.sin((i * 30) * Math.PI / 180) * 40}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
        
        {/* Texto Son1kVers3 */}
        <div className="logo-text">
          <span>SON1KVERS3</span>
        </div>
      </div>
      
      {interactive && (
        <div className="logo-instruction">
          <p>Haz clic para entrar al estudio</p>
        </div>
      )}

      {/* Estilos dinámicos */}
      <style jsx>{`
        @keyframes logo-ripple {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Son1kVers3MainLogo;
