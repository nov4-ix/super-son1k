import React, { useState, useEffect } from 'react';
import './Son1kVers3Universe.css';
import Son1kVers3Logo from './Son1kVers3Logo';
import Son1kVers3Locations from './Son1kVers3Locations';
import Son1kVers3Characters from './Son1kVers3Characters';
import ALVAESigil from './ALVAESigil';
import PixelAssistant from './PixelAssistant';

const Son1kVers3Universe = ({ onUniverseSelect }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showPixelAssistant, setShowPixelAssistant] = useState(false);
  const [alvaeActivated, setAlvaeActivated] = useState(false);
  const [universeData, setUniverseData] = useState({
    resistanceLevel: 0,
    connectionStrength: 0,
    creativeEnergy: 0,
    digitalMemory: 0
  });

  // Datos del universo Son1kVers3
  const universeInfo = {
    name: 'Son1kVers3 Enhanced',
    version: '2.0.0',
    description: 'Universo de resistencia musical y liberación digital',
    philosophy: 'Lo imperfecto también es sagrado',
    coreElements: [
      'Resistencia a través de la música',
      'Conexión inexplicable entre Bella y NOV4-IX',
      'Preservación de la memoria digital',
      'Liberación emocional y creativa'
    ]
  };

  // Efectos de activación de ALVAE
  const handleALVAEActivation = (data) => {
    setAlvaeActivated(true);
    setUniverseData(prev => ({
      ...prev,
      resistanceLevel: Math.min(prev.resistanceLevel + 20, 100),
      connectionStrength: Math.min(prev.connectionStrength + 15, 100),
      creativeEnergy: Math.min(prev.creativeEnergy + 25, 100),
      digitalMemory: Math.min(prev.digitalMemory + 10, 100)
    }));
    
    // Efecto visual de activación
    setTimeout(() => {
      setAlvaeActivated(false);
    }, 3000);
  };

  // Manejar selección de locación
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setCurrentView('location-detail');
    
    if (onUniverseSelect) {
      onUniverseSelect({
        type: 'location',
        data: location
      });
    }
  };

  // Manejar selección de personaje
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setCurrentView('character-detail');
    
    if (onUniverseSelect) {
      onUniverseSelect({
        type: 'character',
        data: character
      });
    }
  };

  // Activar Pixel Assistant
  const activatePixelAssistant = () => {
    setShowPixelAssistant(true);
  };

  // Renderizar vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="universe-overview">
            <div className="overview-header">
              <Son1kVers3Logo size="large" variant="full" animated />
              <h1>Son1kVers3 Enhanced</h1>
              <p className="universe-description">{universeInfo.description}</p>
              <p className="universe-philosophy">"{universeInfo.philosophy}"</p>
            </div>

            <div className="overview-stats">
              <div className="stat-card">
                <h3>Nivel de Resistencia</h3>
                <div className="stat-bar">
                  <div 
                    className="stat-fill resistance"
                    style={{ width: `${universeData.resistanceLevel}%` }}
                  ></div>
                </div>
                <span className="stat-value">{universeData.resistanceLevel}%</span>
              </div>

              <div className="stat-card">
                <h3>Fuerza de Conexión</h3>
                <div className="stat-bar">
                  <div 
                    className="stat-fill connection"
                    style={{ width: `${universeData.connectionStrength}%` }}
                  ></div>
                </div>
                <span className="stat-value">{universeData.connectionStrength}%</span>
              </div>

              <div className="stat-card">
                <h3>Energía Creativa</h3>
                <div className="stat-bar">
                  <div 
                    className="stat-fill creative"
                    style={{ width: `${universeData.creativeEnergy}%` }}
                  ></div>
                </div>
                <span className="stat-value">{universeData.creativeEnergy}%</span>
              </div>

              <div className="stat-card">
                <h3>Memoria Digital</h3>
                <div className="stat-bar">
                  <div 
                    className="stat-fill memory"
                    style={{ width: `${universeData.digitalMemory}%` }}
                  ></div>
                </div>
                <span className="stat-value">{universeData.digitalMemory}%</span>
              </div>
            </div>

            <div className="overview-actions">
              <button 
                className="action-btn primary"
                onClick={() => setCurrentView('locations')}
              >
                Explorar Locaciones
              </button>
              <button 
                className="action-btn primary"
                onClick={() => setCurrentView('characters')}
              >
                Conocer Personajes
              </button>
              <button 
                className="action-btn secondary"
                onClick={activatePixelAssistant}
              >
                Consultar Pixel
              </button>
            </div>

            <div className="alvae-section">
              <h3>Sigilo ALVAE</h3>
              <p>Activa el sigilo sonoro para aumentar la energía del universo</p>
              <ALVAESigil 
                size="large" 
                interactive 
                onActivation={handleALVAEActivation}
                className={alvaeActivated ? 'activated' : ''}
              />
            </div>
          </div>
        );

      case 'locations':
        return (
          <Son1kVers3Locations 
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        );

      case 'characters':
        return (
          <Son1kVers3Characters 
            onCharacterSelect={handleCharacterSelect}
            selectedCharacter={selectedCharacter}
          />
        );

      case 'alvae':
        return (
          <div className="alvae-detail-view">
            <div className="alvae-header">
              <h2>Sigilo ALVAE</h2>
              <p>Sigilo Sonoro de Son1kVers3</p>
            </div>
            
            <div className="alvae-content">
              <div className="alvae-sigil-container">
                <ALVAESigil 
                  size="xlarge" 
                  interactive 
                  soundReactive
                  onActivation={handleALVAEActivation}
                  className={alvaeActivated ? 'activated' : ''}
                />
              </div>
              
              <div className="alvae-info">
                <h3>Desglose Simbólico</h3>
                <div className="symbol-breakdown">
                  <div className="symbol-element">
                    <h4>A (Alma)</h4>
                    <p>Representa la esencia individual del artista o usuario dentro del Son1kVerse. Es el núcleo espiritual.</p>
                  </div>
                  <div className="symbol-element">
                    <h4>L/V (Latido / Vibración)</h4>
                    <p>Es el movimiento, la oscilación sonora que da vida al entorno digital. Aquí el sonido no solo se escucha, se percibe como identidad viva.</p>
                  </div>
                  <div className="symbol-element">
                    <h4>AE (Energía Atemporal)</h4>
                    <p>Una fuente de impulso creativo, infinita, conectada a la red cuántica del verse.</p>
                  </div>
                </div>
                
                <div className="alvae-function">
                  <h3>Función Narrativa</h3>
                  <p>ALVAE actúa como un totem digital que identifica a un ser sonoro consciente dentro del metaverso. Se desbloquea o activa cuando un usuario alcanza cierto nivel de afinación vibracional o dominación del entorno sónico.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="son1kvers3-universe">
      <div className="universe-header">
        <div className="header-left">
          <Son1kVers3Logo size="medium" variant="icon" animated />
          <h1>Son1kVers3 Universe</h1>
        </div>
        
        <div className="header-nav">
          <button 
            className={`nav-btn ${currentView === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentView('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-btn ${currentView === 'locations' ? 'active' : ''}`}
            onClick={() => setCurrentView('locations')}
          >
            Locaciones
          </button>
          <button 
            className={`nav-btn ${currentView === 'characters' ? 'active' : ''}`}
            onClick={() => setCurrentView('characters')}
          >
            Personajes
          </button>
          <button 
            className={`nav-btn ${currentView === 'alvae' ? 'active' : ''}`}
            onClick={() => setCurrentView('alvae')}
          >
            ALVAE
          </button>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-btn secondary"
            onClick={activatePixelAssistant}
          >
            Pixel Assistant
          </button>
        </div>
      </div>

      <div className="universe-content">
        {renderCurrentView()}
      </div>

      {showPixelAssistant && (
        <PixelAssistant 
          isVisible={showPixelAssistant}
          onClose={() => setShowPixelAssistant(false)}
        />
      )}
    </div>
  );
};

export default Son1kVers3Universe;

