/**
 * 👁️ ALVAE Equalizer - Plugin de Ecualización
 * Ecualizador omnisciente de 8 bandas con visión total del espectro
 */

import React, { useState } from 'react';
import './ALVAEEqualizer.css';

const ALVAEEqualizer = ({ onSettingsChange, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    enabled: initialSettings.enabled || true,
    
    // 8 bandas de EQ
    band1: { freq: 60, gain: 0, q: 0.7 },    // Sub Bass
    band2: { freq: 120, gain: 0, q: 0.7 },   // Bass
    band3: { freq: 250, gain: 0, q: 1.0 },   // Low Mid
    band4: { freq: 500, gain: 0, q: 1.0 },   // Mid
    band5: { freq: 1000, gain: 0, q: 1.0 },  // High Mid
    band6: { freq: 2000, gain: 0, q: 1.0 },  // Presence
    band7: { freq: 4000, gain: 0, q: 0.7 },  // Brilliance
    band8: { freq: 8000, gain: 0, q: 0.7 },  // Air
    
    // Controles únicos ALVAE
    omniscientMode: false,
    visionIntensity: 50,
    spectralAnalysis: true,
    ...initialSettings
  });

  const updateBand = (bandNum, property, value) => {
    const newSettings = {
      ...settings,
      [`band${bandNum}`]: {
        ...settings[`band${bandNum}`],
        [property]: parseFloat(value)
      }
    };
    setSettings(newSettings);
    if (onSettingsChange) onSettingsChange(newSettings);
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) onSettingsChange(newSettings);
  };

  const bands = [
    { num: 1, name: 'SUB', color: '#ff6b6b' },
    { num: 2, name: 'BASS', color: '#ee5a24' },
    { num: 3, name: 'L-MID', color: '#FFC107' },
    { num: 4, name: 'MID', color: '#10b981' },
    { num: 5, name: 'H-MID', color: '#00FFE7' },
    { num: 6, name: 'PRES', color: '#0984e3' },
    { num: 7, name: 'BRIL', color: '#8b5cf6' },
    { num: 8, name: 'AIR', color: '#e74c3c' }
  ];

  return (
    <div className="alvae-equalizer">
      <div className="plugin-header">
        <div className="plugin-title">
          <span className="plugin-icon">👁️</span>
          <h3>ALVAE EQUALIZER</h3>
        </div>
        <button 
          className={`plugin-power ${settings.enabled ? 'on' : 'off'}`}
          onClick={() => updateSetting('enabled', !settings.enabled)}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="eq-content">
        {/* Análisis espectral visual */}
        <div className="spectral-display">
          <div className="alvae-eye-display">
            <div className="eye-center">
              <div className="iris" style={{
                background: `conic-gradient(from 0deg, ${bands.map(b => b.color).join(', ')})`
              }}>
                <div className="pupil"></div>
              </div>
            </div>
            <div className="frequency-rings">
              {bands.map((band, index) => (
                <div 
                  key={band.num}
                  className="freq-ring"
                  style={{
                    borderColor: band.color,
                    transform: `scale(${1 + index * 0.1})`,
                    opacity: Math.abs(settings[`band${band.num}`].gain) > 0 ? 1 : 0.3
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Controles de bandas */}
        <div className="eq-bands">
          {bands.map((band) => (
            <div key={band.num} className="eq-band" style={{'--band-color': band.color}}>
              <div className="band-header">
                <span className="band-name">{band.name}</span>
                <span className="band-freq">{settings[`band${band.num}`].freq}Hz</span>
              </div>
              
              {/* Gain */}
              <div className="gain-control">
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="0.1"
                  value={settings[`band${band.num}`].gain}
                  onChange={(e) => updateBand(band.num, 'gain', e.target.value)}
                  className="gain-fader vertical"
                  orient="vertical"
                />
                <span className="gain-value">
                  {settings[`band${band.num}`].gain > 0 ? '+' : ''}{settings[`band${band.num}`].gain.toFixed(1)}
                </span>
              </div>
              
              {/* Frequency */}
              <div className="freq-control">
                <input
                  type="range"
                  min="20"
                  max="20000"
                  value={settings[`band${band.num}`].freq}
                  onChange={(e) => updateBand(band.num, 'freq', e.target.value)}
                  className="freq-knob"
                />
              </div>
              
              {/* Q */}
              <div className="q-control">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={settings[`band${band.num}`].q}
                  onChange={(e) => updateBand(band.num, 'q', e.target.value)}
                  className="q-knob"
                />
                <span className="q-value">Q: {settings[`band${band.num}`].q}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controles únicos ALVAE */}
        <div className="alvae-controls">
          <div className="omniscient-mode">
            <label>
              <input
                type="checkbox"
                checked={settings.omniscientMode}
                onChange={(e) => updateSetting('omniscientMode', e.target.checked)}
              />
              <span className="omniscient-label">👁️ MODO OMNISCIENTE</span>
            </label>
            <p className="mode-description">
              El ojo ALVAE analiza automáticamente el espectro y sugiere ajustes
            </p>
          </div>

          <div className="vision-intensity">
            <label>INTENSIDAD DE VISIÓN</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.visionIntensity}
              onChange={(e) => updateSetting('visionIntensity', parseInt(e.target.value))}
              className="vision-slider"
            />
            <span className="control-value">{settings.visionIntensity}%</span>
          </div>
        </div>
      </div>

      {/* Presets ALVAE */}
      <div className="alvae-presets">
        <select 
          className="preset-selector"
          onChange={(e) => loadPreset(e.target.value)}
        >
          <option value="">Presets ALVAE</option>
          <option value="vocal_clarity">Claridad Vocal</option>
          <option value="bass_power">Poder del Bajo</option>
          <option value="guitar_presence">Presencia Guitarra</option>
          <option value="drum_punch">Punch Batería</option>
          <option value="omniscient_master">Maestro Omnisciente</option>
        </select>
      </div>
    </div>
  );

  const loadPreset = (presetName) => {
    const presets = {
      vocal_clarity: {
        band3: { freq: 200, gain: -2, q: 1.5 },
        band4: { freq: 800, gain: 1, q: 1.2 },
        band5: { freq: 2000, gain: 2, q: 0.8 },
        band6: { freq: 5000, gain: 3, q: 1.0 },
        omniscientMode: true,
        visionIntensity: 70
      },
      bass_power: {
        band1: { freq: 60, gain: 3, q: 0.8 },
        band2: { freq: 120, gain: 2, q: 1.0 },
        band3: { freq: 300, gain: -1, q: 1.5 },
        omniscientMode: false,
        visionIntensity: 40
      },
      omniscient_master: {
        band1: { freq: 60, gain: 1, q: 0.7 },
        band2: { freq: 120, gain: 0.5, q: 0.8 },
        band3: { freq: 250, gain: -0.5, q: 1.2 },
        band4: { freq: 500, gain: 0, q: 1.0 },
        band5: { freq: 1000, gain: 0.5, q: 1.0 },
        band6: { freq: 2000, gain: 1, q: 0.9 },
        band7: { freq: 4000, gain: 1.5, q: 0.8 },
        band8: { freq: 8000, gain: 2, q: 0.7 },
        omniscientMode: true,
        visionIntensity: 100
      }
    };

    const preset = presets[presetName];
    if (preset) {
      setSettings(prev => ({ ...prev, ...preset }));
      if (onSettingsChange) onSettingsChange({ ...settings, ...preset });
    }
  };
};

export default ALVAEEqualizer;
