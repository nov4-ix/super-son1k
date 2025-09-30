import React, { useState, useEffect } from 'react';
import './LeagueOfNoSilence.css';
import ALVAESigil from './ALVAESigil';

const LeagueOfNoSilence = ({ onMemberSelect, currentUser = null }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    role: '',
    specialization: '',
    contribution: '',
    socialMedia: ''
  });

  // Miembros fundadores y testers
  const foundingMembers = [
    {
      id: 'founder-1',
      name: 'NOV4-IX',
      role: 'Fundador Principal',
      specialization: 'Sistema de Resistencia',
      contribution: 'Arquitectura del universo Son1kVers3',
      socialMedia: '@nov4ix',
      status: 'active',
      joinDate: '2024-01-01',
      alvaeLevel: 100,
      achievements: ['Fundador', 'Arquitecto Principal', 'Resistencia Máxima'],
      avatar: '/images/members/nov4ix.jpg',
      isFounder: true
    },
    {
      id: 'founder-2',
      name: 'Bella',
      role: 'Co-Fundadora',
      specialization: 'Voz de la Resistencia',
      contribution: 'Nexo emocional y creatividad musical',
      socialMedia: '@bella_resistance',
      status: 'active',
      joinDate: '2024-01-01',
      alvaeLevel: 95,
      achievements: ['Co-Fundadora', 'Voz Principal', 'Conexión Máxima'],
      avatar: '/images/members/bella.jpg',
      isFounder: true
    },
    {
      id: 'founder-3',
      name: 'Pixel',
      role: 'Co-Fundador',
      specialization: 'Custodio Digital',
      contribution: 'Preservación de memoria y estrategia',
      socialMedia: '@pixel_digital',
      status: 'active',
      joinDate: '2024-01-01',
      alvaeLevel: 90,
      achievements: ['Co-Fundador', 'Custodio', 'Memoria Digital'],
      avatar: '/images/members/pixel.jpg',
      isFounder: true
    }
  ];

  const [members, setMembers] = useState(foundingMembers);

  // Niveles de ALVAE
  const alvaeLevels = {
    0: { name: 'Silencioso', color: '#666', description: 'Aún no ha activado su sigilo' },
    25: { name: 'Susurro', color: '#888', description: 'Primeros pasos en la resistencia' },
    50: { name: 'Eco', color: '#aaa', description: 'Su voz comienza a resonar' },
    75: { name: 'Resonancia', color: '#00ffff', description: 'Fuerte conexión con el universo' },
    90: { name: 'Armonía', color: '#ffd700', description: 'Sincronización perfecta' },
    100: { name: 'Sinfonía', color: '#ff00ff', description: 'Maestro del sonido y la resistencia' }
  };

  // Obtener nivel de ALVAE
  const getALVAELevel = (level) => {
    const levels = Object.keys(alvaeLevels).map(Number).sort((a, b) => b - a);
    for (const l of levels) {
      if (level >= l) {
        return alvaeLevels[l];
      }
    }
    return alvaeLevels[0];
  };

  // Manejar selección de miembro
  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    if (onMemberSelect) {
      onMemberSelect(member);
    }
  };

  // Manejar solicitud de ingreso
  const handleJoinRequest = (e) => {
    e.preventDefault();
    
    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberData.name,
      role: 'Aspirante',
      specialization: newMemberData.specialization,
      contribution: newMemberData.contribution,
      socialMedia: newMemberData.socialMedia,
      status: 'pending',
      joinDate: new Date().toISOString().split('T')[0],
      alvaeLevel: 0,
      achievements: ['Aspirante'],
      avatar: '/images/members/default.jpg',
      isFounder: false
    };

    setMembers(prev => [...prev, newMember]);
    setNewMemberData({
      name: '',
      role: '',
      specialization: '',
      contribution: '',
      socialMedia: ''
    });
    setShowJoinForm(false);
    
    // Mostrar mensaje de confirmación
    alert('Solicitud enviada. Tu sigilo ALVAE se activará cuando seas aceptado en la Liga.');
  };

  // Renderizar tarjeta de miembro
  const renderMemberCard = (member) => {
    const alvaeLevelData = getALVAELevel(member.alvaeLevel);
    
    return (
      <div
        key={member.id}
        className={`member-card ${member.status} ${member.isFounder ? 'founder' : ''}`}
        onClick={() => handleMemberSelect(member)}
      >
        <div className="member-header">
          <div className="member-avatar">
            <img 
              src={member.avatar} 
              alt={member.name}
              onError={(e) => {
                e.target.src = '/images/members/default.jpg';
              }}
            />
            <div className="alvae-sigil-container">
              <ALVAESigil 
                size="small" 
                interactive={false}
                className={`alvae-badge ${member.alvaeLevel > 0 ? 'active' : 'inactive'}`}
              />
            </div>
          </div>
          
          <div className="member-info">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-specialization">{member.specialization}</p>
          </div>
        </div>

        <div className="member-stats">
          <div className="stat-item">
            <span className="stat-label">Nivel ALVAE:</span>
            <div className="alvae-level">
              <div 
                className="alvae-level-bar"
                style={{ 
                  width: `${member.alvaeLevel}%`,
                  backgroundColor: alvaeLevelData.color
                }}
              ></div>
              <span className="alvae-level-text">{alvaeLevelData.name}</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Estado:</span>
            <span className={`status-badge ${member.status}`}>
              {member.status === 'active' ? 'Activo' : 
               member.status === 'pending' ? 'Pendiente' : 'Inactivo'}
            </span>
          </div>
        </div>

        <div className="member-achievements">
          {member.achievements.map((achievement, index) => (
            <span key={index} className="achievement-badge">
              {achievement}
            </span>
          ))}
        </div>

        <div className="member-footer">
          <div className="member-social">
            <span className="social-handle">{member.socialMedia}</span>
          </div>
          <div className="member-date">
            <span className="join-date">{member.joinDate}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="league-of-no-silence">
      <div className="league-header">
        <div className="league-title">
          <h1>Liga del No Silencio</h1>
          <p>Co-fundadores y Testers de Son1kVers3</p>
        </div>
        
        <div className="league-stats">
          <div className="stat-card">
            <h3>Miembros Activos</h3>
            <span className="stat-number">
              {members.filter(m => m.status === 'active').length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Nivel Promedio ALVAE</h3>
            <span className="stat-number">
              {Math.round(members.reduce((acc, m) => acc + m.alvaeLevel, 0) / members.length)}%
            </span>
          </div>
          <div className="stat-card">
            <h3>Fundadores</h3>
            <span className="stat-number">
              {members.filter(m => m.isFounder).length}
            </span>
          </div>
        </div>
      </div>

      <div className="league-content">
        <div className="members-grid">
          {members.map(renderMemberCard)}
        </div>

        <div className="join-section">
          <div className="join-header">
            <h2>¿Quieres unirte a la Liga?</h2>
            <p>Obtén tu sigilo ALVAE exclusivo y forma parte de la resistencia</p>
          </div>
          
          <button 
            className="join-btn"
            onClick={() => setShowJoinForm(true)}
          >
            Solicitar Ingreso
          </button>
        </div>
      </div>

      {showJoinForm && (
        <div className="join-modal">
          <div className="join-modal-content">
            <div className="modal-header">
              <h3>Solicitar Ingreso a la Liga del No Silencio</h3>
              <button 
                className="close-btn"
                onClick={() => setShowJoinForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleJoinRequest} className="join-form">
              <div className="form-group">
                <label>Nombre/Artista</label>
                <input
                  type="text"
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Especialización</label>
                <select
                  value={newMemberData.specialization}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, specialization: e.target.value }))}
                  required
                >
                  <option value="">Selecciona tu especialización</option>
                  <option value="Música">Música</option>
                  <option value="Producción">Producción</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Diseño">Diseño</option>
                  <option value="Testing">Testing</option>
                  <option value="Comunidad">Comunidad</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Contribución a la Resistencia</label>
                <textarea
                  value={newMemberData.contribution}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, contribution: e.target.value }))}
                  placeholder="Describe cómo contribuirás a la resistencia musical..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Redes Sociales</label>
                <input
                  type="text"
                  value={newMemberData.socialMedia}
                  onChange={(e) => setNewMemberData(prev => ({ ...prev, socialMedia: e.target.value }))}
                  placeholder="@tu_usuario"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowJoinForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="submit-btn">
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className="member-detail-modal">
          <div className="member-detail-content">
            <div className="detail-header">
              <div className="detail-avatar">
                <img src={selectedMember.avatar} alt={selectedMember.name} />
                <div className="detail-alvae">
                  <ALVAESigil 
                    size="medium" 
                    interactive={false}
                    className={selectedMember.alvaeLevel > 0 ? 'active' : 'inactive'}
                  />
                </div>
              </div>
              
              <div className="detail-info">
                <h2>{selectedMember.name}</h2>
                <p className="detail-role">{selectedMember.role}</p>
                <p className="detail-specialization">{selectedMember.specialization}</p>
                <p className="detail-contribution">{selectedMember.contribution}</p>
              </div>
            </div>
            
            <div className="detail-stats">
              <div className="detail-stat">
                <h4>Nivel ALVAE</h4>
                <div className="alvae-level-detail">
                  <div 
                    className="alvae-level-bar"
                    style={{ 
                      width: `${selectedMember.alvaeLevel}%`,
                      backgroundColor: getALVAELevel(selectedMember.alvaeLevel).color
                    }}
                  ></div>
                  <span className="alvae-level-text">
                    {getALVAELevel(selectedMember.alvaeLevel).name} ({selectedMember.alvaeLevel}%)
                  </span>
                </div>
                <p className="alvae-description">
                  {getALVAELevel(selectedMember.alvaeLevel).description}
                </p>
              </div>
            </div>
            
            <div className="detail-achievements">
              <h4>Logros</h4>
              <div className="achievements-list">
                {selectedMember.achievements.map((achievement, index) => (
                  <span key={index} className="achievement-badge">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
            
            <button 
              className="close-detail-btn"
              onClick={() => setSelectedMember(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueOfNoSilence;

