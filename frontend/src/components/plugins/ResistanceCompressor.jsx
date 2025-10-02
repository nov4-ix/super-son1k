/**
 * 🔥 Resistance Compressor - Plugin de Compresión
 * Compresor de la resistencia con carácter vintage
 */

import React, { useState, useEffect } from 'react';
import './ResistanceCompressor.css';

const ResistanceCompressor = ({ onSettingsChange, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    threshold: initialSettings.threshold || -20,
    ratio: initialSettings.ratio || 4,
    attack: initialSettings.attack || 10,
    release: initialSettings.release || 100,
    knee: initialSettings.knee || 2,
    makeupGain: initialSettings.makeupGain || 0,
    mix: initialSettings.mix || 100,
    enabled: initialSettings.enabled || true,
    
    // Características únicas del Resistance Compressor
    vintageMode: initialSettings.vintageMode || false,
    resistanceCharacter: initialSettings.resistanceCharacter || 30,
    glitchAmount: initialSettings.glitchAmount || 0
  });

  const [meteringData, setMeteringData] = useState({
    inputLevel: 0,
    outputLevel: 0,
    gainReduction: 0
  });

  // Actualizar configuración
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Simular metering en tiempo real
  useEffect(() => {
    if (!settings.enabled) return;

    const interval = setInterval(() => {
      setMeteringData({
        inputLevel: Math.random() * 100,
        outputLevel: Math.random() * 80,
        gainReduction: Math.random() * 20
      });
    }, 100);

    return () => clearInterval(interval);
  }, [settings.enabled]);

  return (
    <div className="resistance-compressor">
      <div className="plugin-header">
        <div className="plugin-title">
          <span className="plugin-icon">🔥</span>
          <h3>RESISTANCE COMPRESSOR</h3>
        </div>
        <button 
          className={`plugin-power ${settings.enabled ? 'on' : 'off'}`}
          onClick={() => updateSetting('enabled', !settings.enabled)}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="plugin-content">
        {/* Sección principal */}
        <div className="main-controls">
          <div className="control-group">
            <label>THRESHOLD</label>
            <div className="knob-container">
              <div 
                className="resistance-knob"
                style={{ '--rotation': `${((settings.threshold + 60) / 60) * 270 - 135}deg` }}
              >
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="-60"
                max="0"
                value={settings.threshold}
                onChange={(e) => updateSetting('threshold', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <span className="control-value">{settings.threshold} dB</span>
          </div>

          <div className="control-group">
            <label>RATIO</label>
            <div className="knob-container">
              <div 
                className="resistance-knob"
                style={{ '--rotation': `${((settings.ratio - 1) / 19) * 270 - 135}deg` }}
              >
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={settings.ratio}
                onChange={(e) => updateSetting('ratio', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <span className="control-value">{settings.ratio}:1</span>
          </div>

          <div className="control-group">
            <label>ATTACK</label>
            <div className="knob-container">
              <div 
                className="resistance-knob"
                style={{ '--rotation': `${(settings.attack / 100) * 270 - 135}deg` }}
              >
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={settings.attack}
                onChange={(e) => updateSetting('attack', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <span className="control-value">{settings.attack} ms</span>
          </div>

          <div className="control-group">
            <label>RELEASE</label>
            <div className="knob-container">
              <div 
                className="resistance-knob"
                style={{ '--rotation': `${(settings.release / 1000) * 270 - 135}deg` }}
              >
                <div className="knob-indicator"></div>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                value={settings.release}
                onChange={(e) => updateSetting('release', parseFloat(e.target.value))}
                className="knob-input"
              />
            </div>
            <span className="control-value">{settings.release} ms</span>
          </div>
        </div>

        {/* Controles únicos de Resistance */}
        <div className="resistance-controls">
          <div className="control-group">
            <label>RESISTANCE CHARACTER</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.resistanceCharacter}
              onChange={(e) => updateSetting('resistanceCharacter', parseInt(e.target.value))}
              className="character-slider"
            />
            <span className="control-value">{settings.resistanceCharacter}%</span>
          </div>

          <div className="control-group">
            <label>GLITCH AMOUNT</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.glitchAmount}
              onChange={(e) => updateSetting('glitchAmount', parseInt(e.target.value))}
              className="glitch-slider"
            />
            <span className="control-value">{settings.glitchAmount}%</span>
          </div>

          <div className="vintage-toggle">
            <label>
              <input
                type="checkbox"
                checked={settings.vintageMode}
                onChange={(e) => updateSetting('vintageMode', e.target.checked)}
              />
              VINTAGE MODE
            </label>
          </div>
        </div>

        {/* Metering */}
        <div className="metering-section">
          <div className="meter-group">
            <label>INPUT</label>
            <div className="level-meter">
              <div 
                className="meter-fill input"
                style={{ height: `${meteringData.inputLevel}%` }}
              ></div>
            </div>
            <span className="meter-value">{meteringData.inputLevel.toFixed(1)}</span>
          </div>

          <div className="meter-group">
            <label>GR</label>
            <div className="level-meter gain-reduction">
              <div 
                className="meter-fill gr"
                style={{ height: `${meteringData.gainReduction}%` }}
              ></div>
            </div>
            <span className="meter-value">-{meteringData.gainReduction.toFixed(1)}</span>
          </div>

          <div className="meter-group">
            <label>OUTPUT</label>
            <div className="level-meter">
              <div 
                className="meter-fill output"
                style={{ height: `${meteringData.outputLevel}%` }}
              ></div>
            </div>
            <span className="meter-value">{meteringData.outputLevel.toFixed(1)}</span>
          </div>
        </div>

        {/* Controles finales */}
        <div className="final-controls">
          <div className="control-group">
            <label>MAKEUP GAIN</label>
            <input
              type="range"
              min="-20"
              max="20"
              value={settings.makeupGain}
              onChange={(e) => updateSetting('makeupGain', parseFloat(e.target.value))}
              className="makeup-slider"
            />
            <span className="control-value">{settings.makeupGain} dB</span>
          </div>

          <div className="control-group">
            <label>MIX</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.mix}
              onChange={(e) => updateSetting('mix', parseInt(e.target.value))}
              className="mix-slider"
            />
            <span className="control-value">{settings.mix}%</span>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="plugin-presets">
        <select 
          className="preset-selector"
          onChange={(e) => loadPreset(e.target.value)}
        >
          <option value="">Seleccionar Preset</option>
          <option value="vocal_smooth">Vocal Suave</option>
          <option value="drum_punch">Batería Punch</option>
          <option value="bass_tight">Bajo Apretado</option>
          <option value="guitar_crunch">Guitarra Crunch</option>
          <option value="resistance_special">Resistencia Especial</option>
        </select>
      </div>
    </div>
  );

  const loadPreset = (presetName) => {
    const presets = {
      vocal_smooth: {
        threshold: -15,
        ratio: 3,
        attack: 5,
        release: 50,
        makeupGain: 3,
        resistanceCharacter: 20,
        vintageMode: true
      },
      drum_punch: {
        threshold: -10,
        ratio: 8,
        attack: 1,
        release: 30,
        makeupGain: 5,
        resistanceCharacter: 60,
        vintageMode: false
      },
      bass_tight: {
        threshold: -12,
        ratio: 6,
        attack: 3,
        release: 80,
        makeupGain: 2,
        resistanceCharacter: 40,
        vintageMode: true
      },
      guitar_crunch: {
        threshold: -8,
        ratio: 10,
        attack: 0.5,
        release: 20,
        makeupGain: 8,
        resistanceCharacter: 80,
        glitchAmount: 15,
        vintageMode: false
      },
      resistance_special: {
        threshold: -18,
        ratio: 4,
        attack: 8,
        release: 120,
        makeupGain: 4,
        resistanceCharacter: 100,
        glitchAmount: 25,
        vintageMode: true
      }
    };

    const preset = presets[presetName];
    if (preset) {
      Object.entries(preset).forEach(([key, value]) => {
        updateSetting(key, value);
      });
    }
  };
};

export default ResistanceCompressor;
