/**
 * 🎵 Son1kVers3 - APLICACIÓN PRINCIPAL SIMPLIFICADA
 * FORZAR que funcione correctamente - SIN CONFUSIONES
 */

import React, { useState } from 'react';
import './App.css';

// Importar SOLO lo esencial
import LandingPage from './LandingPage';
import ClassicInterface from './components/ClassicInterface';
import NexusInterface from './components/NexusInterface';

function App() {
  // ESTADO SIMPLE - SIN CONFUSIONES
  const [currentMode, setCurrentMode] = useState('landing'); // SIEMPRE empezar en landing

  // Detectar modo basado en URL
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/classic') {
      setCurrentMode('classic');
    } else if (path === '/nexus') {
      setCurrentMode('nexus');
    } else {
      setCurrentMode('landing'); // SIEMPRE landing por defecto
    }
  }, []);

  // RENDERIZADO SIMPLE - SIN CONFUSIONES
  const renderApp = () => {
    switch (currentMode) {
      case 'landing':
        return <LandingPage />;
      case 'classic':
        return <ClassicInterface />;
      case 'nexus':
        return <NexusInterface />;
      default:
        return <LandingPage />; // SIEMPRE landing por defecto
    }
  };

  return (
    <div className="app">
      {renderApp()}
    </div>
  );
}

export default App;