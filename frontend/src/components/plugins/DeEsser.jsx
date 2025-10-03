import React, { useState } from 'react';
import './DeEsser.css';

/**
 * 🔇 De-Esser
 * Control de sibilantes para Son1kVers3
 */

const DeEsser = () => {
  const [params, setParams] = useState({
    frequency: 6500,
    threshold: -20,
    range: 10,
    bandwidth: 2.0,
    mode: 'split', // split, wideband
    listen: false,
    attack: 1,
    release: 50
  });

  const [sibilanceDetected, setSibilanceDetected] = useState(0);

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
    
    // Simular detección de sibilancia
    if (param === 'threshold' || param === 'frequency') {
      setSibilanceDetected(Math.random() * 100);
    }
  };

  // Generar espectro de frecuencias
  const generateSpectrum = () => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const freq = 20 * Math.pow(1000, i / 100);
      const x = i * 2;
      
      // Simular respuesta de frecuencia
      let magnitude = 50;
      if (freq > params.frequency - 1000 && freq < params.frequency + 1000) {
        const distance = Math.abs(freq - params.frequency);
        const reduction = params.range * (1 - distance / 1000);
        magnitude -= reduction;
      }
      
      const y = 80 - magnitude;
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="de-esser">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>DE-ESSER</h2>
          <p className="plugin-subtitle">Sibilance Control Processor</p>
        </div>
        <div className="mode-toggle">
          <button
            className={`mode-btn ${params.mode === 'split' ? 'active' : ''}`}
            onClick={() => updateParam('mode', 'split')}
          >
            Split Band
          </button>
          <button
            className={`mode-btn ${params.mode === 'wideband' ? 'active' : ''}`}
            onClick={() => updateParam('mode', 'wideband')}
          >
            Wideband
          </button>
        </div>
      </div>

      <div className="deesser-main">
        {/* Visualizador de Espectro */}
        <div className="spectrum-visualizer">
          <div className="spectrum-display">
            <svg width="100%" height="100" viewBox="0 0 200 100">
              {/* Grid */}
              <line x1="0" y1="50" x2="200" y2="50" stroke="#333" strokeWidth="1" strokeDasharray="4" />
              
              {/* Frequency Response */}
              <polyline
                points={generateSpectrum()}
                stroke="#4FACFE"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Sibilance Range */}
              <rect
                x={(Math.log10(params.frequency / 20) / Math.log10(1000)) * 200 - 10}
                y="0"
                width="20"
                height="100"
                fill="rgba(255, 0, 110, 0.2)"
                stroke="#FF006E"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Frequency Labels */}
          <div className="freq-labels">
            <span>20Hz</span>
            <span>200Hz</span>
            <span>2kHz</span>
            <span>20kHz</span>
          </div>

          {/* Sibilance Meter */}
          <div className="sibilance-meter">
            <div className="meter-label">SIBILANCE DETECTED</div>
            <div className="meter-bar-container">
              <div 
                className="sibilance-bar"
                style={{ width: `${sibilanceDetected}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="deesser-controls">
          {/* Frequency */}
          <div className="control-group">
            <label>FREQUENCY</label>
            <div className="knob-container">
              <div className="knob large" style={{
                transform: `rotate(${((Math.log10(params.frequency / 2000) / Math.log10(5)) * 270) - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="2000"
                max="10000"
                value={params.frequency}
                onChange={(e) => updateParam('frequency', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value large">{(params.frequency / 1000).toFixed(1)} kHz</div>
          </div>

          {/* Threshold */}
          <div className="control-group">
            <label>THRESHOLD</label>
            <div className="knob-container">
              <div className="knob large" style={{
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
            <div className="param-value large">{params.threshold.toFixed(1)} dB</div>
          </div>

          {/* Range */}
          <div className="control-group">
            <label>RANGE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.range / 20) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.1"
                value={params.range}
                onChange={(e) => updateParam('range', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.range.toFixed(1)} dB</div>
          </div>

          {/* Bandwidth */}
          <div className="control-group">
            <label>BANDWIDTH</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.bandwidth / 5) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={params.bandwidth}
                onChange={(e) => updateParam('bandwidth', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.bandwidth.toFixed(1)} oct</div>
          </div>

          {/* Attack */}
          <div className="control-group">
            <label>ATTACK</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.attack / 10) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
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
        </div>
      </div>

      {/* Listen Mode */}
      <div className="deesser-options">
        <button
          className={`listen-btn ${params.listen ? 'active' : ''}`}
          onClick={() => updateParam('listen', !params.listen)}
        >
          <span className="listen-icon">🎧</span>
          <span>LISTEN TO SIBILANCE</span>
        </button>

        <div className="info-display">
          <div className="info-item">
            <span className="info-label">Mode:</span>
            <span className="info-value">{params.mode === 'split' ? 'Split Band' : 'Wideband'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Reduction:</span>
            <span className="info-value">{(sibilanceDetected / 10).toFixed(1)} dB</span>
          </div>
        </div>
      </div>

      <div className="plugin-footer">
        <span>Son1kVers3 • De-Esser v2.0</span>
      </div>
    </div>
  );
};

export default DeEsser;
