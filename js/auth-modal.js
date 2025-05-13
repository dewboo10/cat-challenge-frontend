// js/auth-modal.js
function showAuthModal(tab = "signup") {
  const modal = document.getElementById("auth-modal");
  modal.classList.remove("hidden");
  switchTab(tab);
}

function closeAuthModal() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function switchTab(tab) {
  // Hide all tabs first
  document.getElementById("auth-login").classList.add("hidden");
  document.getElementById("auth-step-1").classList.add("hidden");
  
  // Show selected tab
  if (tab === "login") {
    document.getElementById("auth-login").classList.remove("hidden");
    document.getElementById("tab-login").classList.add("active");
    document.getElementById("tab-signup").classList.remove("active");
  } else {
    document.getElementById("auth-step-1").classList.remove("hidden");
    document.getElementById("tab-signup").classList.add("active");
    document.getElementById("tab-login").classList.remove("active");
  }
}

function switchStep(step) {
  [1, 2, 3].forEach(s => {
    document.getElementById(`auth-step-${s}`).classList.add("hidden");
  });
  document.getElementById(`auth-step-${step}`).classList.remove("hidden");
}