/**
 * 📊 Analytics Service - Sistema de Analytics en Tiempo Real
 * Servicio para análisis de datos y métricas de rendimiento
 */

class AnalyticsService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8003'; // Puerto del backend de analytics
        this.isAvailable = false;
        this.realTimeData = null;
        this.isInitialized = false;
        this.updateInterval = null;
        
        this.init();
    }

    async init() {
        try {
            await this.checkHealth();
            this.startRealTimeUpdates();
            this.isInitialized = true;
            console.log('📊 Analytics Service inicializado');
        } catch (error) {
            console.warn('Analytics Service no disponible, usando modo fallback:', error.message);
            this.isAvailable = false;
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                this.isAvailable = true;
                console.log('✅ Analytics Service disponible');
            } else {
                this.isAvailable = false;
            }
        } catch (error) {
            this.isAvailable = false;
            throw new Error('Analytics Service no disponible');
        }
    }

    startRealTimeUpdates() {
        if (!this.isAvailable) return;

        // Actualizar datos cada 30 segundos
        this.updateInterval = setInterval(async () => {
            try {
                await this.updateRealTimeData();
            } catch (error) {
                console.error('Error actualizando datos en tiempo real:', error);
            }
        }, 30000);
    }

    async updateRealTimeData() {
        if (!this.isAvailable) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/realtime`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.realTimeData = data;
                
                // Emitir evento de actualización
                this.dispatchEvent('analyticsUpdated', data);
            }
        } catch (error) {
            console.error('Error actualizando datos en tiempo real:', error);
        }
    }

    async getAnalyticsData(timeRange = '7d', metrics = ['all']) {
        if (!this.isAvailable) {
            return this.getFallbackAnalyticsData(timeRange);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    time_range: timeRange,
                    metrics: metrics
                })
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Emitir evento de datos obtenidos
            this.dispatchEvent('analyticsDataReceived', data);
            
            return data;
        } catch (error) {
            console.error('Error obteniendo datos de analytics:', error);
            return this.getFallbackAnalyticsData(timeRange);
        }
    }

    async getPerformanceMetrics(platform = 'all') {
        if (!this.isAvailable) {
            return this.getFallbackPerformanceMetrics(platform);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/performance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform: platform,
                    metrics: ['reach', 'engagement', 'conversion', 'retention']
                })
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Emitir evento de métricas obtenidas
            this.dispatchEvent('performanceMetricsReceived', data);
            
            return data;
        } catch (error) {
            console.error('Error obteniendo métricas de rendimiento:', error);
            return this.getFallbackPerformanceMetrics(platform);
        }
    }

    async getTrendingTopics(platform = 'all') {
        if (!this.isAvailable) {
            return this.getFallbackTrendingTopics(platform);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/trending`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    platform: platform,
                    time_range: '24h'
                })
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Emitir evento de trending topics
            this.dispatchEvent('trendingTopicsReceived', data);
            
            return data;
        } catch (error) {
            console.error('Error obteniendo trending topics:', error);
            return this.getFallbackTrendingTopics(platform);
        }
    }

    async getAudienceInsights() {
        if (!this.isAvailable) {
            return this.getFallbackAudienceInsights();
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/audience`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Emitir evento de insights de audiencia
            this.dispatchEvent('audienceInsightsReceived', data);
            
            return data;
        } catch (error) {
            console.error('Error obteniendo insights de audiencia:', error);
            return this.getFallbackAudienceInsights();
        }
    }

    async getContentPerformance(contentId) {
        if (!this.isAvailable) {
            return this.getFallbackContentPerformance(contentId);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/content/${contentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Emitir evento de rendimiento de contenido
            this.dispatchEvent('contentPerformanceReceived', data);
            
            return data;
        } catch (error) {
            console.error('Error obteniendo rendimiento de contenido:', error);
            return this.getFallbackContentPerformance(contentId);
        }
    }

    async getCompetitorAnalysis(competitorHandles) {
        if (!this.isAvailable) {
            return this.getFallbackCompetitorAnalysis(competitorHandles);
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/analytics/competitors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    competitors: competitorHandles,
                    analysis_depth: 'comprehensive'
                })
            });

            if (!response.ok) {
                throw new Error(`Analytics API error: ${response.status}`);
            }

            const data = await response.json();
            
            // Emitir evento de análisis de competidores
            this.dispatchEvent('competitorAnalysisReceived', data);
            
            return data;
        } catch (error) {
            console.error('Error obteniendo análisis de competidores:', error);
            return this.getFallbackCompetitorAnalysis(competitorHandles);
        }
    }

    // Métodos de análisis de datos
    analyzeEngagementTrends(data) {
        const trends = {
            overall: this.calculateTrend(data.engagement.overall),
            by_platform: {},
            by_content_type: {},
            by_time: {}
        };

        // Análisis por plataforma
        for (const [platform, metrics] of Object.entries(data.engagement.by_platform)) {
            trends.by_platform[platform] = this.calculateTrend(metrics);
        }

        // Análisis por tipo de contenido
        for (const [type, metrics] of Object.entries(data.engagement.by_content_type)) {
            trends.by_content_type[type] = this.calculateTrend(metrics);
        }

        // Análisis por horario
        for (const [time, metrics] of Object.entries(data.engagement.by_time)) {
            trends.by_time[time] = this.calculateTrend(metrics);
        }

        return trends;
    }

    calculateTrend(data) {
        if (!data || data.length < 2) return { direction: 'stable', percentage: 0 };

        const recent = data[data.length - 1];
        const previous = data[data.length - 2];
        
        const change = ((recent - previous) / previous) * 100;
        
        return {
            direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
            percentage: Math.abs(change),
            value: recent
        };
    }

    generateInsights(data) {
        const insights = [];

        // Insight de crecimiento
        if (data.followers.growth > 10) {
            insights.push({
                type: 'growth',
                priority: 'high',
                message: `Crecimiento excepcional: +${data.followers.growth}% en seguidores`,
                recommendation: 'Mantén el momentum con contenido consistente'
            });
        }

        // Insight de engagement
        if (data.engagement.rate > 5) {
            insights.push({
                type: 'engagement',
                priority: 'high',
                message: `Engagement alto: ${data.engagement.rate}% de tasa de engagement`,
                recommendation: 'Tu audiencia está muy comprometida, aprovecha para crear más contenido'
            });
        }

        // Insight de horarios óptimos
        const bestTime = this.findBestPostingTime(data.engagement.by_time);
        if (bestTime) {
            insights.push({
                type: 'timing',
                priority: 'medium',
                message: `Mejor horario: ${bestTime.time} con ${bestTime.engagement}% de engagement`,
                recommendation: `Programa más contenido para las ${bestTime.time}`
            });
        }

        // Insight de tipo de contenido
        const bestContentType = this.findBestContentType(data.engagement.by_content_type);
        if (bestContentType) {
            insights.push({
                type: 'content',
                priority: 'medium',
                message: `${bestContentType.type} es tu mejor tipo de contenido`,
                recommendation: `Crea más contenido de tipo ${bestContentType.type}`
            });
        }

        return insights;
    }

    findBestPostingTime(timeData) {
        let bestTime = null;
        let bestEngagement = 0;

        for (const [time, engagement] of Object.entries(timeData)) {
            if (engagement > bestEngagement) {
                bestEngagement = engagement;
                bestTime = time;
            }
        }

        return bestTime ? { time: bestTime, engagement: bestEngagement } : null;
    }

    findBestContentType(contentTypeData) {
        let bestType = null;
        let bestEngagement = 0;

        for (const [type, engagement] of Object.entries(contentTypeData)) {
            if (engagement > bestEngagement) {
                bestEngagement = engagement;
                bestType = type;
            }
        }

        return bestType ? { type: bestType, engagement: bestEngagement } : null;
    }

    // Métodos de fallback
    getFallbackAnalyticsData(timeRange) {
        return {
            time_range: timeRange,
            followers: {
                current: 12500,
                growth: 15.2,
                growth_rate: '+2.1%'
            },
            engagement: {
                rate: 4.8,
                likes: 1250,
                comments: 89,
                shares: 45,
                saves: 67
            },
            reach: {
                total: 45000,
                unique: 38000,
                impressions: 67000
            },
            content: {
                posts: 24,
                stories: 48,
                reels: 12,
                videos: 8
            },
            demographics: {
                age_groups: {
                    '18-24': 35,
                    '25-34': 40,
                    '35-44': 20,
                    '45+': 5
                },
                gender: {
                    'male': 45,
                    'female': 55
                },
                top_locations: ['Mexico', 'Spain', 'Argentina', 'Colombia']
            }
        };
    }

    getFallbackPerformanceMetrics(platform) {
        return {
            platform: platform,
            reach: {
                current: 45000,
                change: '+12%',
                trend: 'up'
            },
            engagement: {
                rate: 4.8,
                change: '+8%',
                trend: 'up'
            },
            conversion: {
                rate: 2.3,
                change: '+15%',
                trend: 'up'
            },
            retention: {
                rate: 68,
                change: '+5%',
                trend: 'up'
            }
        };
    }

    getFallbackTrendingTopics(platform) {
        return {
            platform: platform,
            topics: [
                { name: '#AIMusic', growth: '+45%', posts: 12500 },
                { name: '#MusicProduction', growth: '+32%', posts: 8900 },
                { name: '#StudioSetup', growth: '+28%', posts: 6700 },
                { name: '#ProducerLife', growth: '+21%', posts: 5400 },
                { name: '#MusicTech', growth: '+18%', posts: 4200 }
            ],
            hashtags: [
                { name: '#AIMusic', reach: 2.5, engagement: 4.2 },
                { name: '#MusicProduction', reach: 1.8, engagement: 3.9 },
                { name: '#StudioSetup', reach: 1.5, engagement: 3.7 },
                { name: '#ProducerLife', reach: 1.2, engagement: 3.5 },
                { name: '#MusicTech', reach: 1.0, engagement: 3.3 }
            ]
        };
    }

    getFallbackAudienceInsights() {
        return {
            demographics: {
                age_groups: {
                    '18-24': 35,
                    '25-34': 40,
                    '35-44': 20,
                    '45+': 5
                },
                gender: {
                    'male': 45,
                    'female': 55
                },
                top_locations: ['Mexico', 'Spain', 'Argentina', 'Colombia']
            },
            interests: [
                'Music Production',
                'AI Technology',
                'Studio Equipment',
                'Music Software',
                'Audio Engineering'
            ],
            behavior: {
                peak_hours: '7-9 PM',
                most_active_days: ['Friday', 'Saturday', 'Sunday'],
                content_preferences: ['Video', 'Behind the Scenes', 'Tutorials']
            }
        };
    }

    getFallbackContentPerformance(contentId) {
        return {
            content_id: contentId,
            reach: 12500,
            engagement: 4.8,
            likes: 1250,
            comments: 89,
            shares: 45,
            saves: 67,
            views: 8900,
            completion_rate: 78
        };
    }

    getFallbackCompetitorAnalysis(competitorHandles) {
        return {
            competitors: competitorHandles,
            analysis: {
                'competitor1': {
                    followers: 25000,
                    engagement: 3.2,
                    content_frequency: 'daily',
                    top_content: 'Tutorials'
                },
                'competitor2': {
                    followers: 18000,
                    engagement: 4.1,
                    content_frequency: '3x/week',
                    top_content: 'Behind the Scenes'
                }
            },
            insights: [
                'Tu engagement es superior al promedio',
                'Considera aumentar la frecuencia de publicación',
                'Tutorials son el contenido más exitoso'
            ]
        };
    }

    // Métodos de utilidad
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    isServiceAvailable() {
        return this.isAvailable;
    }

    getRealTimeData() {
        return this.realTimeData;
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Método para obtener resumen ejecutivo
    getExecutiveSummary(data) {
        return {
            key_metrics: {
                followers: data.followers.current,
                engagement_rate: data.engagement.rate,
                reach: data.reach.total,
                growth: data.followers.growth
            },
            top_insights: this.generateInsights(data).slice(0, 3),
            recommendations: [
                'Mantén la consistencia en la publicación',
                'Experimenta con nuevos tipos de contenido',
                'Interactúa más con tu audiencia'
            ],
            next_actions: [
                'Programar contenido para la próxima semana',
                'Analizar competidores exitosos',
                'Optimizar horarios de publicación'
            ]
        };
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsService;
} else {
    window.AnalyticsService = AnalyticsService;
}


