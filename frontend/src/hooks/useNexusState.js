import { useState, useEffect, useCallback } from 'react';

/**
 * 🌌 useNexusState Hook
 * Gestión de estado centralizada para el Modo Nexus
 * Maneja interacciones, módulos activos y estado del usuario
 */

const useNexusState = () => {
  // Estado del módulo activo
  const [activeModule, setActiveModule] = useState(null);

  // Estado general del Nexus
  const [nexusState, setNexusState] = useState({
    isInitialized: false,
    isLocked: false,
    theme: 'cyberpunk',
    glitchIntensity: 0.5,
    particlesEnabled: true
  });

  // Identidad del usuario
  const [userIdentity, setUserIdentity] = useState({
    name: 'OPERADOR',
    role: 'Sigilo Activador',
    level: 'MÁXIMO',
    alvaeStatus: 'ACTIVO'
  });

  // Historial de navegación
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Módulos disponibles y su estado
  const [modulesState, setModulesState] = useState({
    'ghost-studio': { unlocked: true, notifications: 0 },
    'clone-station': { unlocked: true, notifications: 0 },
    'nova-post': { unlocked: true, notifications: 2 },
    'memory-archive': { unlocked: true, notifications: 0 },
    'px-com': { unlocked: true, notifications: 5 },
    'marketplace': { unlocked: true, notifications: 1 },
    'collaboration': { unlocked: true, notifications: 3 }
  });

  // Inicializar Nexus
  useEffect(() => {
    const initializeNexus = async () => {
      // Cargar datos del usuario desde localStorage o API
      const savedUser = localStorage.getItem('nexus_user');
      if (savedUser) {
        setUserIdentity(JSON.parse(savedUser));
      }

      // Cargar estado del Nexus
      const savedState = localStorage.getItem('nexus_state');
      if (savedState) {
        setNexusState(prev => ({ ...prev, ...JSON.parse(savedState) }));
      }

      // Marcar como inicializado
      setNexusState(prev => ({ ...prev, isInitialized: true }));
    };

    initializeNexus();
  }, []);

  // Guardar estado cuando cambia
  useEffect(() => {
    if (nexusState.isInitialized) {
      localStorage.setItem('nexus_state', JSON.stringify(nexusState));
    }
  }, [nexusState]);

  // Guardar identidad cuando cambia
  useEffect(() => {
    localStorage.setItem('nexus_user', JSON.stringify(userIdentity));
  }, [userIdentity]);

  // Cambiar módulo activo
  const handleSetActiveModule = useCallback((moduleId) => {
    if (moduleId && modulesState[moduleId]?.unlocked) {
      setActiveModule(moduleId);
      setNavigationHistory(prev => [...prev, moduleId]);

      // Limpiar notificaciones del módulo
      setModulesState(prev => ({
        ...prev,
        [moduleId]: { ...prev[moduleId], notifications: 0 }
      }));
    } else if (moduleId === null) {
      setActiveModule(null);
    }
  }, [modulesState]);

  // Toggle estado del Nexus
  const toggleNexus = useCallback(() => {
    setNexusState(prev => ({
      ...prev,
      isLocked: !prev.isLocked
    }));
  }, []);

  // Actualizar configuración del Nexus
  const updateNexusConfig = useCallback((config) => {
    setNexusState(prev => ({
      ...prev,
      ...config
    }));
  }, []);

  // Desbloquear módulo
  const unlockModule = useCallback((moduleId) => {
    setModulesState(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], unlocked: true }
    }));
  }, []);

  // Agregar notificación a módulo
  const addModuleNotification = useCallback((moduleId, count = 1) => {
    setModulesState(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        notifications: (prev[moduleId]?.notifications || 0) + count
      }
    }));
  }, []);

  // Navegar hacia atrás
  const navigateBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remover actual
      const previousModule = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveModule(previousModule);
    } else {
      setActiveModule(null);
    }
  }, [navigationHistory]);

  // Resetear Nexus
  const resetNexus = useCallback(() => {
    setActiveModule(null);
    setNavigationHistory([]);
    setNexusState({
      isInitialized: true,
      isLocked: false,
      theme: 'cyberpunk',
      glitchIntensity: 0.5,
      particlesEnabled: true
    });
  }, []);

  // Activar efecto glitch
  const triggerGlitch = useCallback((intensity = 1, duration = 1000) => {
    setNexusState(prev => ({
      ...prev,
      glitchIntensity: intensity
    }));

    setTimeout(() => {
      setNexusState(prev => ({
        ...prev,
        glitchIntensity: 0.5
      }));
    }, duration);
  }, []);

  // Obtener estadísticas del Nexus
  const getNexusStats = useCallback(() => {
    const totalNotifications = Object.values(modulesState).reduce(
      (sum, module) => sum + (module.notifications || 0),
      0
    );

    const unlockedModules = Object.values(modulesState).filter(
      module => module.unlocked
    ).length;

    return {
      totalNotifications,
      unlockedModules,
      totalModules: Object.keys(modulesState).length,
      navigationDepth: navigationHistory.length,
      isActive: activeModule !== null
    };
  }, [modulesState, navigationHistory, activeModule]);

  return {
    // Estado
    activeModule,
    nexusState,
    userIdentity,
    modulesState,
    navigationHistory,

    // Acciones
    setActiveModule: handleSetActiveModule,
    toggleNexus,
    updateNexusConfig,
    unlockModule,
    addModuleNotification,
    navigateBack,
    resetNexus,
    triggerGlitch,

    // Utilidades
    getNexusStats,
    setUserIdentity
  };
};

export default useNexusState;
