import React, { useState, useEffect, useRef } from 'react';
import './EnhancedClassicApp.css';

const EnhancedClassicApp = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [userSession, setUserSession] = useState({
    plan: 'free',
    tracksUsed: 0,
    tracksLimit: 3,
    user_id: 'anonymous',
    credits: 0,
    remaining_generations: 3
  });

  // Knob controls
  const [knobValues, setKnobValues] = useState({
    expresividad: 75,
    rareza: 60,
    garage: 80
  });

  // Audio refs
  const audioRef = useRef(null);
  const visualizerRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize app
  useEffect(() => {
    setupAudioVisualizer();
    loadTracks();
    updateUserInfo();
  }, []);

  // Setup audio visualizer
  const setupAudioVisualizer = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Visualizer setup
    const drawVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Simple waveform visualization
      const time = Date.now() * 0.005;
      const wave = Math.sin(time) * 20 + 30;
      
      ctx.fillStyle = '#00FFE7';
      ctx.fillRect(wave, 10, 4, 40);
      ctx.fillRect(wave + 20, 15, 4, 30);
      ctx.fillRect(wave + 40, 20, 4, 20);
      ctx.fillRect(wave + 60, 25, 4, 10);
      
      requestAnimationFrame(drawVisualizer);
    };
    
    drawVisualizer();
  };

  // Load tracks from API
  const loadTracks = async () => {
    try {
      const response = await fetch('/api/tracks');
      const data = await response.json();
      
      if (data.tracks) {
        setTracks(data.tracks);
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    }
  };

  // Update user info
  const updateUserInfo = async () => {
    try {
      const response = await fetch(`/api/user/usage?user_id=${userSession.user_id}&user_tier=${userSession.plan}`);
      const data = await response.json();
      
      setUserSession(prev => ({
        ...prev,
        credits: data.credits_used || 0,
        remaining_generations: data.remaining_generations || 0
      }));
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  // Handle knob changes
  const handleKnobChange = (knobName, value) => {
    setKnobValues(prev => ({
      ...prev,
      [knobName]: value
    }));
  };

  // Generate music
  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: document.getElementById('musicPrompt')?.value || 'Generate a song',
          expresividad: knobValues.expresividad,
          rareza: knobValues.rareza,
          garage: knobValues.garage
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Música generada exitosamente', 'success');
        loadTracks(); // Reload tracks
      } else {
        showToast('Error generando música', 'error');
      }
    } catch (error) {
      console.error('Error generating music:', error);
      showToast('Error de conexión', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Play track
  const playTrack = (trackId) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = `/api/tracks/${trackId}/audio`;
        audioRef.current.play();
      }
      showToast('Reproduciendo pista...', 'info');
    }
  };

  // Download track
  const downloadTrack = (trackId) => {
    const link = document.createElement('a');
    link.href = `/api/tracks/${trackId}/audio`;
    link.download = `track_${trackId}.mp3`;
    link.click();
    showToast('Descargando pista...', 'info');
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Render navigation
  const renderNavigation = () => (
    <nav className="nav-bar">
      <div className="nav-content">
        <div className="flex items-center space-x-3">
          <div className="logo-container">
            <span className="logo-text">S3</span>
          </div>
          <span className="text-xl font-bold text-neon">SON1KVERS3</span>
        </div>
        
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${currentSection === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentSection('home')}
          >
            Historia
          </button>
          <button 
            className={`nav-tab ${currentSection === 'generacion' ? 'active' : ''}`}
            onClick={() => setCurrentSection('generacion')}
          >
            Generación
          </button>
          <button 
            className={`nav-tab ${currentSection === 'archivo' ? 'active' : ''}`}
            onClick={() => setCurrentSection('archivo')}
          >
            Archivo
          </button>
          <button 
            className={`nav-tab ${currentSection === 'santuario' ? 'active' : ''}`}
            onClick={() => setCurrentSection('santuario')}
          >
            Santuario
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <div className="text-zinc">Plan: <span className="text-neon">{userSession.plan}</span></div>
            <div className="text-zinc">Pistas: <span>{userSession.tracksUsed}</span>/<span className="text-neon">{userSession.tracksLimit}</span></div>
          </div>
          <button className="btn btn-primary text-sm">Iniciar Sesión</button>
        </div>
      </div>
    </nav>
  );

  // Render sidebar
  const renderSidebar = () => (
    <div className="sidebar">
      <div className="space-y-4">
        <h3 className="text-neon font-bold text-lg">LA RESISTENCIA</h3>
        
        {/* User Info */}
        <div className="space-y-2">
          <div className="text-sm">
            <div className="text-zinc">Estado: <span className="text-neon">Activo</span></div>
            <div className="text-zinc">Sesión: <span className="text-neon">Conectado</span></div>
          </div>
        </div>
        
        {/* Audio Visualizer */}
        <div className="p-4 bg-black/30 rounded">
          <h4 className="text-neon text-sm font-bold mb-2">Visualizador</h4>
          <canvas 
            ref={canvasRef}
            width="200" 
            height="60" 
            className="w-full h-15 bg-black/50 rounded"
          />
        </div>
        
        {/* System Status */}
        <div className="p-4 bg-black/30 rounded">
          <h4 className="text-neon text-sm font-bold mb-2">Sistema</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>NOV4-IX Engine:</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex justify-between">
              <span>Resistencia AI:</span>
              <span className="text-green-400">●</span>
            </div>
            <div className="flex justify-between">
              <span>Storage:</span>
              <span className="text-green-400">●</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render home section
  const renderHomeSection = () => (
    <section className="section active">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-zinc uppercase tracking-wider">LA RESISTENCIA</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Lo imperfecto también<br />
            <span className="text-neon">es sagrado</span>
          </h1>
          <h2 className="text-lg text-zinc">
            Componer con alma en un mundo de máquinas.
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentSection('generacion')}
          >
            Entrar al Estudio
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentSection('santuario')}
          >
            Conocer el Universo
          </button>
        </div>
        
        <p className="text-sm text-zinc max-w-lg mx-auto mt-4">
          Genera música, clona voces cantadas, mezcla con calidad de estudio y guarda tu proceso en un archivo vivo. Bienvenido al Estudio Fantasma.
        </p>
      </div>
      
      {/* Expression Controls */}
      <div className="vintage-panel mt-8 p-6">
        {/* Corner screws */}
        <div className="screw top-left"></div>
        <div className="screw top-right"></div>
        <div className="screw bottom-left"></div>
        <div className="screw bottom-right"></div>
        
        {/* Wear effects */}
        <div className="wear scratch-1"></div>
        <div className="wear scratch-2"></div>
        <div className="wear dent"></div>
        <div className="wear fade"></div>
        
        <h3 className="text-lg font-bold text-center mb-6">EXPRESSION CONTROLS</h3>
        <div className="controls-grid">
          <div className="control-item">
            <div className="knob" data-knob="expresividad" data-value={knobValues.expresividad}>
              <div className="knob-scale"></div>
              <div className="knob-wear"></div>
              <div className="knob-value">{knobValues.expresividad}%</div>
            </div>
            <p className="text-sm text-zinc font-mono">EXPRESSION</p>
          </div>
          <div className="control-item">
            <div className="knob" data-knob="rareza" data-value={knobValues.rareza}>
              <div className="knob-scale"></div>
              <div className="knob-wear"></div>
              <div className="knob-value">{knobValues.rareza}%</div>
            </div>
            <p className="text-sm text-zinc font-mono">RAREZA</p>
          </div>
          <div className="control-item">
            <div className="knob" data-knob="garage" data-value={knobValues.garage}>
              <div className="knob-scale"></div>
              <div className="knob-wear"></div>
              <div className="knob-value">{knobValues.garage}%</div>
            </div>
            <p className="text-sm text-zinc font-mono">GARAGE</p>
          </div>
        </div>
      </div>
    </section>
  );

  // Render generation section
  const renderGenerationSection = () => (
    <section className="section">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neon mb-4">GHOST STUDIO</h2>
          <p className="text-zinc">Genera música con IA usando controles de expresión</p>
        </div>
        
        {/* Music Generation Form */}
        <div className="vintage-panel p-6">
          <div className="screw top-left"></div>
          <div className="screw top-right"></div>
          <div className="screw bottom-left"></div>
          <div className="screw bottom-right"></div>
          
          <div className="input-group mb-4">
            <label className="input-label">Prompt de Música</label>
            <textarea
              id="musicPrompt"
              placeholder="Describe la música que quieres generar..."
              rows="4"
              className="w-full p-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-neon focus:outline-none"
            />
          </div>
          
          <div className="flex gap-4 justify-center">
            <button 
              className={`console-button ${isGenerating ? 'red' : 'green'} ${isGenerating ? 'active' : ''}`}
              onClick={handleGenerateMusic}
              disabled={isGenerating}
            >
              {isGenerating ? 'GENERANDO...' : 'GENERAR MÚSICA'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Render archive section
  const renderArchiveSection = () => (
    <section className="section">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neon mb-4">ARCHIVO</h2>
          <p className="text-zinc">Tus creaciones guardadas</p>
        </div>
        
        <div className="space-y-4">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <div key={track.id} className="p-4 bg-black/30 rounded border border-zinc-800 hover:border-neon/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{track.title}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{track.prompt}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(track.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => playTrack(track.id)}
                      className="px-3 py-1 bg-neon text-black rounded text-sm font-medium hover:bg-neon/80 transition-colors"
                    >
                      ▶️ Reproducir
                    </button>
                    <button 
                      onClick={() => downloadTrack(track.id)}
                      className="px-3 py-1 bg-zinc-700 text-white rounded text-sm font-medium hover:bg-zinc-600 transition-colors"
                    >
                      📥 Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-black/30 rounded text-center">
              <p className="text-zinc">No hay pistas guardadas aún.</p>
              <p className="text-sm text-zinc">Genera tu primera canción para comenzar tu archivo.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // Render sanctuary section
  const renderSanctuarySection = () => (
    <section className="section">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold text-neon">SANTUARIO</h2>
        <p className="text-zinc">Espacio de reflexión y conexión</p>
        
        <div className="vintage-panel p-8">
          <div className="screw top-left"></div>
          <div className="screw top-right"></div>
          <div className="screw bottom-left"></div>
          <div className="screw bottom-right"></div>
          
          <div className="space-y-4">
            <p className="text-lg text-zinc">
              "En el silencio entre las notas, encontramos la verdadera música."
            </p>
            <p className="text-sm text-zinc-400">
              La Resistencia no es solo una herramienta, es un movimiento. 
              Un espacio donde la creatividad humana y la inteligencia artificial 
              se encuentran para crear algo nuevo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Render current section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return renderHomeSection();
      case 'generacion':
        return renderGenerationSection();
      case 'archivo':
        return renderArchiveSection();
      case 'santuario':
        return renderSanctuarySection();
      default:
        return renderHomeSection();
    }
  };

  return (
    <div className="enhanced-classic-app">
      {renderNavigation()}
      
      <div className="main-grid">
        {renderSidebar()}
        
        <div className="main-content">
          {renderCurrentSection()}
        </div>
        
        {/* Right sidebar placeholder */}
        <div className="sidebar">
          <div className="space-y-4">
            <h3 className="text-neon font-bold text-lg">CONTROLES</h3>
            
            {/* Quick Controls */}
            <div className="p-4 bg-black/30 rounded">
              <h4 className="text-neon text-sm font-bold mb-2">Acciones Rápidas</h4>
              <div className="space-y-2">
                <button 
                  className="console-button blue w-full"
                  onClick={() => setCurrentSection('generacion')}
                >
                  GENERAR
                </button>
                <button 
                  className="console-button orange w-full"
                  onClick={() => setCurrentSection('archivo')}
                >
                  ARCHIVO
                </button>
              </div>
            </div>
            
            {/* Current Track */}
            {currentTrack && (
              <div className="p-4 bg-black/30 rounded">
                <h4 className="text-neon text-sm font-bold mb-2">Reproduciendo</h4>
                <p className="text-sm text-white">{currentTrack.title}</p>
                <p className="text-xs text-zinc-400">{currentTrack.prompt}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} />
      
      {/* Toast container */}
      <div id="toast-container"></div>
    </div>
  );
};

export default EnhancedClassicApp;
