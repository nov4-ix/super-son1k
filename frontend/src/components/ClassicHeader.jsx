/**
 * 🎵 Classic Header - Header para modo clásico
 */

import React from 'react';

const ClassicHeader = ({ user, onLogin, onLogout }) => {
  return (
    <header className="classic-header">
      <div className="classic-logo">
        <div className="logo-icon">🎵</div>
        <h1>Son1kVers3 Classic</h1>
      </div>

      <div className="classic-user-info">
        {user ? (
          <>
            <span>Hola, {user.username}</span>
            <span className="user-tier">({user.tier})</span>
            <button className="classic-btn secondary" onClick={onLogout}>
              Salir
            </button>
          </>
        ) : (
          <button className="classic-btn" onClick={onLogin}>
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default ClassicHeader;
