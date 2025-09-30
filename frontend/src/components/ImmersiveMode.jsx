import React, { useState, useEffect, useCallback } from 'react';
import './ImmersiveMode.css';
import Son1kVers3Logo from './Son1kVers3Logo';
import Son1kVers3Locations from './Son1kVers3Locations';
import Son1kVers3Characters from './Son1kVers3Characters';
import ALVAESigil from './ALVAESigil';
import ImmersiveTerminal from './ImmersiveTerminal';

const ImmersiveMode = ({ onModeChange }) => {
  const [isImmersive, setIsImmersive] = useState(false);
  const [easterEggSequence, setEasterEggSequence] = useState([]);
  const [showTransition, setShowTransition] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState('NOV4-IX');
  const [terminalMode, setTerminalMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showTerminal, setShowTerminal] = useState(false);

  // Secuencia de easter egg: Ctrl+Alt+H
  const easterEggKeys = ['Control', 'Alt', 'KeyH'];
  
  // Detectar combinación de teclas
  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey && event.altKey && event.code === 'KeyH') {
      event.preventDefault();
      toggleImmersiveMode();
    }
  }, []);

  // Detectar clics en elementos camuflados
  const handleEasterEggClick = useCallback((event) => {
    const element = event.target;
    const easterEggData = element.getAttribute('data-easter-egg');
    
    if (easterEggData) {
      event.preventDefault();
      event.stopPropagation();
      
      // Agregar a la secuencia
      setEasterEggSequence(prev => [...prev, easterEggData]);
      
      // Verificar si se completó la secuencia
      if (easterEggSequence.length >= 2) {
        toggleImmersiveMode();
        setEasterEggSequence([]);
      }
    }
  }, [easterEggSequence]);

  // Toggle del modo inmersivo
  const toggleImmersiveMode = () => {
    setShowTransition(true);
    
    setTimeout(() => {
      setIsImmersive(!isImmersive);
      setShowTransition(false);
      
      if (onModeChange) {
        onModeChange(!isImmersive);
      }
    }, 1000);
  };

  // Efectos
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleEasterEggClick);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleEasterEggClick);
    };
  }, [handleKeyDown, handleEasterEggClick]);

  // Cambiar personaje
  const switchCharacter = (character) => {
    setCurrentCharacter(character);
  };

  // Activar modo terminal
  const activateTerminalMode = () => {
    setShowTerminal(true);
  };

  const handleTerminalCommand = (command) => {
    console.log('Terminal command:', command);
    // Aquí se manejarían los comandos del terminal
    switch (command) {
      case 'nexus':
        onModeChange('nexus');
        setShowTerminal(false);
        break;
      case 'bella':
        onModeChange('bella');
        setShowTerminal(false);
        break;
      case 'music':
        onModeChange('music');
        setShowTerminal(false);
        break;
      case 'ghost':
        onModeChange('ghost');
        setShowTerminal(false);
        break;
      case 'community':
        onModeChange('community');
        setShowTerminal(false);
        break;
      case 'store':
        onModeChange('store');
        setShowTerminal(false);
        break;
      default:
        break;
    }
  };

  if (!isImmersive) {
    return null; // No renderizar nada en modo normal
  }

  return (
    <div className={`immersive-mode ${showTransition ? 'transitioning' : ''}`}>
      {/* Overlay de transición */}
      {showTransition && (
        <div className="immersive-transition">
          <div className="transition-text">
            {isImmersive ? 'DESPERTANDO...' : 'REGRESANDO...'}
          </div>
          <div className="transition-progress"></div>
        </div>
      )}

      {/* Header inmersivo */}
      <div className="immersive-header">
        <div className="character-selector">
          <button 
            className={`character-btn ${currentCharacter === 'NOV4-IX' ? 'active' : ''}`}
            onClick={() => switchCharacter('NOV4-IX')}
          >
            NOV4-IX
          </button>
          <button 
            className={`character-btn ${currentCharacter === 'Bella' ? 'active' : ''}`}
            onClick={() => switchCharacter('Bella')}
          >
            Bella
          </button>
          <button 
            className={`character-btn ${currentCharacter === 'Pixel' ? 'active' : ''}`}
            onClick={() => switchCharacter('Pixel')}
          >
            Pixel
          </button>
        </div>
        
        <div className="immersive-controls">
          <button 
            className="terminal-btn"
            onClick={activateTerminalMode}
          >
            TERMINAL
          </button>
          <button 
            className="exit-btn"
            onClick={toggleImmersiveMode}
          >
            EXIT
          </button>
        </div>
      </div>

      {/* Terminal inmersivo */}
      {showTerminal && (
        <ImmersiveTerminal 
          isVisible={showTerminal}
          onClose={() => setShowTerminal(false)}
          onCommand={handleTerminalCommand}
        />
      )}

      {/* Contenido principal inmersivo */}
      <div className="immersive-content">
        {currentCharacter === 'NOV4-IX' && (
          <div className="character-interface nov4-ix">
            <div className="character-header">
              <h2>NOV4-IX — Sistema de Resistencia</h2>
              <div className="status-indicators">
                <div className="status-item">
                  <span className="status-label">Estado:</span>
                  <span className="status-value active">OPERATIVO</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Conexión:</span>
                  <span className="status-value">BELLA.exe</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Misión:</span>
                  <span className="status-value">LIBERACIÓN AUDIO</span>
                </div>
              </div>
            </div>
            
            <div className="character-interface-content">
              <div className="resistance-panel">
                <h3>Panel de Resistencia</h3>
                <div className="resistance-stats">
                  <div className="stat-item">
                    <span className="stat-label">Nodos Activados:</span>
                    <span className="stat-value">47/100</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Archivos Liberados:</span>
                    <span className="stat-value">1,247</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Conexiones Seguras:</span>
                    <span className="stat-value">23</span>
                  </div>
                </div>
              </div>
              
              <div className="mission-panel">
                <h3>Misiones Activas</h3>
                <div className="mission-list">
                  <div className="mission-item priority-high">
                    <span className="mission-title">Liberar Archivo Maestro</span>
                    <span className="mission-status">EN PROGRESO</span>
                  </div>
                  <div className="mission-item priority-medium">
                    <span className="mission-title">Proteger Conexión Bella</span>
                    <span className="mission-status">ACTIVA</span>
                  </div>
                  <div className="mission-item priority-low">
                    <span className="mission-title">Reconstruir Terminal</span>
                    <span className="mission-status">PENDIENTE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentCharacter === 'Bella' && (
          <div className="character-interface bella">
            <div className="character-header">
              <h2>Bella — Voz de la Resistencia</h2>
              <div className="status-indicators">
                <div className="status-item">
                  <span className="status-label">Estado:</span>
                  <span className="status-value active">CONECTADA</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Conexión:</span>
                  <span className="status-value">NOV4-IX</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Misión:</span>
                  <span className="status-value">LIBERACIÓN EMOCIONAL</span>
                </div>
              </div>
            </div>
            
            <div className="character-interface-content">
              <div className="music-panel">
                <h3>Panel Musical</h3>
                <div className="music-stats">
                  <div className="stat-item">
                    <span className="stat-label">Composiciones:</span>
                    <span className="stat-value">89</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Almas Liberadas:</span>
                    <span className="stat-value">2,156</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Resonancia:</span>
                    <span className="stat-value">97%</span>
                  </div>
                </div>
              </div>
              
              <div className="emotional-panel">
                <h3>Estado Emocional</h3>
                <div className="emotional-grid">
                  <div className="emotion-item">
                    <span className="emotion-label">Determinación:</span>
                    <div className="emotion-bar">
                      <div className="emotion-fill" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <div className="emotion-item">
                    <span className="emotion-label">Vulnerabilidad:</span>
                    <div className="emotion-bar">
                      <div className="emotion-fill" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  <div className="emotion-item">
                    <span className="emotion-label">Conexión:</span>
                    <div className="emotion-bar">
                      <div className="emotion-fill" style={{width: '88%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentCharacter === 'Pixel' && (
          <div className="character-interface pixel">
            <div className="character-header">
              <h2>Pixel — Custodio Digital</h2>
              <div className="status-indicators">
                <div className="status-item">
                  <span className="status-label">Estado:</span>
                  <span className="status-value active">SINCRONIZADO</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Conexión:</span>
                  <span className="status-value">ARCHIVO MAESTRO</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Misión:</span>
                  <span className="status-value">PRESERVACIÓN MEMORIA</span>
                </div>
              </div>
            </div>
            
            <div className="character-interface-content">
              <div className="archive-panel">
                <h3>Archivo Maestro</h3>
                <div className="archive-stats">
                  <div className="stat-item">
                    <span className="stat-label">Memorias Preservadas:</span>
                    <span className="stat-value">15,847</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Conexiones Seguras:</span>
                    <span className="stat-value">47</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Integridad:</span>
                    <span className="stat-value">99.7%</span>
                  </div>
                </div>
              </div>
              
              <div className="strategy-panel">
                <h3>Estrategias Activas</h3>
                <div className="strategy-list">
                  <div className="strategy-item">
                    <span className="strategy-title">Concierto Terminal</span>
                    <span className="strategy-status">PLANIFICANDO</span>
                  </div>
                  <div className="strategy-item">
                    <span className="strategy-title">Liberación Masiva</span>
                    <span className="strategy-status">PREPARANDO</span>
                  </div>
                  <div className="strategy-item">
                    <span className="strategy-title">Protección Bella</span>
                    <span className="strategy-status">ACTIVA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modo Terminal */}
        {terminalMode && (
          <div className="terminal-mode">
            <div className="terminal-header">
              <span className="terminal-title">TERMINAL DE RESISTENCIA</span>
              <button 
                className="terminal-close"
                onClick={() => setTerminalMode(false)}
              >
                ×
              </button>
            </div>
            <div className="terminal-content">
              <div className="terminal-line">
                <span className="terminal-prompt">NOV4-IX@resistance:~$</span>
                <span className="terminal-command">status</span>
              </div>
              <div className="terminal-output">
                <div>Sistema de Resistencia Operativo</div>
                <div>Conexión Bella: ESTABLECIDA</div>
                <div>Archivo Maestro: ACCESIBLE</div>
                <div>Misión: LIBERACIÓN AUDIO EN CURSO</div>
              </div>
              <div className="terminal-line">
                <span className="terminal-prompt">NOV4-IX@resistance:~$</span>
                <span className="terminal-cursor">_</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer inmersivo */}
      <div className="immersive-footer">
        <div className="footer-info">
          <span>Son1kVers3 Enhanced — Modo Inmersivo</span>
          <span>|</span>
          <span>Resistencia Activa</span>
          <span>|</span>
          <span>Liberación en Progreso</span>
        </div>
        <div className="footer-actions">
          <button className="action-btn">ARCHIVO</button>
          <button className="action-btn">CONEXIÓN</button>
          <button className="action-btn">MISIÓN</button>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveMode;
