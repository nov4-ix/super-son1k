import React, { useState, useEffect, useRef } from 'react';
import './ModernGhostStudio.css';

/**
 * 🎵 Modern Ghost Studio - Interfaz de Vanguardia
 * Sistema de producción musical con diseño glassmorphism y animaciones fluidas
 */

const ModernGhostStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('Indie Rock');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [audioWaveform, setAudioWaveform] = useState([]);
  const canvasRef = useRef(null);

  const styles = [
    { name: 'Indie Rock', icon: '🎸', color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' },
    { name: 'Electronic Pop', icon: '🎹', color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4, #44A08D)' },
    { name: 'Hip-Hop', icon: '🎤', color: '#FFD93D', gradient: 'linear-gradient(135deg, #FFD93D, #F6C90E)' },
    { name: 'Reggaeton', icon: '🔥', color: '#FF6B9D', gradient: 'linear-gradient(135deg, #FF6B9D, #C44569)' },
    { name: 'Jazz Fusion', icon: '🎺', color: '#A8E6CF', gradient: 'linear-gradient(135deg, #A8E6CF, #3EECAC)' },
    { name: 'Synthwave', icon: '🌆', color: '#B388FF', gradient: 'linear-gradient(135deg, #B388FF, #8E24AA)' },
    { name: 'Lo-Fi Hip-Hop', icon: '☕', color: '#FFB6B9', gradient: 'linear-gradient(135deg, #FFB6B9, #FEA47F)' },
    { name: 'Trap', icon: '💎', color: '#6C5CE7', gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' }
  ];

  const promptSuggestions = [
    "Canción indie rock con guitarras melancólicas y batería energética",
    "Track electrónico atmosférico con sintetizadores y voces etéreas",
    "Beat de hip-hop con samples de jazz y ritmo relajado",
    "Reggaeton moderno con trap latino y bajo potente",
    "Instrumental de jazz fusion con improvisación de saxofón"
  ];

  // Generar waveform animado
  useEffect(() => {
    const generateWaveform = () => {
      const bars = Array.from({ length: 50 }, () => Math.random() * 100);
      setAudioWaveform(bars);
    };

    const interval = setInterval(generateWaveform, 100);
    return () => clearInterval(interval);
  }, []);

  // Dibujar visualizador de audio
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = width / audioWaveform.length;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(0.5, '#8b5cf6');
    gradient.addColorStop(1, '#ec4899');

    audioWaveform.forEach((value, index) => {
      const barHeight = (value / 100) * height;
      const x = index * barWidth;
      const y = height - barHeight;

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
    });
  }, [audioWaveform]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simular generación
    setTimeout(() => {
      setGeneratedTrack({
        title: prompt.split(' ').slice(0, 3).join(' ') || 'Nueva Creación',
        duration: '3:24',
        style: style,
        waveform: audioWaveform,
        url: '/audio/generated_track.mp3'
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleRandomPrompt = () => {
    const randomPrompt = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="modern-ghost-studio">
      {/* Header con glassmorphism */}
      <div className="studio-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🎵</div>
            <div className="logo-text">
              <h1>Ghost Studio</h1>
              <p>AI-Powered Music Production</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="icon-button">
              <span>⚙️</span>
            </button>
            <button className="icon-button">
              <span>📊</span>
            </button>
            <button className="icon-button notification">
              <span>🔔</span>
              <div className="notification-badge">3</div>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="studio-tabs">
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          <span className="tab-icon">✨</span>
          <span className="tab-label">Create</span>
        </button>
        <button
          className={`tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-label">Library</span>
        </button>
        <button
          className={`tab ${activeTab === 'collaborate' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaborate')}
        >
          <span className="tab-icon">👥</span>
          <span className="tab-label">Collaborate</span>
        </button>
      </div>

      {/* Contenido principal */}
      <div className="studio-content">
        <div className="content-grid">
          {/* Panel izquierdo - Inputs */}
          <div className="left-panel">
            <div className="glass-card">
              <div className="card-header">
                <h2>🎨 Creative Input</h2>
                <button className="magic-button" onClick={handleRandomPrompt}>
                  <span>✨</span> Inspire Me
                </button>
              </div>

              {/* Selector de estilo */}
              <div className="style-selector">
                <label>Musical Style</label>
                <div className="selected-style" onClick={() => setShowStylePicker(!showStylePicker)}>
                  <div className="style-preview" style={{ background: styles.find(s => s.name === style)?.gradient }}>
                    <span className="style-icon">{styles.find(s => s.name === style)?.icon}</span>
                  </div>
                  <span className="style-name">{style}</span>
                  <span className="dropdown-arrow">▼</span>
                </div>

                {showStylePicker && (
                  <div className="style-picker">
                    {styles.map((s) => (
                      <div
                        key={s.name}
                        className={`style-option ${style === s.name ? 'selected' : ''}`}
                        onClick={() => {
                          setStyle(s.name);
                          setShowStylePicker(false);
                        }}
                      >
                        <div className="style-preview" style={{ background: s.gradient }}>
                          <span className="style-icon">{s.icon}</span>
                        </div>
                        <span className="style-name">{s.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Prompt input */}
              <div className="input-group">
                <label>
                  <span>🎯</span> Musical Prompt
                </label>
                <textarea
                  className="modern-textarea"
                  placeholder="Describe your musical vision... (e.g., 'Energetic indie rock with dreamy vocals and atmospheric guitars')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
                <div className="input-footer">
                  <span className="char-count">{prompt.length} / 500</span>
                  <div className="quick-actions">
                    <button className="quick-btn">🎸 Add Instruments</button>
                    <button className="quick-btn">🎭 Set Mood</button>
                  </div>
                </div>
              </div>

              {/* Lyrics input */}
              <div className="input-group">
                <label>
                  <span>📝</span> Lyrics (Optional)
                </label>
                <textarea
                  className="modern-textarea"
                  placeholder="Enter your lyrics or let AI generate them..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  rows={6}
                />
                <div className="input-footer">
                  <button className="ai-assist-btn">
                    <span>🤖</span> AI Generate Lyrics
                  </button>
                </div>
              </div>

              {/* Generate button */}
              <button
                className={`generate-button ${isGenerating ? 'generating' : ''}`}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <span>🎵</span>
                    <span>Generate Track</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panel derecho - Preview y controles */}
          <div className="right-panel">
            {/* Visualizador de audio */}
            <div className="glass-card visualizer-card">
              <div className="card-header">
                <h2>🎧 Audio Visualizer</h2>
                <div className="visualizer-controls">
                  <button className="viz-btn active">Waveform</button>
                  <button className="viz-btn">Spectrum</button>
                  <button className="viz-btn">Circular</button>
                </div>
              </div>

              <div className="visualizer-container">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="audio-canvas"
                />
                <div className="visualizer-overlay">
                  {!generatedTrack && (
                    <div className="empty-state">
                      <div className="empty-icon">🎵</div>
                      <p>Generate a track to see the magic</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Track preview */}
            {generatedTrack && (
              <div className="glass-card track-card">
                <div className="track-header">
                  <div className="track-artwork">
                    <div className="artwork-gradient" style={{ background: styles.find(s => s.name === generatedTrack.style)?.gradient }}>
                      <span className="artwork-icon">{styles.find(s => s.name === generatedTrack.style)?.icon}</span>
                    </div>
                  </div>
                  <div className="track-info">
                    <h3>{generatedTrack.title}</h3>
                    <p className="track-meta">
                      <span>{generatedTrack.style}</span>
                      <span>•</span>
                      <span>{generatedTrack.duration}</span>
                    </p>
                  </div>
                  <button className="like-button">
                    <span>❤️</span>
                  </button>
                </div>

                <div className="player-controls">
                  <button className="control-btn">⏮️</button>
                  <button className="control-btn play-btn">▶️</button>
                  <button className="control-btn">⏭️</button>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '35%' }}></div>
                  </div>
                  <span className="time-display">1:12 / 3:24</span>
                </div>

                <div className="track-actions">
                  <button className="action-btn primary">
                    <span>💾</span> Save
                  </button>
                  <button className="action-btn">
                    <span>📤</span> Share
                  </button>
                  <button className="action-btn">
                    <span>🎛️</span> Remix
                  </button>
                  <button className="action-btn">
                    <span>⬇️</span> Download
                  </button>
                </div>
              </div>
            )}

            {/* Quick stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎵</div>
                <div className="stat-info">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Tracks Created</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <div className="stat-info">
                  <span className="stat-value">2.3h</span>
                  <span className="stat-label">Total Duration</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <div className="stat-info">
                  <span className="stat-value">8</span>
                  <span className="stat-label">Trending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default ModernGhostStudio;
