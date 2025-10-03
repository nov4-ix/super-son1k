import React, { useState } from 'react';
import './VocalCompressor.css';

/**
 * 🎤 Vocal Compressor
 * Compresor optimizado para voces
 */

const VocalCompressor = () => {
  const [params, setParams] = useState({
    threshold: -18,
    ratio: 4,
    attack: 5,
    release: 40,
    knee: 3,
    makeupGain: 0,
    mix: 100,
    sidechain: false,
    hpfFreq: 80,
    presence: 0
  });

  const [grMeter, setGRMeter] = useState(0);

  const presets = [
    { name: 'Soft Vocal', threshold: -20, ratio: 3, attack: 10, release: 50 },
    { name: 'Punchy Vocal', threshold: -15, ratio: 6, attack: 3, release: 30 },
    { name: 'Broadcast', threshold: -12, ratio: 8, attack: 1, release: 20 },
    { name: 'Gentle', threshold: -24, ratio: 2, attack: 15, release: 60 }
  ];

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
    
    if (param === 'threshold' || param === 'ratio') {
      setGRMeter(Math.min(15, Math.abs(value) / 2));
    }
  };

  const loadPreset = (preset) => {
    setParams({
      ...params,
      threshold: preset.threshold,
      ratio: preset.ratio,
      attack: preset.attack,
      release: preset.release
    });
  };

  return (
    <div className="vocal-compressor">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>VOCAL COMPRESSOR</h2>
          <p className="plugin-subtitle">Optimized for Voice Processing</p>
        </div>
        <div className="preset-selector">
          <select onChange={(e) => {
            const preset = presets[e.target.value];
            if (preset) loadPreset(preset);
          }}>
            <option value="">Select Preset</option>
            {presets.map((preset, index) => (
              <option key={index} value={index}>{preset.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="vocal-comp-main">
        {/* Visualizador de Compresión */}
        <div className="compression-visualizer">
          <div className="waveform-container">
            <svg width="100%" height="120" viewBox="0 0 200 120">
              {/* Grid */}
              <line x1="0" y1="60" x2="200" y2="60" stroke="#333" strokeWidth="1" strokeDasharray="4" />
              <line x1="100" y1="0" x2="100" y2="120" stroke="#333" strokeWidth="1" strokeDasharray="4" />
              
              {/* Input Waveform */}
              <path
                d="M 0,60 Q 25,20 50,60 T 100,60 T 150,60 T 200,60"
                stroke="#666"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              
              {/* Compressed Waveform */}
              <path
                d={`M 0,60 Q 25,${60 - (40 / params.ratio)} 50,60 T 100,60 T 150,60 T 200,60`}
                stroke="#FF006E"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Threshold Line */}
              <line 
                x1="0" 
                y1={60 - ((params.threshold + 30) * 2)} 
                x2="200" 
                y2={60 - ((params.threshold + 30) * 2)}
                stroke="#4FACFE" 
                strokeWidth="1" 
                strokeDasharray="2"
              />
            </svg>
          </div>

          {/* GR Meter */}
          <div className="gr-meter-display">
            <div className="meter-label">GAIN REDUCTION</div>
            <div className="meter-bar-horizontal">
              <div 
                className="meter-fill"
                style={{ width: `${(grMeter / 15) * 100}%` }}
              ></div>
            </div>
            <div className="meter-value">{grMeter.toFixed(1)} dB</div>
          </div>
        </div>

        {/* Controles */}
        <div className="vocal-comp-controls">
          {/* Threshold */}
          <div className="control-group">
            <label>THRESHOLD</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.threshold + 40) / 40) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-40"
                max="0"
                step="0.1"
                value={params.threshold}
                onChange={(e) => updateParam('threshold', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.threshold.toFixed(1)} dB</div>
          </div>

          {/* Ratio */}
          <div className="control-group">
            <label>RATIO</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.ratio / 20) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={params.ratio}
                onChange={(e) => updateParam('ratio', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.ratio.toFixed(1)}:1</div>
          </div>

          {/* Attack */}
          <div className="control-group">
            <label>ATTACK</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.attack / 50) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0.1"
                max="50"
                step="0.1"
                value={params.attack}
                onChange={(e) => updateParam('attack', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.attack.toFixed(1)} ms</div>
          </div>

          {/* Release */}
          <div className="control-group">
            <label>RELEASE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.release / 200) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={params.release}
                onChange={(e) => updateParam('release', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.release} ms</div>
          </div>

          {/* Knee */}
          <div className="control-group">
            <label>KNEE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.knee / 10) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={params.knee}
                onChange={(e) => updateParam('knee', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.knee.toFixed(1)} dB</div>
          </div>

          {/* Makeup Gain */}
          <div className="control-group">
            <label>MAKEUP</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.makeupGain + 20) / 40) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.1"
                value={params.makeupGain}
                onChange={(e) => updateParam('makeupGain', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.makeupGain.toFixed(1)} dB</div>
          </div>

          {/* Presence */}
          <div className="control-group">
            <label>PRESENCE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.presence + 6) / 12) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.1"
                value={params.presence}
                onChange={(e) => updateParam('presence', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.presence.toFixed(1)} dB</div>
          </div>

          {/* Mix */}
          <div className="control-group">
            <label>MIX</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.mix / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.mix}
                onChange={(e) => updateParam('mix', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.mix}%</div>
          </div>
        </div>
      </div>

      {/* Opciones Adicionales */}
      <div className="vocal-comp-options">
        <div className="option-group">
          <label>HPF FREQUENCY</label>
          <input
            type="range"
            min="20"
            max="200"
            value={params.hpfFreq}
            onChange={(e) => updateParam('hpfFreq', parseFloat(e.target.value))}
            className="option-slider"
          />
          <span className="option-value">{params.hpfFreq} Hz</span>
        </div>

        <div className="option-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={params.sidechain}
              onChange={(e) => updateParam('sidechain', e.target.checked)}
            />
            <span>SIDECHAIN HPF</span>
          </label>
        </div>
      </div>

      <div className="plugin-footer">
        <span>Son1kVers3 • Vocal Compressor v2.0</span>
      </div>
    </div>
  );
};

export default VocalCompressor;
