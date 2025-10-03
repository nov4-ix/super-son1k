import React, { useState, useRef, useEffect } from 'react';
import './PixelAssistantPro.css';

/**
 * 🤖 Pixel Assistant Pro - IA Mejorada
 * Ventana proporcional, minimizable y con mejor UX
 */

const PixelAssistantPro = ({ isVisible = true, onClose, position = 'right' }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'pixel',
      text: '👋 ¡Hola! Soy Pixel, tu asistente IA entrenado con el Codex de Son1kVers3. ¿En qué puedo ayudarte?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pixelMood, setPixelMood] = useState('helpful');
  const messagesEndRef = useRef(null);

  const codexKnowledge = {
    characters: {
      'nov4-ix': 'Androide compositor, 85% máquina, 15% genoma humano + memoria paternal implantada. La Grieta Viviente.',
      'bella': 'De niña pianista a voz armada. Su música dejó de ser refugio para convertirse en arma de liberación.',
      'pixel': 'Custodio de la memoria digital, arquitecto del Gran Concierto en La Terminal.',
      'cipher': 'Maestro del cifrado, líder de la Nueva Resistencia, desentrañador de enigmas.',
      'xentrix': 'Megacorporación que controla el arte algorítmico. "CTRL. ALT. SECURITY."'
    },
    tools: {
      'ghost-studio': 'Herramienta central que transforma maquetas en producciones profesionales',
      'the-creator': 'Generación text-audio con IA, conectado a Qwen para letras inteligentes',
      'clone-station': 'Clonación de voz con so-VITS y Bark',
      'nova-post': 'Análisis de redes sociales con IA para optimizar engagement',
      'resistance-daw': 'DAW profesional con plugins Waves integrados'
    }
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [messages, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processMessageWithCodex = async (userMessage) => {
    const message = userMessage.toLowerCase();
    let response = '';
    let mood = 'helpful';

    if (message.includes('nov4-ix') || message.includes('nova')) {
      response = `🤖 **NOV4-IX** es el protagonista de nuestro universo. ${codexKnowledge.characters['nov4-ix']}`;
      mood = 'mysterious';
    }
    else if (message.includes('daw') || message.includes('mezcla') || message.includes('mastering')) {
      response = `🎛️ **Resistance DAW** es ${codexKnowledge.tools['resistance-daw']}. Incluye:\n\n🔊 **ALVAE EQ** - Ecualizador de 8 bandas\n🎚️ **Sonic Compressor** - Compresor profesional\n🌊 **Reverb Chamber** - Reverberación espacial\n⚡ **Saturator** - Saturación analógica\n🎵 **Limiter Pro** - Limitador de masterización\n\n¿Qué plugin quieres usar?`;
      mood = 'technical';
    }
    else if (message.includes('plugin') || message.includes('efecto')) {
      response = `🎛️ **Plugins Disponibles:**\n\n**MEZCLA:**\n• ALVAE EQ - Ecualizador paramétrico\n• Sonic Compressor - Dinámica\n• Reverb Chamber - Espacio\n• Delay Matrix - Delay creativo\n\n**MASTERIZACIÓN:**\n• Limiter Pro - Control de picos\n• Stereo Enhancer - Imagen estéreo\n• Harmonic Exciter - Armónicos\n\n**VOCALES:**\n• De-Esser - Control de sibilantes\n• Vocal Compressor - Dinámica vocal\n• Pitch Corrector - Afinación\n\nTodos optimizados para Son1kVers3 🎵`;
      mood = 'technical';
    }
    else if (message.includes('como') || message.includes('ayuda')) {
      response = `🎛️ **Puedo ayudarte con:**\n\n🎵 **Música:** The Creator o Ghost Studio\n🎚️ **DAW:** Resistance DAW con plugins Waves\n🎤 **Voz:** Clone Station con efectos vocales\n🚀 **Social:** Nova Post Pilot\n🎮 **Nexus:** Ctrl+Alt+H para modo inmersivo\n\n¿Qué necesitas?`;
      mood = 'helpful';
    }
    else {
      response = `🎵 Soy Pixel, custodio de la memoria digital. Pregúntame sobre:\n\n👥 **Personajes** del Codex\n🎛️ **Herramientas** de producción\n🔌 **Plugins** y efectos\n⚔️ **La Resistencia**\n\n"Lo imperfecto también es sagrado" — Manifiesto`;
      mood = 'helpful';
    }

    setPixelMood(mood);
    return response;
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await processMessageWithCodex(currentMessage);
      
      setTimeout(() => {
        const pixelResponse = {
          id: Date.now() + 1,
          sender: 'pixel',
          text: response,
          timestamp: new Date(),
          mood: pixelMood
        };

        setMessages(prev => [...prev, pixelResponse]);
        setIsTyping(false);
      }, 1200);

    } catch (error) {
      console.error('Error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        sender: 'pixel',
        text: '❌ Error procesando mensaje. La resistencia continúa...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`pixel-assistant-pro ${position} ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="pixel-header">
        <div className="pixel-avatar-container">
          <div className={`pixel-avatar ${pixelMood}`}>
            <span className="avatar-icon">🤖</span>
            <div className="avatar-glow"></div>
          </div>
          <div className="pixel-info">
            <h3>Pixel Assistant</h3>
            <p className="pixel-status">
              <span className="status-dot"></span>
              Codex v2.1 • Online
            </p>
          </div>
        </div>
        
        <div className="pixel-controls">
          <button 
            className="control-btn minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expandir" : "Minimizar"}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button 
            className="control-btn close-btn"
            onClick={onClose}
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="pixel-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`pixel-message ${message.sender} ${message.mood || ''}`}
              >
                {message.sender === 'pixel' && (
                  <div className="message-avatar">🤖</div>
                )}
                <div className="message-bubble">
                  <div className="message-text">
                    {message.text.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="message-avatar user">👤</div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="pixel-message pixel typing">
                <div className="message-avatar">🤖</div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="pixel-input">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregúntame sobre el Codex, herramientas, plugins..."
              rows="2"
              className="message-textarea"
            />
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="send-button"
            >
              <span className="send-icon">➤</span>
            </button>
          </div>

          {/* Footer */}
          <div className="pixel-footer">
            <span className="footer-text">
              Pixel • Custodio de la Memoria Digital
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PixelAssistantPro;
