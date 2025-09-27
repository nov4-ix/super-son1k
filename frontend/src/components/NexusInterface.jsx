/**
 * 🎮 Nexus Interface - Interfaz Inmersiva Cyberpunk
 * Componente principal de la interfaz Nexus con efectos Matrix y cyberpunk
 */

import React, { useState, useEffect, useRef } from 'react';
import './NexusInterface.css';

const NexusInterface = () => {
    const [isActive, setIsActive] = useState(false);
    const [currentMode, setCurrentMode] = useState('music');
    const [matrixEffect, setMatrixEffect] = useState(true);
    const [cyberpunkMode, setCyberpunkMode] = useState(true);
    const [easterEggs, setEasterEggs] = useState([]);
    const [immersiveLevel, setImmersiveLevel] = useState(1);
    
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (matrixEffect) {
            initMatrixEffect();
        }
        
        if (cyberpunkMode) {
            initCyberpunkEffects();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [matrixEffect, cyberpunkMode]);

    const initMatrixEffect = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");

        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    const initCyberpunkEffects = () => {
        // Efectos de partículas cyberpunk
        const particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        const animateParticles = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animateParticles);
        };

        animateParticles();
    };

    const activateNexus = () => {
        setIsActive(true);
        setImmersiveLevel(prev => Math.min(prev + 1, 5));
        
        // Efectos de activación
        playActivationSound();
        showActivationEffect();
        
        // Easter egg: Konami Code
        checkKonamiCode();
    };

    const playActivationSound = () => {
        if (audioContextRef.current) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Audio context not available:', error);
        }
    };

    const showActivationEffect = () => {
        // Efecto visual de activación
        const effect = document.createElement('div');
        effect.className = 'nexus-activation-effect';
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border: 2px solid #00ff00;
            border-radius: 50%;
            animation: nexus-pulse 1s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    };

    const checkKonamiCode = () => {
        // Implementar detección del código Konami
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let userInput = [];
        
        const handleKeyDown = (e) => {
            userInput.push(e.keyCode);
            if (userInput.length > konamiCode.length) {
                userInput.shift();
            }
            
            if (userInput.join(',') === konamiCode.join(',')) {
                activateEasterEgg('konami');
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
    };

    const activateEasterEgg = (type) => {
        const easterEggs = {
            konami: {
                message: '🎮 KONAMI CODE ACTIVATED! Nexus Mode: ULTRA',
                effect: 'ultra-cyberpunk',
                duration: 10000
            },
            matrix: {
                message: '🔮 Matrix Mode: ACTIVATED',
                effect: 'matrix-rain',
                duration: 5000
            },
            cyberpunk: {
                message: '⚡ Cyberpunk Mode: MAXIMUM OVERDRIVE',
                effect: 'neon-glow',
                duration: 8000
            }
        };
        
        const easterEgg = easterEggs[type];
        if (easterEgg) {
            setEasterEggs(prev => [...prev, easterEgg]);
            
            // Aplicar efecto visual
            applyEasterEggEffect(easterEgg.effect);
            
            // Remover después de la duración
            setTimeout(() => {
                setEasterEggs(prev => prev.filter(egg => egg !== easterEgg));
            }, easterEgg.duration);
        }
    };

    const applyEasterEggEffect = (effectType) => {
        const body = document.body;
        
        switch (effectType) {
            case 'ultra-cyberpunk':
                body.style.filter = 'hue-rotate(180deg) saturate(2)';
                body.style.animation = 'ultra-cyberpunk-pulse 0.5s infinite alternate';
                break;
            case 'matrix-rain':
                body.style.filter = 'sepia(1) hue-rotate(90deg)';
                break;
            case 'neon-glow':
                body.style.filter = 'brightness(1.2) contrast(1.1)';
                body.style.boxShadow = 'inset 0 0 100px #00ffff';
                break;
        }
    };

    const switchMode = (mode) => {
        setCurrentMode(mode);
        
        // Efectos de transición
        const transition = document.createElement('div');
        transition.className = 'nexus-mode-transition';
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #000, #00ff00, #000);
            opacity: 0;
            animation: nexus-transition 0.5s ease-in-out;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(transition);
        
        setTimeout(() => {
            document.body.removeChild(transition);
        }, 500);
    };

    const toggleMatrixEffect = () => {
        setMatrixEffect(!matrixEffect);
    };

    const toggleCyberpunkMode = () => {
        setCyberpunkMode(!cyberpunkMode);
    };

    const increaseImmersiveLevel = () => {
        if (immersiveLevel < 5) {
            setImmersiveLevel(prev => prev + 1);
            activateEasterEgg('cyberpunk');
        }
    };

    return (
        <div className={`nexus-interface ${isActive ? 'active' : ''} level-${immersiveLevel}`}>
            {/* Canvas para efectos Matrix */}
            <canvas
                ref={canvasRef}
                className="nexus-matrix-canvas"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1,
                    opacity: matrixEffect ? 0.1 : 0
                }}
            />
            
            {/* Efectos de partículas cyberpunk */}
            {cyberpunkMode && (
                <div className="cyberpunk-particles">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="cyberpunk-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>
            )}
            
            {/* Interfaz principal */}
            <div className="nexus-main-interface">
                {/* Header con controles */}
                <header className="nexus-header">
                    <div className="nexus-logo">
                        <h1>NEXUS</h1>
                        <span className="nexus-version">v2.0</span>
                    </div>
                    
                    <div className="nexus-controls">
                        <button
                            className={`nexus-control-btn ${matrixEffect ? 'active' : ''}`}
                            onClick={toggleMatrixEffect}
                            title="Toggle Matrix Effect"
                        >
                            🔮
                        </button>
                        
                        <button
                            className={`nexus-control-btn ${cyberpunkMode ? 'active' : ''}`}
                            onClick={toggleCyberpunkMode}
                            title="Toggle Cyberpunk Mode"
                        >
                            ⚡
                        </button>
                        
                        <button
                            className="nexus-control-btn"
                            onClick={increaseImmersiveLevel}
                            title="Increase Immersive Level"
                        >
                            🚀
                        </button>
                    </div>
                </header>
                
                {/* Navegación de modos */}
                <nav className="nexus-mode-nav">
                    {['music', 'voice', 'analytics', 'social', 'ghost'].map(mode => (
                        <button
                            key={mode}
                            className={`nexus-mode-btn ${currentMode === mode ? 'active' : ''}`}
                            onClick={() => switchMode(mode)}
                        >
                            {mode.toUpperCase()}
                        </button>
                    ))}
                </nav>
                
                {/* Contenido principal */}
                <main className="nexus-main-content">
                    {currentMode === 'music' && (
                        <div className="nexus-music-interface">
                            <h2>🎵 Music Generation Nexus</h2>
                            <div className="nexus-music-controls">
                                <button className="nexus-btn primary">Generate Track</button>
                                <button className="nexus-btn secondary">Load Sample</button>
                                <button className="nexus-btn accent">Export Audio</button>
                            </div>
                        </div>
                    )}
                    
                    {currentMode === 'voice' && (
                        <div className="nexus-voice-interface">
                            <h2>🎤 Voice Cloning Nexus</h2>
                            <div className="nexus-voice-controls">
                                <button className="nexus-btn primary">Clone Voice</button>
                                <button className="nexus-btn secondary">Upload Sample</button>
                                <button className="nexus-btn accent">Generate Speech</button>
                            </div>
                        </div>
                    )}
                    
                    {currentMode === 'analytics' && (
                        <div className="nexus-analytics-interface">
                            <h2>📊 Analytics Nexus</h2>
                            <div className="nexus-analytics-controls">
                                <button className="nexus-btn primary">View Metrics</button>
                                <button className="nexus-btn secondary">Export Data</button>
                                <button className="nexus-btn accent">Real-time Monitor</button>
                            </div>
                        </div>
                    )}
                    
                    {currentMode === 'social' && (
                        <div className="nexus-social-interface">
                            <h2>🚀 Social Media Nexus</h2>
                            <div className="nexus-social-controls">
                                <button className="nexus-btn primary">Create Post</button>
                                <button className="nexus-btn secondary">Schedule Content</button>
                                <button className="nexus-btn accent">Analyze Trends</button>
                            </div>
                        </div>
                    )}
                    
                    {currentMode === 'ghost' && (
                        <div className="nexus-ghost-interface">
                            <h2>👻 Ghost Studio Nexus</h2>
                            <div className="nexus-ghost-controls">
                                <button className="nexus-btn primary">Analyze Audio</button>
                                <button className="nexus-btn secondary">Ghost Mode</button>
                                <button className="nexus-btn accent">Stealth Mode</button>
                            </div>
                        </div>
                    )}
                </main>
                
                {/* Footer con información del sistema */}
                <footer className="nexus-footer">
                    <div className="nexus-system-info">
                        <span>Immersive Level: {immersiveLevel}/5</span>
                        <span>Matrix: {matrixEffect ? 'ON' : 'OFF'}</span>
                        <span>Cyberpunk: {cyberpunkMode ? 'ON' : 'OFF'}</span>
                    </div>
                    
                    <div className="nexus-easter-eggs">
                        {easterEggs.map((egg, index) => (
                            <div key={index} className="nexus-easter-egg">
                                {egg.message}
                            </div>
                        ))}
                    </div>
                </footer>
            </div>
            
            {/* Botón de activación principal */}
            {!isActive && (
                <button
                    className="nexus-activation-btn"
                    onClick={activateNexus}
                >
                    ACTIVATE NEXUS
                </button>
            )}
        </div>
    );
};

export default NexusInterface;


