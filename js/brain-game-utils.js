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

// Common game initialization
function initGame(gameId) {
  // Initialize game stats
  initGameStats(gameId);
  
  // Start the game
  if (typeof window[gameId] === 'function') {
    window[gameId]();
  } else if (typeof generateQuestion === 'function') {
    generateQuestion();
  } else if (typeof generateSeries === 'function') {
    generateSeries();
  } else if (typeof generateProblem === 'function') {
    generateProblem();
  } else if (typeof generateGraph === 'function') {
    generateGraph();
  }
  
  // Start timer
  startTimer();
  
  // Add retry button listener
  const retryBtn = document.getElementById("retryBtn");
  if (retryBtn) {
    retryBtn.addEventListener("click", restartGame);
  }
}

// Common timer functions
let timerInterval;
let timeLeft = 90;
let score = 0;

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const retryBtn = document.getElementById("retryBtn");
  
  if (questionEl) questionEl.textContent = `Time's up! Final Score: ${score}`;
  if (optionsEl) optionsEl.innerHTML = "";
  if (retryBtn) retryBtn.classList.remove("hidden");
  
  if (!isLoggedIn) {
    showAuthPopup();
  } else {
    submitGameScore(GAME_ID, score);
  }
}

function restartGame() {
  score = 0;
  timeLeft = 90;
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const retryBtn = document.getElementById("retryBtn");
  
  if (scoreEl) scoreEl.textContent = score;
  if (timerEl) timerEl.textContent = timeLeft;
  if (retryBtn) retryBtn.classList.add("hidden");
  
  if (typeof window[GAME_ID] === 'function') {
    window[GAME_ID]();
  } else if (typeof generateQuestion === 'function') {
    generateQuestion();
  } else if (typeof generateSeries === 'function') {
    generateSeries();
  } else if (typeof generateProblem === 'function') {
    generateProblem();
  } else if (typeof generateGraph === 'function') {
    generateGraph();
  }
  
  startTimer();
}

// Initialize game when script loads
window.addEventListener('load', () => {
  if (typeof GAME_ID !== 'undefined') {
    initGame(GAME_ID);
  }
}); 