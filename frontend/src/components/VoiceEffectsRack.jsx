import React, { useState, useEffect } from 'react';
import './VoiceEffectsRack.css';

const VoiceEffectsRack = ({ onSettingsChange, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    // Reverb - Waves R-Verb
    reverbEnabled: initialSettings.reverbEnabled || false,
    reverbType: initialSettings.reverbType || 'hall',
    reverbSize: initialSettings.reverbSize || 0.5,
    reverbDecay: initialSettings.reverbDecay || 0.5,
    reverbDamping: initialSettings.reverbDamping || 0.5,
    reverbPredelay: initialSettings.reverbPredelay || 0,
    reverbMix: initialSettings.reverbMix || 0.3,
    reverbHighCut: initialSettings.reverbHighCut || 8000,
    reverbLowCut: initialSettings.reverbLowCut || 100,
    
    // Delay - Waves H-Delay
    delayEnabled: initialSettings.delayEnabled || false,
    delayTime: initialSettings.delayTime || 250,
    delayFeedback: initialSettings.delayFeedback || 0.3,
    delayMix: initialSettings.delayMix || 0.2,
    delayHighCut: initialSettings.delayHighCut || 5000,
    delayLowCut: initialSettings.delayLowCut || 200,
    delaySync: initialSettings.delaySync || false,
    delayPingPong: initialSettings.delayPingPong || false,
    
    // Compressor - Waves CLA-2A
    compressorEnabled: initialSettings.compressorEnabled || false,
    compressorAttack: initialSettings.compressorAttack || 10,
    compressorRelease: initialSettings.compressorRelease || 100,
    compressorRatio: initialSettings.compressorRatio || 4,
    compressorThreshold: initialSettings.compressorThreshold || -20,
    compressorMakeup: initialSettings.compressorMakeup || 0,
    compressorKnee: initialSettings.compressorKnee || 0,
    
    // EQ - Waves Q10
    eqEnabled: initialSettings.eqEnabled || false,
    eqHighFreq: initialSettings.eqHighFreq || 10000,
    eqHighGain: initialSettings.eqHighGain || 0,
    eqHighQ: initialSettings.eqHighQ || 0.7,
    eqHighMidFreq: initialSettings.eqHighMidFreq || 3000,
    eqHighMidGain: initialSettings.eqHighMidGain || 0,
    eqHighMidQ: initialSettings.eqHighMidQ || 1.0,
    eqLowMidFreq: initialSettings.eqLowMidFreq || 1000,
    eqLowMidGain: initialSettings.eqLowMidGain || 0,
    eqLowMidQ: initialSettings.eqLowMidQ || 1.0,
    eqLowFreq: initialSettings.eqLowFreq || 100,
    eqLowGain: initialSettings.eqLowGain || 0,
    eqLowQ: initialSettings.eqLowQ || 0.7,
    
    // De-esser - Waves DeEsser
    deesserEnabled: initialSettings.deesserEnabled || false,
    deesserFrequency: initialSettings.deesserFrequency || 6000,
    deesserThreshold: initialSettings.deesserThreshold || -20,
    deesserRatio: initialSettings.deesserRatio || 3,
    deesserRange: initialSettings.deesserRange || 10,
    
    // Exciter - Waves Aphex Vintage Aural Exciter
    exciterEnabled: initialSettings.exciterEnabled || false,
    exciterAmount: initialSettings.exciterAmount || 0.3,
    exciterFrequency: initialSettings.exciterFrequency || 5000,
    exciterMix: initialSettings.exciterMix || 0.2,
    
    // Limiter - Waves L2
    limiterEnabled: initialSettings.limiterEnabled || false,
    limiterThreshold: initialSettings.limiterThreshold || -0.1,
    limiterRelease: initialSettings.limiterRelease || 10,
    limiterCeiling: initialSettings.limiterCeiling || -0.1,
    limiterDither: initialSettings.limiterDither || false
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
      reverbEnabled: false,
      reverbType: 'hall',
      reverbSize: 0.5,
      reverbDecay: 0.5,
      reverbDamping: 0.5,
      reverbPredelay: 0,
      reverbMix: 0.3,
      reverbHighCut: 8000,
      reverbLowCut: 100,
      delayEnabled: false,
      delayTime: 250,
      delayFeedback: 0.3,
      delayMix: 0.2,
      delayHighCut: 5000,
      delayLowCut: 200,
      delaySync: false,
      delayPingPong: false,
      compressorEnabled: false,
      compressorAttack: 10,
      compressorRelease: 100,
      compressorRatio: 4,
      compressorThreshold: -20,
      compressorMakeup: 0,
      compressorKnee: 0,
      eqEnabled: false,
      eqHighFreq: 10000,
      eqHighGain: 0,
      eqHighQ: 0.7,
      eqHighMidFreq: 3000,
      eqHighMidGain: 0,
      eqHighMidQ: 1.0,
      eqLowMidFreq: 1000,
      eqLowMidGain: 0,
      eqLowMidQ: 1.0,
      eqLowFreq: 100,
      eqLowGain: 0,
      eqLowQ: 0.7,
      deesserEnabled: false,
      deesserFrequency: 6000,
      deesserThreshold: -20,
      deesserRatio: 3,
      deesserRange: 10,
      exciterEnabled: false,
      exciterAmount: 0.3,
      exciterFrequency: 5000,
      exciterMix: 0.2,
      limiterEnabled: false,
      limiterThreshold: -0.1,
      limiterRelease: 10,
      limiterCeiling: -0.1,
      limiterDither: false
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
    <div className="voice-effects-rack">
      <div className="rack-header">
        <h3>Waves Voice Effects Rack</h3>
        <div className="rack-controls">
          <button className="rack-btn reset" onClick={resetAll}>
            <span className="btn-icon">↻</span>
            <span className="btn-text">Reset All</span>
          </button>
        </div>
      </div>

      <div className="effects-grid">
        {/* Reverb - R-Verb */}
        <div className="effect-unit reverb">
          <div className="unit-header">
            <h4>R-Verb</h4>
            <label className="waves-switch">
              <input
                type="checkbox"
                checked={settings.reverbEnabled}
                onChange={(e) => updateSetting('reverbEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="unit-controls">
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${settings.reverbDecay * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{Math.round(settings.reverbDecay * 100)}%</div>
                </div>
                <label>Decay</label>
              </div>
              <div className="waves-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${settings.reverbDamping * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{Math.round(settings.reverbDamping * 100)}%</div>
                </div>
                <label>Damping</label>
              </div>
            </div>
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${(settings.reverbPredelay / 100) * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{settings.reverbPredelay}ms</div>
                </div>
                <label>Pre-delay</label>
              </div>
            </div>
            <div className="control-row">
              <select 
                value={settings.reverbType}
                onChange={(e) => updateSetting('reverbType', e.target.value)}
                className="waves-select"
              >
                <option value="hall">Hall</option>
                <option value="room">Room</option>
                <option value="plate">Plate</option>
                <option value="spring">Spring</option>
                <option value="chamber">Chamber</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delay - H-Delay */}
        <div className="effect-unit delay">
          <div className="unit-header">
            <h4>H-Delay</h4>
            <label className="waves-switch">
              <input
                type="checkbox"
                checked={settings.delayEnabled}
                onChange={(e) => updateSetting('delayEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="unit-controls">
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
                <div className="knob-container">
                  <div className="knob-ring">
                    <div 
                      className="knob-pointer" 
                      style={{ transform: `rotate(${settings.delayFeedback * 270 - 135}deg)` }}
                    ></div>
                  </div>
                  <div className="knob-value">{Math.round(settings.delayFeedback * 100)}%</div>
                </div>
                <label>Feedback</label>
              </div>
              <div className="waves-knob">
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
            <div className="control-row">
              <label className="waves-switch">
                <input
                  type="checkbox"
                  checked={settings.delaySync}
                  onChange={(e) => updateSetting('delaySync', e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span className="switch-label">Sync</span>
              </label>
              <label className="waves-switch">
                <input
                  type="checkbox"
                  checked={settings.delayPingPong}
                  onChange={(e) => updateSetting('delayPingPong', e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span className="switch-label">Ping Pong</span>
              </label>
            </div>
          </div>
        </div>

        {/* Compressor - CLA-2A */}
        <div className="effect-unit compressor">
          <div className="unit-header">
            <h4>CLA-2A</h4>
            <label className="waves-switch">
              <input
                type="checkbox"
                checked={settings.compressorEnabled}
                onChange={(e) => updateSetting('compressorEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="unit-controls">
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
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
              <div className="waves-knob">
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
            </div>
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
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

        {/* EQ - Q10 */}
        <div className="effect-unit eq">
          <div className="unit-header">
            <h4>Q10</h4>
            <label className="waves-switch">
              <input
                type="checkbox"
                checked={settings.eqEnabled}
                onChange={(e) => updateSetting('eqEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="unit-controls">
            <div className="eq-bands">
              <div className="eq-band">
                <div className="band-header">HIGH</div>
                <div className="waves-knob">
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
                <div className="waves-knob">
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
              <div className="eq-band">
                <div className="band-header">LOW</div>
                <div className="waves-knob">
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
                <div className="waves-knob">
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

        {/* De-esser */}
        <div className="effect-unit deesser">
          <div className="unit-header">
            <h4>DeEsser</h4>
            <label className="waves-switch">
              <input
                type="checkbox"
                checked={settings.deesserEnabled}
                onChange={(e) => updateSetting('deesserEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="unit-controls">
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
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
            </div>
          </div>
        </div>

        {/* Limiter - L2 */}
        <div className="effect-unit limiter">
          <div className="unit-header">
            <h4>L2</h4>
            <label className="waves-switch">
              <input
                type="checkbox"
                checked={settings.limiterEnabled}
                onChange={(e) => updateSetting('limiterEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="unit-controls">
            <div className="control-row">
              <div className="waves-knob">
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
              <div className="waves-knob">
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
    </div>
  );
};

export default VoiceEffectsRack;

