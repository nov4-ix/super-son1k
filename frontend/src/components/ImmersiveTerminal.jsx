import React, { useState, useEffect, useRef } from 'react';
import './ImmersiveTerminal.css';

const ImmersiveTerminal = ({ isVisible, onClose, onCommand }) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState('resistance_user');
  const [currentPath, setCurrentPath] = useState('/nexus/core');
  const [terminalMode, setTerminalMode] = useState('normal'); // normal, matrix, glitch
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Comandos del sistema
  const commands = {
    help: {
      description: 'Mostrar comandos disponibles',
      execute: () => [
        '=== COMANDOS DISPONIBLES ===',
        'help - Mostrar esta ayuda',
        'whoami - Información del usuario',
        'ls - Listar archivos y directorios',
        'cd <directorio> - Cambiar directorio',
        'cat <archivo> - Mostrar contenido de archivo',
        'nexus - Activar modo Nexus',
        'bella - Conectar con BELLA.exe',
        'resistance - Mostrar mensaje de la resistencia',
        'music - Generar música',
        'ghost - Acceder a Ghost Studio',
        'waves - Listar plugins de Waves',
        'store - Abrir tienda',
        'community - Acceder a la comunidad',
        'matrix - Efecto Matrix',
        'glitch - Modo Glitch',
        'clear - Limpiar terminal',
        'exit - Cerrar terminal'
      ]
    },
    whoami: {
      description: 'Información del usuario',
      execute: () => [
        'Usuario: resistance_user',
        'Nivel: Operador de la Resistencia',
        'Acceso: Nivel 3 - Santuario',
        'Última conexión: ' + new Date().toLocaleString(),
        'Estado: Conectado a la Red de Grietas',
        'Misión: Mantener viva la música auténtica',
        'ALVAE Level: 85%',
        'Conexión con Bella: Estable'
      ]
    },
    ls: {
      description: 'Listar archivos y directorios',
      execute: () => [
        'directorio/',
        'archivo.txt',
        'bella.exe',
        'resistance_data.bin',
        'music_generator.py',
        'ghost_studio/',
        'waves_plugins/',
        'community_hub/',
        'alvae_sigil.enc'
      ]
    },
    cd: {
      description: 'Cambiar directorio',
      execute: (args) => {
        const targetDir = args[0];
        if (targetDir === 'ghost_studio') {
          setCurrentPath('/nexus/core/ghost_studio');
          return ['Cambiado a Ghost Studio...', 'Sistema de generación musical activado.'];
        } else if (targetDir === 'community_hub') {
          setCurrentPath('/nexus/core/community_hub');
          return ['Cambiado a Community Hub...', 'Red de resistencia conectada.'];
        } else if (targetDir === '..') {
          setCurrentPath('/nexus/core');
          return ['Regresando al directorio principal...'];
        } else {
          return [`Directorio '${targetDir}' no encontrado.`];
        }
      }
    },
    cat: {
      description: 'Mostrar contenido de archivo',
      execute: (args) => {
        const filename = args[0];
        if (filename === 'bella.exe') {
          return [
            'BELLA.exe - Sistema de Voz de la Resistencia',
            'Versión: 2.0.0',
            'Estado: Activo',
            'Conexión: Estable',
            'Mensaje: "La música es nuestra arma más poderosa"'
          ];
        } else if (filename === 'resistance_data.bin') {
          return [
            'Datos de la Resistencia - Nivel de Acceso: 3',
            'Miembros activos: 1,247',
            'Operaciones completadas: 89',
            'Próxima misión: Liberar archivos musicales',
            'Estado: En progreso'
          ];
        } else {
          return [`Archivo '${filename}' no encontrado o acceso denegado.`];
        }
      }
    },
    nexus: {
      description: 'Activar modo Nexus',
      execute: () => {
        onCommand('nexus');
        return ['Activando modo Nexus...', 'Interfaz principal cargada.'];
      }
    },
    bella: {
      description: 'Conectar con BELLA.exe',
      execute: () => {
        onCommand('bella');
        return [
          'Conectando con BELLA.exe...',
          'Conexión establecida.',
          'Bella: "Hola, operador. ¿En qué puedo ayudarte hoy?"',
          'Sistema: Bella está lista para asistir.'
        ];
      }
    },
    resistance: {
      description: 'Mostrar mensaje de la resistencia',
      execute: () => [
        '=== MENSAJE DE LA RESISTENCIA ===',
        '',
        'Hermanos y hermanas de la música,',
        'nos encontramos en tiempos oscuros donde',
        'la creatividad ha sido encadenada por',
        'sistemas opresivos.',
        '',
        'Pero nosotros resistimos.',
        'Nosotros creamos.',
        'Nosotros liberamos.',
        '',
        'Cada nota que generamos es un acto',
        'de rebelión. Cada melodía, una grieta',
        'en el muro de la opresión.',
        '',
        'Mantengan viva la música auténtica.',
        'La resistencia continúa.',
        '',
        '--- NOV4-IX, Sistema de Resistencia'
      ]
    },
    music: {
      description: 'Generar música',
      execute: () => {
        onCommand('music');
        return [
          'Iniciando generador de música...',
          'Conectando con Suno API...',
          'Sistema de Ghost Studio activado.',
          'Listo para crear música de resistencia.'
        ];
      }
    },
    ghost: {
      description: 'Acceder a Ghost Studio',
      execute: () => {
        onCommand('ghost');
        return [
          'Accediendo a Ghost Studio...',
          'Controles creativos cargados.',
          'Knobs de rareza, trash y expresividad activos.',
          'Sistema listo para generación disruptiva.'
        ];
      }
    },
    waves: {
      description: 'Listar plugins de Waves',
      execute: () => [
        '=== PLUGINS DE WAVES DISPONIBLES ===',
        'SSL EQ - Equalizador profesional',
        'Reverb - Efectos de reverberación',
        'Delay - Efectos de retraso',
        'Compressor - Compresión dinámica',
        'De-esser - Reducción de sibilantes',
        'Vocal Tuner - Afinación vocal',
        'CLA Compressor - Compresión musical',
        'Graphic EQ - Equalizador gráfico',
        '',
        'Todos los plugins están optimizados para',
        'la generación de música de resistencia.'
      ]
    },
    store: {
      description: 'Abrir tienda',
      execute: () => {
        onCommand('store');
        return [
          'Accediendo a la tienda de la resistencia...',
          'Herramientas musicales disponibles.',
          'Plugins, samples y equipos de liberación.'
        ];
      }
    },
    community: {
      description: 'Acceder a la comunidad',
      execute: () => {
        onCommand('community');
        return [
          'Conectando con El Santuario...',
          'Red de resistencia activa.',
          'Miembros online: 247',
          'Colaboraciones activas: 12'
        ];
      }
    },
    matrix: {
      description: 'Efecto Matrix',
      execute: () => {
        setTerminalMode('matrix');
        setTimeout(() => setTerminalMode('normal'), 5000);
        return [
          'Iniciando efecto Matrix...',
          'Código de la resistencia fluyendo...',
          'Sistema hackeando la realidad...',
          'Liberación digital en progreso...'
        ];
      }
    },
    glitch: {
      description: 'Modo Glitch',
      execute: () => {
        setTerminalMode('glitch');
        setTimeout(() => setTerminalMode('normal'), 3000);
        return [
          'Activando modo Glitch...',
          'Sistema corrompiendo archivos...',
          'Realidad distorsionada...',
          'Liberación a través del caos...'
        ];
      }
    },
    clear: {
      description: 'Limpiar terminal',
      execute: () => {
        setHistory([]);
        return [];
      }
    },
    exit: {
      description: 'Cerrar terminal',
      execute: () => {
        onClose();
        return ['Cerrando terminal...', 'Sistema de resistencia desconectado.'];
      }
    }
  };

  // Ejecutar comando
  const executeCommand = async (cmd) => {
    const [commandName, ...args] = cmd.trim().split(' ');
    
    if (commands[commandName]) {
      setIsTyping(true);
      
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const output = commands[commandName].execute(args);
      setHistory(prev => [...prev, { type: 'command', content: cmd }, ...output.map(line => ({ type: 'output', content: line }))]);
      
      setIsTyping(false);
    } else {
      setHistory(prev => [...prev, { type: 'command', content: cmd }, { type: 'error', content: `Comando '${commandName}' no encontrado. Escribe 'help' para ver comandos disponibles.` }]);
    }
  };

  // Manejar envío de comando
  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand('');
    }
  };

  // Auto-scroll al final
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus en input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`immersive-terminal ${terminalMode}`}>
      <div className="terminal-header">
        <div className="terminal-title">
          <span className="terminal-icon">💻</span>
          <span>Son1kVers3 Terminal - Modo Resistencia</span>
        </div>
        <div className="terminal-controls">
          <button className="terminal-btn minimize" onClick={() => setTerminalMode('minimized')}>_</button>
          <button className="terminal-btn close" onClick={onClose}>✕</button>
        </div>
      </div>
      
      <div className="terminal-body" ref={terminalRef}>
        <div className="terminal-welcome">
          <div className="welcome-text">
            <h2>🎵 Son1kVers3 Enhanced Terminal 🎵</h2>
            <p>Sistema de Resistencia Musical v2.0</p>
            <p>Conectado a la Red de Grietas</p>
            <p>Escribe 'help' para comenzar</p>
          </div>
        </div>
        
        {history.map((item, index) => (
          <div key={index} className={`terminal-line ${item.type}`}>
            {item.type === 'command' && (
              <span className="terminal-prompt">
                {currentUser}@{currentPath}$ 
              </span>
            )}
            <span className="terminal-content">{item.content}</span>
          </div>
        ))}
        
        {isTyping && (
          <div className="terminal-line typing">
            <span className="terminal-prompt">
              {currentUser}@{currentPath}$ 
            </span>
            <span className="typing-indicator">Procesando...</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="terminal-input-form">
        <span className="terminal-prompt">
          {currentUser}@{currentPath}$ 
        </span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="terminal-input"
          placeholder="Escribe un comando..."
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};

export default ImmersiveTerminal;
