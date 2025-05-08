// FINAL FIXED admin.js with DOM Ready + Clean Logout + Admin Refresh

// === Admin Login Check ===
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("adminLoggedIn") === "true") showAdminDashboard();
});

function loginAdmin() {
  const username = document.getElementById("admin-username").value.trim();
  const password = document.getElementById("admin-password").value.trim();
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("adminLoggedIn", "true");
    showAdminDashboard();
    showToast("🔓 Admin login successful!", "success");
  } else {
    showToast("❌ Invalid Admin Credentials", "error");
  }
}

function logoutAdmin() {
  localStorage.removeItem("adminLoggedIn");
  document.getElementById("admin-content").classList.add("hidden");
  document.getElementById("login-modal").classList.remove("hidden");
}

function showAdminDashboard() {
  document.getElementById("login-modal").classList.add("hidden");
  document.getElementById("admin-content").classList.remove("hidden");
  renderAdminStats();
  renderUsersTable();
  renderNotificationList();
}

function renderAdminStats() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  document.getElementById("total-users").textContent = users.length;
  let totalQuizzesCompleted = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("progress_")) {
      try {
        const progress = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(progress)) {
          totalQuizzesCompleted += progress.length;
        } else {
          for (const val of Object.values(progress)) {
            if (val === true || (val && typeof val === "object" && val.completed)) {
              totalQuizzesCompleted++;
            }
          }
        }
      } catch {}
    }
  }
  document.getElementById("total-quizzes").textContent = totalQuizzesCompleted;
}

function renderUsersTable() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const tbody = document.getElementById("users-table-body");
  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    const isPremium = localStorage.getItem(`isPaidUser_${user.username}`) === "true";
    let actionsHtml = isPremium
      ? `<span class='text-xs font-semibold text-green-600 mr-2'>Premium</span>`
      : `<button onclick="approvePremium('${user.username}')" class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mr-2">Make Premium</button>`;
    actionsHtml += `<button onclick="resetUserProgress('${user.username}')" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">Reset</button>`;
    tr.innerHTML = `
      <td class="py-2">${user.username}</td>
      <td class="py-2">${user.password}</td>
      <td class="py-2">${actionsHtml}</td>
    `;
    tbody.appendChild(tr);
  });
}

function approvePremium(username) {
  if (confirm(`Make '${username}' a Premium user?`)) {
    localStorage.setItem(`isPaidUser_${username}`, "true");
    showToast(`✅ ${username} is now Premium.`, "success");
    renderUsersTable();
  }
}

function resetUserProgress(username) {
  if (confirm(`Reset progress for '${username}'?`)) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("progress_") && key.endsWith(username)) {
        localStorage.removeItem(key);
      }
    }
    showToast(`✅ Progress reset for '${username}'`, "success");
    renderAdminStats();
  }
}

function sendNotification() {
  const message = document.getElementById("notification-input").value.trim();
  if (!message) return showToast("❗ Enter message", "warning");
  const all = JSON.parse(localStorage.getItem("siteNotifications") || "[]");
  all.push(message);
  localStorage.setItem("siteNotifications", JSON.stringify(all));
  showToast("✅ Notification sent!", "success");
  document.getElementById("notification-input").value = "";
  renderNotificationList();
}

function renderNotificationList() {
  const list = document.getElementById("notification-list");
  const notifications = JSON.parse(localStorage.getItem("siteNotifications") || "[]");
  list.innerHTML = "";
  if (notifications.length === 0) {
    list.innerHTML = "<li class='text-gray-500'>No active notifications.</li>";
    return;
  }
  notifications.forEach((msg, i) => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center bg-blue-100 dark:bg-blue-800 text-black dark:text-white px-4 py-2 rounded";
    li.innerHTML = `
      <span>${msg}</span>
      <button onclick="deleteNotification(${i})" class="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteNotification(index) {
  const notifications = JSON.parse(localStorage.getItem("siteNotifications") || "[]");
  notifications.splice(index, 1);
  localStorage.setItem("siteNotifications", JSON.stringify(notifications));
  renderNotificationList();
  showToast("🗑️ Notification deleted.", "success");
}

function clearAllNotifications() {
  if (confirm("⚠️ Clear ALL notifications?")) {
    localStorage.removeItem("siteNotifications");
    renderNotificationList();
    showToast("🧹 All notifications cleared.", "success");
  }
}

function resetAllProgress() {
  if (confirm("Reset ALL users' progress?")) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("progress_")) localStorage.removeItem(key);
    }
    showToast("✅ All progress reset.", "success");
    renderAdminStats();
  }
}

function showToast(msg, type = "info") {
  const toast = document.createElement("div");
  toast.className = `fixed bottom-4 right-4 z-50 px-4 py-2 rounded shadow-md text-white text-sm font-bold ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-yellow-500"
  }`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-300");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
