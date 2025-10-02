/**
 * 🎵 Son1kVers3 - VERSIÓN NUCLEAR FINAL
 * FORZAR Landing Page - SIN NOVA POST PILOT
 */

import React from 'react';
import './App.css';
import LandingPage from './LandingPage';
import ClassicInterface from './components/ClassicInterface';
import NexusInterface from './components/NexusInterface';

function App() {
  const [currentMode, setCurrentMode] = React.useState('landing');

  React.useEffect(() => {
    const path = window.location.pathname;
    console.log('🔍 Ruta actual:', path);
    
    if (path === '/classic') {
      setCurrentMode('classic');
    } else if (path === '/nexus') {
      setCurrentMode('nexus');
    } else {
      setCurrentMode('landing');
    }
  }, []);

  console.log('🎯 Modo actual:', currentMode);

  // RENDERIZADO FORZADO
  if (currentMode === 'classic') {
    return <ClassicInterface />;
  }
  
  if (currentMode === 'nexus') {
    return <NexusInterface />;
  }
  
  // POR DEFECTO SIEMPRE LANDING
  return <LandingPage />;
}

export default App;