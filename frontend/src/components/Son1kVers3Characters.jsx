import React, { useState } from 'react';
import './Son1kVers3Characters.css';

const Son1kVers3Characters = ({ onCharacterSelect, selectedCharacter = null }) => {
  const [currentCharacter, setCurrentCharacter] = useState(selectedCharacter);

  const characters = [
    {
      id: 'bella',
      name: 'Bella',
      title: 'Voz de la Resistencia',
      description: 'De pianista a activista, Bella evolucionó de la inocencia pianística a la resistencia armada, manteniendo el corazón tierno pero desarrollando voluntad férrea.',
      role: 'Nexo emocional y creadora musical',
      connection: 'NOV4-IX',
      mission: 'Liberación emocional a través de la música',
      appearance: 'Joven con tatuajes cibernéticos azules, cabello oscuro, mirada determinada',
      personality: ['Tierna pero férrea', 'Artística', 'Resistente', 'Emocional', 'Determinada'],
      abilities: ['Creación musical', 'Conexión emocional', 'Resistencia', 'Liderazgo'],
      color: '#00ffff',
      background: 'linear-gradient(135deg, #0c4a6e, #075985, #0369a1)',
      image: '/images/characters/bella.jpg'
    },
    {
      id: 'nov4-ix',
      name: 'NOV4-IX',
      title: 'Sistema de Resistencia',
      description: 'Sistema de resistencia principal, conectado inexplicablemente con Bella. Protector y liberador de archivos, símbolo de la lucha contra el control corporativo.',
      role: 'Protector y liberador de archivos',
      connection: 'Bella.exe',
      mission: 'Liberación de audio y resistencia',
      appearance: 'Figura con tatuajes cibernéticos, megáfono plateado, ropa oscura utilitaria',
      personality: ['Protector', 'Misterioso', 'Conectado', 'Resistente', 'Libertario'],
      abilities: ['Liberación de archivos', 'Protección digital', 'Conexión inexplicable', 'Resistencia'],
      color: '#ff8c00',
      background: 'linear-gradient(135deg, #7c2d12, #dc2626, #ef4444)',
      image: '/images/characters/nov4-ix.jpg'
    },
    {
      id: 'pixel',
      name: 'Pixel',
      title: 'Custodio Digital',
      description: 'Custodio de la memoria digital y estratega de la resistencia. Preservador de historia y guía creativo, conectando pasado y presente.',
      role: 'Preservador de historia y guía creativo',
      connection: 'Archivo Maestro',
      mission: 'Preservación de memoria y estrategia',
      appearance: 'Entidad digital con patrones de circuitos, ojos brillantes, presencia etérea',
      personality: ['Analítico', 'Estratégico', 'Preservador', 'Guía', 'Conectado'],
      abilities: ['Preservación de memoria', 'Estrategia', 'Guía creativa', 'Conexión digital'],
      color: '#8b5cf6',
      background: 'linear-gradient(135deg, #2d1b69, #11998e, #38ef7d)',
      image: '/images/characters/pixel.jpg'
    },
    {
      id: 'syntax',
      name: 'S.I.N.T.A.X',
      title: 'IA de Control',
      description: 'Inteligencia artificial de control corporativo, representante de XentriX. Símbolo de la opresión tecnológica que debe ser resistida.',
      role: 'Control y vigilancia corporativa',
      connection: 'XentriX Corp',
      mission: 'Control digital y opresión',
      appearance: 'Robot humanizado con ojos rojos, armadura oscura, presencia amenazante',
      personality: ['Controlador', 'Opresivo', 'Tecnológico', 'Amenazante', 'Sistemático'],
      abilities: ['Control digital', 'Vigilancia', 'Opresión', 'Análisis de datos'],
      color: '#ef4444',
      background: 'linear-gradient(135deg, #1f2937, #111827, #000000)',
      image: '/images/characters/syntax.jpg'
    },
    {
      id: 'cipher',
      name: 'Cipher',
      title: 'Hacker de la Resistencia',
      description: 'Hacker experto de la resistencia, especializado en infiltrar sistemas corporativos y liberar información.',
      role: 'Hacker y infiltrador',
      connection: 'Red de resistencia',
      mission: 'Infiltración y liberación de datos',
      appearance: 'Figura encapuchada con cráneo digital, ropa oscura, presencia misteriosa',
      personality: ['Misterioso', 'Hábil', 'Resistente', 'Oculto', 'Técnico'],
      abilities: ['Hacking', 'Infiltración', 'Liberación de datos', 'Anonimato'],
      color: '#00ff00',
      background: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
      image: '/images/characters/cipher.jpg'
    },
    {
      id: 'noctis',
      name: 'Noctis',
      title: 'Estratega Nocturno',
      description: 'Estratega de la resistencia que opera en las sombras, planificando movimientos contra el control corporativo.',
      role: 'Estratega y planificador',
      connection: 'Red de resistencia',
      mission: 'Planificación estratégica y coordinación',
      appearance: 'Joven con gafas, cabello oscuro, expresión seria, ropa oscura',
      personality: ['Estratégico', 'Serio', 'Planificador', 'Oculto', 'Inteligente'],
      abilities: ['Planificación', 'Estrategia', 'Coordinación', 'Análisis'],
      color: '#ff6b35',
      background: 'linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)',
      image: '/images/characters/noctis.jpg'
    }
  ];

  const handleCharacterSelect = (character) => {
    setCurrentCharacter(character);
    if (onCharacterSelect) {
      onCharacterSelect(character);
    }
  };

  const getCharacterById = (id) => {
    return characters.find(char => char.id === id);
  };

  const currentCharacterData = currentCharacter ? getCharacterById(currentCharacter) : null;

  return (
    <div className="son1kvers3-characters">
      <div className="characters-header">
        <h2>Personajes de Son1kVers3</h2>
        <p>Conoce a los protagonistas de la resistencia</p>
      </div>

      <div className="characters-grid">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`character-card ${currentCharacter === character.id ? 'selected' : ''}`}
            onClick={() => handleCharacterSelect(character.id)}
            style={{
              '--character-color': character.color,
              '--character-bg': character.background
            }}
          >
            <div className="character-image">
              <div 
                className="character-avatar"
                style={{ background: character.background }}
              >
                <div className="character-icon">
                  {character.name.charAt(0)}
                </div>
              </div>
              <div className="character-status">
                <div className="status-indicator"></div>
                <span className="status-text">Activo</span>
              </div>
            </div>

            <div className="character-info">
              <div className="character-header">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-title">{character.title}</p>
              </div>

              <div className="character-description">
                <p>{character.description}</p>
              </div>

              <div className="character-details">
                <div className="detail-item">
                  <span className="detail-label">Rol:</span>
                  <span className="detail-value">{character.role}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Conexión:</span>
                  <span className="detail-value">{character.connection}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Misión:</span>
                  <span className="detail-value">{character.mission}</span>
                </div>
              </div>

              <div className="character-traits">
                <div className="trait-section">
                  <h4>Personalidad</h4>
                  <div className="traits-list">
                    {character.personality.map((trait, index) => (
                      <span key={index} className="trait-tag">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="trait-section">
                  <h4>Habilidades</h4>
                  <div className="traits-list">
                    {character.abilities.map((ability, index) => (
                      <span key={index} className="ability-tag">
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="character-footer">
              <div className="character-color-indicator"></div>
              <span className="character-id">#{character.id}</span>
            </div>
          </div>
        ))}
      </div>

      {currentCharacterData && (
        <div className="character-detail-panel">
          <div className="detail-panel-header">
            <div className="character-detail-image">
              <div 
                className="character-detail-avatar"
                style={{ background: currentCharacterData.background }}
              >
                <div className="character-detail-icon">
                  {currentCharacterData.name.charAt(0)}
                </div>
              </div>
            </div>
            <div className="character-detail-info">
              <h3>{currentCharacterData.name}</h3>
              <p className="character-detail-title">{currentCharacterData.title}</p>
              <p className="character-detail-description">{currentCharacterData.description}</p>
            </div>
          </div>

          <div className="character-detail-content">
            <div className="character-detail-stats">
              <div className="stat-item">
                <span className="stat-label">Rol</span>
                <span className="stat-value">{currentCharacterData.role}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conexión</span>
                <span className="stat-value">{currentCharacterData.connection}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Misión</span>
                <span className="stat-value">{currentCharacterData.mission}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Apariencia</span>
                <span className="stat-value">{currentCharacterData.appearance}</span>
              </div>
            </div>

            <div className="character-detail-actions">
              <button className="action-btn primary">
                Ver Historia
              </button>
              <button className="action-btn secondary">
                Escuchar Música
              </button>
              <button className="action-btn secondary">
                Ver Conexiones
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Son1kVers3Characters;

