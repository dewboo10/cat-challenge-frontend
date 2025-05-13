// API Configuration
const CONFIG = {
  API_BASE: "https://ultimate-backend-vyse.onrender.com",
  AUTH_API: "https://ultimate-backend-vyse.onrender.com/api/auth",
  QUIZ_API: "https://ultimate-backend-vyse.onrender.com/api/quiz",
  BRAIN_GAMES_API: "https://ultimate-backend-vyse.onrender.com/api/brain-games"
};

// Prevent modifications to the config object
Object.freeze(CONFIG);

// Export the config
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} 