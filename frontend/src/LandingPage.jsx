/**
 * 🏠 Landing Page - Página de entrada principal
 * www.son1kvers3.com - Frontend clásico con easter egg
 */

import React, { useState, useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [easterEggProgress, setEasterEggProgress] = useState(0);
  const [showMatrixTransition, setShowMatrixTransition] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Secuencia de easter egg: Konami Code + click en logo
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  const [currentSequence, setCurrentSequence] = useState([]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      setCurrentSequence(prev => {
        const newSequence = [...prev, event.code];
        
        // Mantener solo los últimos 10 elementos
        if (newSequence.length > 10) {
          newSequence.shift();
        }
        
        // Verificar si coincide con el código Konami
        if (newSequence.length === 10) {
          const matches = newSequence.every((key, index) => key === konamiCode[index]);
          if (matches) {
            setEasterEggProgress(50); // 50% por el código Konami
            return [];
          }
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleLogoClick = () => {
    if (easterEggProgress === 50) {
      setEasterEggProgress(100);
      setTimeout(() => {
        setShowMatrixTransition(true);
        setIsTransitioning(true);
        
        // Después de 3 segundos, redirigir al modo inmersivo
        setTimeout(() => {
          window.location.href = '/nexus';
        }, 3000);
      }, 500);
    }
  };

  const handleEnterClassic = () => {
    window.location.href = '/classic';
  };

  return (
    <div className="landing-page">
      {/* Matrix Transition Effect */}
      {showMatrixTransition && (
        <div className="matrix-transition">
          <div className="matrix-rain">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="matrix-column">
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} className="matrix-char">
                    {Math.random() > 0.5 ? '0' : '1'}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="matrix-message">
            <h1>ENTRANDO AL NEXUS...</h1>
            <p>Bienvenido al modo inmersivo</p>
          </div>
        </div>
      )}

      {/* Main Landing Page */}
      <div className={`landing-content ${isTransitioning ? 'fading' : ''}`}>
        <header className="landing-header">
          <div className="logo-container">
            <div 
              className={`logo ${easterEggProgress > 0 ? 'activated' : ''}`}
              onClick={handleLogoClick}
            >
              <div className="logo-icon">🎵</div>
              <h1>Son1kVers3</h1>
              <p className="tagline">Herramientas Musicales con IA</p>
            </div>
            
            {/* Easter Egg Indicator */}
            {easterEggProgress > 0 && (
              <div className="easter-egg-indicator">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${easterEggProgress}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {easterEggProgress === 50 && "¡Código Konami detectado! Ahora haz clic en el logo..."}
                  {easterEggProgress === 100 && "¡Easter egg activado! Entrando al Nexus..."}
                </p>
              </div>
            )}
          </div>
        </header>

        <main className="landing-main">
          <section className="hero-section">
            <h2>Genera Música y Clona Voces con IA</h2>
            <p className="hero-description">
              Crea música original, clona voces y analiza contenido musical usando 
              inteligencia artificial avanzada. Herramientas profesionales al alcance de todos.
            </p>
            
            <div className="cta-buttons">
              <button 
                className="primary-cta"
                onClick={handleEnterClassic}
              >
                🎵 Comenzar Gratis
              </button>
              
              <button className="secondary-cta">
                📚 Ver Demo
              </button>
            </div>
          </section>

          <section className="features-section">
            <h3>¿Qué puedes hacer?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎵</div>
                <h4>Generar Música</h4>
                <p>Crea música original usando solo palabras. Describe el estilo y nosotros lo generamos.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎤</div>
                <h4>Clonar Voces</h4>
                <p>Convierte texto a voz usando cualquier voz de referencia. Múltiples idiomas soportados.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Analytics</h4>
                <p>Analiza el rendimiento de tu música y obtén insights sobre tu audiencia.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h4>IA Avanzada</h4>
                <p>Powered by Ollama, so-VITS, Bark y otros modelos de IA de última generación.</p>
              </div>
            </div>
          </section>

          <section className="demo-section">
            <h3>Prueba Ahora</h3>
            <div className="demo-player">
              <div className="demo-track">
                <div className="track-info">
                  <h4>Cyberpunk Dreams</h4>
                  <p>Generado con Son1kVers3</p>
                </div>
                <audio controls>
                  <source src="/demo/cyberpunk-dreams.mp3" type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            </div>
          </section>
        </main>

        <footer className="landing-footer">
          <div className="footer-content">
            <p>&copy; 2024 Son1kVers3. Todos los derechos reservados.</p>
            <div className="footer-links">
              <a href="/docs">Documentación</a>
              <a href="/support">Soporte</a>
              <a href="/privacy">Privacidad</a>
              <a href="/terms">Términos</a>
            </div>
          </div>
          
          {/* Hidden Easter Egg Hint */}
          <div className="easter-egg-hint">
            <p>
              💡 <em>Tip: Los usuarios avanzados pueden encontrar un modo especial...</em>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
