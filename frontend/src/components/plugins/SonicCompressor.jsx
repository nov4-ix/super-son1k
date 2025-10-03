import React, { useState } from 'react';
import './SonicCompressor.css';

/**
 * 🔊 Sonic Compressor - Estilo CLA-76
 * Compresor profesional para Son1kVers3
 */

const SonicCompressor = () => {
  const [params, setParams] = useState({
    input: 0,
    output: 0,
    attack: 3,
    release: 7,
    ratio: 4,
    mix: 100,
    mode: 'all', // all, 4:1, 8:1, 12:1, 20:1
    meter: 'gr' // gr (gain reduction) or output
  });

  const [grMeter, setGRMeter] = useState(0);
  const [outputMeter, setOutputMeter] = useState(0);

  const ratios = [
    { value: 2, label: '2:1' },
    { value: 4, label: '4:1' },
    { value: 8, label: '8:1' },
    { value: 12, label: '12:1' },
    { value: 20, label: '20:1' }
  ];

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
    
    // Simular medidores
    if (param === 'input' || param === 'ratio') {
      setGRMeter(Math.min(20, Math.abs(value) * (params.ratio / 4)));
      setOutputMeter(Math.min(100, 50 + value));
    }
  };

  return (
    <div className="sonic-compressor">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>SONIC COMPRESSOR</h2>
          <p className="plugin-subtitle">Professional Dynamics Processor</p>
        </div>
        <div className="plugin-preset">
          <select className="preset-selector">
            <option>Vocal Punch</option>
            <option>Drum Glue</option>
            <option>Bass Tight</option>
            <option>Mix Bus</option>
            <option>Parallel Comp</option>
          </select>
        </div>
      </div>

      <div className="comp-main-panel">
        {/* Meters */}
        <div className="comp-meters">
          <div className="meter-section">
            <div className="meter-label">GAIN REDUCTION</div>
            <div className="vu-meter gr-meter">
              <div className="meter-scale">
                {[0, -3, -6, -9, -12, -15, -20].map(val => (
                  <div key={val} className="scale-mark">
                    <span>{Math.abs(val)}</span>
                  </div>
                ))}
              </div>
              <div className="meter-needle" style={{
                transform: `rotate(${-90 + (grMeter / 20) * 180}deg)`
              }}></div>
            </div>
          </div>

          <div className="meter-section">
            <div className="meter-label">OUTPUT</div>
            <div className="vu-meter output-meter">
              <div className="meter-scale">
                {[-20, -10, -7, -5, -3, 0, +3].map(val => (
                  <div key={val} className="scale-mark">
                    <span>{val > 0 ? '+' + val : val}</span>
                  </div>
                ))}
              </div>
              <div className="meter-needle" style={{
                transform: `rotate(${-90 + (outputMeter / 100) * 180}deg)`
              }}></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="comp-controls">
          {/* Input */}
          <div className="control-group">
            <label>INPUT</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${params.input * 2.7}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.1"
                value={params.input}
                onChange={(e) => updateParam('input', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.input.toFixed(1)} dB</div>
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
                transform: `rotate(${(params.release / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={params.release}
                onChange={(e) => updateParam('release', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.release.toFixed(0)} ms</div>
          </div>

          {/* Ratio */}
          <div className="control-group">
            <label>RATIO</label>
            <div className="ratio-selector">
              {ratios.map(ratio => (
                <button
                  key={ratio.value}
                  className={`ratio-btn ${params.ratio === ratio.value ? 'active' : ''}`}
                  onClick={() => updateParam('ratio', ratio.value)}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Output */}
          <div className="control-group">
            <label>OUTPUT</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${params.output * 2.7}deg)`
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
                step="1"
                value={params.mix}
                onChange={(e) => updateParam('mix', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.mix}%</div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="comp-bottom">
        <div className="mode-selector">
          <label>MODE</label>
          <div className="mode-buttons">
            <button 
              className={`mode-btn ${params.mode === 'all' ? 'active' : ''}`}
              onClick={() => updateParam('mode', 'all')}
            >
              ALL
            </button>
            <button 
              className={`mode-btn ${params.mode === '4' ? 'active' : ''}`}
              onClick={() => updateParam('mode', '4')}
            >
              4:1
            </button>
            <button 
              className={`mode-btn ${params.mode === '8' ? 'active' : ''}`}
              onClick={() => updateParam('mode', '8')}
            >
              8:1
            </button>
          </div>
        </div>

        <div className="plugin-info">
          <span>Son1kVers3 • Sonic Compressor v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default SonicCompressor;
