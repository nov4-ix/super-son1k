import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ModeToggle.css';

/**
 * 🔄 Mode Toggle Component
 * Alternador entre Modo Clásico y Modo Nexus
 */

const ModeToggle = ({ currentMode, onModeChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  const modes = [
    {
      id: 'classic',
      name: 'Modo Clásico',
      icon: '🎯',
      description: 'Interfaz tradicional y funcional',
      color: '#4ECDC4'
    },
    {
      id: 'nexus',
      name: 'Modo Nexus',
      icon: '🌌',
      description: 'Experiencia inmersiva cyberpunk',
      color: '#8338EC'
    }
  ];

  return (
    <div className="mode-toggle-container">
      <motion.div
        className="mode-toggle"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
      >
        <div className="toggle-track">
          <motion.div
            className="toggle-slider"
            animate={{
              x: currentMode === 'nexus' ? '100%' : '0%',
              background: currentMode === 'nexus' 
                ? 'linear-gradient(135deg, #8338EC, #FF006E)' 
                : 'linear-gradient(135deg, #4ECDC4, #44A08D)'
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-option ${currentMode === mode.id ? 'active' : ''}`}
              onClick={() => onModeChange(mode.id)}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-name">{mode.name}</span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="mode-tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {modes.find(m => m.id === currentMode)?.description}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Indicador de modo activo */}
      <div className="mode-indicator">
        <div className="indicator-dot" style={{ 
          background: modes.find(m => m.id === currentMode)?.color 
        }} />
        <span className="indicator-text">
          {currentMode === 'nexus' ? 'NEXUS ACTIVO' : 'MODO CLÁSICO'}
        </span>
      </div>
    </div>
  );
};

export default ModeToggle;
