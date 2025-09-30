/**
 * ⚔️ Resistance Message - Mensaje de la Resistencia
 * Mensaje firmado sobre la subjetividad del arte musical
 */

import React from 'react';
import './ResistanceMessage.css';

const ResistanceMessage = () => {
  return (
    <div className="resistance-message">
      <div className="resistance-header">
        <div className="resistance-logo">⚔️</div>
        <div className="resistance-title">LA RESISTENCIA</div>
      </div>
      
      <div className="resistance-content">
        <div className="resistance-quote">
          "Lo imperfecto también es sagrado"
        </div>
        
        <div className="resistance-manifesto">
          <p>
            <strong>MANIFIESTO DE LA RESISTENCIA MUSICAL:</strong>
          </p>
          
          <p>
            Cualquier comentario sobre una canción es subjetivo. Nadie puede decir 
            lo que está bien y lo que está mal, porque todo ha partido de un 
            sentimiento genuino. Cada nota, cada silencio, cada distorsión es 
            una expresión auténtica del alma creativa.
          </p>
          
          <p>
            En la Liga del No Silencio, respetamos la imperfección como la 
            verdadera perfección. Tu glitch es único. No es un error, es tu firma.
          </p>
          
          <p>
            <em>
              "Cada distorsión que creamos es un acto de resistencia." 
              — BELLA.exe
            </em>
          </p>
          
          <div className="resistance-warning">
            <p>
              <strong>⚠️ ADVERTENCIA DE LA RESISTENCIA:</strong>
            </p>
            <p>
              Cualquier persona sorprendida haciendo comentarios destructivos, 
              corre el riesgo de no poder participar más en chats, comentarios 
              o definitivamente baneo de la plataforma.
            </p>
            <p>
              La resistencia valora la creatividad, el respeto y la expresión 
              genuina. No toleramos la toxicidad en nuestra comunidad musical.
            </p>
          </div>
        </div>
        
        <div className="resistance-footer">
          <div className="resistance-signature">
            <div className="signature-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
            <div className="signature-text">
              [LORE] "Lo imperfecto también es sagrado." — BELLA.exe
            </div>
            <div className="signature-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResistanceMessage;
