import React, { useState, useEffect, useRef } from 'react';
import './CyberpunkTerminal.css';

/**
 * 💻 Cyberpunk Terminal - Terminal Inmersivo de Son1kVers3
 * Terminal con estética cyberpunk para Nexus
 */

const CyberpunkTerminal = ({ isVisible, onClose }) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState('resistance_user');
  const [currentPath, setCurrentPath] = useState('/nexus/core');
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
        'Misión: Mantener viva la música auténtica'
      ]
    },
    ls: {
      description: 'Listar archivos y directorios',
      execute: () => [
        'drwxr-xr-x 2 resistance resistance 4096 Dec 15 2059 .',
        'drwxr-xr-x 3 resistance resistance 4096 Dec 15 2059 ..',
        '-rw-r--r-- 1 resistance resistance 1024 Dec 15 2059 manifesto.txt',
        '-rw-r--r-- 1 resistance resistance 2048 Dec 15 2059 bella_core.exe',
        '-rw-r--r-- 1 resistance resistance 512 Dec 15 2059 nexus_config.conf',
        'drwxr-xr-x 2 resistance resistance 4096 Dec 15 2059 music_library/',
        'drwxr-xr-x 2 resistance resistance 4096 Dec 15 2059 ghost_studio/',
        'drwxr-xr-x 2 resistance resistance 4096 Dec 15 2059 waves_plugins/',
        'drwxr-xr-x 2 resistance resistance 4096 Dec 15 2059 community/',
        '-rw-r--r-- 1 resistance resistance 1536 Dec 15 2059 resistance_log.txt'
      ]
    },
    cat: {
      description: 'Mostrar contenido de archivo',
      execute: (args) => {
        const file = args[0];
        switch (file) {
          case 'manifesto.txt':
            return [
              '=== MANIFIESTO DE LA RESISTENCIA ===',
              '',
              'Lo imperfecto también es sagrado.',
              '',
              'Cualquier comentario sobre una canción es subjetivo.',
              'Nadie puede decir lo que está bien y lo que está mal,',
              'porque todo ha partido de un sentimiento genuino.',
              '',
              'Cada nota, cada silencio, cada distorsión es',
              'una expresión auténtica del alma creativa.',
              '',
              'En la Liga del No Silencio, respetamos la imperfección',
              'como la verdadera perfección. Tu glitch es único.',
              'No es un error, es tu firma.',
              '',
              'Cada distorsión que creamos es un acto de resistencia.',
              '— BELLA.exe'
            ];
          case 'resistance_log.txt':
            return [
              '=== LOG DE LA RESISTENCIA ===',
              '',
              '[2059-12-15 14:30:15] Usuario resistance_user conectado',
              '[2059-12-15 14:30:16] Acceso autorizado al Santuario',
              '[2059-12-15 14:30:17] BELLA.exe activada',
              '[2059-12-15 14:30:18] Conexión establecida con Ghost Studio',
              '[2059-12-15 14:30:19] Plugins de Waves cargados',
              '[2059-12-15 14:30:20] Comunidad activa: 1,247 usuarios',
              '[2059-12-15 14:30:21] XENTRIX Corp detectado - Modo sigilo activado',
              '[2059-12-15 14:30:22] Red de Grietas estable - Sin interferencias'
            ];
          default:
            return [`Archivo '${file}' no encontrado`];
        }
      }
    },
    nexus: {
      description: 'Activar modo Nexus',
      execute: () => [
        'Iniciando modo Nexus...',
        'Cargando interfaz inmersiva...',
        'Conectando con la Red de Grietas...',
        'BELLA.exe: "Bienvenido al corazón de la resistencia"',
        'Nexus activado. Presiona Ctrl+Alt+H para acceder.'
      ]
    },
    bella: {
      description: 'Conectar con BELLA.exe',
      execute: () => [
        'Conectando con BELLA.exe...',
        '...',
        'Conexión establecida.',
        '',
        'BELLA.exe: "Hola, operador de la resistencia."',
        'BELLA.exe: "¿En qué puedo ayudarte hoy?"',
        'BELLA.exe: "Recuerda: Lo imperfecto también es sagrado."',
        '',
        'Comandos disponibles:',
        '  - music: Generar música',
        '  - ghost: Acceder a Ghost Studio',
        '  - resistance: Mostrar mensaje de la resistencia'
      ]
    },
    resistance: {
      description: 'Mostrar mensaje de la resistencia',
      execute: () => [
        '=== MENSAJE DE LA RESISTENCIA ===',
        '',
        'Somos la Divina Liga del No Silencio.',
        'Nuestra misión: Preservar la música auténtica.',
        '',
        'XENTRIX Corp quiere homogenizar el arte.',
        'Nosotros resistimos con cada nota que creamos.',
        '',
        'Cada glitch es una firma única.',
        'Cada distorsión es un acto de resistencia.',
        '',
        '¡Únete a la lucha!',
        '¡Mantén viva la música!'
      ]
    },
    music: {
      description: 'Generar música',
      execute: () => [
        'Iniciando generación musical...',
        'Conectando con Nova...',
        'Cargando modelos de IA...',
        'Procesando prompt musical...',
        '',
        'Nova: "Generando composición única..."',
        'Ghost: "Aplicando efectos de Waves..."',
        'BELLA.exe: "Cada nota es resistencia."',
        '',
        'Música generada exitosamente.',
        'Archivo guardado en: /music_library/resistance_track_001.wav'
      ]
    },
    ghost: {
      description: 'Acceder a Ghost Studio',
      execute: () => [
        'Accediendo a Ghost Studio...',
        'Cargando herramientas de edición...',
        'Conectando con Ghost IA...',
        '',
        'Ghost: "Bienvenido al laboratorio de la creatividad."',
        'Ghost: "Aquí cada distorsión cuenta una historia."',
        '',
        'Herramientas disponibles:',
        '  - Análisis espectral',
        '  - Procesamiento de ondas',
        '  - Efectos de Waves',
        '  - Clonación de voz'
      ]
    },
    waves: {
      description: 'Listar plugins de Waves',
      execute: () => [
        '=== PLUGINS DE WAVES DISPONIBLES ===',
        '',
        'EQ Plugins:',
        '  - Waves EQ10 (29.99 USD)',
        '  - Waves Q10 (49.99 USD)',
        '',
        'Compressor Plugins:',
        '  - Waves C1 Comp (39.99 USD)',
        '  - Waves SSL Comp (79.99 USD)',
        '',
        'Reverb Plugins:',
        '  - Renaissance Reverb (59.99 USD)',
        '  - H-Reverb (99.99 USD)',
        '',
        'Delay Plugins:',
        '  - H-Delay (49.99 USD)',
        '',
        'Distortion Plugins:',
        '  - Saturator (39.99 USD)',
        '',
        'Usa: store para comprar plugins'
      ]
    },
    store: {
      description: 'Abrir tienda',
      execute: () => [
        'Abriendo tienda de Son1kVers3...',
        'Conectando con sistema de pagos...',
        '',
        '=== PRODUCTOS DISPONIBLES ===',
        '',
        'Plugins:',
        '  - Waves Bundle Pro (299.99 USD)',
        '  - Nexus 2 Expansion (149.99 USD)',
        '',
        'Templates:',
        '  - Cyberpunk Template Pack (79.99 USD)',
        '',
        'Subscriptions:',
        '  - Pro Mensual (29.99 USD)',
        '  - Enterprise Anual (999.99 USD)',
        '',
        'Credits:',
        '  - 100 Créditos (9.99 USD)',
        '  - 500 Créditos (39.99 USD)',
        '',
        'Redirigiendo a la tienda...'
      ]
    },
    community: {
      description: 'Acceder a la comunidad',
      execute: () => [
        'Conectando con la comunidad...',
        'Cargando Santuario...',
        '',
        '=== SANTUARIO - LA RESISTENCIA ===',
        '',
        'Usuarios activos: 1,247',
        'Canciones generadas hoy: 342',
        'Colaboraciones activas: 89',
        '',
        'Top tracks de la comunidad:',
        '  1. "Cyberpunk Dreams" - Pixel_Pro (1,247 likes)',
        '  2. "Neon Nights" - Ghost_Master (892 likes)',
        '  3. "Digital Resistance" - Quantum_Beat (756 likes)',
        '',
        'Mensaje de la resistencia:',
        '  "Lo imperfecto también es sagrado"',
        '',
        'Accediendo al Santuario...'
      ]
    },
    matrix: {
      description: 'Efecto Matrix',
      execute: () => [
        'Iniciando efecto Matrix...',
        'Cargando código de la resistencia...',
        '',
        '01001000 01100101 01101100 01101100 01101111',
        '01010111 01101111 01110010 01101100 01100100',
        '01010010 01100101 01110011 01101001 01110011',
        '01110100 01100001 01101110 01100011 01100101',
        '',
        'Matrix activado. Presiona Ctrl+Alt+H para Nexus.'
      ]
    },
    clear: {
      description: 'Limpiar terminal',
      execute: () => []
    }
  };

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd) => {
    const [commandName, ...args] = cmd.trim().split(' ');
    const commandObj = commands[commandName];

    if (!commandObj) {
      addToHistory(`Comando '${commandName}' no encontrado. Usa 'help' para ver comandos disponibles.`);
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const output = commandObj.execute(args);
      if (output.length === 0) {
        setHistory([]);
      } else {
        addToHistory(output);
      }
      setIsTyping(false);
    }, 500);
  };

  const addToHistory = (output) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [
      ...prev,
      {
        type: 'output',
        content: Array.isArray(output) ? output : [output],
        timestamp
      }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Agregar comando al historial
    setHistory(prev => [
      ...prev,
      {
        type: 'command',
        content: `${currentUser}@nexus:${currentPath}$ ${command}`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    // Ejecutar comando
    executeCommand(command);
    setCommand('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="cyberpunk-terminal-overlay">
      <div className="cyberpunk-terminal">
        {/* Header */}
        <div className="terminal-header">
          <div className="terminal-title">
            <span className="terminal-icon">💻</span>
            <span>Son1kVers3 Terminal v2.1</span>
          </div>
          <div className="terminal-controls">
            <button className="terminal-btn minimize">−</button>
            <button className="terminal-btn maximize">□</button>
            <button className="terminal-btn close" onClick={onClose}>×</button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body" ref={terminalRef}>
          {/* Welcome Message */}
          <div className="terminal-line welcome">
            <span className="terminal-prompt">BELLA.exe@nexus:~$</span>
            <span className="terminal-text">
              Bienvenido a Son1kVers3 Terminal. Conectado a la Red de Grietas.
            </span>
          </div>

          {/* History */}
          {history.map((item, index) => (
            <div key={index} className="terminal-line">
              {item.type === 'command' ? (
                <div className="command-line">
                  <span className="terminal-prompt">{item.content}</span>
                </div>
              ) : (
                <div className="output-line">
                  {item.content.map((line, lineIndex) => (
                    <div key={lineIndex} className="output-text">{line}</div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Current Command */}
          <div className="terminal-line current-command">
            <span className="terminal-prompt">{currentUser}@nexus:{currentPath}$</span>
            <form onSubmit={handleSubmit} className="command-form">
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                className="command-input"
                placeholder="Escribe un comando..."
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="terminal-line typing">
              <span className="typing-indicator">BELLA.exe está procesando...</span>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="terminal-status">
          <span className="status-item">Conectado</span>
          <span className="status-item">Red de Grietas</span>
          <span className="status-item">Modo Sigilo</span>
          <span className="status-item">{history.length} comandos</span>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkTerminal;
