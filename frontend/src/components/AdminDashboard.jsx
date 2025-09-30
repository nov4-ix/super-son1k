import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import ALVAEBadge from './ALVAEBadge';

const AdminDashboard = ({ onClose, isAuthenticated = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    id: '',
    username: '',
    email: '',
    role: 'user',
    tier: 'Free',
    level: 'Silencioso',
    permissions: ['read']
  });

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      // Simular verificación de autenticación
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) {
        onClose();
        return;
      }
    }
    loadDashboardData();
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Cargar estadísticas en paralelo
      const [userStatsRes, revenueStatsRes, systemStatsRes, usersRes, auditLogsRes, securityRes] = await Promise.all([
        fetch('/api/admin/stats/users'),
        fetch('/api/admin/stats/revenue'),
        fetch('/api/admin/stats/system'),
        fetch('/api/admin/users'),
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/security/status')
      ]);

      setUserStats(await userStatsRes.json());
      setRevenueStats(await revenueStatsRes.json());
      setSystemStats(await systemStatsRes.json());
      setUsers(await usersRes.json());
      setAuditLogs(await auditLogsRes.json());
      setSecurityStatus(await securityRes.json());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Datos de ejemplo en caso de error
      setUserStats({
        total_users: 324,
        active_users: 300,
        premium_users: 117,
        free_users: 200,
        banned_users: 3,
        users_by_level: {
          "Silencioso": 150,
          "Susurro": 89,
          "Eco": 45,
          "Resonancia": 23,
          "Armonía": 12,
          "Sinfonía": 5
        },
        users_by_tier: {
          "Free": 200,
          "Premium": 89,
          "Pro": 23,
          "Enterprise": 5
        }
      });
      setRevenueStats({
        total_revenue: 125000.50,
        monthly_revenue: 8500.75,
        daily_revenue: 280.25,
        revenue_by_tier: {
          "Free": 0.0,
          "Premium": 45000.25,
          "Pro": 65000.50,
          "Enterprise": 15000.75
        },
        conversion_rate: 0.23
      });
      setSystemStats({
        total_tracks: 15420,
        total_plays: 1250000,
        total_likes: 89000,
        total_comments: 12500,
        storage_used: 2.5,
        bandwidth_used: 15.8,
        api_calls: 2500000,
        error_rate: 0.02
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        setShowCreateUser(false);
        setNewUser({
          id: '',
          username: '',
          email: '',
          role: 'user',
          tier: 'Free',
          level: 'Silencioso',
          permissions: ['read']
        });
        loadDashboardData();
      } else {
        alert('Error creando usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creando usuario');
    }
  };

  const handleBanUser = async (userId, reason) => {
    if (!reason) {
      reason = prompt('Razón del baneo:');
      if (!reason) return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        alert('Usuario baneado exitosamente');
        loadDashboardData();
      } else {
        alert('Error baneando usuario');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Error baneando usuario');
    }
  };

  const runSecurityScan = async () => {
    try {
      const response = await fetch('/api/admin/security/scan', {
        method: 'POST'
      });
      const results = await response.json();
      alert(`Escaneo completado. Vulnerabilidades: ${results.vulnerabilities_found}`);
    } catch (error) {
      console.error('Error running security scan:', error);
      alert('Error ejecutando escaneo de seguridad');
    }
  };

  // Renderizar vista general
  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Usuarios Totales</h3>
            <div className="stat-number">{userStats?.total_users || 0}</div>
            <div className="stat-subtitle">
              Activos: {userStats?.active_users || 0} | Baneados: {userStats?.banned_users || 0}
            </div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Ingresos Totales</h3>
            <div className="stat-number">${revenueStats?.total_revenue?.toLocaleString() || 0}</div>
            <div className="stat-subtitle">
              Mensual: ${revenueStats?.monthly_revenue?.toLocaleString() || 0} | Diario: ${revenueStats?.daily_revenue?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="stat-card tracks">
          <div className="stat-icon">🎵</div>
          <div className="stat-content">
            <h3>Tracks Generados</h3>
            <div className="stat-number">{systemStats?.total_tracks?.toLocaleString() || 0}</div>
            <div className="stat-subtitle">
              Reproducciones: {systemStats?.total_plays?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="stat-card security">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <h3>Estado de Seguridad</h3>
            <div className="stat-number">{securityStatus?.threats_detected || 0}</div>
            <div className="stat-subtitle">
              Amenazas detectadas | Encriptación: {securityStatus?.encryption_status || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Usuarios por Nivel ALVAE</h3>
          <div className="level-chart">
            {userStats?.users_by_level && Object.entries(userStats.users_by_level).map(([level, count]) => (
              <div key={level} className="level-bar">
                <div className="level-label">{level}</div>
                <div className="level-progress">
                  <div 
                    className="level-fill" 
                    style={{ width: `${(count / Math.max(...Object.values(userStats.users_by_level))) * 100}%` }}
                  ></div>
                </div>
                <div className="level-count">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Ingresos por Tier</h3>
          <div className="revenue-chart">
            {revenueStats?.revenue_by_tier && Object.entries(revenueStats.revenue_by_tier).map(([tier, revenue]) => (
              <div key={tier} className="revenue-item">
                <div className="revenue-tier">{tier}</div>
                <div className="revenue-amount">${revenue.toLocaleString()}</div>
                <div className="revenue-bar">
                  <div 
                    className="revenue-fill" 
                    style={{ width: `${(revenue / Math.max(...Object.values(revenueStats.revenue_by_tier))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar gestión de usuarios
  const renderUserManagement = () => (
    <div className="user-management-section">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <button 
          className="create-user-btn"
          onClick={() => setShowCreateUser(true)}
        >
          Crear Usuario
        </button>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="table-cell">ID</div>
          <div className="table-cell">Usuario</div>
          <div className="table-cell">Email</div>
          <div className="table-cell">Tier</div>
          <div className="table-cell">Nivel ALVAE</div>
          <div className="table-cell">Estado</div>
          <div className="table-cell">Acciones</div>
        </div>

        {users.map(user => (
          <div key={user.id} className="table-row">
            <div className="table-cell">{user.id}</div>
            <div className="table-cell">{user.username}</div>
            <div className="table-cell">{user.email}</div>
            <div className="table-cell">
              <span className={`tier-badge ${user.tier?.toLowerCase() || 'free'}`}>
                {user.tier || 'Free'}
              </span>
            </div>
            <div className="table-cell">
              <ALVAEBadge 
                level={user.level === 'Silencioso' ? 10 : 
                       user.level === 'Susurro' ? 25 :
                       user.level === 'Eco' ? 50 :
                       user.level === 'Resonancia' ? 75 :
                       user.level === 'Armonía' ? 90 : 100}
                size="small"
                showLevel={false}
                showName={false}
              />
              <span className="level-name">{user.level || 'Silencioso'}</span>
            </div>
            <div className="table-cell">
              <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="table-cell">
              <button 
                className="action-btn edit"
                onClick={() => setSelectedUser(user)}
              >
                Editar
              </button>
              <button 
                className="action-btn ban"
                onClick={() => handleBanUser(user.id)}
              >
                Banear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar logs de auditoría
  const renderAuditLogs = () => (
    <div className="audit-logs-section">
      <div className="section-header">
        <h2>Logs de Auditoría</h2>
        <div className="log-filters">
          <select className="filter-select">
            <option value="all">Todas las acciones</option>
            <option value="user_created">Creación de usuarios</option>
            <option value="user_updated">Actualización de usuarios</option>
            <option value="user_deleted">Eliminación de usuarios</option>
            <option value="user_banned">Baneo de usuarios</option>
          </select>
        </div>
      </div>

      <div className="logs-list">
        {auditLogs.map(log => (
          <div key={log.id} className="log-item">
            <div className="log-header">
              <span className="log-action">{log.action}</span>
              <span className="log-timestamp">{new Date(log.created_at).toLocaleString()}</span>
            </div>
            <div className="log-details">
              <div className="log-user">Usuario: {log.user_id}</div>
              <div className="log-admin">Admin: {log.admin_id}</div>
              <div className="log-ip">IP: {log.ip_address}</div>
            </div>
            <div className="log-content">
              <pre>{JSON.stringify(log.details, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizar seguridad
  const renderSecurity = () => (
    <div className="security-section">
      <div className="section-header">
        <h2>Seguridad del Sistema</h2>
        <button 
          className="security-scan-btn"
          onClick={runSecurityScan}
        >
          Ejecutar Escaneo
        </button>
      </div>

      <div className="security-status">
        <div className="security-item">
          <span className="security-label">Estado de Encriptación:</span>
          <span className={`security-value ${securityStatus?.encryption_status === 'active' ? 'secure' : 'warning'}`}>
            {securityStatus?.encryption_status || 'Desconocido'}
          </span>
        </div>
        <div className="security-item">
          <span className="security-label">Amenazas Detectadas:</span>
          <span className="security-value">{securityStatus?.threats_detected || 0}</span>
        </div>
        <div className="security-item">
          <span className="security-label">Intentos de Login Fallidos:</span>
          <span className="security-value">{securityStatus?.failed_login_attempts || 0}</span>
        </div>
        <div className="security-item">
          <span className="security-label">Actividades Sospechosas:</span>
          <span className="security-value">{securityStatus?.suspicious_activities || 0}</span>
        </div>
      </div>

      <div className="security-recommendations">
        <h3>Recomendaciones de Seguridad</h3>
        <ul>
          {securityStatus?.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-dashboard-overlay">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Cargando dashboard de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-overlay">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>🛡️ Dashboard de Administración</h1>
            <p>Control total del sistema Son1kVers3</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Resumen
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Usuarios
          </button>
          <button 
            className={`nav-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            📋 Auditoría
          </button>
          <button 
            className={`nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Seguridad
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'audit' && renderAuditLogs()}
          {activeTab === 'security' && renderSecurity()}
        </div>

        {/* Modal de crear usuario */}
        {showCreateUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Crear Nuevo Usuario</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowCreateUser(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateUser} className="create-user-form">
                <div className="form-group">
                  <label>ID de Usuario:</label>
                  <input
                    type="text"
                    value={newUser.id}
                    onChange={(e) => setNewUser(prev => ({ ...prev, id: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Nombre de Usuario:</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Tier:</label>
                  <select
                    value={newUser.tier}
                    onChange={(e) => setNewUser(prev => ({ ...prev, tier: e.target.value }))}
                  >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Nivel ALVAE:</label>
                  <select
                    value={newUser.level}
                    onChange={(e) => setNewUser(prev => ({ ...prev, level: e.target.value }))}
                  >
                    <option value="Silencioso">Silencioso</option>
                    <option value="Susurro">Susurro</option>
                    <option value="Eco">Eco</option>
                    <option value="Resonancia">Resonancia</option>
                    <option value="Armonía">Armonía</option>
                    <option value="Sinfonía">Sinfonía</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowCreateUser(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-btn">
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

