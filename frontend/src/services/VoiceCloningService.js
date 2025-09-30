/**
 * 🎤 Voice Cloning Service - Clone Station
 * Servicio para clonación de voz con múltiples modelos
 */

class VoiceCloningService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8002'; // Puerto del backend de clonación
        this.userTier = 'free';
        this.availableModels = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadUserTier();
            await this.loadAvailableModels();
            this.isInitialized = true;
            console.log('🎤 Voice Cloning Service inicializado');
        } catch (error) {
            console.error('Error inicializando Voice Cloning Service:', error);
        }
    }

    async loadUserTier() {
        // Obtener tier del usuario desde localStorage o API
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await fetch('/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const user = await response.json();
                this.userTier = user.tier || 'free';
            } catch (error) {
                this.userTier = 'free';
            }
        }
    }

    async loadAvailableModels() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/voice/models`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.availableModels = new Map(data.models.map(model => [model.id, model]));
            }
        } catch (error) {
            console.error('Error cargando modelos:', error);
            // Usar modelos por defecto
            this.setDefaultModels();
        }
    }

    setDefaultModels() {
        const defaultModels = {
            'free': [
                {
                    id: 'so-vits-4.0',
                    name: 'so-VITS-SVC 4.0',
                    provider: 'huggingface',
                    model_id: 'lj1995/VoiceConversionWebUI',
                    quality: 'high',
                    max_duration: 30,
                    languages: ['es', 'en', 'ja', 'ko', 'zh'],
                    description: 'Modelo de conversión de voz de alta calidad',
                    features: ['voice_conversion', 'real_time', 'multilingual']
                },
                {
                    id: 'bark-voice',
                    name: 'Bark Voice Cloning',
                    provider: 'huggingface',
                    model_id: 'suno/bark',
                    quality: 'high',
                    max_duration: 60,
                    languages: ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
                    description: 'Modelo de clonación de voz con síntesis de texto a voz',
                    features: ['text_to_speech', 'voice_cloning', 'emotion_control', 'multilingual']
                }
            ],
            'pro': [
                {
                    id: 'so-vits-4.0-pro',
                    name: 'so-VITS-SVC 4.0 Pro',
                    provider: 'huggingface',
                    model_id: 'lj1995/VoiceConversionWebUI',
                    quality: 'premium',
                    max_duration: 120,
                    languages: ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
                    description: 'Versión Pro con mayor duración y calidad mejorada',
                    features: ['voice_conversion', 'real_time', 'multilingual', 'extended_duration']
                },
                {
                    id: 'bark-pro',
                    name: 'Bark Pro Voice Cloning',
                    provider: 'huggingface',
                    model_id: 'suno/bark',
                    quality: 'premium',
                    max_duration: 180,
                    languages: ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
                    description: 'Bark Pro con duración extendida y control emocional avanzado',
                    features: ['text_to_speech', 'voice_cloning', 'emotion_control', 'multilingual', 'extended_duration']
                }
            ],
            'enterprise': [
                {
                    id: 'so-vits-4.0-enterprise',
                    name: 'so-VITS-SVC 4.0 Enterprise',
                    provider: 'huggingface',
                    model_id: 'lj1995/VoiceConversionWebUI',
                    quality: 'professional',
                    max_duration: 300,
                    languages: ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar'],
                    description: 'Versión Enterprise con máxima calidad y soporte completo',
                    features: ['voice_conversion', 'real_time', 'multilingual', 'extended_duration', 'custom_training']
                },
                {
                    id: 'bark-enterprise',
                    name: 'Bark Enterprise Voice Cloning',
                    provider: 'huggingface',
                    model_id: 'suno/bark',
                    quality: 'professional',
                    max_duration: 600,
                    languages: ['es', 'en', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'ar'],
                    description: 'Bark Enterprise con máxima duración y control completo',
                    features: ['text_to_speech', 'voice_cloning', 'emotion_control', 'multilingual', 'extended_duration', 'custom_training']
                }
            ]
        };

        const models = defaultModels[this.userTier] || defaultModels['free'];
        this.availableModels = new Map(models.map(model => [model.id, model]));
    }

    async cloneVoice(audioFile, text, voiceSettings = {}) {
        if (!this.isInitialized) {
            throw new Error('Voice Cloning Service no está inicializado');
        }

        try {
            const formData = new FormData();
            formData.append('audio_file', audioFile);
            formData.append('text', text);
            formData.append('voice_settings', JSON.stringify(voiceSettings));
            formData.append('model_preference', voiceSettings.model || this.getBestModel());

            const response = await fetch(`${this.apiBaseUrl}/api/voice/clone`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en clonación de voz');
            }

            const result = await response.json();
            
            // Emitir evento de clonación exitosa
            this.dispatchEvent('voiceCloned', result);
            
            return result;
        } catch (error) {
            console.error('Error clonando voz:', error);
            throw error;
        }
    }

    async uploadVoiceSample(audioFile, voiceName, description = '') {
        if (this.userTier === 'free') {
            throw new Error('La subida de muestras de voz requiere tier Pro o Enterprise');
        }

        try {
            const formData = new FormData();
            formData.append('audio_file', audioFile);
            formData.append('voice_name', voiceName);
            formData.append('description', description);

            const response = await fetch(`${this.apiBaseUrl}/api/voice/upload-sample`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error subiendo muestra de voz');
            }

            const result = await response.json();
            
            // Emitir evento de subida exitosa
            this.dispatchEvent('voiceSampleUploaded', result);
            
            return result;
        } catch (error) {
            console.error('Error subiendo muestra de voz:', error);
            throw error;
        }
    }

    async trainVoiceModel(voiceId, trainingData) {
        if (this.userTier !== 'enterprise') {
            throw new Error('El entrenamiento de modelos requiere tier Enterprise');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/voice/train-model`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    voice_id: voiceId,
                    training_data: trainingData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error entrenando modelo de voz');
            }

            const result = await response.json();
            
            // Emitir evento de entrenamiento iniciado
            this.dispatchEvent('voiceModelTrainingStarted', result);
            
            return result;
        } catch (error) {
            console.error('Error entrenando modelo de voz:', error);
            throw error;
        }
    }

    getBestModel(useCase = 'general') {
        const models = Array.from(this.availableModels.values());
        
        // Seleccionar modelo basado en el caso de uso
        switch (useCase) {
            case 'voice_conversion':
                // so-VITS es mejor para conversión de voz
                const soVitsModel = models.find(m => m.id.includes('so-vits'));
                return soVitsModel?.id || 'so-vits-4.0';
                
            case 'text_to_speech':
                // Bark es mejor para texto a voz
                const barkModel = models.find(m => m.id.includes('bark'));
                return barkModel?.id || 'bark-voice';
                
            case 'multilingual':
                // Bark tiene mejor soporte multilingüe
                const multilingualModel = models.find(m => 
                    m.id.includes('bark') && m.languages.length > 5
                );
                return multilingualModel?.id || 'bark-voice';
                
            case 'emotion_control':
                // Bark tiene control emocional
                const emotionModel = models.find(m => 
                    m.features?.includes('emotion_control')
                );
                return emotionModel?.id || 'bark-voice';
                
            default:
                // Priorizar por calidad y duración máxima
                const sortedModels = models.sort((a, b) => {
                    const qualityOrder = { 
                        'professional': 4, 
                        'premium': 3, 
                        'high': 2, 
                        'standard': 1 
                    };
                    const aQuality = qualityOrder[a.quality] || 0;
                    const bQuality = qualityOrder[b.quality] || 0;
                    
                    if (aQuality !== bQuality) {
                        return bQuality - aQuality;
                    }
                    
                    return b.max_duration - a.max_duration;
                });

                return sortedModels[0]?.id || 'so-vits-4.0';
        }
    }

    getAvailableModels() {
        return Array.from(this.availableModels.values());
    }

    getModelById(modelId) {
        return this.availableModels.get(modelId);
    }

    getTierLimits() {
        const limits = {
            'free': {
                monthly_minutes: 30,
                max_duration: 30,
                quality: 'standard',
                voice_upload: false,
                voice_training: false
            },
            'pro': {
                monthly_minutes: 300,
                max_duration: 120,
                quality: 'high',
                voice_upload: true,
                voice_training: false
            },
            'enterprise': {
                monthly_minutes: 1800,
                max_duration: 600,
                quality: 'professional',
                voice_upload: true,
                voice_training: true
            }
        };

        return limits[this.userTier] || limits['free'];
    }

    async getUsageStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/voice/usage`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error obteniendo estadísticas de uso:', error);
        }

        // Retornar estadísticas por defecto
        return {
            tier: this.userTier,
            monthly_minutes_used: 0,
            monthly_requests_used: 0,
            limits: this.getTierLimits()
        };
    }

    // Integración con Ghost Studio
    async integrateWithGhostStudio(audioFile, transformPrompt) {
        const voiceSettings = this.extractVoiceSettings(transformPrompt);
        const text = this.extractTextFromPrompt(transformPrompt);
        
        if (!text) {
            throw new Error('No se encontró texto en el prompt de transformación');
        }

        return await this.cloneVoice(audioFile, text, voiceSettings);
    }

    extractVoiceSettings(prompt) {
        const settings = {
            speed: 1.0,
            pitch: 0,
            quality: 'high',
            model: this.getBestModel(),
            emotion: 'neutral',
            language: 'es',
            useCase: 'general'
        };

        // Detectar caso de uso para seleccionar modelo apropiado
        if (prompt.includes('convertir voz') || prompt.includes('voice conversion')) {
            settings.useCase = 'voice_conversion';
            settings.model = this.getBestModel('voice_conversion');
        } else if (prompt.includes('texto a voz') || prompt.includes('text to speech')) {
            settings.useCase = 'text_to_speech';
            settings.model = this.getBestModel('text_to_speech');
        } else if (prompt.includes('multilingüe') || prompt.includes('multilingual')) {
            settings.useCase = 'multilingual';
            settings.model = this.getBestModel('multilingual');
        } else if (prompt.includes('emocional') || prompt.includes('emotion')) {
            settings.useCase = 'emotion_control';
            settings.model = this.getBestModel('emotion_control');
        }

        // Extraer configuración de velocidad
        const speedMatch = prompt.match(/(?:velocidad|speed)[:\s]+([0-9.]+)/i);
        if (speedMatch) {
            settings.speed = Math.max(0.5, Math.min(2.0, parseFloat(speedMatch[1])));
        }

        // Extraer configuración de pitch (especialmente importante para so-VITS)
        const pitchMatch = prompt.match(/(?:pitch|tono)[:\s]+([+-]?[0-9]+)/i);
        if (pitchMatch) {
            settings.pitch = Math.max(-12, Math.min(12, parseInt(pitchMatch[1])));
        }

        // Extraer configuración de calidad
        if (prompt.includes('alta calidad') || prompt.includes('premium')) {
            settings.quality = 'premium';
        } else if (prompt.includes('profesional') || prompt.includes('studio')) {
            settings.quality = 'professional';
        } else if (prompt.includes('estándar') || prompt.includes('standard')) {
            settings.quality = 'high';
        }

        // Extraer configuración de emoción (especialmente para Bark)
        if (prompt.includes('feliz') || prompt.includes('happy') || prompt.includes('alegre')) {
            settings.emotion = 'happy';
        } else if (prompt.includes('triste') || prompt.includes('sad') || prompt.includes('melancólico')) {
            settings.emotion = 'sad';
        } else if (prompt.includes('enojado') || prompt.includes('angry') || prompt.includes('furioso')) {
            settings.emotion = 'angry';
        } else if (prompt.includes('miedo') || prompt.includes('fear') || prompt.includes('asustado')) {
            settings.emotion = 'fearful';
        } else if (prompt.includes('sorpresa') || prompt.includes('surprise') || prompt.includes('sorprendido')) {
            settings.emotion = 'surprised';
        } else if (prompt.includes('disgusto') || prompt.includes('disgust') || prompt.includes('asqueado')) {
            settings.emotion = 'disgusted';
        }

        // Extraer configuración de idioma
        if (prompt.includes('inglés') || prompt.includes('english')) {
            settings.language = 'en';
        } else if (prompt.includes('francés') || prompt.includes('french')) {
            settings.language = 'fr';
        } else if (prompt.includes('alemán') || prompt.includes('german')) {
            settings.language = 'de';
        } else if (prompt.includes('italiano') || prompt.includes('italian')) {
            settings.language = 'it';
        } else if (prompt.includes('portugués') || prompt.includes('portuguese')) {
            settings.language = 'pt';
        } else if (prompt.includes('japonés') || prompt.includes('japanese')) {
            settings.language = 'ja';
        } else if (prompt.includes('coreano') || prompt.includes('korean')) {
            settings.language = 'ko';
        } else if (prompt.includes('chino') || prompt.includes('chinese')) {
            settings.language = 'zh';
        }

        return settings;
    }

    extractTextFromPrompt(prompt) {
        // Buscar texto entre comillas
        const quotedMatch = prompt.match(/"([^"]+)"/);
        if (quotedMatch) {
            return quotedMatch[1];
        }

        // Buscar texto después de palabras clave
        const keywords = ['decir', 'hablar', 'texto', 'letra', 'say', 'speak', 'text'];
        for (const keyword of keywords) {
            const regex = new RegExp(`${keyword}[:\s]+(.+)`, 'i');
            const match = prompt.match(regex);
            if (match) {
                return match[1].trim();
            }
        }

        return null;
    }

    // Métodos de utilidad
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // Validar archivo de audio
    validateAudioFile(file) {
        const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/m4a'];
        const maxSize = 100 * 1024 * 1024; // 100MB

        if (!validTypes.includes(file.type)) {
            throw new Error('Tipo de archivo no válido. Use WAV, MP3, OGG o M4A');
        }

        if (file.size > maxSize) {
            throw new Error('Archivo demasiado grande. Máximo 100MB');
        }

        return true;
    }

    // Obtener duración del archivo de audio
    getAudioDuration(file) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.onloadedmetadata = () => resolve(audio.duration);
            audio.onerror = () => reject(new Error('Error cargando archivo de audio'));
            audio.src = URL.createObjectURL(file);
        });
    }

    // Crear URL de audio para reproducción
    createAudioUrl(audioBlob) {
        return URL.createObjectURL(audioBlob);
    }

    // Descargar archivo de audio
    downloadAudio(audioUrl, filename = 'cloned_voice.wav') {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Limpiar recursos
    destroy() {
        // Limpiar URLs de objetos creados
        // En una implementación real, aquí se limpiarían las URLs
    }
}

// Exportar para uso global
export default VoiceCloningService;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceCloningService;
} else {
    window.VoiceCloningService = VoiceCloningService;
}
