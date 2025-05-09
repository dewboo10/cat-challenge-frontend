document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const selectedExam = localStorage.getItem("selectedExam");

  if (!selectedExam) {
    window.location.href = "exam-select.html";
    return;
  }

  updateNavbarUser(user);
  renderCountdown(selectedExam);
  renderQuizCards(user, selectedExam);
  renderLeaderboard(user);

  // Show modal if not logged in
  if (!user) {
    setTimeout(() => {
      document.getElementById("guest-modal")?.classList.remove("hidden");
    }, 5000);
  }

  // Animate counter
  let count = 4970;
  const display = document.getElementById("study-count");
  const interval = setInterval(() => {
    count++;
    display.textContent = count.toLocaleString();
    if (count >= 5000) clearInterval(interval);
  }, 20);
});
function updateNavbarUser(user) {
  const navbarUser = document.getElementById("navbar-user");
  if (!navbarUser) return;

  if (user) {
    // Logged in: show profile + logout dropdown
    navbarUser.innerHTML = `
      <div class="relative">
        <button id="user-btn" class="flex items-center gap-2 px-3 py-1 bg-white text-blue-600 rounded shadow hover:bg-blue-100 font-medium">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" class="w-6 h-6 rounded-full" />
          <span>${user.username}</span>
        </button>
        <div id="logout-menu" class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded shadow px-4 py-2 text-sm text-black hidden z-50">
          <button onclick="logoutUser()" class="hover:text-red-500">🚪 Logout</button>
        </div>
      </div>
    `;

    const userBtn = document.getElementById("user-btn");
    const menu = document.getElementById("logout-menu");

    userBtn.addEventListener("mouseenter", () => menu.classList.remove("hidden"));
    userBtn.addEventListener("mouseleave", () => setTimeout(() => {
      if (!menu.matches(':hover')) menu.classList.add("hidden");
    }, 100));
    menu.addEventListener("mouseenter", () => menu.classList.remove("hidden"));
    menu.addEventListener("mouseleave", () => menu.classList.add("hidden"));
  } else {
    // Not logged in: show sign up button (opens popup or redirects)
    navbarUser.innerHTML = `
      <button onclick="showSignupPopup()" class="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-semibold text-sm">
        Sign Up
      </button>
    `;
  }
}


function renderCountdown(exam) {
  const examDates = {
    CAT: "2025-11-24",
    IPMAT: "2025-05-20",
    SSC: "2025-06-15",
    SBI: "2025-07-10",
    SNAP: "2025-12-15",
    CMAT: "2025-08-01",
  };

  const target = new Date(`${examDates[exam] || "2025-11-24"}T00:00:00`);
  const now = new Date();
  const diff = Math.max(Math.ceil((target - now) / (1000 * 60 * 60 * 24)), 0);
  document.getElementById("days-left").textContent = `${diff} days`;
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

    card.innerHTML = `<h3 class="font-semibold text-lg text-black">Day ${day} Quiz</h3>${buttonHTML}`;
    container.appendChild(card);
  }
}

function renderLeaderboard(user) {
  const data = [
    "tanya", "anil", "vishal", "deepika", "rahul",
    "manvi", "keshav", "riya", "dinesh", "shreya"
  ];
  const leaderboard = user ? [...new Set([...data, user.username])] : data;

  const el = document.getElementById("leaderboard-list");
  if (!el) return;

  el.innerHTML = leaderboard
    .slice(0, 10)
    .map((name, i) => `
      <div class="flex justify-between text-sm ${name === user?.username ? 'font-bold text-green-500' : ''}">
        <span>${name}</span><span>#${i + 1}</span>
      </div>
    `).join("");
}

function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("isPaidUser");
  localStorage.removeItem("selectedExam");
  location.href = "index.html";
}
function showLoginPopup() {
  // If you already use auth-modal.js, make sure it has this function
  if (typeof showAuthModal === "function") {
    showAuthModal("login");
  } else {
    window.location.href = "auth.html#login";
  }
}

function showSignupPopup() {
  if (typeof showAuthModal === "function") {
    showAuthModal("signup");
  } else {
    window.location.href = "auth.html#register";
  }
}
function showLoginPopup() {
  if (typeof showAuthModal === "function") {
    showAuthModal("login");
  } else {
    window.location.href = "auth.html#login";
  }
}

function showSignupPopup() {
  if (typeof showAuthModal === "function") {
    showAuthModal("signup");
  } else {
    window.location.href = "auth.html#register";
  }
}
