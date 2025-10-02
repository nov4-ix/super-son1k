/**
 * 🌆 Son1kVers3 Locations Component
 * Componente visual para mostrar las ubicaciones del universo
 * Basado en las imágenes conceptuales del Son1kVerse
 */

import React, { useState, useEffect } from 'react';
import './Son1kVers3Locations.css';

const Son1kVers3Locations = ({ currentLocation = 'nexus', onLocationChange }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeLocation, setActiveLocation] = useState(currentLocation);

  const locations = {
    nexus: {
      name: 'El Nexus',
      description: 'Espacio principal inmersivo, centro de la experiencia cyberpunk',
      atmosphere: 'Pasillos tecnológicos con cables de energía pulsante',
      mood: 'Misterioso y tecnológico',
      colors: ['#00bfff', '#ff49c3', '#ffcc00'],
      image: 'nexus-corridors.jpg', // Imagen de los pasillos cyberpunk
      character: 'NOV4-IX navega por los corredores digitales'
    },
    terminal: {
      name: 'La Terminal',
      description: 'Escenario flotante sobre aeropuerto en ruinas, símbolo de rebelión',
      atmosphere: 'Concierto masivo en estructura industrial abandonada',
      mood: 'Épico y rebelde',
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
      image: 'terminal-concert.jpg', // Imagen del concierto en el aeropuerto
      character: 'Miles de personas se reúnen para La Resistencia'
    },
    ghostStudio: {
      name: 'Ghost Studio',
      description: 'IA que transforma maquetas en producciones profesionales',
      atmosphere: 'Estudio futurista con hologramas y tecnología avanzada',
      mood: 'Creativo y tecnológico',
      colors: ['#9b59b6', '#3498db', '#e74c3c'],
      image: 'ghost-studio.jpg', // Imagen del estudio holográfico
      character: 'Donde la magia musical cobra vida'
    },
    archivo: {
      name: 'El Archivo',
      description: 'Cámara sellada de obras perdidas, custodiada por Pixel',
      atmosphere: 'Teatro abandonado con piano solitario y energía cósmica',
      mood: 'Melancólico y nostálgico',
      colors: ['#2c3e50', '#8e44ad', '#16a085'],
      image: 'abandoned-theater.jpg', // Imagen del teatro con piano
      character: 'Pixel preserva las melodías que XentriX quiere borrar'
    },
    resistance: {
      name: 'Calles de la Resistencia',
      description: 'Zonas urbanas donde La Resistencia lucha contra XentriX',
      atmosphere: 'Calles post-apocalípticas con propaganda y rebelión',
      mood: 'Intenso y combativo',
      colors: ['#e74c3c', '#f39c12', '#27ae60'],
      image: 'resistance-streets.jpg', // Imagen de NOV4-IX con megáfono
      character: 'NOV4-IX lidera la rebelión sonora'
    }
  };

  const handleLocationChange = (locationKey) => {
    if (locationKey === activeLocation) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveLocation(locationKey);
      if (onLocationChange) {
        onLocationChange(locationKey);
      }
      setIsTransitioning(false);
    }, 500);
  };

  const currentLocationData = locations[activeLocation];

  return (
    <div className="son1kvers3-locations">
      {/* Header con navegación de ubicaciones */}
      <div className="locations-header">
        <h2 className="locations-title">Explora el Son1kVerse</h2>
        <div className="location-tabs">
          {Object.entries(locations).map(([key, location]) => (
            <button
              key={key}
              className={`location-tab ${activeLocation === key ? 'active' : ''}`}
              onClick={() => handleLocationChange(key)}
              style={{
                '--location-color': location.colors[0]
              }}
            >
              <span className="tab-icon">
                {key === 'nexus' && '🌐'}
                {key === 'terminal' && '✈️'}
                {key === 'ghostStudio' && '👻'}
                {key === 'archivo' && '📚'}
                {key === 'resistance' && '⚔️'}
              </span>
              <span className="tab-name">{location.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal de la ubicación */}
      <div className={`location-content ${isTransitioning ? 'transitioning' : ''}`}>
        {/* Imagen de fondo de la ubicación */}
        <div 
          className="location-background"
          style={{
            '--primary-color': currentLocationData.colors[0],
            '--secondary-color': currentLocationData.colors[1],
            '--accent-color': currentLocationData.colors[2]
          }}
        >
          {/* Overlay con gradiente */}
          <div className="location-overlay"></div>
          
          {/* Efectos de partículas */}
          <div className="location-particles">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  '--delay': `${i * 0.1}s`,
                  '--color': currentLocationData.colors[i % 3]
                }}
              />
            ))}
          </div>
        </div>

        {/* Información de la ubicación */}
        <div className="location-info">
          <div className="location-details">
            <h3 className="location-name">{currentLocationData.name}</h3>
            <p className="location-description">{currentLocationData.description}</p>
            
            <div className="location-atmosphere">
              <h4>Atmósfera</h4>
              <p>{currentLocationData.atmosphere}</p>
            </div>
            
            <div className="location-character">
              <h4>Narrativa</h4>
              <p>{currentLocationData.character}</p>
            </div>
            
            <div className="location-mood">
              <span className="mood-indicator" style={{ color: currentLocationData.colors[0] }}>
                {currentLocationData.mood}
              </span>
            </div>
          </div>

          {/* Controles de interacción */}
          <div className="location-controls">
            <button className="explore-btn">
              <span className="btn-icon">🔍</span>
              Explorar
            </button>
            <button className="enter-btn">
              <span className="btn-icon">🚪</span>
              Entrar
            </button>
            <button className="create-btn">
              <span className="btn-icon">🎵</span>
              Crear Aquí
            </button>
          </div>
        </div>

        {/* Elementos interactivos específicos de cada ubicación */}
        <div className="location-interactive">
          {activeLocation === 'nexus' && (
            <div className="nexus-elements">
              <div className="energy-cables">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="cable" style={{ '--delay': `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          
          {activeLocation === 'terminal' && (
            <div className="terminal-elements">
              <div className="concert-crowd">
                <div className="crowd-silhouette"></div>
                <div className="stage-lights"></div>
              </div>
            </div>
          )}
          
          {activeLocation === 'ghostStudio' && (
            <div className="studio-elements">
              <div className="hologram-display">
                <div className="hologram-data"></div>
              </div>
            </div>
          )}
          
          {activeLocation === 'archivo' && (
            <div className="archivo-elements">
              <div className="piano-silhouette">
                <div className="piano-keys"></div>
                <div className="cosmic-energy"></div>
              </div>
            </div>
          )}
          
          {activeLocation === 'resistance' && (
            <div className="resistance-elements">
              <div className="propaganda-screens">
                <div className="xentrix-logo"></div>
                <div className="resistance-graffiti"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de transición */}
      {isTransitioning && (
        <div className="transition-overlay">
          <div className="transition-effect">
            <div className="matrix-rain">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="rain-column">
                  {[...Array(20)].map((_, j) => (
                    <span key={j} className="rain-char">
                      {Math.random() > 0.5 ? '0' : '1'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="transition-message">
              <h3>Transportando al {locations[activeLocation]?.name}...</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Son1kVers3Locations;