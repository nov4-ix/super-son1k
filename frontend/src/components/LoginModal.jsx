import React, { useState } from 'react';
import './LoginModal.css';
import ALVAEBadge from './ALVAEBadge';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    tier: 'Free',
    level: 'Silencioso'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const result = await response.json();

        if (result.success) {
          // Guardar token y datos del usuario
          localStorage.setItem('auth_token', result.token);
          localStorage.setItem('user_data', JSON.stringify(result.user));
          
          onLoginSuccess(result.user);
          onClose();
        } else {
          setError(result.message || 'Error en el login');
        }
      } else {
        // Registro
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            tier: formData.tier,
            level: formData.level
          })
        });

        const result = await response.json();

        if (result.success) {
          // Guardar token y datos del usuario
          localStorage.setItem('auth_token', result.token);
          localStorage.setItem('user_data', JSON.stringify(result.user));
          
          onLoginSuccess(result.user);
          onClose();
        } else {
          setError(result.message || 'Error en el registro');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Login de demostración con cuenta de administrador
    const demoUser = {
      user_id: 'admin_nov4ix',
      username: 'Nov4-ix',
      email: 'nov4-ix@son1kvers3.com',
      role: 'admin',
      tier: 'Enterprise',
      level: 'Sinfonía',
      alvae_symbol: 'ALVAE',
      permissions: ['read', 'write', 'delete', 'admin', 'moderate']
    };

    localStorage.setItem('auth_token', 'demo_token');
    localStorage.setItem('user_data', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>🔐 Acceso a Son1kVers3</h2>
            <p>Inicia sesión o regístrate para acceder al universo sónico</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Nombre de Usuario:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Elige tu nombre en el universo sónico"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Confirmar Contraseña:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label>Tier de Cuenta:</label>
                <select
                  name="tier"
                  value={formData.tier}
                  onChange={handleInputChange}
                >
                  <option value="Free">Free - Explorador</option>
                  <option value="Premium">Premium - Creador</option>
                  <option value="Pro">Pro - Artista</option>
                  <option value="Enterprise">Enterprise - Maestro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nivel ALVAE:</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                >
                  <option value="Silencioso">Silencioso - Iniciación</option>
                  <option value="Susurro">Susurro - Desarrollo</option>
                  <option value="Eco">Eco - Resonancia</option>
                  <option value="Resonancia">Resonancia - Armonía</option>
                  <option value="Armonía">Armonía - Maestría</option>
                  <option value="Sinfonía">Sinfonía - Perfección</option>
                </select>
              </div>
            </>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Procesando...' : (isLogin ? '🚀 Iniciar Sesión' : '✨ Crear Cuenta')}
            </button>
          </div>

          <div className="demo-section">
            <div className="divider">
              <span>o</span>
            </div>
            <button 
              type="button"
              className="demo-btn"
              onClick={handleDemoLogin}
            >
              🎭 Acceso Demo (Nov4-ix)
            </button>
          </div>
        </form>

        <div className="modal-footer">
          <div className="alvae-info">
            <ALVAEBadge level={100} size="small" showLevel={false} showName={false} />
            <span>Todos los usuarios reciben el símbolo ALVAE</span>
          </div>
          <p className="terms">
            Al registrarte, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
