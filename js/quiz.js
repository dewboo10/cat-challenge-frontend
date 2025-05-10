// ✅ Full Updated quiz.js with Section Switching, Review Fixes, Explanations, and Navigator Colors

// === Extract exam and day from URL ===
const urlParams = new URLSearchParams(window.location.search);
const selectedExam = urlParams.get('exam') || "CAT";
const currentDay = urlParams.get('day') || "1";

// === State Variables ===
let questions = [];
let questionsLoaded = false;
let currentSection = "Quant";
let currentQuestionIndex = 0;
let sectionTimers = { Quant: 40 * 60, VARC: 30 * 60, LRDI: 30 * 60 };
let selectedAnswers = {};
let markedForReview = new Set();
let isSubmitted = false;
let interval;
let sectionStartTime = Date.now();
let timeSpentPerSection = { Quant: 0, VARC: 0, LRDI: 0 };

// === Theme and User Setup ===
(function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("dark", theme === "dark");
})();

(function setUsername() {
  const user = JSON.parse(localStorage.getItem("user"));
  const usernameEl = document.getElementById("profile-username");
  if (user && usernameEl) usernameEl.textContent = user.username;
})();

// === Load Questions Dynamically ===
(function loadQuestions() {
  const script = document.createElement("script");
  script.src = `questions/${selectedExam}/questionsDay${currentDay}.js`;
  script.onload = () => {
    if (window.questions && Array.isArray(window.questions) && window.questions.length > 0) {
      questions = window.questions;
      questionsLoaded = true;
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        fetch(`https://ultimate-backend-vyse.onrender.com/api/quiz/attempt?username=${user.username}&exam=${selectedExam}&day=${currentDay}`)
          .then(res => res.json())
          .then(data => {
            if (data?.completed) {
              selectedAnswers = data.selectedAnswers || {};
              isSubmitted = true;
              document.getElementById("start-screen")?.classList.add("hidden");
              document.getElementById("quiz-panel")?.classList.remove("hidden");
              showReviewLayout();
            } else {
              enableStart();
            }
          })
          .catch(() => enableStart());
      } else {
        enableStart();
      }
    }
  };
  script.onerror = () => console.error("❌ Failed to load questions file");
  document.head.appendChild(script);
})();

function enableStart() {
  const btn = document.getElementById("start-btn");
  if (btn) {
    btn.disabled = false;
    btn.classList.remove("bg-gray-400");
    btn.classList.add("bg-blue-600", "hover:bg-blue-700");
  }
}

function waitForQuestionsThenStart() {
  if (!questionsLoaded || !questions.length) return alert("Questions are still loading.");
  startQuiz();
}

function startQuiz() {
  document.getElementById("start-screen")?.classList.add("hidden");
  document.getElementById("quiz-panel")?.classList.remove("hidden");
  sectionStartTime = Date.now();
  loadQuestion();
  startSectionTimer();
}

function startSectionTimer() {
  clearInterval(interval);
  const timerEl = document.getElementById("timer");
  interval = setInterval(() => {
    if (sectionTimers[currentSection] <= 0) {
      captureSectionTime();
      autoSwitchSection();
      return;
    }
    sectionTimers[currentSection]--;
    const min = Math.floor(sectionTimers[currentSection] / 60);
    const sec = sectionTimers[currentSection] % 60;
    if (timerEl) timerEl.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
  }, 1000);
}

function autoSwitchSection() {
  if (isSubmitted) return; // Prevent auto-switch in review mode

  clearInterval(interval);
  if (currentSection === "Quant") currentSection = "VARC";
  else if (currentSection === "VARC") currentSection = "LRDI";
  else return submitQuiz();

  sectionStartTime = Date.now();
  currentQuestionIndex = 0;
  loadQuestion();
  startSectionTimer();
}

function captureSectionTime() {
  const elapsed = Math.floor((Date.now() - sectionStartTime) / 1000);
  timeSpentPerSection[currentSection] += elapsed;
}

