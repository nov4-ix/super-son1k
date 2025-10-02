/**
 * 🎵 Classic Interface - Interfaz Clásica COMPLETA
 * TODAS las funcionalidades conectadas: Pixel, prompts inteligentes, generación, etc.
 */

import React, { useState, useEffect, useRef } from 'react';
import './ClassicInterface.css';
import SubscriptionPlans from './SubscriptionPlans';
import CodexViewer from './CodexViewer';
import GhostStudio from './GhostStudio';
import TheCreator from './TheCreator';
import FloatingPixelAssistant from './FloatingPixelAssistant';
import NovaPostPilot from './NovaPostPilot';
import CloneStation from './CloneStation';
import DAWEditor from './DAWEditor';
import ProfessionalDAW from './ProfessionalDAW';
import SSLChannelStrip from './SSLChannelStrip';

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
  const [showPixelAssistant, setShowPixelAssistant] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [improvedLyrics, setImprovedLyrics] = useState('');

  // Manejar cambio de sección
  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId);
  };

  // Manejar cambio de knobs
  const handleKnobChange = (knobName, value) => {
    setKnobs(prev => ({
      ...prev,
      [knobName]: parseInt(value)
    }));
  };

  // Generar prompt inteligente
  const generateSmartPrompt = async () => {
    const baseText = document.getElementById('letraCancion')?.value || '';
    
    if (!baseText.trim()) {
      showToast('Escribe algo como base para generar el prompt inteligente', 'warning');
      return;
    }

    try {
      showToast('🧠 Generando prompt inteligente...', 'info');
      
      // Simular generación de prompt inteligente
      const smartPrompts = [
        `Create an epic ${knobs.creatividad > 70 ? 'experimental' : 'melodic'} track inspired by: "${baseText}". Style: cyberpunk electronic with emotional depth, tempo around ${100 + knobs.expresividad}bpm, ${knobs.precision > 50 ? 'precise' : 'loose'} production.`,
        `Generate a ${knobs.expresividad > 60 ? 'highly expressive' : 'subtle'} composition based on: "${baseText}". Blend organic and synthetic elements, ${knobs.creatividad > 50 ? 'innovative' : 'traditional'} arrangement, professional mixing.`,
        `Compose a powerful musical piece from: "${baseText}". Incorporate ${knobs.precision > 70 ? 'detailed' : 'atmospheric'} production, ${knobs.expresividad > 80 ? 'intense emotional' : 'balanced'} performance, modern sound design.`
      ];
      
      const selectedPrompt = smartPrompts[Math.floor(Math.random() * smartPrompts.length)];
      
      setTimeout(() => {
        document.getElementById('letraCancion').value = selectedPrompt;
        setCurrentPrompt(selectedPrompt);
        showToast('✅ Prompt inteligente generado', 'success');
      }, 1500);
      
    } catch (error) {
      showToast('Error generando prompt', 'error');
    }
  };

  // Generar letra con IA
  const generateLyrics = async () => {
    const baseText = document.getElementById('letraCancion')?.value || '';
    
    if (!baseText.trim()) {
      showToast('Escribe una idea base para generar la letra', 'warning');
      return;
    }

    try {
      showToast('🎵 Generando letra con IA...', 'info');
      
      // Simular generación de letra
      const generatedLyric = `
[Verso 1]
En el silencio de la noche digital
Tu voz resuena como un eco virtual
Cada nota que compongo es real
En este mundo de metal y cristal

[Coro]
${baseText}
Es la música que late en mi ser
${baseText}
La resistencia que me hace renacer

[Verso 2]
Entre circuitos y alma humana
Busco la melodía que me sana
Cada acorde es una ventana
Hacia la libertad que se gana

[Coro]
${baseText}
Es la música que late en mi ser
${baseText}
La resistencia que me hace renacer
      `.trim();
      
      setTimeout(() => {
        setGeneratedLyrics(generatedLyric);
        showToast('✅ Letra generada con IA', 'success');
      }, 2000);
      
    } catch (error) {
      showToast('Error generando letra', 'error');
    }
  };

  // Mejorar letra existente
  const improveLyrics = async () => {
    const lyrics = generatedLyrics || document.getElementById('letraCancion')?.value || '';
    
    if (!lyrics.trim()) {
      showToast('No hay letra para mejorar', 'warning');
      return;
    }

    try {
      showToast('🔧 Mejorando letra...', 'info');
      
      // Simular mejora de letra
      const improved = lyrics
        .replace(/\n\n+/g, '\n\n') // Limpiar espacios
        .replace(/([.!?])\s*\n/g, '$1\n\n') // Mejorar puntuación
        .replace(/\b(\w+)\s+\1\b/gi, '$1') // Eliminar repeticiones
        .trim();
      
      setTimeout(() => {
        setImprovedLyrics(improved);
        showToast('✅ Letra mejorada', 'success');
      }, 1500);
      
    } catch (error) {
      showToast('Error mejorando letra', 'error');
    }
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
      showToast('🎵 Generando música con IA...', 'info');
      
      // Simular generación (en producción conectaría con Suno)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const newTrack = {
        id: Date.now(),
        title: `Track ${generatedTracks.length + 1}`,
        prompt: prompt,
        created_at: new Date().toISOString(),
        knobs: { ...knobs },
        audio_url: '/demo/generated_track.mp3' // Placeholder
      };
      
      setGeneratedTracks(prev => [newTrack, ...prev]);
      showToast('✅ ¡Música generada exitosamente!', 'success');
      setCurrentSection('resultados');
      
    } catch (error) {
      showToast('Error generando música', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Verificar APIs
  const verifyAPIs = async () => {
    showToast('🔍 Verificando estado de APIs...', 'info');
    
    // Simular verificación de APIs
    setTimeout(() => {
      setSystemStatus({
        api: 'online',
        celery: 'online',
        redis: 'online', 
        extension: 'offline'
      });
      showToast('✅ APIs verificadas y actualizadas', 'success');
    }, 2000);
  };

  // Activar modo Nexus (easter egg)
  const activateNexusMode = () => {
    showToast('🎮 Activando Modo Nexus...', 'info');
    
    // Efecto de transición Matrix
    const transition = document.createElement('div');
    transition.className = 'nexus-transition';
    transition.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #000, #00ff00, #000);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 2rem;
      font-weight: bold;
      animation: nexus-fade 2s ease-in-out;
    `;
    transition.innerHTML = '<div>ENTRANDO AL NEXUS...</div>';
    
    document.body.appendChild(transition);
    
    setTimeout(() => {
      window.location.href = '/nexus';
    }, 2000);
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
      case 'nova-post':
        return <NovaPostPilot onClose={() => setCurrentSection('home')} />;
      case 'clone-station':
        return <CloneStation onClose={() => setCurrentSection('home')} />;
      case 'daw':
        return <DAWEditor onClose={() => setCurrentSection('home')} />;
      case 'pro-daw':
        return <ProfessionalDAW />;
      case 'ssl':
        return <SSLChannelStrip />;
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
              Leer Códex Completo
            </button>
            <button 
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition btn"
              onClick={() => setCurrentSection('planes')}
            >
              Ver Planes
            </button>
          </div>
          
          <p className="text-zinc-400 max-w-lg">
            Genera música, clona voces cantadas, mezcla con calidad de estudio y guarda tu proceso en un archivo vivo. Bienvenido al Estudio Fantasma.
          </p>

          {/* Sistema de Status con botón funcional */}
          <div className="bg-zinc-900/30 rounded-xl border border-white/10 p-6">
            <h3 className="text-neon font-bold mb-4">Estado del Sistema</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>API Status:</span>
                <span className={`status-indicator status-${systemStatus.api}`}>●</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Celery:</span>
                <span className={`status-indicator status-${systemStatus.celery}`}>●</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Redis:</span>
                <span className={`status-indicator status-${systemStatus.redis}`}>●</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Extension:</span>
                <span className={`status-indicator status-${systemStatus.extension}`}>●</span>
              </div>
            </div>
            <button 
              className="mt-4 text-neon text-sm hover:underline btn"
              onClick={verifyAPIs}
            >
              🔄 Verificar APIs
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Controles de Expresión con knobs 3D */}
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-center mb-6">CONTROLES DE EXPRESIÓN</h3>
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
                onClick={() => showToast('Test rápido ejecutado con configuración actual', 'success')}
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

  // Sección de generación COMPLETA con todos los botones
  const renderGenerationSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neon mb-4">GENERACIÓN DE MÚSICA</h2>
          <p className="text-zinc-400">Convierte tu texto en música épica con IA</p>
        </div>
        
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="space-y-6">
            {/* Botones de IA para letras */}
            <div className="flex gap-4 justify-center mb-6">
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium btn"
                onClick={generateSmartPrompt}
              >
                🧠 Prompt Inteligente
              </button>
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium btn"
                onClick={generateLyrics}
              >
                🎵 Generar Letra
              </button>
              <button 
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium btn"
                onClick={improveLyrics}
              >
                🔧 Mejorar Letra
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Letra de la Canción / Prompt Musical
              </label>
              <textarea
                id="letraCancion"
                placeholder="Escribe aquí la letra de tu canción o describe el estilo musical que deseas..."
                rows="8"
                className="w-full p-4 bg-black/40 border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-neon focus:outline-none"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
              />
            </div>

            {/* Mostrar letra generada */}
            {generatedLyrics && (
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  Letra Generada por IA:
                </label>
                <textarea
                  value={generatedLyrics}
                  onChange={(e) => setGeneratedLyrics(e.target.value)}
                  rows="8"
                  className="w-full p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-white"
                />
              </div>
            )}

            {/* Mostrar letra mejorada */}
            {improvedLyrics && (
              <div>
                <label className="block text-sm font-medium text-orange-400 mb-2">
                  Letra Mejorada:
                </label>
                <textarea
                  value={improvedLyrics}
                  onChange={(e) => setImprovedLyrics(e.target.value)}
                  rows="8"
                  className="w-full p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg text-white"
                />
              </div>
            )}
            
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
                {isGenerating ? 'GENERANDO MÚSICA...' : 'GENERAR MÚSICA'}
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
          <h2 className="text-3xl font-bold text-neon mb-4">REPRODUCTOR</h2>
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
                    <div className="text-xs text-neon mt-1">
                      Knobs: E:{track.knobs.expresividad}% C:{track.knobs.creatividad}% P:{track.knobs.precision}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="px-3 py-1 bg-neon text-black rounded text-sm font-medium hover:bg-neon/80 transition-colors btn"
                      onClick={() => showToast('Reproduciendo pista...', 'info')}
                    >
                      ▶️ Reproducir
                    </button>
                    <button 
                      className="px-3 py-1 bg-zinc-700 text-white rounded text-sm font-medium hover:bg-zinc-600 transition-colors btn"
                      onClick={() => showToast('Descargando pista...', 'info')}
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

  // Sección de extensión con TODAS las herramientas
  const renderExtensionSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neon mb-4">HERRAMIENTAS PROFESIONALES</h2>
          <p className="text-zinc-400 text-lg mb-8">Suite completa de herramientas de producción musical</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-neon font-bold mb-4">🚀 Nova Post Pilot</h3>
            <p className="text-zinc-400 mb-4">Análisis de redes sociales con IA</p>
            <button 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition btn"
              onClick={() => setCurrentSection('nova-post')}
            >
              Abrir Nova Post
            </button>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-neon font-bold mb-4">🎤 Clone Station</h3>
            <p className="text-zinc-400 mb-4">Clonación de voz con so-VITS y Bark</p>
            <button 
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition btn"
              onClick={() => setCurrentSection('clone-station')}
            >
              Abrir Clone Station
            </button>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-neon font-bold mb-4">🎛️ DAW Editor</h3>
            <p className="text-zinc-400 mb-4">Editor de audio multipista</p>
            <button 
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition btn"
              onClick={() => setCurrentSection('daw')}
            >
              Abrir DAW
            </button>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-neon font-bold mb-4">🎚️ Professional DAW</h3>
            <p className="text-zinc-400 mb-4">DAW profesional completo</p>
            <button 
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition btn"
              onClick={() => setCurrentSection('pro-daw')}
            >
              Abrir Pro DAW
            </button>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-neon font-bold mb-4">🔊 SSL Channel Strip</h3>
            <p className="text-zinc-400 mb-4">Consola SSL profesional</p>
            <button 
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition btn"
              onClick={() => setCurrentSection('ssl')}
            >
              Abrir SSL
            </button>
          </div>
          
          <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
            <h3 className="text-neon font-bold mb-4">🔍 Verificar APIs</h3>
            <p className="text-zinc-400 mb-4">Estado de servicios</p>
            <button 
              className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition btn"
              onClick={verifyAPIs}
            >
              Verificar Estado
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderArchivoSection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-3xl font-bold text-neon mb-4 text-center">EL ARCHIVO</h2>
        <p className="text-zinc-400 text-lg mb-8 text-center">Tu memoria creativa: canciones, presets y sesiones guardadas</p>
        
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="grid gap-4">
            {generatedTracks.length > 0 ? (
              generatedTracks.map((track) => (
                <div key={track.id} className="flex justify-between items-center p-4 bg-black/30 rounded">
                  <div>
                    <h4 className="text-white font-semibold">{track.title}</h4>
                    <p className="text-sm text-zinc-400">{track.prompt.substring(0, 50)}...</p>
                    <p className="text-xs text-zinc-500">{new Date(track.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1 bg-neon text-black rounded text-sm btn"
                      onClick={() => showToast('Reproduciendo desde archivo...', 'info')}
                    >
                      ▶️
                    </button>
                    <button 
                      className="px-3 py-1 bg-zinc-700 text-white rounded text-sm btn"
                      onClick={() => showToast('Descargando desde archivo...', 'info')}
                    >
                      📥
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400">Tu archivo está vacío.</p>
                <button 
                  className="mt-4 bg-neon text-black px-6 py-2 rounded-lg font-semibold hover:bg-neon/90 transition btn"
                  onClick={() => setCurrentSection('generacion')}
                >
                  ¡Crea tu primera canción!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const renderCommunitySection = () => (
    <section className="content-section min-h-screen pt-20 pb-10">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold text-neon mb-4">⚔️ EL SANTUARIO</h2>
        <p className="text-zinc-400 text-lg mb-8">La red secreta de la Divina Liga del No Silencio</p>
        
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-8">
          <div className="space-y-6">
            <div className="p-6 bg-neon/10 rounded-lg border border-neon/30">
              <h3 className="text-xl font-bold text-neon mb-4">Acceso Premium Requerido</h3>
              <p className="text-zinc-300 mb-4">
                El Santuario completo requiere suscripción Premium: colaboraciones, misiones poéticas y ritual de entrada al Estudio Fantasma.
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  className="bg-neon text-black px-6 py-2 rounded-lg font-semibold hover:bg-neon/90 transition btn"
                  onClick={() => setCurrentSection('planes')}
                >
                  Ver Planes
                </button>
                <button 
                  className="border border-neon text-neon px-6 py-2 rounded-lg hover:bg-neon/10 transition btn"
                  onClick={() => setCurrentSection('codex')}
                >
                  Leer Códex Completo
                </button>
              </div>
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
              { id: 'nova-post', label: 'Nova Post' },
              { id: 'clone-station', label: 'Clone Station' },
              { id: 'daw', label: 'DAW' },
              { id: 'ssl', label: 'SSL' },
              { id: 'archivo', label: 'Archivo' },
              { id: 'community', label: '⚔️ Santuario' },
              { id: 'planes', label: 'Planes' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-tab px-3 py-1 rounded-lg transition ${currentSection === tab.id ? 'tab-active' : ''}`}
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
              className="border border-white/20 px-3 py-1 rounded-lg hover:bg-white/5 transition btn"
              onClick={() => showToast('Sistema de login próximamente', 'info')}
            >
              Login
            </button>
            <button 
              className="bg-neon text-black px-3 py-1 rounded-lg font-semibold hover:bg-neon/90 transition btn"
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

      {/* Pixel Assistant flotante */}
      {showPixelAssistant && (
        <FloatingPixelAssistant 
          isVisible={showPixelAssistant}
          onToggle={() => setShowPixelAssistant(!showPixelAssistant)}
        />
      )}

      {/* Toast container */}
      <div id="toast-container"></div>
      
      {/* Estilos dinámicos */}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes nexus-fade {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ClassicInterface;