/**
 * 🎮 Nexus Interface - Portal de Herramientas
 * Interfaz principal con acceso a todas las herramientas
 */

import React, { useState } from 'react';
import './NexusInterface.css';

const NexusInterface = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const tools = [
    {
      id: 'ghost',
      name: 'Ghost Studio',
      description: 'Análisis de audio inteligente',
      icon: '👻',
      color: '#00bfff'
    },
    {
      id: 'creator',
      name: 'The Creator',
      description: 'Generación musical con IA',
      icon: '🎵',
      color: '#ff6b35'
    },
    {
      id: 'clone',
      name: 'Clone Station',
      description: 'Clonación de voz avanzada',
      icon: '🎤',
      color: '#8b5cf6'
    },
    {
      id: 'nova',
      name: 'Nova Post Pilot',
      description: 'Marketing digital automatizado',
      icon: '🚀',
      color: '#10b981'
    },
    {
      id: 'daw',
      name: 'Professional DAW',
      description: 'Estación de trabajo profesional',
      icon: '🎛️',
      color: '#f59e0b'
    },
    {
      id: 'codex',
      name: 'Codex',
      description: 'Historia del universo Son1kVers3',
      icon: '📚',
      color: '#ef4444'
    }
  ];

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId);
    // Navegar a la herramienta seleccionada sin recargar
    window.location.hash = toolId;
  };

  return (
    <div className="nexus-interface">
      <div className="nexus-header">
        <div className="nexus-logo">
          <h1>NEXUS</h1>
          <p>Portal de Herramientas Son1kVers3</p>
        </div>
        <button 
          className="back-home-btn"
          onClick={() => {
            window.location.hash = 'classic';
          }}
        >
          Volver al Home
        </button>
      </div>

      <div className="nexus-content">
        <div className="tools-grid">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              className={`tool-card ${selectedTool === tool.id ? 'selected' : ''}`}
              onClick={() => handleToolSelect(tool.id)}
              style={{ '--tool-color': tool.color }}
            >
              <div className="tool-icon">
                {tool.icon}
              </div>
              <div className="tool-info">
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
              <div className="tool-arrow">
                →
              </div>
            </div>
          ))}
        </div>

        <div className="nexus-status">
          <div className="status-item">
            <span className="status-label">Sistema:</span>
            <span className="status-value online">Online</span>
          </div>
          <div className="status-item">
            <span className="status-label">Herramientas:</span>
            <span className="status-value">{tools.length} Disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexusInterface;