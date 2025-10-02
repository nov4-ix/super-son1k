/**
 * 🌊 Matrix Transition Effect - Efecto de Transición Matrix
 * Transición épica con colores de la aplicación (verde, azul, rosa)
 */

class MatrixTransition {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.isActive = false;
    this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    this.drops = [];
    this.fontSize = 14;
    this.columns = 0;
    this.colors = [
      '#00FFE7', // Verde neon (neon)
      '#00CCFF', // Azul cyan
      '#FF00FF', // Rosa magenta
      '#FFFF00', // Amarillo
      '#FF6600', // Naranja
      '#00FF88'  // Verde brillante
    ];
  }

  init() {
    // Crear canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    `;
    
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = new Array(this.columns).fill(1);
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.init();
    this.animate();
    
    // Mostrar mensaje de transición
    this.showTransitionMessage();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  showTransitionMessage() {
    const message = document.createElement('div');
    message.id = 'matrix-transition-message';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      color: #00FFE7;
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 0 20px #00FFE7;
      animation: matrix-glow 2s infinite alternate;
    `;
    
    message.innerHTML = `
      <div style="margin-bottom: 20px;">🌊 NEXUS ACTIVADO 🌊</div>
      <div style="font-size: 16px; color: #00CCFF;">Accediendo a la dimensión musical...</div>
      <div style="font-size: 14px; color: #FF00FF; margin-top: 10px;">La resistencia digital ha comenzado</div>
    `;
    
    document.body.appendChild(message);
    
    // Agregar CSS para la animación
    if (!document.getElementById('matrix-transition-styles')) {
      const style = document.createElement('style');
      style.id = 'matrix-transition-styles';
      style.textContent = `
        @keyframes matrix-glow {
          0% { text-shadow: 0 0 20px #00FFE7, 0 0 30px #00CCFF; }
          50% { text-shadow: 0 0 30px #FF00FF, 0 0 40px #FFFF00; }
          100% { text-shadow: 0 0 20px #00FFE7, 0 0 30px #00CCFF; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  animate() {
    if (!this.isActive) return;
    
    // Fondo con gradiente animado
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'rgba(10, 10, 10, 0.1)');
    gradient.addColorStop(0.5, 'rgba(26, 26, 46, 0.2)');
    gradient.addColorStop(1, 'rgba(22, 33, 62, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Efecto de desvanecimiento
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibujar caracteres
    for (let i = 0; i < this.drops.length; i++) {
      // Seleccionar color aleatorio
      const colorIndex = Math.floor(Math.random() * this.colors.length);
      const color = this.colors[colorIndex];
      
      // Carácter aleatorio
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      
      // Dibujar carácter
      this.ctx.fillStyle = color;
      this.ctx.font = `${this.fontSize}px monospace`;
      this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
      
      // Efecto de brillo
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
      this.ctx.shadowBlur = 0;
      
      // Resetear drop si llega al final
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Función global para activar la transición
window.activateMatrixTransition = function() {
  const matrix = new MatrixTransition();
  matrix.start();
  
  // Detener después de 3 segundos
  setTimeout(() => {
    matrix.stop();
    
    // Remover mensaje
    const message = document.getElementById('matrix-transition-message');
    if (message) {
      message.remove();
    }
    
    // Activar Nexus
    if (window.toggleImmersiveInterface) {
      window.toggleImmersiveInterface();
    }
  }, 3000);
};

// Exportar para uso global
window.MatrixTransition = MatrixTransition;
