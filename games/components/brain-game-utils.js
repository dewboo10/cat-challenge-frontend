// Common utilities for brain games
const API_BASE = CONFIG.BRAIN_GAMES_API;
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const username = localStorage.getItem("username");

// Score submission
function submitGameScore(gameId, score) {
  if (!isLoggedIn || !username) {
    showAuthPopup();
    return;
  }

  return fetch(`${API_BASE}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, gameId, score })
  })
  .then(res => res.json())
  .then(() => {
    fetchGameStats(gameId); // Refresh stats after submission
  })
  .catch(err => console.error("Error submitting score:", err));
}

// Stats fetching
function fetchGameStats(gameId) {
  // Always fetch leaderboard
  fetch(`${API_BASE}/top?gameId=${gameId}`)
    .then(res => res.json())
    .then(data => {
      const leaderboardEl = document.getElementById("leaderboard");
      if (leaderboardEl) {
        leaderboardEl.innerHTML = data
          .map((s, i) => `<li class="flex justify-between items-center ${s.username === username ? 'text-blue-600 font-semibold' : ''}">
            <span>${i + 1}. ${s.username}</span>
            <span>${s.score}</span>
          </li>`).join("");
      }
    })
    .catch(err => console.error("Error fetching leaderboard:", err));

  // Only fetch personal best if logged in
  if (isLoggedIn && username) {
    fetch(`${API_BASE}/user?username=${username}&gameId=${gameId}`)
      .then(res => res.json())
      .then(data => {
        const bestScoreEl = document.getElementById("best-score");
        if (bestScoreEl) {
          bestScoreEl.textContent = `🏅 Your Best Score: ${data.score || 0}`;
        }
      })
      .catch(err => console.error("Error fetching user stats:", err));
  } else {
    const bestScoreEl = document.getElementById("best-score");
    if (bestScoreEl) {
      bestScoreEl.innerHTML = `
        <button onclick="showAuthPopup()" class="text-blue-600 hover:underline">
          Sign in to track your progress
        </button>`;
    }
  }
}

// Stats section HTML template
function getStatsTemplate() {
  return `
    <div id="stats-section" class="border-t border-gray-200 pt-4 mt-4">
      <div id="best-score" class="text-sm text-green-700 mb-2"></div>
      <div class="text-sm font-semibold text-gray-700 mb-2">🏆 Top Players</div>
      <ul id="leaderboard" class="text-left text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto"></ul>
    </div>
  `;
}

// Add stats section to game
function initGameStats(gameId) {
  const container = document.querySelector('.game-container') || document.body.firstElementChild;
  if (!container.querySelector('#stats-section')) {
    container.insertAdjacentHTML('beforeend', getStatsTemplate());
  }
  fetchGameStats(gameId);
} 