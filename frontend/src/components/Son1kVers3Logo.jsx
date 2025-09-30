import React from 'react';
import './Son1kVers3Logo.css';

const Son1kVers3Logo = ({ 
  size = 'medium', 
  variant = 'full', 
  animated = false, 
  className = '',
  onClick = null 
}) => {
  const sizeClasses = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large',
    xlarge: 'logo-xlarge'
  };

  const variantClasses = {
    full: 'logo-full',
    icon: 'logo-icon',
    text: 'logo-text-only',
    minimal: 'logo-minimal'
  };

  const logoClasses = [
    'son1kvers3-logo',
    sizeClasses[size],
    variantClasses[variant],
    animated ? 'logo-animated' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={logoClasses}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label="Son1kVers3 Logo"
      tabIndex={onClick ? 0 : -1}
    >
      {variant !== 'text' && (
        <div className="logo-symbol">
          <div className="logo-pyramid">
            <div className="logo-eye">
              <div className="eye-iris">
                <div className="eye-pupil">
                  <div className="eye-reflection"></div>
                </div>
                <div className="eye-radial-lines">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="radial-line"
                      style={{ transform: `rotate(${i * 45}deg)` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="logo-geometric-ring">
            <div className="ring-inner"></div>
            <div className="ring-outer"></div>
            <div className="ring-radials">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="radial-line"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
            </div>
            <div className="ring-dots">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="ring-dot"
                  style={{ 
                    transform: `rotate(${i * 15}deg) translateX(60px)`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="logo-circuit-elements">
            <div className="circuit-top">
              <div className="circuit-line"></div>
              <div className="circuit-line"></div>
              <div className="circuit-line"></div>
            </div>
            <div className="circuit-bottom">
              <div className="circuit-line"></div>
              <div className="circuit-line"></div>
            </div>
            <div className="circuit-corners">
              <div className="circuit-corner top-left">
                <div className="circuit-path"></div>
                <div className="circuit-node"></div>
                <div className="circuit-node"></div>
              </div>
              <div className="circuit-corner top-right">
                <div className="circuit-path"></div>
                <div className="circuit-node"></div>
                <div className="circuit-node"></div>
              </div>
              <div className="circuit-corner bottom-left">
                <div className="circuit-path"></div>
                <div className="circuit-node"></div>
                <div className="circuit-node"></div>
              </div>
              <div className="circuit-corner bottom-right">
                <div className="circuit-path"></div>
                <div className="circuit-node"></div>
                <div className="circuit-node"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {variant !== 'icon' && (
        <div className="logo-text">
          <span className="logo-text-main">SON1KVERS3</span>
          <div className="logo-triangle"></div>
        </div>
      )}

      {animated && (
        <div className="logo-glow-effects">
          <div className="glow-cyan"></div>
          <div className="glow-magenta"></div>
          <div className="glow-blue"></div>
        </div>
      )}
    </div>
  );
};

export default Son1kVers3Logo;

