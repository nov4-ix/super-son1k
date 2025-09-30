import React, { useState, useEffect, useRef } from 'react';
import './AlbumArtGenerator.css';

const AlbumArtGenerator = ({ onArtGenerated, initialSettings = {} }) => {
  const canvasRef = useRef(null);
  const [settings, setSettings] = useState({
    // Configuración básica
    title: initialSettings.title || 'Song Title',
    artist: initialSettings.artist || 'Artist Name',
    album: initialSettings.album || 'Album Name',
    
    // Estilo visual
    style: initialSettings.style || 'cyberpunk',
    colorScheme: initialSettings.colorScheme || 'neon',
    backgroundType: initialSettings.backgroundType || 'gradient',
    
    // Efectos visuales
    effects: initialSettings.effects || {
      particles: true,
      glow: true,
      distortion: false,
      noise: false,
      vignette: true
    },
    
    // Configuración de texto
    titleFont: initialSettings.titleFont || 'bold',
    titleSize: initialSettings.titleSize || 48,
    artistSize: initialSettings.artistSize || 24,
    albumSize: initialSettings.albumSize || 18,
    
    // Configuración de colores
    primaryColor: initialSettings.primaryColor || '#00ffff',
    secondaryColor: initialSettings.secondaryColor || '#ff6b6b',
    backgroundColor: initialSettings.backgroundColor || '#1a1a1a',
    
    // Resolución
    resolution: initialSettings.resolution || 'high', // low, medium, high, ultra
    format: initialSettings.format || 'square' // square, wide, tall
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Plantillas de estilos
  const styleTemplates = {
    cyberpunk: {
      name: 'Cyberpunk',
      colors: ['#00ffff', '#ff6b6b', '#4ecdc4', '#45b7d1'],
      effects: ['particles', 'glow', 'grid'],
      fonts: ['monospace', 'sans-serif']
    },
    vintage: {
      name: 'Vintage',
      colors: ['#ff8c00', '#ff6b6b', '#feca57', '#ff9ff3'],
      effects: ['noise', 'vignette', 'texture'],
      fonts: ['serif', 'cursive']
    },
    minimal: {
      name: 'Minimal',
      colors: ['#ffffff', '#000000', '#888888', '#cccccc'],
      effects: ['clean', 'subtle'],
      fonts: ['sans-serif']
    },
    neon: {
      name: 'Neon',
      colors: ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'],
      effects: ['glow', 'particles', 'scanlines'],
      fonts: ['monospace']
    },
    dark: {
      name: 'Dark',
      colors: ['#333333', '#666666', '#999999', '#cccccc'],
      effects: ['vignette', 'noise', 'grain'],
      fonts: ['sans-serif', 'monospace']
    }
  };

  // Esquemas de color
  const colorSchemes = {
    neon: ['#00ffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#9b59b6'],
    warm: ['#ff8c00', '#ff6b6b', '#feca57', '#ff9ff3', '#e74c3c'],
    cool: ['#4ecdc4', '#45b7d1', '#96ceb4', '#54a0ff', '#5f27cd'],
    monochrome: ['#ffffff', '#cccccc', '#888888', '#444444', '#000000'],
    rainbow: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff']
  };

  // Actualizar configuración
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };

  // Generar portada
  const generateArt = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const template = styleTemplates[settings.style];
      
      // Configurar resolución
      const resolutions = {
        low: { width: 300, height: 300 },
        medium: { width: 600, height: 600 },
        high: { width: 1200, height: 1200 },
        ultra: { width: 2400, height: 2400 }
      };
      
      const res = resolutions[settings.resolution];
      canvas.width = res.width;
      canvas.height = res.height;
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generar fondo
      await generateBackground(ctx, canvas.width, canvas.height);
      
      // Aplicar efectos
      if (settings.effects.particles) {
        await generateParticles(ctx, canvas.width, canvas.height);
      }
      
      if (settings.effects.glow) {
        await applyGlowEffect(ctx, canvas.width, canvas.height);
      }
      
      if (settings.effects.noise) {
        await applyNoiseEffect(ctx, canvas.width, canvas.height);
      }
      
      if (settings.effects.vignette) {
        await applyVignetteEffect(ctx, canvas.width, canvas.height);
      }
      
      // Generar texto
      await generateText(ctx, canvas.width, canvas.height);
      
      // Aplicar efectos finales
      await applyFinalEffects(ctx, canvas.width, canvas.height);
      
      // Generar preview
      const dataUrl = canvas.toDataURL('image/png', 0.9);
      setPreviewUrl(dataUrl);
      
      if (onArtGenerated) {
        onArtGenerated({
          dataUrl,
          settings,
          canvas: canvas
        });
      }
      
    } catch (error) {
      console.error('Error generando portada:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generar fondo
  const generateBackground = async (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const colors = colorSchemes[settings.colorScheme] || colorSchemes.neon;
    
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Añadir patrón si es necesario
    if (settings.backgroundType === 'pattern') {
      await generatePattern(ctx, width, height);
    }
  };

  // Generar patrón de fondo
  const generatePattern = async (ctx, width, height) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    // Patrón de líneas
    ctx.strokeStyle = settings.primaryColor;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  // Generar partículas
  const generateParticles = async (ctx, width, height) => {
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    const particleCount = Math.floor(width * height / 10000);
    const colors = colorSchemes[settings.colorScheme] || colorSchemes.neon;
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  // Aplicar efecto de brillo
  const applyGlowEffect = async (ctx, width, height) => {
    ctx.save();
    ctx.shadowColor = settings.primaryColor;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Dibujar elementos con brillo
    ctx.fillStyle = settings.primaryColor;
    ctx.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    
    ctx.restore();
  };

  // Aplicar efecto de ruido
  const applyNoiseEffect = async (ctx, width, height) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
    }
    
    ctx.putImageData(imageData, 0, 0);
    ctx.restore();
  };

  // Aplicar efecto de viñeta
  const applyVignetteEffect = async (ctx, width, height) => {
    ctx.save();
    
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.7, 'transparent');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.restore();
  };

  // Generar texto
  const generateText = async (ctx, width, height) => {
    ctx.save();
    
    // Configurar fuente
    const titleFont = `${settings.titleSize}px ${settings.titleFont}`;
    const artistFont = `${settings.artistSize}px ${settings.titleFont}`;
    const albumFont = `${settings.albumSize}px ${settings.titleFont}`;
    
    // Título principal
    ctx.font = titleFont;
    ctx.fillStyle = settings.primaryColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Añadir sombra al texto
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(settings.title, width / 2, height * 0.4);
    
    // Artista
    ctx.font = artistFont;
    ctx.fillStyle = settings.secondaryColor;
    ctx.fillText(settings.artist, width / 2, height * 0.6);
    
    // Álbum
    ctx.font = albumFont;
    ctx.fillStyle = settings.primaryColor;
    ctx.fillText(settings.album, width / 2, height * 0.75);
    
    ctx.restore();
  };

  // Aplicar efectos finales
  const applyFinalEffects = async (ctx, width, height) => {
    // Efecto de escaneo si está habilitado
    if (settings.effects.scanlines) {
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = settings.primaryColor;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < height; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  };

  // Descargar imagen
  const downloadImage = () => {
    if (!previewUrl) return;
    
    const link = document.createElement('a');
    link.download = `${settings.title.replace(/\s+/g, '_')}_album_art.png`;
    link.href = previewUrl;
    link.click();
  };

  // Efectos de la interfaz
  useEffect(() => {
    generateArt();
  }, [settings]);

  return (
    <div className="album-art-generator">
      <div className="generator-header">
        <h3>Album Art Generator</h3>
        <div className="generator-controls">
          <button 
            className="gen-btn generate" 
            onClick={generateArt}
            disabled={isGenerating}
          >
            <span className="btn-icon">🎨</span>
            <span className="btn-text">
              {isGenerating ? 'Generating...' : 'Generate'}
            </span>
          </button>
          <button 
            className="gen-btn download" 
            onClick={downloadImage}
            disabled={!previewUrl}
          >
            <span className="btn-icon">💾</span>
            <span className="btn-text">Download</span>
          </button>
        </div>
      </div>

      <div className="generator-content">
        {/* Preview */}
        <div className="art-preview">
          <canvas
            ref={canvasRef}
            className="art-canvas"
            width={600}
            height={600}
          />
          {isGenerating && (
            <div className="generating-overlay">
              <div className="loading-spinner"></div>
              <span>Generating artwork...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="art-controls">
          {/* Text Inputs */}
          <div className="control-section">
            <h4>Text Content</h4>
            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => updateSetting('title', e.target.value)}
                className="art-input"
              />
            </div>
            <div className="input-group">
              <label>Artist</label>
              <input
                type="text"
                value={settings.artist}
                onChange={(e) => updateSetting('artist', e.target.value)}
                className="art-input"
              />
            </div>
            <div className="input-group">
              <label>Album</label>
              <input
                type="text"
                value={settings.album}
                onChange={(e) => updateSetting('album', e.target.value)}
                className="art-input"
              />
            </div>
          </div>

          {/* Style Selection */}
          <div className="control-section">
            <h4>Style</h4>
            <div className="style-grid">
              {Object.entries(styleTemplates).map(([key, template]) => (
                <button
                  key={key}
                  className={`style-btn ${settings.style === key ? 'active' : ''}`}
                  onClick={() => updateSetting('style', key)}
                >
                  <div className="style-preview" style={{
                    background: `linear-gradient(45deg, ${template.colors[0]}, ${template.colors[1]})`
                  }}></div>
                  <span className="style-name">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="control-section">
            <h4>Color Scheme</h4>
            <div className="color-grid">
              {Object.entries(colorSchemes).map(([key, colors]) => (
                <button
                  key={key}
                  className={`color-btn ${settings.colorScheme === key ? 'active' : ''}`}
                  onClick={() => updateSetting('colorScheme', key)}
                >
                  <div className="color-preview">
                    {colors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="color-swatch"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <span className="color-name">{key}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div className="control-section">
            <h4>Effects</h4>
            <div className="effects-grid">
              {Object.entries(settings.effects).map(([key, value]) => (
                <label key={key} className="effect-toggle">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('effects', {
                      ...settings.effects,
                      [key]: e.target.checked
                    })}
                  />
                  <span className="toggle-slider"></span>
                  <span className="effect-name">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div className="control-section">
            <h4>Resolution</h4>
            <div className="resolution-options">
              {['low', 'medium', 'high', 'ultra'].map(res => (
                <button
                  key={res}
                  className={`res-btn ${settings.resolution === res ? 'active' : ''}`}
                  onClick={() => updateSetting('resolution', res)}
                >
                  {res.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumArtGenerator;

