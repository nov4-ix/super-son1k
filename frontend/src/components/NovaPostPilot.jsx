/**
 * 🚀 Nova Post Pilot - Marketing de Contenido con IA
 * Herramienta avanzada conectada a Qwen para análisis de redes sociales
 * Análisis de mercado, ganchos virales, horarios óptimos y publicación automatizada
 */

import React, { useState, useEffect } from 'react';
import './NovaPostPilot.css';

const NovaPostPilot = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('profile'); // profile, analysis, hooks, schedule, publish
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentProfile, setContentProfile] = useState({
    contentType: '',
    niche: '',
    targetAudience: '',
    tone: '',
    goals: []
  });
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [viralHooks, setViralHooks] = useState([]);
  const [optimalTimes, setOptimalTimes] = useState({});
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // Algoritmos de redes sociales (simulados)
  const socialAlgorithms = {
    instagram: {
      name: 'Instagram',
      icon: '📸',
      peakHours: ['19:00-21:00', '12:00-13:00'],
      contentTypes: ['visual', 'stories', 'reels', 'carousel'],
      engagement: 'visual-first',
      hashtagLimit: 30,
      algorithm: 'engagement-based'
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      peakHours: ['18:00-20:00', '21:00-23:00'],
      contentTypes: ['video', 'trending', 'music'],
      engagement: 'completion-rate',
      hashtagLimit: 5,
      algorithm: 'for-you-page'
    },
    twitter: {
      name: 'Twitter/X',
      icon: '🐦',
      peakHours: ['09:00-10:00', '19:00-20:00'],
      contentTypes: ['text', 'threads', 'news'],
      engagement: 'real-time',
      hashtagLimit: 3,
      algorithm: 'chronological-engagement'
    },
    youtube: {
      name: 'YouTube',
      icon: '📺',
      peakHours: ['20:00-22:00', '14:00-16:00'],
      contentTypes: ['long-form', 'shorts', 'tutorials'],
      engagement: 'watch-time',
      hashtagLimit: 15,
      algorithm: 'watch-time-based'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      peakHours: ['08:00-09:00', '17:00-18:00'],
      contentTypes: ['professional', 'articles', 'insights'],
      engagement: 'professional-value',
      hashtagLimit: 5,
      algorithm: 'professional-relevance'
    }
  };

  // Tipos de contenido musical
  const contentTypes = [
    { id: 'original-music', label: 'Música Original', description: 'Canciones y composiciones propias' },
    { id: 'covers', label: 'Covers', description: 'Versiones de canciones existentes' },
    { id: 'beats-instrumentals', label: 'Beats/Instrumentales', description: 'Pistas instrumentales y beats' },
    { id: 'tutorials', label: 'Tutoriales', description: 'Enseñanza musical y producción' },
    { id: 'behind-scenes', label: 'Behind the Scenes', description: 'Proceso creativo y estudio' },
    { id: 'live-sessions', label: 'Sesiones en Vivo', description: 'Performances y jam sessions' }
  ];

  // Nichos musicales
  const musicalNiches = [
    'Electronic/EDM', 'Hip-Hop/Rap', 'Pop', 'Rock', 'Indie', 'Jazz', 'Classical',
    'Reggaeton', 'Trap', 'House', 'Techno', 'Ambient', 'Lo-Fi', 'Synthwave',
    'Folk', 'Country', 'R&B/Soul', 'Funk', 'Metal', 'Punk'
  ];

  // Análisis de mercado con IA Qwen (simulado)
  const analyzeMarket = async () => {
    setIsAnalyzing(true);
    
    // Simular llamada a Qwen AI
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const analysis = {
      marketSize: Math.floor(Math.random() * 1000000) + 500000,
      competition: ['Bajo', 'Medio', 'Alto'][Math.floor(Math.random() * 3)],
      trendingTopics: [
        'AI Music Production',
        'Bedroom Pop Revival',
        'Vintage Synthesizers',
        'Collaborative Remixes'
      ],
      audienceInsights: {
        ageRange: '18-34',
        primaryPlatform: 'Instagram',
        engagementTime: '19:00-21:00',
        interests: ['Music Production', 'Indie Artists', 'New Releases']
      },
      opportunities: [
        'Colaboraciones con artistas emergentes',
        'Contenido educativo sobre producción',
        'Participación en challenges virales',
        'Lanzamientos en horarios óptimos'
      ]
    };
    
    setMarketAnalysis(analysis);
    generateViralHooks(analysis);
    calculateOptimalTimes();
    setIsAnalyzing(false);
  };

  // Generar ganchos virales especializados
  const generateViralHooks = (analysis) => {
    const hooks = [
      {
        platform: 'instagram',
        type: 'Question Hook',
        text: '¿Qué pasaría si combinaras ' + contentProfile.niche + ' con IA? 🤖🎵',
        engagement: 'high',
        reason: 'Las preguntas generan comentarios y engagement'
      },
      {
        platform: 'tiktok',
        type: 'Trend Hook',
        text: 'POV: Cuando descubres que la IA puede hacer ' + contentProfile.niche + ' mejor que tú 😱',
        engagement: 'viral',
        reason: 'POV y emociones fuertes funcionan en TikTok'
      },
      {
        platform: 'twitter',
        type: 'Controversy Hook',
        text: 'Unpopular opinion: La IA nunca reemplazará la creatividad humana en ' + contentProfile.niche,
        engagement: 'medium',
        reason: 'Las opiniones controvertidas generan debate'
      },
      {
        platform: 'youtube',
        type: 'Tutorial Hook',
        text: 'Cómo crear ' + contentProfile.niche + ' profesional en 10 minutos (sin experiencia)',
        engagement: 'high',
        reason: 'Tutoriales rápidos tienen alta retención'
      },
      {
        platform: 'linkedin',
        type: 'Professional Hook',
        text: 'La revolución de la IA en ' + contentProfile.niche + ': 3 lecciones para creadores',
        engagement: 'medium',
        reason: 'Contenido educativo profesional funciona en LinkedIn'
      }
    ];
    
    setViralHooks(hooks);
  };

  // Calcular horarios óptimos por plataforma
  const calculateOptimalTimes = () => {
    const times = {};
    Object.keys(socialAlgorithms).forEach(platform => {
      times[platform] = {
        peak: socialAlgorithms[platform].peakHours,
        timezone: 'UTC-5', // Ajustable según ubicación del usuario
        engagement: Math.floor(Math.random() * 30) + 70 // 70-100%
      };
    });
    setOptimalTimes(times);
  };

  // Programar publicación
  const schedulePost = (platform, content, datetime) => {
    const newPost = {
      id: Date.now(),
      platform,
      content,
      datetime,
      status: 'scheduled',
      engagement: 'pending'
    };
    
    setScheduledPosts(prev => [...prev, newPost]);
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'profile':
        return renderProfileStep();
      case 'analysis':
        return renderAnalysisStep();
      case 'hooks':
        return renderHooksStep();
      case 'schedule':
        return renderScheduleStep();
      case 'publish':
        return renderPublishStep();
      default:
        return renderProfileStep();
    }
  };

  // Paso 1: Perfil de contenido
  const renderProfileStep = () => (
    <div className="step-content">
      <h2>🎯 Perfil de Contenido</h2>
      <p>Describe tu contenido para que Nova Post Pilot pueda analizarlo con IA</p>
      
      <div className="form-group">
        <label>Tipo de Contenido</label>
        <div className="content-types-grid">
          {contentTypes.map(type => (
            <div
              key={type.id}
              className={`content-type-card ${contentProfile.contentType === type.id ? 'selected' : ''}`}
              onClick={() => setContentProfile(prev => ({ ...prev, contentType: type.id }))}
            >
              <h4>{type.label}</h4>
              <p>{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Nicho Musical</label>
        <select
          value={contentProfile.niche}
          onChange={(e) => setContentProfile(prev => ({ ...prev, niche: e.target.value }))}
        >
          <option value="">Selecciona tu nicho</option>
          {musicalNiches.map(niche => (
            <option key={niche} value={niche}>{niche}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Audiencia Objetivo</label>
        <textarea
          placeholder="Describe tu audiencia ideal: edad, intereses, ubicación..."
          value={contentProfile.targetAudience}
          onChange={(e) => setContentProfile(prev => ({ ...prev, targetAudience: e.target.value }))}
        />
      </div>

      <div className="form-group">
        <label>Tono de Comunicación</label>
        <div className="tone-options">
          {['Casual', 'Profesional', 'Divertido', 'Inspiracional', 'Educativo'].map(tone => (
            <button
              key={tone}
              className={`tone-btn ${contentProfile.tone === tone ? 'selected' : ''}`}
              onClick={() => setContentProfile(prev => ({ ...prev, tone }))}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <button
        className="next-btn"
        onClick={() => setCurrentStep('analysis')}
        disabled={!contentProfile.contentType || !contentProfile.niche}
      >
        Analizar con IA Qwen 🧠
      </button>
    </div>
  );

  // Paso 2: Análisis de mercado
  const renderAnalysisStep = () => (
    <div className="step-content">
      <h2>📊 Análisis de Mercado IA</h2>
      
      {isAnalyzing ? (
        <div className="analyzing-container">
          <div className="ai-brain">🧠</div>
          <h3>Qwen AI analizando tu mercado...</h3>
          <div className="analysis-steps">
            <div className="step">✓ Estudiando algoritmos de redes sociales</div>
            <div className="step">✓ Analizando competencia en {contentProfile.niche}</div>
            <div className="step">⏳ Identificando oportunidades virales</div>
            <div className="step">⏳ Calculando horarios óptimos</div>
          </div>
        </div>
      ) : marketAnalysis ? (
        <div className="analysis-results">
          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>📈 Tamaño de Mercado</h3>
              <p className="big-number">{marketAnalysis.marketSize.toLocaleString()}</p>
              <p>usuarios potenciales</p>
            </div>
            
            <div className="analysis-card">
              <h3>⚔️ Competencia</h3>
              <p className="big-number">{marketAnalysis.competition}</p>
              <p>nivel de saturación</p>
            </div>
            
            <div className="analysis-card">
              <h3>🎯 Audiencia Principal</h3>
              <p className="big-number">{marketAnalysis.audienceInsights.ageRange}</p>
              <p>años, activos en {marketAnalysis.audienceInsights.engagementTime}</p>
            </div>
          </div>

          <div className="trending-topics">
            <h3>🔥 Temas Trending</h3>
            <div className="topics-list">
              {marketAnalysis.trendingTopics.map((topic, index) => (
                <span key={index} className="topic-tag">{topic}</span>
              ))}
            </div>
          </div>

          <div className="opportunities">
            <h3>💡 Oportunidades Identificadas</h3>
            <ul>
              {marketAnalysis.opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>

          <button className="next-btn" onClick={() => setCurrentStep('hooks')}>
            Ver Ganchos Virales 🎣
          </button>
        </div>
      ) : (
        <button className="analyze-btn" onClick={analyzeMarket}>
          Iniciar Análisis con Qwen AI
        </button>
      )}
    </div>
  );

  // Paso 3: Ganchos virales
  const renderHooksStep = () => (
    <div className="step-content">
      <h2>🎣 Ganchos Virales Especializados</h2>
      <p>Ganchos optimizados para cada plataforma según tu nicho</p>
      
      <div className="hooks-container">
        {viralHooks.map((hook, index) => (
          <div key={index} className="hook-card">
            <div className="hook-header">
              <span className="platform-icon">{socialAlgorithms[hook.platform].icon}</span>
              <h3>{socialAlgorithms[hook.platform].name}</h3>
              <span className={`engagement-badge ${hook.engagement}`}>
                {hook.engagement}
              </span>
            </div>
            
            <div className="hook-content">
              <p className="hook-text">"{hook.text}"</p>
              <p className="hook-type">{hook.type}</p>
              <p className="hook-reason">{hook.reason}</p>
            </div>
            
            <button className="use-hook-btn">
              Usar este gancho
            </button>
          </div>
        ))}
      </div>

      <button className="next-btn" onClick={() => setCurrentStep('schedule')}>
        Programar Publicaciones ⏰
      </button>
    </div>
  );

  // Paso 4: Programación
  const renderScheduleStep = () => (
    <div className="step-content">
      <h2>⏰ Horarios Óptimos por Plataforma</h2>
      
      <div className="optimal-times-grid">
        {Object.entries(optimalTimes).map(([platform, data]) => (
          <div key={platform} className="time-card">
            <div className="platform-header">
              <span className="platform-icon">{socialAlgorithms[platform].icon}</span>
              <h3>{socialAlgorithms[platform].name}</h3>
            </div>
            
            <div className="peak-times">
              <h4>Horarios Pico</h4>
              {data.peak.map((time, index) => (
                <span key={index} className="time-slot">{time}</span>
              ))}
            </div>
            
            <div className="engagement-rate">
              <span>Engagement esperado: {data.engagement}%</span>
            </div>
            
            <button className="schedule-btn">
              Programar para {socialAlgorithms[platform].name}
            </button>
          </div>
        ))}
      </div>

      <button className="next-btn" onClick={() => setCurrentStep('publish')}>
        Ver Calendario 📅
      </button>
    </div>
  );

  // Paso 5: Publicación
  const renderPublishStep = () => (
    <div className="step-content">
      <h2>📅 Calendario de Publicaciones</h2>
      
      <div className="calendar-view">
        <div className="calendar-header">
          <h3>Próximas Publicaciones</h3>
          <button className="add-post-btn">+ Nueva Publicación</button>
        </div>
        
        {scheduledPosts.length > 0 ? (
          <div className="scheduled-posts">
            {scheduledPosts.map(post => (
              <div key={post.id} className="scheduled-post">
                <span className="platform-icon">{socialAlgorithms[post.platform].icon}</span>
                <div className="post-content">
                  <p>{post.content}</p>
                  <span className="post-time">{post.datetime}</span>
                </div>
                <span className={`post-status ${post.status}`}>{post.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-calendar">
            <p>No hay publicaciones programadas</p>
            <button className="schedule-first-btn">
              Programar Primera Publicación
            </button>
          </div>
        )}
      </div>

      <div className="auto-publish-section">
        <h3>🤖 Publicación Automática</h3>
        <p>Nova Post Pilot puede publicar automáticamente tu contenido</p>
        <div className="auto-publish-toggle">
          <label>
            <input type="checkbox" />
            Activar publicación automática
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nova-post-pilot">
      <div className="pilot-header">
        <div className="pilot-title">
          <h1>🚀 Nova Post Pilot</h1>
          <p>Marketing de Contenido con IA Qwen</p>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Progress indicator */}
      <div className="progress-bar">
        {['profile', 'analysis', 'hooks', 'schedule', 'publish'].map((step, index) => (
          <div
            key={step}
            className={`progress-step ${currentStep === step ? 'active' : ''} ${
              ['profile', 'analysis', 'hooks', 'schedule', 'publish'].indexOf(currentStep) > index ? 'completed' : ''
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="pilot-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default NovaPostPilot;
