// API Configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const baseUrl = isDevelopment ? 'http://localhost:5000' : 'https://ultimate-backend-vyse.onrender.com';

const CONFIG = {
  API_BASE: "https://ultimate-backend-vyse.onrender.com",
  AUTH_API: "https://ultimate-backend-vyse.onrender.com/auth",
  QUIZ_API: `${baseUrl}/api/quiz`,
  BRAIN_GAMES_API: "https://ultimate-backend-vyse.onrender.com/brain-games"
};

// Prevent modifications to the config object
Object.freeze(CONFIG);

// Export the config
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} 