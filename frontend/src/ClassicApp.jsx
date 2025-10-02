/**
 * 🎵 Son1kVers3 Classic - Aplicación Clásica
 * Interfaz basada en el archivo index.html original
 * Modo clásico para usuarios que buscan usar las herramientas directamente
 */

import React, { useState, useEffect } from 'react';
import './ClassicApp.css';

const ClassicApp = () => {
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

  // Controles de expresión (como en el HTML original)
  const [knobValues, setKnobValues] = useState({
    expresividad: 75,
    creatividad: 60,
    precision: 85
  });

  // Audio refs
  const audioRef = React.useRef(null);

  // Initialize app
  useEffect(() => {
    loadTracks();
    updateUserInfo();
  }, []);

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
          prompt: document.getElementById('letraCancion')?.value || 'Generate a song',
          expresividad: knobValues.expresividad,
          creatividad: knobValues.creatividad,
          precision: knobValues.precision
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Música generada exitosamente', 'success');
        loadTracks();
        setCurrentSection('resultados');
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

  // Easter egg para activar Nexus
  const activateNexusEasterEgg = () => {
    showToast('¡Easter egg activado! Redirigiendo al Nexus...', 'success');
    setTimeout(() => {
      window.location.href = '/nexus';
    }, 2000);
  };

  // Render navigation (basada en el HTML original)
  const renderNavigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <div className="logo-container">
            <span className="text-xl font-bold text-neon">SON1KVERS3</span>
          </div>
        </div>
        
        <div className="flex space-x-6">
          {[
            { id: 'home', label: 'Historia' },
            { id: 'ghost-studio', label: 'Ghost Studio' },
            { id: 'generacion', label: 'Generación' },
            { id: 'resultados', label: 'Reproductor' },
            { id: 'extension', label: 'Extensión' },
            { id: 'archivo', label: 'Archivo' },
            { id: 'community', label: '⚔️ Santuario' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-tab px-3 py-1 rounded-lg transition ${currentSection === tab.id ? 'tab-active' : ''}`}
              onClick={() => setCurrentSection(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          
          {/* Easter Egg: Botón Nexus disfrazado */}
          <button
            className="nav-tab px-3 py-1 rounded-lg transition opacity-0 hover:opacity-100"
            style={{ position: 'relative', overflow: 'hidden' }}
            title="¿Qué es esto? 🤔"
            onClick={activateNexusEasterEgg}
          >
            <span style={{ fontSize: '10px', color: '#666' }}>?</span>
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button className="border border-white/20 px-3 py-1 rounded-lg hover:bg-white/5 transition">
            Login
          </button>
          <button className="bg-neon text-black px-3 py-1 rounded-lg font-semibold hover:bg-neon/90 transition">
            Registro
          </button>
        </div>
      </div>
    </nav>
  );

  // Render home section (basada en el HTML original)
  const renderHomeSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-400 tracking-widest uppercase">LA RESISTENCIA</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Lo imperfecto también<br />
              <span className="text-neon">es sagrado</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-zinc-300 mt-4">
              Componer con alma<br />
              en un mundo de<br />
              <span className="text-neon-purple">máquinas.</span>
            </h2>
            
            <div className="mt-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <h3 className="text-xl font-bold text-neon mb-4">🎵 Son1kVers3 — La Resistencia Musical Digital</h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                <strong>www.son1kvers3.com</strong> es la plataforma revolucionaria de generación musical con inteligencia artificial. 
                Convierte cualquier texto, emoción o idea en música épica y profesional usando tecnología de vanguardia.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-zinc-400"><span className="text-neon">✨</span> <strong>Generación Inteligente:</strong> IA avanzada que entiende tu creatividad</p>
                  <p className="text-zinc-400"><span className="text-neon">👻</span> <strong>Ghost Studio:</strong> Herramientas profesionales de edición</p>
                  <p className="text-zinc-400"><span className="text-neon">📚</span> <strong>Archivo de la Resistencia:</strong> Biblioteca musical comunitaria</p>
                </div>
                <div className="space-y-2">
                  <p className="text-zinc-400"><span className="text-neon">🎮</span> <strong>Modo Inmersivo:</strong> Experiencia cyberpunk única</p>
                  <p className="text-zinc-400"><span className="text-neon">🌍</span> <strong>Acceso Global:</strong> Disponible en todo el mundo</p>
                  <p className="text-zinc-400"><span className="text-neon">🔒</span> <strong>Seguro y Privado:</strong> Tus creaciones están protegidas</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="bg-neon text-black px-8 py-3 rounded-lg font-semibold hover:bg-neon/90 transition shadow-glow"
              onClick={() => setCurrentSection('generacion')}
            >
              Entrar al Estudio
            </button>
            <button 
              className="border border-white/20 px-8 py-3 rounded-lg hover:bg-white/5 transition"
              onClick={() => setCurrentSection('community')}
            >
              Conocer el Universo
            </button>
          </div>
          
          <p className="text-zinc-400 max-w-lg">
            Genera música, clona voces cantadas, mezcla con calidad de estudio y guarda tu proceso en un archivo vivo. Bienvenido al Estudio Fantasma.
          </p>

          {/* Sistema de Status */}
          <div className="bg-zinc-900/30 rounded-xl border border-white/10 p-6">
            <h3 className="text-neon font-bold mb-4">Estado del Sistema</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>API Status:</span>
                <span className="status-indicator status-online">●</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Celery:</span>
                <span className="status-indicator status-offline">●</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Redis:</span>
                <span className="status-indicator status-offline">●</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Extension:</span>
                <span className="status-indicator status-offline">●</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Controles de Expresión */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-center mb-6">CONTROLES DE EXPRESIÓN</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">EXPRESIVIDAD</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knobValues.expresividad}
                    onChange={(e) => setKnobValues(prev => ({ ...prev, expresividad: parseInt(e.target.value) }))}
                    className="w-20"
                  />
                  <span className="text-xs text-neon font-mono w-8">{knobValues.expresividad}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">CREATIVIDAD</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knobValues.creatividad}
                    onChange={(e) => setKnobValues(prev => ({ ...prev, creatividad: parseInt(e.target.value) }))}
                    className="w-20"
                  />
                  <span className="text-xs text-neon font-mono w-8">{knobValues.creatividad}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">PRECISIÓN</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knobValues.precision}
                    onChange={(e) => setKnobValues(prev => ({ ...prev, precision: parseInt(e.target.value) }))}
                    className="w-20"
                  />
                  <span className="text-xs text-neon font-mono w-8">{knobValues.precision}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center mt-6">
              <button 
                className="rounded-lg border border-neon/30 text-neon px-4 py-3 hover:bg-neon/10 transition font-medium"
                onClick={() => setCurrentSection('generacion')}
              >
                Test Rápido
              </button>
              <button 
                className="rounded-lg bg-neon/10 border border-neon text-neon px-4 py-3 hover:bg-neon/20 transition font-medium"
                onClick={() => setCurrentSection('generacion')}
              >
                Generar Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Render generation section
  const renderGenerationSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neon mb-4">GENERACIÓN DE MÚSICA</h2>
          <p className="text-zinc-400">Convierte tu texto en música épica</p>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Letra de la Canción
              </label>
              <textarea
                id="letraCancion"
                placeholder="Escribe aquí la letra de tu canción o describe el estilo musical que deseas..."
                rows="8"
                className="w-full p-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-neon focus:outline-none"
              />
            </div>
            
            <div className="flex justify-center">
              <button
                className={`px-8 py-4 rounded-lg font-semibold transition ${
                  isGenerating 
                    ? 'bg-red-600 text-white cursor-not-allowed' 
                    : 'bg-neon text-black hover:bg-neon/90'
                }`}
                onClick={handleGenerateMusic}
                disabled={isGenerating}
              >
                {isGenerating ? 'GENERANDO...' : 'GENERAR MÚSICA'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Render results section
  const renderResultsSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neon mb-4">REPRODUCTOR</h2>
          <p className="text-zinc-400">Tus creaciones musicales</p>
        </div>
        
        <div className="grid gap-6">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <div key={track.id} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{track.title}</h3>
                    <p className="text-zinc-400 mb-2">{track.prompt}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(track.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => playTrack(track.id)}
                      className="px-4 py-2 bg-neon text-black rounded-lg font-medium hover:bg-neon/80 transition"
                    >
                      ▶️ Reproducir
                    </button>
                    <button 
                      onClick={() => downloadTrack(track.id)}
                      className="px-4 py-2 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600 transition"
                    >
                      📥 Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">No hay pistas generadas aún.</p>
              <p className="text-zinc-500 mt-2">Ve a la sección de Generación para crear tu primera canción.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  // Render other sections (simplified for now)
  const renderOtherSection = (title, description) => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold text-neon mb-4">{title}</h2>
        <p className="text-zinc-400 text-lg">{description}</p>
        <div className="mt-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-zinc-300">Esta sección está en desarrollo.</p>
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
      case 'resultados':
        return renderResultsSection();
      case 'ghost-studio':
        return renderOtherSection('GHOST STUDIO', 'Herramientas profesionales de edición');
      case 'extension':
        return renderOtherSection('EXTENSIÓN', 'Herramientas adicionales');
      case 'archivo':
        return renderOtherSection('ARCHIVO', 'Tu biblioteca musical');
      case 'community':
        return renderOtherSection('SANTUARIO', 'Comunidad de la Resistencia');
      default:
        return renderHomeSection();
    }
  };

  return (
    <div className="classic-app antialiased overflow-x-hidden bg-haze">
      {renderNavigation()}
      {renderCurrentSection()}
      
      {/* Hidden audio element */}
      <audio ref={audioRef} className="sr-only" />
      
      {/* Toast container */}
      <div id="toast-container"></div>
    </div>
  );
};

export default ClassicApp;