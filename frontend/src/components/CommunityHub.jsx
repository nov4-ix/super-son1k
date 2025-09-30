/**
 * 👥 Community Hub - Centro de Colaboraciones y Comunidad
 * Sistema de likes, comentarios y compartir
 */

import React, { useState, useEffect } from 'react';
import './CommunityHub.css';
import ResistanceMessage from './ResistanceMessage';

const CommunityHub = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [userStats, setUserStats] = useState({
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    rank: 0
  });

  useEffect(() => {
    loadTopTracks();
    loadCollaborations();
    loadUserStats();
  }, []);

  const loadTopTracks = async () => {
    try {
      const response = await fetch('/api/community/top-tracks');
      const data = await response.json();
      setTopTracks(data.tracks || []);
    } catch (error) {
      console.error('Error loading top tracks:', error);
      // Datos de ejemplo
      setTopTracks([
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
      ]);
    }
  };

  const loadCollaborations = async () => {
    try {
      const response = await fetch('/api/community/collaborations');
      const data = await response.json();
      setCollaborations(data.collaborations || []);
    } catch (error) {
      console.error('Error loading collaborations:', error);
      setCollaborations([
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
      ]);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/community/user-stats');
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLike = async (trackId) => {
    try {
      const response = await fetch(`/api/community/like/${trackId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Actualizar estado local
        setTopTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { ...track, likes: track.likes + 1, liked: true }
            : track
        ));
      }
    } catch (error) {
      console.error('Error liking track:', error);
    }
  };

  const handleComment = async (trackId, comment) => {
    try {
      const response = await fetch(`/api/community/moderate/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track_id: trackId, comment })
      });
      
      if (response.ok) {
        // Actualizar estado local
        setTopTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { ...track, comments: track.comments + 1 }
            : track
        ));
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
  };

  const handleShare = async (trackId) => {
    try {
      const response = await fetch(`/api/community/share/${trackId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Actualizar estado local
        setTopTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { ...track, shares: track.shares + 1 }
            : track
        ));
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const playTrack = (track) => {
    // Enviar evento global para agregar al reproductor flotante
    window.dispatchEvent(new CustomEvent('addTrackToPlayer', {
      detail: track
    }));
  };

  return (
    <div className="community-hub">
      {/* Mensaje de resistencia */}
      <ResistanceMessage />
      
      <div className="hub-header">
        <h2>🎵 Santuario - Red Social de la Resistencia</h2>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-value">{userStats.totalLikes}</span>
            <span className="stat-label">Likes</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userStats.totalComments}</span>
            <span className="stat-label">Comentarios</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userStats.totalShares}</span>
            <span className="stat-label">Shares</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">#{userStats.rank}</span>
            <span className="stat-label">Ranking</span>
          </div>
        </div>
      </div>

      <div className="hub-content">
        <div className="top-tracks-section">
          <h3>🔥 Canciones Más Likeadas</h3>
          <div className="tracks-grid">
            {topTracks.map(track => (
              <div key={track.id} className="track-card">
                <div className="track-cover" onClick={() => playTrack(track)}>
                  {track.coverUrl ? (
                    <img src={track.coverUrl} alt={track.title} />
                  ) : (
                    <div className="default-cover">🎵</div>
                  )}
                  <div className="play-overlay">▶️</div>
                </div>
                
                <div className="track-info">
                  <h4 className="track-title">{track.title}</h4>
                  <p className="track-artist">por {track.artist}</p>
                  <div className="track-meta">
                    <span className="genre">{track.genre}</span>
                    <span className="duration">{track.duration}</span>
                  </div>
                </div>

                <div className="track-stats">
                  <div className="stat">
                    <button 
                      className={`like-btn ${track.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(track.id)}
                    >
                      ❤️ {track.likes}
                    </button>
                  </div>
                  <div className="stat">
                    <button className="comment-btn" onClick={() => {
                      const comment = prompt('Escribe tu comentario:');
                      if (comment) handleComment(track.id, comment);
                    }}>
                      💬 {track.comments}
                    </button>
                  </div>
                  <div className="stat">
                    <button className="share-btn" onClick={() => handleShare(track.id)}>
                      📤 {track.shares}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="collaborations-section">
          <h3>🤝 Colaboraciones Activas</h3>
          <div className="collaborations-list">
            {collaborations.map(collab => (
              <div key={collab.id} className="collaboration-card">
                <div className="collab-header">
                  <h4>{collab.title}</h4>
                  <span className={`status ${collab.status.toLowerCase().replace(' ', '-')}`}>
                    {collab.status}
                  </span>
                </div>
                
                <div className="collab-participants">
                  <span>Participantes: </span>
                  {collab.participants.map((participant, index) => (
                    <span key={index} className="participant">
                        {participant}
                        {index < collab.participants.length - 1 && ', '}
                    </span>
                  ))}
                </div>

                <div className="collab-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${collab.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{collab.progress}%</span>
                </div>

                <div className="collab-deadline">
                  Deadline: {new Date(collab.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
