/**
 * 🎵 Son1kVers3 Logo - Logotipo Cyberpunk Inteligente
 * Diseño elegante con Ojo de la Providencia, circuitos y elementos tecnológicos
 */

class Son1kLogo {
  constructor() {
    this.logoElement = null;
    this.animationId = null;
    this.isAnimating = false;
    this.init();
  }

  init() {
    this.createLogo();
    this.setupAnimations();
    this.addToPage();
  }

  createLogo() {
    // Crear contenedor del logo
    this.logoElement = document.createElement('div');
    this.logoElement.className = 'son1k-logo-container';
    this.logoElement.innerHTML = this.generateSVGLogo();
    
    // Agregar estilos
    this.addStyles();
  }

  generateSVGLogo() {
    return `
      <svg viewBox="0 0 200 200" class="son1k-logo-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- Fondo del logo -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
          </linearGradient>
          
          <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#00ff00;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
          </linearGradient>
          
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffff00;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#00ff00;stop-opacity:0.6" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Fondo circular -->
        <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" stroke="#00ff00" stroke-width="2" opacity="0.9"/>
        
        <!-- Circuitos externos -->
        <g class="circuits-outer">
          <!-- Circuito superior -->
          <path d="M 20 50 Q 50 30 80 50 Q 110 70 140 50 Q 170 30 180 50" 
                stroke="url(#circuitGradient)" 
                stroke-width="2" 
                fill="none" 
                opacity="0.7"
                filter="url(#glow)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
          </path>
          
          <!-- Circuito inferior -->
          <path d="M 20 150 Q 50 170 80 150 Q 110 130 140 150 Q 170 170 180 150" 
                stroke="url(#circuitGradient)" 
                stroke-width="2" 
                fill="none" 
                opacity="0.7"
                filter="url(#glow)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" begin="1s" repeatCount="indefinite"/>
          </path>
          
          <!-- Circuitos laterales -->
          <path d="M 50 20 Q 30 50 50 80 Q 70 110 50 140 Q 30 170 50 180" 
                stroke="url(#circuitGradient)" 
                stroke-width="2" 
                fill="none" 
                opacity="0.6"
                filter="url(#glow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" begin="0.5s" repeatCount="indefinite"/>
          </path>
          
          <path d="M 150 20 Q 170 50 150 80 Q 130 110 150 140 Q 170 170 150 180" 
                stroke="url(#circuitGradient)" 
                stroke-width="2" 
                fill="none" 
                opacity="0.6"
                filter="url(#glow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" begin="1.5s" repeatCount="indefinite"/>
          </path>
        </g>
        
        <!-- Anillo principal -->
        <circle cx="100" cy="100" r="70" fill="none" stroke="url(#eyeGradient)" stroke-width="3" opacity="0.8">
          <animate attributeName="stroke-width" values="3;5;3" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Ojo de la Providencia -->
        <g class="eye-of-providence">
          <!-- Contorno del ojo -->
          <ellipse cx="100" cy="100" rx="45" ry="25" fill="none" stroke="#00ff00" stroke-width="2" opacity="0.9"/>
          
          <!-- Iris -->
          <ellipse cx="100" cy="100" rx="35" ry="20" fill="url(#eyeGradient)" opacity="0.8" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
          </ellipse>
          
          <!-- Pupila -->
          <ellipse cx="100" cy="100" rx="15" ry="8" fill="#000000" opacity="0.9"/>
          
          <!-- Reflejo en el ojo -->
          <ellipse cx="95" cy="95" rx="8" ry="4" fill="#ffffff" opacity="0.6"/>
          
          <!-- Líneas de energía del ojo -->
          <g class="eye-energy-lines">
            <line x1="100" y1="60" x2="100" y2="80" stroke="#00ffff" stroke-width="2" opacity="0.8">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
            </line>
            <line x1="100" y1="120" x2="100" y2="140" stroke="#00ffff" stroke-width="2" opacity="0.8">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
            </line>
            <line x1="60" y1="100" x2="80" y2="100" stroke="#ff00ff" stroke-width="2" opacity="0.8">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" begin="1s" repeatCount="indefinite"/>
            </line>
            <line x1="120" y1="100" x2="140" y2="100" stroke="#ff00ff" stroke-width="2" opacity="0.8">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" begin="1.5s" repeatCount="indefinite"/>
            </line>
          </g>
        </g>
        
        <!-- Circuitos internos -->
        <g class="circuits-inner">
          <!-- Circuito hexagonal interno -->
          <polygon points="100,60 130,80 130,120 100,140 70,120 70,80" 
                   fill="none" 
                   stroke="url(#circuitGradient)" 
                   stroke-width="1.5" 
                   opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="0.5s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Puntos de conexión -->
          <circle cx="100" cy="60" r="3" fill="#00ff00" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="130" cy="80" r="3" fill="#00ffff" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="0.3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="130" cy="120" r="3" fill="#ff00ff" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="0.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="140" r="3" fill="#ffff00" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="0.9s" repeatCount="indefinite"/>
          </circle>
          <circle cx="70" cy="120" r="3" fill="#00ff00" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="1.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="70" cy="80" r="3" fill="#00ffff" opacity="0.8">
            <animate attributeName="r" values="3;5;3" dur="2s" begin="1.5s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        <!-- Texto "SON1K" -->
        <g class="logo-text">
          <text x="100" y="170" 
                text-anchor="middle" 
                font-family="'Courier New', monospace" 
                font-size="16" 
                font-weight="bold" 
                fill="url(#eyeGradient)" 
                opacity="0.9"
                filter="url(#glow)">
            SON1K
            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
          </text>
          
          <text x="100" y="185" 
                text-anchor="middle" 
                font-family="'Courier New', monospace" 
                font-size="8" 
                fill="#00ff00" 
                opacity="0.7">
            VERS3
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
          </text>
        </g>
        
        <!-- Partículas flotantes -->
        <g class="floating-particles">
          <circle cx="40" cy="40" r="1" fill="#00ff00" opacity="0.6">
            <animate attributeName="cy" values="40;35;40" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="160" cy="40" r="1" fill="#00ffff" opacity="0.6">
            <animate attributeName="cy" values="40;35;40" dur="3s" begin="0.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="0.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="40" cy="160" r="1" fill="#ff00ff" opacity="0.6">
            <animate attributeName="cy" values="160;155;160" dur="3s" begin="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="160" cy="160" r="1" fill="#ffff00" opacity="0.6">
            <animate attributeName="cy" values="160;155;160" dur="3s" begin="1.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" begin="1.5s" repeatCount="indefinite"/>
          </circle>
        </g>
      </svg>
    `;
  }

