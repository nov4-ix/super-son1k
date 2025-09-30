import React, { useState, useRef } from 'react';
import './IntuitiveVoiceCloner.css';

const IntuitiveVoiceCloner = ({ services }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [clonedAudio, setClonedAudio] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  // Estados del formulario
  const [audioFile, setAudioFile] = useState(null);
  const [textToClone, setTextToClone] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    emotion: 'neutral',
    language: 'es',
    speed: 1.0,
    pitch: 1.0,
    model: 'so-vits'
  });

  const emotions = {
    neutral: { emoji: '😐', name: 'Neutral', color: '#95a5a6' },
    happy: { emoji: '😊', name: 'Feliz', color: '#f39c12' },
    sad: { emoji: '😢', name: 'Triste', color: '#3498db' },
    angry: { emoji: '😠', name: 'Enojado', color: '#e74c3c' },
    excited: { emoji: '🤩', name: 'Emocionado', color: '#e91e63' },
    calm: { emoji: '😌', name: 'Tranquilo', color: '#2ecc71' }
  };

  const languages = {
    es: { name: 'Español', flag: '🇪🇸' },
    en: { name: 'Inglés', flag: '🇺🇸' },
    fr: { name: 'Francés', flag: '🇫🇷' },
    de: { name: 'Alemán', flag: '🇩🇪' },
    ja: { name: 'Japonés', flag: '🇯🇵' },
    ko: { name: 'Coreano', flag: '🇰🇷' }
  };

  const models = {
    'so-vits': { name: 'so-VITS-SVC 4.0', description: 'Alta calidad, conversión de voz' },
    'bark': { name: 'Bark Voice', description: 'Text-to-Speech con emociones' }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setCurrentStep(2);
    } else {
      alert('Por favor selecciona un archivo de audio válido');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClone = async () => {
    if (!audioFile || !textToClone.trim()) {
      alert('Por favor sube un archivo de audio y escribe el texto a clonar');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(3);
    setProgress(0);

    try {
      // Simular progreso realista
      const progressSteps = [
        { step: 3, message: 'Analizando tu voz...', progress: 20 },
        { step: 4, message: 'Extrayendo características...', progress: 40 },
        { step: 5, message: 'Procesando con IA...', progress: 60 },
        { step: 6, message: 'Generando audio...', progress: 80 },
        { step: 7, message: 'Finalizando...', progress: 100 }
      ];

      for (const step of progressSteps) {
        setCurrentStep(step.step);
        setProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Procesar con el servicio real
      if (services?.voiceCloning) {
        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('text', textToClone);
        formData.append('settings', JSON.stringify(voiceSettings));

        const result = await services.voiceCloning.cloneVoice(formData);
        setClonedAudio(result);
      } else {
        // Modo demo
        setClonedAudio({
          audioUrl: '/demo-voice.mp3',
          duration: 30,
          quality: 'high',
          model: voiceSettings.model
        });
      }
    } catch (error) {
      console.error('Error cloning voice:', error);
      alert('Error al clonar la voz. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepMessage = () => {
    const messages = [
      'Sube tu archivo de audio',
      'Configura los parámetros',
      'Analizando tu voz...',
      'Extrayendo características...',
      'Procesando con IA...',
      'Generando audio...',
      'Finalizando...'
    ];
    return messages[currentStep - 1] || 'Procesando...';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="intuitive-voice-cloner">
      <div className="cloner-header">
        <h2>🎤 Clonador de Voz Intuitivo</h2>
        <p>Convierte cualquier voz en la tuya con IA avanzada</p>
      </div>

      {!isProcessing ? (
        <div className="cloner-form">
          {/* Paso 1: Subir Audio */}
          <div className="form-section">
            <h3>1. Sube tu archivo de audio</h3>
            <div 
              className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${audioFile ? 'file-uploaded' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              
              {audioFile ? (
                <div className="file-info">
                  <div className="file-icon">🎵</div>
                  <div className="file-details">
                    <div className="file-name">{audioFile.name}</div>
                    <div className="file-size">{formatFileSize(audioFile.size)}</div>
                  </div>
                  <button 
                    className="remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAudioFile(null);
                      setCurrentStep(1);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    <h4>Arrastra tu archivo aquí</h4>
                    <p>o haz clic para seleccionar</p>
                    <div className="supported-formats">
                      WAV, MP3, M4A, OGG
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paso 2: Configuración */}
          {audioFile && (
            <div className="form-section">
              <h3>2. Configura la clonación</h3>
              
              <div className="text-input-section">
                <label>Texto a clonar</label>
                <textarea
                  value={textToClone}
                  onChange={(e) => setTextToClone(e.target.value)}
                  placeholder="Escribe el texto que quieres que diga tu voz clonada..."
                  className="text-input"
                  rows="4"
                />
                <div className="char-count">{textToClone.length} caracteres</div>
              </div>

              <div className="settings-grid">
                {/* Emoción */}
                <div className="setting-group">
                  <label>Emoción</label>
                  <div className="emotion-selector">
                    {Object.entries(emotions).map(([key, emotion]) => (
                      <button
                        key={key}
                        className={`emotion-btn ${voiceSettings.emotion === key ? 'active' : ''}`}
                        onClick={() => setVoiceSettings({...voiceSettings, emotion: key})}
                        style={{ '--emotion-color': emotion.color }}
                      >
                        <span className="emotion-emoji">{emotion.emoji}</span>
                        <span className="emotion-name">{emotion.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Idioma */}
                <div className="setting-group">
                  <label>Idioma</label>
                  <div className="language-selector">
                    {Object.entries(languages).map(([key, lang]) => (
                      <button
                        key={key}
                        className={`language-btn ${voiceSettings.language === key ? 'active' : ''}`}
                        onClick={() => setVoiceSettings({...voiceSettings, language: key})}
                      >
                        <span className="language-flag">{lang.flag}</span>
                        <span className="language-name">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modelo */}
                <div className="setting-group">
                  <label>Modelo de IA</label>
                  <div className="model-selector">
                    {Object.entries(models).map(([key, model]) => (
                      <button
                        key={key}
                        className={`model-btn ${voiceSettings.model === key ? 'active' : ''}`}
                        onClick={() => setVoiceSettings({...voiceSettings, model: key})}
                      >
                        <div className="model-name">{model.name}</div>
                        <div className="model-desc">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controles de Audio */}
                <div className="setting-group">
                  <label>Velocidad</label>
                  <div className="slider-control">
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceSettings.speed}
                      onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                      className="slider"
                    />
                    <span className="slider-value">{voiceSettings.speed}x</span>
                  </div>
                </div>

                <div className="setting-group">
                  <label>Tono</label>
                  <div className="slider-control">
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceSettings.pitch}
                      onChange={(e) => setVoiceSettings({...voiceSettings, pitch: parseFloat(e.target.value)})}
                      className="slider"
                    />
                    <span className="slider-value">{voiceSettings.pitch}x</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón de Clonación */}
          {audioFile && textToClone.trim() && (
            <div className="clone-section">
              <button
                className="clone-btn"
                onClick={handleClone}
                disabled={isProcessing}
              >
                <span className="btn-icon">🎤</span>
                <span className="btn-text">Clonar Voz</span>
                <span className="btn-subtext">IA + Tu Voz = Magia</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="processing-progress">
          <div className="progress-header">
            <h3>Procesando tu voz...</h3>
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

          <div className="processing-steps">
            {[1, 2, 3, 4, 5, 6, 7].map(step => (
              <div 
                key={step} 
                className={`processing-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
              >
                <div className="step-number">{step}</div>
                <div className="step-line"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultado */}
      {clonedAudio && (
        <div className="cloning-result">
          <h3>🎉 ¡Tu voz clonada está lista!</h3>
          <div className="audio-player">
            <audio controls src={clonedAudio.audioUrl} />
          </div>
          <div className="result-info">
            <div className="info-item">
              <span className="info-label">Modelo:</span>
              <span className="info-value">{models[voiceSettings.model]?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Duración:</span>
              <span className="info-value">{clonedAudio.duration}s</span>
            </div>
            <div className="info-item">
              <span className="info-label">Calidad:</span>
              <span className="info-value">{clonedAudio.quality}</span>
            </div>
          </div>
          <div className="result-actions">
            <button className="action-btn download">
              <span>📥</span> Descargar
            </button>
            <button className="action-btn share">
              <span>🔗</span> Compartir
            </button>
            <button className="action-btn clone-again">
              <span>🔄</span> Clonar Otra Vez
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntuitiveVoiceCloner;

