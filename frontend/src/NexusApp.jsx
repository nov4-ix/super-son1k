/**
 * 🎮 NexusApp - Modo Inmersivo Completo
 * Este es el modo cyberpunk completo con lore del codex
 * Interfaz inmersiva para usuarios que buscan sumergirse en la historia
 */

import React, { useState, useEffect } from 'react';
import './App.css';

// Importar servicios
import WebAudioGenerator from './services/WebAudioGenerator';
import OllamaAIService from './services/OllamaAIService';
import VoiceCloningService from './services/VoiceCloningService';
import NovaPostPilotService from './services/NovaPostPilotService';
import AnalyticsService from './services/AnalyticsService';

// Importar componentes del modo inmersivo
import NexusInterface from './components/NexusInterface';
import DAWEditor from './components/DAWEditor';
import FloatingPlayer from './components/FloatingPlayer';
import CommunityHub from './components/CommunityHub';
import ResistanceMessage from './components/ResistanceMessage';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import ALVAEBadge from './components/ALVAEBadge';
import FloatingPixelAssistant from './components/FloatingPixelAssistant';

// Importar componentes de interfaces intuitivas con estética vintage console
import IntuitiveMusicGenerator from './components/IntuitiveMusicGenerator';
import GhostStudioKnobs from './components/GhostStudioKnobs';
import GhostStudioComplete from './components/GhostStudioComplete';
import MusicStudioComplete from './components/MusicStudioComplete';
import IntuitiveVoiceCloner from './components/IntuitiveVoiceCloner';
import SSLChannelStrip from './components/SSLChannelStrip';
import VoiceEffectsRack from './components/VoiceEffectsRack';
import VocalProcessor from './components/VocalProcessor';
import GraphicEQ from './components/GraphicEQ';
import ProfessionalDAW from './components/ProfessionalDAW';
import AlbumArtGenerator from './components/AlbumArtGenerator';

