import React, { useState, useEffect } from 'react';
import './SSLChannelStrip.css';

const SSLChannelStrip = ({ onSettingsChange, initialSettings = {} }) => {
  const [settings, setSettings] = useState({
    // High Pass Filter
    hpfFreq: initialSettings.hpfFreq || 0,
    hpfEnabled: initialSettings.hpfEnabled || false,
    
    // EQ Bands
    eqHighFreq: initialSettings.eqHighFreq || 10000,
    eqHighGain: initialSettings.eqHighGain || 0,
    eqHighQ: initialSettings.eqHighQ || 0.7,
    eqHighEnabled: initialSettings.eqHighEnabled || false,
    
    eqHighMidFreq: initialSettings.eqHighMidFreq || 3000,
    eqHighMidGain: initialSettings.eqHighMidGain || 0,
    eqHighMidQ: initialSettings.eqHighMidQ || 1.0,
    eqHighMidEnabled: initialSettings.eqHighMidEnabled || false,
    
    eqLowMidFreq: initialSettings.eqLowMidFreq || 1000,
    eqLowMidGain: initialSettings.eqLowMidGain || 0,
    eqLowMidQ: initialSettings.eqLowMidQ || 1.0,
    eqLowMidEnabled: initialSettings.eqLowMidEnabled || false,
    
    eqLowFreq: initialSettings.eqLowFreq || 100,
    eqLowGain: initialSettings.eqLowGain || 0,
    eqLowQ: initialSettings.eqLowQ || 0.7,
    eqLowEnabled: initialSettings.eqLowEnabled || false,
    
    // Dynamics
    gateThreshold: initialSettings.gateThreshold || -40,
    gateRatio: initialSettings.gateRatio || 4,
    gateAttack: initialSettings.gateAttack || 10,
    gateRelease: initialSettings.gateRelease || 100,
    gateEnabled: initialSettings.gateEnabled || false,
    
    compressorThreshold: initialSettings.compressorThreshold || -20,
    compressorRatio: initialSettings.compressorRatio || 4,
    compressorAttack: initialSettings.compressorAttack || 10,
    compressorRelease: initialSettings.compressorRelease || 100,
    compressorEnabled: initialSettings.compressorEnabled || false,
    
    // Output
    outputGain: initialSettings.outputGain || 0,
    outputPhase: initialSettings.outputPhase || false,
    outputMute: initialSettings.outputMute || false
  });

  // Frecuencias predefinidas para el EQ
  const eqFrequencies = {
    low: [20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000],
    lowMid: [200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000],
    highMid: [1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 16000, 20000],
    high: [2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 16000, 20000]
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const resetChannel = () => {
    const resetSettings = {
      hpfFreq: 0,
      hpfEnabled: false,
      eqHighFreq: 10000,
      eqHighGain: 0,
      eqHighQ: 0.7,
      eqHighEnabled: false,
      eqHighMidFreq: 3000,
      eqHighMidGain: 0,
      eqHighMidQ: 1.0,
      eqHighMidEnabled: false,
      eqLowMidFreq: 1000,
      eqLowMidGain: 0,
      eqLowMidQ: 1.0,
      eqLowMidEnabled: false,
      eqLowFreq: 100,
      eqLowGain: 0,
      eqLowQ: 0.7,
      eqLowEnabled: false,
      gateThreshold: -40,
      gateRatio: 4,
      gateAttack: 10,
      gateRelease: 100,
      gateEnabled: false,
      compressorThreshold: -20,
      compressorRatio: 4,
      compressorAttack: 10,
      compressorRelease: 100,
      compressorEnabled: false,
      outputGain: 0,
      outputPhase: false,
      outputMute: false
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

  return (
    <div className="ssl-channel-strip">
      <div className="ssl-header">
        <h3>SSL Channel Strip</h3>
        <div className="ssl-controls">
          <button className="ssl-btn reset" onClick={resetChannel}>
            <span className="btn-icon">↻</span>
            <span className="btn-text">Reset</span>
          </button>
        </div>
      </div>

      <div className="ssl-sections">
        {/* High Pass Filter */}
        <div className="ssl-section hpf-section">
          <div className="section-header">
            <h4>HPF</h4>
            <label className="ssl-switch">
              <input
                type="checkbox"
                checked={settings.hpfEnabled}
                onChange={(e) => updateSetting('hpfEnabled', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          <div className="hpf-controls">
            <div className="ssl-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.hpfFreq / 200) * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{formatFrequency(settings.hpfFreq)}</div>
              </div>
              <label>Freq</label>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.hpfFreq}
              onChange={(e) => updateSetting('hpfFreq', parseInt(e.target.value))}
              className="ssl-slider"
            />
          </div>
        </div>

        {/* EQ Section */}
        <div className="ssl-section eq-section">
          <div className="section-header">
            <h4>EQ</h4>
          </div>
          <div className="eq-bands">
            {/* High Band */}
            <div className="eq-band high-band">
              <div className="band-header">
                <span>HIGH</span>
                <label className="ssl-switch small">
                  <input
                    type="checkbox"
                    checked={settings.eqHighEnabled}
                    onChange={(e) => updateSetting('eqHighEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="eq-controls">
                <div className="ssl-knob">
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
                <div className="ssl-knob">
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
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.eqHighQ * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.eqHighQ.toFixed(1)}</div>
                  </div>
                  <label>Q</label>
                </div>
              </div>
            </div>

            {/* High Mid Band */}
            <div className="eq-band high-mid-band">
              <div className="band-header">
                <span>HIGH MID</span>
                <label className="ssl-switch small">
                  <input
                    type="checkbox"
                    checked={settings.eqHighMidEnabled}
                    onChange={(e) => updateSetting('eqHighMidEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="eq-controls">
                <div className="ssl-knob">
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
                <div className="ssl-knob">
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
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.eqHighMidQ * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.eqHighMidQ.toFixed(1)}</div>
                  </div>
                  <label>Q</label>
                </div>
              </div>
            </div>

            {/* Low Mid Band */}
            <div className="eq-band low-mid-band">
              <div className="band-header">
                <span>LOW MID</span>
                <label className="ssl-switch small">
                  <input
                    type="checkbox"
                    checked={settings.eqLowMidEnabled}
                    onChange={(e) => updateSetting('eqLowMidEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="eq-controls">
                <div className="ssl-knob">
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
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.eqLowMidGain + 15) / 30 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatGain(settings.eqLowMidGain)}</div>
                  </div>
                  <label>Gain</label>
                </div>
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.eqLowMidQ * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.eqLowMidQ.toFixed(1)}</div>
                  </div>
                  <label>Q</label>
                </div>
              </div>
            </div>

            {/* Low Band */}
            <div className="eq-band low-band">
              <div className="band-header">
                <span>LOW</span>
                <label className="ssl-switch small">
                  <input
                    type="checkbox"
                    checked={settings.eqLowEnabled}
                    onChange={(e) => updateSetting('eqLowEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="eq-controls">
                <div className="ssl-knob">
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
                <div className="ssl-knob">
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
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${settings.eqLowQ * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.eqLowQ.toFixed(1)}</div>
                  </div>
                  <label>Q</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamics Section */}
        <div className="ssl-section dynamics-section">
          <div className="section-header">
            <h4>DYNAMICS</h4>
          </div>
          <div className="dynamics-controls">
            {/* Gate */}
            <div className="dynamics-band gate">
              <div className="band-header">
                <span>GATE</span>
                <label className="ssl-switch small">
                  <input
                    type="checkbox"
                    checked={settings.gateEnabled}
                    onChange={(e) => updateSetting('gateEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="dynamics-knobs">
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.gateThreshold + 60) / 60 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.gateThreshold}</div>
                  </div>
                  <label>Thresh</label>
                </div>
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.gateRatio / 20) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.gateRatio}:1</div>
                  </div>
                  <label>Ratio</label>
                </div>
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.gateAttack / 50) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.gateAttack}ms</div>
                  </div>
                  <label>Attack</label>
                </div>
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.gateRelease / 1000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.gateRelease}ms</div>
                  </div>
                  <label>Release</label>
                </div>
              </div>
            </div>

            {/* Compressor */}
            <div className="dynamics-band compressor">
              <div className="band-header">
                <span>COMP</span>
                <label className="ssl-switch small">
                  <input
                    type="checkbox"
                    checked={settings.compressorEnabled}
                    onChange={(e) => updateSetting('compressorEnabled', e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              <div className="dynamics-knobs">
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.compressorThreshold + 60) / 60 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.compressorThreshold}</div>
                  </div>
                  <label>Thresh</label>
                </div>
                <div className="ssl-knob">
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
                <div className="ssl-knob">
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
                <div className="ssl-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(settings.compressorRelease / 1000) * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{settings.compressorRelease}ms</div>
                  </div>
                  <label>Release</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="ssl-section output-section">
          <div className="section-header">
            <h4>OUTPUT</h4>
          </div>
          <div className="output-controls">
            <div className="ssl-knob">
              <div className="knob-container">
                <div className="knob-ring">
                  <div 
                    className="knob-pointer" 
                    style={{ transform: `rotate(${(settings.outputGain + 20) / 40 * 270 - 135}deg)` }}
                  ></div>
                </div>
                <div className="knob-value">{formatGain(settings.outputGain)}</div>
              </div>
              <label>Gain</label>
            </div>
            <div className="output-switches">
              <label className="ssl-switch">
                <input
                  type="checkbox"
                  checked={settings.outputPhase}
                  onChange={(e) => updateSetting('outputPhase', e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span className="switch-label">Phase</span>
              </label>
              <label className="ssl-switch">
                <input
                  type="checkbox"
                  checked={settings.outputMute}
                  onChange={(e) => updateSetting('outputMute', e.target.checked)}
                />
                <span className="switch-slider"></span>
                <span className="switch-label">Mute</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSLChannelStrip;

