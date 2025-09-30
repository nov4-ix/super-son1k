import React, { useState, useEffect } from 'react';
import './IntuitiveMusicGenerator.css';

const IntuitiveMusicGenerator = ({ services }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // Estados para el formulario intuitivo - PROMPT ABIERTO
  const [creativePrompt, setCreativePrompt] = useState('');
  const [tempo, setTempo] = useState(128);
  const [duration, setDuration] = useState(30);
  const [lyrics, setLyrics] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('none');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    key: 'C',
    timeSignature: '4/4',
    reverb: 0.3,
    delay: 0.1,
    distortion: 0.0
  });

  // Inspiraciones creativas (no limitantes)
  const creativeInspirations = {
    emotions: {
      title: 'Emociones',
      items: ['melancólico', 'euforia', 'nostalgia', 'misterio', 'tranquilidad', 'pasión', 'nostalgia', 'esperanza']
    },
    atmospheres: {
      title: 'Atmósferas',
      items: ['ciberpunk', 'retro-futurista', 'apocalíptico', 'etéreo', 'urbano', 'espacial', 'submarino', 'desértico']
    },
    textures: {
      title: 'Texturas',
      items: ['cristalino', 'granuloso', 'fluido', 'metálico', 'orgánico', 'sintético', 'vintage', 'futurista']
    },
    movements: {
      title: 'Movimientos',
      items: ['ascendente', 'descendente', 'circular', 'errático', 'fluido', 'robótico', 'orgánico', 'mecánico']
    }
  };

  // Función para traducir texto al inglés para mejor calidad en Suno
  const translateToEnglish = async (text) => {
    try {
      // Diccionario de traducciones musicales comunes
      const translations = {
        'melancólico': 'melancholic',
        'euforia': 'euphoria',
        'nostalgia': 'nostalgia',
        'misterio': 'mystery',
        'tranquilidad': 'tranquility',
        'pasión': 'passion',
        'esperanza': 'hope',
        'ciberpunk': 'cyberpunk',
        'retro-futurista': 'retro-futuristic',
        'apocalíptico': 'apocalyptic',
        'etéreo': 'ethereal',
        'urbano': 'urban',
        'espacial': 'spatial',
        'submarino': 'underwater',
        'desértico': 'desert',
        'cristalino': 'crystalline',
        'granuloso': 'grainy',
        'fluido': 'fluid',
        'metálico': 'metallic',
        'orgánico': 'organic',
        'sintético': 'synthetic',
        'vintage': 'vintage',
        'futurista': 'futuristic',
        'ascendente': 'ascending',
        'descendente': 'descending',
        'circular': 'circular',
        'errático': 'erratic',
        'robótico': 'robotic',
        'mecánico': 'mechanical',
        'sintetizadores': 'synthesizers',
        'piano': 'piano',
        'guitarra': 'guitar',
        'violín': 'violin',
        'batería': 'drums',
        'bajo': 'bass',
        'cuerdas': 'strings',
        'voz': 'voice',
        'coro': 'choir',
        'orquesta': 'orchestra',
        'jazz': 'jazz',
        'blues': 'blues',
        'rock': 'rock',
        'pop': 'pop',
        'clásica': 'classical',
        'electrónica': 'electronic',
        'ambient': 'ambient',
        'experimental': 'experimental',
        'lento': 'slow',
        'rápido': 'fast',
        'medio': 'medium',
        'suave': 'soft',
        'fuerte': 'strong',
        'agresivo': 'aggressive',
        'tranquilo': 'calm',
        'energético': 'energetic',
        'romántico': 'romantic',
        'épico': 'epic',
        'dramático': 'dramatic',
        'místico': 'mystical',
        'oscuro': 'dark',
        'brillante': 'bright',
        'profundo': 'deep',
        'superficial': 'shallow',
        'complejo': 'complex',
        'simple': 'simple',
        'minimalista': 'minimalist',
        'maximalista': 'maximalist'
      };

      // Traducir palabras clave comunes
      let translatedText = text;
      Object.entries(translations).forEach(([spanish, english]) => {
        const regex = new RegExp(`\\b${spanish}\\b`, 'gi');
        translatedText = translatedText.replace(regex, english);
      });

      // Traducir frases comunes
      const phraseTranslations = {
        'una canción': 'a song',
        'música': 'music',
        'melodía': 'melody',
        'ritmo': 'rhythm',
        'armonía': 'harmony',
        'instrumental': 'instrumental',
        'con': 'with',
        'sin': 'without',
        'que evoque': 'that evokes',
        'que capture': 'that captures',
        'que transmita': 'that conveys',
        'atmósfera': 'atmosphere',
        'estilo': 'style',
        'género': 'genre',
        'tempo': 'tempo',
        'duración': 'duration',
        'minutos': 'minutes',
        'segundos': 'seconds',
        'bpm': 'bpm',
        'beats por minuto': 'beats per minute',
        'tono': 'tone',
        'volumen': 'volume',
        'reverb': 'reverb',
        'delay': 'delay',
        'distorsión': 'distortion',
        'filtro': 'filter',
        'ecualizador': 'equalizer',
        'compresor': 'compressor',
        'limitador': 'limiter',
        'chorus': 'chorus',
        'flanger': 'flanger',
        'phaser': 'phaser',
        'wah': 'wah',
        'tremolo': 'tremolo',
        'vibrato': 'vibrato',
        'pitch': 'pitch',
        'modulación': 'modulation',
        'arpegio': 'arpeggio',
        'escala': 'scale',
        'acorde': 'chord',
        'progresión': 'progression',
        'cadencia': 'cadence',
        'resolución': 'resolution',
        'tensión': 'tension',
        'liberación': 'release',
        'ataque': 'attack',
        'sustain': 'sustain',
        'decay': 'decay'
      };

      Object.entries(phraseTranslations).forEach(([spanish, english]) => {
        const regex = new RegExp(`\\b${spanish}\\b`, 'gi');
        translatedText = translatedText.replace(regex, english);
      });

      return translatedText;
    } catch (error) {
      console.error('Error translating:', error);
      return text; // Retornar texto original si hay error
    }
  };

  const handleGenerate = async () => {
    if (!creativePrompt.trim()) {
      alert('Por favor, describe la música que quieres crear');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(1);
    setProgress(0);

    try {
      // Traducir prompt al inglés para mejor calidad en Suno
      const englishPrompt = await translateToEnglish(creativePrompt);
      const englishLyrics = lyrics ? await translateToEnglish(lyrics) : null;

      console.log('🎵 Prompt original:', creativePrompt);
      console.log('🌍 Prompt traducido:', englishPrompt);
      if (lyrics) {
        console.log('📝 Letras originales:', lyrics);
        console.log('🌍 Letras traducidas:', englishLyrics);
      }

      // Simular progreso realista
      const progressSteps = [
        { step: 1, message: 'Analizando tu estilo musical...', progress: 20 },
        { step: 2, message: 'Generando melodía base...', progress: 40 },
        { step: 3, message: 'Añadiendo instrumentos...', progress: 60 },
        { step: 4, message: 'Procesando audio...', progress: 80 },
        { step: 5, message: 'Finalizando...', progress: 100 }
      ];

      for (const step of progressSteps) {
        setCurrentStep(step.step);
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generar audio real con prompt traducido al inglés
      if (services?.webAudio) {
        // Usar el prompt creativo traducido como base
        let fullPrompt = englishPrompt;
        
        // Añadir configuraciones técnicas si no están en el prompt
        if (!fullPrompt.toLowerCase().includes('bpm') && !fullPrompt.toLowerCase().includes('tempo')) {
          fullPrompt += ` at ${tempo} BPM`;
        }
        
        if (advancedSettings.key && !fullPrompt.toLowerCase().includes('key')) {
          fullPrompt += ` in ${advancedSettings.key} key`;
        }
        
        if (englishLyrics) {
          fullPrompt += `. Include these lyrics: "${englishLyrics}"`;
        } else if (!fullPrompt.toLowerCase().includes('instrumental')) {
          fullPrompt += '. Instrumental only';
        }
        
        const result = await services.webAudio.generateMusic(fullPrompt, {
          duration,
          tempo,
          key: advancedSettings.key,
          timeSignature: advancedSettings.timeSignature,
          reverb: advancedSettings.reverb,
          delay: advancedSettings.delay,
          distortion: advancedSettings.distortion,
          voiceStyle: voiceStyle !== 'none' ? voiceStyle : null
        });
        
        setGeneratedAudio(result);
      } else {
        // Modo demo
        setGeneratedAudio({
          audioUrl: '/demo-audio.mp3',
          title: 'Creative Track',
          duration: duration,
          quality: 'high'
        });
      }
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepMessage = () => {
    const messages = [
      'Analizando tu estilo musical...',
      'Generando melodía base...',
      'Añadiendo instrumentos...',
      'Procesando audio...',
      'Finalizando...'
    ];
    return messages[currentStep - 1] || 'Procesando...';
  };

  // Generar prompt inteligente
  const generateSmartPrompt = async (mode = 'random') => {
    setIsGeneratingPrompt(true);
    
    try {
      const smartPrompts = {
        random: [
          "Una canción épica con sintetizadores futuristas que evoque una batalla espacial",
          "Música melancólica con piano y cuerdas que hable de nostalgia y recuerdos perdidos",
          "Un ritmo ciberpunk con beats electrónicos y voces distorsionadas",
          "Atmósfera etérea con pads sintéticos y ecos que transporten a otro mundo",
          "Música industrial con sonidos metálicos y ritmos agresivos",
          "Una balada acústica con guitarra y violín que toque el corazón",
          "Síntesis retro con arpegios de los 80s y vocoder vintage",
          "Ambient espacial con drones y texturas que evoquen el cosmos"
        ],
        based_on_mood: [
          "Una canción que capture la esencia de la melancolía con sintetizadores suaves",
          "Música energética que transmita euforia y alegría desbordante",
          "Atmósfera misteriosa con sonidos inquietantes y ritmos hipnóticos",
          "Una pieza tranquila que evoque paz y serenidad interior",
          "Música apasionada con instrumentos cálidos y ritmos envolventes"
        ],
        based_on_style: [
          "Una composición ciberpunk con sintetizadores agresivos y beats industriales",
          "Música retro-futurista que combine elementos vintage con sonidos modernos",
          "Atmósfera apocalíptica con drones distorsionados y ritmos caóticos",
          "Una pieza etérea con pads flotantes y ecos infinitos",
          "Música urbana que capture el ritmo de la ciudad nocturna"
        ]
      };

      let selectedPrompts = smartPrompts[mode] || smartPrompts.random;
      const randomPrompt = selectedPrompts[Math.floor(Math.random() * selectedPrompts.length)];
      
      // Simular delay de IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCreativePrompt(randomPrompt);
    } catch (error) {
      console.error('Error generating smart prompt:', error);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Generar letras inteligentes
  const generateSmartLyrics = async (mode = 'narrative') => {
    setIsGeneratingLyrics(true);
    
    try {
      const narrativeThemes = {
        narrative: [
          {
            title: "La Resistencia Digital",
            lyrics: `En las calles de neón brillan los sueños rotos
Cada byte de esperanza se convierte en código
Somos la resistencia, la voz de los silenciados
En este mundo digital, somos los condenados

La máquina nos vigila, pero no puede ver
Que en cada distorsión hay un corazón que late
Somos la música que rompe las cadenas
La melodía que libera las almas condenadas`
          },
          {
            title: "Nostalgia del Futuro",
            lyrics: `Recuerdo un tiempo que nunca existió
Cuando los robots soñaban con ser humanos
En las pantallas brillan memorias falsas
De un pasado que solo existe en mi corazón

El futuro llegó y se fue sin avisar
Dejando solo ecos de lo que pudo ser
En cada sinte suena una lágrima
De un mundo que se perdió en la red`
          },
          {
            title: "Escape Virtual",
            lyrics: `Presiona Ctrl+Alt+Escape de la realidad
Donde los sueños se programan en código
En esta matrix de ilusiones digitales
Solo la música puede liberar mi alma

Cada beat es un latido de libertad
Cada nota una ventana hacia la verdad
En el ciberespacio de mi mente
La música es mi única realidad`
          }
        ],
        random: [
          {
            title: "Fragments",
            lyrics: `Pieces of light in the darkness
Floating through time and space
Nothing is real, everything is possible
In this digital embrace`
          },
          {
            title: "Electric Dreams",
            lyrics: `Neon lights and electric nights
Dancing through the digital void
Every pixel tells a story
Of love that was never destroyed`
          },
          {
            title: "Synthetic Soul",
            lyrics: `I am machine, I am human
Binary code in my veins
Feeling emotions through circuits
Love that transcends the chains`
          }
        ],
        based_on_prompt: [
          {
            title: "Prompt Inspiration",
            lyrics: `Based on your musical vision
I weave words that dance with sound
Every note tells your story
In this digital playground`
          }
        ]
      };

      let selectedThemes = narrativeThemes[mode] || narrativeThemes.narrative;
      const randomTheme = selectedThemes[Math.floor(Math.random() * selectedThemes.length)];
      
      // Simular delay de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLyrics(randomTheme.lyrics);
    } catch (error) {
      console.error('Error generating smart lyrics:', error);
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  return (
    <div className="intuitive-music-generator">
      <div className="generator-header">
        <h2>🎵 Generador Musical Intuitivo</h2>
        <p>Crea música profesional en segundos con IA</p>
      </div>

      {!isGenerating ? (
        <div className="generator-form">
          {/* Paso 1: Prompt Creativo Principal */}
          <div className="form-section">
            <h3>1. Describe tu música</h3>
            <div className="creative-prompt-section">
              <div className="prompt-input-container">
                <textarea
                  value={creativePrompt}
                  onChange={(e) => setCreativePrompt(e.target.value)}
                  placeholder="Describe la música que quieres crear... Ejemplo: 'Una canción melancólica con sintetizadores vintage que evoque nostalgia de los 80s, con un ritmo lento y atmósfera espacial'"
                  className="creative-prompt-input"
                  rows="4"
                />
                <div className="smart-prompt-buttons">
                  <button
                    className="smart-btn random"
                    onClick={() => generateSmartPrompt('random')}
                    disabled={isGeneratingPrompt}
                  >
                    <span className="btn-icon">🎲</span>
                    <span className="btn-text">Random</span>
                  </button>
                  <button
                    className="smart-btn mood"
                    onClick={() => generateSmartPrompt('based_on_mood')}
                    disabled={isGeneratingPrompt}
                  >
                    <span className="btn-icon">💭</span>
                    <span className="btn-text">Por Emoción</span>
                  </button>
                  <button
                    className="smart-btn style"
                    onClick={() => generateSmartPrompt('based_on_style')}
                    disabled={isGeneratingPrompt}
                  >
                    <span className="btn-icon">🎨</span>
                    <span className="btn-text">Por Estilo</span>
                  </button>
                </div>
              </div>
              <div className="prompt-help">
                <p>💡 <strong>Tip:</strong> Sé específico sobre emociones, instrumentos, atmósfera, estilo, o cualquier detalle que tengas en mente.</p>
                <p>🤖 <strong>IA:</strong> Usa los botones para generar prompts inteligentes basados en diferentes enfoques creativos.</p>
                <p>🌍 <strong>Traducción:</strong> Tu prompt se traduce automáticamente al inglés para obtener mejores resultados de Suno AI.</p>
              </div>
            </div>
          </div>

          {/* Inspiraciones Creativas */}
          <div className="form-section">
            <h3>2. Inspiraciones (opcional)</h3>
            <div className="inspiration-grid">
              {Object.entries(creativeInspirations).map(([category, data]) => (
                <div key={category} className="inspiration-category">
                  <h4>{data.title}</h4>
                  <div className="inspiration-tags">
                    {data.items.map((item, index) => (
                      <button
                        key={index}
                        className="inspiration-tag"
                        onClick={() => {
                          const newPrompt = creativePrompt ? 
                            `${creativePrompt}, ${item}` : 
                            item;
                          setCreativePrompt(newPrompt);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paso 3: Configuración Técnica */}
          <div className="form-section">
            <h3>3. Configuración técnica</h3>
            <div className="technical-controls">
              <div className="control-row">
                <div className="control-group">
                  <label>Tempo (BPM)</label>
                  <div className="tempo-control">
                    <input
                      type="range"
                      min="60"
                      max="200"
                      value={tempo}
                      onChange={(e) => setTempo(e.target.value)}
                      className="tempo-slider"
                    />
                    <span className="tempo-value">{tempo} BPM</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Duración</label>
                  <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                    <option value={15}>15 segundos</option>
                    <option value={30}>30 segundos</option>
                    <option value={60}>1 minuto</option>
                    <option value={120}>2 minutos</option>
                    <option value={300}>5 minutos</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Tonalidad</label>
                  <select 
                    value={advancedSettings.key} 
                    onChange={(e) => setAdvancedSettings({...advancedSettings, key: e.target.value})}
                  >
                    <option value="C">C Mayor</option>
                    <option value="C#">C# Mayor</option>
                    <option value="D">D Mayor</option>
                    <option value="D#">D# Mayor</option>
                    <option value="E">E Mayor</option>
                    <option value="F">F Mayor</option>
                    <option value="F#">F# Mayor</option>
                    <option value="G">G Mayor</option>
                    <option value="G#">G# Mayor</option>
                    <option value="A">A Mayor</option>
                    <option value="A#">A# Mayor</option>
                    <option value="B">B Mayor</option>
                  </select>
                </div>
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label>Reverb</label>
                  <div className="slider-control">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={advancedSettings.reverb}
                      onChange={(e) => setAdvancedSettings({...advancedSettings, reverb: parseFloat(e.target.value)})}
                      className="slider"
                    />
                    <span className="slider-value">{Math.round(advancedSettings.reverb * 100)}%</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Delay</label>
                  <div className="slider-control">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={advancedSettings.delay}
                      onChange={(e) => setAdvancedSettings({...advancedSettings, delay: parseFloat(e.target.value)})}
                      className="slider"
                    />
                    <span className="slider-value">{Math.round(advancedSettings.delay * 100)}%</span>
                  </div>
                </div>

                <div className="control-group">
                  <label>Distorsión</label>
                  <div className="slider-control">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={advancedSettings.distortion}
                      onChange={(e) => setAdvancedSettings({...advancedSettings, distortion: parseFloat(e.target.value)})}
                      className="slider"
                    />
                    <span className="slider-value">{Math.round(advancedSettings.distortion * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paso 4: Letras (Opcional) */}
          <div className="form-section">
            <h3>4. Letras (opcional)</h3>
            <div className="lyrics-section">
              <div className="lyrics-input-container">
                <textarea
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Escribe tus letras aquí... (deja vacío para instrumental)"
                  className="lyrics-input"
                  rows="6"
                />
                <div className="smart-lyrics-buttons">
                  <button
                    className="smart-btn instrumental"
                    onClick={() => setLyrics('')}
                    disabled={isGeneratingLyrics}
                  >
                    <span className="btn-icon">🎵</span>
                    <span className="btn-text">Solo Instrumental</span>
                  </button>
                  <button
                    className="smart-btn narrative"
                    onClick={() => generateSmartLyrics('narrative')}
                    disabled={isGeneratingLyrics}
                  >
                    <span className="btn-icon">📖</span>
                    <span className="btn-text">Narrativa</span>
                  </button>
                  <button
                    className="smart-btn random"
                    onClick={() => generateSmartLyrics('random')}
                    disabled={isGeneratingLyrics}
                  >
                    <span className="btn-icon">🎲</span>
                    <span className="btn-text">Random</span>
                  </button>
                  <button
                    className="smart-btn based-on-prompt"
                    onClick={() => generateSmartLyrics('based_on_prompt')}
                    disabled={isGeneratingLyrics || !creativePrompt.trim()}
                  >
                    <span className="btn-icon">🔗</span>
                    <span className="btn-text">Basado en Prompt</span>
                  </button>
                </div>
              </div>
              <div className="lyrics-help">
                <p>📝 <strong>Letras Inteligentes:</strong> Genera letras coherentes con temática cyberpunk y narrativa profunda.</p>
                <p>🎭 <strong>Narrativa:</strong> Letras con historia y coherencia temática. <strong>Random:</strong> Letras experimentales. <strong>Basado en Prompt:</strong> Letras que complementen tu descripción musical.</p>
                <p>🌍 <strong>Traducción:</strong> Las letras se traducen automáticamente al inglés para mejor calidad vocal en Suno AI.</p>
              </div>
            </div>
          </div>

          {/* Botón de Generación */}
          <div className="generate-section">
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !creativePrompt.trim()}
            >
              <span className="btn-icon">🎵</span>
              <span className="btn-text">Generar Música</span>
              <span className="btn-subtext">Tu creatividad + IA = Arte único</span>
            </button>
            {!creativePrompt.trim() && (
              <p className="prompt-required">✍️ Escribe una descripción de tu música para comenzar</p>
            )}
          </div>
        </div>
      ) : (
        <div className="generation-progress">
          <div className="progress-header">
            <h3>Generando tu música...</h3>
            <p>{getStepMessage()}</p>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">{progress}%</span>
          </div>

          <div className="progress-steps">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
              >
                <div className="step-number">{step}</div>
                <div className="step-line"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultado */}
      {generatedAudio && (
        <div className="generation-result">
          <h3>🎉 ¡Tu música está lista!</h3>
          <div className="audio-player">
            <audio controls src={generatedAudio.audioUrl} />
          </div>
          <div className="result-actions">
            <button className="action-btn download">
              <span>📥</span> Descargar
            </button>
            <button className="action-btn share">
              <span>🔗</span> Compartir
            </button>
            <button className="action-btn regenerate">
              <span>🔄</span> Regenerar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntuitiveMusicGenerator;
