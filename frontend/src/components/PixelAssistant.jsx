import React, { useState, useEffect, useRef } from 'react';
import './PixelAssistant.css';

const PixelAssistant = ({ isVisible, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assistantMode, setAssistantMode] = useState('creative');
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'assistant',
        content: "Hola, soy Pixel, tu Custodio Digital y Estratega de Resistencia. Estoy aquí para ayudarte con la creatividad musical, la historia de Son1kVers3, y la resistencia a través del arte. ¿En qué puedo ayudarte?",
        timestamp: new Date().toISOString(),
        mode: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [isVisible, messages.length]);

  // Auto-scroll a los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje
  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/pixel/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputMessage,
          context: {
            mode: assistantMode,
            conversation_history: conversationHistory.slice(-5) // Últimos 5 mensajes
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.pixel_response,
          timestamp: new Date().toISOString(),
          mode: data.mode,
          confidence: data.confidence,
          suggestions: data.suggestions || [],
          related_topics: data.related_topics || []
        };

        setMessages(prev => [...prev, assistantMessage]);
        setConversationHistory(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "Lo siento, no pude procesar tu mensaje en este momento. Como Pixel, estoy aquí para ayudarte. ¿Podrías intentar de nuevo?",
        timestamp: new Date().toISOString(),
        mode: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Manejar tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Cambiar modo del asistente
  const changeMode = (mode) => {
    setAssistantMode(mode);
    
    const modeMessages = {
      creative: "Modo creativo activado. Estoy aquí para guiarte en la creación musical y la inspiración artística.",
      historical: "Modo histórico activado. Puedo contarte sobre la historia de Son1kVers3, Bella, NOV4-IX y la resistencia.",
      technical: "Modo técnico activado. Te ayudo con configuraciones, herramientas y optimización de procesos.",
      emotional: "Modo emocional activado. Te guío en conexiones emocionales y vulnerabilidad creativa."
    };

    const modeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: modeMessages[mode],
      timestamp: new Date().toISOString(),
      mode: 'mode_change'
    };

    setMessages(prev => [...prev, modeMessage]);
  };

  // Obtener sugerencias creativas
  const getCreativeSuggestions = async () => {
    try {
      const response = await fetch('/api/pixel/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: { mode: assistantMode }
        })
      });

      const data = await response.json();

      if (data.success) {
        const suggestionsMessage = {
          id: Date.now(),
          type: 'assistant',
          content: "Aquí tienes algunas sugerencias creativas:",
          timestamp: new Date().toISOString(),
          mode: 'suggestions',
          suggestions: data.suggestions
        };

        setMessages(prev => [...prev, suggestionsMessage]);
      }
    } catch (error) {
      console.error('Error obteniendo sugerencias:', error);
    }
  };

  // Limpiar conversación
  const clearConversation = () => {
    setMessages([]);
    setConversationHistory([]);
  };

  if (!isVisible) return null;

  return (
    <div className="pixel-assistant">
      <div className="pixel-header">
        <div className="pixel-title">
          <span className="pixel-icon">🤖</span>
          <span className="pixel-name">Pixel Assistant</span>
          <span className="pixel-role">Custodio Digital</span>
        </div>
        <div className="pixel-controls">
          <button className="control-btn" onClick={getCreativeSuggestions}>
            💡
          </button>
          <button className="control-btn" onClick={clearConversation}>
            🗑️
          </button>
          <button className="control-btn close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>

      <div className="pixel-mode-selector">
        <button 
          className={`mode-btn ${assistantMode === 'creative' ? 'active' : ''}`}
          onClick={() => changeMode('creative')}
        >
          🎨 Creativo
        </button>
        <button 
          className={`mode-btn ${assistantMode === 'historical' ? 'active' : ''}`}
          onClick={() => changeMode('historical')}
        >
          📚 Histórico
        </button>
        <button 
          className={`mode-btn ${assistantMode === 'technical' ? 'active' : ''}`}
          onClick={() => changeMode('technical')}
        >
          ⚙️ Técnico
        </button>
        <button 
          className={`mode-btn ${assistantMode === 'emotional' ? 'active' : ''}`}
          onClick={() => changeMode('emotional')}
        >
          💝 Emocional
        </button>
      </div>

      <div className="pixel-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="message-suggestions">
                  <div className="suggestions-title">Sugerencias:</div>
                  <div className="suggestions-list">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => setInputMessage(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {message.related_topics && message.related_topics.length > 0 && (
                <div className="message-topics">
                  <div className="topics-title">Temas relacionados:</div>
                  <div className="topics-list">
                    {message.related_topics.map((topic, index) => (
                      <span key={index} className="topic-tag">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {message.confidence && (
                <div className="message-confidence">
                  <span className="confidence-label">Confianza:</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{width: `${message.confidence * 100}%`}}
                    ></div>
                  </div>
                  <span className="confidence-value">
                    {Math.round(message.confidence * 100)}%
                  </span>
                </div>
              )}
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message assistant typing">
            <div className="message-content">
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

      <div className="pixel-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregúntame sobre creatividad musical, historia de Son1kVers3, o cualquier tema relacionado..."
            className="message-input"
            rows="2"
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="send-btn"
          >
            {isTyping ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixelAssistant;

