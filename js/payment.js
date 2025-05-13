async function upgradeToPremium() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first.");
      return;
    }
  
    try {
        const res = await fetch(`${CONFIG.AUTH_API}/make-premium`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username }),
      });
  
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isPaidUser", true);
        alert("✅ Premium activated!");
        window.location.href = "dashboard.html";
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      alert("⚠️ Server error during upgrade.");
    }
  }
  