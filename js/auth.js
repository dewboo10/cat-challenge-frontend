// ✅ Auth logic (shared login + signup modal functions)

const API_BASE = "https://ultimate-backend-vyse.onrender.com/api/auth";

function showAuthModal(tab = "signup") {
  document.getElementById("auth-modal").classList.remove("hidden");
  switchTab(tab);
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function switchTab(tab) {
  const loginTab = document.getElementById("auth-login");
  const signup1 = document.getElementById("auth-step-1");
  const signup2 = document.getElementById("auth-step-2");
  const signup3 = document.getElementById("auth-step-3");

  loginTab?.classList.add("hidden");
  signup1?.classList.add("hidden");
  signup2?.classList.add("hidden");
  signup3?.classList.add("hidden");

  if (tab === "login") {
    loginTab?.classList.remove("hidden");
  } else {
    signup1?.classList.remove("hidden");
  }
}

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  if (!email) return alert("Enter valid email");
  const res = await fetch(`${API_BASE}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (data.success) {
    alert("📨 OTP sent!");
    switchStep(2);
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

function switchStep(step) {
  [1, 2, 3].forEach(s => document.getElementById(`auth-step-${s}`)?.classList.add("hidden"));
  document.getElementById(`auth-step-${step}`)?.classList.remove("hidden");
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
    switchStep(3);
  } else {
    alert("❌ " + data.error);
  }
}

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  if (!username || !password) return alert("Fill all fields");
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

async function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!username || !password) return alert("Enter both fields");
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isPaidUser", data.user.isPremium);
    alert(`✅ Welcome ${data.user.username}`);
    closeAuthModal();
    location.reload();
  } else {
    alert("❌ " + data.error);
  }
}
