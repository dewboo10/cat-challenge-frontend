
console.log("✅ dashboard.js loaded");

// === On DOM Loaded ===
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedExam = localStorage.getItem("selectedExam");

  // Show auth overlay if not logged in
  if (!user) {
    const overlay = document.getElementById("auth-overlay");
    if (overlay) overlay.classList.remove("hidden");
    return;
  }

  // Redirect to exam-select if no exam selected
  if (!selectedExam) {
    window.location.href = "exam-select.html";
    return;
  }

  // === Update Username Display ===
  const usernameDisplay = document.getElementById("username-display");
  if (usernameDisplay) {
    usernameDisplay.textContent = user.username;
  }

  // === Update Dashboard Title ===
  const titleEl = document.getElementById("dashboard-title");
  if (titleEl) {
    titleEl.textContent = `Ultimate ${selectedExam} Prep`;
  }

  // === Notification Display ===
  const notification = localStorage.getItem("siteNotification");
  const notificationBox = document.getElementById("site-notification");
  const notificationText = document.getElementById("notification-text");

  if (notification && notificationBox && notificationText) {
    setTimeout(() => {
      notificationText.textContent = notification;
      notificationBox.classList.remove("hidden");
    }, 3000);
  }

  renderCountdown(selectedExam);
  renderQuizCards(user, selectedExam);
  renderLeaderboard(user);
});

// === Close Notification ===
function closeNotification() {
  const notificationBox = document.getElementById("site-notification");
  if (notificationBox) notificationBox.classList.add("hidden");
}

// === Countdown Renderer ===
function renderCountdown(selectedExam) {
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

  const target = new Date(`${examDates[selectedExam] || "2025-11-24"}T00:00:00`);
  const now = new Date();
  const daysLeft = Math.max(Math.ceil((target - now) / (1000 * 60 * 60 * 24)), 0);

  const el1 = document.getElementById("days-left");
  const el2 = document.getElementById("days-left-mobile");
  if (el1) el1.textContent = `${daysLeft} days`;
  if (el2) el2.textContent = `${daysLeft} days`;
}

// === Quiz Cards Renderer ===
function renderQuizCards(user, selectedExam) {
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
    card.className = "bg-white border border-gray-200 rounded p-4 shadow text-center space-y-2";

    let buttonHTML = isUnlocked
      ? `<a href="quiz.html?exam=${selectedExam}&day=${day}">
          <button class="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-semibold">
            ${isCompleted ? "Review" : "Start"}
          </button>
        </a>`
      : `<a href="payment.html">
          <button class="px-4 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-semibold">
            Buy Premium
          </button>
        </a>`;

    card.innerHTML = `
      <h3 class="font-semibold text-lg text-black">Day ${day} Quiz</h3>
      ${buttonHTML}
    `;

    container.appendChild(card);
  }
}

// === Static Leaderboard ===
function renderLeaderboard(user) {
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

  const unique = leaderboard.filter(
    (entry, i, self) => self.findIndex(e => e.username === entry.username) === i
  );

  const leaderboardContainer = document.getElementById("leaderboard-list");
  const userRankEl = document.getElementById("user-rank");

  if (!leaderboardContainer) return;

  leaderboardContainer.innerHTML = unique
    .slice(0, 10)
    .map((entry, i) => `
      <div class="flex justify-between text-sm ${entry.username === user.username ? 'font-bold text-green-500' : ''}">
        <span>${entry.username}</span>
        <span>#${i + 1}</span>
      </div>
    `).join("");

  if (userRankEl) userRankEl.textContent = `You are ranked #${unique.findIndex(e => e.username === user.username) + 1}`;
}
// === Navbar Username + Logout Dropdown ===
(function renderNavbarUser() {
  const navUser = document.getElementById("navbar-user");
  if (!navUser) return;

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    navUser.innerHTML = `
      <div class="relative group">
        <button class="flex items-center gap-2 font-semibold">
          👤 ${user.username}
          <svg class="w-4 h-4 mt-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div class="absolute right-0 mt-2 bg-white text-black shadow-md rounded hidden group-hover:block z-50 min-w-[140px] text-sm">
          <button onclick="logoutUser()" class="block w-full text-left px-4 py-2 hover:bg-blue-100">Logout</button>
        </div>
      </div>
    `;
  } else {
    navUser.innerHTML = `<a href="index.html" class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 font-semibold">Sign Up</a>`;
  }
})();
