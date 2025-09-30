import React, { useState } from 'react';
import './MusicStudioComplete.css';
import IntuitiveMusicGenerator from './IntuitiveMusicGenerator';
import SSLChannelStrip from './SSLChannelStrip';
import VoiceEffectsRack from './VoiceEffectsRack';
import GraphicEQ from './GraphicEQ';
import AlbumArtGenerator from './AlbumArtGenerator';

const MusicStudioComplete = ({ services }) => {
  const [activeTab, setActiveTab] = useState('generator');
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [masteringSettings, setMasteringSettings] = useState({});
  const [effectsSettings, setEffectsSettings] = useState({});
  const [eqSettings, setEqSettings] = useState({});

  const handleTrackGenerated = (track) => {
    setGeneratedTrack(track);
    console.log('Track generated:', track);
  };

  const handleMasteringChange = (settings) => {
    setMasteringSettings(settings);
    console.log('Mastering settings:', settings);
  };

  const handleEffectsChange = (settings) => {
    setEffectsSettings(settings);
    console.log('Effects settings:', settings);
  };

  const handleEqChange = (settings) => {
    setEqSettings(settings);
    console.log('EQ settings:', settings);
  };

  const handleExportTrack = () => {
    const finalTrack = {
      ...generatedTrack,
      mastering: masteringSettings,
      effects: effectsSettings,
      eq: eqSettings
    };
    console.log('Exporting final track:', finalTrack);
    // Aquí se implementaría la exportación real
  };

  return (
    <div className="music-studio-complete">
      <div className="studio-header">
        <h1>🎵 Music Studio - Professional Production Suite</h1>
        <p>Interfaz completa de producción musical con herramientas profesionales</p>
      </div>

      <div className="studio-tabs">
        <button 
          className={`studio-tab ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          🎵 Generator
        </button>
        <button 
          className={`studio-tab ${activeTab === 'mastering' ? 'active' : ''}`}
          onClick={() => setActiveTab('mastering')}
        >
          🔊 Mastering
        </button>
        <button 
          className={`studio-tab ${activeTab === 'effects' ? 'active' : ''}`}
          onClick={() => setActiveTab('effects')}
        >
          🎭 Effects
        </button>
        <button 
          className={`studio-tab ${activeTab === 'eq' ? 'active' : ''}`}
          onClick={() => setActiveTab('eq')}
        >
          📊 EQ
        </button>
        <button 
          className={`studio-tab ${activeTab === 'album' ? 'active' : ''}`}
          onClick={() => setActiveTab('album')}
        >
          🎨 Album Art
        </button>
        <button 
          className={`studio-tab ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          ⚡ Workflow
        </button>
      </div>

      <div className="studio-content">
        {activeTab === 'generator' && (
          <div className="studio-section">
            <IntuitiveMusicGenerator 
              services={services}
              onTrackGenerated={handleTrackGenerated}
            />
          </div>
        )}

        {activeTab === 'mastering' && (
          <div className="studio-section">
            <SSLChannelStrip 
              onSettingsChange={handleMasteringChange}
              track={generatedTrack}
            />
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="studio-section">
            <VoiceEffectsRack 
              onSettingsChange={handleEffectsChange}
              track={generatedTrack}
            />
          </div>
        )}

        {activeTab === 'eq' && (
          <div className="studio-section">
            <GraphicEQ 
              onSettingsChange={handleEqChange}
              track={generatedTrack}
            />
          </div>
        )}

        {activeTab === 'album' && (
          <div className="studio-section">
            <AlbumArtGenerator 
              track={generatedTrack}
              onArtGenerated={(art) => console.log('Album art generated:', art)}
            />
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="studio-section workflow-mode">
            <div className="workflow-layout">
              <div className="workflow-panel generator-panel">
                <h3>🎵 Music Generator</h3>
                <IntuitiveMusicGenerator 
                  services={services}
                  onTrackGenerated={handleTrackGenerated}
                  compact={true}
                />
              </div>
              
              <div className="workflow-panel mastering-panel">
                <h3>🔊 Mastering</h3>
                <SSLChannelStrip 
                  onSettingsChange={handleMasteringChange}
                  track={generatedTrack}
                  compact={true}
                />
              </div>
              
              <div className="workflow-panel effects-panel">
                <h3>🎭 Effects</h3>
                <VoiceEffectsRack 
                  onSettingsChange={handleEffectsChange}
                  track={generatedTrack}
                  compact={true}
                />
              </div>
              
              <div className="workflow-panel eq-panel">
                <h3>📊 EQ</h3>
                <GraphicEQ 
                  onSettingsChange={handleEqChange}
                  track={generatedTrack}
                  compact={true}
                />
              </div>
            </div>
            
            <div className="workflow-controls">
              <button 
                className="export-btn"
                onClick={handleExportTrack}
                disabled={!generatedTrack}
              >
                🚀 Export Final Track
              </button>
              
              <div className="track-info">
                {generatedTrack ? (
                  <div className="track-details">
                    <h4>Current Track</h4>
                    <p>Duration: {generatedTrack.duration || 'N/A'}</p>
                    <p>Tempo: {generatedTrack.tempo || 'N/A'} BPM</p>
                    <p>Key: {generatedTrack.key || 'N/A'}</p>
                  </div>
                ) : (
                  <p>Generate a track to see details</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="studio-footer">
        <div className="studio-info">
          <p>🎛️ Professional music production with vintage console aesthetics</p>
          <p>✨ All interfaces inspired by Arturia and Waves plugins</p>
        </div>
      </div>
    </div>
  );
};

export default MusicStudioComplete;
