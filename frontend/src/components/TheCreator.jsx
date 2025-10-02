/**
 * 🎵 The Creator - Herramienta Principal de Generación Musical
 * Interfaz intuitiva y poderosa para crear música desde cero
 * Integra generación de letras con Qwen y recursos literarios
 */

import React, { useState, useEffect, useRef } from 'react';
import './TheCreator.css';

const TheCreator = ({ onClose }) => {
  const [currentTab, setCurrentTab] = useState('create'); // create, lyrics, generate
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  
  // Configuración de creación
  const [musicConfig, setMusicConfig] = useState({
    title: '',
    style: '',
    lyrics: '',
    customPrompt: '',
    useCustomPrompt: false
  });
  
  // Configuración de letras
  const [lyricsConfig, setLyricsConfig] = useState({
    theme: '',
    mood: 'neutral',
    language: 'spanish',
    length: 'medium', // short, medium, long
    expressiveness: 75, // Perilla de expresividad literaria
    generateMode: 'theme' // theme, improve, random
  });
  
  // Recursos literarios controlados por expresividad
  const literaryResources = {
    metaphor: 'metáfora',
    personification: 'personificación', 
    objectification: 'cosificación',
    hyperbole: 'hipérbole',
    poetry: 'poesía',
    narrative: 'narrativa coherente'
  };

  // Estilos musicales sugeridos
  const musicalStyles = [
    'Indie Rock', 'Electronic Pop', 'Hip-Hop', 'Reggaeton', 'Trap',
    'Folk Acoustic', 'Jazz Fusion', 'Synthwave', 'Lo-Fi Hip-Hop',
    'Alternative Rock', 'Dream Pop', 'Bedroom Pop', 'Ambient',
    'Latin Pop', 'Bossa Nova', 'Funk', 'Soul', 'R&B'
  ];

  // Generar letras con Qwen
  const generateLyrics = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/the-creator/generate-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: lyricsConfig.theme,
          mood: lyricsConfig.mood,
          language: lyricsConfig.language,
          length: lyricsConfig.length,
          expressiveness: lyricsConfig.expressiveness,
          literary_resources: getLiteraryResourcesLevel()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMusicConfig(prev => ({
          ...prev,
          lyrics: data.lyrics
        }));
      }
      
    } catch (error) {
      console.error('Error generando letras:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Mejorar letras existentes
  const improveLyrics = async () => {
    if (!musicConfig.lyrics) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/the-creator/improve-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_lyrics: musicConfig.lyrics,
          improvements: [
            'align_metrics',
            'reduce_repetition', 
            'improve_cadence',
            'enhance_rhyme_scheme',
            'strengthen_narrative'
          ],
          expressiveness: lyricsConfig.expressiveness
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMusicConfig(prev => ({
          ...prev,
          lyrics: data.improved_lyrics
        }));
      }
      
    } catch (error) {
      console.error('Error mejorando letras:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generar prompt basado en estilo
  const generatePromptFromStyle = async () => {
    if (!musicConfig.style) return;
    
    try {
      const response = await fetch('/api/the-creator/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: musicConfig.style,
          title: musicConfig.title,
          has_lyrics: !!musicConfig.lyrics,
          mode: 'style-based'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMusicConfig(prev => ({
          ...prev,
          customPrompt: data.prompt,
          useCustomPrompt: true
        }));
      }
      
    } catch (error) {
      console.error('Error generando prompt:', error);
    }
  };

  // Generar prompt aleatorio creativo
  const generateRandomPrompt = async () => {
    try {
      const response = await fetch('/api/the-creator/random-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          style: musicConfig.style || 'any',
          creativity_level: 'high'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMusicConfig(prev => ({
          ...prev,
          customPrompt: data.prompt,
          useCustomPrompt: true
        }));
      }
      
    } catch (error) {
      console.error('Error generando prompt aleatorio:', error);
    }
  };

  // Generar música completa
  const generateMusic = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/the-creator/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: musicConfig,
          lyrics_config: lyricsConfig,
          translate_to_english: true
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedTrack(data.track);
      }
      
    } catch (error) {
      console.error('Error generando música:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Obtener nivel de recursos literarios basado en expresividad
  const getLiteraryResourcesLevel = () => {
    const level = lyricsConfig.expressiveness;
    
    return {
      metaphor: level > 60 ? 'high' : level > 30 ? 'medium' : 'low',
      personification: level > 70 ? 'high' : level > 40 ? 'medium' : 'low',
      objectification: level > 50 ? 'medium' : 'low',
      hyperbole: level > 80 ? 'high' : level > 50 ? 'medium' : 'low',
      poetry: level > 65 ? 'high' : level > 35 ? 'medium' : 'low',
      narrative: level > 40 ? 'coherent' : 'simple'
    };
  };

  // Renderizar pestaña actual
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'create':
        return renderCreateTab();
      case 'lyrics':
        return renderLyricsTab();
      case 'generate':
        return renderGenerateTab();
      default:
        return renderCreateTab();
    }
  };

  // Pestaña de creación principal
  const renderCreateTab = () => (
    <div className="tab-content">
      <div className="creation-form">
        <div className="form-section">
          <label>🎵 Título de la Canción</label>
          <input
            type="text"
            placeholder="Nombre de tu creación..."
            value={musicConfig.title}
            onChange={(e) => setMusicConfig(prev => ({
              ...prev,
              title: e.target.value
            }))}
            className="title-input"
          />
        </div>

        <div className="form-section">
          <label>🎸 Estilo Musical</label>
          <div className="style-input-container">
            <input
              type="text"
              placeholder="Describe el estilo, instrumentos, género..."
              value={musicConfig.style}
              onChange={(e) => setMusicConfig(prev => ({
                ...prev,
                style: e.target.value
              }))}
              className="style-input"
            />
            <div className="style-suggestions">
              {musicalStyles.map(style => (
                <button
                  key={style}
                  className="style-tag"
                  onClick={() => setMusicConfig(prev => ({
                    ...prev,
                    style: prev.style ? `${prev.style}, ${style}` : style
                  }))}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="lyrics-header">
            <label>📝 Letras</label>
            <div className="lyrics-buttons">
              <button 
                className="generate-lyrics-btn"
                onClick={() => setCurrentTab('lyrics')}
              >
                🧠 Generar Letras
              </button>
              <button 
                className="improve-lyrics-btn"
                onClick={improveLyrics}
                disabled={!musicConfig.lyrics}
              >
                ✨ Mejorar Letras
              </button>
            </div>
          </div>
          
          <textarea
            placeholder="Escribe las letras de tu canción o usa el generador..."
            value={musicConfig.lyrics}
            onChange={(e) => setMusicConfig(prev => ({
              ...prev,
              lyrics: e.target.value
            }))}
            className="lyrics-textarea"
            rows="8"
          />
        </div>

        <div className="form-section">
          <div className="prompt-section">
            <div className="prompt-header">
              <label>
                <input
                  type="checkbox"
                  checked={musicConfig.useCustomPrompt}
                  onChange={(e) => setMusicConfig(prev => ({
                    ...prev,
                    useCustomPrompt: e.target.checked
                  }))}
                />
                🎯 Usar Prompt Personalizado
              </label>
              <div className="prompt-buttons">
                <button 
                  className="generate-prompt-btn"
                  onClick={generatePromptFromStyle}
                  disabled={!musicConfig.style}
                >
                  📝 Generar Prompt
                </button>
                <button 
                  className="random-prompt-btn"
                  onClick={generateRandomPrompt}
                >
                  🎲 Prompt Aleatorio
                </button>
              </div>
            </div>
            
            {musicConfig.useCustomPrompt && (
              <textarea
                placeholder="Prompt personalizado para la generación..."
                value={musicConfig.customPrompt}
                onChange={(e) => setMusicConfig(prev => ({
                  ...prev,
                  customPrompt: e.target.value
                }))}
                className="prompt-textarea"
                rows="4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Pestaña de generación de letras
  const renderLyricsTab = () => (
    <div className="tab-content">
      <h2>📝 Generador de Letras con IA</h2>
      <p>Crea letras con recursos literarios avanzados usando Qwen</p>
      
      <div className="lyrics-generator">
        <div className="generator-form">
          <div className="form-row">
            <div className="form-group">
              <label>🎭 Tema/Historia</label>
              <input
                type="text"
                placeholder="Sobre qué quieres que trate la canción..."
                value={lyricsConfig.theme}
                onChange={(e) => setLyricsConfig(prev => ({
                  ...prev,
                  theme: e.target.value
                }))}
              />
            </div>
            
            <div className="form-group">
              <label>😊 Estado de Ánimo</label>
              <select
                value={lyricsConfig.mood}
                onChange={(e) => setLyricsConfig(prev => ({
                  ...prev,
                  mood: e.target.value
                }))}
              >
                <option value="happy">Feliz</option>
                <option value="sad">Triste</option>
                <option value="energetic">Enérgico</option>
                <option value="romantic">Romántico</option>
                <option value="melancholic">Melancólico</option>
                <option value="rebellious">Rebelde</option>
                <option value="nostalgic">Nostálgico</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>🌍 Idioma</label>
              <select
                value={lyricsConfig.language}
                onChange={(e) => setLyricsConfig(prev => ({
                  ...prev,
                  language: e.target.value
                }))}
              >
                <option value="spanish">Español</option>
                <option value="english">English</option>
                <option value="bilingual">Bilingüe</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>📏 Longitud</label>
              <select
                value={lyricsConfig.length}
                onChange={(e) => setLyricsConfig(prev => ({
                  ...prev,
                  length: e.target.value
                }))}
              >
                <option value="short">Corta (1-2 versos)</option>
                <option value="medium">Media (2-3 versos + coro)</option>
                <option value="long">Larga (3+ versos + puente)</option>
              </select>
            </div>
          </div>

          {/* Perilla de Expresividad Literaria */}
          <div className="expressiveness-control">
            <label>🎭 Expresividad Literaria</label>
            <div className="expressiveness-knob">
              <div 
                className="knob literary"
                style={{
                  '--rotation': `${(lyricsConfig.expressiveness / 100) * 270 - 135}deg`
                }}
              >
                <div className="knob-indicator"></div>
                <div className="knob-center">
                  <span className="knob-value">{lyricsConfig.expressiveness}</span>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={lyricsConfig.expressiveness}
                onChange={(e) => setLyricsConfig(prev => ({
                  ...prev,
                  expressiveness: parseInt(e.target.value)
                }))}
                className="knob-slider"
              />
            </div>
            
            <div className="resources-preview">
              <h4>Recursos Literarios Activos:</h4>
              <div className="resources-list">
                {Object.entries(getLiteraryResourcesLevel()).map(([resource, level]) => (
                  <span 
                    key={resource} 
                    className={`resource-tag ${level}`}
                  >
                    {literaryResources[resource]} ({level})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lyrics-actions">
            <button 
              className="generate-lyrics-btn"
              onClick={generateLyrics}
              disabled={!lyricsConfig.theme || isGenerating}
            >
              {isGenerating ? 'Generando...' : '🎭 Generar Letras'}
            </button>
            
            <button 
              className="random-theme-btn"
              onClick={() => setLyricsConfig(prev => ({
                ...prev,
                theme: getRandomTheme()
              }))}
            >
              🎲 Tema Aleatorio
            </button>
          </div>
        </div>

        {/* Vista previa de letras generadas */}
        {musicConfig.lyrics && (
          <div className="lyrics-preview">
            <h3>Vista Previa de Letras</h3>
            <div className="lyrics-display">
              {musicConfig.lyrics.split('\n').map((line, index) => (
                <div key={index} className="lyrics-line">
                  {line}
                </div>
              ))}
            </div>
            
            <div className="lyrics-actions">
              <button onClick={() => setCurrentTab('create')}>
                ✅ Usar Estas Letras
              </button>
              <button onClick={generateLyrics}>
                🔄 Regenerar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Pestaña de generación final
  const renderGenerateTab = () => (
    <div className="tab-content">
      <h2>🎵 Generar Música Completa</h2>
      
      {isGenerating ? (
        <div className="generation-container">
          <div className="creator-animation">
            <div className="music-notes">
              {['🎵', '🎶', '🎼', '🎹', '🎸', '🎤'].map((note, i) => (
                <div 
                  key={i} 
                  className="floating-note"
                  style={{ '--delay': `${i * 0.3}s` }}
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
          
          <h3>The Creator trabajando en tu música...</h3>
          <div className="generation-steps">
            <div className="step">✓ Procesando letras y estilo</div>
            <div className="step">✓ Traduciendo prompt al inglés</div>
            <div className="step">⏳ Generando música con Suno</div>
            <div className="step">⏳ Aplicando post-procesamiento</div>
          </div>
        </div>
      ) : generatedTrack ? (
        <div className="generated-result">
          <div className="track-info">
            <h3>🎵 {generatedTrack.title || musicConfig.title || 'Nueva Creación'}</h3>
            <p>Generado con The Creator</p>
          </div>
          
          <div className="track-player">
            <audio controls src={generatedTrack.audio_url} />
          </div>
          
          <div className="track-details">
            <div className="detail-grid">
              <div>Duración: {generatedTrack.duration}</div>
              <div>Estilo: {musicConfig.style}</div>
              <div>Idioma: {lyricsConfig.language}</div>
              <div>Calidad: {generatedTrack.quality}</div>
            </div>
          </div>
          
          <div className="export-actions">
            <button className="export-btn">💾 Descargar</button>
            <button className="export-btn">📚 Guardar en Archivo</button>
            <button className="export-btn">🎤 Enviar a Clone Station</button>
            <button className="export-btn">🚀 Compartir con Nova Post</button>
          </div>
        </div>
      ) : (
        <div className="generation-preview">
          <h3>Vista Previa de Configuración</h3>
          
          <div className="config-preview">
            <div className="preview-section">
              <h4>🎵 Información Básica</h4>
              <p><strong>Título:</strong> {musicConfig.title || 'Sin título'}</p>
              <p><strong>Estilo:</strong> {musicConfig.style || 'No especificado'}</p>
            </div>
            
            {musicConfig.lyrics && (
              <div className="preview-section">
                <h4>📝 Letras</h4>
                <div className="lyrics-preview-short">
                  {musicConfig.lyrics.split('\n').slice(0, 4).map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  {musicConfig.lyrics.split('\n').length > 4 && <p>...</p>}
                </div>
              </div>
            )}
            
            {musicConfig.useCustomPrompt && musicConfig.customPrompt && (
              <div className="preview-section">
                <h4>🎯 Prompt Personalizado</h4>
                <p className="prompt-preview-text">{musicConfig.customPrompt}</p>
              </div>
            )}
          </div>
          
          <button 
            className="generate-music-btn"
            onClick={generateMusic}
            disabled={!musicConfig.style && !musicConfig.customPrompt}
          >
            🎵 Crear Música Completa
          </button>
        </div>
      )}
    </div>
  );

  // Obtener tema aleatorio
  const getRandomTheme = () => {
    const themes = [
      'Un amor perdido en la ciudad',
      'La lucha contra las adversidades',
      'Nostalgia por los días de juventud',
      'Sueños que se hacen realidad',
      'La belleza de lo imperfecto',
      'Resistencia contra el sistema',
      'Encuentro con uno mismo',
      'La magia de los pequeños momentos',
      'Viaje hacia lo desconocido',
      'La fuerza de la amistad'
    ];
    
    return themes[Math.floor(Math.random() * themes.length)];
  };

  return (
    <div className="the-creator">
      <div className="creator-header">
        <div className="creator-title">
          <h1>🎵 The Creator</h1>
          <p>Herramienta Principal de Generación Musical</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Tabs */}
      <div className="creator-tabs">
        <button
          className={`tab ${currentTab === 'create' ? 'active' : ''}`}
          onClick={() => setCurrentTab('create')}
        >
          🎵 Crear
        </button>
        <button
          className={`tab ${currentTab === 'lyrics' ? 'active' : ''}`}
          onClick={() => setCurrentTab('lyrics')}
        >
          📝 Letras
        </button>
        <button
          className={`tab ${currentTab === 'generate' ? 'active' : ''}`}
          onClick={() => setCurrentTab('generate')}
        >
          🎶 Generar
        </button>
      </div>

      <div className="creator-content">
        {renderCurrentTab()}
      </div>
    </div>
  );
};

export default TheCreator;
