// API Configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseUrl = isDevelopment ? 'http://localhost:5000' : 'https://ultimate-backend-vyse.onrender.com';

const CONFIG = {
  API_BASE: baseUrl,
  AUTH_API: `${baseUrl}/api/auth`,
  QUIZ_API: `${baseUrl}/api/quiz`,
  BRAIN_GAMES_API: `${baseUrl}/api/brain-games`
};

// Prevent modifications to the config object
Object.freeze(CONFIG);

// Export the config
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} 