/**
 * 🎵 Classic Music Generator - Generador de música clásico
 */

import React, { useState } from 'react';

const ClassicMusicGenerator = ({ services }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState({
    duration: 30,
    tempo: 120,
    style: 'electronic'
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Por favor, describe la música que quieres generar');
      return;
    }

    setIsGenerating(true);
    try {
      const fullPrompt = `${prompt} - ${options.style} music, ${options.tempo} BPM, ${options.duration} seconds`;
      const musicResult = await services.webAudio.generateMusic(fullPrompt, {
        duration: options.duration,
        tempo: options.tempo
      });

      setResult({
        success: true,
        audioBuffer: musicResult.audioBuffer,
        analysis: musicResult.analysis,
        duration: musicResult.duration
      });
    } catch (error) {
      console.error('Error generating music:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (result && result.audioBuffer) {
      try {
        const wavBlob = services.webAudio.exportToWAV();
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `son1kvers3_music_${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting audio:', error);
        alert('Error al exportar el audio');
      }
    }
  };

  return (
    <div className="classic-tool">
      <h2>🎵 Generador de Música</h2>
      <p>Crea música original usando inteligencia artificial. Solo describe lo que quieres y nosotros lo generamos.</p>

      <div className="classic-form-group">
        <label htmlFor="prompt">Describe tu música:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Una canción alegre de rock con guitarra eléctrica y batería energética..."
          rows={4}
        />
      </div>

      <div className="options-grid">
        <div className="classic-form-group">
          <label htmlFor="duration">Duración (segundos):</label>
          <select
            id="duration"
            value={options.duration}
            onChange={(e) => setOptions({...options, duration: parseInt(e.target.value)})}
          >
            <option value={15}>15 segundos</option>
            <option value={30}>30 segundos</option>
            <option value={60}>1 minuto</option>
            <option value={120}>2 minutos</option>
          </select>
        </div>

        <div className="classic-form-group">
          <label htmlFor="tempo">Tempo (BPM):</label>
          <input
            id="tempo"
            type="number"
            value={options.tempo}
            onChange={(e) => setOptions({...options, tempo: parseInt(e.target.value)})}
            min="60"
            max="200"
          />
        </div>

        <div className="classic-form-group">
          <label htmlFor="style">Estilo:</label>
          <select
            id="style"
            value={options.style}
            onChange={(e) => setOptions({...options, style: e.target.value})}
          >
            <option value="electronic">Electrónica</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="ambient">Ambiental</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Clásica</option>
          </select>
        </div>
      </div>

      <button
        className="classic-generate-btn"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? (
          <>
            <span className="spinner"></span>
            Generando música...
          </>
        ) : (
          <>
            🎵 Generar Música
          </>
        )}
      </button>

      {result && (
        <div className="classic-result">
          {result.success ? (
            <>
              <h3>✅ ¡Música generada exitosamente!</h3>
              <p>Duración: {result.duration} segundos</p>
              {result.analysis && (
                <div className="analysis-info">
                  <p><strong>Estilo detectado:</strong> {result.analysis.style}</p>
                  <p><strong>Tempo:</strong> {result.analysis.tempo} BPM</p>
                  <p><strong>Instrumentos:</strong> {result.analysis.instruments.join(', ')}</p>
                </div>
              )}
              
              <div className="classic-audio-player">
                <audio controls>
                  <source src={result.audioBuffer} type="audio/wav" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>

              <button
                className="classic-btn"
                onClick={handleExport}
                style={{ marginTop: '1rem' }}
              >
                💾 Descargar WAV
              </button>
            </>
          ) : (
            <>
              <h3>❌ Error al generar música</h3>
              <p>{result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassicMusicGenerator;
