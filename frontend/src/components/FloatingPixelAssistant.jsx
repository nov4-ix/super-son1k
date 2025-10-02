import React, { useState, useEffect, useRef } from 'react';
import './FloatingPixelAssistant.css';
import PixelAssistant from './PixelAssistant';

const FloatingPixelAssistant = ({ isVisible = true, onToggle }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Conectado');
  
  const pixelRef = useRef(null);
  const dragRef = useRef(null);

  // Manejar drag
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('pixel-drag-handle')) {
      setIsDragging(true);
      const rect = pixelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Mantener dentro de los límites de la pantalla
      const maxX = window.innerWidth - 350;
      const maxY = window.innerHeight - 200;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Event listeners para drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Manejar teclas de acceso rápido
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl + Alt + P para toggle
      if (e.ctrlKey && e.altKey && e.key === 'p') {
        e.preventDefault();
        setIsMinimized(!isMinimized);
      }
      
      // Ctrl + Alt + E para expandir
      if (e.ctrlKey && e.altKey && e.key === 'e') {
        e.preventDefault();
        setIsExpanded(!isExpanded);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isMinimized, isExpanded]);

  // Auto-minimizar cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pixelRef.current && !pixelRef.current.contains(e.target)) {
        if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Verificar conexión de Pixel
  useEffect(() => {
    const checkConnection = () => {
      try {
        // Simular verificación de conexión
        setIsOnline(true);
        setConnectionStatus('Online');
      } catch (error) {
        setIsOnline(false);
        setConnectionStatus('Desconectado');
      }
    };

    // Verificar conexión cada 5 segundos
    const connectionInterval = setInterval(checkConnection, 5000);
    checkConnection(); // Verificar inmediatamente

    return () => clearInterval(connectionInterval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={pixelRef}
      className={`floating-pixel-assistant ${isMinimized ? 'minimized' : ''} ${isExpanded ? 'expanded' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999
      }}
    >
      {/* Header con controles */}
      <div className="pixel-header">
        <div 
          className="pixel-drag-handle"
          onMouseDown={handleMouseDown}
        >
          <div className="pixel-avatar">
            <div className="pixel-eyes">
              <div className="pixel-eye left"></div>
              <div className="pixel-eye right"></div>
            </div>
          </div>
          <div className="pixel-info">
            <span className="pixel-name">Pixel Assistant</span>
            <span className="pixel-status">
              {isTyping ? 'Escribiendo...' : 'Listo para ayudar'}
            </span>
          </div>
        </div>
        
        <div className="pixel-controls">
          {unreadMessages > 0 && (
            <div className="unread-badge">
              {unreadMessages}
            </div>
          )}
          
          <button 
            className="pixel-btn minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
          
          <button 
            className="pixel-btn expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Contraer' : 'Expandir'}
          >
            {isExpanded ? '📱' : '💻'}
          </button>
          
          <button 
            className="pixel-btn close-btn"
            onClick={onToggle}
            title="Cerrar Pixel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      {!isMinimized && (
        <div className="pixel-content">
          <PixelAssistant 
            floating={true}
            onMessageCountChange={setUnreadMessages}
            onTypingChange={setIsTyping}
            compact={!isExpanded}
          />
        </div>
      )}

      {/* Indicador de estado */}
      <div className="pixel-status-indicator">
        <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
        <span>Pixel {connectionStatus}</span>
      </div>

      {/* Efectos visuales */}
      <div className="pixel-effects">
        <div className="pixel-glow"></div>
        <div className="pixel-particles">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle" style={{
              animationDelay: `${i * 0.5}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingPixelAssistant;
