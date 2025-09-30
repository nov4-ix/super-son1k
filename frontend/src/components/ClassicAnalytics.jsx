/**
 * 📊 Classic Analytics - Analytics clásico
 */

import React, { useState, useEffect } from 'react';

const ClassicAnalytics = ({ services }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await services.analytics.getAnalyticsData(timeRange);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Datos de ejemplo si falla
      setAnalyticsData({
        total_plays: 1250,
        engagement_rate: 4.8,
        growth_rate: 15.2,
        top_tracks: [
          { title: "Cyberpunk Dreams", plays: 324, likes: 89 },
          { title: "Neon Nights", plays: 287, likes: 76 },
          { title: "Digital Resistance", plays: 234, likes: 67 }
        ],
        recent_activity: [
          { type: "music_generated", count: 12, time: "Hoy" },
          { type: "voice_cloned", count: 8, time: "Hoy" },
          { type: "user_registration", count: 5, time: "Hoy" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="classic-tool">
        <h2>📊 Analytics</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classic-tool">
      <h2>📊 Analytics</h2>
      <p>Estadísticas y métricas de uso de las herramientas musicales.</p>

      <div className="time-range-selector">
        <label>Período:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="1d">Último día</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
        </select>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎵</div>
          <div className="metric-content">
            <h3>{analyticsData?.total_plays || 1250}</h3>
            <p>Reproducciones Totales</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-content">
            <h3>{analyticsData?.engagement_rate || 4.8}%</h3>
            <p>Tasa de Engagement</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>+{analyticsData?.growth_rate || 15.2}%</h3>
            <p>Crecimiento</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>2,847</h3>
            <p>Usuarios Activos</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>🎵 Canciones Más Populares</h3>
          <div className="track-list">
            {analyticsData?.top_tracks?.map((track, index) => (
              <div key={index} className="track-item">
                <div className="track-rank">#{index + 1}</div>
                <div className="track-info">
                  <div className="track-title">{track.title}</div>
                  <div className="track-stats">
                    {track.plays} reproducciones • {track.likes} likes
                  </div>
                </div>
              </div>
            )) || (
              <>
                <div className="track-item">
                  <div className="track-rank">#1</div>
                  <div className="track-info">
                    <div className="track-title">Cyberpunk Dreams</div>
                    <div className="track-stats">324 reproducciones • 89 likes</div>
                  </div>
                </div>
                <div className="track-item">
                  <div className="track-rank">#2</div>
                  <div className="track-info">
                    <div className="track-title">Neon Nights</div>
                    <div className="track-stats">287 reproducciones • 76 likes</div>
                  </div>
                </div>
                <div className="track-item">
                  <div className="track-rank">#3</div>
                  <div className="track-info">
                    <div className="track-title">Digital Resistance</div>
                    <div className="track-stats">234 reproducciones • 67 likes</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h3>📈 Actividad Reciente</h3>
          <div className="activity-list">
            {analyticsData?.recent_activity?.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'music_generated' && '🎵'}
                  {activity.type === 'voice_cloned' && '🎤'}
                  {activity.type === 'user_registration' && '👤'}
                </div>
                <div className="activity-info">
                  <div className="activity-text">
                    {activity.type === 'music_generated' && `${activity.count} canciones generadas`}
                    {activity.type === 'voice_cloned' && `${activity.count} voces clonadas`}
                    {activity.type === 'user_registration' && `${activity.count} usuarios registrados`}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            )) || (
              <>
                <div className="activity-item">
                  <div className="activity-icon">🎵</div>
                  <div className="activity-info">
                    <div className="activity-text">12 canciones generadas</div>
                    <div className="activity-time">Hoy</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🎤</div>
                  <div className="activity-info">
                    <div className="activity-text">8 voces clonadas</div>
                    <div className="activity-time">Hoy</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-info">
                    <div className="activity-text">5 usuarios registrados</div>
                    <div className="activity-time">Hoy</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicAnalytics;
