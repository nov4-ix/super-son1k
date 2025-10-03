import React, { useState } from 'react';
import './LimiterPro.css';

/**
 * 🎵 Limiter Pro
 * Limitador de masterización para Son1kVers3
 */

const LimiterPro = () => {
  const [params, setParams] = useState({
    threshold: -0.3,
    ceiling: -0.1,
    release: 50,
    attack: 1,
    lookahead: 5,
    mode: 'transparent', // transparent, aggressive, vintage
    link: 100,
    dither: true,
    oversampling: '4x'
  });

  const [grMeter, setGRMeter] = useState(0);
  const [outputMeter, setOutputMeter] = useState({ left: 0, right: 0 });

  const modes = [
    { id: 'transparent', name: 'Transparent', color: '#4FACFE' },
    { id: 'aggressive', name: 'Aggressive', color: '#FF006E' },
    { id: 'vintage', name: 'Vintage', color: '#FFD700' }
  ];

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
    
    // Simular medidores
    if (param === 'threshold') {
      setGRMeter(Math.min(20, Math.abs(value) * 2));
      setOutputMeter({
        left: Math.min(100, 80 + Math.random() * 20),
        right: Math.min(100, 80 + Math.random() * 20)
      });
    }
  };

  return (
    <div className="limiter-pro">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>LIMITER PRO</h2>
          <p className="plugin-subtitle">Mastering Limiter</p>
        </div>
        <div className="mode-selector">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`mode-btn ${params.mode === mode.id ? 'active' : ''}`}
              onClick={() => updateParam('mode', mode.id)}
              style={{
                borderColor: params.mode === mode.id ? mode.color : '#444',
                color: params.mode === mode.id ? mode.color : '#888'
              }}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      <div className="limiter-main">
        {/* Medidores */}
        <div className="limiter-meters">
          {/* Gain Reduction */}
          <div className="meter-section">
            <div className="meter-label">GAIN REDUCTION</div>
            <div className="gr-meter-vertical">
              <div className="meter-scale">
                {[0, -3, -6, -9, -12, -15, -20].map(val => (
                  <div key={val} className="scale-mark">
                    <span>{Math.abs(val)}</span>
                    <div className="scale-line"></div>
                  </div>
                ))}
              </div>
              <div className="meter-bar-container">
                <div 
                  className="meter-bar gr-bar"
                  style={{ height: `${(grMeter / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Output Meters */}
          <div className="meter-section">
            <div className="meter-label">OUTPUT</div>
            <div className="output-meters-vertical">
              <div className="meter-scale">
                {[-20, -12, -6, -3, 0].map(val => (
                  <div key={val} className="scale-mark">
                    <span>{val}</span>
                    <div className="scale-line"></div>
                  </div>
                ))}
              </div>
              <div className="stereo-meters">
                <div className="meter-bar-container">
                  <div className="meter-label-small">L</div>
                  <div 
                    className="meter-bar output-bar"
                    style={{ height: `${outputMeter.left}%` }}
                  ></div>
                </div>
                <div className="meter-bar-container">
                  <div className="meter-label-small">R</div>
                  <div 
                    className="meter-bar output-bar"
                    style={{ height: `${outputMeter.right}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles Principales */}
        <div className="limiter-controls">
          {/* Threshold */}
          <div className="control-group">
            <label>THRESHOLD</label>
            <div className="knob-container">
              <div className="knob large" style={{
                transform: `rotate(${((params.threshold + 20) / 20) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-20"
                max="0"
                step="0.1"
                value={params.threshold}
                onChange={(e) => updateParam('threshold', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value large">{params.threshold.toFixed(1)} dB</div>
          </div>

          {/* Ceiling */}
          <div className="control-group">
            <label>CEILING</label>
            <div className="knob-container">
              <div className="knob large" style={{
                transform: `rotate(${((params.ceiling + 1) / 1) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-1"
                max="0"
                step="0.01"
                value={params.ceiling}
                onChange={(e) => updateParam('ceiling', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value large">{params.ceiling.toFixed(2)} dB</div>
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
                min="1"
                max="200"
                value={params.release}
                onChange={(e) => updateParam('release', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.release} ms</div>
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

          {/* Lookahead */}
          <div className="control-group">
            <label>LOOKAHEAD</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.lookahead / 10) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={params.lookahead}
                onChange={(e) => updateParam('lookahead', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.lookahead.toFixed(1)} ms</div>
          </div>

          {/* Link */}
          <div className="control-group">
            <label>STEREO LINK</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.link / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.link}
                onChange={(e) => updateParam('link', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.link}%</div>
          </div>
        </div>
      </div>

      {/* Opciones Avanzadas */}
      <div className="limiter-options">
        <div className="option-group">
          <label>OVERSAMPLING</label>
          <select 
            value={params.oversampling}
            onChange={(e) => updateParam('oversampling', e.target.value)}
            className="option-select"
          >
            <option value="1x">1x (Off)</option>
            <option value="2x">2x</option>
            <option value="4x">4x</option>
            <option value="8x">8x</option>
          </select>
        </div>

        <div className="option-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={params.dither}
              onChange={(e) => updateParam('dither', e.target.checked)}
            />
            <span>DITHER</span>
          </label>
        </div>

        <div className="stats-display">
          <div className="stat-item">
            <span className="stat-label">GR:</span>
            <span className="stat-value">{grMeter.toFixed(1)} dB</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">PEAK:</span>
            <span className="stat-value">{params.ceiling.toFixed(2)} dB</span>
          </div>
        </div>
      </div>

      <div className="plugin-footer">
        <span>Son1kVers3 • Limiter Pro v2.0</span>
      </div>
    </div>
  );
};

export default LimiterPro;
