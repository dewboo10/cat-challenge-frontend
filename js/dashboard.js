console.log("✅ dashboard.js loaded");

// === DOMContentLoaded ===
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedExam = localStorage.getItem("selectedExam");

  // Show reminder modal for guests after 5s
  if (!user) {
    setTimeout(() => {
      const overlay = document.getElementById("auth-overlay");
      if (overlay) overlay.classList.remove("hidden");
    }, 5000);
  }

  // Redirect only if no exam selected
  if (!selectedExam) {
    window.location.href = "exam-select.html";
    return;
  }

  updateNavbarUser(user);
  updateDashboardTitle(selectedExam);
  renderCountdown(selectedExam);
  renderQuizCards(user, selectedExam);
  renderLeaderboard(user);
  showNotification();
});

function updateNavbarUser(user) {
  const navbarUser = document.getElementById("navbar-user");
  if (!navbarUser) return;

  if (user) {
    navbarUser.innerHTML = `
      <div class="relative group">
        <div class="flex items-center gap-2 cursor-pointer">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="User" class="w-6 h-6 rounded-full" />
          <span id="username-display" class="font-semibold">${user.username}</span>
        </div>
        <div class="absolute right-0 mt-2 bg-white text-black rounded shadow hidden group-hover:block group-focus-within:block z-50 px-4 py-2"
             onmouseenter="this.style.display='block'" onmouseleave="this.style.display='none'">
          <button onclick="logoutUser()" class="text-sm font-semibold text-red-500 hover:underline">Logout</button>
        </div>
      </div>`;
  } else {
    navbarUser.innerHTML = `
      <a href="index.html#register" class="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-semibold text-sm">Sign Up</a>`;
  }
}

function updateDashboardTitle(exam) {
  const titleEl = document.getElementById("dashboard-title");
  if (titleEl) {
    titleEl.textContent = `Ultimate ${exam} Prep`;
  }
}

function showNotification() {
  const notification = localStorage.getItem("siteNotification");
  const box = document.getElementById("site-notification");
  const text = document.getElementById("notification-text");
  if (notification && box && text) {
    setTimeout(() => {
      text.textContent = notification;
      box.classList.remove("hidden");
    }, 3000);
  }
}

function closeNotification() {
  document.getElementById("site-notification")?.classList.add("hidden");
}

function renderCountdown(exam) {
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

  const targetDate = new Date(`${examDates[exam] || "2025-11-24"}T00:00:00`);
  const now = new Date();
  const diffDays = Math.max(Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24)), 0);

  document.getElementById("days-left")!.textContent = `${diffDays} days`;
  const mobileCountdown = document.getElementById("days-left-mobile");
  if (mobileCountdown) mobileCountdown.textContent = `${diffDays} days`;
}

function renderQuizCards(user, exam) {
  const container = document.getElementById("quiz-grid");
  if (!container) return;

  const isPaid = JSON.parse(localStorage.getItem("isPaidUser") || "false");
  const progressKey = `progress_${exam}_${user?.username || "guest"}`;
  const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");

  container.innerHTML = "";

  for (let day = 1; day <= 100; day++) {
    const isCompleted = progress[`day${day}`]?.completed;
    const unlocked = user
      ? (day <= 5 || isPaid || progress[`day${day - 1}`]?.completed)
      : day <= 5;

    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded p-4 shadow text-center space-y-2";

    const buttonHTML = unlocked
      ? `<a href="quiz.html?exam=${exam}&day=${day}">
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

function renderLeaderboard(user) {
  const leaderboard = [
    { username: "tanya" }, { username: "anil" }, { username: "vishal" },
    { username: "deepika" }, { username: "rahul" }, { username: "manvi" },
    { username: "keshav" }, { username: "riya" }, { username: "dinesh" },
    { username: "shreya" }, { username: user?.username || "guest" }
  ];

  const unique = leaderboard.filter((entry, i, self) =>
    self.findIndex(e => e.username === entry.username) === i
  );

  const leaderboardEl = document.getElementById("leaderboard");
  const rankEl = document.getElementById("user-rank");

  if (!leaderboardEl) return;

  leaderboardEl.innerHTML = unique
    .slice(0, 10)
    .map((entry, i) => `
      <div class="flex justify-between text-sm ${entry.username === user?.username ? 'font-bold text-green-500' : ''}">
        <span>${entry.username}</span><span>#${i + 1}</span>
      </div>
    `).join("");

  if (rankEl) {
    const rank = unique.findIndex(e => e.username === user?.username) + 1;
    rankEl.textContent = `You are ranked #${rank}`;
  }
}

// === Logout Handler ===
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("isPaidUser");
  localStorage.removeItem("selectedExam");
  location.href = "index.html";
}
