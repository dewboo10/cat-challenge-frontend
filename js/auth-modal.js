const API_BASE = "https://ultimate-backend-vyse.onrender.com/api/auth";

function showAuthModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
  showStep(1);
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function showStep(step) {
  document.getElementById("auth-step-1").classList.add("hidden");
  document.getElementById("auth-step-2").classList.add("hidden");
  document.getElementById("auth-step-3").classList.add("hidden");
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
