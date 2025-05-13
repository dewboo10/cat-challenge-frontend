// js/auth.js
const API_BASE = "http://localhost:5000/api/auth";

async function handleAuth(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err) {
    console.error(err);
    alert(err.message);
    return null;
  }
}

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  if (!validateEmail(email)) return alert("Invalid email");
  
  const btn = document.getElementById("otp-btn");
  btn.disabled = true;
  btn.textContent = "Sending...";

  const result = await handleAuth("send-otp", { email });
  btn.disabled = false;
  btn.textContent = "Send OTP";
  
  if (result) {
    alert("OTP sent to your email");
    switchStep(2);
  }
}

async function verifyOtp() {
  const email = document.getElementById("auth-email").value.trim();
  const otp = document.getElementById("otp-input").value.trim();
  
  const result = await handleAuth("verify-otp", { email, otp });
  if (result) {
    localStorage.setItem("tempToken", result.tempToken);
    switchStep(3);
  }
}

async function registerUser() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value.trim();
  const tempToken = localStorage.getItem("tempToken");
  
  const result = await handleAuth("register", { username, password, tempToken });
  if (result) {
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("token", result.token);
    closeAuthModal();
    location.reload();
  }
}

async function loginUser() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  
  const result = await handleAuth("login", { email, password });
  if (result) {
    localStorage.setItem("user", JSON.stringify(result.user));
    localStorage.setItem("token", result.token);
    closeAuthModal();
    location.reload();
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}