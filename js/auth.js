const API_BASE = "https://ultimate-backend-vyse.onrender.com/api/auth";

// === SEND OTP ===
async function sendOtpEmail() {
  const email = document.getElementById("email").value.trim();
  if (!email) return alert("Please enter a valid email.");

  try {
    const res = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      alert("📨 OTP sent to your email.");
      document.getElementById("otp-input").classList.remove("hidden");
      document.getElementById("verify-btn").classList.remove("hidden");
    } else {
      alert("❌ Failed to send OTP.");
    }
  } catch (err) {
    console.error("OTP send error:", err);
    alert("❌ Server error while sending OTP.");
  }
}

// === VERIFY OTP ===
async function verifyOtpEmail() {
  const email = document.getElementById("email").value.trim();
  const otp = document.getElementById("otp-input").value.trim();
  if (!otp) return alert("Please enter OTP.");

  try {
    const res = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (data.verified) {
      alert("✅ OTP Verified!");
      document.getElementById("register-final-btn").classList.remove("hidden");
      document.getElementById("otp-input").classList.add("hidden");
      document.getElementById("verify-btn").classList.add("hidden");
    } else {
      alert("❌ Invalid OTP.");
    }
  } catch (err) {
    console.error("OTP verify error:", err);
    alert("❌ Server error while verifying OTP.");
  }
}

// === REGISTER USER ===
async function registerUser() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password) {
    alert("❗ Please fill in all fields.");
    return;
  }

  const otpVerified = !document.getElementById("register-final-btn").classList.contains("hidden");
  if (!otpVerified) {
    alert("🔒 Please verify OTP before registering.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isPaidUser", JSON.stringify(data.user.isPremium));
      alert("✅ Account created successfully!");
      window.location.href = "exam-select.html";
    } else {
      alert(data.error || "❌ Registration failed.");
    }
  } catch (error) {
    console.error("Register error:", error);
    alert("⚠️ Server error during registration.");
  }
}

// === LOGIN USER ===
async function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("❗ Please enter both username and password.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isPaidUser", JSON.stringify(data.user.isPremium));
      alert("✅ Login successful!");
      window.location.href = "exam-select.html";
    } else {
      alert("❌ Invalid credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("⚠️ Server error during login.");
  }
}

// === LOGOUT USER ===
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("isPaidUser");
  localStorage.removeItem("selectedExam");
  window.location.href = "index.html";
}
