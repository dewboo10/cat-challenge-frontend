// FINAL performance.js

// === Apply Saved Theme ===
(function applySavedTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  })();
  
  // === Load Performance Data ===
  (function loadPerformance() {
    const selectedExam = localStorage.getItem("selectedExam") || "CAT";
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
  
    document.getElementById("performance-title").textContent = `${selectedExam} Performance`;
  
    const performanceKey = `performance_${selectedExam}_${user.username}`;
    const data = JSON.parse(localStorage.getItem(performanceKey) || "{}");
  
    if (!data || !data.totalQuizzes) {
      document.getElementById("no-data").classList.remove("hidden");
      return;
    }
  
    // Fill Stats
    document.getElementById("quizzes-completed").textContent = data.totalQuizzes || 0;
  
    const totalSectionsAttempted = ["Quant", "VARC", "LRDI"].filter(sec => data[sec]?.attempted > 0).length;
    document.getElementById("sections-attempted").textContent = totalSectionsAttempted;
  
    // Prepare Accuracy Chart Data
    const sectionLabels = ["Quant", "VARC", "LRDI"];
    const accuracies = sectionLabels.map(sec => {
      if (!data[sec] || data[sec].attempted === 0) return 0;
      return Math.round((data[sec].correct / data[sec].attempted) * 100);
    });
  
    // Find Strong/Weak Section
    let strongest = sectionLabels[0];
    let weakest = sectionLabels[0];
    accuracies.forEach((acc, idx) => {
      if (acc > accuracies[sectionLabels.indexOf(strongest)]) strongest = sectionLabels[idx];
      if (acc < accuracies[sectionLabels.indexOf(weakest)]) weakest = sectionLabels[idx];
    });
  
    console.log(`📊 Strongest Section: ${strongest}`);
    console.log(`📉 Weakest Section: ${weakest}`);
  
    // Draw Chart
    const ctx = document.getElementById("sectionChart").getContext("2d");
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sectionLabels,
        datasets: [{
          label: 'Accuracy %',
          data: accuracies,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(239, 68, 68, 0.7)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  
  })();
  