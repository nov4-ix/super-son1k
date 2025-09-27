import React, { useState, useRef, useEffect } from 'react';
import './DAWEditor.css';

/**
 * 🎛️ DAW Editor - Editor de Música Profesional
 * Interfaz estilo Digital Audio Workstation con pistas, efectos y controles
 */
const DAWEditor = ({ onExport, onSave }) => {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isRecording, setIsRecording] = useState(false);
  const [effects, setEffects] = useState({
    reverb: { enabled: false, amount: 0.5 },
    delay: { enabled: false, amount: 0.3 },
    distortion: { enabled: false, amount: 0.2 },
    eq: { enabled: false, low: 0, mid: 0, high: 0 }
  });

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Inicializar contexto de audio
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = masterVolume;
    }

    // Crear pista inicial
    if (tracks.length === 0) {
      addNewTrack();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const addNewTrack = () => {
    const newTrack = {
      id: Date.now(),
      name: `Pista ${tracks.length + 1}`,
      type: 'audio', // 'audio', 'midi', 'drum'
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false,
      clips: [],
      effects: {
        reverb: { enabled: false, amount: 0.3 },
        delay: { enabled: false, amount: 0.2 },
        eq: { enabled: false, low: 0, mid: 0, high: 0 }
      }
    };
    setTracks([...tracks, newTrack]);
  };

  const deleteTrack = (trackId) => {
    setTracks(tracks.filter(track => track.id !== trackId));
    if (selectedTrack === trackId) {
      setSelectedTrack(null);
    }
  };

  const updateTrack = (trackId, updates) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  };

  const addClip = (trackId, clipData) => {
    const newClip = {
      id: Date.now(),
      startTime: currentTime,
      duration: 4, // 4 beats por defecto
      name: `Clip ${Date.now()}`,
      data: clipData,
      ...clipData
    };

    setTracks(tracks.map(track => 
      track.id === trackId 
        ? { ...track, clips: [...track.clips, newClip] }
        : track
    ));
  };

  const playPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      setIsPlaying(true);
      startPlayback();
    }
  };

  const startPlayback = () => {
    const updateTime = () => {
      setCurrentTime(prev => {
        const newTime = prev + 0.016; // ~60fps
        if (newTime >= 60) { // 60 segundos máximo
          setIsPlaying(false);
          return 0;
        }
        return newTime;
      });
      
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };
    updateTime();
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const record = () => {
    setIsRecording(!isRecording);
    // Aquí se implementaría la grabación real
  };

  const exportProject = () => {
    const project = {
      tracks,
      bpm,
      masterVolume,
      effects,
      duration: Math.max(...tracks.map(t => 
        Math.max(...t.clips.map(c => c.startTime + c.duration))
      ), 0)
    };
    
    if (onExport) {
      onExport(project);
    }
  };

  const saveProject = () => {
    const project = {
      tracks,
      bpm,
      masterVolume,
      effects,
      timestamp: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(project);
    }
  };

  return (
    <div className="daw-editor">
      {/* Header con controles principales */}
      <div className="daw-header">
        <div className="daw-controls">
          <button 
            className={`play-button ${isPlaying ? 'playing' : ''}`}
            onClick={playPause}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="stop-button" onClick={stop}>⏹️</button>
          <button 
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={record}
          >
            {isRecording ? '⏺️' : '⏺️'}
          </button>
        </div>

        <div className="daw-info">
          <div className="bpm-control">
            <label>BPM:</label>
            <input 
              type="number" 
              value={bpm} 
              onChange={(e) => setBpm(parseInt(e.target.value))}
              min="60" 
              max="200"
            />
          </div>
          <div className="time-display">
            {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(1).padStart(4, '0')}
          </div>
        </div>

        <div className="daw-actions">
          <button onClick={saveProject} className="save-btn">💾 Guardar</button>
          <button onClick={exportProject} className="export-btn">📤 Exportar</button>
        </div>
      </div>

      {/* Área de pistas */}
      <div className="tracks-area">
        <div className="tracks-list">
          {tracks.map(track => (
            <div 
              key={track.id} 
              className={`track ${selectedTrack === track.id ? 'selected' : ''}`}
              onClick={() => setSelectedTrack(track.id)}
            >
              <div className="track-header">
                <div className="track-controls">
                  <button 
                    className={`mute-btn ${track.muted ? 'muted' : ''}`}
                    onClick={() => updateTrack(track.id, { muted: !track.muted })}
                  >
                    M
                  </button>
                  <button 
                    className={`solo-btn ${track.solo ? 'solo' : ''}`}
                    onClick={() => updateTrack(track.id, { solo: !track.solo })}
                  >
                    S
                  </button>
                </div>
                
                <div className="track-name">
                  <input 
                    value={track.name}
                    onChange={(e) => updateTrack(track.id, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="track-volume">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={track.volume}
                    onChange={(e) => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{Math.round(track.volume * 100)}%</span>
                </div>

                <div className="track-pan">
                  <input 
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.01"
                    value={track.pan}
                    onChange={(e) => updateTrack(track.id, { pan: parseFloat(e.target.value) })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>{track.pan > 0 ? `R${Math.round(track.pan * 100)}` : `L${Math.round(Math.abs(track.pan) * 100)}`}</span>
                </div>

                <button 
                  className="delete-track-btn"
                  onClick={() => deleteTrack(track.id)}
                >
                  🗑️
                </button>
              </div>

              <div className="track-clips">
                {track.clips.map(clip => (
                  <div 
                    key={clip.id}
                    className="clip"
                    style={{
                      left: `${(clip.startTime / 60) * 100}%`,
                      width: `${(clip.duration / 60) * 100}%`
                    }}
                  >
                    <span className="clip-name">{clip.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="timeline">
          <div className="timeline-ruler">
            {Array.from({ length: 60 }, (_, i) => (
              <div key={i} className="timeline-marker">
                {i % 4 === 0 && <span>{i}s</span>}
              </div>
            ))}
          </div>
          <div 
            className="playhead"
            style={{ left: `${(currentTime / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Panel de efectos */}
      <div className="effects-panel">
        <h3>🎛️ Efectos Master</h3>
        
        <div className="effect-controls">
          <div className="effect-group">
            <label>
              <input 
                type="checkbox" 
                checked={effects.reverb.enabled}
                onChange={(e) => setEffects(prev => ({
                  ...prev,
                  reverb: { ...prev.reverb, enabled: e.target.checked }
                }))}
              />
              Reverb
            </label>
            {effects.reverb.enabled && (
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.reverb.amount}
                onChange={(e) => setEffects(prev => ({
                  ...prev,
                  reverb: { ...prev.reverb, amount: parseFloat(e.target.value) }
                }))}
              />
            )}
          </div>

          <div className="effect-group">
            <label>
              <input 
                type="checkbox" 
                checked={effects.delay.enabled}
                onChange={(e) => setEffects(prev => ({
                  ...prev,
                  delay: { ...prev.delay, enabled: e.target.checked }
                }))}
              />
              Delay
            </label>
            {effects.delay.enabled && (
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.delay.amount}
                onChange={(e) => setEffects(prev => ({
                  ...prev,
                  delay: { ...prev.delay, amount: parseFloat(e.target.value) }
                }))}
              />
            )}
          </div>

          <div className="effect-group">
            <label>
              <input 
                type="checkbox" 
                checked={effects.distortion.enabled}
                onChange={(e) => setEffects(prev => ({
                  ...prev,
                  distortion: { ...prev.distortion, enabled: e.target.checked }
                }))}
              />
              Distortion
            </label>
            {effects.distortion.enabled && (
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.distortion.amount}
                onChange={(e) => setEffects(prev => ({
                  ...prev,
                  distortion: { ...prev.distortion, amount: parseFloat(e.target.value) }
                }))}
              />
            )}
          </div>
        </div>

        <div className="master-volume">
          <label>Master Volume: {Math.round(masterVolume * 100)}%</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={masterVolume}
            onChange={(e) => {
              const volume = parseFloat(e.target.value);
              setMasterVolume(volume);
              if (masterGainRef.current) {
                masterGainRef.current.gain.value = volume;
              }
            }}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="daw-actions-bottom">
        <button onClick={addNewTrack} className="add-track-btn">
          ➕ Nueva Pista
        </button>
        <button onClick={exportProject} className="export-btn">
          🎵 Exportar WAV
        </button>
        <button onClick={saveProject} className="save-btn">
          💾 Guardar Proyecto
        </button>
      </div>
    </div>
  );
};

export default DAWEditor;
