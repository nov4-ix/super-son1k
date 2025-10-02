/**
 * 👻 Ghost Studio Pro - La Herramienta que Democratiza la Música
 * Analizador inteligente + Perillas características + Motor de generación
 * Transforma cualquier maqueta en producción profesional
 */

import React, { useState, useEffect, useRef } from 'react';
import './GhostStudioPro.css';

const GhostStudioPro = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analyze, arrange, generate, export
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  
  // Configuración de perillas características
  const [arrangementKnobs, setArrangementKnobs] = useState({
    expresividad: 75,    // Qué tan emotiva/expresiva será la interpretación
    rareza: 60,          // Elementos únicos e inesperados
    trash: 45,           // Elementos lo-fi, imperfectos, "sucios"
    garage: 80,          // Estética garage/indie/cruda
    vintage: 65,         // Sonidos retro/analógicos
    experimental: 50,    // Elementos experimentales/vanguardistas
    groove: 85,          // Qué tan "groovy" será el ritmo
    atmosphere: 70       // Ambiente y texturas sonoras
  });

  // Configuración de análisis
  const [analysisSettings, setAnalysisSettings] = useState({
    preserveGenre: true,        // Mantener género original
    preserveBPM: true,          // Mantener tempo original
    preserveKey: true,          // Mantener tonalidad original
    preserveStructure: true,    // Mantener estructura de canción
    enhanceInstrumentation: true, // Mejorar instrumentación
    addArrangement: true        // Agregar arreglos
  });

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Manejar subida de archivo
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      console.log('Maqueta subida:', file.name);
    }
  };

  // Analizar pista con IA
  const analyzeTrack = async () => {
    if (!audioFile) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('settings', JSON.stringify(analysisSettings));
      
      const response = await fetch('/api/ghost-studio/analyze', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data.analysis);
        setCurrentStep('arrange');
      }
      
    } catch (error) {
      console.error('Error analizando pista:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generar pista con Ghost Studio
  const generateTrack = async () => {
    if (!analysisResult) return;
    
    setIsProcessing(true);
    
    try {
      // Construir prompt basado en análisis y perillas
      const prompt = buildGenerationPrompt();
      
      const response = await fetch('/api/ghost-studio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_analysis: analysisResult,
          arrangement_knobs: arrangementKnobs,
          analysis_settings: analysisSettings,
          prompt: prompt,
          translate_to_english: true // Para Suno
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedTrack(data.generated_track);
        setCurrentStep('export');
      }
      
    } catch (error) {
      console.error('Error generando pista:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Construir prompt de generación basado en análisis y perillas
  const buildGenerationPrompt = () => {
    if (!analysisResult) return '';
    
    let prompt = '';
    
    // Base del prompt desde el análisis
    if (analysisSettings.preserveGenre) {
      prompt += `${analysisResult.genre} track, `;
    }
    
    if (analysisSettings.preserveBPM) {
      prompt += `${analysisResult.bpm} BPM, `;
    }
    
    if (analysisSettings.preserveKey) {
      prompt += `in ${analysisResult.key} key, `;
    }
    
    // Instrumentación sugerida
    if (analysisResult.suggested_instruments) {
      prompt += `featuring ${analysisResult.suggested_instruments.join(', ')}, `;
    }
    
    // Aplicar perillas características
    const knobDescriptions = [];
    
    if (arrangementKnobs.expresividad > 70) {
      knobDescriptions.push('highly expressive and emotional');
    }
    
    if (arrangementKnobs.rareza > 70) {
      knobDescriptions.push('with unique and unexpected elements');
    }
    
    if (arrangementKnobs.trash > 60) {
      knobDescriptions.push('lo-fi and gritty textures');
    }
    
    if (arrangementKnobs.garage > 70) {
      knobDescriptions.push('raw garage/indie aesthetic');
    }
    
    if (arrangementKnobs.vintage > 70) {
      knobDescriptions.push('vintage analog sounds');
    }
    
    if (arrangementKnobs.experimental > 70) {
      knobDescriptions.push('experimental and avant-garde elements');
    }
    
    if (arrangementKnobs.groove > 80) {
      knobDescriptions.push('extremely groovy and rhythmic');
    }
    
    if (arrangementKnobs.atmosphere > 70) {
      knobDescriptions.push('rich atmospheric textures');
    }
    
    if (knobDescriptions.length > 0) {
      prompt += knobDescriptions.join(', ') + ', ';
    }
    
    // Estructura y arreglo
    if (analysisSettings.addArrangement) {
      prompt += `with professional arrangement and production, `;
    }
    
    // Limpiar prompt
    prompt = prompt.replace(/,\s*$/, ''); // Remover coma final
    
    return prompt;
  };

  // Renderizar pasos
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return renderUploadStep();
      case 'analyze':
        return renderAnalyzeStep();
      case 'arrange':
        return renderArrangeStep();
      case 'generate':
        return renderGenerateStep();
      case 'export':
        return renderExportStep();
      default:
        return renderUploadStep();
    }
  };

  // Paso 1: Subir maqueta
  const renderUploadStep = () => (
    <div className="step-content">
      <h2>👻 Subir Maqueta</h2>
      <p>Sube tu demo, maqueta o idea musical. No importa la calidad - Ghost Studio la transformará.</p>
      
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
                <audio controls src={URL.createObjectURL(audioFile)} />
              </div>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📁</div>
              <h3>Arrastra tu maqueta aquí</h3>
              <p>MP3, WAV, M4A (máx. 50MB)</p>
              <p className="upload-tip">💡 Cualquier calidad sirve - voz + guitarra/piano es perfecto</p>
            </div>
          )}
        </div>
      </div>

      <div className="demo-examples">
        <h3>Ejemplos de lo que puedes subir:</h3>
        <div className="examples-grid">
          <div className="example">🎸 Guitarra + voz grabada en celular</div>
          <div className="example">🎹 Piano + melodía tarareada</div>
          <div className="example">🎤 Voz a capella con idea de canción</div>
          <div className="example">🥁 Beat básico + línea de bajo</div>
        </div>
      </div>

      <button
        className="next-btn"
        onClick={() => setCurrentStep('analyze')}
        disabled={!audioFile}
      >
        Analizar con IA 🧠
      </button>
    </div>
  );

  // Paso 2: Análisis inteligente
  const renderAnalyzeStep = () => (
    <div className="step-content">
      <h2>🧠 Análisis Inteligente</h2>
      
      {isProcessing ? (
        <div className="analyzing-container">
          <div className="waveform-analyzer">
            {[...Array(32)].map((_, i) => (
              <div 
                key={i} 
                className="analyzer-bar"
                style={{ 
                  '--delay': `${i * 0.05}s`,
                  '--height': `${Math.random() * 80 + 20}%`
                }}
              />
            ))}
          </div>
          
          <h3>Ghost Studio analizando tu maqueta...</h3>
          <div className="analysis-steps">
            <div className="step">✓ Detectando género musical</div>
            <div className="step">✓ Calculando BPM y tonalidad</div>
            <div className="step">⏳ Analizando instrumentación</div>
            <div className="step">⏳ Sugiriendo arreglos</div>
            <div className="step">⏳ Preparando motor de generación</div>
          </div>
        </div>
      ) : analysisResult ? (
        <div className="analysis-results">
          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>🎵 Género</h3>
              <p className="analysis-value">{analysisResult.genre}</p>
              <p className="confidence">Confianza: {analysisResult.genre_confidence}%</p>
            </div>
            
            <div className="analysis-card">
              <h3>⚡ BPM</h3>
              <p className="analysis-value">{analysisResult.bpm}</p>
              <p className="confidence">Tempo detectado</p>
            </div>
            
            <div className="analysis-card">
              <h3>🎼 Tonalidad</h3>
              <p className="analysis-value">{analysisResult.key}</p>
              <p className="confidence">{analysisResult.scale}</p>
            </div>
            
            <div className="analysis-card">
              <h3>🎛️ Estructura</h3>
              <p className="analysis-value">{analysisResult.structure}</p>
              <p className="confidence">{analysisResult.duration}s</p>
            </div>
          </div>

          <div className="instrumentation-section">
            <h3>🎸 Instrumentación Sugerida</h3>
            <div className="instruments-list">
              {analysisResult.suggested_instruments?.map((instrument, index) => (
                <span key={index} className="instrument-tag">{instrument}</span>
              ))}
            </div>
          </div>

          <div className="arrangement-suggestions">
            <h3>🎼 Sugerencias de Arreglo</h3>
            <ul>
              {analysisResult.arrangement_suggestions?.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {/* Configuración de preservación */}
          <div className="preservation-settings">
            <h3>⚙️ Configuración de Análisis</h3>
            <div className="settings-grid">
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  checked={analysisSettings.preserveGenre}
                  onChange={(e) => setAnalysisSettings(prev => ({
                    ...prev,
                    preserveGenre: e.target.checked
                  }))}
                />
                <span>Preservar Género Original</span>
                <p>Mantener el estilo musical detectado</p>
              </label>
              
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  checked={analysisSettings.preserveBPM}
                  onChange={(e) => setAnalysisSettings(prev => ({
                    ...prev,
                    preserveBPM: e.target.checked
                  }))}
                />
                <span>Preservar BPM</span>
                <p>Mantener el tempo original</p>
              </label>
              
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  checked={analysisSettings.preserveKey}
                  onChange={(e) => setAnalysisSettings(prev => ({
                    ...prev,
                    preserveKey: e.target.checked
                  }))}
                />
                <span>Preservar Tonalidad</span>
                <p>Mantener la clave musical</p>
              </label>
              
              <label className="setting-toggle">
                <input
                  type="checkbox"
                  checked={analysisSettings.addArrangement}
                  onChange={(e) => setAnalysisSettings(prev => ({
                    ...prev,
                    addArrangement: e.target.checked
                  }))}
                />
                <span>Agregar Arreglo</span>
                <p>Mejorar la instrumentación y estructura</p>
              </label>
            </div>
          </div>

          <button className="next-btn" onClick={() => setCurrentStep('arrange')}>
            Configurar Arreglo 🎛️
          </button>
        </div>
      ) : (
        <button className="analyze-btn" onClick={analyzeTrack}>
          Analizar Maqueta
        </button>
      )}
    </div>
  );

  // Paso 3: Perillas de arreglo
  const renderArrangeStep = () => (
    <div className="step-content">
      <h2>🎛️ Perillas Características</h2>
      <p>Ajusta las perillas para definir el carácter de tu producción</p>
      
      <div className="knobs-console">
        <div className="console-header">
          <h3>GHOST STUDIO CONSOLE</h3>
          <div className="console-status">
            <span className="status-light online"></span>
            <span>ONLINE</span>
          </div>
        </div>
        
        <div className="knobs-grid">
          {Object.entries(arrangementKnobs).map(([knobName, value]) => (
            <div key={knobName} className="knob-control">
              <div className="knob-container">
                <div 
                  className="knob"
                  style={{
                    '--rotation': `${(value / 100) * 270 - 135}deg`,
                    '--value': value
                  }}
                >
                  <div className="knob-indicator"></div>
                  <div className="knob-center">
                    <span className="knob-value">{value}</span>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setArrangementKnobs(prev => ({
                    ...prev,
                    [knobName]: parseInt(e.target.value)
                  }))}
                  className="knob-slider"
                />
              </div>
              
              <div className="knob-info">
                <h4>{knobName.toUpperCase()}</h4>
                <p className="knob-description">
                  {getKnobDescription(knobName)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Presets de perillas */}
        <div className="knob-presets">
          <h4>Presets Rápidos</h4>
          <div className="preset-buttons">
            <button onClick={() => applyKnobPreset('clean')}>Clean</button>
            <button onClick={() => applyKnobPreset('experimental')}>Experimental</button>
            <button onClick={() => applyKnobPreset('vintage')}>Vintage</button>
            <button onClick={() => applyKnobPreset('aggressive')}>Aggressive</button>
          </div>
        </div>
      </div>

      <button className="next-btn" onClick={() => setCurrentStep('generate')}>
        Generar Producción 🎵
      </button>
    </div>
  );

  // Obtener descripción de perilla
  const getKnobDescription = (knobName) => {
    const descriptions = {
      expresividad: 'Intensidad emocional y expresiva de la interpretación',
      rareza: 'Elementos únicos, inesperados y creativos',
      trash: 'Texturas lo-fi, imperfecciones y carácter "sucio"',
      garage: 'Estética cruda, indie y auténtica',
      vintage: 'Sonidos retro, analógicos y nostálgicos',
      experimental: 'Elementos vanguardistas y experimentales',
      groove: 'Qué tan "groovy" y rítmico será el resultado',
      atmosphere: 'Ambiente, texturas y espacialidad sonora'
    };
    
    return descriptions[knobName] || 'Ajusta según tu preferencia';
  };

  // Aplicar presets de perillas
  const applyKnobPreset = (presetName) => {
    const presets = {
      clean: {
        expresividad: 60, rareza: 30, trash: 20, garage: 40,
        vintage: 50, experimental: 25, groove: 70, atmosphere: 60
      },
      experimental: {
        expresividad: 85, rareza: 90, trash: 70, garage: 60,
        vintage: 40, experimental: 95, groove: 65, atmosphere: 85
      },
      vintage: {
        expresividad: 75, rareza: 50, trash: 60, garage: 70,
        vintage: 90, experimental: 40, groove: 80, atmosphere: 75
      },
      aggressive: {
        expresividad: 95, rareza: 75, trash: 85, garage: 90,
        vintage: 30, experimental: 70, groove: 90, atmosphere: 60
      }
    };
    
    if (presets[presetName]) {
      setArrangementKnobs(presets[presetName]);
    }
  };

  // Paso 4: Generación
  const renderGenerateStep = () => (
    <div className="step-content">
      <h2>🎵 Generando Producción</h2>
      
      {isProcessing ? (
        <div className="generation-container">
          <div className="ghost-animation">
            <div className="ghost-icon">👻</div>
            <div className="generation-waves">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="wave-ring" style={{ '--delay': `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
          
          <h3>Ghost Studio trabajando en tu producción...</h3>
          <div className="generation-info">
            <p>🎼 Aplicando arreglos profesionales</p>
            <p>🎛️ Procesando con perillas características</p>
            <p>🌍 Traduciendo prompt para Suno</p>
            <p>🎵 Generando pista completa</p>
          </div>
        </div>
      ) : (
        <div className="generation-preview">
          <h3>Vista Previa de Configuración</h3>
          
          <div className="config-summary">
            <div className="original-info">
              <h4>Maqueta Original</h4>
              <p>Archivo: {audioFile?.name}</p>
              {analysisResult && (
                <>
                  <p>Género: {analysisResult.genre}</p>
                  <p>BPM: {analysisResult.bpm}</p>
                  <p>Clave: {analysisResult.key}</p>
                </>
              )}
            </div>
            
            <div className="knobs-summary">
              <h4>Configuración de Perillas</h4>
              {Object.entries(arrangementKnobs).map(([knob, value]) => (
                <div key={knob} className="knob-summary">
                  <span>{knob}:</span>
                  <span>{value}%</span>
                </div>
              ))}
            </div>
            
            <div className="prompt-preview">
              <h4>Prompt Generado</h4>
              <p className="prompt-text">{buildGenerationPrompt()}</p>
              <p className="prompt-note">
                💡 Este prompt se traducirá automáticamente al inglés para Suno
              </p>
            </div>
          </div>
          
          <button className="generate-btn" onClick={generateTrack}>
            🎵 Generar Producción Profesional
          </button>
        </div>
      )}
    </div>
  );

  // Paso 5: Exportar
  const renderExportStep = () => (
    <div className="step-content">
      <h2>💾 Producción Completada</h2>
      
      {generatedTrack && (
        <div className="export-container">
          <div className="track-comparison">
            <div className="comparison-side">
              <h3>🎤 Maqueta Original</h3>
              <audio controls src={URL.createObjectURL(audioFile)} />
              <p>Tu idea original</p>
            </div>
            
            <div className="comparison-arrow">→</div>
            
            <div className="comparison-side">
              <h3>👻 Producción Ghost Studio</h3>
              <audio controls src={generatedTrack.audio_url} />
              <p>Versión profesional</p>
            </div>
          </div>
          
          <div className="track-info">
            <h3>Información de la Pista</h3>
            <div className="info-grid">
              <div>Duración: {generatedTrack.duration}</div>
              <div>Calidad: {generatedTrack.quality}</div>
              <div>Formato: {generatedTrack.format}</div>
              <div>Procesamiento: {generatedTrack.processing_time}</div>
            </div>
          </div>
          
          <div className="export-options">
            <h3>Opciones de Exportación</h3>
            <div className="export-buttons">
              <button className="export-btn">💾 Descargar WAV</button>
              <button className="export-btn">💿 Descargar MP3</button>
              <button className="export-btn">📚 Guardar en Archivo</button>
              <button className="export-btn">🎤 Enviar a Clone Station</button>
              <button className="export-btn">🚀 Compartir con Nova Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="ghost-studio-pro">
      <div className="studio-header">
        <div className="studio-title">
          <h1>👻 Ghost Studio</h1>
          <p>Democratizando la Música • IA + Análisis + Producción</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Progress indicator */}
      <div className="progress-bar">
        {['upload', 'analyze', 'arrange', 'generate', 'export'].map((step, index) => (
          <div
            key={step}
            className={`progress-step ${currentStep === step ? 'active' : ''} ${
              ['upload', 'analyze', 'arrange', 'generate', 'export'].indexOf(currentStep) > index ? 'completed' : ''
            }`}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-name">
              {step === 'upload' && 'Subir'}
              {step === 'analyze' && 'Analizar'}
              {step === 'arrange' && 'Arreglar'}
              {step === 'generate' && 'Generar'}
              {step === 'export' && 'Exportar'}
            </span>
          </div>
        ))}
      </div>

      <div className="studio-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default GhostStudioPro;
