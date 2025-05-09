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

// === Check User and Exam Selection ===
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
if (titleEl) {
  titleEl.textContent = `Ultimate ${selectedExam} Prep`;
}

// === Display Username in Navbar ===
const usernameDisplay = document.getElementById("username-display");
if (usernameDisplay) {
  usernameDisplay.textContent = user.username;
}

// === Show Notification if Any ===
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
  const notificationBox = document.getElementById("site-notification");
  if (notificationBox) notificationBox.classList.add("hidden");
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

    let buttonHTML = "";
    if (isUnlocked) {
      buttonHTML = `
        <a href="quiz.html?exam=${selectedExam}&day=${day}">
          <button class="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-semibold">
            ${isCompleted ? "Review" : "Start"}
          </button>
        </a>
      `;
    } else {
      buttonHTML = `
        <a href="payment.html">
          <button class="px-4 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-semibold">
            Buy Premium
          </button>
        </a>
      `;
    }

    card.innerHTML = `
      <h3 class="font-semibold text-lg text-black">Day ${day} Quiz</h3>
      ${buttonHTML}
    `;

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

  const targetDateStr = examDates[selectedExam] || "2025-11-24";
  const targetDate = new Date(`${targetDateStr}T00:00:00`);
  const now = new Date();
  const diffTime = targetDate - now;
  const diffDays = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);

  const countdownEl = document.getElementById("days-left");
  if (countdownEl) {
    countdownEl.textContent = `${diffDays} days`;
  }

  const countdownElMobile = document.getElementById("days-left-mobile");
  if (countdownElMobile) {
    countdownElMobile.textContent = `${diffDays} days`;
  }
}

// === Render Leaderboard (static) ===
function renderLeaderboard() {
  const leaderboardContainer = document.querySelector("#leaderboard div.text-sm");
  const userRankEl = document.getElementById("user-rank");

  if (!leaderboardContainer || !user) return;

  const leaderboard = [
    { username: "tanya" },
    { username: "anil" },
    { username: "vishal" },
    { username: "deepika" },
    { username: "rahul" },
    { username: "manvi" },
    { username: "keshav" },
    { username: "riya" },
    { username: "dinesh" },
    { username: "shreya" },
    { username: user.username }
  ];

  const uniqueLeaderboard = leaderboard.filter(
    (entry, index, self) => self.findIndex(e => e.username === entry.username) === index
  );

  const userIndex = uniqueLeaderboard.findIndex(entry => entry.username === user.username);
  const userRank = userIndex + 1;

  leaderboardContainer.innerHTML = uniqueLeaderboard
    .slice(0, 10)
    .map((entry, index) => `
      <div class="flex justify-between text-sm ${entry.username === user.username ? 'font-bold text-green-400' : ''}">
        <span>${entry.username}</span>
        <span>${index + 1}</span>
      </div>
    `).join("");

  if (userRankEl) {
    userRankEl.textContent = `You are ranked ${userRank}`;
  }
}

// === Theme Toggle ===
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.classList.contains("dark");

  if (isDark) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
}

// === Switch Exam ===
function switchExam() {
  if (confirm("⚡ Are you sure you want to switch exam?")) {
    localStorage.removeItem("selectedExam");
    window.location.href = "exam-select.html";
  }
}

// === Logout User ===
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("selectedExam");
  localStorage.removeItem("quizSubmitted");
  window.location.href = "index.html";
}

// === On Load ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Dashboard loaded for", selectedExam);
  renderQuizCards();
  renderCountdown();
  renderLeaderboard();
});
