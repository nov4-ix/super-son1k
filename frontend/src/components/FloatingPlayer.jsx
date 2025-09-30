/**
 * 🎵 Floating Player - Reproductor Flotante Global
 * Reproductor que persiste en todas las ventanas y aplicaciones
 */

import React, { useState, useEffect, useRef } from 'react';
import './FloatingPlayer.css';

const FloatingPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [isMinimized, setIsMinimized] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Cargar estado persistente
  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    const savedPlaylist = localStorage.getItem('playlist');
    const savedVolume = localStorage.getItem('volume');
    
    if (savedTrack) setCurrentTrack(JSON.parse(savedTrack));
    if (savedPlaylist) setPlaylist(JSON.parse(savedPlaylist));
    if (savedVolume) setVolume(parseFloat(savedVolume));
  }, []);

  // Guardar estado
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem('currentTrack', JSON.stringify(currentTrack));
    }
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('volume', volume.toString());
  }, [currentTrack, playlist, volume]);

  // Control de audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const addToPlaylist = (track) => {
    setPlaylist(prev => [...prev, track]);
    if (!currentTrack) {
      setCurrentTrack(track);
      setCurrentIndex(0);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Escuchar eventos globales para agregar canciones
  useEffect(() => {
    const handleAddTrack = (event) => {
      addToPlaylist(event.detail);
    };

    window.addEventListener('addTrackToPlayer', handleAddTrack);
    return () => window.removeEventListener('addTrackToPlayer', handleAddTrack);
  }, []);

  if (!currentTrack && playlist.length === 0) {
    return null; // No mostrar si no hay música
  }

  return (
    <div className={`floating-player ${isMinimized ? 'minimized' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        volume={volume}
        autoPlay={isPlaying}
      />
      
      {!isMinimized && (
        <div className="player-content">
          <div className="track-info">
            <div className="track-cover">
              {currentTrack?.coverUrl ? (
                <img src={currentTrack.coverUrl} alt="Cover" />
              ) : (
                <div className="default-cover">🎵</div>
              )}
            </div>
            <div className="track-details">
              <div className="track-title">{currentTrack?.title || 'Sin título'}</div>
              <div className="track-artist">{currentTrack?.artist || 'Artista desconocido'}</div>
            </div>
          </div>

          <div className="player-controls">
            <button className="control-btn" onClick={playPrevious}>
              ⏮️
            </button>
            <button className="play-pause-btn" onClick={playPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="control-btn" onClick={playNext}>
              ⏭️
            </button>
          </div>

          <div className="progress-section">
            <div className="time-display">
              {formatTime(progress)}
            </div>
            <div 
              className="progress-bar" 
              ref={progressRef}
              onClick={handleProgressClick}
            >
              <div 
                className="progress-fill" 
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <div className="time-display">
              {formatTime(duration)}
            </div>
          </div>

          <div className="volume-section">
            <span>🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>

          <div className="playlist-info">
            {playlist.length > 0 && (
              <span className="playlist-count">
                {currentIndex + 1} / {playlist.length}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="player-actions">
        <button 
          className="minimize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? '🔊' : '🔇'}
        </button>
        <button className="close-btn" onClick={() => {
          setCurrentTrack(null);
          setPlaylist([]);
          setIsPlaying(false);
        }}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default FloatingPlayer;
