/**
 * 🎵 Son1kVers3 Enhanced - VERSIÓN MEJORADA
 * Basada en https://son1kvers3-deploy-96bxy7ozx-son1kvers3s-projects.vercel.app
 * DAW mejor que BandLab + Nova Post Pilot + Clone Station funcionando
 */

import React, { useState, useEffect } from 'react';
import './App.css';

// Importar componentes principales
import ClassicInterface from './components/ClassicInterface';
import NexusInterface from './components/NexusInterface';
import LandingPage from './LandingPage';

// Importar herramientas profesionales
import ProfessionalDAW from './components/ProfessionalDAW';
import NovaPostPilot from './components/NovaPostPilot';
import CloneStation from './components/CloneStation';
import GhostStudio from './components/GhostStudio';
import TheCreator from './components/TheCreator';
import SSLChannelStrip from './components/SSLChannelStrip';
import SubscriptionPlans from './components/SubscriptionPlans';

// Importar nuevos componentes
import EnhancedDashboard from './components/EnhancedDashboard';
import AILyricsEditor from './components/AILyricsEditor';
import AICoverGenerator from './components/AICoverGenerator';
import NotificationSystem from './components/NotificationSystem';
import LiveChat from './components/LiveChat';
import { ThemeProvider, ThemeToggle, ThemeCustomizer } from './components/ThemeSystem';
import { ParticleBackground, FloatingNotes } from './components/ParticleEffects';
import { AudioMixer, BeatSequencer, PianoRoll, SampleLibrary } from './components/AudioWorkstation';

