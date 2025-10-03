import React, { useState } from 'react';
import './SaturatorPro.css';

/**
 * ⚡ Saturator Pro
 * Saturación analógica para Son1kVers3
 */

const SaturatorPro = () => {
  const [params, setParams] = useState({
    drive: 0,
    type: 'tube', // tube, tape, transistor, diode
    tone: 50,
    mix: 100,
    output: 0,
    bias: 0,
    harmonics: 50
  });

  const saturationTypes = [
    { id: 'tube', name: 'Tube', icon: '🔥', color: '#FF6B00' },
    { id: 'tape', name: 'Tape', icon: '📼', color: '#FF006E' },
    { id: 'transistor', name: 'Transistor', icon: '⚡', color: '#4FACFE' },
    { id: 'diode', name: 'Diode', icon: '💎', color: '#8338EC' }
  ];

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
  };

  // Generar forma de onda saturada
  const generateWaveform = () => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 200;
      const input = Math.sin((i / 100) * Math.PI * 4);
      const drive = params.drive / 10;
      const saturated = Math.tanh(input * (1 + drive));
      const y = 40 - (saturated * 30);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="saturator-pro">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>SATURATOR PRO</h2>
          <p className="plugin-subtitle">Analog Saturation Processor</p>
        </div>
      </div>

      <div className="saturator-main">
        {/* Tipo de Saturación */}
        <div className="saturation-types">
          {saturationTypes.map((type) => (
            <button
              key={type.id}
              className={`type-btn ${params.type === type.id ? 'active' : ''}`}
              onClick={() => updateParam('type', type.id)}
              style={{
                borderColor: params.type === type.id ? type.color : '#444'
              }}
            >
              <span className="type-icon">{type.icon}</span>
              <span className="type-name">{type.name}</span>
            </button>
          ))}
        </div>

        {/* Visualizador de Forma de Onda */}
        <div className="waveform-display">
          <svg width="100%" height="80" viewBox="0 0 200 80">
            {/* Grid */}
            <line x1="0" y1="40" x2="200" y2="40" stroke="#333" strokeWidth="1" />
            <line x1="100" y1="0" x2="100" y2="80" stroke="#333" strokeWidth="1" />
            
            {/* Waveform Original */}
            <polyline
              points={generateWaveform()}
              stroke="#666"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            
            {/* Waveform Saturada */}
            <polyline
              points={generateWaveform()}
              stroke={saturationTypes.find(t => t.id === params.type)?.color || '#4FACFE'}
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <div className="waveform-label">
            <span>INPUT</span>
            <span>OUTPUT</span>
          </div>
        </div>

        {/* Controles */}
        <div className="saturator-controls">
          {/* Drive */}
          <div className="control-group">
            <label>DRIVE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.drive / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.drive}
                onChange={(e) => updateParam('drive', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.drive}%</div>
          </div>

          {/* Tone */}
          <div className="control-group">
            <label>TONE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.tone / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.tone}
                onChange={(e) => updateParam('tone', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.tone}%</div>
          </div>

          {/* Bias */}
          <div className="control-group">
            <label>BIAS</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.bias + 50) / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={params.bias}
                onChange={(e) => updateParam('bias', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.bias > 0 ? '+' : ''}{params.bias}</div>
          </div>

          {/* Harmonics */}
          <div className="control-group">
            <label>HARMONICS</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.harmonics / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.harmonics}
                onChange={(e) => updateParam('harmonics', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.harmonics}%</div>
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

          {/* Output */}
          <div className="control-group">
            <label>OUTPUT</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.output + 20) / 40) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.1"
                value={params.output}
                onChange={(e) => updateParam('output', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.output.toFixed(1)} dB</div>
          </div>
        </div>

        {/* Medidor de Armónicos */}
        <div className="harmonics-meter">
          <div className="meter-label">HARMONIC CONTENT</div>
          <div className="harmonics-bars">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((harmonic) => {
              const height = Math.max(5, (params.harmonics / 100) * (100 / harmonic) * (params.drive / 100));
              return (
                <div key={harmonic} className="harmonic-bar-container">
                  <div 
                    className="harmonic-bar"
                    style={{ 
                      height: `${height}%`,
                      background: harmonic <= 3 ? '#4FACFE' : harmonic <= 5 ? '#FFD700' : '#FF6B00'
                    }}
                  />
                  <span className="harmonic-label">{harmonic}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="plugin-footer">
        <span>Son1kVers3 • Saturator Pro v2.0</span>
      </div>
    </div>
  );
};

export default SaturatorPro;
