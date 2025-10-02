/**
 * 👥 Community Hub - Sistema de Colaboraciones y Resistencia
 * Zona colaborativa con mensaje de la resistencia y reglas
 */

class CommunityHub {
  constructor() {
    this.topTracks = [];
    this.collaborations = [];
    this.userStats = {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      rank: 0
    };
    
    this.init();
  }

  init() {
    this.createCommunitySection();
    this.loadData();
    this.setupEventListeners();
  }

  createCommunitySection() {
    // Crear sección de comunidad
    const communitySection = document.createElement('section');
    communitySection.id = 'community';
    communitySection.className = 'content-section section-hidden min-h-screen pt-20 pb-10';
    communitySection.setAttribute('aria-hidden', 'true');
    
    communitySection.innerHTML = `
      <div class="mx-auto max-w-7xl px-4">
        <!-- Mensaje de la Resistencia -->
        <div class="resistance-message mb-12">
          <div class="resistance-header">
            <div class="resistance-logo">⚔️</div>
            <div class="resistance-title">LA RESISTENCIA</div>
          </div>
          
          <div class="resistance-content">
            <div class="resistance-quote">
              "Lo imperfecto también es sagrado"
            </div>
            
            <div class="resistance-manifesto">
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
              
              <div class="resistance-warning">
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
            
            <div class="resistance-footer">
              <div class="resistance-signature">
                <div class="signature-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div class="signature-text">
                  [LORE] "Lo imperfecto también es sagrado." — BELLA.exe
                </div>
                <div class="signature-line">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Header del Hub -->
        <div class="hub-header mb-8">
          <h2>🎵 Santuario - Red Social de la Resistencia</h2>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">${this.userStats.totalLikes}</span>
              <span class="stat-label">Likes</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.userStats.totalComments}</span>
              <span class="stat-label">Comentarios</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.userStats.totalShares}</span>
              <span class="stat-label">Shares</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">#${this.userStats.rank}</span>
              <span class="stat-label">Ranking</span>
            </div>
          </div>
        </div>

        <!-- Contenido del Hub -->
        <div class="hub-content">
          <!-- Canciones Más Likeadas -->
          <div class="top-tracks-section">
            <h3>🔥 Canciones Más Likeadas</h3>
            <div class="tracks-grid" id="tracksGrid">
              <!-- Se llena dinámicamente -->
            </div>
          </div>

          <!-- Colaboraciones Activas -->
          <div class="collaborations-section">
            <h3>🤝 Colaboraciones Activas</h3>
            <div class="collaborations-list" id="collaborationsList">
              <!-- Se llena dinámicamente -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Agregar al DOM
    document.body.appendChild(communitySection);
    
    // Agregar estilos
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('community-hub-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'community-hub-styles';
    style.textContent = `
      /* Estilos del Mensaje de Resistencia */
      .resistance-message {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        border: 2px solid #00ff00;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.2);
        font-family: 'Courier New', monospace;
        position: relative;
        overflow: hidden;
      }

      .resistance-message::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #00ff00, #00ffff, #ff00ff, #ffff00, #00ff00);
        animation: pulse-border 3s infinite;
      }

      @keyframes pulse-border {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .resistance-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #00ff00;
      }

      .resistance-logo {
        font-size: 32px;
        color: #00ff00;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        animation: pulse-glow 2s infinite;
      }

