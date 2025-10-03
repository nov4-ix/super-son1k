import React, { useState } from 'react';
import EnhancedDashboard from './EnhancedDashboard';
import AILyricsEditor from './AILyricsEditor';
import AICoverGenerator from './AICoverGenerator';
import NotificationSystem from './NotificationSystem';
import LiveChat from './LiveChat';
import { ThemeProvider, ThemeToggle, ThemeCustomizer } from './ThemeSystem';
import { ParticleBackground, FloatingNotes } from './ParticleEffects';
import { AudioMixer, BeatSequencer, PianoRoll, SampleLibrary } from './AudioWorkstation';
import './EnhancedStudio.css';

const EnhancedStudio = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const views = {
    dashboard: { component: <EnhancedDashboard />, icon: '📊', label: 'Dashboard' },
    lyrics: { component: <AILyricsEditor />, icon: '✍️', label: 'Letras IA' },
    covers: { component: <AICoverGenerator />, icon: '🎨', label: 'Covers IA' },
    mixer: { component: <AudioMixer />, icon: '🎛️', label: 'Mixer' },
    sequencer: { component: <BeatSequencer />, icon: '🥁', label: 'Beats' },
    piano: { component: <PianoRoll />, icon: '🎹', label: 'Piano' },
    samples: { component: <SampleLibrary />, icon: '📚', label: 'Samples' }
  };

  return (
    <ThemeProvider>
      <div className="enhanced-studio">
        {/* Efectos de fondo */}
        <ParticleBackground density={30} />
        <FloatingNotes />

        {/* Controles globales */}
        <ThemeToggle />
        <ThemeCustomizer />
        <NotificationSystem />
        <LiveChat />

        {/* Navegación */}
        <nav className="studio-nav">
          <div className="nav-brand">
            <h1>🎵 Son1kVers3 Studio</h1>
            <span className="version">v2.0 Enhanced</span>
          </div>
          <div className="nav-menu">
            {Object.entries(views).map(([key, view]) => (
              <button
                key={key}
                className={`nav-item ${activeView === key ? 'active' : ''}`}
                onClick={() => setActiveView(key)}
              >
                <span className="nav-icon">{view.icon}</span>
                <span className="nav-label">{view.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido principal */}
        <main className="studio-content">
          {views[activeView].component}
        </main>

        {/* Footer */}
        <footer className="studio-footer">
          <div className="footer-content">
            <span>© 2025 Son1kVers3 Enhanced - Powered by AI</span>
            <div className="footer-links">
              <a href="#docs">Docs</a>
              <a href="#api">API</a>
              <a href="#support">Soporte</a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default EnhancedStudio;
