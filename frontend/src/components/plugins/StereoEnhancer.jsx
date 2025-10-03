import React, { useState } from 'react';
import './StereoEnhancer.css';

/**
 * 🎧 Stereo Enhancer
 * Mejora de imagen estéreo para Son1kVers3
 */

const StereoEnhancer = () => {
  const [params, setParams] = useState({
    width: 100,
    depth: 50,
    mono: 0,
    lowFreqMono: 200,
    rotation: 0,
    balance: 0,
    mode: 'ms', // ms (mid-side), lr (left-right)
    phase: false
  });

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
  };

  // Generar visualización estéreo
  const generateStereoField = () => {
    const width = params.width / 100;
    const depth = params.depth / 100;
    
    return (
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Grid */}
        <circle cx="100" cy="100" r="80" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="4" />
        <circle cx="100" cy="100" r="60" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="4" />
        <circle cx="100" cy="100" r="40" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="4" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="#333" strokeWidth="1" strokeDasharray="4" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="#333" strokeWidth="1" strokeDasharray="4" />
        
        {/* Stereo Field */}
        <ellipse
          cx="100"
          cy="100"
          rx={80 * width}
          ry={80 * depth}
          fill="rgba(79, 172, 254, 0.2)"
          stroke="#4FACFE"
          strokeWidth="2"
          transform={`rotate(${params.rotation} 100 100)`}
        />
        
        {/* L/R Indicators */}
        <circle cx={100 - (60 * width)} cy="100" r="8" fill="#FF006E" />
        <circle cx={100 + (60 * width)} cy="100" r="8" fill="#4FACFE" />
        
        {/* Labels */}
        <text x="30" y="105" fill="#666" fontSize="12" fontWeight="700">L</text>
        <text x="165" y="105" fill="#666" fontSize="12" fontWeight="700">R</text>
      </svg>
    );
  };

  return (
    <div className="stereo-enhancer">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>STEREO ENHANCER</h2>
          <p className="plugin-subtitle">Stereo Image Processor</p>
        </div>
        <div className="mode-selector">
          <button
            className={`mode-btn ${params.mode === 'ms' ? 'active' : ''}`}
            onClick={() => updateParam('mode', 'ms')}
          >
            M/S
          </button>
          <button
            className={`mode-btn ${params.mode === 'lr' ? 'active' : ''}`}
            onClick={() => updateParam('mode', 'lr')}
          >
            L/R
          </button>
        </div>
      </div>

      <div className="stereo-main">
        {/* Visualizador de Campo Estéreo */}
        <div className="stereo-visualizer">
          <div className="stereo-field">
            {generateStereoField()}
          </div>
          
          <div className="correlation-meter">
            <div className="meter-label">CORRELATION</div>
            <div className="correlation-bar">
              <div className="correlation-scale">
                <span>-1</span>
                <span>0</span>
                <span>+1</span>
              </div>
              <div className="correlation-indicator" style={{
                left: `${((params.width / 100) * 50) + 25}%`
              }}></div>
            </div>
          </div>

          <div className="phase-meter">
            <div className="meter-label">PHASE</div>
            <div className="phase-display">
              <div className={`phase-indicator ${params.phase ? 'warning' : 'ok'}`}>
                {params.phase ? '⚠️ PHASE ISSUE' : '✓ PHASE OK'}
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="stereo-controls">
          {/* Width */}
          <div className="control-group">
            <label>WIDTH</label>
            <div className="knob-container">
              <div className="knob large" style={{
                transform: `rotate(${(params.width / 200) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={params.width}
                onChange={(e) => updateParam('width', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value large">{params.width}%</div>
          </div>

          {/* Depth */}
          <div className="control-group">
            <label>DEPTH</label>
            <div className="knob-container">
              <div className="knob large" style={{
                transform: `rotate(${(params.depth / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.depth}
                onChange={(e) => updateParam('depth', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value large">{params.depth}%</div>
          </div>

          {/* Mono */}
          <div className="control-group">
            <label>MONO</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.mono / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.mono}
                onChange={(e) => updateParam('mono', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.mono}%</div>
          </div>

          {/* Rotation */}
          <div className="control-group">
            <label>ROTATION</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.rotation + 180) / 360) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={params.rotation}
                onChange={(e) => updateParam('rotation', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.rotation}°</div>
          </div>

          {/* Balance */}
          <div className="control-group">
            <label>BALANCE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((params.balance + 100) / 200) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={params.balance}
                onChange={(e) => updateParam('balance', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">
              {params.balance === 0 ? 'C' : params.balance > 0 ? `R${params.balance}` : `L${Math.abs(params.balance)}`}
            </div>
          </div>

          {/* Low Freq Mono */}
          <div className="control-group">
            <label>LOW MONO</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${((Math.log10(params.lowFreqMono / 20) / Math.log10(50)) * 270) - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                value={params.lowFreqMono}
                onChange={(e) => updateParam('lowFreqMono', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.lowFreqMono} Hz</div>
          </div>
        </div>
      </div>

      {/* Opciones */}
      <div className="stereo-options">
        <button
          className={`phase-btn ${params.phase ? 'active' : ''}`}
          onClick={() => updateParam('phase', !params.phase)}
        >
          <span>⚡</span>
          <span>PHASE INVERT</span>
        </button>

        <div className="presets">
          <button onClick={() => {
            setParams({ ...params, width: 100, depth: 50, mono: 0, rotation: 0 });
          }}>
            Reset
          </button>
          <button onClick={() => {
            setParams({ ...params, width: 150, depth: 70, mono: 0, rotation: 0 });
          }}>
            Wide
          </button>
          <button onClick={() => {
            setParams({ ...params, width: 50, depth: 30, mono: 50, rotation: 0 });
          }}>
            Narrow
          </button>
          <button onClick={() => {
            setParams({ ...params, width: 0, depth: 0, mono: 100, rotation: 0 });
          }}>
            Mono
          </button>
        </div>
      </div>

      <div className="plugin-footer">
        <span>Son1kVers3 • Stereo Enhancer v2.0</span>
      </div>
    </div>
  );
};

export default StereoEnhancer;
