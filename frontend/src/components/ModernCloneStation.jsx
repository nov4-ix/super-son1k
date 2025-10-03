import React, { useState, useRef } from 'react';
import './ModernCloneStation.css';

/**
 * 🎤 Modern Clone Station - Interfaz de Vanguardia
 * Sistema de clonación vocal con diseño futurista y controles intuitivos
 */

const ModernCloneStation = () => {
  const [activeMode, setActiveMode] = useState('clone'); // clone, tts, inference
  const [voiceSamples, setVoiceSamples] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ttsText, setTtsText] = useState('');
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 0,
    speed: 1.0,
    emotion: 'neutral',
    accent: 'neutral'
  });

  const fileInputRef = useRef(null);

  const pretrainedVoices = [
    { id: 1, name: 'Profesional Masculino', gender: 'male', language: 'es', icon: '👨‍💼', color: '#667eea' },
    { id: 2, name: 'Profesional Femenino', gender: 'female', language: 'es', icon: '👩‍💼', color: '#f093fb' },
    { id: 3, name: 'Narrador Épico', gender: 'male', language: 'es', icon: '🎭', color: '#4facfe' },
    { id: 4, name: 'Voz Juvenil', gender: 'female', language: 'es', icon: '🌟', color: '#feca57' },
    { id: 5, name: 'Locutor Radio', gender: 'male', language: 'es', icon: '📻', color: '#ff6b6b' }
  ];

  const emotions = [
    { value: 'neutral', label: 'Neutral', icon: '😐' },
    { value: 'happy', label: 'Feliz', icon: '😊' },
    { value: 'sad', label: 'Triste', icon: '😢' },
    { value: 'excited', label: 'Emocionado', icon: '🤩' },
    { value: 'calm', label: 'Calmado', icon: '😌' },
    { value: 'serious', label: 'Serio', icon: '😠' }
  ];

  const ttsMode = [
    { value: 'podcast', label: 'Podcast', icon: '🎙️', description: 'Conversacional y natural' },
    { value: 'video', label: 'Video/YouTube', icon: '🎬', description: 'Dinámico y expresivo' },
    { value: 'audiobook', label: 'Audiolibro', icon: '📚', description: 'Narrativo y pausado' },
    { value: 'commercial', label: 'Comercial', icon: '📢', description: 'Persuasivo y claro' }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newSamples = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      duration: '0:' + Math.floor(Math.random() * 60),
      file: file
    }));
    setVoiceSamples([...voiceSamples, ...newSamples]);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // Implementar lógica de grabación
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const removeSample = (id) => {
    setVoiceSamples(voiceSamples.filter(sample => sample.id !== id));
  };

  return (
    <div className="modern-clone-station">
      {/* Header */}
      <div className="clone-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🎤</div>
            <div className="logo-text">
              <h1>Clone Station</h1>
              <p>AI Voice Cloning & Text-to-Speech</p>
            </div>
          </div>

          <div className="mode-switcher">
            <button
              className={`mode-btn ${activeMode === 'clone' ? 'active' : ''}`}
              onClick={() => setActiveMode('clone')}
            >
              <span>🧬</span>
              <span>Clone Voice</span>
            </button>
            <button
              className={`mode-btn ${activeMode === 'tts' ? 'active' : ''}`}
              onClick={() => setActiveMode('tts')}
            >
              <span>💬</span>
              <span>Text-to-Speech</span>
            </button>
            <button
              className={`mode-btn ${activeMode === 'inference' ? 'active' : ''}`}
              onClick={() => setActiveMode('inference')}
            >
              <span>🎵</span>
              <span>Voice Inference</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="clone-content">
        {/* Clone Voice Mode */}
        {activeMode === 'clone' && (
          <div className="mode-container">
            <div className="content-grid-clone">
              {/* Upload Section */}
              <div className="glass-card upload-section">
                <div className="card-header">
                  <h2>📁 Voice Samples</h2>
                  <span className="badge">{voiceSamples.length}/5</span>
                </div>

                <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                  <div className="upload-icon">☁️</div>
                  <h3>Drag & Drop or Click to Upload</h3>
                  <p>Upload 3-5 voice samples for best results</p>
                  <p className="file-info">Supported: WAV, MP3 (Max 10MB each)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>

                <div className="record-section">
                  <button
                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={handleRecord}
                  >
                    <span className="record-icon">{isRecording ? '⏹️' : '🎙️'}</span>
                    <span>{isRecording ? 'Stop Recording' : 'Record Sample'}</span>
                  </button>
                </div>

                {voiceSamples.length > 0 && (
                  <div className="samples-list">
                    <h3>Uploaded Samples</h3>
                    {voiceSamples.map((sample) => (
                      <div key={sample.id} className="sample-item">
                        <div className="sample-icon">🎵</div>
                        <div className="sample-info">
                          <span className="sample-name">{sample.name}</span>
                          <span className="sample-meta">{sample.size} • {sample.duration}</span>
                        </div>
                        <button className="play-sample-btn">▶️</button>
                        <button className="remove-sample-btn" onClick={() => removeSample(sample.id)}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings Section */}
              <div className="glass-card settings-section">
                <div className="card-header">
                  <h2>⚙️ Voice Settings</h2>
                </div>

                {/* Pitch Control */}
                <div className="control-group">
                  <label>
                    <span>🎚️</span>
                    <span>Pitch</span>
                    <span className="control-value">{voiceSettings.pitch > 0 ? '+' : ''}{voiceSettings.pitch}</span>
                  </label>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={voiceSettings.pitch}
                    onChange={(e) => setVoiceSettings({...voiceSettings, pitch: parseInt(e.target.value)})}
                    className="modern-slider"
                  />
                  <div className="slider-labels">
                    <span>Lower</span>
                    <span>Higher</span>
                  </div>
                </div>

                {/* Speed Control */}
                <div className="control-group">
                  <label>
                    <span>⚡</span>
                    <span>Speed</span>
                    <span className="control-value">{voiceSettings.speed}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceSettings.speed}
                    onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                    className="modern-slider"
                  />
                  <div className="slider-labels">
                    <span>0.5x</span>
                    <span>2.0x</span>
                  </div>
                </div>

                {/* Emotion Selector */}
                <div className="control-group">
                  <label>
                    <span>🎭</span>
                    <span>Emotion</span>
                  </label>
                  <div className="emotion-grid">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.value}
                        className={`emotion-btn ${voiceSettings.emotion === emotion.value ? 'active' : ''}`}
                        onClick={() => setVoiceSettings({...voiceSettings, emotion: emotion.value})}
                      >
                        <span className="emotion-icon">{emotion.icon}</span>
                        <span className="emotion-label">{emotion.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Process Button */}
                <button
                  className={`process-btn ${isProcessing ? 'processing' : ''}`}
                  onClick={handleProcess}
                  disabled={voiceSamples.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner"></div>
                      <span>Training Model...</span>
                    </>
                  ) : (
                    <>
                      <span>🧬</span>
                      <span>Train Voice Model</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text-to-Speech Mode */}
        {activeMode === 'tts' && (
          <div className="mode-container">
            <div className="content-grid-tts">
              {/* Voice Selection */}
              <div className="glass-card voice-library">
                <div className="card-header">
                  <h2>🎭 Voice Library</h2>
                </div>

                <div className="voices-grid">
                  {pretrainedVoices.map((voice) => (
                    <div
                      key={voice.id}
                      className={`voice-card ${selectedVoice?.id === voice.id ? 'selected' : ''}`}
                      onClick={() => setSelectedVoice(voice)}
                    >
                      <div className="voice-avatar" style={{ background: voice.color }}>
                        <span>{voice.icon}</span>
                      </div>
                      <div className="voice-info">
                        <h4>{voice.name}</h4>
                        <span className="voice-lang">{voice.language.toUpperCase()}</span>
                      </div>
                      <button className="preview-voice-btn">▶️</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TTS Input */}
              <div className="glass-card tts-input-section">
                <div className="card-header">
                  <h2>💬 Text Input</h2>
                  <div className="tts-mode-selector">
                    {ttsMode.map((mode) => (
                      <button
                        key={mode.value}
                        className="tts-mode-btn"
                        title={mode.description}
                      >
                        <span>{mode.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="tts-textarea"
                  placeholder="Enter your text here... The AI will convert it to speech using the selected voice."
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  rows={12}
                />

                <div className="tts-stats">
                  <div className="stat">
                    <span className="stat-label">Characters:</span>
                    <span className="stat-value">{ttsText.length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Words:</span>
                    <span className="stat-value">{ttsText.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Est. Duration:</span>
                    <span className="stat-value">~{Math.ceil(ttsText.split(/\s+/).filter(Boolean).length / 150)}min</span>
                  </div>
                </div>

                <button
                  className="generate-tts-btn"
                  disabled={!ttsText || !selectedVoice}
                >
                  <span>🎙️</span>
                  <span>Generate Speech</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Voice Inference Mode */}
        {activeMode === 'inference' && (
          <div className="mode-container">
            <div className="glass-card inference-section">
              <div className="card-header">
                <h2>🎵 Voice Inference</h2>
                <p className="subtitle">Apply your cloned voice to existing tracks</p>
              </div>

              <div className="inference-content">
                <div className="track-upload">
                  <div className="upload-icon">🎵</div>
                  <h3>Upload Track</h3>
                  <p>Drag & drop your audio file here</p>
                  <button className="browse-btn">Browse Files</button>
                </div>

                <div className="inference-settings">
                  <h3>Inference Settings</h3>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Preserve Original Melody</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>Preserve Effects</span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Clone Intensity</label>
                    <input type="range" min="0" max="100" defaultValue="80" className="modern-slider" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>
    </div>
  );
};

export default ModernCloneStation;
