import React, { useState, useEffect, useCallback, useRef } from 'react';
import './UXEnhancementSystem.css';

/**
 * 🎨 Enhanced UX System Component
 * Sistema avanzado de mejora de experiencia de usuario
 * Incluye tutoriales interactivos, shortcuts de teclado y drag & drop mejorado
 */

const UXEnhancementSystem = ({
  children,
  componentName,
  enableTutorials = true,
  enableKeyboardShortcuts = true,
  enableDragDrop = true,
  className = ""
}) => {
  // Estado del tutorial
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [tutorialProgress, setTutorialProgress] = useState(0);
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(false);

  // Estado de shortcuts
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());

  // Estado de drag & drop
  const [dragOver, setDragOver] = useState(false);
  const [draggedFiles, setDraggedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Refs para elementos destacados
  const highlightedElementRef = useRef(null);

  // Configuración basada en componente
  const componentConfig = {
    ghost_studio: {
      tutorialName: 'ghost_studio',
      dropTypes: ['audio_files'],
      shortcuts: ['ctrl+g', 'ctrl+p', 'ctrl+l', 'space', 'ctrl+enter']
    },
    clone_station: {
      tutorialName: 'clone_station',
      dropTypes: ['voice_samples', 'audio_files'],
      shortcuts: ['ctrl+u', 'ctrl+r', 'ctrl+t', 'ctrl+m']
    },
    nova_post_pilot: {
      tutorialName: 'nova_post_pilot',
      dropTypes: ['images'],
      shortcuts: ['ctrl+a', 'ctrl+h', 'ctrl+shift+p']
    }
  };

  const config = componentConfig[componentName] || {};

  // Tutorial functions
  const startTutorial = useCallback(async () => {
    if (!enableTutorials || !config.tutorialName) return;

    try {
      const response = await fetch('/api/ux/start-tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorial_name: config.tutorialName })
      });

      const data = await response.json();

      if (data.success) {
        setCurrentTutorial(config.tutorialName);
        setCurrentStep(data.step);
        setTutorialProgress(data.progress);
        setTutorialActive(true);
        setShowTutorialOverlay(true);

        // Destacar elemento objetivo
        highlightElement(data.step.target);
      }
    } catch (error) {
      console.error('Error starting tutorial:', error);
    }
  }, [config.tutorialName, enableTutorials]);

  const nextTutorialStep = useCallback(async () => {
    if (!tutorialActive) return;

    try {
      const response = await fetch('/api/ux/next-tutorial-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStep(data.step);
        setTutorialProgress(data.progress);

        if (data.step.target) {
          highlightElement(data.step.target);
        }
      } else {
        // Tutorial completado
        completeTutorial();
      }
    } catch (error) {
      console.error('Error advancing tutorial:', error);
    }
  }, [tutorialActive]);

  const previousTutorialStep = useCallback(async () => {
    if (!tutorialActive) return;

    try {
      const response = await fetch('/api/ux/previous-tutorial-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStep(data.step);
        setTutorialProgress(data.progress);

        if (data.step.target) {
          highlightElement(data.step.target);
        }
      }
    } catch (error) {
      console.error('Error going back in tutorial:', error);
    }
  }, [tutorialActive]);

  const completeTutorial = useCallback(async () => {
    try {
      await fetch('/api/ux/complete-tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }

    setTutorialActive(false);
    setCurrentTutorial(null);
    setCurrentStep(null);
    setShowTutorialOverlay(false);
    removeHighlight();
  }, []);

  const highlightElement = useCallback((selector) => {
    removeHighlight();

    const element = document.querySelector(selector);
    if (element) {
      element.classList.add('tutorial-highlight');
      highlightedElementRef.current = element;

      // Scroll to element if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const removeHighlight = useCallback(() => {
    if (highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove('tutorial-highlight');
      highlightedElementRef.current = null;
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;

      setPressedKeys(prev => new Set([...prev, key]));

      // Construir combinación de teclas
      let shortcut = '';
      if (ctrl) shortcut += 'ctrl+';
      if (shift) shortcut += 'shift+';
      shortcut += key;

      // Manejar shortcuts específicos
      switch (shortcut) {
        case 'f1':
          event.preventDefault();
          startTutorial();
          break;
        case 'escape':
          if (tutorialActive) {
            event.preventDefault();
            completeTutorial();
          }
          break;
        case 'ctrl+?':
          event.preventDefault();
          setShowShortcutsHelp(prev => !prev);
          break;
        default:
          // Verificar shortcuts del componente
          if (config.shortcuts && config.shortcuts.includes(shortcut)) {
            handleComponentShortcut(shortcut);
          }
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enableKeyboardShortcuts, tutorialActive, config.shortcuts, startTutorial, completeTutorial]);

  const handleComponentShortcut = useCallback(async (shortcut) => {
    try {
      const response = await fetch('/api/ux/handle-shortcut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shortcut,
          component: componentName,
          context: window.location.pathname
        })
      });

      const data = await response.json();
      if (data.success) {
        // Emitir evento personalizado para que el componente padre maneje la acción
        window.dispatchEvent(new CustomEvent('ux-shortcut', {
          detail: { action: data.action, shortcut, component: componentName }
        }));
      }
    } catch (error) {
      console.error('Error handling shortcut:', error);
    }
  }, [componentName]);

  // Drag & Drop functionality
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // Solo quitar dragOver si realmente salimos del área de drop
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) return;

    // Procesar archivos según el componente
    const processedFiles = await processDroppedFiles(files);

    if (processedFiles.length > 0) {
      setDraggedFiles(processedFiles);

      // Emitir evento para que el componente padre maneje los archivos
      window.dispatchEvent(new CustomEvent('ux-files-dropped', {
        detail: {
          files: processedFiles,
          component: componentName,
          dropZone: e.currentTarget
        }
      }));
    }
  }, [componentName]);

  const processDroppedFiles = async (files) => {
    const processedFiles = [];

    for (const file of files) {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      // Verificar si el tipo de archivo es aceptado por este componente
      const acceptedTypes = config.dropTypes || [];
      const isAccepted = acceptedTypes.some(type => {
        const handler = window.UX_DRAG_DROP_HANDLERS?.[type];
        return handler?.extensions?.includes(fileExtension);
      });

      if (!isAccepted) {
        console.warn(`Archivo ${file.name} no aceptado en ${componentName}`);
        continue;
      }

      // Crear preview del archivo
      const fileWithPreview = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        extension: fileExtension,
        preview: await createFilePreview(file),
        status: 'ready'
      };

      processedFiles.push(fileWithPreview);
    }

    return processedFiles;
  };

  const createFilePreview = async (file) => {
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    } else if (file.type.startsWith('audio/')) {
      return '/icons/audio-file.png'; // Placeholder para archivos de audio
    }
    return '/icons/generic-file.png';
  };

  // Tutorial overlay
  const renderTutorialOverlay = () => {
    if (!showTutorialOverlay || !currentStep) return null;

    const position = currentStep.position || 'center';

    return (
      <div className={`tutorial-overlay position-${position}`}>
        <div className="tutorial-content">
          <div className="tutorial-header">
            <h3>{currentStep.title}</h3>
            <div className="tutorial-progress">
              <div
                className="progress-bar"
                style={{ width: `${tutorialProgress}%` }}
              />
            </div>
          </div>

          <div className="tutorial-body">
            <p>{currentStep.content}</p>
          </div>

          <div className="tutorial-actions">
            {currentStep.actions?.includes('previous') && (
              <button
                className="btn-secondary"
                onClick={previousTutorialStep}
              >
                ← Anterior
              </button>
            )}

            {currentStep.actions?.includes('next') && (
              <button
                className="btn-primary"
                onClick={nextTutorialStep}
              >
                Siguiente →
              </button>
            )}

            {currentStep.actions?.includes('finish') && (
              <button
                className="btn-success"
                onClick={completeTutorial}
              >
                ¡Completar Tutorial!
              </button>
            )}

            {currentStep.actions?.includes('skip') && (
              <button
                className="btn-ghost"
                onClick={completeTutorial}
              >
                Saltar Tutorial
              </button>
            )}
          </div>
        </div>

        <div className="tutorial-backdrop" onClick={completeTutorial} />
      </div>
    );
  };

  // Keyboard shortcuts help modal
  const renderShortcutsHelp = () => {
    if (!showShortcutsHelp) return null;

    const shortcuts = window.UX_KEYBOARD_SHORTCUTS || {};

    return (
      <div className="shortcuts-modal-overlay" onClick={() => setShowShortcutsHelp(false)}>
        <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
          <div className="shortcuts-header">
            <h3>⌨️ Atajos de Teclado</h3>
            <button
              className="close-button"
              onClick={() => setShowShortcutsHelp(false)}
            >
              ×
            </button>
          </div>

          <div className="shortcuts-content">
            {Object.entries(shortcuts).map(([shortcut, action]) => (
              <div key={shortcut} className="shortcut-item">
                <kbd className="shortcut-key">{shortcut}</kbd>
                <span className="shortcut-action">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Drag & drop visual feedback
  const dropZoneClasses = `
    ux-enhancement-container
    ${dragOver ? 'drag-over' : ''}
    ${tutorialActive ? 'tutorial-mode' : ''}
    ${className}
  `.trim();

  return (
    <div
      className={dropZoneClasses}
      onDragEnter={enableDragDrop ? handleDragEnter : undefined}
      onDragLeave={enableDragDrop ? handleDragLeave : undefined}
      onDragOver={enableDragDrop ? handleDragOver : undefined}
      onDrop={enableDragDrop ? handleDrop : undefined}
    >
      {/* Indicador de ayuda */}
      {enableTutorials && (
        <button
          className="help-button"
          onClick={startTutorial}
          title="Iniciar tutorial (F1)"
        >
          ❓
        </button>
      )}

      {/* Indicador de archivos arrastrados */}
      {draggedFiles.length > 0 && (
        <div className="dropped-files-preview">
          {draggedFiles.map((file, index) => (
            <div key={index} className="file-preview-item">
              <img src={file.preview} alt={file.name} />
              <span>{file.name}</span>
              <button onClick={() => setDraggedFiles([])}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Contenido principal */}
      <div className="enhanced-content">
        {children}
      </div>

      {/* Overlay del tutorial */}
      {renderTutorialOverlay()}

      {/* Modal de ayuda de shortcuts */}
      {renderShortcutsHelp()}

      {/* Indicador de teclas presionadas para feedback visual */}
      {pressedKeys.size > 0 && (
        <div className="pressed-keys-indicator">
          {Array.from(pressedKeys).map(key => (
            <kbd key={key} className="key-indicator">{key.toUpperCase()}</kbd>
          ))}
        </div>
      )}
    </div>
  );
};

export default UXEnhancementSystem;
