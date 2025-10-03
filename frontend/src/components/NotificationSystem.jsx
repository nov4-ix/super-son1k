import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simular notificaciones en tiempo real
    const interval = setInterval(() => {
      addNotification({
        type: ['success', 'info', 'warning', 'error'][Math.floor(Math.random() * 4)],
        title: ['Nueva reproducción', 'Nuevo seguidor', 'Comentario nuevo', 'Pago recibido'][Math.floor(Math.random() * 4)],
        message: 'Tu música está siendo escuchada en todo el mundo',
        time: new Date()
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(),
      ...notification,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || 'ℹ️';
  };

  const getTimeAgo = (time) => {
    const seconds = Math.floor((new Date() - time) / 1000);
    if (seconds < 60) return 'Ahora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <>
      <button className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            <div className="notification-actions">
              <button onClick={markAllAsRead}>Marcar todas</button>
              <button onClick={clearAll}>Limpiar</button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notif.id)}
                >
                  <span className="notif-icon">{getIcon(notif.type)}</span>
                  <div className="notif-content">
                    <div className="notif-title">{notif.title}</div>
                    <div className="notif-message">{notif.message}</div>
                  </div>
                  <span className="notif-time">{getTimeAgo(notif.time)}</span>
                </div>
              ))
            ) : (
              <div className="empty-notifications">
                <span>🔕</span>
                <p>No hay notificaciones</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;
