import React, { useState, useRef, useEffect } from 'react';
import './LiveChat.css';

const LiveChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Sistema', text: '¡Bienvenido al chat en vivo!', time: new Date(), isSystem: true },
    { id: 2, user: 'DJ Producer', text: '¿Alguien quiere colaborar?', time: new Date(), avatar: '🎧' },
    { id: 3, user: 'MusicLover', text: 'Me encanta esta plataforma!', time: new Date(), avatar: '🎵' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(42);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      user: 'Tú',
      text: newMessage,
      time: new Date(),
      avatar: '👤',
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simular respuesta
    setTimeout(() => {
      const responses = [
        '¡Genial! 🎉',
        'Me parece interesante',
        '¿Podrías compartir más detalles?',
        '¡Excelente idea!'
      ];
      setMessages(prev => [...prev, {
        id: Date.now(),
        user: 'Bot Assistant',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date(),
        avatar: '🤖'
      }]);
    }, 1000);
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
        <span className="online-indicator">{onlineUsers}</span>
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              <h3>💬 Chat en Vivo</h3>
              <span className="online-count">🟢 {onlineUsers} en línea</span>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.isOwn ? 'own' : ''} ${msg.isSystem ? 'system' : ''}`}>
                {!msg.isSystem && <span className="message-avatar">{msg.avatar}</span>}
                <div className="message-content">
                  {!msg.isSystem && <div className="message-user">{msg.user}</div>}
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">
                    {msg.time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button type="submit">📤</button>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChat;
