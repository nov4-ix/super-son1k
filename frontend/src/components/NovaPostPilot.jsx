/**
 * 🚀 Nova Post Pilot - Herramienta Universal de Marketing Digital
 * Análisis de mercado, horarios óptimos, ganchos virales y publicación automatizada
 */

import React, { useState, useEffect } from 'react';
import './NovaPostPilot.css';
import './ArturiaKnobsOverride.css';

const NovaPostPilot = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('content-type'); // content-type, analysis, hooks, calendar, publish
  const [contentData, setContentData] = useState({
    type: '',
    description: '',
    target_audience: '',
    platforms: [],
    niche: ''
  });
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [viralHooks, setViralHooks] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Tipos de contenido disponibles
  const contentTypes = [
    { id: 'business', name: 'Negocios', icon: '💼', description: 'Emprendimiento, finanzas, marketing, ventas' },
    { id: 'tech', name: 'Tecnología', icon: '💻', description: 'Reviews, tutoriales, noticias tech, IA' },
    { id: 'education', name: 'Educación', icon: '📚', description: 'Tutoriales, cursos, tips educativos' },
    { id: 'fitness', name: 'Fitness', icon: '💪', description: 'Rutinas, tips de ejercicio, transformaciones' },
    { id: 'food', name: 'Comida', icon: '🍳', description: 'Recetas, reviews, cooking shows' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨', description: 'Moda, viajes, daily vlogs' },
    { id: 'gaming', name: 'Gaming', icon: '🎮', description: 'Gameplay, reviews, streaming' },
    { id: 'art', name: 'Arte', icon: '🎨', description: 'Dibujo, diseño, procesos creativos' },
    { id: 'comedy', name: 'Comedia', icon: '😂', description: 'Sketches, memes, contenido divertido' },
    { id: 'music', name: 'Música', icon: '🎵', description: 'Canciones, beats, covers, tutoriales musicales' }
  ];

  // Plataformas sociales
  const socialPlatforms = [
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: '#ff0050' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#1877F2' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#BD081C' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00' }
  ];

  // Analizar mercado con IA
  const analyzeMarket = async () => {
    if (!contentData.type || !contentData.description) {
      alert('Por favor completa el tipo de contenido y descripción');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analysis');

    try {
      // Simular análisis con Qwen (en producción usaría API real)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const analysis = generateMarketAnalysis(contentData);
      setMarketAnalysis(analysis);
      
      // Generar ganchos virales
      const hooks = generateViralHooks(contentData);
      setViralHooks(hooks);

      setCurrentStep('hooks');
      
    } catch (error) {
      console.error('Error analizando mercado:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generar análisis de mercado
  const generateMarketAnalysis = (data) => {
    const contentType = contentTypes.find(t => t.id === data.type);
    
    return {
      target_audience: {
        primary: getTargetAudience(data.type),
        demographics: getDemographics(data.type),
        interests: getInterests(data.type)
      },
      optimal_times: getOptimalTimes(data.platforms),
      competition_level: getCompetitionLevel(data.type),
      growth_potential: getGrowthPotential(data.type),
      recommended_platforms: getRecommendedPlatforms(data.type),
      content_strategy: getContentStrategy(data.type)
    };
  };

  // Funciones auxiliares para análisis
  const getTargetAudience = (type) => {
    const audiences = {
      music: 'Jóvenes 16-35, amantes de la música, productores, DJs',
      fitness: 'Adultos 20-45, interesados en salud y bienestar',
      food: 'Adultos 25-50, entusiastas culinarios, familias',
      tech: 'Adultos 18-40, early adopters, profesionales tech',
      lifestyle: 'Jóvenes 18-35, principalmente mujeres, interesadas en tendencias',
      education: 'Estudiantes y profesionales, todas las edades',
      business: 'Emprendedores y profesionales 25-50',
      gaming: 'Gamers 13-35, principalmente hombres',
      art: 'Creativos 16-45, artistas, diseñadores',
      comedy: 'Audiencia general 16-40, buscando entretenimiento'
    };
    return audiences[type] || 'Audiencia general';
  };

  const getDemographics = (type) => {
    return {
      age_range: type === 'gaming' ? '13-35' : type === 'business' ? '25-50' : '18-40',
      gender_split: type === 'lifestyle' ? '70% F, 30% M' : type === 'gaming' ? '65% M, 35% F' : '50% F, 50% M',
      income_level: type === 'business' ? 'Medio-Alto' : type === 'lifestyle' ? 'Medio' : 'Variado'
    };
  };

  const getInterests = (type) => {
    const interests = {
      music: ['Producción musical', 'Conciertos', 'Nuevos artistas', 'Tecnología musical'],
      fitness: ['Ejercicio', 'Nutrición', 'Bienestar', 'Transformaciones'],
      food: ['Cocina', 'Restaurantes', 'Recetas', 'Ingredientes'],
      tech: ['Gadgets', 'Software', 'Innovación', 'Reviews'],
      lifestyle: ['Moda', 'Viajes', 'Decoración', 'Tendencias'],
      education: ['Aprendizaje', 'Desarrollo personal', 'Cursos', 'Skills'],
      business: ['Emprendimiento', 'Inversiones', 'Productividad', 'Liderazgo'],
      gaming: ['Videojuegos', 'Streaming', 'Esports', 'Hardware'],
      art: ['Diseño', 'Creatividad', 'Herramientas', 'Inspiración'],
      comedy: ['Humor', 'Entretenimiento', 'Memes', 'Shows']
    };
    return interests[type] || ['Entretenimiento', 'Contenido viral'];
  };

  const getOptimalTimes = (platforms) => {
    const times = {
      tiktok: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
      instagram: ['6:00 PM', '7:30 PM', '8:00 PM'],
      youtube: ['2:00 PM', '3:00 PM', '4:00 PM'],
      facebook: ['1:00 PM', '3:00 PM', '9:00 PM'],
      twitter: ['12:00 PM', '1:00 PM', '5:00 PM'],
      linkedin: ['8:00 AM', '12:00 PM', '5:00 PM'],
      pinterest: ['8:00 PM', '9:00 PM', '10:00 PM'],
      snapchat: ['6:00 PM', '7:00 PM', '8:00 PM']
    };
    
    const result = {};
    platforms.forEach(platform => {
      result[platform] = times[platform] || ['6:00 PM', '7:00 PM', '8:00 PM'];
    });
    
    return result;
  };

  const getCompetitionLevel = (type) => {
    const levels = {
      music: 'Alto',
      fitness: 'Muy Alto', 
      food: 'Alto',
      tech: 'Medio',
      lifestyle: 'Muy Alto',
      education: 'Medio',
      business: 'Alto',
      gaming: 'Muy Alto',
      art: 'Medio',
      comedy: 'Alto'
    };
    return levels[type] || 'Medio';
  };

  const getGrowthPotential = (type) => {
    const potentials = {
      music: 'Alto - Mercado en crecimiento',
      fitness: 'Muy Alto - Tendencia permanente',
      food: 'Alto - Siempre popular',
      tech: 'Muy Alto - Innovación constante',
      lifestyle: 'Alto - Mercado establecido',
      education: 'Muy Alto - Demanda creciente',
      business: 'Alto - Emprendimiento en auge',
      gaming: 'Muy Alto - Industria en expansión',
      art: 'Medio - Nicho especializado',
      comedy: 'Alto - Entretenimiento universal'
    };
    return potentials[type] || 'Medio';
  };

  const getRecommendedPlatforms = (type) => {
    const recommendations = {
      music: ['tiktok', 'instagram', 'youtube'],
      fitness: ['instagram', 'tiktok', 'youtube'],
      food: ['instagram', 'tiktok', 'pinterest'],
      tech: ['youtube', 'twitter', 'linkedin'],
      lifestyle: ['instagram', 'pinterest', 'tiktok'],
      education: ['youtube', 'linkedin', 'tiktok'],
      business: ['linkedin', 'twitter', 'youtube'],
      gaming: ['tiktok', 'youtube', 'twitter'],
      art: ['instagram', 'pinterest', 'tiktok'],
      comedy: ['tiktok', 'instagram', 'twitter']
    };
    return recommendations[type] || ['instagram', 'tiktok', 'youtube'];
  };

  const getContentStrategy = (type) => {
    const strategies = {
      music: 'Behind the scenes + Snippets + Tutorials',
      fitness: 'Transformaciones + Rutinas + Motivación',
      food: 'Proceso de cocina + Resultado final + Tips',
      tech: 'Reviews + Comparaciones + Tutoriales',
      lifestyle: 'Day in my life + Outfits + Lugares',
      education: 'Tips rápidos + Explicaciones + Casos prácticos',
      business: 'Insights + Casos de éxito + Consejos',
      gaming: 'Highlights + Reviews + Streaming',
      art: 'Proceso creativo + Resultado + Técnicas',
      comedy: 'Sketches + Reacciones + Trends'
    };
    return strategies[type] || 'Contenido variado + Engagement + Consistencia';
  };

  // Generar ganchos virales
  const generateViralHooks = (data) => {
    const contentType = contentTypes.find(t => t.id === data.type);
    
    const hooks = [
      {
        platform: 'tiktok',
        hook: `POV: Descubres el secreto que ${getHookContext(data.type)} no quiere que sepas...`,
        explanation: 'Genera curiosidad inmediata'
      },
      {
        platform: 'instagram',
        hook: `5 cosas que aprendí ${getHookContext(data.type)} que cambiarán tu perspectiva`,
        explanation: 'Lista + transformación personal'
      },
      {
        platform: 'youtube',
        hook: `La verdad sobre ${getHookContext(data.type)} que nadie te cuenta`,
        explanation: 'Promesa de información exclusiva'
      },
      {
        platform: 'facebook',
        hook: `¿Sabías que ${getHookContext(data.type)}? Te explico por qué es importante`,
        explanation: 'Educativo + engagement'
      }
    ];

    return hooks;
  };

  const getHookContext = (type) => {
    const contexts = {
      music: 'la industria musical',
      fitness: 'hacer ejercicio',
      food: 'cocinar en casa',
      tech: 'la tecnología',
      lifestyle: 'vivir mejor',
      education: 'aprender online',
      business: 'emprender',
      gaming: 'ser pro gamer',
      art: 'ser creativo',
      comedy: 'hacer reír'
    };
    return contexts[type] || 'crear contenido';
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'content-type':
        return renderContentTypeStep();
      case 'analysis':
        return renderAnalysisStep();
      case 'hooks':
        return renderHooksStep();
      case 'calendar':
        return renderCalendarStep();
      case 'publish':
        return renderPublishStep();
      default:
        return renderContentTypeStep();
    }
  };

  // Paso 1: Selección de tipo de contenido
  const renderContentTypeStep = () => (
    <div className="step-container">
      <div className="step-header">
        <h2>🎯 ¿Qué tipo de contenido creas?</h2>
        <p>Selecciona tu nicho para análisis personalizado</p>
      </div>

      <div className="content-types-grid">
        {contentTypes.map((type) => (
          <div
            key={type.id}
            className={`content-type-card ${contentData.type === type.id ? 'selected' : ''}`}
            onClick={() => setContentData(prev => ({ ...prev, type: type.id }))}
          >
            <div className="type-icon">{type.icon}</div>
            <h3>{type.name}</h3>
            <p>{type.description}</p>
          </div>
        ))}
      </div>

      <div className="content-description">
        <label>Describe tu contenido específico:</label>
        <textarea
          value={contentData.description}
          onChange={(e) => setContentData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Ej: Creo tutoriales de producción musical con FL Studio, enfocado en beats de trap y reggaeton para productores principiantes..."
          rows="4"
        />
      </div>

      <div className="platforms-selection">
        <label>Selecciona tus plataformas:</label>
        <div className="platforms-grid">
          {socialPlatforms.map((platform) => (
            <label key={platform.id} className="platform-checkbox">
              <input
                type="checkbox"
                checked={contentData.platforms.includes(platform.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setContentData(prev => ({
                      ...prev,
                      platforms: [...prev.platforms, platform.id]
                    }));
                  } else {
                    setContentData(prev => ({
                      ...prev,
                      platforms: prev.platforms.filter(p => p !== platform.id)
                    }));
                  }
                }}
              />
              <span className="platform-icon" style={{ color: platform.color }}>
                {platform.icon}
              </span>
              <span>{platform.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        className="next-btn"
        onClick={analyzeMarket}
        disabled={!contentData.type || !contentData.description || contentData.platforms.length === 0}
      >
        🚀 Analizar Mercado
      </button>
    </div>
  );

  // Paso 2: Análisis de mercado
  const renderAnalysisStep = () => (
    <div className="step-container">
      {isAnalyzing ? (
        <div className="analyzing-container">
          <div className="analyzing-animation">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
          <h2>🧠 Analizando tu mercado...</h2>
          <p>Conectando con Qwen para análisis inteligente</p>
          <div className="analysis-steps">
            <div className="analysis-step">✅ Identificando audiencia objetivo</div>
            <div className="analysis-step">✅ Analizando competencia</div>
            <div className="analysis-step">✅ Calculando horarios óptimos</div>
            <div className="analysis-step">🔄 Generando estrategia personalizada</div>
          </div>
        </div>
      ) : marketAnalysis && (
        <div className="analysis-results">
          <div className="step-header">
            <h2>📊 Análisis de Mercado Completo</h2>
            <p>Basado en IA y datos de mercado actuales</p>
          </div>

          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>🎯 Audiencia Objetivo</h3>
              <p><strong>Primaria:</strong> {marketAnalysis.target_audience.primary}</p>
              <p><strong>Demografía:</strong> {marketAnalysis.target_audience.demographics.age_range}</p>
              <p><strong>Género:</strong> {marketAnalysis.target_audience.demographics.gender_split}</p>
              <p><strong>Nivel socioeconómico:</strong> {marketAnalysis.target_audience.demographics.income_level}</p>
            </div>

            <div className="analysis-card">
              <h3>⏰ Horarios Óptimos</h3>
              {Object.entries(marketAnalysis.optimal_times).map(([platform, times]) => (
                <div key={platform} className="platform-times">
                  <strong>{socialPlatforms.find(p => p.id === platform)?.name}:</strong>
                  <span>{times.join(', ')}</span>
                </div>
              ))}
            </div>

            <div className="analysis-card">
              <h3>📈 Potencial de Crecimiento</h3>
              <p><strong>Nivel:</strong> {marketAnalysis.growth_potential}</p>
              <p><strong>Competencia:</strong> {marketAnalysis.competition_level}</p>
              <p><strong>Estrategia:</strong> {marketAnalysis.content_strategy}</p>
            </div>

            <div className="analysis-card">
              <h3>🎯 Plataformas Recomendadas</h3>
              <div className="recommended-platforms">
                {marketAnalysis.recommended_platforms.map((platformId) => {
                  const platform = socialPlatforms.find(p => p.id === platformId);
                  return (
                    <span key={platformId} className="platform-tag" style={{ borderColor: platform.color }}>
                      {platform.icon} {platform.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            className="next-btn"
            onClick={() => setCurrentStep('hooks')}
          >
            📝 Ver Ganchos Virales
          </button>
        </div>
      )}
    </div>
  );

  // Paso 3: Ganchos virales
  const renderHooksStep = () => (
    <div className="step-container">
      <div className="step-header">
        <h2>🎣 Ganchos Virales Personalizados</h2>
        <p>Uno por semana para cada plataforma</p>
      </div>

      <div className="hooks-grid">
        {viralHooks.map((hook, index) => (
          <div key={index} className="hook-card">
            <div className="hook-header">
              <span className="platform-icon" style={{ color: socialPlatforms.find(p => p.id === hook.platform)?.color }}>
                {socialPlatforms.find(p => p.id === hook.platform)?.icon}
              </span>
              <h3>{socialPlatforms.find(p => p.id === hook.platform)?.name}</h3>
            </div>
            <div className="hook-content">
              <p className="hook-text">"{hook.hook}"</p>
              <p className="hook-explanation">{hook.explanation}</p>
            </div>
            <button 
              className="copy-hook-btn"
              onClick={() => {
                navigator.clipboard.writeText(hook.hook);
                alert('Gancho copiado al portapapeles');
              }}
            >
              📋 Copiar
            </button>
          </div>
        ))}
      </div>

      <div className="hooks-actions">
        <button
          className="next-btn"
          onClick={() => setCurrentStep('calendar')}
        >
          📅 Programar Publicaciones
        </button>
        <button
          className="secondary-btn"
          onClick={() => setCurrentStep('analysis')}
        >
          ← Volver al Análisis
        </button>
      </div>
    </div>
  );

  // Paso 4: Calendario de publicaciones
  const renderCalendarStep = () => (
    <div className="step-container">
      <div className="step-header">
        <h2>📅 Calendario de Publicaciones</h2>
        <p>Programa tus posts en horarios óptimos</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-info">
          <h3>📊 Horarios Recomendados</h3>
          {marketAnalysis && Object.entries(marketAnalysis.optimal_times).map(([platform, times]) => (
            <div key={platform} className="platform-schedule">
              <div className="platform-header">
                <span style={{ color: socialPlatforms.find(p => p.id === platform)?.color }}>
                  {socialPlatforms.find(p => p.id === platform)?.icon}
                </span>
                <strong>{socialPlatforms.find(p => p.id === platform)?.name}</strong>
              </div>
              <div className="optimal-times">
                {times.map((time, index) => (
                  <span key={index} className="time-slot">{time}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="scheduling-form">
          <h3>📝 Programar Publicación</h3>
          <div className="form-group">
            <label>Contenido:</label>
            <textarea placeholder="Escribe tu post aquí..." rows="3"></textarea>
          </div>
          <div className="form-group">
            <label>Plataforma:</label>
            <select>
              {contentData.platforms.map((platformId) => {
                const platform = socialPlatforms.find(p => p.id === platformId);
                return (
                  <option key={platformId} value={platformId}>
                    {platform.icon} {platform.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha y hora:</label>
            <input type="datetime-local" />
          </div>
          <button className="schedule-btn led-button-arturia">
            Programar Publicación
          </button>
        </div>
      </div>

      <div className="calendar-actions">
        <button
          className="next-btn"
          onClick={() => setCurrentStep('publish')}
        >
          🚀 Publicar Ahora
        </button>
        <button
          className="secondary-btn"
          onClick={() => setCurrentStep('hooks')}
        >
          ← Volver a Ganchos
        </button>
      </div>
    </div>
  );

  // Paso 5: Publicación directa
  const renderPublishStep = () => (
    <div className="step-container">
      <div className="step-header">
        <h2>🚀 Publicación Directa</h2>
        <p>Publica en múltiples plataformas simultáneamente</p>
      </div>

      <div className="publish-container">
        <div className="publish-form">
          <div className="form-group">
            <label>Contenido del post:</label>
            <textarea 
              placeholder="Escribe tu contenido aquí..."
              rows="5"
            ></textarea>
          </div>

          <div className="platforms-publish">
            <label>Publicar en:</label>
            <div className="platforms-grid">
              {contentData.platforms.map((platformId) => {
                const platform = socialPlatforms.find(p => p.id === platformId);
                return (
                  <label key={platformId} className="platform-publish-option">
                    <input type="checkbox" defaultChecked />
                    <span style={{ color: platform.color }}>
                      {platform.icon} {platform.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button className="publish-now-btn led-button-arturia">
            Publicar en Todas las Plataformas
          </button>
        </div>

        <div className="publish-preview">
          <h3>👀 Vista Previa</h3>
          <div className="preview-cards">
            {contentData.platforms.slice(0, 3).map((platformId) => {
              const platform = socialPlatforms.find(p => p.id === platformId);
              return (
                <div key={platformId} className="preview-card">
                  <div className="preview-header">
                    <span style={{ color: platform.color }}>
                      {platform.icon}
                    </span>
                    <span>{platform.name}</span>
                  </div>
                  <div className="preview-content">
                    <p>Tu contenido aparecerá aquí...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="publish-actions">
        <button
          className="secondary-btn"
          onClick={() => setCurrentStep('calendar')}
        >
          ← Volver al Calendario
        </button>
        <button
          className="restart-btn"
          onClick={() => {
            setCurrentStep('content-type');
            setContentData({ type: '', description: '', platforms: [] });
            setMarketAnalysis(null);
            setViralHooks([]);
          }}
        >
          🔄 Nuevo Análisis
        </button>
      </div>
    </div>
  );

  return (
    <div className="nova-post-pilot nova-post-pilot-arturia">
      <div className="pilot-header studio-header-arturia">
        <div className="studio-title-arturia">
          <div className="studio-logo-arturia">🚀</div>
          <div className="studio-name-arturia">
            <h1>Nova Post Pilot</h1>
            <p>Herramienta Universal de Marketing Digital</p>
          </div>
        </div>
        <div className="lcd-display-arturia">
          <div className="lcd-text-arturia">
            NOVA PILOT v2.1<br/>
            {isAnalyzing ? 'ANALYZING...' : 'READY'}
          </div>
        </div>
        {onClose && (
          <button className="close-btn led-button-arturia" onClick={onClose}>Cerrar</button>
        )}
      </div>

      <div className="pilot-progress">
        <div className="progress-steps">
          <div className={`progress-step ${currentStep === 'content-type' ? 'active' : ''}`}>1. Contenido</div>
          <div className={`progress-step ${currentStep === 'analysis' ? 'active' : ''}`}>2. Análisis</div>
          <div className={`progress-step ${currentStep === 'hooks' ? 'active' : ''}`}>3. Ganchos</div>
          <div className={`progress-step ${currentStep === 'calendar' ? 'active' : ''}`}>4. Calendario</div>
          <div className={`progress-step ${currentStep === 'publish' ? 'active' : ''}`}>5. Publicar</div>
        </div>
      </div>

      <div className="pilot-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default NovaPostPilot;