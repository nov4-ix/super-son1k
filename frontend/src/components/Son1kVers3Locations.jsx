import React, { useState, useEffect } from 'react';
import './Son1kVers3Locations.css';

const Son1kVers3Locations = ({ onLocationSelect, selectedLocation = null }) => {
  const [currentLocation, setCurrentLocation] = useState(selectedLocation);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const locations = [
    {
      id: 'la-terminal',
      name: 'LA TERMINAL',
      subtitle: 'FLOATING STAGE / ABOVE RUINED AIRPORT',
      description: 'Escenario flotante sobre aeropuerto en ruinas, símbolo de rebelión cultural y resistencia musical.',
      atmosphere: 'Concierto masivo de resistencia con luces neón púrpura y azul, multitudes reunidas bajo estructuras industriales elevadas.',
      characters: ['Bella', 'NOV4-IX', 'Pixel'],
      music: 'Música de resistencia, cyberpunk, electrónica industrial',
      color: '#ff00ff',
      background: 'linear-gradient(135deg, #1a0a2e, #16213e, #0f3460)',
      elements: ['Plataforma flotante', 'Luces neón', 'Multitudes', 'Estructuras industriales', 'Pantallas de error']
    },
    {
      id: 'the-archive',
      name: 'THE ARCHIVE',
      subtitle: 'SEALED CHAMBER / OF FORBIDDEN WORKS',
      description: 'Cámara sellada de obras perdidas, custodiada por Pixel, donde se preserva la memoria digital de la resistencia.',
      atmosphere: 'Cámara misteriosa con puertas ornamentadas, máscaras talladas y luces púrpura, evoca un lugar sagrado del conocimiento.',
      characters: ['Pixel', 'Bella', 'NOV4-IX'],
      music: 'Música ambiental, experimental, sonidos digitales',
      color: '#8b5cf6',
      background: 'linear-gradient(135deg, #2d1b69, #11998e, #38ef7d)',
      elements: ['Puertas ornamentadas', 'Máscaras talladas', 'Luces púrpura', 'Cámara sellada', 'Conocimiento prohibido']
    },
    {
      id: 'ghost-studio',
      name: 'GHOST STUDIO',
      subtitle: 'UNDERGROUND / DUSTY STUDIO',
      description: 'Estudio subterráneo abandonado donde se crea música en la clandestinidad, lleno de equipos vintage y polvo del tiempo.',
      atmosphere: 'Estudio abandonado con equipos vintage, luces azules tenues, polvo flotando en el aire, sensación de creatividad olvidada.',
      characters: ['Bella', 'Pixel', 'Músicos clandestinos'],
      music: 'Música experimental, lo-fi, sonidos vintage',
      color: '#00ffff',
      background: 'linear-gradient(135deg, #0c4a6e, #075985, #0369a1)',
      elements: ['Equipos vintage', 'Polvo flotante', 'Luces azules', 'Cables', 'Creatividad olvidada']
    },
    {
      id: 'dead-zone',
      name: 'DEAD ZONE',
      subtitle: 'RUINED, VANDALIZED / ARTS DISTRICT',
      description: 'Distrito artístico devastado, donde el arte se resiste a morir entre la destrucción y el caos urbano.',
      atmosphere: 'Zona devastada con escombros, cristal rojo suspendido, edificios dañados, sensación de resistencia artística en la destrucción.',
      characters: ['Artistas de la resistencia', 'Bella', 'NOV4-IX'],
      music: 'Música industrial, noise, experimental',
      color: '#ff4444',
      background: 'linear-gradient(135deg, #7c2d12, #dc2626, #ef4444)',
      elements: ['Escombros', 'Cristal rojo', 'Edificios dañados', 'Graffiti', 'Resistencia artística']
    },
    {
      id: 'xentrix-corp',
      name: 'XENTRIX CORP',
      subtitle: 'CORPORATE TOWER / OF CONTROL',
      description: 'Torre corporativa de XentriX, símbolo del control y la opresión que debe ser resistida.',
      atmosphere: 'Estructura industrial masiva con símbolos corporativos, cables naranjas brillantes, escombros, sensación de opresión y control.',
      characters: ['Ejecutivos de XentriX', 'NOV4-IX', 'Resistencia'],
      music: 'Música industrial, electrónica oscura, sonidos corporativos',
      color: '#ff8c00',
      background: 'linear-gradient(135deg, #1f2937, #374151, #4b5563)',
      elements: ['Símbolos corporativos', 'Cables naranjas', 'Escombros', 'Control', 'Opresión']
    },
    {
      id: 'cyber-alley',
      name: 'CYBER ALLEY',
      subtitle: 'NEON-LIT / UNDERGROUND PASSAGE',
      description: 'Callejón cyberpunk con cables naranjas brillantes, donde la tecnología y la decadencia se encuentran.',
      atmosphere: 'Callejón estrecho con cables naranjas brillantes, edificios altos, partículas flotantes, sensación de tecnología decadente.',
      characters: ['Cibernautas', 'NOV4-IX', 'Hackers'],
      music: 'Música cyberpunk, synthwave, electrónica',
      color: '#ff6b35',
      background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
      elements: ['Cables naranjas', 'Edificios altos', 'Partículas', 'Tecnología decadente', 'Neon']
    },
    {
      id: 'resistance-concert',
      name: 'RESISTANCE CONCERT',
      subtitle: 'MASSIVE OUTDOOR / GATHERING',
      description: 'Concierto masivo de resistencia bajo estructuras industriales elevadas, donde la música une a la gente.',
      atmosphere: 'Concierto masivo con pantallas de error, luces púrpura y azul, multitudes, estructuras industriales, sensación de unidad y resistencia.',
      characters: ['Bella', 'NOV4-IX', 'Multitudes', 'Músicos'],
      music: 'Música de resistencia, rock industrial, electrónica',
      color: '#8b5cf6',
      background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)',
      elements: ['Pantallas de error', 'Luces púrpura', 'Multitudes', 'Estructuras industriales', 'Unidad']
    },
    {
      id: 'syntax-hq',
      name: 'S.I.N.T.A.X HQ',
      subtitle: 'AI COMMAND CENTER / OF CONTROL',
      description: 'Centro de comando de la IA S.I.N.T.A.X, donde se controla la red digital y se vigila a la resistencia.',
      atmosphere: 'Centro de comando futurista con pantallas de código binario, luces rojas, sensación de vigilancia y control digital.',
      characters: ['S.I.N.T.A.X', 'NOV4-IX', 'Hackers'],
      music: 'Música electrónica, ambient, sonidos digitales',
      color: '#ef4444',
      background: 'linear-gradient(135deg, #1f2937, #111827, #000000)',
      elements: ['Código binario', 'Luces rojas', 'Vigilancia', 'Control digital', 'IA']
    }
  ];

  const handleLocationSelect = (location) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentLocation(location);
    
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const getLocationById = (id) => {
    return locations.find(loc => loc.id === id);
  };

  const currentLocationData = currentLocation ? getLocationById(currentLocation) : null;

  return (
    <div className="son1kvers3-locations">
      <div className="locations-header">
        <h2>Locaciones de Son1kVers3</h2>
        <p>Explora los lugares icónicos del universo de resistencia</p>
      </div>

      <div className="locations-grid">
        {locations.map((location) => (
          <div
            key={location.id}
            className={`location-card ${currentLocation === location.id ? 'selected' : ''}`}
            onClick={() => handleLocationSelect(location.id)}
            style={{
              '--location-color': location.color,
              '--location-bg': location.background
            }}
          >
            <div className="location-header">
              <h3 className="location-name">{location.name}</h3>
              <p className="location-subtitle">{location.subtitle}</p>
            </div>
            
            <div className="location-content">
              <p className="location-description">{location.description}</p>
              
              <div className="location-details">
                <div className="detail-section">
                  <h4>Atmósfera</h4>
                  <p>{location.atmosphere}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Personajes</h4>
                  <div className="characters-list">
                    {location.characters.map((character, index) => (
                      <span key={index} className="character-tag">
                        {character}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Música</h4>
                  <p className="music-style">{location.music}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Elementos</h4>
                  <div className="elements-list">
                    {location.elements.map((element, index) => (
                      <span key={index} className="element-tag">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="location-footer">
              <div className="location-color-indicator"></div>
              <span className="location-id">#{location.id}</span>
            </div>
          </div>
        ))}
      </div>

      {currentLocationData && (
        <div className={`location-detail-panel ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="detail-panel-header">
            <h3>{currentLocationData.name}</h3>
            <p>{currentLocationData.subtitle}</p>
          </div>
          
          <div className="detail-panel-content">
            <div className="atmosphere-preview">
              <h4>Atmósfera Visual</h4>
              <div 
                className="atmosphere-visual"
                style={{ background: currentLocationData.background }}
              >
                <div className="atmosphere-overlay">
                  <div className="atmosphere-elements">
                    {currentLocationData.elements.slice(0, 3).map((element, index) => (
                      <div key={index} className="atmosphere-element">
                        {element}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="location-actions">
              <button className="action-btn primary">
                Explorar Ubicación
              </button>
              <button className="action-btn secondary">
                Ver Personajes
              </button>
              <button className="action-btn secondary">
                Escuchar Música
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Son1kVers3Locations;

