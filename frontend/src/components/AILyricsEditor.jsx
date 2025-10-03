import React, { useState, useRef, useEffect } from 'react';
import './AILyricsEditor.css';

const AILyricsEditor = () => {
  const [lyrics, setLyrics] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [mood, setMood] = useState('happy');
  const [language, setLanguage] = useState('es');
  const [isGenerating, setIsGenerating] = useState(false);
  const [rhymeScheme, setRhymeScheme] = useState('AABB');
  const [syllableCount, setSyllableCount] = useState(8);
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const editorRef = useRef(null);

  const genres = ['pop', 'rock', 'hip-hop', 'reggaeton', 'trap', 'ballad', 'electronic', 'country'];
  const moods = ['happy', 'sad', 'energetic', 'romantic', 'melancholic', 'angry', 'peaceful', 'mysterious'];
  const rhymeSchemes = ['AABB', 'ABAB', 'ABCB', 'FREE'];

  useEffect(() => {
    // Cargar letras guardadas del localStorage
    const saved = localStorage.getItem('savedLyrics');
    if (saved) {
      setLyrics(saved);
    }
  }, []);

  const generateLyrics = async () => {
    setIsGenerating(true);
    
    // Simular llamada a API de IA
    setTimeout(() => {
      const generatedLyrics = generateAILyrics();
      setLyrics(generatedLyrics);
      addToHistory(generatedLyrics);
      setIsGenerating(false);
    }, 2000);
  };

  const generateAILyrics = () => {
    const templates = {
      pop: [
        "En la noche estrellada, tu mirada me cautiva\nCada momento contigo, mi corazón revive\nBailamos bajo la luna, sin pensar en mañana\nEste amor que nos une, nunca se apaga",
        "Luces de neón brillando, la ciudad despierta\nTu sonrisa ilumina, cada puerta abierta\nJuntos somos invencibles, nada nos detiene\nEste ritmo en mi pecho, siempre se mantiene"
      ],
      'hip-hop': [
        "Desde el barrio vengo yo, con flow y actitud\nMi mensaje es real, pura verdad y virtud\nRimas que cortan profundo, como espada de samurái\nEn el mic soy el rey, nadie me puede parar aquí",
        "Levanto mi voz, por los que no pueden hablar\nCada verso es un golpe, que hace el mundo temblar\nDel underground vengo, con hambre de triunfar\nMi historia en cada línea, la voy a plasmar"
      ],
      reggaeton: [
        "Dale mamá, muévete así\nQue esta noche es para ti\nEl ritmo te llama, no puedes resistir\nVamos a bailar hasta el amanecer aquí",
        "Perreo intenso, la pista está que arde\nTu cuerpo y el mío, no hay quien nos pare\nLa música suena, el bajo retumba\nEsta noche es nuestra, la fiesta no termina"
      ]
    };

    const genreLyrics = templates[selectedGenre] || templates.pop;
    return genreLyrics[Math.floor(Math.random() * genreLyrics.length)];
  };

  const improveLine = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const lines = [
        "Y en tus ojos veo el universo brillar",
        "Como estrella fugaz, cruzas mi cielo sin parar",
        "El tiempo se detiene cuando estás aquí",
        "Tu voz es melodía que me hace sentir",
        "Entre sombras y luces, te vuelvo a encontrar",
        "Cada latido es un verso que quiero cantar"
      ];
      
      const newLine = lines[Math.floor(Math.random() * lines.length)];
      const cursorPos = editorRef.current?.selectionStart || lyrics.length;
      const newLyrics = lyrics.slice(0, cursorPos) + '\n' + newLine + lyrics.slice(cursorPos);
      setLyrics(newLyrics);
      addToHistory(newLyrics);
      setIsGenerating(false);
    }, 1000);
  };

  const suggestRhyme = (word) => {
    const rhymes = {
      'amor': ['dolor', 'calor', 'color', 'flor', 'temor'],
      'corazón': ['pasión', 'canción', 'ilusión', 'emoción', 'razón'],
      'vida': ['herida', 'partida', 'perdida', 'querida', 'salida'],
      'noche': ['derroche', 'reproche', 'broche', 'oche', 'coche'],
      'día': ['alegría', 'melodía', 'compañía', 'energía', 'poesía']
    };

    return rhymes[word.toLowerCase()] || ['sol', 'mar', 'luz', 'paz', 'voz'];
  };

  const analyzeLyrics = () => {
    const lines = lyrics.split('\n').filter(line => line.trim());
    const words = lyrics.split(/\s+/).filter(word => word.trim());
    const verses = lyrics.split('\n\n').filter(v => v.trim());

    return {
      lines: lines.length,
      words: words.length,
      verses: verses.length,
      characters: lyrics.length,
      avgWordsPerLine: lines.length > 0 ? (words.length / lines.length).toFixed(1) : 0
    };
  };

  const addToHistory = (text) => {
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), text];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setLyrics(history[currentHistoryIndex - 1]);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setLyrics(history[currentHistoryIndex + 1]);
    }
  };

  const saveLyrics = () => {
    localStorage.setItem('savedLyrics', lyrics);
    alert('✅ Letras guardadas exitosamente');
  };

  const exportLyrics = () => {
    const blob = new Blob([lyrics], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyrics_${Date.now()}.txt`;
    a.click();
  };

  const stats = analyzeLyrics();

  return (
    <div className="ai-lyrics-editor">
      <div className="editor-header">
        <h1>✍️ Editor de Letras con IA</h1>
        <p>Crea letras increíbles con asistencia de inteligencia artificial</p>
      </div>

      <div className="editor-layout">
        <div className="editor-sidebar">
          <div className="control-section">
            <h3>🎨 Configuración</h3>
            
            <div className="control-group">
              <label>Género Musical</label>
              <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Estado de Ánimo</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                {moods.map(m => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Idioma</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
              </select>
            </div>

            <div className="control-group">
              <label>Esquema de Rima</label>
              <select value={rhymeScheme} onChange={(e) => setRhymeScheme(e.target.value)}>
                {rhymeSchemes.map(scheme => (
                  <option key={scheme} value={scheme}>{scheme}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>Sílabas por Verso</label>
              <input 
                type="range" 
                min="4" 
                max="16" 
                value={syllableCount}
                onChange={(e) => setSyllableCount(e.target.value)}
              />
              <span className="syllable-count">{syllableCount}</span>
            </div>
          </div>

          <div className="ai-actions">
            <h3>🤖 Asistente IA</h3>
            <button 
              className="ai-btn generate-btn"
              onClick={generateLyrics}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generando...' : '✨ Generar Letras'}
            </button>
            <button 
              className="ai-btn improve-btn"
              onClick={improveLine}
              disabled={isGenerating}
            >
              💡 Improvisar Línea
            </button>
            <button className="ai-btn suggest-btn">
              🎯 Sugerir Rimas
            </button>
            <button className="ai-btn enhance-btn">
              🚀 Mejorar Texto
            </button>
          </div>

          <div className="stats-section">
            <h3>📊 Estadísticas</h3>
            <div className="stat-item">
              <span>Líneas:</span>
              <strong>{stats.lines}</strong>
            </div>
            <div className="stat-item">
              <span>Palabras:</span>
              <strong>{stats.words}</strong>
            </div>
            <div className="stat-item">
              <span>Versos:</span>
              <strong>{stats.verses}</strong>
            </div>
            <div className="stat-item">
              <span>Caracteres:</span>
              <strong>{stats.characters}</strong>
            </div>
            <div className="stat-item">
              <span>Palabras/Línea:</span>
              <strong>{stats.avgWordsPerLine}</strong>
            </div>
          </div>
        </div>

        <div className="editor-main">
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button onClick={undo} disabled={currentHistoryIndex <= 0} title="Deshacer">
                ↶ Deshacer
              </button>
              <button onClick={redo} disabled={currentHistoryIndex >= history.length - 1} title="Rehacer">
                ↷ Rehacer
              </button>
            </div>
            <div className="toolbar-group">
              <button onClick={saveLyrics}>💾 Guardar</button>
              <button onClick={exportLyrics}>📥 Exportar</button>
              <button onClick={() => setLyrics('')}>🗑️ Limpiar</button>
            </div>
          </div>

          <div className="editor-container">
            <textarea
              ref={editorRef}
              className="lyrics-textarea"
              value={lyrics}
              onChange={(e) => {
                setLyrics(e.target.value);
                addToHistory(e.target.value);
              }}
              placeholder="Escribe tus letras aquí o usa el asistente IA para generar contenido..."
              spellCheck="false"
            />
            <div className="editor-overlay">
              {isGenerating && (
                <div className="generating-indicator">
                  <div className="spinner"></div>
                  <p>Generando contenido con IA...</p>
                </div>
              )}
            </div>
          </div>

          <div className="suggestions-panel">
            <h4>💭 Sugerencias de IA</h4>
            <div className="suggestions-list">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, i) => (
                  <div key={i} className="suggestion-item">
                    <p>{suggestion}</p>
                    <button onClick={() => setLyrics(lyrics + '\n' + suggestion)}>
                      ➕ Agregar
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-suggestions">
                  Usa los botones de IA para obtener sugerencias
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILyricsEditor;
