import React, { useState, useEffect } from 'react';
import './ModerationGuidelines.css';

const ModerationGuidelines = ({ onClose, show = true }) => {
  const [guidelines, setGuidelines] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      const response = await fetch('/api/moderation/guidelines');
      const data = await response.json();
      setGuidelines(data);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      // Fallback guidelines
      setGuidelines({
        title: "Política de Moderación del Santuario",
        description: "Protegemos la creatividad y los sentimientos de todos los creadores",
        rules: [
          "✅ Respeta los sentimientos del creador - cada obra viene del corazón",
          "✅ Comparte opiniones constructivas y respetuosas",
          "✅ Celebra la diversidad creativa y los diferentes estilos",
          "✅ Recuerda que el arte es subjetivo - no hay bien o mal",
          "❌ No critiques destructivamente - daña la creatividad",
          "❌ No uses lenguaje tóxico o despectivo",
          "❌ No hagas spam o promociones no solicitadas",
          "⚠️ Banea permanente para reincidentes - sin excepciones"
        ],
        examples: {
          constructive: [
            "Me gusta la atmósfera que creaste",
            "Interesante uso de los instrumentos",
            "Gracias por compartir tu creatividad",
            "Continúa experimentando con nuevos sonidos"
          ],
          destructive: [
            "Esto es una basura",
            "No sabes cantar",
            "Mejor dedícate a otra cosa",
            "Está mal hecho"
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="moderation-guidelines-overlay">
      <div className="moderation-guidelines-modal">
        <div className="guidelines-header">
          <h2>🛡️ {guidelines?.title || 'Política de Moderación'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="guidelines-content">
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Cargando pautas de moderación...</p>
            </div>
          ) : (
            <>
              <div className="guidelines-description">
                <p>{guidelines?.description}</p>
              </div>

              <div className="guidelines-section">
                <h3>📋 Reglas del Santuario</h3>
                <div className="rules-list">
                  {guidelines?.rules.map((rule, index) => (
                    <div key={index} className="rule-item">
                      <span className="rule-text">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="guidelines-section">
                <h3>✅ Comentarios Constructivos</h3>
                <div className="examples-list constructive">
                  {guidelines?.examples.constructive.map((example, index) => (
                    <div key={index} className="example-item">
                      <span className="example-icon">💚</span>
                      <span className="example-text">"{example}"</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="guidelines-section">
                <h3>❌ Comentarios Destructivos</h3>
                <div className="examples-list destructive">
                  {guidelines?.examples.destructive.map((example, index) => (
                    <div key={index} className="example-item">
                      <span className="example-icon">💔</span>
                      <span className="example-text">"{example}"</span>
                    </div>
                  ))}
                </div>
                <div className="warning-notice">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">
                    Estos comentarios serán censurados y pueden resultar en banea permanente
                  </span>
                </div>
              </div>

              <div className="guidelines-section">
                <h3>🎯 Filosofía del Santuario</h3>
                <div className="philosophy-content">
                  <div className="philosophy-quote">
                    <p>
                      "Lo imperfecto también es sagrado. Cada creación musical es una expresión 
                      única del alma del artista, nacida de emociones y sentimientos profundos. 
                      No hay bien o mal en el arte, solo diferentes perspectivas y experiencias."
                    </p>
                  </div>
                  
                  <div className="philosophy-points">
                    <div className="philosophy-point">
                      <span className="point-icon">🎵</span>
                      <span className="point-text">
                        Cada nota, cada silencio, cada acorde tiene un propósito emocional
                      </span>
                    </div>
                    <div className="philosophy-point">
                      <span className="point-icon">💫</span>
                      <span className="point-text">
                        La creatividad no se puede medir con estándares objetivos
                      </span>
                    </div>
                    <div className="philosophy-point">
                      <span className="point-icon">🌟</span>
                      <span className="point-text">
                        Respetar al creador es respetar la humanidad en su expresión más pura
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="guidelines-footer">
                <div className="consequences-warning">
                  <h4>🚨 Consecuencias por Violar las Reglas</h4>
                  <div className="consequences-list">
                    <div className="consequence-item">
                      <span className="consequence-level">Primera vez:</span>
                      <span className="consequence-action">Advertencia y censura del contenido</span>
                    </div>
                    <div className="consequence-item">
                      <span className="consequence-level">Segunda vez:</span>
                      <span className="consequence-action">Censura automática y suspensión temporal</span>
                    </div>
                    <div className="consequence-item">
                      <span className="consequence-level">Tercera vez:</span>
                      <span className="consequence-action">Banea permanente sin excepciones</span>
                    </div>
                  </div>
                </div>

                <div className="guidelines-actions">
                  <button className="accept-btn" onClick={onClose}>
                    Entendido, Respetaré las Reglas
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationGuidelines;

