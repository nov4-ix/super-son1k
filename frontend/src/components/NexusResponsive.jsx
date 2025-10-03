import React, { useState, useEffect } from 'react';
import NexusMode from './NexusMode';
import NexusModeMobile from './NexusModeMobile';

/**
 * 🌌 NEXUS RESPONSIVE
 * Componente adaptativo que detecta el dispositivo
 * y renderiza la versión apropiada
 */

const NexusResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Detectar móvil (< 768px)
      setIsMobile(width < 768);
      
      // Detectar tablet (768px - 1024px)
      setIsTablet(width >= 768 && width < 1024);
      
      // Detectar orientación
      const isLandscape = width > height;
      
      // Detectar touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Log para debugging
      console.log('Device Detection:', {
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isLandscape,
        isTouchDevice
      });
    };

    checkDevice();
    
    // Re-check on resize
    window.addEventListener('resize', checkDevice);
    
    // Re-check on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(checkDevice, 100);
    });

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  // Renderizar versión móvil/tablet o desktop
  if (isMobile || isTablet) {
    return <NexusModeMobile />;
  }

  return <NexusMode />;
};

export default NexusResponsive;
