import React, { useState, useEffect } from 'react';
import './VocalProcessor.css';

const VocalProcessor = ({ onSettingsChange, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    // Preamp y Gain
    inputGain: initialSettings.inputGain || 0,
    outputGain: initialSettings.outputGain || 0,
    
    // EQ Vocal - 4 bandas específicas para voz
    eqEnabled: initialSettings.eqEnabled || false,
    eqHighFreq: initialSettings.eqHighFreq || 8000,
    eqHighGain: initialSettings.eqHighGain || 0,
    eqHighMidFreq: initialSettings.eqHighMidFreq || 3000,
    eqHighMidGain: initialSettings.eqHighMidGain || 0,
    eqLowMidFreq: initialSettings.eqLowMidFreq || 1000,
    eqLowMidGain: initialSettings.eqLowMidGain || 0,
    eqLowFreq: initialSettings.eqLowFreq || 200,
    eqLowGain: initialSettings.eqLowGain || 0,
    
    // Compresor Vocal - CLA-2A style
    compressorEnabled: initialSettings.compressorEnabled || false,
    compressorAttack: initialSettings.compressorAttack || 10,
    compressorRelease: initialSettings.compressorRelease || 100,
    compressorRatio: initialSettings.compressorRatio || 4,
    compressorThreshold: initialSettings.compressorThreshold || -20,
    compressorMakeup: initialSettings.compressorMakeup || 0,
    
    // De-esser
    deesserEnabled: initialSettings.deesserEnabled || false,
    deesserFrequency: initialSettings.deesserFrequency || 6000,
    deesserThreshold: initialSettings.deesserThreshold || -20,
    deesserRange: initialSettings.deesserRange || 10,
    
    // Reverb Vocal
    reverbEnabled: initialSettings.reverbEnabled || false,
    reverbType: initialSettings.reverbType || 'vocal',
    reverbSize: initialSettings.reverbSize || 0.3,
    reverbDecay: initialSettings.reverbDecay || 0.4,
    reverbMix: initialSettings.reverbMix || 0.2,
    reverbPredelay: initialSettings.reverbPredelay || 20,
    
    // Delay Vocal
    delayEnabled: initialSettings.delayEnabled || false,
    delayTime: initialSettings.delayTime || 250,
    delayFeedback: initialSettings.delayFeedback || 0.3,
    delayMix: initialSettings.delayMix || 0.15,
    delaySync: initialSettings.delaySync || false,
    
    // Exciter Vocal
    exciterEnabled: initialSettings.exciterEnabled || false,
    exciterAmount: initialSettings.exciterAmount || 0.2,
    exciterFrequency: initialSettings.exciterFrequency || 5000,
    
    // Limiter Final
    limiterEnabled: initialSettings.limiterEnabled || false,
    limiterThreshold: initialSettings.limiterThreshold || -0.1,
    limiterRelease: initialSettings.limiterRelease || 10
  });

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const resetAll = () => {
    const resetSettings = {
      inputGain: 0,
      outputGain: 0,
      eqEnabled: false,
      eqHighFreq: 8000,
      eqHighGain: 0,
      eqHighMidFreq: 3000,
      eqHighMidGain: 0,
      eqLowMidFreq: 1000,
      eqLowMidGain: 0,
      eqLowFreq: 200,
      eqLowGain: 0,
      compressorEnabled: false,
      compressorAttack: 10,
      compressorRelease: 100,
      compressorRatio: 4,
      compressorThreshold: -20,
      compressorMakeup: 0,
      deesserEnabled: false,
      deesserFrequency: 6000,
      deesserThreshold: -20,
      deesserRange: 10,
      reverbEnabled: false,
      reverbType: 'vocal',
      reverbSize: 0.3,
      reverbDecay: 0.4,
      reverbMix: 0.2,
      reverbPredelay: 20,
      delayEnabled: false,
      delayTime: 250,
      delayFeedback: 0.3,
      delayMix: 0.15,
      delaySync: false,
      exciterEnabled: false,
      exciterAmount: 0.2,
      exciterFrequency: 5000,
      limiterEnabled: false,
      limiterThreshold: -0.1,
      limiterRelease: 10
    };
    setSettings(resetSettings);
    if (onSettingsChange) {
      onSettingsChange(resetSettings);
    }
  };

  const formatFrequency = (freq) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(1)}k`;
    }
    return freq.toString();
  };

  const formatGain = (gain) => {
    return gain > 0 ? `+${gain.toFixed(1)}` : gain.toFixed(1);
  };

  const formatTime = (time) => {
    if (time >= 1000) {
      return `${(time / 1000).toFixed(1)}s`;
    }
    return `${time}ms`;
  };

  return (
    <div className="vocal-processor">
      <div className="processor-header">
        <h3>Vocal Processor Pro</h3>
        <div className="processor-controls">
          <button className="proc-btn reset" onClick={resetAll}>
            <span className="btn-icon">↻</span>
            <span className="btn-text">Reset</span>
          </button>
        </div>
      </div>

      <div className="processor-sections">
        {/* Input/Output Section */}
        <div className="proc-section io-section">
          <div className="section-header">
            <h4>I/O</h4>
          </div>
          <div className="io-controls">
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.inputGain + 20) / 40 * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{formatGain(settings.inputGain)}</div>
              </div>
              <label>Input</label>
            </div>
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.outputGain + 20) / 40 * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{formatGain(settings.outputGain)}</div>
              </div>
              <label>Output</label>
            </div>
          </div>
        </div>

        {/* EQ Section */}
        <div className="proc-section eq-section">
          <div className="section-header">
            <h4>Vocal EQ</h4>
            <label className="proc-switch">
              <input
                type="checkbox"
                checked={settings.eqEnabled}
                onChange={(e) => updateSetting('eqEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="eq-bands">
            <div className="eq-band high">
              <div className="band-header">HIGH</div>
              <div className="eq-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqHighFreq / 20000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatFrequency(settings.eqHighFreq)}</div>
                  </div>
                  <label>Freq</label>
                </div>
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqHighGain + 15) / 30 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatGain(settings.eqHighGain)}</div>
                  </div>
                  <label>Gain</label>
                </div>
              </div>
            </div>
            <div className="eq-band high-mid">
              <div className="band-header">HIGH MID</div>
              <div className="eq-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqHighMidFreq / 20000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatFrequency(settings.eqHighMidFreq)}</div>
                  </div>
                  <label>Freq</label>
                </div>
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqHighMidGain + 15) / 30 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatGain(settings.eqHighMidGain)}</div>
                  </div>
                  <label>Gain</label>
                </div>
              </div>
            </div>
            <div className="eq-band low-mid">
              <div className="band-header">LOW MID</div>
              <div className="eq-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqLowMidFreq / 20000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatFrequency(settings.eqLowMidFreq)}</div>
                  </div>
                  <label>Freq</label>
                </div>
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.eqLowMidGain + 15) / 30 * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{formatGain(settings.eqLowMidGain)}</div>
                </div>
                <label>Gain</label>
              </div>
            </div>
            <div className="eq-band low">
              <div className="band-header">LOW</div>
              <div className="eq-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqLowFreq / 20000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatFrequency(settings.eqLowFreq)}</div>
                  </div>
                  <label>Freq</label>
                </div>
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqLowGain + 15) / 30 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatGain(settings.eqLowGain)}</div>
                  </div>
                  <label>Gain</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compressor Section */}
        <div className="proc-section compressor-section">
          <div className="section-header">
            <h4>Vocal Comp</h4>
            <label className="proc-switch">
              <input
                type="checkbox"
                checked={settings.compressorEnabled}
                onChange={(e) => updateSetting('compressorEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="compressor-controls">
            <div className="comp-row">
              <div className="proc-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.compressorAttack / 50) * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{settings.compressorAttack}ms</div>
                </div>
                <label>Attack</label>
              </div>
              <div className="proc-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.compressorRelease / 1000) * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{formatTime(settings.compressorRelease)}</div>
                </div>
                <label>Release</label>
              </div>
            </div>
            <div className="comp-row">
              <div className="proc-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.compressorRatio / 20) * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{settings.compressorRatio}:1</div>
                </div>
                <label>Ratio</label>
              </div>
              <div className="proc-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.compressorThreshold + 60) / 60 * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{settings.compressorThreshold}dB</div>
                </div>
                <label>Threshold</label>
              </div>
            </div>
            <div className="comp-row">
              <div className="proc-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.compressorMakeup + 20) / 40 * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{formatGain(settings.compressorMakeup)}</div>
                </div>
                <label>Makeup</label>
              </div>
            </div>
          </div>
        </div>

        {/* De-esser Section */}
        <div className="proc-section deesser-section">
          <div className="section-header">
            <h4>De-Esser</h4>
            <label className="proc-switch">
              <input
                type="checkbox"
                checked={settings.deesserEnabled}
                onChange={(e) => updateSetting('deesserEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="deesser-controls">
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.deesserFrequency / 20000) * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{formatFrequency(settings.deesserFrequency)}</div>
              </div>
              <label>Freq</label>
            </div>
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.deesserThreshold + 60) / 60 * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{settings.deesserThreshold}dB</div>
              </div>
              <label>Threshold</label>
            </div>
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.deesserRange / 20) * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{settings.deesserRange}dB</div>
              </div>
              <label>Range</label>
            </div>
          </div>
        </div>

        {/* Effects Section */}
        <div className="proc-section effects-section">
          <div className="section-header">
            <h4>Effects</h4>
          </div>
          <div className="effects-grid">
            {/* Reverb */}
            <div className="effect-unit reverb">
              <div className="unit-header">
                <span>Reverb</span>
                <label className="proc-switch small">
                  <input
                    type="checkbox"
                    checked={settings.reverbEnabled}
                    onChange={(e) => updateSetting('reverbEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="effect-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.reverbSize * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{Math.round(settings.reverbSize * 100)}%</div>
                  </div>
                  <label>Size</label>
                </div>
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.reverbMix * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{Math.round(settings.reverbMix * 100)}%</div>
                  </div>
                  <label>Mix</label>
                </div>
              </div>
            </div>

            {/* Delay */}
            <div className="effect-unit delay">
              <div className="unit-header">
                <span>Delay</span>
                <label className="proc-switch small">
                  <input
                    type="checkbox"
                    checked={settings.delayEnabled}
                    onChange={(e) => updateSetting('delayEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="effect-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.delayTime / 1000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatTime(settings.delayTime)}</div>
                  </div>
                  <label>Time</label>
                </div>
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.delayMix * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{Math.round(settings.delayMix * 100)}%</div>
                  </div>
                  <label>Mix</label>
                </div>
              </div>
            </div>

            {/* Exciter */}
            <div className="effect-unit exciter">
              <div className="unit-header">
                <span>Exciter</span>
                <label className="proc-switch small">
                  <input
                    type="checkbox"
                    checked={settings.exciterEnabled}
                    onChange={(e) => updateSetting('exciterEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="effect-controls">
                <div className="proc-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.exciterAmount * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{Math.round(settings.exciterAmount * 100)}%</div>
                  </div>
                  <label>Amount</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Limiter Section */}
        <div className="proc-section limiter-section">
          <div className="section-header">
            <h4>Limiter</h4>
            <label className="proc-switch">
              <input
                type="checkbox"
                checked={settings.limiterEnabled}
                onChange={(e) => updateSetting('limiterEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="limiter-controls">
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.limiterThreshold + 1) / 1 * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{settings.limiterThreshold}dB</div>
              </div>
              <label>Threshold</label>
            </div>
            <div className="proc-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.limiterRelease / 100) * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{settings.limiterRelease}ms</div>
              </div>
              <label>Release</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocalProcessor;

