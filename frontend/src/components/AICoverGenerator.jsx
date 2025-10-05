import React, { useState } from 'react';
import './AICoverGenerator.css';

const AICoverGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('abstract');
  const [colors, setColors] = useState('vibrant');
  const [mood, setMood] = useState('energetic');
  const [generatedCovers, setGeneratedCovers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCover, setSelectedCover] = useState(null);

  const styles = ['abstract', 'realistic', 'minimalist', 'retro', 'futuristic', 'artistic', 'geometric', 'organic'];
  const colorSchemes = ['vibrant', 'pastel', 'dark', 'neon', 'monochrome', 'gradient', 'warm', 'cool'];
  const moods = ['energetic', 'calm', 'mysterious', 'happy', 'melancholic', 'aggressive', 'dreamy', 'epic'];

  const generateCover = async () => {
    setIsGenerating(true);
    
    // Simular generación con IA
    setTimeout(() => {
      const newCovers = Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i,
        url: `https://picsum.photos/400/400?random=${Date.now() + i}`,
        prompt: prompt || 'Album cover art',
        style,
        colors,
        mood
      }));
      
      setGeneratedCovers([...newCovers, ...generatedCovers]);
      setIsGenerating(false);
    }, 3000);
  };

  const downloadCover = (cover) => {
    const link = document.createElement('a');
    link.href = cover.url;
    link.download = `cover_${cover.id}.jpg`;
    link.click();
  };

  return (
    <div className="ai-cover-generator">
      <div className="generator-header">
        <h1>🎨 Generador de Covers con IA</h1>
        <p>Crea portadas de álbum únicas con inteligencia artificial</p>
      </div>

      <div className="generator-layout">
        <div className="generator-controls">
          <div className="control-panel">
            <h3>⚙️ Configuración</h3>
            
            <div className="input-group">
              <label>Descripción del Cover</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Un astronauta flotando en el espacio con colores neón..."
                rows="4"
              />
            </div>

            <div className="input-group">
              <label>Estilo Artístico</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                {styles.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Esquema de Colores</label>
              <select value={colors} onChange={(e) => setColors(e.target.value)}>
                {colorSchemes.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Mood</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                {moods.map(m => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
            </div>

            <button 
              className="generate-btn"
              onClick={generateCover}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generando...' : '✨ Generar Covers'}
            </button>
          </div>

          {selectedCover && (
            <div className="selected-cover-panel">
              <h3>🖼️ Cover Seleccionado</h3>
              <img src={selectedCover.url} alt="Selected cover" />
              <div className="cover-actions">
                <button onClick={() => downloadCover(selectedCover)}>
                  📥 Descargar
                </button>
                <button>🎨 Editar</button>
                <button>💾 Guardar</button>
              </div>
            </div>
          )}
        </div>

        <div className="generator-results">
          {isGenerating && (
            <div className="generating-overlay">
              <div className="spinner-large"></div>
              <p>Generando covers con IA...</p>
              <span>Esto puede tomar unos segundos</span>
            </div>
          )}

          <div className="covers-grid">
            {generatedCovers.map(cover => (
              <div 
                key={cover.id} 
                className={`cover-card ${selectedCover?.id === cover.id ? 'selected' : ''}`}
                onClick={() => setSelectedCover(cover)}
              >
                <img src={cover.url} alt="Generated cover" />
                <div className="cover-overlay">
                  <button onClick={(e) => { e.stopPropagation(); downloadCover(cover); }}>
                    📥 Descargar
                  </button>
                </div>
                <div className="cover-info">
                  <span className="cover-style">{cover.style}</span>
                  <span className="cover-colors">{cover.colors}</span>
                </div>
              </div>
            ))}
          </div>

          {generatedCovers.length === 0 && !isGenerating && (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h3>No hay covers generados</h3>
              <p>Configura los parámetros y genera tu primer cover</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICoverGenerator;
