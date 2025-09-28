// API Configuration for Son1kVers3 Enhanced v2.0
// Using safe subdomains to avoid DNS conflicts with email service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Safe API endpoints (no conflicts with email service)
const SAFE_API_ENDPOINTS = {
  // Primary backend API
  backend_api: 'https://backend-api.son1kvers3.com',
  server: 'https://server.son1kvers3.com',
  app: 'https://app.son1kvers3.com',
  api_v2: 'https://api-v2.son1kvers3.com',
  son1k_api: 'https://son1k-api.son1kvers3.com',
  
  // Local development
  local: 'http://localhost:8000'
};

// Updated API endpoints to avoid DNS conflicts
const API_ENDPOINTS = {
  // Music Generation
  generateMusic: `${API_BASE_URL}/api/music/generate`,
  getMusicStatus: `${API_BASE_URL}/api/music/status`,
  downloadMusic: `${API_BASE_URL}/api/music/download`,
  
  // Voice Cloning
  cloneVoice: `${API_BASE_URL}/api/voice/clone`,
  getVoiceStatus: `${API_BASE_URL}/api/voice/status`,
  downloadVoice: `${API_BASE_URL}/api/voice/download`,
  
  // Social Media Analysis
  analyzeSocial: `${API_BASE_URL}/api/social/analyze`,
  generateContent: `${API_BASE_URL}/api/social/generate`,
  getSocialStatus: `${API_BASE_URL}/api/social/status`,
  
  // Ghost Studio
  analyzeGhost: `${API_BASE_URL}/api/ghost/analyze`,
  getGhostStatus: `${API_BASE_URL}/api/ghost/status`,
  
  // Analytics
  getAnalytics: `${API_BASE_URL}/api/analytics`,
  getMetrics: `${API_BASE_URL}/api/metrics`,
  
  // Health Check
  health: `${API_BASE_URL}/health`,
  
  // Authentication
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  refresh: `${API_BASE_URL}/api/auth/refresh`,
};

// API Helper Functions
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Specific API functions
export const generateMusic = async (prompt, options = {}) => {
  return apiRequest(API_ENDPOINTS.generateMusic, {
    method: 'POST',
    body: JSON.stringify({ prompt, ...options }),
  });
};

export const cloneVoice = async (audioFile, options = {}) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  formData.append('options', JSON.stringify(options));
  
  return apiRequest(API_ENDPOINTS.cloneVoice, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData
    },
  });
};

export const analyzeSocial = async (platform, content = {}) => {
  return apiRequest(API_ENDPOINTS.analyzeSocial, {
    method: 'POST',
    body: JSON.stringify({ platform, content }),
  });
};

export const checkHealth = async () => {
  return apiRequest(API_ENDPOINTS.health);
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  apiRequest,
  generateMusic,
  cloneVoice,
  analyzeSocial,
  checkHealth,
};
