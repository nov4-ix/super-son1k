import React, { useState, useRef, useEffect } from 'react';
import './ResistanceDAWPro.css';

// Importar plugins
import ALVAEEqualizer from './plugins/ALVAEEqualizer';
import SonicCompressor from './plugins/SonicCompressor';
import ReverbChamber from './plugins/ReverbChamber';
import SaturatorPro from './plugins/SaturatorPro';
import LimiterPro from './plugins/LimiterPro';
import VocalCompressor from './plugins/VocalCompressor';
import DeEsser from './plugins/DeEsser';
import StereoEnhancer from './plugins/StereoEnhancer';

/**
 * 🎛️ Resistance DAW Pro
 * DAW de calidad enterprise estilo Studio One/Cubase
 * Con plugins Waves integrados y personalizados para Son1kVers3
 */

const ResistanceDAWPro = () => {
  const [tracks, setTracks] = useState([
    { 
      id: 1, 
      name: 'Lead Vocals', 
      type: 'audio', 
      color: '#FF006E',
      volume: 0,
      pan: 0,
      mute: false,
      solo: false,
      armed: false,
      plugins: [],
      regions: []
    },
    { 
      id: 2, 
      name: 'Harmony', 
      type: 'audio', 
      color: '#8338EC',
      volume: -3,
      pan: 0,
      mute: false,
      solo: false,
      armed: false,
      plugins: [],
      regions: []
    },
    { 
      id: 3, 
      name: 'Drums', 
      type: 'audio', 
      color: '#3A86FF',
      volume: -6,
      pan: 0,
      mute: false,
      solo: false,
      armed: false,
      plugins: [],
      regions: []
    },
    { 
      id: 4, 
      name: 'Bass', 
      type: 'audio', 
      color: '#06FFA5',
      volume: -4,
      pan: 0,
      mute: false,
      solo: false,
      armed: false,
      plugins: [],
      regions: []
    },
    { 
      id: 5, 
      name: 'Synth', 
      type: 'midi', 
      color: '#FFBE0B',
      volume: -8,
      pan: 0,
      mute: false,
      solo: false,
      armed: false,
      plugins: [],
      regions: []
    }
  ]);

  const [masterTrack, setMasterTrack] = useState({
    volume: 0,
    plugins: []
  });

  const [selectedTrack, setSelectedTrack] = useState(1);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('arrange'); // arrange, mix, edit
  const [showPluginBrowser, setShowPluginBrowser] = useState(false);

  const availablePlugins = [
    { 
      id: 'alvae-eq', 
      name: 'ALVAE Equalizer', 
      category: 'EQ',
      icon: '🎚️',
      description: 'Ecualizador paramétrico de 8 bandas',
      component: ALVAEEqualizer
    },
    { 
      id: 'sonic-comp', 
      name: 'Sonic Compressor', 
      category: 'Dynamics',
      icon: '🔊',
      description: 'Compresor profesional estilo CLA',
      component: SonicCompressor
    },
    { 
      id: 'reverb-chamber', 
      name: 'Reverb Chamber', 
      category: 'Space',
      icon: '🌊',
      description: 'Reverberación espacial premium',
      component: ReverbChamber
    },
    { 
      id: 'saturator', 
      name: 'Saturator Pro', 
      category: 'Saturation',
      icon: '⚡',
      description: 'Saturación analógica',
      component: SaturatorPro
    },
    { 
      id: 'limiter-pro', 
      name: 'Limiter Pro', 
      category: 'Mastering',
      icon: '🎵',
      description: 'Limitador de masterización',
      component: LimiterPro
    },
    { 
      id: 'vocal-comp', 
      name: 'Vocal Compressor', 
      category: 'Vocals',
      icon: '🎤',
      description: 'Compresor optimizado para voces',
      component: VocalCompressor
    },
    { 
      id: 'de-esser', 
      name: 'De-Esser', 
      category: 'Vocals',
      icon: '🔇',
      description: 'Control de sibilantes',
      component: DeEsser
    },
    { 
      id: 'stereo-enhancer', 
      name: 'Stereo Enhancer', 
      category: 'Mastering',
      icon: '🎧',
      description: 'Mejora de imagen estéreo',
      component: StereoEnhancer
    }
  ];

  const timelineRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
  };

  const updateTrack = (trackId, updates) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  };

  const addPluginToTrack = (trackId, plugin) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      updateTrack(trackId, {
        plugins: [...track.plugins, { ...plugin, id: Date.now() }]
      });
    }
    setShowPluginBrowser(false);
  };

  const removePluginFromTrack = (trackId, pluginId) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      updateTrack(trackId, {
        plugins: track.plugins.filter(p => p.id !== pluginId)
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="resistance-daw-pro">
      {/* Transport Bar */}
      <div className="transport-bar">
        <div className="transport-left">
          <div className="daw-logo">
            <span className="logo-icon">🎛️</span>
            <span className="logo-text">Resistance DAW</span>
            <span className="logo-version">Pro v2.0</span>
          </div>
        </div>

        <div className="transport-center">
          <button className="transport-btn" onClick={() => setCurrentTime(0)}>
            <span>⏮️</span>
          </button>
          <button className="transport-btn" onClick={handleStop}>
            <span>⏹️</span>
          </button>
          <button 
            className={`transport-btn play ${isPlaying ? 'active' : ''}`}
            onClick={handlePlay}
          >
            <span>{isPlaying ? '⏸️' : '▶️'}</span>
          </button>
          <button 
            className={`transport-btn record ${isRecording ? 'active' : ''}`}
            onClick={handleRecord}
          >
            <span>⏺️</span>
          </button>
          <button className="transport-btn">
            <span>⏭️</span>
          </button>

          <div className="time-display">
            <span className="time-value">{formatTime(currentTime)}</span>
            <span className="time-label">/ 4:00.0</span>
          </div>

          <div className="tempo-display">
            <span className="tempo-label">BPM</span>
            <input type="number" defaultValue="120" className="tempo-input" />
          </div>
        </div>

        <div className="transport-right">
          <button className="view-btn" onClick={() => setViewMode('arrange')}>
            Arrange
          </button>
          <button className="view-btn" onClick={() => setViewMode('mix')}>
            Mix
          </button>
          <button className="view-btn" onClick={() => setViewMode('edit')}>
            Edit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="daw-content">
        {/* Track List */}
        <div className="track-list">
          <div className="track-list-header">
            <h3>Tracks</h3>
            <button className="add-track-btn">+ Add</button>
          </div>

          {tracks.map(track => (
            <div 
              key={track.id}
              className={`track-item ${selectedTrack === track.id ? 'selected' : ''}`}
              onClick={() => setSelectedTrack(track.id)}
            >
              <div className="track-color" style={{ background: track.color }}></div>
              
              <div className="track-controls">
                <button 
                  className={`track-btn mute ${track.mute ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTrack(track.id, { mute: !track.mute });
                  }}
                >
                  M
                </button>
                <button 
                  className={`track-btn solo ${track.solo ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTrack(track.id, { solo: !track.solo });
                  }}
                >
                  S
                </button>
                <button 
                  className={`track-btn arm ${track.armed ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTrack(track.id, { armed: !track.armed });
                  }}
                >
                  R
                </button>
              </div>

              <div className="track-info">
                <span className="track-name">{track.name}</span>
                <span className="track-type">{track.type}</span>
              </div>

              <div className="track-meter">
                <div className="meter-bar" style={{ height: `${Math.random() * 100}%` }}></div>
              </div>
            </div>
          ))}

          {/* Master Track */}
          <div className="track-item master">
            <div className="track-color" style={{ background: '#FF006E' }}></div>
            <div className="track-info">
              <span className="track-name">Master</span>
              <span className="track-type">stereo</span>
            </div>
            <div className="track-meter">
              <div className="meter-bar" style={{ height: '70%' }}></div>
            </div>
          </div>
        </div>

        {/* Timeline/Arrange View */}
        <div className="timeline-container">
          <div className="timeline-header">
            <div className="timeline-ruler">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="ruler-mark">
                  <span>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="timeline-tracks" ref={timelineRef}>
            {tracks.map(track => (
              <div key={track.id} className="timeline-track">
                <div className="track-lane" style={{ borderLeft: `3px solid ${track.color}` }}>
                  {/* Aquí irían las regiones de audio/MIDI */}
                  {track.regions.map(region => (
                    <div key={region.id} className="audio-region" style={{
                      left: `${region.start * 100}px`,
                      width: `${region.duration * 100}px`,
                      background: track.color
                    }}>
                      <div className="region-waveform"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div 
            className="playhead" 
            style={{ left: `${currentTime * 50}px` }}
          ></div>
        </div>

        {/* Inspector/Plugin Panel */}
        <div className="inspector-panel">
          <div className="inspector-header">
            <h3>Inspector</h3>
            <button 
              className="add-plugin-btn"
              onClick={() => setShowPluginBrowser(!showPluginBrowser)}
            >
              + Plugin
            </button>
          </div>

          {selectedTrack && (
            <div className="track-inspector">
              <div className="inspector-section">
                <h4>Track Settings</h4>
                <div className="param-group">
                  <label>Volume</label>
                  <input 
                    type="range" 
                    min="-60" 
                    max="12" 
                    value={tracks.find(t => t.id === selectedTrack)?.volume || 0}
                    onChange={(e) => updateTrack(selectedTrack, { volume: parseFloat(e.target.value) })}
                    className="param-slider"
                  />
                  <span className="param-value">
                    {tracks.find(t => t.id === selectedTrack)?.volume || 0} dB
                  </span>
                </div>

                <div className="param-group">
                  <label>Pan</label>
                  <input 
                    type="range" 
                    min="-100" 
                    max="100" 
                    value={tracks.find(t => t.id === selectedTrack)?.pan || 0}
                    onChange={(e) => updateTrack(selectedTrack, { pan: parseFloat(e.target.value) })}
                    className="param-slider"
                  />
                  <span className="param-value">
                    {tracks.find(t => t.id === selectedTrack)?.pan || 0}
                  </span>
                </div>
              </div>

              <div className="inspector-section">
                <h4>Plugins</h4>
                <div className="plugin-chain">
                  {tracks.find(t => t.id === selectedTrack)?.plugins.map((plugin, index) => (
                    <div key={plugin.id} className="plugin-slot">
                      <div className="plugin-header">
                        <span className="plugin-icon">{plugin.icon}</span>
                        <span className="plugin-name">{plugin.name}</span>
                        <button 
                          className="plugin-remove"
                          onClick={() => removePluginFromTrack(selectedTrack, plugin.id)}
                        >
                          ×
                        </button>
                      </div>
                      <button 
                        className="plugin-edit-btn"
                        onClick={() => setSelectedPlugin(plugin)}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                  
                  {tracks.find(t => t.id === selectedTrack)?.plugins.length === 0 && (
                    <div className="empty-plugin-chain">
                      <p>No plugins loaded</p>
                      <button onClick={() => setShowPluginBrowser(true)}>
                        Add Plugin
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plugin Browser */}
      {showPluginBrowser && (
        <div className="plugin-browser-overlay" onClick={() => setShowPluginBrowser(false)}>
          <div className="plugin-browser" onClick={(e) => e.stopPropagation()}>
            <div className="browser-header">
              <h3>Plugin Browser</h3>
              <button onClick={() => setShowPluginBrowser(false)}>×</button>
            </div>

            <div className="browser-categories">
              <button className="category-btn active">All</button>
              <button className="category-btn">EQ</button>
              <button className="category-btn">Dynamics</button>
              <button className="category-btn">Space</button>
              <button className="category-btn">Vocals</button>
              <button className="category-btn">Mastering</button>
            </div>

            <div className="browser-plugins">
              {availablePlugins.map(plugin => (
                <div 
                  key={plugin.id} 
                  className="browser-plugin-item"
                  onClick={() => addPluginToTrack(selectedTrack, plugin)}
                >
                  <div className="plugin-icon-large">{plugin.icon}</div>
                  <div className="plugin-details">
                    <h4>{plugin.name}</h4>
                    <p className="plugin-category">{plugin.category}</p>
                    <p className="plugin-description">{plugin.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plugin Window */}
      {selectedPlugin && (
        <div className="plugin-window-overlay" onClick={() => setSelectedPlugin(null)}>
          <div className="plugin-window" onClick={(e) => e.stopPropagation()}>
            <div className="plugin-window-header">
              <div className="plugin-window-title">
                <span className="plugin-icon">{selectedPlugin.icon}</span>
                <span>{selectedPlugin.name}</span>
              </div>
              <button onClick={() => setSelectedPlugin(null)}>×</button>
            </div>
            <div className="plugin-window-content">
              {selectedPlugin.component && <selectedPlugin.component />}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="status-item">Sample Rate: 48kHz</span>
          <span className="status-item">Buffer: 512</span>
          <span className="status-item">CPU: 23%</span>
        </div>
        <div className="status-right">
          <span className="status-item">Resistance DAW Pro • Son1kVers3</span>
        </div>
      </div>
    </div>
  );
};

export default ResistanceDAWPro;
