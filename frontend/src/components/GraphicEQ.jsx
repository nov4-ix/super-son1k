import React, { useState, useEffect, useRef } from 'react';
import './GraphicEQ.css';

const GraphicEQ = ({ onSettingsChange, initialSettings = {} }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBand, setDraggedBand] = useState(null);
  const [settings, setSettings] = useState({
    enabled: initialSettings.enabled || false,
    bands: initialSettings.bands || [
      { freq: 31, gain: 0, q: 0.7, type: 'highshelf', enabled: true },
      { freq: 62, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 125, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 250, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 500, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 1000, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 2000, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 4000, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 8000, gain: 0, q: 0.7, type: 'peaking', enabled: true },
      { freq: 16000, gain: 0, q: 0.7, type: 'peaking', enabled: true }
    ],
    outputGain: initialSettings.outputGain || 0,
    spectrumEnabled: initialSettings.spectrumEnabled || true
  });

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const updateBand = (index, updates) => {
    const newBands = [...settings.bands];
    newBands[index] = { ...newBands[index], ...updates };
    const newSettings = { ...settings, bands: newBands };
    setSettings(newSettings);
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const resetEQ = () => {
    const resetBands = settings.bands.map(band => ({ ...band, gain: 0 }));
    const resetSettings = { ...settings, bands: resetBands, outputGain: 0 };
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

  // Dibujar el EQ gráfico
  const drawEQ = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Fondo
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Líneas horizontales (dB)
    for (let i = -20; i <= 20; i += 5) {
      const y = height / 2 - (i / 40) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Líneas verticales (frecuencias)
    const freqs = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    freqs.forEach(freq => {
      const x = Math.log10(freq / 31) / Math.log10(16000 / 31) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    });

    // Línea central (0 dB)
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Dibujar curva del EQ
    if (settings.enabled) {
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        const freq = 31 * Math.pow(16000 / 31, x / width);
        let totalGain = settings.outputGain;

        // Calcular ganancia de cada banda
        settings.bands.forEach(band => {
          if (band.enabled) {
            const bandFreq = band.freq;
            const bandGain = band.gain;
            const bandQ = band.q;

            if (band.type === 'peaking') {
              const w = Math.log2(freq / bandFreq);
              const gain = bandGain / (1 + Math.pow(w / (bandQ / 3), 2));
              totalGain += gain;
            } else if (band.type === 'highshelf') {
              if (freq >= bandFreq) {
                const w = Math.log2(freq / bandFreq);
                const gain = bandGain * (1 - Math.exp(-w));
                totalGain += gain;
              }
            } else if (band.type === 'lowshelf') {
              if (freq <= bandFreq) {
                const w = Math.log2(bandFreq / freq);
                const gain = bandGain * (1 - Math.exp(-w));
                totalGain += gain;
              }
            }
          }
        });

        const y = height / 2 - (totalGain / 40) * height;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Dibujar puntos de las bandas
    settings.bands.forEach((band, index) => {
      const x = Math.log10(band.freq / 31) / Math.log10(16000 / 31) * width;
      const y = height / 2 - (band.gain / 40) * height;

      // Círculo de la banda
      ctx.fillStyle = band.enabled ? '#ff8c00' : '#666';
      ctx.strokeStyle = band.enabled ? '#ff6b6b' : '#444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Sombra
      ctx.shadowColor = band.enabled ? '#ff8c00' : '#666';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Línea vertical desde el punto hasta la línea central
      if (band.enabled) {
        ctx.strokeStyle = '#ff8c00';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  // Manejar clic en el canvas
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    // Encontrar la banda más cercana
    let closestBand = 0;
    let minDistance = Infinity;

    settings.bands.forEach((band, index) => {
      const bandX = Math.log10(band.freq / 31) / Math.log10(16000 / 31) * width;
      const distance = Math.abs(x - bandX);
      if (distance < minDistance) {
        minDistance = distance;
        closestBand = index;
      }
    });

    // Calcular nueva ganancia
    const newGain = ((height / 2 - y) / height) * 40;
    const clampedGain = Math.max(-20, Math.min(20, newGain));

    updateBand(closestBand, { gain: clampedGain });
  };

  // Manejar arrastre
  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleCanvasClick(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleCanvasClick(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Efectos
  useEffect(() => {
    drawEQ();
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('mouseleave', handleMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="graphic-eq">
      <div className="eq-header">
        <h3>Graphic EQ Pro</h3>
        <div className="eq-controls">
          <label className="eq-switch">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => updateSetting('enabled', e.target.checked)}
            />
            <span className="switch-slider"></span>
            <span className="switch-label">Enable</span>
          </label>
          <button className="eq-btn reset" onClick={resetEQ}>
            <span className="btn-icon">↻</span>
            <span className="btn-text">Reset</span>
          </button>
        </div>
      </div>

      <div className="eq-container">
        {/* Canvas del EQ */}
        <div className="eq-canvas-container">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="eq-canvas"
          />
          <div className="eq-labels">
            <div className="freq-labels">
              {settings.bands.map((band, index) => (
                <div
                  key={index}
                  className="freq-label"
                  style={{
                    left: `${(Math.log10(band.freq / 31) / Math.log10(16000 / 31)) * 100}%`
                  }}
                >
                  {formatFrequency(band.freq)}
                </div>
              ))}
            </div>
            <div className="gain-labels">
              <div className="gain-label" style={{ top: '0%' }}>+20</div>
              <div className="gain-label" style={{ top: '25%' }}>+10</div>
              <div className="gain-label" style={{ top: '50%' }}>0</div>
              <div className="gain-label" style={{ top: '75%' }}>-10</div>
              <div className="gain-label" style={{ top: '100%' }}>-20</div>
            </div>
          </div>
        </div>

        {/* Controles de bandas */}
        <div className="band-controls">
          {settings.bands.map((band, index) => (
            <div key={index} className="band-control">
              <div className="band-header">
                <span className="band-freq">{formatFrequency(band.freq)}</span>
                <label className="band-switch">
                  <input
                    type="checkbox"
                    checked={band.enabled}
                    onChange={(e) => updateBand(index, { enabled: e.target.checked })}
                  />
                  <span className="switch-slider small"></span>
                </label>
              </div>
              <div className="band-knobs">
                <div className="band-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${(band.gain + 20) / 40 * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{formatGain(band.gain)}</div>
                  </div>
                  <label>Gain</label>
                </div>
                <div className="band-knob">
                  <div className="knob-container">
                    <div className="knob-ring">
                      <div 
                        className="knob-pointer" 
                        style={{ transform: `rotate(${band.q * 270 - 135}deg)` }}
                      ></div>
                    </div>
                    <div className="knob-value">{band.q.toFixed(1)}</div>
                  </div>
                  <label>Q</label>
                </div>
              </div>
              <select
                value={band.type}
                onChange={(e) => updateBand(index, { type: e.target.value })}
                className="band-select"
              >
                <option value="peaking">Peaking</option>
                <option value="highshelf">High Shelf</option>
                <option value="lowshelf">Low Shelf</option>
              </select>
            </div>
          ))}
        </div>

        {/* Output Gain */}
        <div className="output-section">
          <div className="output-knob">
            <div className="knob-container large">
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
    </div>
  );
};

export default GraphicEQ;

