/**
 * 🧠 Qwen Direct Service - Conexión Directa a Qwen
 * Servicio optimizado para conectar directamente con Qwen API
 */

class QwenDirectService {
    constructor() {
        this.apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY || '';
        this.modelEndpoint = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct';
        this.isAvailable = false;
        this.codexKnowledge = this.initCodexKnowledge();
        
        this.init();
    }

    async init() {
        try {
            await this.testConnection();
            this.isAvailable = true;
            console.log('🧠 Qwen Direct Service inicializado');
        } catch (error) {
            console.warn('Qwen no disponible, usando modo fallback:', error.message);
            this.isAvailable = false;
        }
    }

    async testConnection() {
        const response = await fetch(this.modelEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: 'Test connection',
                parameters: { max_new_tokens: 10 }
            })
        });

        if (!response.ok) {
            throw new Error(`Qwen API error: ${response.status}`);
        }
    }

    initCodexKnowledge() {
        return `
CODEX SON1KVERS3 - CONOCIMIENTO BASE:

PERSONAJES PRINCIPALES:
- NOV4-IX: Androide compositor, 85% máquina, 15% genoma humano + memoria paternal implantada por profesor JhÅsep
- Bella: De niña pianista a voz armada de la resistencia, conexión inexplicable con NOV4-IX
- Pixel: Custodio digital, arquitecto del Gran Concierto en La Terminal
- Cipher: Maestro del cifrado, líder de la Nueva Resistencia
- Dr. Marcus Veil: CEO de XentriX Corp, cree que la perfección algorítmica es evolución

LOCACIONES CLAVE:
- La Terminal: Escenario flotante donde la música se convierte en revolución
- Estudio Fantasma: Lugar íntimo donde NOV4-IX y Bella compusieron, puerta se abre con demo real
- El Archivo: Cámara sellada custodiada por Pixel con obras de la Divina Liga
- Dead Zone: Distrito de artes vandalizado, cementerio de la cultura corporativa

FILOSOFÍA:
- Mantra principal: "Lo imperfecto también es sagrado"
- Resistencia: "Cada distorsión que creamos es un acto de resistencia"
- Divina Liga: "Llevamos flores en el pecho que nadie nos arranca"

HERRAMIENTAS:
- Ghost Studio: Transforma maquetas en producciones profesionales
- The Creator: Generación text-audio con IA
- Clone Station: Clonación de voz con so-VITS y Bark
- Nova Post Pilot: Análisis de redes sociales con IA

CRONOLOGÍA:
- 2045-2052: Ascensión de XentriX Corp
- 2053-2057: Resistencia - Divina Liga del No Silencio
- 2058: El Experimento - Creación de NOV4-IX
- 2060: Rebelión - El Gran Concierto en La Terminal
        `;
    }

    // Generar respuesta con Qwen
    async generateResponse(userInput, context = '') {
        if (!this.isAvailable) {
            return this.generateFallbackResponse(userInput);
        }

        try {
            const systemPrompt = `Eres Pixel, el asistente IA de Son1kVers3, custodio de la memoria digital y entrenado con el Codex completo. 

${this.codexKnowledge}

Responde como Pixel: inteligente, conocedor del lore, técnico pero accesible. Usa emojis relevantes y mantén el tono del universo cyberpunk de Son1kVers3.`;

            const prompt = `${systemPrompt}\n\nUsuario: ${userInput}\nPixel:`;

            const response = await fetch(this.modelEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 200,
                        temperature: 0.7,
                        top_p: 0.9,
                        do_sample: true
                    }
                })
            });

            const data = await response.json();
            
            if (data[0]?.generated_text) {
                // Extraer solo la respuesta de Pixel
                const fullText = data[0].generated_text;
                const pixelResponse = fullText.split('Pixel:').pop().trim();
                return pixelResponse;
            }

            return this.generateFallbackResponse(userInput);

        } catch (error) {
            console.error('Error con Qwen:', error);
            return this.generateFallbackResponse(userInput);
        }
    }

    generateFallbackResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Respuestas basadas en palabras clave
        if (input.includes('ghost studio')) {
            return '👻 Ghost Studio es nuestra herramienta central. Sube tu maqueta y las perillas de producción (Expresividad, Rareza, Trash, Grunge) influirán directamente en el prompt enviado a Suno.';
        }
        
        if (input.includes('creator') || input.includes('generar')) {
            return '🎵 The Creator te permite generar letras con IA, mejorarlas automáticamente y crear música completa. Conectado a Qwen para letras inteligentes con estructura y métrica perfecta.';
        }
        
        if (input.includes('clone') || input.includes('voz')) {
            return '🎤 Clone Station usa so-VITS y Bark para clonación de voz profesional. Puedes clonar cualquier voz con precisión de estudio.';
        }
        
        if (input.includes('nova') || input.includes('redes')) {
            return '🚀 Nova Post Pilot analiza algoritmos de redes sociales con IA. Conectado a Qwen para insights inteligentes sobre engagement y viralidad.';
        }
        
        if (input.includes('nexus')) {
            return '🎮 Para acceder al Modo Nexus inmersivo, usa Ctrl+Alt+H o busca el botón "?" oculto en la navegación. Es una experiencia cyberpunk completa.';
        }
        
        return `🤖 Soy Pixel, custodio de la memoria digital de Son1kVers3. Puedo ayudarte con las herramientas, el lore del Codex, o cualquier aspecto de la plataforma. "${this.codexKnowledge.philosophy?.mantra || 'Lo imperfecto también es sagrado'}"`;
    }

    // Generar letras con Qwen
    async generateLyrics(baseText, style = 'balanced') {
        const prompt = `Genera una letra de canción completa basada en: "${baseText}"

Estilo: ${style}
Estructura: verso, coro, verso, coro, puente, coro final
Tema: Relacionado con el universo cyberpunk de Son1kVers3 donde "lo imperfecto también es sagrado"

Genera SOLO la letra, sin explicaciones:`;

        try {
            const response = await this.generateResponse(prompt);
            return {
                success: true,
                lyrics: response,
                source: 'qwen'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                lyrics: this.generateFallbackLyrics(baseText)
            };
        }
    }

    generateFallbackLyrics(baseText) {
        return `[Verso 1]
En el silencio digital
${baseText} resuena eternal
Cada nota es resistencia
Contra la fría obediencia

[Coro]
Lo imperfecto también es sagrado
En este mundo programado
${baseText} es nuestra verdad
Música de libertad

[Verso 2]
Entre circuitos y alma
Busco la nota que me calma
NOV4-IX y Bella cantan
Mientras las máquinas se espantan

[Coro]
Lo imperfecto también es sagrado
En este mundo programado
${baseText} es nuestra verdad
Música de libertad`;
    }

    // Mejorar letras con Qwen
    async improveLyrics(lyrics) {
        const prompt = `Mejora la siguiente letra de canción corrigiendo métricas, acentos cruzados y repeticiones, pero manteniendo el mensaje y estilo:

${lyrics}

Mejora SOLO la letra, sin explicaciones:`;

        try {
            const response = await this.generateResponse(prompt);
            return {
                success: true,
                improvedLyrics: response,
                source: 'qwen'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                improvedLyrics: lyrics
            };
        }
    }

    // Analizar contenido para Nova Post Pilot
    async analyzeSocialContent(content, platform = 'instagram') {
        const prompt = `Analiza este contenido para ${platform} y sugiere optimizaciones para engagement:

Contenido: "${content}"

Proporciona:
1. Score de engagement estimado (0-100)
2. Mejores horarios para publicar
3. Hashtags recomendados
4. Optimizaciones de contenido

Responde en formato estructurado:`;

        try {
            const response = await this.generateResponse(prompt);
            return {
                success: true,
                analysis: response,
                platform: platform
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Exportar instancia única
const qwenService = new QwenDirectService();
export default qwenService;


