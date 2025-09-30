import React, { useState, useEffect, useRef } from 'react';
import './NexusLocations.css';

/**
 * 🗺️ Nexus Locations - Sistema de Locaciones Inmersivas
 * Implementa las locaciones del lore de Son1kVers3 en Nexus
 */

const NexusLocations = ({ currentLocation, onLocationChange }) => {
  const [activeHologram, setActiveHologram] = useState(null);
  const [rainIntensity, setRainIntensity] = useState(0.5);
  const [matrixEffect, setMatrixEffect] = useState(false);
  const hologramRef = useRef(null);

  // Efectos de lluvia
  useEffect(() => {
    const rainInterval = setInterval(() => {
      setRainIntensity(Math.random() * 0.8 + 0.2);
    }, 2000);
    return () => clearInterval(rainInterval);
  }, []);

  // Efectos Matrix
  useEffect(() => {
    if (matrixEffect) {
      const matrixInterval = setInterval(() => {
        // Efecto de código Matrix
        const codeElements = document.querySelectorAll('.matrix-code');
        codeElements.forEach(el => {
          el.style.opacity = Math.random();
        });
      }, 100);
      return () => clearInterval(matrixInterval);
    }
  }, [matrixEffect]);

  const locations = {
    resistance_street: {
      name: "Calle de la Resistencia",
      description: "El corazón de la lucha contra XENTRIX Corp",
      elements: [
        { type: "orator", id: "bella_orator", position: "center" },
        { type: "neon_signs", id: "xentrix_signs", position: "buildings" },
        { type: "propaganda", id: "resistance_posters", position: "walls" },
        { type: "rain", id: "cyber_rain", position: "ambient" }
      ]
    },
    sanctuary: {
      name: "El Santuario",
      description: "Refugio de la Liga del No Silencio",
      elements: [
        { type: "piano", id: "ghost_piano", position: "center" },
        { type: "holograms", id: "community_holograms", position: "walls" },
        { type: "resistance_message", id: "manifesto", position: "center" },
        { type: "ghost_audience", id: "spectral_crowd", position: "seats" }
      ]
    },
    ghost_studio: {
      name: "Estudio Fantasma",
      description: "Laboratorio de creación musical",
      elements: [
        { type: "consoles", id: "mixing_consoles", position: "center" },
        { type: "screens", id: "data_screens", position: "walls" },
        { type: "nova_ghost", id: "ai_avatars", position: "floating" },
        { type: "cables", id: "data_cables", position: "ambient" }
      ]
    },
    neon_city: {
      name: "Ciudad de Neón",
      description: "El mundo exterior cyberpunk",
      elements: [
        { type: "platforms", id: "floating_platforms", position: "background" },
        { type: "crowd", id: "user_avatars", position: "foreground" },
        { type: "screens", id: "error_screens", position: "buildings" },
        { type: "engines", id: "energy_cores", position: "sides" }
      ]
    },
    resistance_base: {
      name: "Base de la Resistencia",
      description: "Cuartel secreto de la Liga",
      elements: [
        { type: "xentrix_wall", id: "corporate_wall", position: "center" },
        { type: "lightning_symbol", id: "resistance_portal", position: "wall_center" },
        { type: "cables", id: "orange_cables", position: "floor" },
        { type: "debris", id: "industrial_debris", position: "scattered" }
      ]
    },
    nexus_core: {
      name: "Nexus Core",
      description: "El corazón digital de Son1kVers3",
      elements: [
        { type: "tower", id: "control_tower", position: "center" },
        { type: "antennas", id: "communication_array", position: "tower_top" },
        { type: "data_streams", id: "cascading_data", position: "tower_base" },
        { type: "screens", id: "status_screens", position: "tower_sides" }
      ]
    }
  };

  const holograms = {
    bella_orator: {
      name: "BELLA.exe - Oradora de la Resistencia",
      message: "Lo imperfecto también es sagrado. Cada nota que creamos es un acto de resistencia contra la homogenización musical.",
      animation: "speaking",
      color: "#00ffff",
      position: { x: 50, y: 30 }
    },
    community_holograms: {
      name: "Hologramas de la Comunidad",
      message: "Canciones más populares, colaboraciones destacadas, mensajes de la resistencia",
      animation: "floating",
      color: "#ff00ff",
      position: { x: 20, y: 40 }
    },
    nova_ghost: {
      name: "Nova & Ghost - Asistentes IA",
      message: "Somos tus compañeros en la creación musical. Juntos podemos desafiar a XENTRIX Corp.",
      animation: "orbiting",
      color: "#00ff00",
      position: { x: 70, y: 50 }
    },
    resistance_message: {
      name: "Manifiesto de la Resistencia",
      message: "Cualquier comentario sobre una canción es subjetivo. Nadie puede decir lo que está bien y lo que está mal.",
      animation: "pulsing",
      color: "#ffff00",
      position: { x: 50, y: 60 }
    }
  };

  const handleHologramClick = (hologramId) => {
    setActiveHologram(hologramId);
    // Efecto de sonido
    const audio = new Audio('/sounds/hologram_activate.mp3');
    audio.play().catch(() => {});
  };

  const renderLocation = (locationKey) => {
    const location = locations[locationKey];
    if (!location) return null;

    return (
      <div className={`nexus-location ${locationKey}`} key={locationKey}>
        <div className="location-background">
          {location.elements.map(element => renderElement(element, locationKey))}
        </div>
        
        {/* Hologramas flotantes */}
        <div className="holograms-container">
          {Object.entries(holograms).map(([id, hologram]) => (
            <div
              key={id}
              className={`hologram ${hologram.animation} ${activeHologram === id ? 'active' : ''}`}
              style={{
                left: `${hologram.position.x}%`,
                top: `${hologram.position.y}%`,
                '--hologram-color': hologram.color
              }}
              onClick={() => handleHologramClick(id)}
            >
              <div className="hologram-content">
                <h3>{hologram.name}</h3>
                <p>{hologram.message}</p>
                <div className="hologram-effects">
                  <div className="scan-line"></div>
                  <div className="glitch-effect"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Efectos ambientales */}
        {renderAmbientEffects(locationKey)}
      </div>
    );
  };

  const renderElement = (element, locationKey) => {
    switch (element.type) {
      case 'orator':
        return (
          <div key={element.id} className="orator-element">
            <div className="orator-avatar">
              <div className="cyber-tattoos"></div>
              <div className="megaphone"></div>
            </div>
          </div>
        );
      
      case 'neon_signs':
        return (
          <div key={element.id} className="neon-signs">
            <div className="xentrix-sign">SON1KVERS3</div>
            <div className="resistance-sign">LA RESISTENCIA</div>
          </div>
        );
      
      case 'piano':
        return (
          <div key={element.id} className="ghost-piano">
            <div className="piano-body"></div>
            <div className="piano-keys"></div>
            <div className="neon-lights"></div>
          </div>
        );
      
      case 'consoles':
        return (
          <div key={element.id} className="mixing-consoles">
            <div className="console-panel"></div>
            <div className="faders"></div>
            <div className="screens"></div>
          </div>
        );
      
      case 'tower':
        return (
          <div key={element.id} className="control-tower">
            <div className="tower-base"></div>
            <div className="tower-top"></div>
            <div className="antennas"></div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderAmbientEffects = (locationKey) => {
    return (
      <>
        {/* Efecto de lluvia */}
        <div 
          className="rain-effect"
          style={{ opacity: rainIntensity }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="rain-drop" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 1}s`
            }}></div>
          ))}
        </div>

        {/* Efecto Matrix */}
        {matrixEffect && (
          <div className="matrix-effect">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="matrix-code" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}>
                {Math.random().toString(36).substring(2, 8)}
              </div>
            ))}
          </div>
        )}

        {/* Partículas de datos */}
        <div className="data-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}></div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="nexus-locations-container">
      <div className="location-selector">
        {Object.entries(locations).map(([key, location]) => (
          <button
            key={key}
            className={`location-btn ${currentLocation === key ? 'active' : ''}`}
            onClick={() => onLocationChange(key)}
          >
            {location.name}
          </button>
        ))}
      </div>

      <div className="location-viewer">
        {renderLocation(currentLocation)}
      </div>

      {/* Panel de hologramas activos */}
      {activeHologram && (
        <div className="hologram-panel">
          <div className="hologram-info">
            <h3>{holograms[activeHologram]?.name}</h3>
            <p>{holograms[activeHologram]?.message}</p>
            <button onClick={() => setActiveHologram(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Controles de efectos */}
      <div className="effects-controls">
        <button 
          onClick={() => setMatrixEffect(!matrixEffect)}
          className={matrixEffect ? 'active' : ''}
        >
          Matrix Effect
        </button>
        <button onClick={() => setRainIntensity(Math.random())}>
          Cambiar Lluvia
        </button>
      </div>
    </div>
  );
};

export default NexusLocations;
