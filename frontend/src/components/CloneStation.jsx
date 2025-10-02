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
  const audioRef = useRef(null);

  // Manejar subida de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      console.log('Archivo subido:', file.name);
    }
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

  // Paso 1: Subir archivo de voz
  const renderUploadStep = () => (
    <div className="step-content">
      <h2>🎤 Subir Muestra de Voz</h2>
      <p>Sube un archivo de audio con tu voz para entrenar el modelo de clonación</p>
      
      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <div 
          className="drop-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          {audioFile ? (
            <div className="file-info">
              <div className="file-icon">🎵</div>
              <div className="file-details">
                <h3>{audioFile.name}</h3>
                <p>{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📁</div>
              <h3>Arrastra tu archivo de voz aquí</h3>
              <p>WAV, MP3, M4A (máx. 100MB)</p>
              <p className="upload-tip">💡 Tip: 30-60 segundos de audio claro son suficientes</p>
            </div>
          )}
        </div>
      </div>

      <div className="model-selection">
        <h3>Seleccionar Motor de IA</h3>
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
        disabled={!audioFile}
      >
        Entrenar Modelo de Voz 🧠
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

  // Paso 3: Clonar voz
  const renderCloneStep = () => (
    <div className="step-content">
      <h2>🎭 Clonación de Voz</h2>
      
      <div className="clone-options">
        <div className="clone-method text-to-speech">
          <h3>📝 Texto a Voz</h3>
          <p>Convierte texto en audio con tu voz clonada</p>
          
          <textarea
            placeholder="Escribe el texto que quieres que diga tu voz clonada..."
            className="text-input"
          />
          
          <div className="voice-settings">
            <div className="setting">
              <label>Velocidad</label>
              <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
            </div>
            <div className="setting">
              <label>Tono</label>
              <input type="range" min="-12" max="12" step="1" defaultValue="0" />
            </div>
            <div className="setting">
              <label>Emoción</label>
              <select>
                <option>Neutral</option>
                <option>Feliz</option>
                <option>Triste</option>
                <option>Enérgico</option>
                <option>Relajado</option>
              </select>
            </div>
          </div>
          
          <button className="clone-btn">Clonar Texto</button>
        </div>

        <div className="clone-method voice-transfer">
          <h3>🎵 Transferencia Vocal</h3>
          <p>Aplica tu voz a una pista existente (de Ghost Studio o subida)</p>
          
          <div className="file-selector">
            <button className="select-file-btn">
              Seleccionar Pista de Audio
            </button>
            <p>O arrastra un archivo aquí</p>
          </div>
          
          <div className="transfer-settings">
            <div className="setting">
              <label>Preservar Melodía</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="setting">
              <label>Intensidad de Clonación</label>
              <input type="range" min="0" max="100" defaultValue="80" />
            </div>
          </div>
          
          <button className="clone-btn">Transferir Voz</button>
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
      <div className="progress-bar">
        {['upload', 'train', 'clone', 'process', 'export'].map((step, index) => (
          <div
            key={step}
            className={`progress-step ${currentStep === step ? 'active' : ''} ${
              ['upload', 'train', 'clone', 'process', 'export'].indexOf(currentStep) > index ? 'completed' : ''
            }`}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-name">
              {step === 'upload' && 'Subir'}
              {step === 'train' && 'Entrenar'}
              {step === 'clone' && 'Clonar'}
              {step === 'process' && 'Procesar'}
              {step === 'export' && 'Exportar'}
            </span>
          </div>
        ))}
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
