// SNK Integrations - Mobile JavaScript
// Funcionalidades específicas para dispositivos móviles

class SNKMobileApp {
  constructor() {
    this.currentSection = 'home';
    this.isGenerating = false;
    this.isVoiceCloning = false;
    this.isAnalyzing = false;
    this.settings = this.loadSettings();
    this.init();
  }

  init() {
    console.log('🎵 SNK Integrations Mobile - Inicializando...');
    this.setupEventListeners();
    this.setupServiceWorker();
    this.checkSystemStatus();
    this.loadUserPreferences();
  }

  setupEventListeners() {
    // Bottom navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
        this.showSection(section);
      });
    });

    // Touch gestures
    this.setupTouchGestures();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });

    // Network status
    window.addEventListener('online', () => this.updateNetworkStatus(true));
    window.addEventListener('offline', () => this.updateNetworkStatus(false));
  }

  setupTouchGestures() {
    let startY = 0;
    let startX = 0;
    let isScrolling = false;

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isScrolling = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isScrolling) {
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        
        if (deltaY > deltaX) {
          isScrolling = true;
        } else if (deltaX > 50) {
          // Swipe gesture
          this.handleSwipe(e.touches[0].clientX - startX);
        }
      }
    }, { passive: true });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  handleSwipe(deltaX) {
    if (deltaX > 50) {
      // Swipe right - previous section
      this.navigateSection(-1);
    } else if (deltaX < -50) {
      // Swipe left - next section
      this.navigateSection(1);
    }
  }

  navigateSection(direction) {
    const sections = ['home', 'music', 'voice', 'analytics', 'settings'];
    const currentIndex = sections.indexOf(this.currentSection);
    const newIndex = (currentIndex + direction + sections.length) % sections.length;
    this.showSection(sections[newIndex]);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '1': e.preventDefault(); this.showSection('home'); break;
          case '2': e.preventDefault(); this.showSection('music'); break;
          case '3': e.preventDefault(); this.showSection('voice'); break;
          case '4': e.preventDefault(); this.showSection('analytics'); break;
          case '5': e.preventDefault(); this.showSection('settings'); break;
        }
      }
    });
  }

  showSection(section) {
    // Hide all sections
    const sections = ['musicSection', 'voiceSection', 'analyticsSection', 'settingsSection'];
    sections.forEach(s => {
      const el = document.getElementById(s);
      if (el) {
        el.style.display = 'none';
        el.classList.remove('fade-in');
      }
    });

    // Show selected section
    if (section !== 'home') {
      const el = document.getElementById(section + 'Section');
      if (el) {
        el.style.display = 'block';
        el.classList.add('fade-in');
      }
    }

    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const activeNav = document.querySelector(`[onclick="showSection('${section}')"]`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    this.currentSection = section;
    this.updatePageTitle(section);
  }

  updatePageTitle(section) {
    const titles = {
      'home': 'SNK Integrations',
      'music': 'Generación Musical',
      'voice': 'Clonación de Voz',
      'analytics': 'Analytics',
      'settings': 'Configuración'
    };
    
    document.title = `${titles[section]} - SNK Integrations`;
  }

  // Music Generation
  async generateMusic() {
    this.showSection('music');
  }

  async startGeneration() {
    const prompt = document.getElementById('musicPrompt').value;
    if (!prompt.trim()) {
      this.showNotification('Por favor, describe la música que quieres generar', 'warning');
      return;
    }

    this.isGenerating = true;
    this.updateMusicStatus('🔄 Generando música...', 'loading');
    
    try {
      // Simulate API call
      const response = await this.simulateMusicGeneration(prompt);
      this.updateMusicStatus('✅ Música generada exitosamente!', 'success');
      this.showNotification('Música generada y lista para reproducir', 'success');
    } catch (error) {
      this.updateMusicStatus('❌ Error en la generación', 'error');
      this.showNotification('Error al generar música', 'error');
    } finally {
      this.isGenerating = false;
    }
  }

  async simulateMusicGeneration(prompt) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          prompt: prompt,
          duration: '2:30',
          format: 'WAV',
          url: '#'
        });
      }, 3000);
    });
  }

  stopGeneration() {
    this.isGenerating = false;
    this.updateMusicStatus('⏹️ Generación detenida', 'info');
  }

  updateMusicStatus(message, type) {
    const statusEl = document.getElementById('musicStatus');
    if (statusEl) {
      statusEl.innerHTML = `${message} <span class="status-indicator status-${type}"></span>`;
    }
  }

  // Voice Cloning
  async cloneVoice() {
    this.showSection('voice');
  }

  async startVoiceCloning() {
    const text = document.getElementById('voiceText').value;
    const model = document.getElementById('voiceModel').value;
    
    if (!text.trim()) {
      this.showNotification('Por favor, ingresa el texto para clonar', 'warning');
      return;
    }

    this.isVoiceCloning = true;
    this.updateVoiceStatus('🔄 Clonando voz...', 'loading');
    
    try {
      const response = await this.simulateVoiceCloning(text, model);
      this.updateVoiceStatus('✅ Voz clonada exitosamente!', 'success');
      this.showNotification('Voz clonada y lista para usar', 'success');
    } catch (error) {
      this.updateVoiceStatus('❌ Error en la clonación', 'error');
      this.showNotification('Error al clonar voz', 'error');
    } finally {
      this.isVoiceCloning = false;
    }
  }

  async simulateVoiceCloning(text, model) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          text: text,
          model: model,
          duration: '0:15',
          format: 'MP3',
          url: '#'
        });
      }, 2000);
    });
  }

  updateVoiceStatus(message, type) {
    const statusEl = document.getElementById('voiceStatus');
    if (statusEl) {
      statusEl.innerHTML = `${message} <span class="status-indicator status-${type}"></span>`;
    }
  }

  // Analytics
  async analyzeSocial() {
    this.showSection('analytics');
    await this.loadAnalytics();
  }

  async loadAnalytics() {
    try {
      // Simulate loading analytics data
      const analytics = await this.simulateAnalyticsLoad();
      this.updateAnalyticsDisplay(analytics);
    } catch (error) {
      this.showNotification('Error al cargar analytics', 'error');
    }
  }

  async simulateAnalyticsLoad() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          generations: Math.floor(Math.random() * 50) + 10,
          voiceClones: Math.floor(Math.random() * 30) + 5,
          analyses: Math.floor(Math.random() * 20) + 3,
          totalMinutes: Math.floor(Math.random() * 200) + 100
        });
      }, 1000);
    });
  }

  updateAnalyticsDisplay(data) {
    // Update analytics cards with real data
    const cards = document.querySelectorAll('#analyticsSection .mobile-feature');
    if (cards.length >= 4) {
      cards[0].querySelector('.mobile-feature-title').textContent = data.generations;
      cards[1].querySelector('.mobile-feature-title').textContent = data.voiceClones;
      cards[2].querySelector('.mobile-feature-title').textContent = data.analyses;
      cards[3].querySelector('.mobile-feature-title').textContent = data.totalMinutes;
    }
  }

  // Settings
  async openSettings() {
    this.showSection('settings');
    this.loadSettingsForm();
  }

  loadSettingsForm() {
    // Load current settings into form
    const ollamaUrl = document.querySelector('input[placeholder*="Ollama"]');
    if (ollamaUrl) ollamaUrl.value = this.settings.ollamaUrl || 'http://localhost:11434';
    
    const model = document.querySelector('select');
    if (model) model.value = this.settings.model || 'qwen2.5:7b';
  }

  async saveSettings() {
    const ollamaUrl = document.querySelector('input[placeholder*="Ollama"]').value;
    const model = document.querySelector('select').value;
    
    this.settings = {
      ...this.settings,
      ollamaUrl,
      model,
      lastUpdated: new Date().toISOString()
    };
    
    this.saveSettingsToStorage();
    this.showNotification('Configuración guardada exitosamente', 'success');
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('snk-mobile-settings');
      return saved ? JSON.parse(saved) : {
        ollamaUrl: 'http://localhost:11434',
        model: 'qwen2.5:7b',
        theme: 'dark',
        notifications: true
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {};
    }
  }

  saveSettingsToStorage() {
    try {
      localStorage.setItem('snk-mobile-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // System Status
  async checkSystemStatus() {
    try {
      const status = await this.getSystemStatus();
      this.updateStatusIndicators(status);
    } catch (error) {
      console.error('Error checking system status:', error);
    }
  }

  async getSystemStatus() {
    // Simulate system status check
    return {
      system: 'online',
      ai: 'online',
      waves: 'offline',
      database: 'online'
    };
  }

  updateStatusIndicators(status) {
    const indicators = document.querySelectorAll('.status-indicator');
    indicators.forEach((indicator, index) => {
      const statuses = Object.values(status);
      if (statuses[index]) {
        indicator.className = `status-indicator status-${statuses[index]}`;
      }
    });
  }

  updateNetworkStatus(isOnline) {
    const statusText = document.querySelector('.status-indicator + span');
    if (statusText) {
      statusText.textContent = isOnline ? 'Sistema Online' : 'Sin Conexión';
    }
  }

  // Notifications
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white text-sm z-50 slide-up ${type}`;
    notification.style.background = this.getNotificationColor(type);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  getNotificationColor(type) {
    const colors = {
      success: 'linear-gradient(135deg, #10b981, #059669)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
      info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    };
    return colors[type] || colors.info;
  }

  // Service Worker
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration);
        })
        .catch(error => {
          console.log('Error registrando Service Worker:', error);
        });
    }
  }

  // User Preferences
  loadUserPreferences() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersDark) {
      document.body.classList.add('dark-theme');
    }
    
    if (prefersReducedMotion) {
      document.body.classList.add('reduced-motion');
    }
  }

  // Orientation handling
  handleOrientationChange() {
    // Recalculate layouts after orientation change
    this.checkSystemStatus();
    this.loadUserPreferences();
  }

  // Waves Integration
  openWaves() {
    this.showNotification('🎛️ Waves Integration - Funcionalidad en desarrollo', 'info');
  }

  // Utility methods
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Global functions for HTML onclick handlers
function showSection(section) {
  if (window.snkApp) {
    window.snkApp.showSection(section);
  }
}

function generateMusic() {
  if (window.snkApp) {
    window.snkApp.generateMusic();
  }
}

function cloneVoice() {
  if (window.snkApp) {
    window.snkApp.cloneVoice();
  }
}

function analyzeSocial() {
  if (window.snkApp) {
    window.snkApp.analyzeSocial();
  }
}

function openWaves() {
  if (window.snkApp) {
    window.snkApp.openWaves();
  }
}

function startGeneration() {
  if (window.snkApp) {
    window.snkApp.startGeneration();
  }
}

function stopGeneration() {
  if (window.snkApp) {
    window.snkApp.stopGeneration();
  }
}

function startVoiceCloning() {
  if (window.snkApp) {
    window.snkApp.startVoiceCloning();
  }
}

function saveSettings() {
  if (window.snkApp) {
    window.snkApp.saveSettings();
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.snkApp = new SNKMobileApp();
  console.log('🎵 SNK Integrations Mobile - Aplicación inicializada');
});

