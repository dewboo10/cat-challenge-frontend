
const API_BASE = "https://ultimate-backend-vyse.onrender.com/api/auth";

function showAuthModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

async function sendOtp() {
  const email = document.getElementById("auth-email").value.trim();
  if (!email) return alert("Enter email");

  const res = await fetch(`${API_BASE}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();

  if (data.success) {
    document.getElementById("otp-input").classList.remove("hidden");
    document.getElementById("verify-btn").classList.remove("hidden");
    document.getElementById("otp-btn").disabled = true;
    document.getElementById("otp-timer").classList.remove("hidden");

    let countdown = 60;
    const timer = document.getElementById("timer-count");
    const interval = setInterval(() => {
      countdown--;
      timer.textContent = countdown;
      if (countdown === 0) {
        clearInterval(interval);
        document.getElementById("otp-btn").disabled = false;
        document.getElementById("otp-timer").classList.add("hidden");
      }
    }, 1000);
  } else {
    alert("❌ Failed to send OTP");
  }
}

async function verifyOtp() {
  const email = document.getElementById("auth-email").value.trim();
  const otp = document.getElementById("otp-input").value.trim();
  if (!otp) return alert("Enter OTP");

  const res = await fetch(`${API_BASE}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp })
  });
  const data = await res.json();

  if (data.success) {
    alert("✅ OTP verified!");
    document.getElementById("register-final-btn").classList.remove("hidden");
    document.getElementById("otp-input").classList.add("hidden");
    document.getElementById("verify-btn").classList.add("hidden");
  } else {
    alert("❌ Invalid OTP");
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
    alert(`✅ Welcome ${data.user.username}`);
    closeAuthModal();
    location.reload();
  } else {
    alert("❌ Registration failed");
  }
}