function App() {
  const [currentMode, setCurrentMode] = useState('classic'); // DIRECTO AL CLÁSICO
  const [currentTool, setCurrentTool] = useState('home');

  // Detectar herramienta desde URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentTool(hash);
    }
    
    const path = window.location.pathname;
    if (path === '/nexus') {
      setCurrentMode('nexus');
    } else if (path === '/landing') {
      setCurrentMode('landing');
    } else {
      setCurrentMode('classic'); // Por defecto clásico
    }
  }, []);

  // Renderizar herramienta según hash
  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'ghost':
        return <GhostStudio services={{}} />;
      case 'creator':
        return <TheCreator services={{}} />;
      case 'daw':
        return <ProfessionalDAW />;
      case 'nova':
        return <NovaPostPilot onClose={() => setCurrentTool('home')} />;
      case 'clone':
        return <CloneStation onClose={() => setCurrentTool('home')} />;
      case 'ssl':
        return <SSLChannelStrip />;
      case 'planes':
        return <SubscriptionPlans />;
      case 'nexus':
        return <NexusInterface />;
      // Nuevos componentes
      case 'dashboard':
        return <EnhancedDashboard />;
      case 'lyrics':
        return <AILyricsEditor />;
      case 'covers':
        return <AICoverGenerator />;
      case 'mixer':
        return <AudioMixer />;
      case 'sequencer':
        return <BeatSequencer />;
      case 'piano':
        return <PianoRoll />;
      case 'samples':
        return <SampleLibrary />;
      default:
        return <ClassicInterface />;
    }
  };

  // Renderizar según modo
  if (currentMode === 'nexus') {
    return <NexusInterface />;
  }
  
  if (currentMode === 'landing') {
    return <LandingPage />;
  }

  // Modo clásico con herramientas
  return (
    <ThemeProvider>
      <div className="app enhanced-version">
        {/* Efectos de fondo */}
        <ParticleBackground density={30} />
        <FloatingNotes />

        {/* Componentes flotantes globales */}
        <ThemeToggle />
        <ThemeCustomizer />
        <NotificationSystem />
        <LiveChat />

        {/* Header de navegación mejorado */}
        <header className="app-header-enhanced">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="app-title">SON1KVERS3</h1>
            <span className="app-subtitle">Enhanced</span>
          </div>
          
          <nav className="tools-nav">
            <button 
              className={`tool-btn ${currentTool === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentTool('home')}
            >
              🏠 Home
            </button>
            <button 
              className={`tool-btn ${currentTool === 'ghost' ? 'active' : ''}`}
              onClick={() => setCurrentTool('ghost')}
            >
              👻 Ghost Studio
            </button>
            <button 
              className={`tool-btn ${currentTool === 'creator' ? 'active' : ''}`}
              onClick={() => setCurrentTool('creator')}
            >
              🎵 The Creator
            </button>
            <button 
              className={`tool-btn ${currentTool === 'daw' ? 'active' : ''}`}
              onClick={() => setCurrentTool('daw')}
            >
              🎛️ Pro DAW
            </button>
            <button 
              className={`tool-btn ${currentTool === 'nova' ? 'active' : ''}`}
              onClick={() => setCurrentTool('nova')}
            >
              🚀 Nova Post
            </button>
            <button 
              className={`tool-btn ${currentTool === 'clone' ? 'active' : ''}`}
              onClick={() => setCurrentTool('clone')}
            >
              🎤 Clone Station
            </button>
            <button 
              className={`tool-btn ${currentTool === 'ssl' ? 'active' : ''}`}
              onClick={() => setCurrentTool('ssl')}
            >
              🔊 SSL
            </button>
            <button 
              className={`tool-btn ${currentTool === 'planes' ? 'active' : ''}`}
              onClick={() => setCurrentTool('planes')}
            >
              💳 Planes
            </button>
            <button 
              className={`tool-btn ${currentTool === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentTool('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`tool-btn ${currentTool === 'lyrics' ? 'active' : ''}`}
              onClick={() => setCurrentTool('lyrics')}
            >
              ✍️ Letras IA
            </button>
            <button 
              className={`tool-btn ${currentTool === 'covers' ? 'active' : ''}`}
              onClick={() => setCurrentTool('covers')}
            >
              🎨 Covers IA
            </button>
            <button 
              className={`tool-btn ${currentTool === 'mixer' ? 'active' : ''}`}
              onClick={() => setCurrentTool('mixer')}
            >
              🎛️ Mixer
            </button>
            <button 
              className={`tool-btn ${currentTool === 'sequencer' ? 'active' : ''}`}
              onClick={() => setCurrentTool('sequencer')}
            >
              🥁 Beats
            </button>
            <button 
              className={`tool-btn ${currentTool === 'piano' ? 'active' : ''}`}
              onClick={() => setCurrentTool('piano')}
            >
              🎹 Piano
            </button>
            <button 
              className={`tool-btn ${currentTool === 'samples' ? 'active' : ''}`}
              onClick={() => setCurrentTool('samples')}
            >
              📚 Samples
            </button>
            <button 
              className="tool-btn nexus-btn"
              onClick={() => window.location.href = '/nexus'}
            >
              🎮 Nexus
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="app-main-enhanced">
        {renderCurrentTool()}
      </main>

      {/* Estilos inline para navegación */}
      <style jsx>{`
        .app-header-enhanced {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid #00FFE7;
          z-index: 1000;
          padding: 15px 0;
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .app-title {
          color: #00FFE7;
          font-size: 1.8rem;
          font-weight: 900;
          margin: 0;
          text-shadow: 0 0 15px rgba(0, 255, 231, 0.5);
        }
        
        .app-subtitle {
          color: #888;
          font-size: 0.9rem;
        }
        
        .tools-nav {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .tool-btn {
          background: rgba(0, 255, 231, 0.1);
          border: 1px solid rgba(0, 255, 231, 0.3);
          color: #00FFE7;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .tool-btn:hover {
          background: rgba(0, 255, 231, 0.2);
          border-color: #00FFE7;
          transform: translateY(-2px);
        }
        
        .tool-btn.active {
          background: #00FFE7;
          color: #000;
        }
        
        .nexus-btn {
          background: linear-gradient(45deg, #8b5cf6, #00FFE7);
          color: #000;
          border: none;
        }
        
        .app-main-enhanced {
          margin-top: 80px;
          min-height: calc(100vh - 80px);
        }
      `}</style>
      </div>
    </ThemeProvider>
  );
}

export default App;