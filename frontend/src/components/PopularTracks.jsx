import React, { useState, useEffect } from 'react';
import './PopularTracks.css';
import ALVAEBadge from './ALVAEBadge';
import ModerationGuidelines from './ModerationGuidelines';

const PopularTracks = ({ onTrackSelect, currentUser = null }) => {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('likes');
  const [filterBy, setFilterBy] = useState('all');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [moderationResult, setModerationResult] = useState(null);

  // Datos de ejemplo de tracks populares
  useEffect(() => {
    setTracks([
      {
        id: 1,
        title: 'Resistencia Digital',
        artist: 'Bella',
        artistId: 'bella',
        artistAvatar: '/images/avatars/bella.jpg',
        artistAlvaeLevel: 95,
        duration: '3:45',
        genre: 'Cyberpunk',
        mood: 'Determinado',
        location: 'Ghost Studio',
        audioUrl: '/audio/resistencia-digital.mp3',
        coverArt: '/images/covers/resistencia-digital.jpg',
        likes: 1250,
        comments: 89,
        shares: 156,
        plays: 5420,
        createdAt: '2024-01-10T14:30:00Z',
        isVerified: true,
        description: 'Una composición que captura la esencia de la resistencia a través de la música. Cada nota es un grito de libertad.',
        tags: ['Resistencia', 'Cyberpunk', 'Libertad', 'Digital'],
        isLiked: false,
        isShared: false,
        commentsList: [
          {
            id: 1,
            user: {
              name: 'NOV4-IX',
              avatar: '/images/avatars/nov4ix.jpg',
              alvaeLevel: 100,
              isVerified: true
            },
            content: 'Esta pieza resuena con la energía de la liberación. Bella ha capturado perfectamente el espíritu de la resistencia.',
            timestamp: '2024-01-10T15:45:00Z',
            likes: 23
          },
          {
            id: 2,
            user: {
              name: 'Pixel',
              avatar: '/images/avatars/pixel.jpg',
              alvaeLevel: 90,
              isVerified: true
            },
            content: 'La composición tiene una estructura narrativa impresionante. Cada sección cuenta una parte de la historia de la resistencia.',
            timestamp: '2024-01-10T16:20:00Z',
            likes: 18
          }
        ]
      },
      {
        id: 2,
        title: 'Memoria Perdida',
        artist: 'Pixel',
        artistId: 'pixel',
        artistAvatar: '/images/avatars/pixel.jpg',
        artistAlvaeLevel: 90,
        duration: '4:12',
        genre: 'Ambient',
        mood: 'Nostálgico',
        location: 'The Archive',
        audioUrl: '/audio/memoria-perdida.mp3',
        coverArt: '/images/covers/memoria-perdida.jpg',
        likes: 980,
        comments: 67,
        shares: 134,
        plays: 3890,
        createdAt: '2024-01-08T09:15:00Z',
        isVerified: true,
        description: 'Una exploración sonora de los fragmentos de memoria digital que custodia el Archivo. Cada sonido es un recuerdo preservado.',
        tags: ['Memoria', 'Ambient', 'Digital', 'Preservación'],
        isLiked: false,
        isShared: false,
        commentsList: [
          {
            id: 3,
            user: {
              name: 'Bella',
              avatar: '/images/avatars/bella.jpg',
              alvaeLevel: 95,
              isVerified: true
            },
            content: 'Pixel, has creado algo verdaderamente conmovedor. La música transporta a lugares que pensé que había olvidado.',
            timestamp: '2024-01-08T10:30:00Z',
            likes: 31
          }
        ]
      },
      {
        id: 3,
        title: 'Sistema Liberado',
        artist: 'NOV4-IX',
        artistId: 'nov4ix',
        artistAvatar: '/images/avatars/nov4ix.jpg',
        artistAlvaeLevel: 100,
        duration: '2:58',
        genre: 'Industrial',
        mood: 'Agresivo',
        location: 'La Terminal',
        audioUrl: '/audio/sistema-liberado.mp3',
        coverArt: '/images/covers/sistema-liberado.jpg',
        likes: 1450,
        comments: 112,
        shares: 203,
        plays: 6780,
        createdAt: '2024-01-05T16:45:00Z',
        isVerified: true,
        description: 'El sonido de la liberación. Cada beat representa un archivo liberado, cada melodía una mente despertando.',
        tags: ['Liberación', 'Industrial', 'Sistema', 'Resistencia'],
        isLiked: false,
        isShared: false,
        commentsList: []
      }
    ]);
  }, []);

  // Manejar like
  const handleLike = (trackId) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { 
            ...track, 
            isLiked: !track.isLiked,
            likes: track.isLiked ? track.likes - 1 : track.likes + 1
          }
        : track
    ));
  };

  // Manejar share
  const handleShare = (trackId) => {
    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { 
            ...track, 
            isShared: !track.isShared,
            shares: track.isShared ? track.shares - 1 : track.shares + 1
          }
        : track
    ));
  };

  // Moderar comentario antes de publicar
  const moderateComment = async (comment) => {
    try {
      const response = await fetch('/api/moderation/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          content_type: 'comment',
          user_id: currentUser?.id
        })
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error moderating comment:', error);
      return { is_approved: true, action: 'approve' };
    }
  };

  // Manejar comentario con moderación
  const handleComment = async (trackId) => {
    if (!newComment.trim()) return;
    
    // Moderar comentario
    const moderation = await moderateComment(newComment);
    setModerationResult(moderation);
    
    if (!moderation.is_approved) {
      alert(`Comentario censurado: ${moderation.reason}`);
      if (moderation.suggested_replacement) {
        setNewComment(moderation.suggested_replacement);
      } else {
        setNewComment('');
      }
      return;
    }
    
    const comment = {
      id: Date.now(),
      user: currentUser || {
        name: 'Usuario',
        avatar: '/images/avatars/default.jpg',
        alvaeLevel: 0,
        isVerified: false
      },
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { 
            ...track, 
            commentsList: [...track.commentsList, comment],
            comments: track.comments + 1
          }
        : track
    ));
    
    setNewComment('');
    setModerationResult(null);
  };

  // Filtrar y ordenar tracks
  const filteredTracks = tracks
    .filter(track => {
      if (filterBy === 'all') return true;
      if (filterBy === 'verified') return track.isVerified;
      if (filterBy === 'recent') {
        const trackDate = new Date(track.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return trackDate > weekAgo;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'plays':
          return b.plays - a.plays;
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'comments':
          return b.comments - a.comments;
        default:
          return b.likes - a.likes;
      }
    });

  // Renderizar track card
  const renderTrackCard = (track) => (
    <div key={track.id} className="track-card">
      <div className="track-header">
        <div className="track-cover">
          <img src={track.coverArt} alt={track.title} />
          <div className="play-overlay">
            <button 
              className="play-btn"
              onClick={() => setSelectedTrack(track)}
            >
              ▶️
            </button>
          </div>
        </div>
        
        <div className="track-info">
          <h3 className="track-title">{track.title}</h3>
          <div className="track-artist">
            <img 
              src={track.artistAvatar} 
              alt={track.artist}
              className="artist-avatar"
            />
            <div className="artist-info">
              <span className="artist-name">
                {track.artist}
                {track.isVerified && <span className="verified-badge">✓</span>}
              </span>
              <div className="artist-alvae">
                <ALVAEBadge 
                  level={track.artistAlvaeLevel}
                  size="small"
                  showLevel={false}
                  showName={false}
                />
              </div>
            </div>
          </div>
          
          <div className="track-meta">
            <span className="track-duration">{track.duration}</span>
            <span className="track-genre">{track.genre}</span>
            <span className="track-mood">{track.mood}</span>
            <span className="track-location">📍 {track.location}</span>
          </div>
        </div>
      </div>

      <div className="track-description">
        <p>{track.description}</p>
      </div>

      <div className="track-tags">
        {track.tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="track-stats">
        <div className="stat-item">
          <span className="stat-icon">👁️</span>
          <span className="stat-value">{track.plays.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">❤️</span>
          <span className="stat-value">{track.likes.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span className="stat-value">{track.comments}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔄</span>
          <span className="stat-value">{track.shares}</span>
        </div>
      </div>

      <div className="track-actions">
        <button 
          className={`action-btn like ${track.isLiked ? 'active' : ''}`}
          onClick={() => handleLike(track.id)}
        >
          <span className="action-icon">❤️</span>
          <span className="action-text">Like</span>
        </button>
        
        <button 
          className="action-btn comment"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="action-icon">💬</span>
          <span className="action-text">Comentar</span>
        </button>
        
        <button 
          className={`action-btn share ${track.isShared ? 'active' : ''}`}
          onClick={() => handleShare(track.id)}
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Compartir</span>
        </button>
      </div>

      {showComments && (
        <div className="track-comments">
          <div className="comments-header">
            <h4>Comentarios</h4>
            <div className="moderation-warning">
              <span className="warning-icon">⚠️</span>
              <span className="warning-text">
                Recuerda: Cada crítica de arte es subjetiva. Respeta los sentimientos del creador.
              </span>
            </div>
          </div>
          
          <div className="comments-list">
            {track.commentsList.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-user">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name}
                    className="comment-avatar"
                  />
                  <div className="comment-user-info">
                    <span className="comment-user-name">
                      {comment.user.name}
                      {comment.user.isVerified && <span className="verified-badge">✓</span>}
                    </span>
                    <div className="comment-user-alvae">
                      <ALVAEBadge 
                        level={comment.user.alvaeLevel}
                        size="small"
                        showLevel={false}
                        showName={false}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="comment-content">
                  <p>{comment.content}</p>
                  <div className="comment-meta">
                    <span className="comment-time">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                    <button className="comment-like">
                      <span className="comment-like-icon">❤️</span>
                      <span className="comment-like-count">{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Comparte tu opinión respetuosa sobre esta obra..."
              className="comment-input"
              rows="3"
            />
            <div className="comment-form-actions">
              <div className="comment-guidelines">
                <span className="guideline-text">
                  💡 Recuerda: Las críticas destructivas serán censuradas. 
                  Banea permanente para reincidentes.
                </span>
              </div>
              <button 
                className="comment-submit-btn"
                onClick={() => handleComment(track.id)}
                disabled={!newComment.trim()}
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="popular-tracks">
      <div className="tracks-header">
        <div className="header-left">
          <h2>🎵 Tracks Más Populares</h2>
          <p>Las creaciones más valoradas por la comunidad</p>
        </div>
        
        <div className="header-controls">
          <div className="filter-controls">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos</option>
              <option value="verified">Verificados</option>
              <option value="recent">Recientes</option>
            </select>
          </div>
          
          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="likes">Más Likeados</option>
              <option value="plays">Más Reproducidos</option>
              <option value="recent">Más Recientes</option>
              <option value="comments">Más Comentados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="moderation-notice">
        <div className="notice-content">
          <span className="notice-icon">🛡️</span>
          <div className="notice-text">
            <h3>Política de Moderación del Santuario</h3>
            <p>
              <strong>IMPORTANTE:</strong> Cada crítica de arte es subjetiva. Nadie puede decir lo que está bien o mal 
              porque todo salió de un sentimiento o emoción del creador. Las críticas destructivas serán motivo de 
              censura tanto en comentarios como en el chat. Quien persista será baneado definitivamente de la plataforma, 
              sin importar el tier de su cuenta.
            </p>
            <div className="notice-rules">
              <div className="rule-item">
                <span className="rule-icon">✅</span>
                <span>Respeta los sentimientos del creador</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon">✅</span>
                <span>Comparte opiniones constructivas</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon">❌</span>
                <span>No critiques destructivamente</span>
              </div>
              <div className="rule-item">
                <span className="rule-icon">⚠️</span>
                <span>Banea permanente para reincidentes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tracks-grid">
        {filteredTracks.map(renderTrackCard)}
      </div>

      {selectedTrack && (
        <div className="track-modal">
          <div className="modal-overlay" onClick={() => setSelectedTrack(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedTrack.title}</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedTrack(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="track-player">
                  <img 
                    src={selectedTrack.coverArt} 
                    alt={selectedTrack.title}
                    className="player-cover"
                  />
                  <audio controls className="audio-player">
                    <source src={selectedTrack.audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
                
                <div className="track-details">
                  <div className="detail-item">
                    <span className="detail-label">Artista:</span>
                    <span className="detail-value">{selectedTrack.artist}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duración:</span>
                    <span className="detail-value">{selectedTrack.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Género:</span>
                    <span className="detail-value">{selectedTrack.genre}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Estado de ánimo:</span>
                    <span className="detail-value">{selectedTrack.mood}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ubicación:</span>
                    <span className="detail-value">{selectedTrack.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularTracks;
