function applySavedTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
  }
  applySavedTheme();
  