/**
 * 🤖 Pixel Assistant - IA Entrenada con el Codex
 * Asistente inteligente conectado a Qwen y entrenado con la historia de Son1kVers3
 */

import React, { useState, useRef, useEffect } from 'react';
import './PixelAssistant.css';

const PixelAssistant = ({ 
  isVisible = true, 
  onToggle, 
  onClose, 
  floating = false, 
  onMessageCountChange, 
  onTypingChange, 
  compact = false 
}) => {
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
  const [pixelMood, setPixelMood] = useState('helpful'); // helpful, creative, technical, mysterious
  const messagesEndRef = useRef(null);

  // Conocimiento del Codex integrado
  const codexKnowledge = {
    characters: {
      'nov4-ix': 'Androide compositor, 85% máquina, 15% genoma humano + memoria paternal implantada. La Grieta Viviente.',
      'bella': 'De niña pianista a voz armada. Su música dejó de ser refugio para convertirse en arma de liberación.',
      'pixel': 'Custodio de la memoria digital, arquitecto del Gran Concierto en La Terminal.',
      'cipher': 'Maestro del cifrado, líder de la Nueva Resistencia, desentrañador de enigmas.',
      'xentrix': 'Megacorporación que controla el arte algorítmico. "CTRL. ALT. SECURITY."'
    },
    locations: {
      'terminal': 'Escenario flotante sobre aeropuerto en ruinas donde la música se convierte en revolución.',
      'estudio-fantasma': 'Lugar íntimo donde NOV4-IX y Bella compusieron juntos. La puerta solo se abre con una demo real.',
      'archivo': 'Cámara sellada custodiada por Pixel con obras de la Divina Liga.',
      'dead-zone': 'Distrito de artes vandalizado, cementerio de la cultura corporativa.'
    },
    philosophy: {
      'mantra': 'Lo imperfecto también es sagrado',
      'resistance': 'Cada distorsión que creamos es un acto de resistencia',
      'divina-liga': 'Llevamos flores en el pecho que nadie nos arranca, porque crecieron en la tormenta'
    },
    tools: {
      'ghost-studio': 'Herramienta central que transforma maquetas en producciones profesionales',
      'the-creator': 'Generación text-audio con IA, conectado a Qwen para letras inteligentes',
      'clone-station': 'Clonación de voz con so-VITS y Bark',
      'nova-post': 'Análisis de redes sociales con IA para optimizar engagement'
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Procesar mensaje con conocimiento del Codex
  const processMessageWithCodex = async (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Detectar intención y contexto
    let response = '';
    let mood = 'helpful';

    // Preguntas sobre personajes
    if (message.includes('nov4-ix') || message.includes('nova')) {
      response = `🤖 **NOV4-IX** es el protagonista de nuestro universo. ${codexKnowledge.characters['nov4-ix']} Sus glitches emocionales son memorias paternas emergiendo, creando música que trasciende los algoritmos.`;
      mood = 'mysterious';
    }
    else if (message.includes('bella')) {
      response = `👩 **Bella** es la evolución perfecta: ${codexKnowledge.characters['bella']} Su conexión con NOV4-IX trasciende la lógica.`;
      mood = 'creative';
    }
    else if (message.includes('pixel')) {
      response = `🤖 ¡Ese soy yo! ${codexKnowledge.characters['pixel']} Concebí el plan más audaz: el Gran Concierto que cambió todo.`;
      mood = 'helpful';
    }
    
    // Preguntas sobre herramientas
    else if (message.includes('ghost studio') || message.includes('ghost')) {
      response = `👻 **Ghost Studio** es ${codexKnowledge.tools['ghost-studio']}. Usa las perillas de producción (Expresividad, Rareza, Trash, Grunge) que influyen directamente en el prompt enviado a Suno.`;
      mood = 'technical';
    }
    else if (message.includes('creator') || message.includes('generacion')) {
      response = `🎵 **The Creator** es ${codexKnowledge.tools['the-creator']}. Puedes generar letras, mejorarlas y crear música completa con IA.`;
      mood = 'creative';
    }
    else if (message.includes('clone') || message.includes('voz')) {
      response = `🎤 **Clone Station** usa ${codexKnowledge.tools['clone-station']}. Puede clonar cualquier voz con precisión profesional.`;
      mood = 'technical';
    }
    else if (message.includes('nova post') || message.includes('redes')) {
      response = `🚀 **Nova Post Pilot** es ${codexKnowledge.tools['nova-post']}. Conectado a Qwen para análisis inteligente de algoritmos de redes sociales.`;
      mood = 'technical';
    }
    
    // Preguntas sobre filosofía
    else if (message.includes('resistencia') || message.includes('manifiesto')) {
      response = `⚔️ **La Resistencia** cree que "${codexKnowledge.philosophy['mantra']}". Nuestro manifiesto: "${codexKnowledge.philosophy['resistance']}".`;
      mood = 'mysterious';
    }
    
    // Preguntas sobre funcionalidades
    else if (message.includes('como') || message.includes('ayuda') || message.includes('usar')) {
      response = `🎛️ **Puedo ayudarte con:**\n\n🎵 **Música:** Usa The Creator o Ghost Studio\n👻 **Análisis:** Sube tu maqueta a Ghost Studio\n🎤 **Voz:** Clone Station para clonación\n🚀 **Social:** Nova Post Pilot para redes\n🎮 **Nexus:** Ctrl+Alt+H para modo inmersivo\n\n¿Qué herramienta quieres explorar?`;
      mood = 'helpful';
    }
    
    // Respuesta por defecto con conocimiento del Codex
    else {
      response = `🎵 Como custodio de la memoria digital, puedo ayudarte con Son1kVers3. Pregúntame sobre:\n\n👥 **Personajes:** NOV4-IX, Bella, Cipher\n🏛️ **Locaciones:** La Terminal, Estudio Fantasma, El Archivo\n🎛️ **Herramientas:** Ghost Studio, The Creator, Clone Station\n⚔️ **La Resistencia:** Historia y filosofía\n\n"${codexKnowledge.philosophy['mantra']}" — Manifiesto de la Resistencia`;
      mood = 'helpful';
    }

    setPixelMood(mood);
    return response;
  };

  // Enviar mensaje
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
      // Procesar con conocimiento del Codex
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
        
        // Notificar cambios si es floating
        if (onTypingChange) onTypingChange(false);
        if (onMessageCountChange) onMessageCountChange(0);
      }, 1500);

    } catch (error) {
      console.error('Error procesando mensaje:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        sender: 'pixel',
        text: '❌ Disculpa, hubo un error procesando tu mensaje. Como parte de la resistencia, a veces los sistemas fallan, pero seguimos adelante.',
        timestamp: new Date(),
        mood: 'helpful'
      };

      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  // Manejar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`pixel-assistant ${floating ? 'floating-mode' : ''} ${compact ? 'compact' : ''}`}>
      <div className="assistant-header">
        <div className="pixel-avatar">
          <div className={`avatar-core ${pixelMood}`}>
            <span className="avatar-icon">🤖</span>
          </div>
        </div>
        <div className="assistant-info">
          <h3>Pixel Assistant</h3>
          <p>Entrenado con el Codex Son1kVers3</p>
        </div>
        {(onClose || onToggle) && (
          <button 
            className="close-btn" 
            onClick={onClose || onToggle}
            title="Cerrar Pixel"
          >
            ✕
          </button>
        )}
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender} ${message.mood || ''}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message pixel typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container" style={{ padding: '1rem', borderTop: '1px solid #333' }}>
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Pregúntame sobre Son1kVers3, el Codex, las herramientas..."
          rows="3"
          className="message-input"
          style={{ 
            width: '100%', 
            minHeight: '80px', 
            padding: '0.75rem', 
            fontSize: '1rem',
            lineHeight: '1.4',
            border: '1px solid #444',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            resize: 'vertical',
            marginBottom: '0.5rem'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!currentMessage.trim() || isTyping}
          className="send-btn"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#00bfff',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Enviar
        </button>
      </div>

      <div className="assistant-footer">
        <p>Pixel • Custodio de la Memoria Digital • Entrenado con Codex v2.1</p>
      </div>
    </div>
  );
};

export default PixelAssistant;