// ✅ Fully Updated Dashboard.js with Backend Review Check and Guest Fallback + Auth Modal Logic

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

  if (!user) {
    setTimeout(() => {
      document.getElementById("guest-modal")?.classList.remove("hidden");
    }, 5000);
  }

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
      if (!menu.matches(":hover")) menu.classList.add("hidden");
    }, 100));
    menu.addEventListener("mouseenter", () => menu.classList.remove("hidden"));
    menu.addEventListener("mouseleave", () => menu.classList.add("hidden"));
  } else {
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
  container.innerHTML = "";

  const isPaid = JSON.parse(localStorage.getItem("isPaidUser") || "false");

  for (let day = 1; day <= 100; day++) {
    const card = document.createElement("div");
    card.className = "bg-white border border-gray-200 rounded p-4 shadow text-center space-y-2";
    const title = `<h3 class='font-semibold text-lg text-black'>Day ${day} Quiz</h3>`;

    if (!isPaid && day > 5) {
      card.innerHTML = `${title}<a href='payment.html'><button class='px-4 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-semibold'>Buy Premium</button></a>`;
      container.appendChild(card);
      continue;
    }

    if (user) {
      fetch(`${CONFIG.QUIZ_API}/attempt?username=${user.username}&exam=${exam}&day=${day}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          const completed = data?.completed;
          const btnText = completed ? "Review" : "Start";
          const btnClass = completed ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700";
          card.innerHTML = `${title}<a href='quiz.html?exam=${exam}&day=${day}'><button class='px-4 py-1 ${btnClass} text-white rounded text-sm font-semibold'>${btnText}</button></a>`;
        })
        .catch(() => {
          card.innerHTML = `${title}<a href='quiz.html?exam=${exam}&day=${day}'><button class='px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold'>Start</button></a>`;
        });
    } else {
      // Guest fallback (only allow Day 1–5)
      card.innerHTML = `${title}<a href='quiz.html?exam=${exam}&day=${day}'><button class='px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold'>Start</button></a>`;
    }

    container.appendChild(card);
  }
}

function renderLeaderboard(user) {
  const data = ["tanya", "anil", "vishal", "deepika", "rahul", "manvi", "keshav", "riya", "dinesh", "shreya"];
  const leaderboard = user ? [...new Set([...data, user.username])] : data;
  const el = document.getElementById("leaderboard-list");
  if (!el) return;
  el.innerHTML = leaderboard
    .slice(0, 10)
    .map((name, i) => `
      <div class="flex justify-between text-sm ${name === user?.username ? 'font-bold text-green-500' : ''}">
        <span>${name}</span><span>${i + 1}</span>
      </div>
    `).join("");
}

function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("isPaidUser");
  localStorage.removeItem("selectedExam");
  location.href = "index.html";
}

// === Auth Modal Flow ===

function showLoginPopup() { showAuthModal(); }
function showSignupPopup() { showAuthModal(); }

function showAuthModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
  showStep(1);
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function showStep(step) {
  [1, 2, 3].forEach(s => document.getElementById(`auth-step-${s}`).classList.add("hidden"));
  document.getElementById(`auth-step-${step}`).classList.remove("hidden");
}

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  if (!email) return alert("Enter a valid email");
  const res = await fetch(`${API_BASE}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (data.success) {
    alert("📨 OTP sent!");
    showStep(2);
    startOtpTimer();
  } else {
    alert("❌ " + data.error);
  }
}

function startOtpTimer() {
  const otpBtn = document.getElementById("otp-btn");
  const otpTimer = document.getElementById("otp-timer");
  const countEl = document.getElementById("timer-count");
  otpBtn.disabled = true;
  otpTimer.classList.remove("hidden");
  let time = 60;
  const interval = setInterval(() => {
    time--;
    countEl.textContent = time;
    if (time <= 0) {
      clearInterval(interval);
      otpBtn.disabled = false;
      otpTimer.classList.add("hidden");
    }
  }, 1000);
}

async function verifyOtp() {
  const email = document.getElementById("auth-email").value.trim();
  const otp = document.getElementById("otp-input").value.trim();
  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json();
  if (data.success) {
    alert("✅ OTP verified!");
    showStep(3);
  } else {
    alert("❌ " + data.error);
  }
}

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  if (!username || !password) return alert("Fill in all fields");
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isPaidUser", data.user.isPremium);
    alert(`🎉 Welcome ${data.user.username}`);
    closeAuthModal();
    location.reload();
  } else {
    alert("❌ " + data.error);
  }
}
