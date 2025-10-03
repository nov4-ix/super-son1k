import React, { useState } from 'react';
import './ReverbChamber.css';

/**
 * 🌊 Reverb Chamber
 * Reverberación espacial premium para Son1kVers3
 */

const ReverbChamber = () => {
  const [params, setParams] = useState({
    roomSize: 50,
    decay: 3.5,
    damping: 50,
    predelay: 20,
    diffusion: 70,
    earlyReflections: 30,
    mix: 25,
    width: 100,
    lowCut: 100,
    highCut: 8000,
    modulation: 0
  });

  const roomTypes = [
    { name: 'Small Room', size: 30, decay: 1.5 },
    { name: 'Medium Room', size: 50, decay: 2.5 },
    { name: 'Large Hall', size: 70, decay: 4.0 },
    { name: 'Cathedral', size: 90, decay: 6.0 },
    { name: 'Plate', size: 40, decay: 3.0 },
    { name: 'Spring', size: 25, decay: 2.0 }
  ];

  const updateParam = (param, value) => {
    setParams({ ...params, [param]: value });
  };

  const loadPreset = (preset) => {
    setParams({
      ...params,
      roomSize: preset.size,
      decay: preset.decay
    });
  };

  return (
    <div className="reverb-chamber">
      <div className="plugin-header-section">
        <div className="plugin-branding">
          <h2>REVERB CHAMBER</h2>
          <p className="plugin-subtitle">Spatial Reverb Processor</p>
        </div>
        <div className="preset-buttons">
          {roomTypes.map((type, index) => (
            <button
              key={index}
              className="preset-btn"
              onClick={() => loadPreset(type)}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div className="reverb-main">
        {/* Visualizador */}
        <div className="reverb-visualizer">
          <div className="room-display">
            <div 
              className="room-size-indicator"
              style={{ 
                width: `${params.roomSize}%`,
                height: `${params.roomSize}%`
              }}
            >
              <div className="reflection-lines">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="reflection-line"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      opacity: params.earlyReflections / 100
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="decay-graph">
            <svg width="100%" height="80" viewBox="0 0 200 80">
              <path
                d={`M 0,10 Q ${params.decay * 20},${40 + params.damping / 2} 200,${70 - params.diffusion / 3}`}
                stroke="#4FACFE"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Controles Principales */}
        <div className="reverb-controls">
          {/* Room Size */}
          <div className="control-group">
            <label>ROOM SIZE</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.roomSize / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.roomSize}
                onChange={(e) => updateParam('roomSize', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.roomSize}%</div>
          </div>

          {/* Decay */}
          <div className="control-group">
            <label>DECAY</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.decay / 10) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={params.decay}
                onChange={(e) => updateParam('decay', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.decay.toFixed(1)}s</div>
          </div>

          {/* Damping */}
          <div className="control-group">
            <label>DAMPING</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.damping / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.damping}
                onChange={(e) => updateParam('damping', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.damping}%</div>
          </div>

          {/* Predelay */}
          <div className="control-group">
            <label>PREDELAY</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.predelay / 200) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={params.predelay}
                onChange={(e) => updateParam('predelay', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.predelay}ms</div>
          </div>

          {/* Diffusion */}
          <div className="control-group">
            <label>DIFFUSION</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.diffusion / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.diffusion}
                onChange={(e) => updateParam('diffusion', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.diffusion}%</div>
          </div>

          {/* Early Reflections */}
          <div className="control-group">
            <label>EARLY REF</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.earlyReflections / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.earlyReflections}
                onChange={(e) => updateParam('earlyReflections', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.earlyReflections}%</div>
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

          {/* Width */}
          <div className="control-group">
            <label>WIDTH</label>
            <div className="knob-container">
              <div className="knob" style={{
                transform: `rotate(${(params.width / 100) * 270 - 135}deg)`
              }}>
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.width}
                onChange={(e) => updateParam('width', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <div className="param-value">{params.width}%</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="reverb-filters">
        <div className="filter-section">
          <label>LOW CUT</label>
          <input
            type="range"
            min="20"
            max="500"
            value={params.lowCut}
            onChange={(e) => updateParam('lowCut', parseFloat(e.target.value))}
            className="filter-slider"
          />
          <span className="filter-value">{params.lowCut} Hz</span>
        </div>

        <div className="filter-section">
          <label>HIGH CUT</label>
          <input
            type="range"
            min="2000"
            max="20000"
            value={params.highCut}
            onChange={(e) => updateParam('highCut', parseFloat(e.target.value))}
            className="filter-slider"
          />
          <span className="filter-value">{(params.highCut / 1000).toFixed(1)} kHz</span>
        </div>

        <div className="filter-section">
          <label>MODULATION</label>
          <input
            type="range"
            min="0"
            max="100"
            value={params.modulation}
            onChange={(e) => updateParam('modulation', parseFloat(e.target.value))}
            className="filter-slider"
          />
          <span className="filter-value">{params.modulation}%</span>
        </div>
      </div>

      <div className="plugin-footer">
        <span>Son1kVers3 • Reverb Chamber v2.0</span>
      </div>
    </div>
  );
};

export default ReverbChamber;
