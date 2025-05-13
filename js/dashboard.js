// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  checkAuthState();
  renderCountdown();
});

function checkAuthState() {
  const user = JSON.parse(localStorage.getItem("user"));
  const authButtons = document.getElementById("auth-buttons");
  const userSection = document.getElementById("user-section");
  
  if (user) {
    authButtons.style.display = "none";
    userSection.style.display = "block";
    document.getElementById("username-display").textContent = user.username;
    renderQuizCards(true);
  } else {
    authButtons.style.display = "flex";
    userSection.style.display = "none";
    renderQuizCards(false);
    setTimeout(() => {
      document.getElementById("guest-modal").classList.remove("hidden");
    }, 3000);
  }
}

function renderQuizCards(isLoggedIn) {
  const container = document.getElementById("quiz-grid");
  container.innerHTML = "";

  const maxDays = isLoggedIn ? 100 : 5;
  
  for (let day = 1; day <= maxDays; day++) {
    const card = document.createElement("div");
    card.className = "quiz-card";
    card.innerHTML = `
      <h3>Day ${day}</h3>
      ${!isLoggedIn && day > 5 ? 
        '<button class="locked" onclick="showAuthModal()">🔒</button>' : 
        `<button onclick="startQuiz(${day})">Start</button>`}
    `;
    container.appendChild(card);
  }
}

function showAuthModal(tab = "signup") {
  document.getElementById("auth-modal").classList.remove("hidden");
  switchTab(tab);
}

function startQuiz(day) {
  const exam = localStorage.getItem("selectedExam") || "CAT";
  window.location.href = `quiz.html?exam=${exam}&day=${day}`;
}