function loadQuestion() {
  const sectionQs = questions.filter(q => q.section === currentSection);
  const question = sectionQs[currentQuestionIndex];
  if (!question) return;

  document.getElementById("section-name").textContent = currentSection;
  document.getElementById("question-number").textContent = currentQuestionIndex + 1;
  document.getElementById("passage-text").textContent = question.passage || '';
  document.getElementById("question-text").textContent = question.q;
  document.getElementById("written-explanation").innerHTML = isSubmitted ? `<p>${question.explanation}</p>` : '';
  document.getElementById("video-review").innerHTML = isSubmitted && question.video
    ? `<iframe class='w-full h-48 rounded' src='${question.video}' frameborder='0' allowfullscreen></iframe>`
    : '';

  const container = document.getElementById("options-container");
  container.innerHTML = "";
  ["A", "B", "C", "D"].forEach(opt => {
    const div = document.createElement("div");
    let colorClass = "";

    if (isSubmitted) {
      const userAns = selectedAnswers[currentSection]?.[currentQuestionIndex];
      if (opt === question.correct) colorClass = "text-green-500 font-bold";
      else if (opt === userAns) colorClass = "text-red-500 font-semibold";
    }

    div.className = `flex items-center gap-2 ${colorClass}`;
    div.innerHTML = `<input type='radio' name='option' value='${opt}' ${isSubmitted ? "disabled" : ""}>
                     <label>${question.options[opt]}</label>`;
    container.appendChild(div);
  });

  const saved = selectedAnswers[currentSection]?.[currentQuestionIndex];
  if (saved) {
    const radios = document.querySelectorAll("input[name='option']");
    radios.forEach(r => r.value === saved && (r.checked = true));
  }

  updateOverview();
}

document.getElementById("options-container")?.addEventListener("change", () => saveAnswer());

function saveAnswer() {
  const selected = document.querySelector("input[name='option']:checked");
  if (!selected) return;
  if (!selectedAnswers[currentSection]) selectedAnswers[currentSection] = {};
  selectedAnswers[currentSection][currentQuestionIndex] = selected.value;
}

function clearResponse() {
  if (selectedAnswers[currentSection]) delete selectedAnswers[currentSection][currentQuestionIndex];
  loadQuestion();
}

function markAndNext() {
  markedForReview.add(`${currentSection}_${currentQuestionIndex}`);
  saveAnswer();
  goToNext();
}

function saveAndNext() {
  saveAnswer();
  goToNext();
}

function goToNext() {
  const sectionQs = questions.filter(q => q.section === currentSection);
  if (currentQuestionIndex < sectionQs.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function updateOverview() {
  const overview = document.getElementById("question-overview");
  overview.innerHTML = "";
  const sectionQs = questions.filter(q => q.section === currentSection);

  sectionQs.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "text-sm rounded w-full mb-1 px-2 py-1";
    btn.textContent = i + 1;
    const key = `${currentSection}_${i}`;

    if (isSubmitted) {
      const ans = selectedAnswers[currentSection]?.[i];
      if (ans) btn.classList.add("bg-green-100");
      else btn.classList.add("bg-gray-300");
    } else {
      if (markedForReview.has(key)) btn.classList.add("bg-yellow-200");
      else if (selectedAnswers[currentSection]?.[i]) btn.classList.add("bg-green-100");
      else btn.classList.add("bg-gray-300");
    }

    btn.onclick = () => {
      currentQuestionIndex = i;
      loadQuestion();
    };
    overview.appendChild(btn);
  });
}

function submitQuiz() {
  clearInterval(interval);
  captureSectionTime();
  if (!confirm("Are you sure you want to submit?")) return;

  isSubmitted = true;
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return alert("Login required");

  fetch("https://ultimate-backend-vyse.onrender.com/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.username,
      exam: selectedExam,
      day: currentDay,
      selectedAnswers
    })
  })
    .then(res => res.json())
    .then(() => showReviewLayout())
    .catch(err => {
      console.error("❌ Submission error:", err);
      alert("Submission failed. Try again.");
    });
}

function showReviewLayout() {
  document.getElementById("control-buttons")?.classList.add("hidden");
  document.getElementById("timer")?.classList.add("hidden");
  document.getElementById("quiz-panel")?.classList.remove("hidden");
  loadReviewQuestion();
}

function loadReviewQuestion() {
  loadQuestion();
}

function switchSection(section) {
  currentSection = section;
  currentQuestionIndex = 0;
  if (isSubmitted) loadReviewQuestion();
  else loadQuestion();
}

function quitQuiz() {
  if (confirm("Are you sure you want to quit?")) {
    window.location.href = "dashboard.html";
  }
}
