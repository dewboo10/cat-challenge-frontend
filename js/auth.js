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
  // Show registration form
  const registrationHtml = `
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
        <input id="reg-email" type="email" placeholder="Enter your email"
          class="auth-input w-full px-10 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all">
      </div>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
        <input id="reg-username" type="text" placeholder="Choose a username"
          class="auth-input w-full px-10 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all">
      </div>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
        <input id="reg-password" type="password" placeholder="Choose a password"
          class="auth-input w-full px-10 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all">
      </div>
    </div>
    <button onclick="submitRegistration()" 
      class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
      <span>Register</span>
      <span class="text-xl">→</span>
    </button>
  `;

  document.querySelector(".auth-form").innerHTML = registrationHtml;
}

async function submitRegistration() {
  const email = document.getElementById("reg-email").value.trim();
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!email || !username || !password) {
    alert("Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    // First send OTP
    const otpRes = await fetch(`${API_BASE}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const otpData = await otpRes.json();
    
    if (otpData.success) {
      // Show OTP verification form
      const otp = prompt("Please enter the OTP sent to your email:");
      
      if (!otp) return;

      // Verify OTP
      const verifyRes = await fetch(`${API_BASE}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const verifyData = await verifyRes.json();
      
      if (verifyData.success) {
        // Complete registration
        const regRes = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email, 
            username, 
            password,
            tempToken: verifyData.tempToken 
          })
        });

        const regData = await regRes.json();
        
        if (regData.success) {
          localStorage.setItem("token", regData.token);
          localStorage.setItem("user", JSON.stringify(regData.user));
          localStorage.setItem("isLoggedIn", "true");
          
          alert("🎉 Registration successful!");
          window.location.href = "/dashboard.html";
        } else {
          alert("❌ " + (regData.message || "Registration failed"));
        }
      } else {
        alert("❌ Invalid OTP");
      }
    } else {
      alert("❌ Failed to send OTP");
    }
  } catch (err) {
    console.error("Registration Error:", err);
    alert("❌ Registration failed. Please try again.");
  }
}

async function loginUser() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

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

    const data = await res.json();
    
    if (data.success) {
      // Store user data and token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      
      alert(`✅ Welcome back, ${data.user.username}!`);
      window.location.href = "/dashboard.html";
    } else {
      alert("❌ " + (data.message || "Invalid credentials"));
    }
  } catch (err) {
    console.error("Login Error:", err);
    alert("❌ Login failed. Please try again.");
  }
}

// Add auth token to all API requests
function addAuthHeader(headers = {}) {
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
