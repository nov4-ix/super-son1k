/**
 * 🎛️ Resistance DAW - DAW Profesional Son1kVers3
 * Competencia directa a BandLab - Grabación, plugins y producción completa
 */

import React, { useState, useRef, useEffect } from 'react';
import './ResistanceDAW.css';

const ResistanceDAW = () => {
  // Estados principales del DAW
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(240); // 4 minutos por defecto
  const [bpm, setBpm] = useState(120);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [masterVolume, setMasterVolume] = useState(75);
  
  // Estados de grabación
  const [recordingSource, setRecordingSource] = useState('microphone'); // microphone, line, usb
  const [inputGain, setInputGain] = useState(50);
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  
  // Tracks del proyecto
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Vocal Principal', type: 'audio', volume: 80, pan: 0, muted: false, solo: false, armed: false },
    { id: 2, name: 'Guitarra', type: 'audio', volume: 70, pan: -20, muted: false, solo: false, armed: false },
    { id: 3, name: 'Bajo', type: 'audio', volume: 85, pan: 0, muted: false, solo: false, armed: false },
    { id: 4, name: 'Batería', type: 'audio', volume: 75, pan: 0, muted: false, solo: false, armed: false },
    { id: 5, name: 'Synth', type: 'midi', volume: 60, pan: 20, muted: false, solo: false, armed: false },
    { id: 6, name: 'FX', type: 'audio', volume: 40, pan: 0, muted: false, solo: false, armed: false }
  ]);

  // Plugins disponibles (nombres únicos Son1kVers3)
  const availablePlugins = {
    // Compresores
    'resistance_comp': {
      name: 'Resistance Compressor',
      type: 'dynamics',
      icon: '🔥',
      description: 'Compresor de la resistencia con carácter vintage'
    },
    'ghost_limiter': {
      name: 'Ghost Limiter',
      type: 'dynamics', 
      icon: '👻',
      description: 'Limitador fantasma para máxima transparencia'
    },
    
    // EQs
    'alvae_eq': {
      name: 'ALVAE EQ',
      type: 'eq',
      icon: '👁️',
      description: 'Ecualizador omnisciente de 8 bandas'
    },
    'nexus_filter': {
      name: 'Nexus Filter',
      type: 'filter',
      icon: '🎮',
      description: 'Filtros inmersivos con modulación'
    },
    
    // Reverbs
    'terminal_reverb': {
      name: 'Terminal Reverb',
      type: 'reverb',
      icon: '🏛️',
      description: 'Reverb del escenario flotante'
    },
    'void_space': {
      name: 'Void Space',
      type: 'reverb',
      icon: '🌌',
      description: 'Espacios infinitos y ambientes cyberpunk'
    },
    
    // Delays
    'echo_chamber': {
      name: 'Echo Chamber',
      type: 'delay',
      icon: '🔊',
      description: 'Ecos de la resistencia con feedback'
    },
    
    // Distorsión
    'trash_drive': {
      name: 'Trash Drive',
      type: 'distortion',
      icon: '⚡',
      description: 'Saturación trash característica'
    },
    'grunge_amp': {
      name: 'Grunge Amp',
      type: 'amp',
      icon: '🎸',
      description: 'Amplificador grunge con distorsión'
    },
    
    // Modulación
    'cipher_chorus': {
      name: 'Cipher Chorus',
      type: 'modulation',
      icon: '🌊',
      description: 'Chorus cifrado con modulación compleja'
    },
    'flux_phaser': {
      name: 'Flux Phaser',
      type: 'modulation',
      icon: '🔄',
      description: 'Phaser temporal con efectos de flujo'
    },
    
    // Utilidades
    'pixel_analyzer': {
      name: 'Pixel Analyzer',
      type: 'utility',
      icon: '📊',
      description: 'Analizador espectral en tiempo real'
    },
    'nova_tuner': {
      name: 'Nova Tuner',
      type: 'utility',
      icon: '🎯',
      description: 'Afinador de precisión cuántica'
    }
  };

  // Referencias de audio
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Inicializar Web Audio API
  useEffect(() => {
    initializeAudioContext();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeAudioContext = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      console.log('🎛️ Resistance DAW Audio Context inicializado');
    } catch (error) {
      console.error('Error inicializando Audio Context:', error);
    }
  };

  // Iniciar grabación
  const startRecording = async () => {
    try {
      const constraints = {
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 2
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Añadir grabación a track seleccionado
        addRecordingToTrack(audioUrl);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('🎤 Grabación iniciada en Resistance DAW');
      
    } catch (error) {
      console.error('Error iniciando grabación:', error);
      alert('Error accediendo al micrófono. Verifica permisos.');
    }
  };

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      console.log('⏹️ Grabación detenida');
    }
  };

  // Añadir grabación a track
  const addRecordingToTrack = (audioUrl) => {
    const track = tracks[selectedTrack];
    console.log(`📁 Grabación añadida a ${track.name}`);
    
    // En producción, aquí se guardaría el audio en el track
    alert(`Grabación añadida a ${track.name}`);
  };

  // Controles de transporte
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    console.log(isPlaying ? '⏸️ Pausado' : '▶️ Reproduciendo');
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    console.log('⏹️ Detenido');
  };

  // Controles de track
  const updateTrackVolume = (trackId, volume) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, volume } : track
    ));
  };

  const updateTrackPan = (trackId, pan) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, pan } : track
    ));
  };

  const toggleTrackMute = (trackId) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, muted: !track.muted } : track
    ));
  };

  const toggleTrackSolo = (trackId) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, solo: !track.solo } : track
    ));
  };

  const armTrackForRecording = (trackId) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId ? { ...track, armed: !track.armed } : track
    ));
    setSelectedTrack(trackId - 1); // Array index
  };

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="resistance-daw">
      {/* Header del DAW */}
      <header className="daw-header">
        <div className="daw-logo">
          <h1>🎛️ RESISTANCE DAW</h1>
          <span className="daw-subtitle">Professional Recording Studio</span>
        </div>
        
        <div className="daw-transport">
          <button 
            className={`transport-btn record ${isRecording ? 'active' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? '⏹️' : '🔴'}
          </button>
          
          <button 
            className={`transport-btn play ${isPlaying ? 'active' : ''}`}
            onClick={togglePlayback}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button 
            className="transport-btn stop"
            onClick={stopPlayback}
          >
            ⏹️
          </button>
          
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(totalTime)}</span>
          </div>
          
          <div className="bpm-control">
            <label>BPM:</label>
            <input
              type="number"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="bpm-input"
            />
          </div>
        </div>
        
        <div className="daw-master">
          <div className="master-volume">
            <label>MASTER</label>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseInt(e.target.value))}
              className="master-fader"
              orient="vertical"
            />
            <span className="volume-value">{masterVolume}</span>
          </div>
        </div>
      </header>

      {/* Área principal del DAW */}
      <main className="daw-main">
        {/* Panel de grabación */}
        <div className="recording-panel">
          <h3>🎤 GRABACIÓN</h3>
          
          <div className="input-controls">
            <div className="input-source">
              <label>Fuente:</label>
              <select 
                value={recordingSource} 
                onChange={(e) => setRecordingSource(e.target.value)}
                className="source-select"
              >
                <option value="microphone">🎤 Micrófono</option>
                <option value="line">🔌 Línea</option>
                <option value="usb">🎧 Interfaz USB</option>
              </select>
            </div>
            
            <div className="input-gain">
              <label>Ganancia:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={inputGain}
                onChange={(e) => setInputGain(parseInt(e.target.value))}
                className="gain-fader"
              />
              <span>{inputGain}%</span>
            </div>
            
            <div className="monitoring">
              <label>
                <input
                  type="checkbox"
                  checked={monitoringEnabled}
                  onChange={(e) => setMonitoringEnabled(e.target.checked)}
                />
                Monitoreo
              </label>
            </div>
          </div>
        </div>

        {/* Mixer - Tracks */}
        <div className="mixer-section">
          <h3>🎚️ MIXER</h3>
          
          <div className="tracks-container">
            {tracks.map((track, index) => (
              <div key={track.id} className={`track-strip ${selectedTrack === index ? 'selected' : ''}`}>
                {/* Nombre del track */}
                <div className="track-name">
                  <input
                    type="text"
                    value={track.name}
                    onChange={(e) => {
                      const newTracks = [...tracks];
                      newTracks[index].name = e.target.value;
                      setTracks(newTracks);
                    }}
                    className="track-name-input"
                  />
                  <span className="track-type">{track.type.toUpperCase()}</span>
                </div>

                {/* Plugins del track */}
                <div className="track-plugins">
                  <button 
                    className="plugin-slot empty"
                    onClick={() => openPluginSelector(track.id)}
                    title="Añadir Plugin"
                  >
                    +
                  </button>
                </div>

                {/* Controles del track */}
                <div className="track-controls">
                  {/* Pan */}
                  <div className="pan-control">
                    <label>PAN</label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={track.pan}
                      onChange={(e) => updateTrackPan(track.id, parseInt(e.target.value))}
                      className="pan-knob"
                    />
                    <span className="pan-value">{track.pan > 0 ? 'R' : track.pan < 0 ? 'L' : 'C'}</span>
                  </div>

                  {/* Volume Fader */}
                  <div className="volume-control">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={track.volume}
                      onChange={(e) => updateTrackVolume(track.id, parseInt(e.target.value))}
                      className="volume-fader vertical"
                      orient="vertical"
                    />
                    <span className="volume-value">{track.volume}</span>
                  </div>

                  {/* Botones */}
                  <div className="track-buttons">
                    <button 
                      className={`track-btn arm ${track.armed ? 'active' : ''}`}
                      onClick={() => armTrackForRecording(track.id)}
                      title="Armar para grabación"
                    >
                      REC
                    </button>
                    
                    <button 
                      className={`track-btn mute ${track.muted ? 'active' : ''}`}
                      onClick={() => toggleTrackMute(track.id)}
                    >
                      MUTE
                    </button>
                    
                    <button 
                      className={`track-btn solo ${track.solo ? 'active' : ''}`}
                      onClick={() => toggleTrackSolo(track.id)}
                    >
                      SOLO
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de plugins */}
        <div className="plugins-panel">
          <h3>🔌 PLUGINS RESISTANCE</h3>
          
          <div className="plugin-categories">
            <div className="plugin-category">
              <h4>🔥 Dynamics</h4>
              <div className="plugin-list">
                <button className="plugin-item" onClick={() => loadPlugin('resistance_comp')}>
                  🔥 Resistance Compressor
                </button>
                <button className="plugin-item" onClick={() => loadPlugin('ghost_limiter')}>
                  👻 Ghost Limiter
                </button>
              </div>
            </div>

            <div className="plugin-category">
              <h4>👁️ EQ & Filters</h4>
              <div className="plugin-list">
                <button className="plugin-item" onClick={() => loadPlugin('alvae_eq')}>
                  👁️ ALVAE EQ
                </button>
                <button className="plugin-item" onClick={() => loadPlugin('nexus_filter')}>
                  🎮 Nexus Filter
                </button>
              </div>
            </div>

            <div className="plugin-category">
              <h4>🌌 Reverb & Space</h4>
              <div className="plugin-list">
                <button className="plugin-item" onClick={() => loadPlugin('terminal_reverb')}>
                  🏛️ Terminal Reverb
                </button>
                <button className="plugin-item" onClick={() => loadPlugin('void_space')}>
                  🌌 Void Space
                </button>
              </div>
            </div>

            <div className="plugin-category">
              <h4>⚡ Distortion & Drive</h4>
              <div className="plugin-list">
                <button className="plugin-item" onClick={() => loadPlugin('trash_drive')}>
                  ⚡ Trash Drive
                </button>
                <button className="plugin-item" onClick={() => loadPlugin('grunge_amp')}>
                  🎸 Grunge Amp
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Timeline/Arrange */}
      <div className="timeline-section">
        <div className="timeline-header">
          <h3>📊 TIMELINE</h3>
          <div className="timeline-controls">
            <button className="timeline-btn">🔍 Zoom In</button>
            <button className="timeline-btn">🔍 Zoom Out</button>
            <button className="timeline-btn">📏 Fit</button>
          </div>
        </div>
        
        <div className="timeline-grid">
          {/* Regla de tiempo */}
          <div className="time-ruler">
            {Array.from({length: Math.ceil(totalTime / 10)}, (_, i) => (
              <div key={i} className="time-marker">
                <span>{formatTime(i * 10)}</span>
              </div>
            ))}
          </div>
          
          {/* Tracks en timeline */}
          <div className="timeline-tracks">
            {tracks.map((track, index) => (
              <div key={track.id} className="timeline-track">
                <div className="track-header">
                  <span>{track.name}</span>
                </div>
                <div className="track-content">
                  {/* Aquí irían las regiones de audio */}
                  <div className="audio-region" style={{width: '30%', left: '10%'}}>
                    Audio Clip
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer con información */}
      <footer className="daw-footer">
        <div className="footer-info">
          <span>Resistance DAW v1.0 - Powered by Son1kVers3</span>
          <span>Sample Rate: 48kHz | Bit Depth: 24-bit</span>
          <span>Latency: {audioContextRef.current ? Math.round(audioContextRef.current.baseLatency * 1000) : 0}ms</span>
        </div>
      </footer>
    </div>
  );

  // Funciones de plugins
  const openPluginSelector = (trackId) => {
    console.log(`🔌 Abriendo selector de plugins para track ${trackId}`);
    // En producción, abriría modal con plugins disponibles
    alert('Selector de plugins próximamente');
  };

  const loadPlugin = (pluginId) => {
    const plugin = availablePlugins[pluginId];
    console.log(`🔌 Cargando plugin: ${plugin.name}`);
    alert(`Plugin ${plugin.name} cargado`);
  };
};

export default ResistanceDAW;
