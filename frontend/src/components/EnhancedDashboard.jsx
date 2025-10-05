import React, { useState, useEffect } from 'react';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalPlays: 0,
    totalLikes: 0,
    totalRevenue: 0,
    growthRate: 0,
    activeUsers: 0
  });

  const [chartData, setChartData] = useState({
    plays: [],
    revenue: [],
    engagement: []
  });

  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simular carga de datos
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = () => {
    // Datos simulados - en producción vendría del backend
    setStats({
      totalTracks: 142,
      totalPlays: 45678,
      totalLikes: 12345,
      totalRevenue: 8942.50,
      growthRate: 23.5,
      activeUsers: 1234
    });

    // Generar datos para gráficas
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const playsData = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 1000) + 500
    }));

    const revenueData = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 500) + 100
    }));

    const engagementData = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      value: Math.floor(Math.random() * 100) + 20
    }));

    setChartData({
      plays: playsData,
      revenue: revenueData,
      engagement: engagementData
    });
  };

  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  const LineChart = ({ data, color, label }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>{label}</h3>
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: color }}></span>
            <span>{label}</span>
          </div>
        </div>
        <svg className="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            className="chart-line"
          />
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#gradient-${color})`}
          />
        </svg>
        <div className="chart-values">
          <span>Min: {Math.min(...data.map(d => d.value))}</span>
          <span>Max: {Math.max(...data.map(d => d.value))}</span>
          <span>Avg: {Math.floor(data.reduce((a, b) => a + b.value, 0) / data.length)}</span>
        </div>
      </div>
    );
  };

  const BarChart = ({ data, color, label }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>{label}</h3>
        </div>
        <div className="bar-chart">
          {data.slice(-10).map((d, i) => (
            <div key={i} className="bar-wrapper">
              <div 
                className="bar"
                style={{
                  height: `${(d.value / maxValue) * 100}%`,
                  background: color
                }}
              >
                <span className="bar-value">{d.value}</span>
              </div>
              <span className="bar-label">D{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ActivityFeed = () => {
    const activities = [
      { type: 'play', text: 'Tu canción "Midnight Dreams" alcanzó 1000 reproducciones', time: '2 min ago', icon: '▶️' },
      { type: 'like', text: 'Usuario @musiclover dio like a tu track', time: '15 min ago', icon: '❤️' },
      { type: 'comment', text: 'Nuevo comentario en "Summer Vibes"', time: '1 hora ago', icon: '💬' },
      { type: 'collab', text: 'Invitación de colaboración de @producer123', time: '2 horas ago', icon: '🤝' },
      { type: 'revenue', text: 'Nuevo pago recibido: $45.00', time: '3 horas ago', icon: '💰' }
    ];

    return (
      <div className="activity-feed">
        <h3>Actividad Reciente</h3>
        <div className="activity-list">
          {activities.map((activity, i) => (
            <div key={i} className={`activity-item activity-${activity.type}`}>
              <span className="activity-icon">{activity.icon}</span>
              <div className="activity-content">
                <p>{activity.text}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TopTracks = () => {
    const tracks = [
      { name: 'Midnight Dreams', plays: 12450, trend: 15 },
      { name: 'Summer Vibes', plays: 9823, trend: -5 },
      { name: 'Electric Soul', plays: 8765, trend: 23 },
      { name: 'Neon Nights', plays: 7654, trend: 8 },
      { name: 'Cosmic Flow', plays: 6543, trend: 12 }
    ];

    return (
      <div className="top-tracks">
        <h3>Top Tracks</h3>
        <div className="tracks-list">
          {tracks.map((track, i) => (
            <div key={i} className="track-item">
              <span className="track-rank">#{i + 1}</span>
              <div className="track-info">
                <div className="track-name">{track.name}</div>
                <div className="track-plays">{track.plays.toLocaleString()} plays</div>
              </div>
              <div className={`track-trend ${track.trend > 0 ? 'positive' : 'negative'}`}>
                {track.trend > 0 ? '↑' : '↓'} {Math.abs(track.trend)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="enhanced-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Dashboard Analítico</h1>
          <p>Monitorea el rendimiento de tu música en tiempo real</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            7 días
          </button>
          <button 
            className={timeRange === '30d' ? 'active' : ''}
            onClick={() => setTimeRange('30d')}
          >
            30 días
          </button>
          <button 
            className={timeRange === '90d' ? 'active' : ''}
            onClick={() => setTimeRange('90d')}
          >
            90 días
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tracks"
          value={stats.totalTracks}
          icon="🎵"
          trend={12}
          color="blue"
        />
        <StatCard
          title="Total Plays"
          value={stats.totalPlays.toLocaleString()}
          icon="▶️"
          trend={stats.growthRate}
          color="purple"
        />
        <StatCard
          title="Total Likes"
          value={stats.totalLikes.toLocaleString()}
          icon="❤️"
          trend={18}
          color="pink"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          trend={15}
          color="green"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon="👥"
          trend={8}
          color="orange"
        />
        <StatCard
          title="Engagement"
          value="94.2%"
          icon="📈"
          trend={5}
          color="cyan"
        />
      </div>

      <div className="charts-section">
        <div className="chart-row">
          <LineChart 
            data={chartData.plays} 
            color="#8b5cf6" 
            label="Reproducciones"
          />
          <LineChart 
            data={chartData.revenue} 
            color="#10b981" 
            label="Ingresos ($)"
          />
        </div>
        <div className="chart-row">
          <BarChart 
            data={chartData.engagement} 
            color="#f59e0b" 
            label="Engagement Rate (%)"
          />
          <div className="side-panel">
            <TopTracks />
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <ActivityFeed />
      </div>
    </div>
  );
};

export default EnhancedDashboard;
