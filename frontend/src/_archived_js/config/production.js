// Son1kVers3 Enhanced - Production Configuration
export const config = {
  // App Information
  version: '2.0.0',
  buildDate: '2024-01-15',
  environment: 'production',
  
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://son1kvers3-api.vercel.app',
    wsUrl: process.env.REACT_APP_WS_URL || 'wss://son1kvers3-api.vercel.app/ws',
    timeout: 30000,
    retries: 3
  },
  
  // Suno API Configuration
  suno: {
    baseUrl: process.env.REACT_APP_SUNO_API_URL || 'https://suno.com/api',
    apiKey: process.env.REACT_APP_SUNO_API_KEY || 'demo_key',
    timeout: 60000,
    maxRetries: 3
  },
  
  // Ollama Configuration
  ollama: {
    baseUrl: process.env.REACT_APP_OLLAMA_URL || 'http://localhost:11434',
    model: process.env.REACT_APP_OLLAMA_MODEL || 'qwen2.5:7b',
    timeout: 30000
  },
  
  // Feature Flags
  features: {
    pixelAssistant: process.env.REACT_APP_FEATURE_PIXEL_ASSISTANT === 'true',
    immersiveMode: process.env.REACT_APP_FEATURE_IMMERSIVE_MODE === 'true',
    ghostStudio: process.env.REACT_APP_FEATURE_GHOST_STUDIO === 'true',
    sanctuary: process.env.REACT_APP_FEATURE_SANCTUARY === 'true',
    adminDashboard: process.env.REACT_APP_FEATURE_ADMIN_DASHBOARD === 'true'
  },
  
  // PWA Configuration
  pwa: {
    enabled: process.env.REACT_APP_PWA_ENABLED === 'true',
    name: process.env.REACT_APP_PWA_NAME || 'Son1kVers3 Enhanced',
    shortName: process.env.REACT_APP_PWA_SHORT_NAME || 'Son1kVers3',
    themeColor: process.env.REACT_APP_PWA_THEME_COLOR || '#00ffff',
    backgroundColor: process.env.REACT_APP_PWA_BACKGROUND_COLOR || '#0a0a0a'
  },
  
  // Performance Configuration
  performance: {
    lazyLoading: process.env.REACT_APP_LAZY_LOADING === 'true',
    codeSplitting: process.env.REACT_APP_CODE_SPLITTING === 'true',
    imageOptimization: process.env.REACT_APP_IMAGE_OPTIMIZATION === 'true',
    maxConcurrentRequests: 5,
    cacheTimeout: 300000 // 5 minutes
  },
  
  // Analytics
  analytics: {
    enabled: process.env.REACT_APP_ANALYTICS_ENABLED === 'true',
    id: process.env.REACT_APP_ANALYTICS_ID || '',
    trackPageViews: true,
    trackUserInteractions: true
  },
  
  // Security
  security: {
    encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY || 'default_key_change_in_production',
    jwtSecret: process.env.REACT_APP_JWT_SECRET || 'default_secret_change_in_production',
    tokenExpiry: 3600000, // 1 hour
    refreshTokenExpiry: 86400000 // 24 hours
  },
  
  // UI Configuration
  ui: {
    theme: 'cyberpunk',
    animations: true,
    soundEffects: true,
    hapticFeedback: true,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedFormats: ['mp3', 'wav', 'flac', 'm4a', 'ogg']
  },
  
  // Development
  development: {
    enableLogging: process.env.NODE_ENV === 'development',
    enableDebugMode: process.env.NODE_ENV === 'development',
    enableHotReload: process.env.NODE_ENV === 'development'
  }
};

export default config;