  addStyles() {
    if (document.getElementById('son1k-logo-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'son1k-logo-styles';
    style.textContent = `
      .son1k-logo-container {
        display: inline-block;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .son1k-logo-container:hover {
        transform: scale(1.05);
        filter: brightness(1.2);
      }
      
      .son1k-logo-svg {
        width: 100%;
        height: 100%;
        max-width: 200px;
        max-height: 200px;
        display: block;
      }
      
      /* Animaciones personalizadas */
      .son1k-logo-container:hover .circuits-outer path {
        stroke-width: 3;
        filter: url(#glow);
      }
      
      .son1k-logo-container:hover .eye-of-providence ellipse {
        filter: url(#pulseGlow);
      }
      
      .son1k-logo-container:hover .circuits-inner polygon {
        stroke-width: 2;
        opacity: 1;
      }
      
      .son1k-logo-container:hover .floating-particles circle {
        r: 2;
        opacity: 1;
      }
      
      /* Efecto de click */
      .son1k-logo-container:active {
        transform: scale(0.95);
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .son1k-logo-svg {
          max-width: 150px;
          max-height: 150px;
        }
      }
      
      @media (max-width: 480px) {
        .son1k-logo-svg {
          max-width: 120px;
          max-height: 120px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  setupAnimations() {
    // Animación de rotación sutil
    this.logoElement.addEventListener('mouseenter', () => {
      this.startRotation();
    });
    
    this.logoElement.addEventListener('mouseleave', () => {
      this.stopRotation();
    });
  }

  startRotation() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    let rotation = 0;
    
    const animate = () => {
      if (!this.isAnimating) return;
      
      rotation += 0.5;
      this.logoElement.style.transform = `rotate(${rotation}deg)`;
      
      if (rotation < 360) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        this.logoElement.style.transform = 'rotate(0deg)';
      }
    };
    
    animate();
  }

  stopRotation() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.logoElement.style.transform = 'rotate(0deg)';
  }

  addToPage() {
    // Agregar al header de la página
    const header = document.querySelector('nav');
    if (header) {
      const logoContainer = header.querySelector('.logo-container');
      if (logoContainer) {
        logoContainer.innerHTML = '';
        logoContainer.appendChild(this.logoElement);
      } else {
        // Crear contenedor si no existe
        const newLogoContainer = document.createElement('div');
        newLogoContainer.className = 'logo-container';
        newLogoContainer.appendChild(this.logoElement);
        header.insertBefore(newLogoContainer, header.firstChild);
      }
    }
  }

  // Método para obtener el HTML del logo
  getLogoHTML() {
    return this.logoElement.outerHTML;
  }

  // Método para cambiar el tamaño
  resize(width, height) {
    this.logoElement.style.width = width + 'px';
    this.logoElement.style.height = height + 'px';
  }

  // Método para agregar evento de click
  onClick(callback) {
    this.logoElement.addEventListener('click', callback);
  }
}

// Inicializar el logo cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  window.son1kLogo = new Son1kLogo();
  
  // Agregar evento de click para activar Nexus
  window.son1kLogo.onClick(() => {
    console.log('🎵 Logo clickeado - Activando Nexus...');
    // Aquí se puede integrar con la activación del Nexus
    if (window.activateNexusEasterEgg) {
      window.activateNexusEasterEgg();
    }
  });
});

// Exportar para uso global
window.Son1kLogo = Son1kLogo;
