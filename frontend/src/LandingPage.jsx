/**
 * 🏠 Landing Page - Página de entrada principal
 * www.son1kvers3.com - Frontend clásico con easter egg
 */

import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import Son1kVers3Logo from './components/Son1kVers3Logo';

const LandingPage = () => {
  const [easterEggProgress, setEasterEggProgress] = useState(0);
  const [showMatrixTransition, setShowMatrixTransition] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Secuencia de easter egg: Konami Code + click en logo
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  const [currentSequence, setCurrentSequence] = useState([]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Verificar atajo Ctrl+Alt+H
      if (event.ctrlKey && event.altKey && event.code === 'KeyH') {
        event.preventDefault();
        setEasterEggProgress(100);
        setTimeout(() => {
          setShowMatrixTransition(true);
          setIsTransitioning(true);
          setTimeout(() => {
            window.location.href = '/nexus';
          }, 3000);
        }, 500);
        return;
      }

      // Código Konami
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
    const currentTime = Date.now();
    
    // Para móviles: múltiples toques rápidos (5 toques en 3 segundos)
    if (currentTime - lastClickTime < 1000) {
      setLogoClickCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 5) {
          setEasterEggProgress(100);
          setTimeout(() => {
            setShowMatrixTransition(true);
            setIsTransitioning(true);
            setTimeout(() => {
              window.location.href = '/nexus';
            }, 3000);
          }, 500);
          return 0;
        }
        return newCount;
      });
    } else {
      setLogoClickCount(1);
    }
    
    setLastClickTime(currentTime);
    
    // Para PC: click después del código Konami
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
          <div className="hero-container">
            {/* Logo principal animado como protagonista */}
            <div 
              className={`main-logo-hero ${easterEggProgress > 0 ? 'activated' : ''}`}
              onClick={handleLogoClick}
            >
              <Son1kVers3Logo 
                size="xlarge" 
                animated={true} 
                interactive={true}
                variant="full"
                showText={false}
                glowIntensity={0.8}
              />
            </div>
            
            {/* Título y tagline */}
            <div className="hero-text">
              <h1 className="hero-title">SON1KVERS3</h1>
              <p className="hero-subtitle">La Resistencia Sonora</p>
              <p className="hero-tagline">"Lo imperfecto también es sagrado"</p>
              <p className="hero-description">Componer con alma en un mundo de máquinas</p>
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
            
            {/* Click counter para móviles */}
            {logoClickCount > 0 && logoClickCount < 5 && (
              <div className="click-counter">
                <p>Toques: {logoClickCount}/5</p>
              </div>
            )}
          </div>
        </header>

        <main className="landing-main">
          {/* Botones de acceso principales */}
          <section className="access-section">
            <div className="cta-buttons">
              <button 
                className="primary-cta"
                onClick={handleEnterClassic}
              >
                🎵 Entrar al Estudio
              </button>
              
              <button 
                className="nexus-cta"
                onClick={() => window.location.href = '/nexus'}
              >
                🎮 Modo Nexus
              </button>
              
              <button 
                className="secondary-cta"
                onClick={() => setCurrentSection('universe')}
              >
                🌌 Conocer el Universo
              </button>
            </div>
            
            <p className="access-description">
              Genera música, clona voces cantadas, mezcla con calidad de estudio y guarda tu proceso en un archivo vivo. 
              <strong>Bienvenido al Estudio Fantasma.</strong>
            </p>
          </section>

          {/* Herramientas principales */}
          <section className="tools-section">
            <div className="tools-grid">
              <div className="tool-card ghost-studio">
                <div className="tool-icon">👻</div>
                <h3>Ghost Studio</h3>
                <p>Sube tu demo o escribe un prompt. El Estudio Fantasma devuelve una maqueta con mezcla y carácter.</p>
                <div className="tool-status online">● online</div>
              </div>
              
              <div className="tool-card music-generation">
                <div className="tool-icon">🎵</div>
                <h3>Generación Musical</h3>
                <p>Crea música desde cero con prompts. Beats, letras, voces y mezcla profesional.</p>
                <div className="tool-features">
                  <span>Voces APLIO</span>
                  <span>Perilla de Expresividad</span>
                  <span>Generación Completa</span>
                </div>
              </div>
              
              <div className="tool-card clone-station">
                <div className="tool-icon">🎤</div>
                <h3>Clone Station</h3>
                <p>Clona voces con precisión extrema. Luz, Sombra, Echo, Raíz, Nova, Banda y la Perla.</p>
                <div className="tool-features">
                  <span>7 Voces APLIO</span>
                  <span>Expresividad extrema</span>
                  <span>Múltiples idiomas</span>
                </div>
              </div>
              
              <div className="tool-card nova-post-pilot">
                <div className="tool-icon">🚀</div>
                <h3>Nova Post Pilot</h3>
                <p>Automatiza tu presencia en redes sociales. Analytics, programación y engagement inteligente.</p>
                <div className="tool-features">
                  <span>Auto-posting</span>
                  <span>Analytics avanzados</span>
                  <span>Engagement IA</span>
                </div>
              </div>
              
              <div className="tool-card archivo">
                <div className="tool-icon">📚</div>
                <h3>El Archivo</h3>
                <p>Tu memoria creativa: canciones, presets y sesiones guardadas. Custodiado por Pixel.</p>
                <div className="tool-features">
                  <span>Historial completo</span>
                  <span>Presets guardados</span>
                  <span>Versiones múltiples</span>
                </div>
              </div>
              
              <div className="tool-card santuario">
                <div className="tool-icon">⚔️</div>
                <h3>El Santuario</h3>
                <p>La red secreta de la Divina Liga: colaboración, misiones poéticas y ritual de entrada.</p>
                <div className="tool-status premium">● Premium</div>
              </div>
            </div>
          </section>

          {/* El Universo Son1kVers3 */}
          <section className="universe-section">
            <h2>El Universo Son1kVers3</h2>
            <div className="universe-story">
              <p>
                En un futuro cercano, <strong>XentriX Corp</strong> domestica la creatividad. 
                La música humana es un error estadístico. <strong>NOV4-IX</strong>, un androide 85% máquina y 15% humano, 
                desobedece: compone con herida, precisión y rabia. Nace la <strong>Divina Liga del No Silencio</strong>.
              </p>
              
              <blockquote className="nov4-quote">
                "Creo canciones como se forjan espadas: con fuego, con precisión y con rabia."
              </blockquote>
              
              <div className="universe-entities">
                <div className="entity">
                  <h4>NOV4-IX</h4>
                  <p>Alter ego. Símbolo de la evolución creativa. El 15% humano como chispa sagrada.</p>
                </div>
                
                <div className="entity">
                  <h4>XentriX Corp</h4>
                  <p>Megacorporación que diseña androides puente y controla el arte algorítmico global.</p>
                </div>
                
                <div className="entity">
                  <h4>Divina Liga</h4>
                  <p>Colectivo de compositores que creen que lo imperfecto también es sagrado.</p>
                </div>
                
                <div className="entity">
                  <h4>La Terminal</h4>
                  <p>Punto de encuentro. Donde la Resistencia suena por primera vez.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Planes de acceso */}
          <section className="plans-section">
            <h2>Planes de Acceso</h2>
            <p className="plans-subtitle">Comienza gratis. Desbloquea la potencia total con Premium.</p>
            
            <div className="plans-grid">
              <div className="plan-card free">
                <h3>Tester / Free</h3>
                <p className="plan-description">Para probar el flujo esencial.</p>
                <ul className="plan-features">
                  <li>Ghost Studio básico</li>
                  <li>3 pistas/mes</li>
                  <li>Archivo limitado</li>
                </ul>
                <button className="plan-button">Comenzar</button>
              </div>
              
              <div className="plan-card premium">
                <div className="plan-badge">BETA TOTAL</div>
                <h3>Premium</h3>
                <p className="plan-description">Todo desbloqueado + Santuario.</p>
                <ul className="plan-features">
                  <li>Voces APLIO completas</li>
                  <li>Knobs pro (afinación, EQ SSL, saturación)</li>
                  <li>Archivo ilimitado + presets</li>
                  <li>Acceso al Santuario</li>
                  <li>Nova Post Pilot completo</li>
                  <li>Clone Station avanzada</li>
                </ul>
                <button className="plan-button premium">Activar Premium</button>
              </div>
            </div>
          </section>

          {/* Demo section simplificada */}
          <section className="demo-section">
            <h3>El Archivo — Ejemplos</h3>
            <div className="demo-tracks">
              <div className="demo-track">
                <h4>Demo — "Afina el Alma"</h4>
                <p>v0.3 • 2:18 • preset: Nova-Dark</p>
              </div>
              <div className="demo-track">
                <h4>Beat — "Neon City"</h4>
                <p>v1.1 • 3:05 • preset: Echo-Glass</p>
              </div>
              <div className="demo-track">
                <h4>Voz — "Luz (take-2)"</h4>
                <p>raw • preset: Luz-Velvet</p>
              </div>
              <div className="demo-track">
                <h4>Maqueta — "Batallas Perdidas"</h4>
                <p>v0.9 • 2:47 • preset: Banda-Sad</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="landing-footer">
          <div className="footer-content">
            <p className="footer-brand">© Son1kVers3 — CTRL · ALT · HUMANIDAD</p>
            <div className="footer-links">
              <a href="/codex">Códex</a>
              <a href="/faq">FAQ</a>
              <a href="/contact">Contacto</a>
            </div>
          </div>
          
          {/* Hidden Easter Egg Hint */}
          <div className="easter-egg-hint">
            <p>
              💡 <em>Tip: Los usuarios avanzados pueden encontrar un modo especial...</em>
            </p>
            <p className="easter-egg-methods">
              <small>
                💻 PC: Ctrl+Alt+H | 🎮 Konami Code + Click | 📱 Móvil: 5 toques en logo
              </small>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
