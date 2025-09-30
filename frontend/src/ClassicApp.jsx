/**
 * 🎵 Son1kVers3 Classic - Aplicación Clásica
 * Interfaz simple para usuarios que solo quieren usar herramientas específicas
 */

import React, { useState, useEffect } from 'react';
import './ClassicApp.css';

// Importar servicios
import WebAudioGenerator from './services/WebAudioGenerator';
import VoiceCloningService from './services/VoiceCloningService';
import AnalyticsService from './services/AnalyticsService';

// Importar componentes clásicos
import ClassicMusicGenerator from './components/ClassicMusicGenerator';
import ClassicVoiceCloner from './components/ClassicVoiceCloner';
import ClassicAnalytics from './components/ClassicAnalytics';
import ClassicHeader from './components/ClassicHeader';

function ClassicApp() {
  const [currentTool, setCurrentTool] = useState('music');
  const [services, setServices] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeServices();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  };

  const initializeServices = async () => {
    try {
      console.log('🚀 Inicializando Son1kVers3 Classic...');
      
      const webAudio = new WebAudioGenerator();
      const voiceCloning = new VoiceCloningService();
      const analytics = new AnalyticsService();

      setServices({
        webAudio,
        voiceCloning,
        analytics
      });

      setIsInitialized(true);
      console.log('✅ Son1kVers3 Classic inicializado correctamente');

    } catch (error) {
      console.error('❌ Error inicializando servicios:', error);
      setIsInitialized(true); // Inicializar con modo fallback
    }
  };

  const handleLogin = () => {
    // Implementar login simple
    const mockUser = {
      id: 'user_123',
      username: 'Usuario',
      tier: 'free'
    };
    setUser(mockUser);
    localStorage.setItem('auth_token', 'mock_token');
    localStorage.setItem('user_data', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'music':
        return <ClassicMusicGenerator services={services} />;
      case 'voice':
        return <ClassicVoiceCloner services={services} />;
      case 'analytics':
        return <ClassicAnalytics services={services} />;
      default:
        return <ClassicMusicGenerator services={services} />;
    }
  };

  if (!isInitialized) {
    return (
      <div className="classic-app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Inicializando Son1kVers3...</h2>
          <p>Preparando herramientas musicales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classic-app">
      <ClassicHeader 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="classic-main">
        <div className="classic-sidebar">
          <nav className="classic-nav">
            <h3>Herramientas</h3>
            {[
              { id: 'music', label: 'Generador de Música', icon: '🎵' },
              { id: 'voice', label: 'Clonador de Voz', icon: '🎤' },
              { id: 'analytics', label: 'Analytics', icon: '📊' }
            ].map(tool => (
              <button
                key={tool.id}
                className={`classic-nav-btn ${currentTool === tool.id ? 'active' : ''}`}
                onClick={() => setCurrentTool(tool.id)}
              >
                <span className="nav-icon">{tool.icon}</span>
                <span className="nav-label">{tool.label}</span>
              </button>
            ))}
          </nav>

          <div className="classic-mode-switcher">
            <p>¿Quieres la experiencia completa?</p>
            <button 
              className="nexus-mode-btn"
              onClick={() => window.location.href = '/nexus'}
            >
              🎮 Modo Nexus
            </button>
          </div>
        </div>

        <div className="classic-content">
          {renderCurrentTool()}
        </div>
      </main>

      <footer className="classic-footer">
        <p>Son1kVers3 Classic - Herramientas Musicales Simplificadas</p>
        <p>
          <a href="/nexus">🎮 Modo Nexus</a> | 
          <a href="/">🏠 Inicio</a> | 
          <a href="/docs">📚 Documentación</a>
        </p>
      </footer>
    </div>
  );
}

export default ClassicApp;
