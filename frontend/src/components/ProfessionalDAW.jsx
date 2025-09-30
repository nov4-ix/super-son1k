import React, { useState, useEffect, useRef } from 'react';
import './ProfessionalDAW.css';
import SSLChannelStrip from './SSLChannelStrip';
import VocalProcessor from './VocalProcessor';
import GraphicEQ from './GraphicEQ';

const ProfessionalDAW = () => {
  // Estados principales del DAW
  const [currentView, setCurrentView] = useState('arrange'); // arrange, mix, master, midi
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTempo, setCurrentTempo] = useState(120);
  const [currentTime, setCurrentTime] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isSolo, setIsSolo] = useState(false);

  // Estados para plugins
  const [sslSettings, setSslSettings] = useState({});
  const [vocalSettings, setVocalSettings] = useState({});
  const [eqSettings, setEqSettings] = useState({});

  // Referencias
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const transportRef = useRef(null);

  // Inicializar audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        // Crear master gain
        const masterGain = audioContext.createGain();
        masterGain.gain.value = masterVolume;
        masterGainRef.current = masterGain;
        masterGain.connect(audioContext.destination);
        
        console.log('🎵 Audio Context inicializado correctamente');
      } catch (error) {
        console.error('Error inicializando audio:', error);
      }
    };

    initAudio();
  }, []);

  // Crear nueva pista
  const createTrack = (type = 'audio') => {
    const newTrack = {
      id: Date.now(),
      name: `${type === 'audio' ? 'Audio' : 'MIDI'} Track ${tracks.length + 1}`,
      type,
      volume: 0.8,
      pan: 0,
      mute: false,
      solo: false,
      color: getRandomColor(),
      clips: [],
      effects: [],
      isRecording: false
    };
    
    setTracks([...tracks, newTrack]);
    setSelectedTrack(newTrack.id);
  };

  // Generar color aleatorio para pistas
  const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Control de transporte
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
  };

  const toggleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startPlayback = () => {
    // Implementar lógica de reproducción
    console.log('▶️ Iniciando reproducción');
  };

  const stopPlayback = () => {
    // Implementar lógica de parada
    console.log('⏹️ Deteniendo reproducción');
  };

  const startRecording = () => {
    // Implementar lógica de grabación
    console.log('🔴 Iniciando grabación');
  };

  const stopRecording = () => {
    // Implementar lógica de parada de grabación
    console.log('⏹️ Deteniendo grabación');
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Renderizar vista de arreglo
  const renderArrangeView = () => (
    <div className="arrange-view">
      <div className="track-list">
        {tracks.map(track => (
          <div 
            key={track.id} 
            className={`track ${selectedTrack === track.id ? 'selected' : ''}`}
            style={{ borderLeft: `4px solid ${track.color}` }}
          >
            <div className="track-header">
              <div className="track-info">
                <span className="track-name">{track.name}</span>
                <span className="track-type">{track.type}</span>
              </div>
              <div className="track-controls">
                <button 
                  className={`track-btn ${track.mute ? 'active' : ''}`}
                  onClick={() => setTracks(tracks.map(t => 
                    t.id === track.id ? { ...t, mute: !t.mute } : t
                  ))}
                >
                  M
                </button>
                <button 
                  className={`track-btn ${track.solo ? 'active' : ''}`}
                  onClick={() => setTracks(tracks.map(t => 
                    t.id === track.id ? { ...t, solo: !t.solo } : t
                  ))}
                >
                  S
                </button>
                <button 
                  className="track-btn"
                  onClick={() => setSelectedTrack(track.id)}
                >
                  E
                </button>
              </div>
            </div>
            <div className="track-clips">
              {track.clips.map((clip, index) => (
                <div key={index} className="clip" style={{ backgroundColor: track.color }}>
                  <span className="clip-name">{clip.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar vista de mezcla
  const renderMixView = () => (
    <div className="mix-view">
      <div className="mixer-strips">
        {tracks.map(track => (
          <div key={track.id} className="mixer-strip">
            <div className="strip-header">
              <span className="strip-name">{track.name}</span>
              <div className="strip-controls">
                <button className={`strip-btn ${track.mute ? 'active' : ''}`}>M</button>
                <button className={`strip-btn ${track.solo ? 'active' : ''}`}>S</button>
                <button className="strip-btn">R</button>
              </div>
            </div>
            <div className="strip-fader">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.volume}
                onChange={(e) => setTracks(tracks.map(t => 
                  t.id === track.id ? { ...t, volume: parseFloat(e.target.value) } : t
                ))}
                className="volume-fader"
              />
              <span className="fader-value">{Math.round(track.volume * 100)}</span>
            </div>
            <div className="strip-pan">
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={track.pan}
                onChange={(e) => setTracks(tracks.map(t => 
                  t.id === track.id ? { ...t, pan: parseFloat(e.target.value) } : t
                ))}
                className="pan-fader"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar vista de mastering
  const renderMasterView = () => (
    <div className="master-view">
      <div className="master-plugins">
        <div className="plugin-section">
          <h3>SSL Channel Strip</h3>
          <SSLChannelStrip onSettingsChange={setSslSettings} />
        </div>
        <div className="plugin-section">
          <h3>Graphic EQ Pro</h3>
          <GraphicEQ onSettingsChange={setEqSettings} />
        </div>
      </div>
    </div>
  );

  // Renderizar vista MIDI
  const renderMidiView = () => (
    <div className="midi-view">
      <div className="piano-roll">
        <div className="piano-roll-header">
          <h3>Piano Roll Editor</h3>
          <div className="piano-roll-controls">
            <button className="midi-btn">Quantize</button>
            <button className="midi-btn">Humanize</button>
            <button className="midi-btn">Copy</button>
            <button className="midi-btn">Paste</button>
          </div>
        </div>
        <div className="piano-roll-content">
          <div className="piano-keys">
            {Array.from({ length: 88 }, (_, i) => {
              const note = 21 + i;
              const octave = Math.floor(note / 12) - 1;
              const noteName = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note % 12];
              const isBlack = [1, 3, 6, 8, 10].includes(note % 12);
              
              return (
                <div 
                  key={note} 
                  className={`piano-key ${isBlack ? 'black' : 'white'}`}
                >
                  <span className="key-label">{noteName}{octave}</span>
                </div>
              );
            })}
          </div>
          <div className="midi-grid">
            {/* Grid de notas MIDI */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="professional-daw">
      {/* Header del DAW */}
      <div className="daw-header">
        <div className="daw-title">
          <h1>Son1kVers3 DAW Pro</h1>
          <span className="daw-version">v2.0</span>
        </div>
        <div className="daw-controls">
          <button className="daw-btn new-project">New Project</button>
          <button className="daw-btn open-project">Open</button>
          <button className="daw-btn save-project">Save</button>
          <button className="daw-btn export">Export</button>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="transport-controls">
        <div className="transport-left">
          <button className="transport-btn rewind">⏮</button>
          <button className="transport-btn play" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className="transport-btn stop">⏹</button>
          <button className="transport-btn record" onClick={toggleRecord}>
            {isRecording ? '⏹' : '⏺'}
          </button>
          <button className="transport-btn forward">⏭</button>
        </div>
        
        <div className="transport-center">
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span className="total-time">05:00.00</span>
          </div>
          <div className="tempo-control">
            <label>Tempo</label>
            <input
              type="number"
              value={currentTempo}
              onChange={(e) => setCurrentTempo(parseInt(e.target.value))}
              className="tempo-input"
              min="60"
              max="200"
            />
          </div>
        </div>

        <div className="transport-right">
          <div className="master-controls">
            <button 
              className={`master-btn ${isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              Mute
            </button>
            <button 
              className={`master-btn ${isSolo ? 'active' : ''}`}
              onClick={() => setIsSolo(!isSolo)}
            >
              Solo
            </button>
            <div className="master-volume">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="master-fader"
              />
              <span className="volume-value">{Math.round(masterVolume * 100)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="daw-navigation">
        <button 
          className={`nav-btn ${currentView === 'arrange' ? 'active' : ''}`}
          onClick={() => setCurrentView('arrange')}
        >
          <span className="nav-icon">📝</span>
          <span className="nav-text">Arrange</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'mix' ? 'active' : ''}`}
          onClick={() => setCurrentView('mix')}
        >
          <span className="nav-icon">🎛️</span>
          <span className="nav-text">Mix</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'master' ? 'active' : ''}`}
          onClick={() => setCurrentView('master')}
        >
          <span className="nav-icon">🎚️</span>
          <span className="nav-text">Master</span>
        </button>
        <button 
          className={`nav-btn ${currentView === 'midi' ? 'active' : ''}`}
          onClick={() => setCurrentView('midi')}
        >
          <span className="nav-icon">🎹</span>
          <span className="nav-text">MIDI</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="daw-content">
        {currentView === 'arrange' && renderArrangeView()}
        {currentView === 'mix' && renderMixView()}
        {currentView === 'master' && renderMasterView()}
        {currentView === 'midi' && renderMidiView()}
      </div>

      {/* Track Controls */}
      <div className="track-controls-panel">
        <div className="track-actions">
          <button 
            className="track-action-btn"
            onClick={() => createTrack('audio')}
          >
            <span className="btn-icon">🎤</span>
            <span className="btn-text">Add Audio Track</span>
          </button>
          <button 
            className="track-action-btn"
            onClick={() => createTrack('midi')}
          >
            <span className="btn-icon">🎹</span>
            <span className="btn-text">Add MIDI Track</span>
          </button>
          <button 
            className="track-action-btn"
            onClick={() => createTrack('drum')}
          >
            <span className="btn-icon">🥁</span>
            <span className="btn-text">Add Drum Track</span>
          </button>
        </div>

        {selectedTrack && (
          <div className="selected-track-panel">
            <h3>Track: {tracks.find(t => t.id === selectedTrack)?.name}</h3>
            <div className="track-effects">
              <VocalProcessor onSettingsChange={setVocalSettings} />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="daw-status">
        <div className="status-left">
          <span className="status-item">CPU: 45%</span>
          <span className="status-item">RAM: 2.1GB</span>
          <span className="status-item">Disk: 15MB/s</span>
        </div>
        <div className="status-center">
          <span className="status-item">Ready</span>
        </div>
        <div className="status-right">
          <span className="status-item">Sample Rate: 44.1kHz</span>
          <span className="status-item">Bit Depth: 24-bit</span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDAW;

