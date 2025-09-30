import React, { useState, useEffect } from 'react';
import './GhostStudioKnobs.css';

const GhostStudioKnobs = ({ onSettingsChange, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    // Knobs principales
    rarity: initialSettings.rarity || 50,        // 0-100%
    trash: initialSettings.trash || 30,          // 0-100%
    expressiveness: initialSettings.expressiveness || 0, // -100% to +100%
    
    // Knobs adicionales
    intensity: initialSettings.intensity || 50,  // 0-100%
    fluidity: initialSettings.fluidity || 50,    // 0-100%
    theatricality: initialSettings.theatricality || 30, // 0-100%
    mystery: initialSettings.mystery || 20,      // 0-100%
    
    // Configuración
    autoPrompt: initialSettings.autoPrompt || true,
    showAdvanced: initialSettings.showAdvanced || false
  });

  const [isDragging, setIsDragging] = useState(null);
  const [lastMouseY, setLastMouseY] = useState(0);

  // Actualizar configuración
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Generar prompt modificado basado en knobs
  const generateModifiedPrompt = (originalPrompt) => {
    let modifiedPrompt = originalPrompt;
    
    // Aplicar modificaciones basadas en knobs
    const modifications = [];
    
    // Rareza
    if (settings.rarity > 60) {
      modifications.push("experimental, unconventional, avant-garde");
    } else if (settings.rarity < 30) {
      modifications.push("mainstream, commercial, radio-friendly");
    }
    
    // Trash
    if (settings.trash > 70) {
      modifications.push("lo-fi, distorted, garage, trash");
    } else if (settings.trash < 30) {
      modifications.push("clean, polished, high-fidelity");
    }
    
    // Expresividad
    if (settings.expressiveness > 60) {
      modifications.push("euphoric, ecstatic, intense, overwhelming");
    } else if (settings.expressiveness < -60) {
      modifications.push("melancholic, sad, nostalgic, haunting");
    } else if (settings.expressiveness > 20) {
      modifications.push("energetic, dynamic, uplifting");
    } else if (settings.expressiveness < -20) {
      modifications.push("contemplative, serene, reflective");
    }
    
    // Intensidad
    if (settings.intensity > 70) {
      modifications.push("dense, complex, wall of sound");
    } else if (settings.intensity < 30) {
      modifications.push("minimalist, sparse, spacious");
    }
    
    // Fluidez
    if (settings.fluidity > 70) {
      modifications.push("fluid, flowing, melodic");
    } else if (settings.fluidity < 30) {
      modifications.push("rhythmic, percussive, staccato");
    }
    
    // Teatralidad
    if (settings.theatricality > 70) {
      modifications.push("dramatic, theatrical, operatic");
    } else if (settings.theatricality < 30) {
      modifications.push("subtle, minimal, understated");
    }
    
    // Misterio
    if (settings.mystery > 70) {
      modifications.push("mysterious, enigmatic, mystical, occult");
    } else if (settings.mystery < 30) {
      modifications.push("direct, clear, straightforward");
    }
    
    // Combinar modificaciones
    if (modifications.length > 0) {
      modifiedPrompt += `. Style: ${modifications.join(', ')}`;
    }
    
    return modifiedPrompt;
  };

  // Manejar arrastre de knobs
  const handleMouseDown = (knobName, e) => {
    setIsDragging(knobName);
    setLastMouseY(e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaY = lastMouseY - e.clientY;
    const sensitivity = 2;
    const currentValue = settings[isDragging];
    
    let newValue;
    if (isDragging === 'expressiveness') {
      // Expresividad va de -100 a +100
      newValue = Math.max(-100, Math.min(100, currentValue + deltaY * sensitivity));
    } else {
      // Otros knobs van de 0 a 100
      newValue = Math.max(0, Math.min(100, currentValue + deltaY * sensitivity));
    }
    
    updateSetting(isDragging, newValue);
    setLastMouseY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Efectos
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, lastMouseY]);

  // Formatear valor para display
  const formatValue = (value, isExpressiveness = false) => {
    if (isExpressiveness) {
      return value > 0 ? `+${value}%` : `${value}%`;
    }
    return `${value}%`;
  };

  // Obtener color del knob basado en valor
  const getKnobColor = (value, isExpressiveness = false) => {
    if (isExpressiveness) {
      if (value > 60) return '#ff6b6b'; // Rojo para euforia
      if (value > 20) return '#ff8c00'; // Naranja para energía
      if (value > -20) return '#4ecdc4'; // Verde para neutral
      if (value > -60) return '#45b7d1'; // Azul para contemplativo
      return '#9b59b6'; // Púrpura para melancólico
    }
    
    if (value > 80) return '#ff6b6b'; // Rojo para extremo
    if (value > 60) return '#ff8c00'; // Naranja para alto
    if (value > 40) return '#4ecdc4'; // Verde para medio
    if (value > 20) return '#45b7d1'; // Azul para bajo
    return '#9b59b6'; // Púrpura para mínimo
  };

  return (
    <div className="ghost-studio-knobs">
      <div className="knobs-header">
        <h3>Ghost Studio - Creative Controls</h3>
        <div className="knobs-controls">
          <label className="auto-prompt-toggle">
            <input
              type="checkbox"
              checked={settings.autoPrompt}
              onChange={(e) => updateSetting('autoPrompt', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Auto Prompt</span>
          </label>
          <button 
            className="advanced-btn"
            onClick={() => updateSetting('showAdvanced', !settings.showAdvanced)}
          >
            {settings.showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
      </div>

      <div className="knobs-grid">
        {/* Knobs principales */}
        <div className="knob-section main-knobs">
          <h4>Core Controls</h4>
          
          {/* Rareza */}
          <div className="knob-container">
            <div className="knob-label">RARITY</div>
            <div 
              className="knob"
              style={{ '--knob-color': getKnobColor(settings.rarity) }}
              onMouseDown={(e) => handleMouseDown('rarity', e)}
            >
              <div className="knob-ring">
                <div 
                  className="knob-pointer"
                  style={{ 
                    transform: `rotate(${settings.rarity * 3.6 - 180}deg)` 
                  }}
                ></div>
              </div>
              <div className="knob-value">{formatValue(settings.rarity)}</div>
            </div>
            <div className="knob-description">
              {settings.rarity < 30 ? 'Conventional' : 
               settings.rarity < 60 ? 'Experimental' : 
               settings.rarity < 80 ? 'Avant-garde' : 'Chaos'}
            </div>
          </div>

          {/* Trash */}
          <div className="knob-container">
            <div className="knob-label">TRASH</div>
            <div 
              className="knob"
              style={{ '--knob-color': getKnobColor(settings.trash) }}
              onMouseDown={(e) => handleMouseDown('trash', e)}
            >
              <div className="knob-ring">
                <div 
                  className="knob-pointer"
                  style={{ 
                    transform: `rotate(${settings.trash * 3.6 - 180}deg)` 
                  }}
                ></div>
              </div>
              <div className="knob-value">{formatValue(settings.trash)}</div>
            </div>
            <div className="knob-description">
              {settings.trash < 30 ? 'Clean' : 
               settings.trash < 60 ? 'Raw' : 
               settings.trash < 80 ? 'Garage' : 'Trash'}
            </div>
          </div>

          {/* Expresividad */}
          <div className="knob-container">
            <div className="knob-label">EXPRESSIVENESS</div>
            <div 
              className="knob expressiveness-knob"
              style={{ '--knob-color': getKnobColor(settings.expressiveness, true) }}
              onMouseDown={(e) => handleMouseDown('expressiveness', e)}
            >
              <div className="knob-ring">
                <div 
                  className="knob-pointer"
                  style={{ 
                    transform: `rotate(${(settings.expressiveness + 100) * 1.8 - 180}deg)` 
                  }}
                ></div>
              </div>
              <div className="knob-value">{formatValue(settings.expressiveness, true)}</div>
            </div>
            <div className="knob-description">
              {settings.expressiveness < -60 ? 'Melancholic' : 
               settings.expressiveness < -20 ? 'Contemplative' : 
               settings.expressiveness < 20 ? 'Neutral' : 
               settings.expressiveness < 60 ? 'Energetic' : 'Euphoric'}
            </div>
          </div>
        </div>

        {/* Knobs avanzados */}
        {settings.showAdvanced && (
          <div className="knob-section advanced-knobs">
            <h4>Advanced Controls</h4>
            
            {/* Intensidad */}
            <div className="knob-container">
              <div className="knob-label">INTENSITY</div>
              <div 
                className="knob"
                style={{ '--knob-color': getKnobColor(settings.intensity) }}
                onMouseDown={(e) => handleMouseDown('intensity', e)}
              >
                <div className="knob-ring">
                  <div 
                    className="knob-pointer"
                    style={{ 
                      transform: `rotate(${settings.intensity * 3.6 - 180}deg)` 
                    }}
                  ></div>
                </div>
                <div className="knob-value">{formatValue(settings.intensity)}</div>
              </div>
              <div className="knob-description">
                {settings.intensity < 30 ? 'Minimalist' : 
                 settings.intensity < 70 ? 'Balanced' : 'Dense'}
              </div>
            </div>

            {/* Fluidez */}
            <div className="knob-container">
              <div className="knob-label">FLUIDITY</div>
              <div 
                className="knob"
                style={{ '--knob-color': getKnobColor(settings.fluidity) }}
                onMouseDown={(e) => handleMouseDown('fluidity', e)}
              >
                <div className="knob-ring">
                  <div 
                    className="knob-pointer"
                    style={{ 
                      transform: `rotate(${settings.fluidity * 3.6 - 180}deg)` 
                    }}
                  ></div>
                </div>
                <div className="knob-value">{formatValue(settings.fluidity)}</div>
              </div>
              <div className="knob-description">
                {settings.fluidity < 30 ? 'Rhythmic' : 
                 settings.fluidity < 70 ? 'Balanced' : 'Fluid'}
              </div>
            </div>

            {/* Teatralidad */}
            <div className="knob-container">
              <div className="knob-label">THEATRICALITY</div>
              <div 
                className="knob"
                style={{ '--knob-color': getKnobColor(settings.theatricality) }}
                onMouseDown={(e) => handleMouseDown('theatricality', e)}
              >
                <div className="knob-ring">
                  <div 
                    className="knob-pointer"
                    style={{ 
                      transform: `rotate(${settings.theatricality * 3.6 - 180}deg)` 
                    }}
                  ></div>
                </div>
                <div className="knob-value">{formatValue(settings.theatricality)}</div>
              </div>
              <div className="knob-description">
                {settings.theatricality < 30 ? 'Subtle' : 
                 settings.theatricality < 70 ? 'Moderate' : 'Dramatic'}
              </div>
            </div>

            {/* Misterio */}
            <div className="knob-container">
              <div className="knob-label">MYSTERY</div>
              <div 
                className="knob"
                style={{ '--knob-color': getKnobColor(settings.mystery) }}
                onMouseDown={(e) => handleMouseDown('mystery', e)}
              >
                <div className="knob-ring">
                  <div 
                    className="knob-pointer"
                    style={{ 
                      transform: `rotate(${settings.mystery * 3.6 - 180}deg)` 
                    }}
                  ></div>
                </div>
                <div className="knob-value">{formatValue(settings.mystery)}</div>
              </div>
              <div className="knob-description">
                {settings.mystery < 30 ? 'Direct' : 
                 settings.mystery < 70 ? 'Mysterious' : 'Occult'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview del prompt modificado */}
      <div className="prompt-preview">
        <h4>Modified Prompt Preview</h4>
        <div className="prompt-display">
          {generateModifiedPrompt("A beautiful song about love")}
        </div>
      </div>
    </div>
  );
};

export default GhostStudioKnobs;

