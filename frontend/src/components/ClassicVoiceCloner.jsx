/**
 * 🎤 Classic Voice Cloner - Clonador de voz clásico
 */

import React, { useState } from 'react';

const ClassicVoiceCloner = ({ services }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [text, setText] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const [result, setResult] = useState(null);
  const [voiceSettings, setVoiceSettings] = useState({
    emotion: 'neutral',
    speed: 1.0,
    pitch: 0
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleClone = async () => {
    if (!audioFile || !text.trim()) {
      alert('Por favor, selecciona un archivo de audio y escribe el texto a convertir');
      return;
    }

    setIsCloning(true);
    try {
      const cloneResult = await services.voiceCloning.cloneVoice(audioFile, text, voiceSettings);
      setResult({
        success: true,
        audioUrl: cloneResult.audioUrl,
        duration: cloneResult.duration
      });
    } catch (error) {
      console.error('Error cloning voice:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsCloning(false);
    }
  };

  const handleDownload = () => {
    if (result && result.audioUrl) {
      const a = document.createElement('a');
      a.href = result.audioUrl;
      a.download = `cloned_voice_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="classic-tool">
      <h2>🎤 Clonador de Voz</h2>
      <p>Convierte texto a voz usando una muestra de audio como referencia. Carga un archivo de audio y escribe el texto que quieres que diga.</p>

      <div className="classic-form-group">
        <label htmlFor="audio-file">Archivo de audio de referencia:</label>
        <input
          id="audio-file"
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
        />
        {audioFile && (
          <p className="file-info">📁 Archivo seleccionado: {audioFile.name}</p>
        )}
      </div>

      <div className="classic-form-group">
        <label htmlFor="text">Texto a convertir:</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí el texto que quieres que diga con la voz clonada..."
          rows={4}
        />
      </div>

      <div className="options-grid">
        <div className="classic-form-group">
          <label htmlFor="emotion">Emoción:</label>
          <select
            id="emotion"
            value={voiceSettings.emotion}
            onChange={(e) => setVoiceSettings({...voiceSettings, emotion: e.target.value})}
          >
            <option value="neutral">Neutral</option>
            <option value="happy">Feliz</option>
            <option value="sad">Triste</option>
            <option value="angry">Enojado</option>
            <option value="surprised">Sorprendido</option>
          </select>
        </div>

        <div className="classic-form-group">
          <label htmlFor="speed">Velocidad:</label>
          <input
            id="speed"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceSettings.speed}
            onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
          />
          <span>{voiceSettings.speed}x</span>
        </div>

        <div className="classic-form-group">
          <label htmlFor="pitch">Tono:</label>
          <input
            id="pitch"
            type="range"
            min="-12"
            max="12"
            step="1"
            value={voiceSettings.pitch}
            onChange={(e) => setVoiceSettings({...voiceSettings, pitch: parseInt(e.target.value)})}
          />
          <span>{voiceSettings.pitch > 0 ? '+' : ''}{voiceSettings.pitch}</span>
        </div>
      </div>

      <button
        className="classic-generate-btn"
        onClick={handleClone}
        disabled={isCloning || !audioFile || !text.trim()}
      >
        {isCloning ? (
          <>
            <span className="spinner"></span>
            Clonando voz...
          </>
        ) : (
          <>
            🎤 Clonar Voz
          </>
        )}
      </button>

      {result && (
        <div className="classic-result">
          {result.success ? (
            <>
              <h3>✅ ¡Voz clonada exitosamente!</h3>
              {result.duration && (
                <p>Duración: {result.duration} segundos</p>
              )}
              
              <div className="classic-audio-player">
                <audio controls>
                  <source src={result.audioUrl} type="audio/wav" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>

              <button
                className="classic-btn"
                onClick={handleDownload}
                style={{ marginTop: '1rem' }}
              >
                💾 Descargar Audio
              </button>
            </>
          ) : (
            <>
              <h3>❌ Error al clonar voz</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassicVoiceCloner;
