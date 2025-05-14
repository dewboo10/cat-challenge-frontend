const API_BASE = CONFIG.AUTH_API;

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  const otpBtn = document.getElementById("otp-btn");

  if (!email || !email.includes("@")) {
    return alert("Please enter a valid email address");
  }

  otpBtn.disabled = true;
  otpBtn.innerText = "Sending...";

  try {
    const res = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.success) {
      alert("✅ OTP sent to your email");
      document.getElementById("auth-email-hidden").value = email;
      switchStep(2); // move to OTP input step
      startOtpTimer();
    } else {
      alert("❌ Failed to send OTP");
    }
  } catch (err) {
    console.error("Send OTP Error:", err);
    alert("❌ Server error. Try again.");
  } finally {
    otpBtn.disabled = false;
    otpBtn.innerText = "Send OTP";
  }
}

async function verifyOtp() {
  const email = document.getElementById("auth-email-hidden").value.trim();
  const otp = document.getElementById("otp-input").value.trim();

  if (!otp || otp.length !== 6) {
    return alert("Please enter the 6-digit OTP");
  }

  try {
    const res = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.success) {
      alert("✅ OTP verified successfully!");
      switchStep(3); // move to registration step
    } else {
      alert("❌ Invalid or expired OTP");
    }
  } catch (err) {
    console.error("Verify OTP Error:", err);
    alert("❌ Server error during OTP verification");
  }
}

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  const email = document.getElementById("auth-email-hidden").value.trim();

  if (!username || !password || !email) {
    return alert("Please fill in all fields");
  }

  if (password.length < 6) {
    return alert("Password must be at least 6 characters");
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.user.username);
      alert(`🎉 Welcome ${data.user.username}! Registration successful.`);
      closeAuthModal();
      location.reload();
    } else {
      alert("❌ " + (data.error || "Registration failed"));
    }
  } catch (err) {
    console.error("Registration Error:", err);
    alert("❌ Failed to register. Try again.");
  }
}

async function loginUser() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.user.username);
      alert(`✅ Welcome back, ${data.user.username}!`);
      closeAuthModal();
      location.reload();
    } else {
      alert("❌ Invalid login credentials");
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("❌ Login failed. Try again.");
  }
}

function startOtpTimer() {
  const otpBtn = document.getElementById("otp-btn");
  const otpTimer = document.getElementById("otp-timer");
  const countEl = document.getElementById("timer-count");

  if (!otpBtn || !otpTimer || !countEl) return;

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