      @keyframes pulse-glow {
        0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 0, 0.5); }
        50% { text-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
      }

      .resistance-title {
        font-size: 24px;
        font-weight: bold;
        color: #00ffff;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        letter-spacing: 2px;
      }

      .resistance-content {
        color: #ffffff;
        line-height: 1.6;
      }

      .resistance-quote {
        font-size: 20px;
        font-style: italic;
        color: #ffff00;
        text-align: center;
        margin: 20px 0;
        padding: 15px;
        background: rgba(255, 255, 0, 0.1);
        border: 1px solid #ffff00;
        border-radius: 8px;
        text-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
      }

      .resistance-manifesto p {
        margin: 15px 0;
        font-size: 16px;
      }

      .resistance-manifesto strong {
        color: #00ff00;
        font-size: 18px;
        text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
      }

      .resistance-manifesto em {
        color: #00ffff;
        font-style: italic;
        display: block;
        text-align: center;
        margin-top: 20px;
        padding: 10px;
        background: rgba(0, 255, 255, 0.1);
        border-radius: 5px;
        border-left: 3px solid #00ffff;
      }

      .resistance-warning {
        margin-top: 25px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(255, 0, 0, 0.1) 0%, rgba(255, 100, 0, 0.1) 100%);
        border: 2px solid #ff0000;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
      }

      .resistance-warning::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff0000, #ff6600, #ffaa00, #ff0000);
        animation: warning-pulse 2s infinite;
      }

      @keyframes warning-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }

      .resistance-warning p {
        margin: 10px 0;
        color: #ffffff;
      }

      .resistance-warning strong {
        color: #ff0000;
        font-size: 18px;
        text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        display: block;
        margin-bottom: 15px;
      }

      .resistance-warning p:not(:first-child) {
        color: #ffcccc;
        font-size: 14px;
        line-height: 1.5;
      }

      .resistance-footer {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid #00ff00;
      }

      .resistance-signature {
        text-align: center;
        color: #00ff00;
        font-size: 14px;
      }

      .signature-line {
        color: #00ff00;
        font-family: monospace;
        margin: 5px 0;
        opacity: 0.7;
      }

      .signature-text {
        color: #00ffff;
        font-weight: bold;
        margin: 10px 0;
        text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
      }

      /* Estilos del Hub */
      .hub-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #00ff00;
      }

      .hub-header h2 {
        color: #00ff00;
        font-size: 28px;
        margin: 0;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }

      .user-stats {
        display: flex;
        gap: 20px;
      }

      .stat-item {
        text-align: center;
        background: rgba(0, 255, 0, 0.1);
        padding: 10px 15px;
        border-radius: 8px;
        border: 1px solid #00ff00;
      }

      .stat-value {
        display: block;
        font-size: 20px;
        font-weight: bold;
        color: #00ffff;
      }

      .stat-label {
        font-size: 12px;
        color: #ffffff;
        text-transform: uppercase;
      }

      .hub-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
      }

      .top-tracks-section h3,
      .collaborations-section h3 {
        color: #00ff00;
        font-size: 22px;
        margin-bottom: 20px;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
      }

      .tracks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .track-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #00ff00;
        border-radius: 12px;
        padding: 15px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .track-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
        border-color: #00ffff;
      }

      .track-cover {
        position: relative;
        width: 100%;
        height: 150px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        margin-bottom: 15px;
        background: #0a0a0a;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .track-cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .default-cover {
        font-size: 48px;
        color: #00ff00;
      }

      .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        color: #00ff00;
        padding: 10px;
        border-radius: 50%;
        font-size: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .track-cover:hover .play-overlay {
        opacity: 1;
      }

      .track-info {
        margin-bottom: 15px;
      }

      .track-title {
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 5px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        color: #00ffff;
        font-size: 14px;
        margin: 0 0 10px 0;
      }

      .track-meta {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .genre {
        color: #ffff00;
        background: rgba(255, 255, 0, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
      }

      .duration {
        color: #ffffff;
      }

      .track-stats {
        display: flex;
        justify-content: space-around;
        gap: 10px;
      }

      .stat {
        flex: 1;
      }

      .like-btn, .comment-btn, .share-btn {
        width: 100%;
        background: transparent;
        border: 1px solid #00ff00;
        color: #00ff00;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        font-family: 'Courier New', monospace;
      }

      .like-btn:hover, .comment-btn:hover, .share-btn:hover {
        background: #00ff00;
        color: #000000;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }

      .like-btn.liked {
        background: #ff0000;
        border-color: #ff0000;
        color: #ffffff;
      }

      .like-btn.liked:hover {
        background: #ff6666;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      }

      .collaborations-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .collaboration-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #00ffff;
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
      }

      .collaboration-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 255, 255, 0.2);
      }

      .collab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .collab-header h4 {
        color: #ffffff;
        margin: 0;
        font-size: 16px;
      }

      .status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
      }

      .status.en-progreso {
        background: rgba(255, 255, 0, 0.2);
        color: #ffff00;
        border: 1px solid #ffff00;
      }

      .status.completado {
        background: rgba(0, 255, 0, 0.2);
        color: #00ff00;
        border: 1px solid #00ff00;
      }

      .collab-participants {
        color: #00ffff;
        font-size: 14px;
        margin-bottom: 15px;
      }

      .participant {
        color: #ffffff;
        font-weight: bold;
      }

      .collab-progress {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .progress-bar {
        flex: 1;
        height: 8px;
        background: #333333;
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #00ffff);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .progress-text {
        color: #ffffff;
        font-size: 12px;
        font-weight: bold;
        min-width: 40px;
        text-align: right;
      }

      .collab-deadline {
        color: #ffff00;
        font-size: 12px;
        font-style: italic;
      }

      @media (max-width: 1024px) {
        .hub-content {
          grid-template-columns: 1fr;
        }
        
        .tracks-grid {
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        }
      }

      @media (max-width: 768px) {
        .hub-header {
          flex-direction: column;
          gap: 20px;
          text-align: center;
        }
        
        .user-stats {
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .tracks-grid {
          grid-template-columns: 1fr;
        }
        
        .track-stats {
          flex-direction: column;
          gap: 5px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  setupEventListeners() {
    // Evento global para agregar canciones al reproductor
    window.addEventListener('addTrackToPlayer', (event) => {
      if (window.floatingPlayer) {
        window.floatingPlayer.addToPlaylist(event.detail);
      }
    });
  }

  async loadData() {
    try {
      await this.loadTopTracks();
      await this.loadCollaborations();
      await this.loadUserStats();
      this.renderTracks();
      this.renderCollaborations();
    } catch (error) {
      console.error('Error loading community data:', error);
      this.loadSampleData();
    }
  }

  async loadTopTracks() {
    try {
      const response = await fetch('/api/community/top-tracks');
      const data = await response.json();
      this.topTracks = data.tracks || [];
    } catch (error) {
      console.error('Error loading top tracks:', error);
      this.loadSampleTracks();
    }
  }

  async loadCollaborations() {
    try {
      const response = await fetch('/api/community/collaborations');
      const data = await response.json();
      this.collaborations = data.collaborations || [];
    } catch (error) {
      console.error('Error loading collaborations:', error);
      this.loadSampleCollaborations();
    }
  }

  async loadUserStats() {
    try {
      const response = await fetch('/api/community/user-stats');
      const data = await response.json();
      this.userStats = data;
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }

  loadSampleData() {
    this.loadSampleTracks();
    this.loadSampleCollaborations();
  }

  loadSampleTracks() {
    this.topTracks = [
      {
        id: 1,
        title: "Cyberpunk Dreams",
        artist: "Pixel_Pro",
        likes: 1247,
        comments: 89,
        shares: 156,
        duration: "3:24",
        genre: "Electronic",
        coverUrl: "/covers/cyberpunk.jpg",
        audioUrl: "/audio/cyberpunk.mp3"
      },
      {
        id: 2,
        title: "Neon Nights",
        artist: "Ghost_Master",
        likes: 892,
        comments: 67,
        shares: 98,
        duration: "2:58",
        genre: "Synthwave",
        coverUrl: "/covers/neon.jpg",
        audioUrl: "/audio/neon.mp3"
      },
      {
        id: 3,
        title: "Digital Resistance",
        artist: "Quantum_Beat",
        likes: 756,
        comments: 45,
        shares: 123,
        duration: "4:12",
        genre: "Industrial",
        coverUrl: "/covers/resistance.jpg",
        audioUrl: "/audio/resistance.mp3"
      }
    ];
  }

  loadSampleCollaborations() {
    this.collaborations = [
      {
        id: 1,
        title: "Proyecto Colaborativo: Matrix Symphony",
        participants: ["Pixel_Pro", "Ghost_Master", "Quantum_Beat"],
        status: "En progreso",
        progress: 75,
        deadline: "2024-10-15"
      },
      {
        id: 2,
        title: "Remix Challenge: Cyberpunk Anthems",
        participants: ["Resistance_Alpha", "Neon_Producer"],
        status: "Completado",
        progress: 100,
        deadline: "2024-10-10"
      }
    ];
  }

  renderTracks() {
    const tracksGrid = document.getElementById('tracksGrid');
    if (!tracksGrid) return;

    tracksGrid.innerHTML = this.topTracks.map(track => `
      <div class="track-card">
        <div class="track-cover" onclick="communityHub.playTrack(${track.id})">
          ${track.coverUrl ? 
            `<img src="${track.coverUrl}" alt="${track.title}" />` : 
            `<div class="default-cover">🎵</div>`
          }
          <div class="play-overlay">▶️</div>
        </div>
        
        <div class="track-info">
          <h4 class="track-title">${track.title}</h4>
          <p class="track-artist">por ${track.artist}</p>
          <div class="track-meta">
            <span class="genre">${track.genre}</span>
            <span class="duration">${track.duration}</span>
          </div>
        </div>

        <div class="track-stats">
          <div class="stat">
            <button class="like-btn" onclick="communityHub.handleLike(${track.id})">
              ❤️ ${track.likes}
            </button>
          </div>
          <div class="stat">
            <button class="comment-btn" onclick="communityHub.handleComment(${track.id})">
              💬 ${track.comments}
            </button>
          </div>
          <div class="stat">
            <button class="share-btn" onclick="communityHub.handleShare(${track.id})">
              📤 ${track.shares}
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderCollaborations() {
    const collaborationsList = document.getElementById('collaborationsList');
    if (!collaborationsList) return;

    collaborationsList.innerHTML = this.collaborations.map(collab => `
      <div class="collaboration-card">
        <div class="collab-header">
          <h4>${collab.title}</h4>
          <span class="status ${collab.status.toLowerCase().replace(' ', '-')}">
            ${collab.status}
          </span>
        </div>
        
        <div class="collab-participants">
          <span>Participantes: </span>
          ${collab.participants.map((participant, index) => 
            `<span class="participant">${participant}${index < collab.participants.length - 1 ? ', ' : ''}</span>`
          ).join('')}
        </div>

        <div class="collab-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${collab.progress}%"></div>
          </div>
          <span class="progress-text">${collab.progress}%</span>
        </div>

        <div class="collab-deadline">
          Deadline: ${new Date(collab.deadline).toLocaleDateString()}
        </div>
      </div>
    `).join('');
  }

  playTrack(trackId) {
    const track = this.topTracks.find(t => t.id === trackId);
    if (track) {
      // Enviar evento global para agregar al reproductor flotante
      window.dispatchEvent(new CustomEvent('addTrackToPlayer', {
        detail: track
      }));
    }
  }

  async handleLike(trackId) {
    try {
      const response = await fetch(`/api/community/moderate/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, comment: 'like' })
      });
      
      if (response.ok) {
        // Actualizar estado local
        const track = this.topTracks.find(t => t.id === trackId);
        if (track) {
          track.likes += 1;
          this.renderTracks();
        }
        alert('✅ Like agregado correctamente');
      } else {
        const errorData = await response.json();
        if (response.status === 400) {
          alert(`⚠️ ${errorData.detail.message}\n\n${errorData.detail.warning}`);
        } else if (response.status === 403) {
          alert('🚫 Usuario baneado de la plataforma');
        } else {
          alert('❌ Error al dar like');
        }
      }
    } catch (error) {
      console.error('Error liking track:', error);
      alert('❌ Error de conexión al dar like');
    }
  }

  async handleComment(trackId) {
    const comment = prompt('Escribe tu comentario:');
    if (!comment) return;

    try {
      const response = await fetch(`/api/community/moderate/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, comment })
      });
      
      if (response.ok) {
        // Actualizar estado local
        const track = this.topTracks.find(t => t.id === trackId);
        if (track) {
          track.comments += 1;
          this.renderTracks();
        }
        alert('✅ Comentario publicado correctamente');
      } else {
        const errorData = await response.json();
        if (response.status === 400) {
          alert(`⚠️ ${errorData.detail.message}\n\n${errorData.detail.warning}`);
        } else if (response.status === 403) {
          alert('🚫 Usuario baneado de la plataforma');
        } else {
          alert('❌ Error al publicar comentario');
        }
      }
    } catch (error) {
      console.error('Error commenting:', error);
      alert('❌ Error de conexión al publicar comentario');
    }
  }

  async handleShare(trackId) {
    try {
      const response = await fetch(`/api/community/share/${trackId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Actualizar estado local
        const track = this.topTracks.find(t => t.id === trackId);
        if (track) {
          track.shares += 1;
          this.renderTracks();
        }
        alert('✅ Share registrado correctamente');
      } else {
        alert('❌ Error al compartir');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('❌ Error de conexión al compartir');
    }
  }
}

// Inicializar Community Hub
let communityHub;
document.addEventListener('DOMContentLoaded', function() {
  communityHub = new CommunityHub();
});

// Exportar para uso global
window.communityHub = communityHub;
