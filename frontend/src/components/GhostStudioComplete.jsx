import React, { useState } from 'react';
import './GhostStudioComplete.css';
import GhostStudioKnobs from './IntuitiveMusicGenerator';
import IntuitiveMusicGenerator from './IntuitiveMusicGenerator';

const GhostStudioComplete = ({ services }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [ghostSettings, setGhostSettings] = useState({});

  const handleGhostSettingsChange = (settings) => {
    setGhostSettings(settings);
    console.log('Ghost Studio Settings Updated:', settings);
  };

  const handleGenerateWithGhost = async (prompt, settings) => {
    // Combinar el prompt original con los ajustes de Ghost Studio
    const modifiedPrompt = generateModifiedPrompt(prompt, ghostSettings);
    console.log('Generating with Ghost Studio:', modifiedPrompt);
    
    try {
      // Llamar a la API de Suno a través del backend
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: modifiedPrompt,
          duration: settings.duration || 30,
          tempo: settings.tempo || 128,
          key: settings.key || 'C',
          style: ghostSettings.rarity > 70 ? 'experimental' : 'standard',
          ghostSettings: ghostSettings
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Música generada exitosamente:', result);
        // Aquí se manejaría el resultado de la generación
        if (services?.webAudio) {
          services.webAudio.playGeneratedMusic(result.audioUrl);
        }
      } else {
        console.error('Error generando música:', result.error);
        alert('Error generando música: ' + result.error);
      }
    } catch (error) {
      console.error('Error en la generación:', error);
      alert('Error conectando con Suno API');
    }
  };

  const generateModifiedPrompt = (originalPrompt, ghostSettings) => {
    let modifiedPrompt = originalPrompt;
    
    // Aplicar modificaciones basadas en los knobs de Ghost Studio
    if (ghostSettings.rarity > 70) {
      modifiedPrompt += " experimental avant-garde unconventional";
    }
    
    if (ghostSettings.trash > 50) {
      modifiedPrompt += " lo-fi garage distorted raw";
    }
    
    if (ghostSettings.expressiveness > 50) {
      modifiedPrompt += " emotional expressive passionate";
    } else if (ghostSettings.expressiveness < -50) {
      modifiedPrompt += " melancholic contemplative introspective";
    }
    
    if (ghostSettings.intensity > 70) {
      modifiedPrompt += " intense powerful dynamic";
    }
    
    if (ghostSettings.fluidity > 60) {
      modifiedPrompt += " smooth flowing organic";
    }
    
    if (ghostSettings.theatricality > 60) {
      modifiedPrompt += " dramatic cinematic epic";
    }
    
    if (ghostSettings.mystery > 50) {
      modifiedPrompt += " mysterious enigmatic ethereal";
    }
    
    return modifiedPrompt;
  };

  return (
    <div className="ghost-studio-complete">
      <div className="ghost-header">
        <h1>👻 Ghost Studio - Creative Control Center</h1>
        <p>Interfaz intuitiva con controles creativos avanzados</p>
      </div>

      <div className="ghost-tabs">
        <button 
          className={`ghost-tab ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          🎵 Music Generator
        </button>
        <button 
          className={`ghost-tab ${activeTab === 'knobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('knobs')}
        >
          🎛️ Creative Knobs
        </button>
        <button 
          className={`ghost-tab ${activeTab === 'combined' ? 'active' : ''}`}
          onClick={() => setActiveTab('combined')}
        >
          ⚡ Combined Mode
        </button>
      </div>

      <div className="ghost-content">
        {activeTab === 'generator' && (
          <div className="ghost-section">
            <IntuitiveMusicGenerator 
              services={services}
              onGenerate={handleGenerateWithGhost}
            />
          </div>
        )}

        {activeTab === 'knobs' && (
          <div className="ghost-section">
            <GhostStudioKnobs 
              onSettingsChange={handleGhostSettingsChange}
              initialSettings={ghostSettings}
            />
          </div>
        )}

        {activeTab === 'combined' && (
          <div className="ghost-section combined-mode">
            <div className="combined-layout">
              <div className="generator-panel">
                <h3>🎵 Music Generator</h3>
                <IntuitiveMusicGenerator 
                  services={services}
                  onGenerate={handleGenerateWithGhost}
                  compact={true}
                />
              </div>
              
              <div className="knobs-panel">
                <h3>🎛️ Creative Controls</h3>
                <GhostStudioKnobs 
                  onSettingsChange={handleGhostSettingsChange}
                  initialSettings={ghostSettings}
                  compact={true}
                />
              </div>
            </div>
            
            <div className="ghost-preview">
              <h3>📝 Generated Prompt Preview</h3>
              <div className="prompt-preview">
                {ghostSettings.rarity || ghostSettings.trash || ghostSettings.expressiveness ? 
                  generateModifiedPrompt("Your creative prompt here...", ghostSettings) :
                  "Adjust the knobs to see how they modify your prompts..."
                }
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ghost-footer">
        <div className="ghost-info">
          <p>✨ Ghost Studio combines intuitive music generation with creative control knobs</p>
          <p>🎛️ Use the knobs to add unique character and style to your music</p>
        </div>
      </div>
    </div>
  );
};

export default GhostStudioComplete;
