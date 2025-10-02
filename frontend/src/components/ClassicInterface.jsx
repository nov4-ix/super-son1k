/**
 * 🎵 Classic Interface - Interfaz Clásica Completa
 * Replica exacta del HTML estático pero en React funcional
 * Mantiene faders, tipografía y estética original
 */

import React, { useState, useEffect, useRef } from 'react';
import './ClassicInterface.css';
import SubscriptionPlans from './SubscriptionPlans';
import CodexViewer from './CodexViewer';
import GhostStudio from './GhostStudio';
import TheCreator from './TheCreator';

const ClassicInterface = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [systemStatus, setSystemStatus] = useState({
    api: 'online',
    celery: 'offline', 
    redis: 'offline',
    extension: 'offline'
  });
  
  // Estados de knobs (igual que en el HTML)
  const [knobs, setKnobs] = useState({
    expresividad: 75,
    creatividad: 60,
    precision: 85
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState([]);

  // Manejar cambio de sección
  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
    
    // Actualizar clases de navegación
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('tab-active');
      if (tab.dataset.section === sectionId) {
        tab.classList.add('tab-active');
      }
    });
  };

  // Manejar cambio de knobs
  const handleKnobChange = (knobName, value) => {
    setKnobs(prev => ({
      ...prev,
      [knobName]: parseInt(value)
    }));
  };

  // Generar música (conectar con The Creator)
  const handleGenerateMusic = async () => {
    const prompt = document.getElementById('letraCancion')?.value;
    if (!prompt) {
      showToast('Por favor ingresa un prompt para generar música', 'warning');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular generación (en producción conectaría con Suno)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTrack = {
        id: Date.now(),
        title: `Track ${generatedTracks.length + 1}`,
        prompt: prompt,
        created_at: new Date().toISOString(),
        knobs: { ...knobs }
      };
      
      setGeneratedTracks(prev => [newTrack, ...prev]);
      showToast('¡Música generada exitosamente!', 'success');
      setCurrentSection('resultados');
      
    } catch (error) {
      showToast('Error generando música', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Activar modo Nexus (easter egg)
  const activateNexusMode = () => {
    showToast('🎮 Activando Modo Nexus...', 'info');
    setTimeout(() => {
      window.location.href = '/nexus';
    }, 1500);
  };

  // Mostrar toast (igual que en HTML)
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
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Easter egg para Nexus (Ctrl+Alt+H)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.altKey && event.code === 'KeyH') {
        event.preventDefault();
        activateNexusMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Renderizar sección actual
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return renderHomeSection();
      case 'ghost-studio':
        return <GhostStudio services={{}} />;
      case 'generacion':
        return <TheCreator services={{}} />;
      case 'resultados':
        return renderResultsSection();
      case 'extension':
        return renderExtensionSection();
      case 'archivo':
        return renderArchivoSection();
      case 'community':
        return renderCommunitySection();
      case 'planes':
        return <SubscriptionPlans />;
      case 'codex':
        return <CodexViewer />;
      default:
        return renderHomeSection();
    }
  };

  // Sección Home (igual que HTML)
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
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="bg-neon text-black px-8 py-3 rounded-lg font-semibold hover:bg-neon/90 transition shadow-glow btn"
              onClick={() => setCurrentSection('generacion')}
            >
              Entrar al Estudio
            </button>
            <button 
              className="border border-white/20 px-8 py-3 rounded-lg hover:bg-white/5 transition btn"
              onClick={() => setCurrentSection('codex')}
            >
              Conocer el Universo
            </button>
          </div>
          
          <p className="text-zinc-400 max-w-lg">
            Genera música, clona voces cantadas, mezcla con calidad de estudio y guarda tu proceso en un archivo vivo. Bienvenido al Estudio Fantasma.
          </p>

          {/* Sistema de Status (igual que HTML) */}
          <div className="bg-zinc-900/30 rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Estado del Sistema</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <span className={`status-indicator status-${systemStatus.api}`}></span>
                <span>API Backend</span>
              </div>
              <div className="flex items-center">
                <span className={`status-indicator status-${systemStatus.celery}`}></span>
                <span>Celery Worker</span>
              </div>
              <div className="flex items-center">
                <span className={`status-indicator status-${systemStatus.redis}`}></span>
                <span>Redis</span>
              </div>
              <div className="flex items-center">
                <span className={`status-indicator status-${systemStatus.extension}`}></span>
                <span>Chrome Extension</span>
              </div>
            </div>
            <button 
              className="mt-4 text-neon text-sm hover:underline btn"
              onClick={() => showToast('Estado del sistema actualizado', 'info')}
            >
              🔄 Refresh Status
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-10 -z-10 blur-3xl opacity-30" style={{background: 'conic-gradient(from 45deg, rgba(0,255,231,.2), transparent, rgba(99,102,241,.2))'}}></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Controles de Expresividad</h3>
              <p className="text-sm text-zinc-400">Ajusta los parámetros para crear tu sonido único</p>
            </div>
            
            {/* Knobs (igual que HTML) */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="knob-container">
                  <div className="knob" style={{'--rotation': `${(knobs.expresividad / 100) * 270 - 135}deg`}}>
                    <div className="knob-indicator"></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knobs.expresividad}
                    onChange={(e) => handleKnobChange('expresividad', e.target.value)}
                    className="knob-input"
                  />
                </div>
                <p className="text-sm mt-2 text-zinc-400">Expresividad</p>
                <p className="text-xs text-neon font-mono">{knobs.expresividad}%</p>
              </div>
              
              <div className="text-center">
                <div className="knob-container">
                  <div className="knob" style={{'--rotation': `${(knobs.creatividad / 100) * 270 - 135}deg`}}>
                    <div className="knob-indicator"></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knobs.creatividad}
                    onChange={(e) => handleKnobChange('creatividad', e.target.value)}
                    className="knob-input"
                  />
                </div>
                <p className="text-sm mt-2 text-zinc-400">Creatividad</p>
                <p className="text-xs text-neon font-mono">{knobs.creatividad}%</p>
              </div>
              
              <div className="text-center">
                <div className="knob-container">
                  <div className="knob" style={{'--rotation': `${(knobs.precision / 100) * 270 - 135}deg`}}>
                    <div className="knob-indicator"></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={knobs.precision}
                    onChange={(e) => handleKnobChange('precision', e.target.value)}
                    className="knob-input"
                  />
                </div>
                <p className="text-sm mt-2 text-zinc-400">Precisión</p>
                <p className="text-xs text-neon font-mono">{knobs.precision}%</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button 
                className="rounded-lg border border-neon/30 text-neon px-4 py-3 hover:bg-neon/10 transition font-medium btn"
                onClick={() => showToast('Test rápido ejecutado', 'success')}
              >
                Test Rápido
              </button>
              <button 
                className="rounded-lg bg-neon/10 border border-neon text-neon px-4 py-3 hover:bg-neon/20 transition font-medium btn"
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

  // Sección de resultados
  const renderResultsSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neon mb-4">Reproductor</h2>
          <p className="text-zinc-400">Tus creaciones musicales</p>
        </div>
        
        <div className="space-y-4">
          {generatedTracks.length > 0 ? (
            generatedTracks.map((track) => (
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
                      className="px-3 py-1 bg-neon text-black rounded text-sm font-medium hover:bg-neon/80 transition-colors"
                      onClick={() => showToast('Reproduciendo...', 'info')}
                    >
                      ▶️ Reproducir
                    </button>
                    <button 
                      className="px-3 py-1 bg-zinc-700 text-white rounded text-sm font-medium hover:bg-zinc-600 transition-colors"
                      onClick={() => showToast('Descargando...', 'info')}
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

  // Otras secciones
  const renderExtensionSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold text-neon mb-4">Extensión</h2>
        <p className="text-zinc-400 text-lg mb-8">Herramientas adicionales para potenciar tu creatividad</p>
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <p className="text-zinc-300">Extensiones y herramientas adicionales próximamente.</p>
        </div>
      </div>
    </section>
  );

  const renderArchivoSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold text-neon mb-4">El Archivo</h2>
        <p className="text-zinc-400 text-lg mb-8">Tu memoria creativa: canciones, presets y sesiones guardadas</p>
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="grid gap-4">
            {generatedTracks.slice(0, 5).map((track) => (
              <div key={track.id} className="flex justify-between items-center p-4 bg-black/30 rounded">
                <div>
                  <h4 className="text-white font-semibold">{track.title}</h4>
                  <p className="text-sm text-zinc-400">{track.prompt}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-neon text-black rounded text-sm">▶️</button>
                  <button className="px-3 py-1 bg-zinc-700 text-white rounded text-sm">📥</button>
                </div>
              </div>
            ))}
            {generatedTracks.length === 0 && (
              <p className="text-zinc-400">Tu archivo está vacío. ¡Crea tu primera canción!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const renderCommunitySection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold text-neon mb-4">⚔️ El Santuario</h2>
        <p className="text-zinc-400 text-lg mb-8">La red secreta de la Divina Liga: colaboración, misiones poéticas</p>
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="space-y-6">
            <div className="p-6 bg-neon/10 rounded-lg border border-neon/30">
              <h3 className="text-xl font-bold text-neon mb-4">Modo Premium</h3>
              <p className="text-zinc-300 mb-4">
                Accede al Santuario completo con colaboraciones, misiones poéticas y ritual de entrada al Estudio Fantasma.
              </p>
              <button 
                className="bg-neon text-black px-6 py-2 rounded-lg font-semibold hover:bg-neon/90 transition"
                onClick={() => setCurrentSection('planes')}
              >
                Activar Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="classic-interface antialiased overflow-x-hidden bg-haze">
      {/* Navegación (igual que HTML) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-neon">SON1KVERS3</span>
          </div>
          
          <div className="flex space-x-6">
            {[
              { id: 'home', label: 'Historia' },
              { id: 'ghost-studio', label: 'Ghost Studio' },
              { id: 'generacion', label: 'Generación' },
              { id: 'resultados', label: 'Reproductor' },
              { id: 'extension', label: 'Extensión' },
              { id: 'archivo', label: 'Archivo' },
              { id: 'community', label: '⚔️ Santuario' },
              { id: 'planes', label: 'Planes' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-tab px-3 py-1 rounded-lg transition ${currentSection === tab.id ? 'tab-active' : ''}`}
                data-section={tab.id}
                onClick={() => handleSectionChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            
            {/* Easter Egg: Botón Nexus disfrazado */}
            <button
              className="nav-tab px-3 py-1 rounded-lg transition opacity-0 hover:opacity-100"
              style={{ position: 'relative', overflow: 'hidden' }}
              title="¿Qué es esto? 🤔"
              onClick={activateNexusMode}
            >
              <span style={{ fontSize: '10px', color: '#666' }}>?</span>
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="border border-white/20 px-3 py-1 rounded-lg hover:bg-white/5 transition"
              onClick={() => showToast('Modal de login próximamente', 'info')}
            >
              Login
            </button>
            <button 
              className="bg-neon text-black px-3 py-1 rounded-lg font-semibold hover:bg-neon/90 transition"
              onClick={() => showToast('Registro próximamente', 'info')}
            >
              Registro
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main>
        {renderCurrentSection()}
      </main>

      {/* Toast container */}
      <div id="toast-container"></div>
    </div>
  );
};

export default ClassicInterface;
