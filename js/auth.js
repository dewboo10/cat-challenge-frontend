const API_BASE = "https://ultimate-backend-vyse.onrender.com/api/auth";

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  const otpBtn = document.getElementById("otp-btn");

  if (!email) return alert("Enter a valid email");
  otpBtn.disabled = true;
  otpBtn.innerText = "Sending...";

  try {
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
  } catch (err) {
    alert("❌ Failed to connect. Try again.");
  }

  otpBtn.disabled = false;
  otpBtn.innerText = "Send OTP";
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
    switchStep(3);
    document.getElementById("auth-email-hidden").value = email;
  } else {
    alert("❌ " + data.error);
  }
}

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  const email = document.getElementById("auth-email-hidden").value.trim();

  if (!username || !password) return alert("Fill in all fields");

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email })
  });

  const data = await res.json();
  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isPaidUser", data.user.isPremium);
    localStorage.setItem("isLoggedIn", "true"); // ✅ new
    localStorage.setItem("username", data.user.username); // ✅ new
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
    localStorage.setItem("isLoggedIn", "true"); // ✅ new
    localStorage.setItem("username", data.user.username); // ✅ new
    alert(`✅ Welcome ${data.user.username}`);
    closeAuthModal();
    location.reload();
  } else {
    alert("❌ " + data.error);
  }
}
