/**
 * 🎵 Floating Player - Reproductor Flotante Global
 * Reproductor que persiste en todas las ventanas y aplicaciones
 */

class FloatingPlayer {
  constructor() {
    this.isPlaying = false;
    this.currentTrack = null;
    this.volume = 0.8;
    this.isMinimized = false;
    this.playlist = [];
    this.currentIndex = 0;
    this.progress = 0;
    this.duration = 0;
    this.audio = null;
    this.container = null;
    
    this.init();
  }

  init() {
    this.createPlayer();
    this.loadState();
    this.setupEventListeners();
  }

  createPlayer() {
    // Crear contenedor del reproductor
    this.container = document.createElement('div');
    this.container.id = 'floating-player';
    this.container.className = 'floating-player';
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 2px solid #00ff00;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
      z-index: 9999;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      font-family: 'Courier New', monospace;
      display: none;
    `;

    // Crear audio element
    this.audio = document.createElement('audio');
    this.audio.volume = this.volume;

    // Crear contenido del reproductor
    this.container.innerHTML = `
      <div class="player-content">
        <div class="track-info">
          <div class="track-cover">
            <div class="default-cover">🎵</div>
          </div>
          <div class="track-details">
            <div class="track-title">Sin título</div>
            <div class="track-artist">Artista desconocido</div>
          </div>
        </div>

        <div class="player-controls">
          <button class="control-btn" onclick="floatingPlayer.playPrevious()">⏮️</button>
          <button class="play-pause-btn" onclick="floatingPlayer.playPause()">▶️</button>
          <button class="control-btn" onclick="floatingPlayer.playNext()">⏭️</button>
        </div>

        <div class="progress-section">
          <div class="time-display">0:00</div>
          <div class="progress-bar" onclick="floatingPlayer.handleProgressClick(event)">
            <div class="progress-fill"></div>
          </div>
          <div class="time-display">0:00</div>
        </div>

        <div class="volume-section">
          <span>🔊</span>
          <input type="range" min="0" max="1" step="0.1" value="${this.volume}" 
                 class="volume-slider" onchange="floatingPlayer.handleVolumeChange(event)">
        </div>

        <div class="playlist-info">
          <span class="playlist-count">0 / 0</span>
        </div>
      </div>

      <div class="player-actions">
        <button class="minimize-btn" onclick="floatingPlayer.toggleMinimize()">🔊</button>
        <button class="close-btn" onclick="floatingPlayer.close()">✕</button>
      </div>
    `;

    // Agregar estilos
    this.addStyles();
    
    // Agregar al DOM
    document.body.appendChild(this.container);
  }

  addStyles() {
    if (document.getElementById('floating-player-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'floating-player-styles';
    style.textContent = `
      .floating-player {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 2px solid #00ff00;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 255, 0, 0.3);
        z-index: 9999;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        font-family: 'Courier New', monospace;
      }

      .floating-player.minimized {
        width: 60px;
        height: 60px;
      }

      .player-content {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .track-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .track-cover {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        overflow: hidden;
        background: #0a0a0a;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .default-cover {
        font-size: 24px;
        color: #00ff00;
      }

      .track-details {
        flex: 1;
        min-width: 0;
      }

      .track-title {
        color: #ffffff;
        font-weight: bold;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .track-artist {
        color: #00ffff;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .player-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
      }

      .control-btn, .play-pause-btn {
        background: transparent;
        border: 2px solid #00ff00;
        color: #00ff00;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
      }

      .control-btn:hover, .play-pause-btn:hover {
        background: #00ff00;
        color: #000000;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      }

      .play-pause-btn {
        font-size: 20px;
        padding: 10px 15px;
      }

      .progress-section {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .time-display {
        color: #ffffff;
        font-size: 12px;
        min-width: 40px;
        text-align: center;
      }

      .progress-bar {
        flex: 1;
        height: 6px;
        background: #333333;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00, #00ffff);
        border-radius: 3px;
        transition: width 0.1s ease;
      }

      .volume-section {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .volume-section span {
        color: #00ff00;
        font-size: 14px;
      }

      .volume-slider {
        flex: 1;
        height: 4px;
        background: #333333;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
      }

      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: #00ff00;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }

      .playlist-info {
        text-align: center;
      }

      .playlist-count {
        color: #00ffff;
        font-size: 12px;
        background: rgba(0, 255, 255, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
      }

      .player-actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 5px;
      }

      .minimize-btn, .close-btn {
        background: transparent;
        border: 1px solid #ff0000;
        color: #ff0000;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.3s ease;
      }

      .minimize-btn:hover, .close-btn:hover {
        background: #ff0000;
        color: #000000;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
      }

      @media (max-width: 768px) {
        .floating-player {
          width: calc(100vw - 40px);
          right: 20px;
          left: 20px;
        }
        
        .floating-player.minimized {
          width: 50px;
          height: 50px;
          right: 20px;
          left: auto;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  setupEventListeners() {
    // Eventos de audio
    this.audio.addEventListener('timeupdate', () => {
      this.progress = this.audio.currentTime;
      this.updateProgress();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.updateProgress();
    });

    this.audio.addEventListener('ended', () => {
      this.playNext();
    });

    // Evento global para agregar canciones
    window.addEventListener('addTrackToPlayer', (event) => {
      this.addToPlaylist(event.detail);
    });
  }

  loadState() {
    // Cargar estado desde localStorage
    const savedTrack = localStorage.getItem('currentTrack');
    const savedPlaylist = localStorage.getItem('playlist');
    const savedVolume = localStorage.getItem('volume');

    if (savedTrack) {
      this.currentTrack = JSON.parse(savedTrack);
      this.updateTrackInfo();
    }
    if (savedPlaylist) {
      this.playlist = JSON.parse(savedPlaylist);
      this.updatePlaylistInfo();
    }
    if (savedVolume) {
      this.volume = parseFloat(savedVolume);
      this.audio.volume = this.volume;
    }
  }

  saveState() {
    if (this.currentTrack) {
      localStorage.setItem('currentTrack', JSON.stringify(this.currentTrack));
    }
    localStorage.setItem('playlist', JSON.stringify(this.playlist));
    localStorage.setItem('volume', this.volume.toString());
  }

  show() {
    if (this.currentTrack || this.playlist.length > 0) {
      this.container.style.display = 'block';
    }
  }

  hide() {
    this.container.style.display = 'none';
  }

  addToPlaylist(track) {
    this.playlist.push(track);
    if (!this.currentTrack) {
      this.currentTrack = track;
      this.currentIndex = 0;
      this.updateTrackInfo();
    }
    this.updatePlaylistInfo();
    this.saveState();
    this.show();
  }

  playPause() {
    if (!this.audio.src) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
  }

  playNext() {
    if (this.playlist.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.currentTrack = this.playlist[this.currentIndex];
    this.updateTrackInfo();
    this.isPlaying = true;
    this.audio.play();
    this.updatePlayButton();
  }

  playPrevious() {
    if (this.playlist.length === 0) return;
    
    this.currentIndex = this.currentIndex === 0 ? this.playlist.length - 1 : this.currentIndex - 1;
    this.currentTrack = this.playlist[this.currentIndex];
    this.updateTrackInfo();
    this.isPlaying = true;
    this.audio.play();
    this.updatePlayButton();
  }

  updateTrackInfo() {
    if (!this.currentTrack) return;

    this.audio.src = this.currentTrack.audioUrl;
    
    const titleEl = this.container.querySelector('.track-title');
    const artistEl = this.container.querySelector('.track-artist');
    
    if (titleEl) titleEl.textContent = this.currentTrack.title || 'Sin título';
    if (artistEl) artistEl.textContent = this.currentTrack.artist || 'Artista desconocido';
    
    this.saveState();
  }

  updatePlayButton() {
    const playBtn = this.container.querySelector('.play-pause-btn');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
  }

  updateProgress() {
    const progressFill = this.container.querySelector('.progress-fill');
    const timeDisplays = this.container.querySelectorAll('.time-display');
    
    if (progressFill) {
      const percentage = this.duration > 0 ? (this.progress / this.duration) * 100 : 0;
      progressFill.style.width = `${percentage}%`;
    }
    
    if (timeDisplays.length >= 2) {
      timeDisplays[0].textContent = this.formatTime(this.progress);
      timeDisplays[1].textContent = this.formatTime(this.duration);
    }
  }

  updatePlaylistInfo() {
    const playlistCount = this.container.querySelector('.playlist-count');
    if (playlistCount) {
      playlistCount.textContent = `${this.currentIndex + 1} / ${this.playlist.length}`;
    }
  }

  handleProgressClick(event) {
    if (!this.duration) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * this.duration;
    
    this.audio.currentTime = newTime;
    this.progress = newTime;
    this.updateProgress();
  }

  handleVolumeChange(event) {
    this.volume = parseFloat(event.target.value);
    this.audio.volume = this.volume;
    this.saveState();
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.container.classList.toggle('minimized', this.isMinimized);
  }

  close() {
    this.currentTrack = null;
    this.playlist = [];
    this.isPlaying = false;
    this.audio.pause();
    this.hide();
    this.saveState();
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Inicializar reproductor flotante
let floatingPlayer;
document.addEventListener('DOMContentLoaded', function() {
  floatingPlayer = new FloatingPlayer();
});

// Exportar para uso global
window.floatingPlayer = floatingPlayer;
