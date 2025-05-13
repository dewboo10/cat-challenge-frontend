// Auth Popup Component for Brain Games
const authPopupHTML = `
<div id="auth-popup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50">
  <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 relative">
    <button onclick="closeAuthPopup()" class="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600">×</button>
    
    <div class="text-center space-y-2">
      <span class="text-4xl">🎮</span>
      <h2 class="text-xl font-bold text-gray-800">Track Your Progress!</h2>
      <p class="text-sm text-gray-600">Sign in to save your scores and compete on the leaderboard</p>
    </div>

    <div class="space-y-3">
      <button onclick="window.location.href='/auth.html'" 
        class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
        Sign In
      </button>
      <p class="text-center text-sm text-gray-600">
        New here? 
        <a href="/auth.html" class="text-blue-600 hover:underline">Create an account</a>
      </p>
    </div>
  </div>
</div>
`;

function initAuthPopup() {
  // Add popup HTML to body if not already present
  if (!document.getElementById('auth-popup')) {
    document.body.insertAdjacentHTML('beforeend', authPopupHTML);
  }
}

function showAuthPopup() {
  const popup = document.getElementById('auth-popup');
  if (popup) {
    popup.classList.remove('hidden');
  }
}

function closeAuthPopup() {
  const popup = document.getElementById('auth-popup');
  if (popup) {
    popup.classList.add('hidden');
  }
}

// Initialize popup when script loads
initAuthPopup(); 