/**
 * 🤖 Ollama AI Service - Integración con IA Local (Qwen)
 * Servicio para análisis musical inteligente y generación de contenido
 */

class OllamaAIService {
    constructor() {
        this.baseUrl = 'http://localhost:11434';
        this.model = 'qwen2.5:7b';
        this.isAvailable = false;
        this.healthCheckInterval = null;
        
        this.init();
    }

    async init() {
        try {
            await this.checkHealth();
            this.startHealthCheck();
            console.log('🤖 Ollama AI Service inicializado con Qwen 2.5');
        } catch (error) {
            console.warn('Ollama no disponible, usando modo fallback:', error.message);
            this.isAvailable = false;
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                const hasQwen = data.models?.some(model => 
                    model.name.includes('qwen') || model.name.includes('Qwen')
                );
                
                if (hasQwen) {
                    this.isAvailable = true;
                    console.log('✅ Qwen model detectado y disponible');
                } else {
                    console.warn('⚠️ Qwen model no encontrado');
                    this.isAvailable = false;
                }
            } else {
                this.isAvailable = false;
            }
        } catch (error) {
            this.isAvailable = false;
            throw new Error('Ollama no disponible');
        }
    }

    startHealthCheck() {
        // Verificar salud cada 30 segundos
        this.healthCheckInterval = setInterval(async () => {
            try {
                await this.checkHealth();
            } catch (error) {
                this.isAvailable = false;
            }
        }, 30000);
    }

    async generate(prompt, options = {}) {
        if (!this.isAvailable) {
            return this.getFallbackResponse(prompt, options);
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: options.temperature || 0.7,
                        top_p: options.top_p || 0.9,
                        max_tokens: options.max_tokens || 1000
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            return data.response || '';
        } catch (error) {
            console.error('Error con Ollama:', error);
            return this.getFallbackResponse(prompt, options);
        }
    }

    async analyzeMusicPrompt(prompt) {
        const analysisPrompt = `
Analiza este prompt musical y proporciona un análisis detallado en formato JSON:

Prompt: "${prompt}"

Proporciona análisis con:
- tempo: BPM estimado (número)
- scale: escala musical (ej: "C major", "A minor")
- instruments: array de instrumentos detectados
- mood: estado emocional (ej: "happy", "sad", "epic", "mysterious")
- energy_level: nivel de energía 1-10
- complexity: complejidad 1-10
- style_characteristics: array de características de estilo
- emotional_tone: tono emocional
- technical_notes: notas técnicas para producción

Responde SOLO con el JSON válido, sin texto adicional.
        `;

        try {
            const response = await this.generate(analysisPrompt, {
                temperature: 0.3,
                max_tokens: 500
            });

            // Intentar parsear JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No se pudo extraer JSON válido');
            }
        } catch (error) {
            console.error('Error en análisis musical:', error);
            return this.getFallbackMusicAnalysis(prompt);
        }
    }

    async generateLyrics(prompt, style = 'general') {
        const lyricsPrompt = `
Genera letras para una canción basada en este prompt: "${prompt}"

Estilo: ${style}

Estructura:
- Verso 1 (4 líneas)
- Pre-coro (2 líneas)
- Coro (4 líneas)
- Verso 2 (4 líneas)
- Pre-coro (2 líneas)
- Coro (4 líneas)
- Puente (2 líneas)
- Coro final (4 líneas)

Las letras deben ser:
- Coherentes con el prompt
- Apropiadas para el estilo musical
- Emotivas y memorables
- En español (a menos que se especifique otro idioma)

Responde SOLO con las letras, sin explicaciones adicionales.
        `;

        try {
            return await this.generate(lyricsPrompt, {
                temperature: 0.8,
                max_tokens: 800
            });
        } catch (error) {
            console.error('Error generando letras:', error);
            return this.getFallbackLyrics(prompt);
        }
    }

    async classifyStyle(prompt) {
        const classificationPrompt = `
Clasifica el estilo musical de este prompt en formato JSON:

Prompt: "${prompt}"

Proporciona:
- primary_style: estilo principal
- secondary_styles: array de estilos secundarios
- confidence: confianza 0-1
- characteristics: array de características musicales
- influences: array de influencias
- target_audience: audiencia objetivo
- mood_tags: array de tags de mood

Estilos disponibles: synthwave, cyberpunk, electronic, ambient, epic, rock, pop, jazz, classical, hip-hop, reggaeton, latin, folk, blues, country, metal, punk, indie, experimental

Responde SOLO con el JSON válido.
        `;

        try {
            const response = await this.generate(classificationPrompt, {
                temperature: 0.4,
                max_tokens: 300
            });

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No se pudo extraer JSON válido');
            }
        } catch (error) {
            console.error('Error clasificando estilo:', error);
            return this.getFallbackStyleClassification(prompt);
        }
    }

    async optimizePrompt(originalPrompt) {
        const optimizationPrompt = `
Optimiza este prompt musical para mejor generación de música:

Prompt original: "${originalPrompt}"

Mejora el prompt agregando:
- Especificaciones técnicas (tempo, escala, instrumentos)
- Descripciones de mood y energía
- Referencias de estilo musical
- Detalles de producción

Proporciona:
- optimized_prompt: prompt mejorado
- improvements: array de mejoras aplicadas
- technical_suggestions: array de sugerencias técnicas
- style_enhancements: array de mejoras de estilo
- confidence: confianza en la optimización 0-1

Responde SOLO con el JSON válido.
        `;

        try {
            const response = await this.generate(optimizationPrompt, {
                temperature: 0.5,
                max_tokens: 400
            });

            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No se pudo extraer JSON válido');
            }
        } catch (error) {
            console.error('Error optimizando prompt:', error);
            return this.getFallbackPromptOptimization(originalPrompt);
        }
    }

    // Métodos de fallback cuando Ollama no está disponible
    getFallbackResponse(prompt, options) {
        console.log('Usando modo fallback para:', prompt);
        return Promise.resolve('Análisis básico (modo fallback)');
    }

    getFallbackMusicAnalysis(prompt) {
        return {
            tempo: 120,
            scale: "C major",
            instruments: ["synth", "drums", "bass"],
            mood: "neutral",
            energy_level: 5,
            complexity: 5,
            style_characteristics: ["electronic"],
            emotional_tone: "neutral",
            technical_notes: "Análisis básico - modo fallback"
        };
    }

    getFallbackLyrics(prompt) {
        return `
[Verso 1]
Música que nace del silencio
Notas que vuelan en el viento
Cada acorde tiene su momento
En este mundo de sentimiento

[Pre-coro]
Siente la vibración
De esta creación

[Coro]
Música, música, música
Que llena el alma
Música, música, música
Que nunca se acaba

[Verso 2]
Ritmo que late en el corazón
Melodía que trae emoción
Cada sonido es una canción
De pura inspiración

[Pre-coro]
Siente la vibración
De esta creación

[Coro]
Música, música, música
Que llena el alma
Música, música, música
Que nunca se acaba

[Puente]
Cuando todo se detiene
La música sigue viva

[Coro Final]
Música, música, música
Que llena el alma
Música, música, música
Que nunca se acaba
        `;
    }

    getFallbackStyleClassification(prompt) {
        return {
            primary_style: "electronic",
            secondary_styles: ["ambient"],
            confidence: 0.6,
            characteristics: ["synthetic", "atmospheric"],
            influences: ["modern"],
            target_audience: "general",
            mood_tags: ["neutral", "contemplative"]
        };
    }

    getFallbackPromptOptimization(originalPrompt) {
        return {
            optimized_prompt: `${originalPrompt} con tempo 120 BPM, estilo electrónico, instrumentos sintéticos`,
            improvements: ["agregado tempo específico", "especificado estilo"],
            technical_suggestions: ["usar tempo 120 BPM", "agregar instrumentos sintéticos"],
            style_enhancements: ["énfasis en electrónico"],
            confidence: 0.7
        };
    }

    // Método para verificar disponibilidad
    isAIAvailable() {
        return this.isAvailable;
    }

    // Método para obtener información del modelo
    async getModelInfo() {
        if (!this.isAvailable) {
            return { available: false, model: 'fallback' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            const data = await response.json();
            const qwenModel = data.models?.find(model => 
                model.name.includes('qwen') || model.name.includes('Qwen')
            );

            return {
                available: true,
                model: qwenModel?.name || this.model,
                size: qwenModel?.size || 'unknown',
                modified: qwenModel?.modified_at || 'unknown'
            };
        } catch (error) {
            return { available: false, model: 'fallback', error: error.message };
        }
    }

    // Limpiar recursos
    destroy() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }
}

// Exportar para uso global
export default OllamaAIService;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OllamaAIService;
} else {
    window.OllamaAIService = OllamaAIService;
}

