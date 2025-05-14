=const API_BASE = CONFIG.AUTH_API;

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter a valid email address");
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
      body: JSON.stringify({ username, email, password })
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