const NexusApp = () => {
  const [currentView, setCurrentView] = useState('nexus');
  const [services, setServices] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showPixelAssistant, setShowPixelAssistant] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    webAudio: false,
    ollama: false,
    voiceCloning: false,
    novaPost: false,
    analytics: false,
    stealth: false
  });

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

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setCurrentView('nexus');
  };

  const initializeServices = async () => {
    try {
      console.log('🚀 Inicializando Son1kVers3 Nexus Mode...');
      
      // Inicializar servicios con modo fallback
      const webAudio = new WebAudioGenerator();
      const ollama = new OllamaAIService();
      const voiceCloning = new VoiceCloningService();
      const novaPost = new NovaPostPilotService();
      const analytics = new AnalyticsService();

      // Verificar estado de servicios (con timeout)
      const status = {
        webAudio: true, // Siempre disponible (Web Audio API)
        ollama: false, // Se verifica después
        voiceCloning: true, // Siempre disponible (modo fallback)
        novaPost: true, // Siempre disponible (modo fallback)
        analytics: true, // Siempre disponible (modo fallback)
        stealth: false // Se verifica por separado
      };

      setServices({
        webAudio,
        ollama,
        voiceCloning,
        novaPost,
        analytics
      });

      setSystemStatus(status);
      setIsInitialized(true);

      console.log('✅ Son1kVers3 Nexus Mode inicializado correctamente');
      console.log('📊 Estado de servicios:', status);

      // Verificar Ollama en segundo plano
      setTimeout(async () => {
        try {
          const ollamaStatus = await ollama.isServiceAvailable();
          setSystemStatus(prev => ({ ...prev, ollama: ollamaStatus }));
        } catch (error) {
          console.warn('Ollama no disponible, usando modo fallback');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Error inicializando servicios:', error);
      // Inicializar con modo fallback
      setIsInitialized(true);
    }
  };

  const handleViewChange = (view) => {
    if (view === 'admin' && user?.role !== 'admin') {
      alert('Acceso denegado. Solo administradores pueden acceder al dashboard.');
      return;
    }
    setCurrentView(view);
  };

  const handleAdminDashboard = () => {
    if (user?.role === 'admin') {
      setShowAdminDashboard(true);
    } else {
      alert('Acceso denegado. Solo administradores pueden acceder al dashboard.');
    }
  };

  const renderNexusMode = () => {
    switch (currentView) {
      case 'nexus':
        return <NexusInterface />;
      case 'daw':
        return <DAWEditor 
          onExport={(project) => {
            console.log('Exportando proyecto:', project);
            // Aquí se implementaría la exportación real
          }}
          onSave={(project) => {
            console.log('Guardando proyecto:', project);
            // Aquí se implementaría el guardado real
          }}
        />;
      case 'music':
        return <MusicStudioComplete services={services} />;
      case 'voice':
        return <IntuitiveVoiceCloner services={services} />;
      case 'analytics':
        return <AnalyticsInterface services={services} />;
      case 'social':
        return <SocialInterface services={services} />;
      case 'ghost':
        return <GhostStudioComplete services={services} />;
      case 'daw-pro':
        return <ProfessionalDAW services={services} />;
      case 'mastering':
        return <SSLChannelStrip />;
      case 'effects':
        return <VoiceEffectsRack />;
      case 'vocal-pro':
        return <VocalProcessor />;
      case 'eq':
        return <GraphicEQ />;
      case 'album-art':
        return <AlbumArtGenerator />;
      case 'community':
        return <CommunityHub />;
      case 'admin':
        return <AdminDashboard onClose={() => setCurrentView('nexus')} isAuthenticated={user?.role === 'admin'} />;
      default:
        return <NexusInterface />;
    }
  };

  // Solo mostrar loading si no está inicializado
  if (!isInitialized) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Inicializando Son1kVers3 Nexus...</h2>
          <p>Preparando interfaz cyberpunk...</p>
        </div>
      </div>
    );
  }

  // Modo Nexus con interfaz completa
  return (
    <div className="app">
      {/* Header con navegación */}
      <header className="app-header">
        <div className="app-logo">
          <img src="/logo.svg" alt="Son1kVers3" className="app-logo-img" />
          <div className="app-logo-text">
            <h1>Son1kVers3 Nexus</h1>
            <span className="app-version">v2.0 - Modo Inmersivo</span>
          </div>
        </div>

        {/* User info y controles de autenticación */}
        <div className="user-controls">
          {user ? (
            <div className="user-info">
              <div className="user-profile">
                <ALVAEBadge 
                  level={user.level === 'Silencioso' ? 10 : 
                         user.level === 'Susurro' ? 25 :
                         user.level === 'Eco' ? 50 :
                         user.level === 'Resonancia' ? 75 :
                         user.level === 'Armonía' ? 90 : 100}
                  size="small"
                  showLevel={false}
                  showName={false}
                />
                <span className="username">{user.username}</span>
                <span className="user-tier">{user.tier}</span>
              </div>
              <div className="user-actions">
                {user.role === 'admin' && (
                  <button 
                    className="admin-btn"
                    onClick={handleAdminDashboard}
                    title="Dashboard de Administración"
                  >
                    🛡️ Admin
                  </button>
                )}
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                >
                  🚪 Salir
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={() => setShowLogin(true)}
            >
              🔐 Iniciar Sesión
            </button>
          )}
        </div>
        
        <nav className="app-nav">
          {[
            { id: 'nexus', label: 'Nexus', icon: '🎮' },
            { id: 'music', label: 'Music Studio', icon: '🎵' },
            { id: 'voice', label: 'Voice Lab', icon: '🎤' },
            { id: 'ghost', label: 'Ghost Studio', icon: '👻' },
            { id: 'daw', label: 'DAW Editor', icon: '🎛️' },
            { id: 'daw-pro', label: 'Pro DAW', icon: '🎚️' },
            { id: 'mastering', label: 'Mastering', icon: '🔊' },
            { id: 'effects', label: 'Effects', icon: '🎭' },
            { id: 'vocal-pro', label: 'Vocal Pro', icon: '🎙️' },
            { id: 'eq', label: 'Graphic EQ', icon: '📊' },
            { id: 'album-art', label: 'Album Art', icon: '🎨' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'social', label: 'Social', icon: '🚀' },
            { id: 'community', label: 'Santuario', icon: '⚔️' }
          ].map(item => (
            <button
              key={item.id}
              className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleViewChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Indicador de estado de servicios */}
        <div className="service-status">
          {Object.entries(systemStatus).map(([service, status]) => (
            <div
              key={service}
              className={`status-indicator ${status ? 'online' : 'offline'}`}
              title={`${service}: ${status ? 'Online' : 'Offline'}`}
            />
          ))}
        </div>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        {renderNexusMode()}
        
        {/* Mensaje de resistencia en todas las vistas */}
        <ResistanceMessage />
      </main>

      {/* Reproductor flotante global */}
      <FloatingPlayer />

      {/* Pixel Assistant flotante */}
      {user && (
        <FloatingPixelAssistant 
          isVisible={showPixelAssistant}
          onToggle={() => setShowPixelAssistant(!showPixelAssistant)}
        />
      )}

      {/* Modales */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showAdminDashboard && (
        <AdminDashboard 
          onClose={() => setShowAdminDashboard(false)}
          isAuthenticated={user?.role === 'admin'}
        />
      )}

      {/* Footer con información del sistema */}
      <footer className="app-footer">
        <div className="footer-info">
          <p>Son1kVers3 Nexus v2.0 - Modo Inmersivo Cyberpunk</p>
          <p>Powered by Web Audio API, Ollama AI, so-VITS, Bark, and Nova Post Pilot</p>
        </div>
      </footer>
    </div>
  );
};

// Componentes de interfaz específicos para Nexus
const AnalyticsInterface = ({ services }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (services.analytics) {
      services.analytics.getAnalyticsData('7d').then(setAnalyticsData);
    }
  }, [services.analytics]);

  return (
    <div className="analytics-interface">
      <h2>📊 Analytics Dashboard</h2>
      {analyticsData ? (
        <div className="analytics-grid">
          <div className="metric-card">
            <h3>Followers</h3>
            <p className="metric-value">{analyticsData.followers.current}</p>
            <p className="metric-change">+{analyticsData.followers.growth}%</p>
          </div>
          <div className="metric-card">
            <h3>Engagement</h3>
            <p className="metric-value">{analyticsData.engagement.rate}%</p>
            <p className="metric-change">+8%</p>
          </div>
          <div className="metric-card">
            <h3>Reach</h3>
            <p className="metric-value">{analyticsData.reach.total}</p>
            <p className="metric-change">+12%</p>
          </div>
        </div>
      ) : (
        <p>Cargando datos de analytics...</p>
      )}
    </div>
  );
};

const SocialInterface = ({ services }) => {
  const [postContent, setPostContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishPost = async () => {
    if (!services.novaPost) return;
    
    setIsPublishing(true);
    try {
      const result = await services.novaPost.publishContent(
        postContent,
        'instagram',
        null,
        false
      );
      console.log('Post published:', result);
    } catch (error) {
      console.error('Error publishing post:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="social-interface">
      <h2>🚀 Social Media</h2>
      <div className="social-controls">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Escribe tu post aquí..."
          className="post-textarea"
        />
        <button
          className="publish-btn"
          onClick={handlePublishPost}
          disabled={isPublishing || !postContent}
        >
          {isPublishing ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </div>
  );
};

export default NexusApp;
