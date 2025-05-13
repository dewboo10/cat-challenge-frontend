const API_BASE = CONFIG.AUTH_API;

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  const otpBtn = document.getElementById("otp-btn");

  if (!email) return alert("Enter a valid email");
  if (!email.includes("@")) return alert("Enter a valid email address");
  
  otpBtn.disabled = true;
  otpBtn.innerText = "Sending...";

  try {
    const res = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();

    if (data.success) {
      alert("📨 OTP sent! Check your email");
      switchStep(2);
      startOtpTimer();
    } else {
      alert("❌ " + (data.error || "Failed to send OTP"));
    }
  } catch (err) {
    console.error("Send OTP Error:", err);
    alert("❌ Failed to connect to server. Please try again.");
  } finally {
    otpBtn.disabled = false;
    otpBtn.innerText = "Send OTP";
  }
}

function startOtpTimer() {
  const otpBtn = document.getElementById("otp-btn");
  const otpTimer = document.getElementById("otp-timer");
  const countEl = document.getElementById("timer-count");

  if (!otpBtn || !otpTimer || !countEl) {
    console.error("Required elements not found");
    return;
  }

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

  if (!email || !otp) {
    alert("Please fill in all fields");
    return;
  }

  if (otp.length !== 6) {
    alert("Please enter a 6-digit OTP");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.success) {
      alert("✅ OTP verified successfully!");
      switchStep(3);
      document.getElementById("auth-email-hidden").value = email;
    } else {
      alert("❌ " + (data.error || "Invalid OTP"));
    }
  } catch (err) {
    console.error("Verify OTP Error:", err);
    alert("❌ Failed to verify OTP. Please try again.");
  }
}

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  const email = document.getElementById("auth-email-hidden").value.trim();

  if (!username || !password || !email) {
    alert("Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isPaidUser", data.user.isPremium);
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
    alert("❌ Registration failed. Please try again.");
  }
}

async function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isPaidUser", data.user.isPremium);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.user.username);
      alert(`✅ Welcome back, ${data.user.username}!`);
      closeAuthModal();
      location.reload();
    } else {
      alert("❌ " + (data.error || "Invalid credentials"));
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("❌ Login failed. Please try again.");
  }
}
