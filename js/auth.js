// js/auth.js
const API_BASE = CONFIG.AUTH_API;

async function sendOtp() {
  const email = document.getElementById("auth-email")?.value.trim();
  if (!email || !email.includes("@")) return alert("Enter valid email");

  const otpBtn = document.getElementById("otp-btn");
  otpBtn.disabled = true;
  otpBtn.textContent = "Sending...";

  try {
    const res = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    
    if (!res.ok) throw await res.json();
    alert("OTP sent to your email");
    switchStep(2);
  } catch (err) {
    alert(err.error || "Failed to send OTP");
  } finally {
    otpBtn.disabled = false;
    otpBtn.textContent = "Send OTP";
  }
}

async function verifyOtp() {
  const email = document.getElementById("auth-email")?.value.trim();
  const otp = document.getElementById("otp-input")?.value.trim();

  try {
    const res = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const data = await res.json();
    if (!res.ok) throw data;
    
    localStorage.setItem("tempToken", data.tempToken);
    switchStep(3);
  } catch (err) {
    alert(err.error || "Invalid OTP");
  }
}

async function registerUser() {
  const tempToken = localStorage.getItem("tempToken");
  const username = document.getElementById("auth-username")?.value.trim();
  const password = document.getElementById("auth-password")?.value.trim();

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, tempToken })
    });

    const data = await res.json();
    if (!res.ok) throw data;
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    location.href = "dashboard.html";
  } catch (err) {
    alert(err.error || "Registration failed");
  }
}

async function loginUser() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value.trim();

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw data;
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    location.href = "dashboard.html";
  } catch (err) {
    alert(err.error || "Login failed");
  }
}