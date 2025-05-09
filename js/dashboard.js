// === dashboard.js loaded ===
console.log("dashboard.js loaded");

// === Apply Saved Theme (default to light) ===
(function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
})();

// === Get User and Exam Selection ===
const user = JSON.parse(localStorage.getItem("user"));
const selectedExam = localStorage.getItem("selectedExam");

// === Update Navbar Auth Button ===
function updateNavbarAuth() {
  const navBtn = document.getElementById("navbar-auth-btn");
  if (!navBtn) return;

  if (user) {
    navBtn.innerHTML = `👤 ${user.username}`;
    navBtn.onclick = () => {
      if (confirm("Logout?")) logoutUser();
    };
  } else {
    navBtn.textContent = "Sign Up";
    navBtn.onclick = showAuthModal;
  }
}

// === Auth Modal Controls ===
function showAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.remove("hidden");
}
function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.add("hidden");
}

// === Guard: Redirect if missing user or exam ===
if (!user) {
  console.warn("🔒 No user found. Redirecting to login...");
  window.location.href = "index.html";
}
if (!selectedExam) {
  console.warn("⚠️ No exam selected. Redirecting to exam-select...");
  window.location.href = "exam-select.html";
}

// === Update Dashboard Title ===
const titleEl = document.getElementById("dashboard-title");
if (titleEl) titleEl.textContent = `Ultimate ${selectedExam} Prep`;

// === Display Username in Navbar ===
const usernameDisplay = document.getElementById("username-display");
if (usernameDisplay && user) usernameDisplay.textContent = user.username;

// === Show Notification ===
(function showNotification() {
  const notification = localStorage.getItem("siteNotification");
  const notificationBox = document.getElementById("site-notification");
  const notificationText = document.getElementById("notification-text");

  if (notification && notificationBox && notificationText) {
    setTimeout(() => {
      notificationText.textContent = notification;
      notificationBox.classList.remove("hidden");
    }, 3000);
  }
})();
function closeNotification() {
  document.getElementById("site-notification")?.classList.add("hidden");
}

// === Render Quiz Cards ===
function renderQuizCards() {
  const container = document.getElementById("quiz-grid");
  if (!container) return;

  const progressKey = `progress_${selectedExam}_${user.username}`;
  const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");
  const isPaid = JSON.parse(localStorage.getItem("isPaidUser") || "false");
  container.innerHTML = "";

  for (let day = 1; day <= 100; day++) {
    const isCompleted = progress[`day${day}`]?.completed;
    const isUnlocked = day <= 5 || isPaid || progress[`day${day - 1}`]?.completed;

    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded p-4 shadow text-center space-y-2 transition-all";

    const buttonHTML = isUnlocked ? `
      <a href="quiz.html?exam=${selectedExam}&day=${day}">
        <button class="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-semibold">
          ${isCompleted ? "Review" : "Start"}
        </button>
      </a>
    ` : `
      <a href="payment.html">
        <button class="px-4 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-semibold">
          Buy Premium
        </button>
      </a>
    `;

    card.innerHTML = `<h3 class="font-semibold text-lg text-black">Day ${day} Quiz</h3>${buttonHTML}`;
    container.appendChild(card);
  }
}

// === Render Countdown ===
function renderCountdown() {
  const examDates = {
    CAT: "2025-11-24",
    IPMAT: "2025-05-20",
    SSC: "2025-06-15",
    SBI: "2025-07-10",
    SNAP: "2025-12-15",
    NMAT: "2025-10-10",
    CMAT: "2025-08-01",
    BANK_PO: "2025-09-05"
  };

  const dateStr = examDates[selectedExam] || "2025-11-24";
  const daysLeft = Math.max(Math.ceil((new Date(`${dateStr}T00:00:00`) - new Date()) / 86400000), 0);

  const el1 = document.getElementById("days-left");
  const el2 = document.getElementById("days-left-mobile");
  if (el1) el1.textContent = `${daysLeft} days`;
  if (el2) el2.textContent = `${daysLeft} days`;
}

// === Render Leaderboard ===
function renderLeaderboard() {
  const leaderboardContainer = document.querySelector("#leaderboard div.text-sm");
  const userRankEl = document.getElementById("user-rank");
  if (!leaderboardContainer || !user) return;

  const leaderboard = [
    "tanya", "anil", "vishal", "deepika", "rahul",
    "manvi", "keshav", "riya", "dinesh", "shreya", user.username
  ];
  const unique = [...new Set(leaderboard)];
  const userRank = unique.indexOf(user.username) + 1;

  leaderboardContainer.innerHTML = unique.slice(0, 10).map((name, i) => `
    <div class="flex justify-between text-sm ${name === user.username ? 'font-bold text-green-400' : ''}">
      <span>${name}</span><span>${i + 1}</span>
    </div>
  `).join("");

  if (userRankEl) userRankEl.textContent = `You are ranked ${userRank}`;
}

// === Toggle Theme ===
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains("dark");
  html.classList.toggle("dark", !isDark);
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

// === Exam Switch ===
function switchExam() {
  if (confirm("Switch exam?")) {
    localStorage.removeItem("selectedExam");
    window.location.href = "exam-select.html";
  }
}

// === Logout ===
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("selectedExam");
  localStorage.removeItem("quizSubmitted");
  window.location.href = "index.html";
}

// === Load Everything ===
document.addEventListener("DOMContentLoaded", () => {
  renderQuizCards();
  renderCountdown();
  renderLeaderboard();
  updateNavbarAuth();
});
