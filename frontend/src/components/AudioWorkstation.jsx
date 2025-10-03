import React, { useState } from 'react';
import './AudioWorkstation.css';

// Mixer de Audio Visual
export const AudioMixer = () => {
  const [channels, setChannels] = useState([
    { id: 1, name: 'Kick', volume: 75, pan: 0, mute: false, solo: false, color: '#ef4444' },
    { id: 2, name: 'Snare', volume: 65, pan: 10, mute: false, solo: false, color: '#f59e0b' },
    { id: 3, name: 'Hi-Hat', volume: 55, pan: -10, mute: false, solo: false, color: '#10b981' },
    { id: 4, name: 'Bass', volume: 80, pan: 0, mute: false, solo: false, color: '#3b82f6' },
    { id: 5, name: 'Synth', volume: 60, pan: 20, mute: false, solo: false, color: '#8b5cf6' },
    { id: 6, name: 'Vocals', volume: 70, pan: 0, mute: false, solo: false, color: '#ec4899' }
  ]);

  const updateChannel = (id, prop, value) => {
    setChannels(channels.map(ch => ch.id === id ? { ...ch, [prop]: value } : ch));
  };

  return (
    <div className="audio-mixer">
      <div className="mixer-header">
        <h2>🎛️ Mixer</h2>
        <div className="mixer-controls">
          <button>💾 Guardar</button>
          <button>🔄 Reset</button>
        </div>
      </div>
      <div className="mixer-channels">
        {channels.map(channel => (
          <div key={channel.id} className="mixer-channel" style={{ borderTop: `3px solid ${channel.color}` }}>
            <div className="channel-header">
              <span className="channel-name">{channel.name}</span>
              <div className="channel-buttons">
                <button 
                  className={`btn-mute ${channel.mute ? 'active' : ''}`}
                  onClick={() => updateChannel(channel.id, 'mute', !channel.mute)}
                >
                  M
                </button>
                <button 
                  className={`btn-solo ${channel.solo ? 'active' : ''}`}
                  onClick={() => updateChannel(channel.id, 'solo', !channel.solo)}
                >
                  S
                </button>
              </div>
            </div>
            
            <div className="channel-fader">
              <div className="fader-track">
                <div 
                  className="fader-level" 
                  style={{ height: `${channel.volume}%`, background: channel.color }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={channel.volume}
                onChange={(e) => updateChannel(channel.id, 'volume', e.target.value)}
                className="fader-input"
                orient="vertical"
              />
              <span className="fader-value">{channel.volume}</span>
            </div>

            <div className="channel-pan">
              <label>Pan</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={channel.pan}
                onChange={(e) => updateChannel(channel.id, 'pan', e.target.value)}
              />
              <span>{channel.pan > 0 ? 'R' : channel.pan < 0 ? 'L' : 'C'}</span>
            </div>

            <div className="channel-meter">
              <div className="meter-bar" style={{ height: `${channel.volume * 0.8}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Secuenciador de Beats
export const BeatSequencer = () => {
  const [steps] = useState(16);
  const [instruments] = useState(['Kick', 'Snare', 'Hi-Hat', 'Clap', 'Tom', 'Cymbal']);
  const [pattern, setPattern] = useState(
    instruments.map(() => Array(steps).fill(false))
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleStep = (instrumentIndex, stepIndex) => {
    const newPattern = [...pattern];
    newPattern[instrumentIndex][stepIndex] = !newPattern[instrumentIndex][stepIndex];
    setPattern(newPattern);
  };

  return (
    <div className="beat-sequencer">
      <div className="sequencer-header">
        <h2>🥁 Secuenciador de Beats</h2>
        <div className="sequencer-controls">
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button onClick={() => setPattern(instruments.map(() => Array(steps).fill(false)))}>
            🗑️ Clear
          </button>
        </div>
      </div>
      <div className="sequencer-grid">
        {instruments.map((instrument, i) => (
          <div key={i} className="sequencer-row">
            <div className="instrument-label">{instrument}</div>
            <div className="steps-container">
              {pattern[i].map((active, j) => (
                <button
                  key={j}
                  className={`step ${active ? 'active' : ''} ${j === currentStep ? 'current' : ''}`}
                  onClick={() => toggleStep(i, j)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Piano Roll
export const PianoRoll = () => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octaves = [3, 4, 5];
  const [activeNotes, setActiveNotes] = useState([]);

  const playNote = (note) => {
    setActiveNotes([...activeNotes, note]);
    setTimeout(() => {
      setActiveNotes(activeNotes.filter(n => n !== note));
    }, 200);
  };

  return (
    <div className="piano-roll">
      <div className="piano-header">
        <h2>🎹 Piano Roll</h2>
        <div className="piano-controls">
          <button>📝 Grabar</button>
          <button>🎼 MIDI</button>
        </div>
      </div>
      <div className="piano-keyboard">
        {octaves.map(octave => (
          <div key={octave} className="octave">
            {notes.map((note, i) => {
              const fullNote = `${note}${octave}`;
              const isBlack = note.includes('#');
              return (
                <button
                  key={fullNote}
                  className={`piano-key ${isBlack ? 'black' : 'white'} ${activeNotes.includes(fullNote) ? 'active' : ''}`}
                  onClick={() => playNote(fullNote)}
                >
                  <span>{note}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Biblioteca de Samples
export const SampleLibrary = () => {
  const [samples] = useState([
    { id: 1, name: 'Kick Heavy', category: 'Drums', duration: '0:01', bpm: 128 },
    { id: 2, name: 'Snare Tight', category: 'Drums', duration: '0:01', bpm: 128 },
    { id: 3, name: 'Bass Drop', category: 'Bass', duration: '0:03', bpm: 140 },
    { id: 4, name: 'Synth Lead', category: 'Synths', duration: '0:08', bpm: 128 },
    { id: 5, name: 'Vocal Chop', category: 'Vocals', duration: '0:02', bpm: 120 },
    { id: 6, name: 'FX Riser', category: 'FX', duration: '0:04', bpm: 0 }
  ]);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'Drums', 'Bass', 'Synths', 'Vocals', 'FX'];

  const filteredSamples = filter === 'all' 
    ? samples 
    : samples.filter(s => s.category === filter);

  return (
    <div className="sample-library">
      <div className="library-header">
        <h2>📚 Biblioteca de Samples</h2>
        <input type="search" placeholder="Buscar samples..." />
      </div>
      <div className="library-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? 'active' : ''}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="sample-list">
        {filteredSamples.map(sample => (
          <div key={sample.id} className="sample-item">
            <div className="sample-icon">🎵</div>
            <div className="sample-info">
              <div className="sample-name">{sample.name}</div>
              <div className="sample-meta">
                <span>{sample.category}</span>
                <span>{sample.duration}</span>
                {sample.bpm > 0 && <span>{sample.bpm} BPM</span>}
              </div>
            </div>
            <div className="sample-actions">
              <button>▶️</button>
              <button>📥</button>
              <button>➕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
