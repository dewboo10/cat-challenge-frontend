// FINAL UPDATED auth.js with Backend Integration

const API_BASE = "https://ultimate-backend-vyse.onrender.com/api/auth";
// Replace with your deployed backend URL

// === LOGIN ===
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
      window.location.href = "dashboard.html";
    } else {
      alert("❌ Invalid credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("⚠️ Server error during login.");
  }
}

// === REGISTER ===
async function registerUser() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password) {
    alert("❗ Please fill in all fields.");
    return;
  }

  const otpVerified = document.getElementById("register-final-btn").classList.contains("hidden") === false;
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
      window.location.href = "dashboard.html";
    } else {
      alert(data.error || "❌ Registration failed.");
    }
  } catch (error) {
    console.error("Register error:", error);
    alert("⚠️ Server error during registration.");
  }
}

// === LOGOUT ===
function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("isPaidUser");
  localStorage.removeItem("selectedExam");
  window.location.href = "index.html";
}
