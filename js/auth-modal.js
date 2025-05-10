

function showAuthModal(tab = "signup") {
    document.getElementById("auth-modal").classList.remove("hidden");
    switchTab(tab);
  }
  
  function closeAuthModal() {
    document.getElementById("auth-modal").classList.add("hidden");
  }
  
  function switchTab(tab) {
    const loginTab = document.getElementById("auth-login");
    const signup1 = document.getElementById("auth-step-1");
    const signup2 = document.getElementById("auth-step-2");
    const signup3 = document.getElementById("auth-step-3");
    const loginBtn = document.getElementById("tab-login");
    const signupBtn = document.getElementById("tab-signup");
  
    // Hide all
    loginTab?.classList.add("hidden");
    signup1?.classList.add("hidden");
    signup2?.classList.add("hidden");
    signup3?.classList.add("hidden");
  
    // Reset tab highlight
    loginBtn?.classList.remove("text-blue-600", "underline");
    signupBtn?.classList.remove("text-blue-600", "underline");
  
    // Show based on selected tab
    if (tab === "login") {
      loginTab?.classList.remove("hidden");
      loginBtn?.classList.add("text-blue-600", "underline");
    } else {
      signup1?.classList.remove("hidden");
      signupBtn?.classList.add("text-blue-600", "underline");
    }
  }
  
  function switchStep(step) {
    [1, 2, 3].forEach(s =>
      document.getElementById(`auth-step-${s}`)?.classList.add("hidden")
    );
    document.getElementById(`auth-step-${step}`)?.classList.remove("hidden");
  }
  