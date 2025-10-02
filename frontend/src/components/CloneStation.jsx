/**
 * 🎤 Clone Station - Clonación Vocal Avanzada
 * Integra so-VITS y Bark con procesamiento profesional Waves
 * Para inferencia vocal en pistas y creación de contenido
 */

import React, { useState, useEffect, useRef } from 'react';
import './CloneStation.css';

const CloneStation = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, train, clone, process, export
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceModel, setVoiceModel] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [clonedAudio, setClonedAudio] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Nuevos estados para funcionalidades mejoradas
  const [voiceSamples, setVoiceSamples] = useState([]); // Múltiples muestras de voz
  const [selectedPretrainedVoice, setSelectedPretrainedVoice] = useState(null);
  const [userLibrary, setUserLibrary] = useState([]); // Biblioteca personal del usuario
  const [selectedTrackForInference, setSelectedTrackForInference] = useState(null);
  const [textForNarration, setTextForNarration] = useState('');
  const [narrationMode, setNarrativeMode] = useState('podcast'); // podcast, video, audiobook
  const [voiceModulation, setVoiceModulation] = useState({
    pitch: 0,
    speed: 1.0,
    emotion: 'neutral',
    accent: 'none'
  });
  
  // Configuración de efectos Waves
  const [wavesEffects, setWavesEffects] = useState({
    compressor: {
      enabled: true,
      threshold: -12,
      ratio: 4,
      attack: 3,
      release: 100,
      makeupGain: 2
    },
    eq: {
      enabled: true,
      lowCut: 80,
      lowMid: 0,
      highMid: 2,
      highShelf: 1,
      presence: 0
    },
    reverb: {
      enabled: false,
      roomSize: 0.3,
      damping: 0.5,
      wetLevel: 0.2,
      dryLevel: 0.8
    },
    delay: {
      enabled: false,
      time: 250,
      feedback: 0.3,
      wetLevel: 0.15
    },
    deEsser: {
      enabled: true,
      frequency: 6000,
      threshold: -15,
      ratio: 3
    },
    saturation: {
      enabled: false,
      drive: 0.2,
      type: 'tube' // 'tube', 'tape', 'transistor'
    }
  });

  // Modelos de voz disponibles (so-VITS y Bark)
  const voiceModels = {
    'so-vits': {
      name: 'so-VITS',
      description: 'Clonación de alta calidad para canto',
      quality: 'Ultra High',
      speed: 'Slow',
      bestFor: 'Música, canto, melodías'
    },
    'bark': {
      name: 'Bark',
      description: 'Clonación rápida para habla',
      quality: 'High',
      speed: 'Fast', 
      bestFor: 'Podcasts, narración, diálogos'
    }
  };

  // Voces preentrenadas disponibles
  const pretrainedVoices = {
    'spanish_male_1': {
      name: 'Carlos - Locutor Profesional',
      language: 'Español',
      gender: 'Masculino',
      style: 'Profesional, claro',
      bestFor: 'Podcasts, noticias, documentales',
      sample: '/samples/carlos_sample.wav'
    },
    'spanish_female_1': {
      name: 'María - Voz Cálida',
      language: 'Español',
      gender: 'Femenino',
      style: 'Cálida, expresiva',
      bestFor: 'Audiolibros, narraciones, comerciales',
      sample: '/samples/maria_sample.wav'
    },
    'spanish_male_2': {
      name: 'Diego - Voz Joven',
      language: 'Español',
      gender: 'Masculino',
      style: 'Joven, dinámico',
      bestFor: 'YouTube, TikTok, contenido juvenil',
      sample: '/samples/diego_sample.wav'
    },
    'english_male_1': {
      name: 'James - British Accent',
      language: 'English',
      gender: 'Male',
      style: 'Sophisticated, clear',
      bestFor: 'Documentaries, education',
      sample: '/samples/james_sample.wav'
    },
    'english_female_1': {
      name: 'Emma - American Accent',
      language: 'English',
      gender: 'Female',
      style: 'Friendly, professional',
      bestFor: 'Commercials, tutorials',
      sample: '/samples/emma_sample.wav'
    }
  };

  // Modos de narración disponibles
  const narrationModes = {
    'podcast': {
      name: 'Podcast',
      description: 'Optimizado para conversaciones y entrevistas',
      effects: {
        compressor: { threshold: -18, ratio: 3 },
        eq: { lowCut: 100, presence: 2 },
        deEsser: { enabled: true }
      }
    },
    'video': {
      name: 'Video/YouTube',
      description: 'Para narraciones de video y contenido online',
      effects: {
        compressor: { threshold: -16, ratio: 3.5 },
        eq: { presence: 3, highMid: 2 },
        deEsser: { enabled: true }
      }
    },
    'audiobook': {
      name: 'Audiolibro',
      description: 'Para lectura de libros y textos largos',
      effects: {
        compressor: { threshold: -20, ratio: 2.5 },
        eq: { lowCut: 80, lowMid: 1 },
        reverb: { enabled: true, roomSize: 0.2 }
      }
    },
    'commercial': {
      name: 'Comercial',
      description: 'Para anuncios y promociones',
      effects: {
        compressor: { threshold: -14, ratio: 4 },
        eq: { highMid: 3, presence: 4 },
        saturation: { enabled: true, drive: 0.2 }
      }
    }
  };

  // Presets de efectos para diferentes tipos de contenido
  const effectPresets = {
    podcast: {
      name: 'Podcast Pro',
      compressor: { threshold: -18, ratio: 3, attack: 5, release: 50 },
      eq: { lowCut: 100, lowMid: -1, highMid: 3, presence: 2 },
      deEsser: { enabled: true, threshold: -12 }
    },
    music: {
      name: 'Vocal Music',
      compressor: { threshold: -15, ratio: 4, attack: 2, release: 80 },
      eq: { lowCut: 80, lowMid: 1, highMid: 2, highShelf: 1.5 },
      reverb: { enabled: true, roomSize: 0.4, wetLevel: 0.25 }
    },
    youtube: {
      name: 'YouTube Voice',
      compressor: { threshold: -16, ratio: 3.5, attack: 3, release: 60 },
      eq: { lowCut: 90, presence: 3 },
      deEsser: { enabled: true }
    },
    tiktok: {
      name: 'TikTok Punch',
      compressor: { threshold: -14, ratio: 5, attack: 1, release: 40 },
      eq: { lowMid: 2, highMid: 3, presence: 4 },
      saturation: { enabled: true, drive: 0.3 }
    }
  };

  const fileInputRef = useRef(null);
  const voiceSamplesInputRef = useRef(null);
  const trackUploadInputRef = useRef(null);
  const audioRef = useRef(null);

  // Cargar biblioteca del usuario al montar el componente
  useEffect(() => {
    loadUserLibrary();
  }, []);

  // Manejar subida de múltiples muestras de voz
  const handleVoiceSamplesUpload = (event) => {
    const files = Array.from(event.target.files);
    const newSamples = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      duration: null // Se calculará después
    }));
    
    setVoiceSamples(prev => [...prev, ...newSamples]);
    console.log('Muestras de voz subidas:', newSamples.length);
  };

  // Manejar subida de archivo individual (compatibilidad)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      console.log('Archivo subido:', file.name);
    }
  };

  // Cargar biblioteca personal del usuario
  const loadUserLibrary = async () => {
    try {
      const response = await fetch('/api/user/library');
      const data = await response.json();
      if (data.success) {
        setUserLibrary(data.tracks);
      }
    } catch (error) {
      console.error('Error cargando biblioteca:', error);
    }
  };

  // Subir pista para inferencia
  const handleTrackUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const track = {
        id: Date.now(),
        file: file,
        name: file.name,
        url: URL.createObjectURL(file),
        type: 'uploaded'
      };
      setSelectedTrackForInference(track);
    }
  };

  // Seleccionar pista de la biblioteca
  const selectLibraryTrack = (track) => {
    setSelectedTrackForInference({
      ...track,
      type: 'library'
    });
  };

  // Remover muestra de voz
  const removeSample = (sampleId) => {
    setVoiceSamples(prev => prev.filter(sample => sample.id !== sampleId));
  };

  // Entrenar modelo de voz
  const trainVoiceModel = async () => {
    if (!audioFile) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Simular proceso de entrenamiento
      const steps = [
        'Analizando archivo de audio...',
        'Extrayendo características vocales...',
        'Entrenando modelo so-VITS...',
        'Optimizando parámetros...',
        'Validando calidad del modelo...',
        'Modelo listo para clonación'
      ];
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessingProgress(((i + 1) / steps.length) * 100);
      }
      
      setVoiceModel({
        id: `voice_${Date.now()}`,
        name: audioFile.name.replace(/\.[^/.]+$/, ""),
        quality: 95,
        trained_at: new Date().toISOString(),
        model_type: 'so-vits'
      });
      
      setCurrentStep('clone');
      
    } catch (error) {
      console.error('Error entrenando modelo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clonar voz con texto
  const cloneVoice = async (text, targetFile = null) => {
    if (!voiceModel) return;
    
    setIsProcessing(true);
    
    try {
      // Llamar al backend para clonación
      const response = await fetch('/api/voice/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice_model_id: voiceModel.id,
          text: text,
          target_file: targetFile,
          model_type: voiceModel.model_type
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClonedAudio({
          url: data.audio_url,
          text: text,
          created_at: new Date().toISOString()
        });
        setCurrentStep('process');
      }
      
    } catch (error) {
      console.error('Error clonando voz:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Aplicar efectos Waves
  const applyWavesEffects = async () => {
    if (!clonedAudio) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/waves/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: clonedAudio.url,
          effects: wavesEffects
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClonedAudio(prev => ({
          ...prev,
          processed_url: data.processed_audio_url,
          effects_applied: Object.keys(wavesEffects).filter(key => wavesEffects[key].enabled)
        }));
        setCurrentStep('export');
      }
      
    } catch (error) {
      console.error('Error aplicando efectos:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Aplicar preset de efectos
  const applyPreset = (presetName) => {
    const preset = effectPresets[presetName];
    if (preset) {
      setWavesEffects(prev => ({
        ...prev,
        ...preset
      }));
    }
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return renderUploadStep();
      case 'pretrained':
        return renderPretrainedStep();
      case 'text-mode':
        return renderTextModeStep();
      case 'train':
        return renderTrainStep();
      case 'clone':
        return renderCloneStep();
      case 'process':
        return renderProcessStep();
      case 'export':
        return renderExportStep();
      default:
        return renderUploadStep();
    }
  };

  // Paso 1: Subir muestras de voz y configurar
  const renderUploadStep = () => (
    <div className="step-content">
      <h2>🎤 Clone Station - Configuración Inicial</h2>
      <p>Configura tu modelo de voz personalizado o selecciona una voz preentrenada</p>
      
      {/* Pestañas de configuración */}
      <div className="config-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${currentStep === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentStep('upload')}
          >
            🎤 Mi Voz
          </button>
          <button 
            className={`tab-btn ${currentStep === 'pretrained' ? 'active' : ''}`}
            onClick={() => setCurrentStep('pretrained')}
          >
            🎭 Voces Preentrenadas
          </button>
          <button 
            className={`tab-btn ${currentStep === 'text-mode' ? 'active' : ''}`}
            onClick={() => setCurrentStep('text-mode')}
          >
            📝 Texto a Voz
          </button>
        </div>
      </div>

      {/* Sección de muestras de voz personalizadas */}
      <div className="voice-samples-section">
        <h3>📁 Muestras de Tu Voz</h3>
        <p>Sube múltiples muestras de audio para entrenar un modelo más preciso</p>
        
        <div className="upload-area">
          <input
            ref={voiceSamplesInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleVoiceSamplesUpload}
            style={{ display: 'none' }}
          />
          
          <div 
            className="drop-zone multiple"
            onClick={() => voiceSamplesInputRef.current?.click()}
          >
            <div className="upload-prompt">
              <div className="upload-icon">📁</div>
              <h3>Arrastra tus muestras de voz aquí</h3>
              <p>WAV, MP3, M4A (máx. 100MB cada una)</p>
              <p className="upload-tip">💡 Tip: 3-5 muestras de 30-60 segundos cada una para mejor calidad</p>
            </div>
          </div>
        </div>

        {/* Lista de muestras subidas */}
        {voiceSamples.length > 0 && (
          <div className="samples-list">
            <h4>Muestras Subidas ({voiceSamples.length})</h4>
            <div className="samples-grid">
              {voiceSamples.map(sample => (
                <div key={sample.id} className="sample-card">
                  <div className="sample-info">
                    <div className="sample-icon">🎵</div>
                    <div className="sample-details">
                      <h5>{sample.name}</h5>
                      <p>{(sample.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div className="sample-controls">
                    <audio controls src={sample.url} className="sample-audio" />
                    <button 
                      className="remove-sample-btn"
                      onClick={() => removeSample(sample.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selección de motor de IA */}
      <div className="model-selection">
        <h3>🤖 Motor de IA</h3>
        <div className="model-options">
          {Object.entries(voiceModels).map(([key, model]) => (
            <div key={key} className="model-card">
              <h4>{model.name}</h4>
              <p>{model.description}</p>
              <div className="model-specs">
                <span className="spec">Calidad: {model.quality}</span>
                <span className="spec">Velocidad: {model.speed}</span>
              </div>
              <p className="best-for">Mejor para: {model.bestFor}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        className="next-btn"
        onClick={() => setCurrentStep('train')}
        disabled={voiceSamples.length === 0}
      >
        Entrenar Modelo de Voz 🧠 ({voiceSamples.length} muestras)
      </button>
    </div>
  );

  // Paso: Voces Preentrenadas
  const renderPretrainedStep = () => (
    <div className="step-content">
      <h2>🎭 Voces Preentrenadas</h2>
      <p>Selecciona una voz profesional ya entrenada para tu proyecto</p>
      
      <div className="pretrained-voices-grid">
        {Object.entries(pretrainedVoices).map(([key, voice]) => (
          <div 
            key={key} 
            className={`voice-card ${selectedPretrainedVoice === key ? 'selected' : ''}`}
            onClick={() => setSelectedPretrainedVoice(key)}
          >
            <div className="voice-header">
              <h3>{voice.name}</h3>
              <span className="voice-language">{voice.language}</span>
            </div>
            
            <div className="voice-details">
              <p><strong>Género:</strong> {voice.gender}</p>
              <p><strong>Estilo:</strong> {voice.style}</p>
              <p><strong>Mejor para:</strong> {voice.bestFor}</p>
            </div>
            
            <div className="voice-sample">
              <audio controls src={voice.sample} />
            </div>
            
            {selectedPretrainedVoice === key && (
              <div className="voice-modulation">
                <h4>🎛️ Modulación de Voz</h4>
                
                <div className="modulation-controls">
                  <div className="control-group">
                    <label>Tono (Pitch)</label>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={voiceModulation.pitch}
                      onChange={(e) => setVoiceModulation(prev => ({
                        ...prev,
                        pitch: parseInt(e.target.value)
                      }))}
                    />
                    <span>{voiceModulation.pitch > 0 ? '+' : ''}{voiceModulation.pitch} semitonos</span>
                  </div>
                  
                  <div className="control-group">
                    <label>Velocidad</label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceModulation.speed}
                      onChange={(e) => setVoiceModulation(prev => ({
                        ...prev,
                        speed: parseFloat(e.target.value)
                      }))}
                    />
                    <span>{voiceModulation.speed}x</span>
                  </div>
                  
                  <div className="control-group">
                    <label>Emoción</label>
                    <select
                      value={voiceModulation.emotion}
                      onChange={(e) => setVoiceModulation(prev => ({
                        ...prev,
                        emotion: e.target.value
                      }))}
                    >
                      <option value="neutral">Neutral</option>
                      <option value="happy">Feliz</option>
                      <option value="sad">Triste</option>
                      <option value="excited">Emocionado</option>
                      <option value="calm">Calmado</option>
                      <option value="serious">Serio</option>
                    </select>
                  </div>
                  
                  <div className="control-group">
                    <label>Acento</label>
                    <select
                      value={voiceModulation.accent}
                      onChange={(e) => setVoiceModulation(prev => ({
                        ...prev,
                        accent: e.target.value
                      }))}
                    >
                      <option value="none">Sin modificar</option>
                      <option value="mexican">Mexicano</option>
                      <option value="argentinian">Argentino</option>
                      <option value="colombian">Colombiano</option>
                      <option value="spanish">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button
        className="next-btn"
        onClick={() => setCurrentStep('text-mode')}
        disabled={!selectedPretrainedVoice}
      >
        Continuar con Voz Seleccionada 🎤
      </button>
    </div>
  );

  // Paso: Modo Texto a Voz
  const renderTextModeStep = () => (
    <div className="step-content">
      <h2>📝 Texto a Voz</h2>
      <p>Escribe el texto que quieres convertir a audio con tu voz clonada</p>
      
      {/* Selector de modo de narración */}
      <div className="narration-mode-selector">
        <h3>🎯 Tipo de Contenido</h3>
        <div className="mode-buttons">
          {Object.entries(narrationModes).map(([key, mode]) => (
            <button
              key={key}
              className={`mode-btn ${narrationMode === key ? 'active' : ''}`}
              onClick={() => setNarrativeMode(key)}
            >
              <h4>{mode.name}</h4>
              <p>{mode.description}</p>
            </button>
          ))}
        </div>
      </div>
      
      {/* Área de texto */}
      <div className="text-input-area" style={{ marginBottom: '2rem' }}>
        <h3>Tu Texto</h3>
        <textarea
          value={textForNarration}
          onChange={(e) => setTextForNarration(e.target.value)}
          placeholder={
            narrationMode === 'podcast' ? 
            'Escribe el guión de tu podcast aquí...\n\nEjemplo:\nBienvenidos a nuestro podcast sobre tecnología. Hoy hablaremos sobre inteligencia artificial...' :
            narrationMode === 'video' ?
            'Escribe la narración para tu video...\n\nEjemplo:\nEn este tutorial aprenderás cómo crear música con IA...' :
            narrationMode === 'audiobook' ?
            'Escribe el texto del libro o capítulo...\n\nEjemplo:\nCapítulo 1: El comienzo de una nueva era...' :
            'Escribe el texto de tu comercial...\n\nEjemplo:\n¡Descubre el nuevo producto que cambiará tu vida!'
          }
          rows="15"
          className="narration-textarea"
          style={{ 
            width: '100%', 
            minHeight: '300px', 
            padding: '1rem', 
            fontSize: '1rem',
            lineHeight: '1.5',
            border: '1px solid #444',
            borderRadius: '8px',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            resize: 'vertical'
          }}
        />
        
        <div className="text-stats">
          <span>Caracteres: {textForNarration.length}</span>
          <span>Palabras: {textForNarration.split(' ').filter(word => word.length > 0).length}</span>
          <span>Tiempo estimado: {Math.ceil(textForNarration.split(' ').length / 150)} min</span>
        </div>
      </div>
      
      {/* Configuración de audio */}
      <div className="audio-config">
        <h3>🎛️ Configuración de Audio</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>Pausas entre párrafos</label>
            <select>
              <option value="short">Corta (0.5s)</option>
              <option value="medium">Media (1s)</option>
              <option value="long">Larga (1.5s)</option>
            </select>
          </div>
          
          <div className="config-item">
            <label>Énfasis en puntuación</label>
            <input type="checkbox" defaultChecked />
          </div>
          
          <div className="config-item">
            <label>Respiraciones naturales</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
      
      <button
        className="next-btn"
        onClick={() => setCurrentStep('process')}
        disabled={textForNarration.length < 10}
      >
        Generar Audio 🎵 ({textForNarration.split(' ').length} palabras)
      </button>
    </div>
  );

  // Paso 2: Entrenar modelo
  const renderTrainStep = () => (
    <div className="step-content">
      <h2>🧠 Entrenando Modelo de Voz</h2>
      
      {isProcessing ? (
        <div className="training-container">
          <div className="training-visual">
            <div className="voice-waveform">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="wave-bar"
                  style={{ 
                    '--delay': `${i * 0.1}s`,
                    '--height': `${Math.random() * 60 + 20}px`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="progress-info">
            <h3>Procesando con {voiceModels['so-vits'].name}...</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p>{processingProgress.toFixed(0)}% completado</p>
          </div>
          
          <div className="training-steps">
            <div className="step">✓ Analizando características vocales</div>
            <div className="step">✓ Extrayendo patrones de entonación</div>
            <div className="step">⏳ Entrenando red neuronal</div>
            <div className="step">⏳ Optimizando parámetros</div>
          </div>
        </div>
      ) : voiceModel ? (
        <div className="model-ready">
          <div className="success-icon">✅</div>
          <h3>Modelo Entrenado Exitosamente</h3>
          <div className="model-info">
            <p><strong>Nombre:</strong> {voiceModel.name}</p>
            <p><strong>Calidad:</strong> {voiceModel.quality}%</p>
            <p><strong>Motor:</strong> {voiceModel.model_type}</p>
          </div>
          <button className="next-btn" onClick={() => setCurrentStep('clone')}>
            Comenzar Clonación 🎭
          </button>
        </div>
      ) : (
        <button className="train-btn" onClick={trainVoiceModel}>
          Iniciar Entrenamiento
        </button>
      )}
    </div>
  );

  // Paso 3: Inferencia de Voz
  const renderCloneStep = () => (
    <div className="step-content">
      <h2>🎭 Inferencia de Voz</h2>
      <p>Aplica tu voz clonada a canciones existentes o crea nuevas narraciones</p>
      
      <div className="inference-tabs">
        <div className="tab-buttons">
          <button className="tab-btn active">🎵 Canciones</button>
          <button className="tab-btn">📝 Narración</button>
        </div>
      </div>
      
      <div className="inference-options">
        {/* Sección de canciones */}
        <div className="inference-method song-inference">
          <h3>🎵 Inferencia con Canciones</h3>
          <p>Aplica tu voz a canciones de tu biblioteca o sube nuevas pistas</p>
          
          {/* Biblioteca personal */}
          <div className="user-library">
            <h4>📚 Tu Biblioteca Personal</h4>
            {userLibrary.length > 0 ? (
              <div className="library-grid">
                {userLibrary.map(track => (
                  <div 
                    key={track.id} 
                    className={`library-track ${selectedTrackForInference?.id === track.id ? 'selected' : ''}`}
                    onClick={() => selectLibraryTrack(track)}
                  >
                    <div className="track-info">
                      <h5>{track.title}</h5>
                      <p>{track.artist || 'Tu creación'}</p>
                      <span className="track-duration">{track.duration}</span>
                    </div>
                    <audio controls src={track.url} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-library">
                <p>No tienes canciones en tu biblioteca aún</p>
                <p>Crea algunas en Ghost Studio primero</p>
              </div>
            )}
          </div>
          
          {/* Subir nueva pista */}
          <div className="upload-track-section">
            <h4>📁 Subir Nueva Pista</h4>
            <input
              ref={trackUploadInputRef}
              type="file"
              accept="audio/*"
              onChange={handleTrackUpload}
              style={{ display: 'none' }}
            />
            
            <div 
              className="track-upload-zone"
              onClick={() => trackUploadInputRef.current?.click()}
            >
              {selectedTrackForInference && selectedTrackForInference.type === 'uploaded' ? (
                <div className="uploaded-track-info">
                  <div className="track-icon">🎵</div>
                  <div className="track-details">
                    <h5>{selectedTrackForInference.name}</h5>
                    <audio controls src={selectedTrackForInference.url} />
                  </div>
                </div>
              ) : (
                <div className="upload-prompt">
                  <div className="upload-icon">📁</div>
                  <h4>Arrastra una canción aquí</h4>
                  <p>WAV, MP3, M4A (máx. 50MB)</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Configuración de inferencia */}
          {selectedTrackForInference && (
            <div className="inference-settings">
              <h4>⚙️ Configuración de Inferencia</h4>
              
              <div className="settings-grid">
                <div className="setting-group">
                  <label>Preservar Melodía Original</label>
                  <input type="checkbox" defaultChecked />
                  <span className="setting-help">Mantiene la melodía y solo cambia el timbre vocal</span>
                </div>
                
                <div className="setting-group">
                  <label>Intensidad de Clonación</label>
                  <input type="range" min="0" max="100" defaultValue="85" />
                  <span className="setting-value">85%</span>
                </div>
                
                <div className="setting-group">
                  <label>Preservar Efectos Originales</label>
                  <select>
                    <option value="all">Todos los efectos</option>
                    <option value="reverb-only">Solo reverb</option>
                    <option value="none">Sin efectos</option>
                  </select>
                </div>
                
                <div className="setting-group">
                  <label>Modo de Procesamiento</label>
                  <select>
                    <option value="quality">Alta Calidad (lento)</option>
                    <option value="balanced">Balanceado</option>
                    <option value="fast">Rápido (menor calidad)</option>
                  </select>
                </div>
              </div>
              
              <button className="inference-btn">
                🎤 Aplicar Mi Voz a Esta Canción
              </button>
            </div>
          )}
        </div>
        
        {/* Sección de narración */}
        <div className="inference-method narration-inference" style={{ display: 'none' }}>
          <h3>📝 Narración con IA</h3>
          <p>Crea narraciones profesionales para podcasts, videos y audiolibros</p>
          
          <div className="narration-types">
            <div className="narration-type-grid">
              <div className="narration-card podcast">
                <h4>🎙️ Podcast</h4>
                <p>Conversaciones naturales y entrevistas</p>
                <button onClick={() => setCurrentStep('text-mode')}>Crear Podcast</button>
              </div>
              
              <div className="narration-card video">
                <h4>📹 Video/YouTube</h4>
                <p>Narraciones para contenido audiovisual</p>
                <button onClick={() => setCurrentStep('text-mode')}>Crear Narración</button>
              </div>
              
              <div className="narration-card audiobook">
                <h4>📚 Audiolibro</h4>
                <p>Lectura de libros y textos largos</p>
                <button onClick={() => setCurrentStep('text-mode')}>Crear Audiolibro</button>
              </div>
              
              <div className="narration-card commercial">
                <h4>📢 Comercial</h4>
                <p>Anuncios y promociones</p>
                <button onClick={() => setCurrentStep('text-mode')}>Crear Comercial</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 4: Procesar con Waves
  const renderProcessStep = () => (
    <div className="step-content">
      <h2>🎛️ Procesamiento Profesional Waves</h2>
      
      <div className="waves-console">
        {/* Presets */}
        <div className="presets-section">
          <h3>Presets Profesionales</h3>
          <div className="preset-buttons">
            {Object.entries(effectPresets).map(([key, preset]) => (
              <button
                key={key}
                className="preset-btn"
                onClick={() => applyPreset(key)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Compressor */}
        <div className="effect-module compressor">
          <div className="module-header">
            <h4>🗜️ Waves C4 Compressor</h4>
            <input
              type="checkbox"
              checked={wavesEffects.compressor.enabled}
              onChange={(e) => setWavesEffects(prev => ({
                ...prev,
                compressor: { ...prev.compressor, enabled: e.target.checked }
              }))}
            />
          </div>
          
          <div className="knobs-row">
            <div className="knob-control">
              <label>Threshold</label>
              <input
                type="range"
                min="-30"
                max="0"
                value={wavesEffects.compressor.threshold}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  compressor: { ...prev.compressor, threshold: parseInt(e.target.value) }
                }))}
              />
              <span>{wavesEffects.compressor.threshold} dB</span>
            </div>
            
            <div className="knob-control">
              <label>Ratio</label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={wavesEffects.compressor.ratio}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  compressor: { ...prev.compressor, ratio: parseFloat(e.target.value) }
                }))}
              />
              <span>{wavesEffects.compressor.ratio}:1</span>
            </div>
            
            <div className="knob-control">
              <label>Attack</label>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={wavesEffects.compressor.attack}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  compressor: { ...prev.compressor, attack: parseFloat(e.target.value) }
                }))}
              />
              <span>{wavesEffects.compressor.attack} ms</span>
            </div>
          </div>
        </div>

        {/* EQ */}
        <div className="effect-module eq">
          <div className="module-header">
            <h4>🎚️ Waves Q10 EQ</h4>
            <input
              type="checkbox"
              checked={wavesEffects.eq.enabled}
              onChange={(e) => setWavesEffects(prev => ({
                ...prev,
                eq: { ...prev.eq, enabled: e.target.checked }
              }))}
            />
          </div>
          
          <div className="eq-visual">
            <div className="eq-curve">
              {/* Visualización de curva EQ */}
              <svg viewBox="0 0 300 100" className="eq-graph">
                <path
                  d={`M0,50 Q75,${50 - wavesEffects.eq.lowMid * 5} 150,${50 - wavesEffects.eq.highMid * 5} T300,${50 - wavesEffects.eq.highShelf * 5}`}
                  stroke="#00bfff"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
          
          <div className="knobs-row">
            <div className="knob-control">
              <label>Low Cut</label>
              <input
                type="range"
                min="20"
                max="200"
                value={wavesEffects.eq.lowCut}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  eq: { ...prev.eq, lowCut: parseInt(e.target.value) }
                }))}
              />
              <span>{wavesEffects.eq.lowCut} Hz</span>
            </div>
            
            <div className="knob-control">
              <label>Presence</label>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.1"
                value={wavesEffects.eq.presence}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  eq: { ...prev.eq, presence: parseFloat(e.target.value) }
                }))}
              />
              <span>{wavesEffects.eq.presence > 0 ? '+' : ''}{wavesEffects.eq.presence} dB</span>
            </div>
          </div>
        </div>

        {/* Reverb */}
        <div className="effect-module reverb">
          <div className="module-header">
            <h4>🌊 Waves TrueVerb</h4>
            <input
              type="checkbox"
              checked={wavesEffects.reverb.enabled}
              onChange={(e) => setWavesEffects(prev => ({
                ...prev,
                reverb: { ...prev.reverb, enabled: e.target.checked }
              }))}
            />
          </div>
          
          <div className="knobs-row">
            <div className="knob-control">
              <label>Room Size</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={wavesEffects.reverb.roomSize}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  reverb: { ...prev.reverb, roomSize: parseFloat(e.target.value) }
                }))}
              />
              <span>{Math.round(wavesEffects.reverb.roomSize * 100)}%</span>
            </div>
            
            <div className="knob-control">
              <label>Wet Level</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={wavesEffects.reverb.wetLevel}
                onChange={(e) => setWavesEffects(prev => ({
                  ...prev,
                  reverb: { ...prev.reverb, wetLevel: parseFloat(e.target.value) }
                }))}
              />
              <span>{Math.round(wavesEffects.reverb.wetLevel * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className="process-btn"
        onClick={applyWavesEffects}
        disabled={!clonedAudio}
      >
        Aplicar Efectos Waves 🎛️
      </button>
    </div>
  );

  // Paso 5: Exportar
  const renderExportStep = () => (
    <div className="step-content">
      <h2>💾 Exportar Audio Procesado</h2>
      
      {clonedAudio && (
        <div className="export-options">
          <div className="audio-preview">
            <h3>Vista Previa</h3>
            <audio controls src={clonedAudio.processed_url || clonedAudio.url} />
            
            <div className="audio-info">
              <p><strong>Efectos aplicados:</strong> {clonedAudio.effects_applied?.join(', ') || 'Ninguno'}</p>
              <p><strong>Calidad:</strong> 48kHz/24-bit</p>
            </div>
          </div>
          
          <div className="export-formats">
            <h3>Formatos de Exportación</h3>
            <div className="format-options">
              <button className="format-btn">WAV (Sin compresión)</button>
              <button className="format-btn">MP3 320kbps</button>
              <button className="format-btn">FLAC (Lossless)</button>
            </div>
          </div>
          
          <div className="integration-options">
            <h3>Integrar con</h3>
            <div className="integration-buttons">
              <button className="integration-btn">🎵 Ghost Studio</button>
              <button className="integration-btn">📚 El Archivo</button>
              <button className="integration-btn">🚀 Nova Post Pilot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="clone-station">
      <div className="station-header">
        <div className="station-title">
          <h1>🎤 Clone Station</h1>
          <p>Clonación Vocal Profesional • so-VITS + Bark + Waves</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Progress indicator */}
      <div className="progress-indicator" style={{ marginBottom: '2rem' }}>
        <div className="progress-steps">
          <div className={`step ${currentStep === 'upload' || currentStep === 'pretrained' || currentStep === 'text-mode' ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-name">Configurar</span>
          </div>
          <div className={`step ${currentStep === 'train' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-name">Entrenar</span>
          </div>
          <div className={`step ${currentStep === 'clone' ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-name">Inferencia</span>
          </div>
          <div className={`step ${currentStep === 'process' ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-name">Procesar</span>
          </div>
          <div className={`step ${currentStep === 'export' ? 'active' : ''}`}>
            <span className="step-number">5</span>
            <span className="step-name">Exportar</span>
          </div>
        </div>
        
        {/* Indicador de modo actual */}
        <div className="current-mode-indicator" style={{ marginTop: '1rem', textAlign: 'center' }}>
          {currentStep === 'upload' && 'Configurando tu voz personalizada'}
          {currentStep === 'pretrained' && 'Seleccionando voz preentrenada'}
          {currentStep === 'text-mode' && 'Creando narración con texto'}
          {currentStep === 'train' && 'Entrenando modelo de IA'}
          {currentStep === 'clone' && 'Aplicando inferencia vocal'}
          {currentStep === 'process' && 'Procesando con efectos Waves'}
          {currentStep === 'export' && 'Exportando resultado final'}
        </div>
      </div>

      <div className="station-content">
        {renderCurrentStep()}
      </div>

      {/* Audio element oculto */}
      <audio ref={audioRef} />
    </div>
  );
};

export default CloneStation;
