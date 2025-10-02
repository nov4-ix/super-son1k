/**
 * 🌐 Auto Translation Service - Servicio de Traducción Automática Frontend
 * Maneja la traducción automática de prompts español → inglés para Suno
 * El usuario ve prompts en español, pero se envían en inglés a Suno
 */

class AutoTranslationService {
  constructor() {
    this.baseUrl = '/api/translation';
    this.cache = new Map(); // Cache local para traducciones
    this.spanishButtons = null; // Cache de botones en español
  }

  /**
   * Traducir un prompt automáticamente para Suno
   * @param {string} spanishPrompt - Prompt en español
   * @param {boolean} showTranslation - Si mostrar la traducción al usuario (debug)
   * @returns {Promise<Object>} Resultado de la traducción
   */
  async translatePrompt(spanishPrompt, showTranslation = false) {
    try {
      // Verificar cache local primero
      const cacheKey = spanishPrompt.toLowerCase();
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await fetch(`${this.baseUrl}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: spanishPrompt,
          show_translation: showTranslation
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Guardar en cache local
      this.cache.set(cacheKey, result);
      
      return result;

    } catch (error) {
      console.error('Error traduciendo prompt:', error);
      
      // Fallback: devolver el prompt original
      return {
        success: false,
        original: spanishPrompt,
        translated: spanishPrompt,
        error: error.message
      };
    }
  }

  /**
   * Obtener solo el prompt traducido (para envío directo a Suno)
   * @param {string} spanishPrompt - Prompt en español
   * @returns {Promise<string>} Prompt traducido
   */
  async getTranslatedPrompt(spanishPrompt) {
    try {
      const result = await this.translatePrompt(spanishPrompt);
      return result.translated || spanishPrompt;
    } catch (error) {
      console.error('Error obteniendo prompt traducido:', error);
      return spanishPrompt; // Fallback
    }
  }

  /**
   * Traducir múltiples prompts en lote
   * @param {string[]} spanishPrompts - Array de prompts en español
   * @returns {Promise<Object[]>} Array de resultados de traducción
   */
  async translateBatch(spanishPrompts) {
    try {
      const response = await fetch(`${this.baseUrl}/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompts: spanishPrompts
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      
      // Guardar en cache local
      results.forEach((result, index) => {
        const cacheKey = spanishPrompts[index].toLowerCase();
        this.cache.set(cacheKey, result);
      });
      
      return results;

    } catch (error) {
      console.error('Error traduciendo prompts en lote:', error);
      
      // Fallback: devolver prompts originales
      return spanishPrompts.map(prompt => ({
        success: false,
        original: prompt,
        translated: prompt,
        error: error.message
      }));
    }
  }

  /**
   * Obtener botones de prompts predefinidos en español
   * @returns {Promise<Object[]>} Array de botones con prompts en español
   */
  async getSpanishButtons() {
    try {
      // Usar cache si está disponible
      if (this.spanishButtons) {
        return this.spanishButtons;
      }

      const response = await fetch(`${this.baseUrl}/spanish-buttons`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        this.spanishButtons = data.buttons;
        return data.buttons;
      } else {
        throw new Error('Error obteniendo botones en español');
      }

    } catch (error) {
      console.error('Error obteniendo botones en español:', error);
      
      // Fallback: botones predefinidos locales
      return this.getFallbackSpanishButtons();
    }
  }

  /**
   * Obtener sugerencias de prompts por categoría
   * @param {string} category - Categoría (generos, emociones, instrumentos, all)
   * @returns {Promise<string[]>} Array de sugerencias
   */
  async getPromptSuggestions(category = 'all') {
    try {
      const response = await fetch(`${this.baseUrl}/suggestions/${category}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.suggestions;
      } else {
        throw new Error(`Error obteniendo sugerencias para ${category}`);
      }

    } catch (error) {
      console.error('Error obteniendo sugerencias:', error);
      return [];
    }
  }

  /**
   * Procesar prompt para mostrar al usuario (español) y enviar a Suno (inglés)
   * @param {string} spanishPrompt - Prompt en español
   * @returns {Promise<Object>} Objeto con prompt para usuario y para Suno
   */
  async processPromptForUI(spanishPrompt) {
    try {
      const translation = await this.translatePrompt(spanishPrompt);
      
      return {
        userPrompt: translation.original,     // Lo que ve el usuario (español)
        sunoPrompt: translation.translated,   // Lo que se envía a Suno (inglés)
        success: translation.success,
        cached: translation.cached || false
      };

    } catch (error) {
      console.error('Error procesando prompt para UI:', error);
      
      return {
        userPrompt: spanishPrompt,
        sunoPrompt: spanishPrompt,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Agregar traducción personalizada
   * @param {string} spanish - Prompt en español
   * @param {string} english - Prompt en inglés
   * @returns {Promise<boolean>} Éxito de la operación
   */
  async addCustomTranslation(spanish, english) {
    try {
      const response = await fetch(`${this.baseUrl}/add-custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spanish, english })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Actualizar cache local
        this.cache.set(spanish.toLowerCase(), {
          success: true,
          original: spanish,
          translated: english,
          cached: true
        });
        
        return true;
      }
      
      return false;

    } catch (error) {
      console.error('Error agregando traducción personalizada:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas del servicio de traducción
   * @returns {Promise<Object>} Estadísticas del servicio
   */
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success ? data.stats : {};

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {};
    }
  }

  /**
   * Limpiar cache local
   */
  clearCache() {
    this.cache.clear();
    this.spanishButtons = null;
  }

  /**
   * Botones de fallback en caso de error del servidor
   * @returns {Object[]} Array de botones predefinidos
   */
  getFallbackSpanishButtons() {
    return [
      { text: "🎸 Rock Energético", prompt: "rock energético con guitarra eléctrica y batería potente" },
      { text: "💕 Balada Romántica", prompt: "balada romántica con piano y cuerdas emotivas" },
      { text: "🔥 Reggaeton Moderno", prompt: "reggaeton moderno con bajo potente y sintetizadores" },
      { text: "🎷 Jazz Suave", prompt: "jazz suave con saxofón y piano relajante" },
      { text: "⭐ Pop Comercial", prompt: "pop comercial pegadizo con melodía memorable" },
      { text: "🏙️ Trap Urbano", prompt: "trap urbano con sintetizadores y hi-hats rápidos" },
      { text: "🇨🇴 Cumbia Colombiana", prompt: "cumbia colombiana tradicional con acordeón" },
      { text: "💃 Salsa Brava", prompt: "salsa brava con trompetas y percusión latina" },
      { text: "🌹 Bachata Sensual", prompt: "bachata sensual con guitarra y bongos" },
      { text: "🎉 Merengue Festivo", prompt: "merengue festivo y bailable con acordeón" },
      { text: "😢 Canción Triste", prompt: "canción triste y melancólica con piano solo" },
      { text: "😊 Tema Alegre", prompt: "tema alegre y festivo con instrumentos brillantes" },
      { text: "🧘 Música Relajante", prompt: "música relajante y tranquila para meditar" },
      { text: "💪 Ritmo Motivador", prompt: "ritmo enérgico y motivador para entrenar" },
      { text: "🎸 Guitarra Acústica", prompt: "canción folk con guitarra acústica principal" },
      { text: "🎹 Piano Clásico", prompt: "pieza instrumental con piano clásico emotivo" }
    ];
  }
}

// Instancia singleton
const autoTranslationService = new AutoTranslationService();

export default autoTranslationService;
