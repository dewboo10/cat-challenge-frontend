// FINAL UPGRADED quiz.js with Performance Tracking

// === Extract exam and day from URL ===
const urlParams = new URLSearchParams(window.location.search);
const selectedExam = urlParams.get('exam') || "CAT";
const currentDay = urlParams.get('day') || "1";

// === State Variables ===
let questions = [];
let currentSection = "Quant";
let currentQuestionIndex = 0;
let sectionTimers = { Quant: 40 * 60, VARC: 30 * 60, LRDI: 30 * 60 };
let selectedAnswers = {};
let markedForReview = new Set();
let isSubmitted = false;
let interval;
let sectionStartTime = Date.now();
let timeSpentPerSection = { Quant: 0, VARC: 0, LRDI: 0 };

// === Apply Saved Theme ===
(function applySavedTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("dark", theme === "dark");
})();

// === Set Username on Quiz Panel ===
(function setUsername() {
  const user = JSON.parse(localStorage.getItem("user"));
  const usernameEl = document.getElementById('profile-username');
  if (user && usernameEl) {
    usernameEl.textContent = user.username;
  }
})();

(function loadQuestions() {
  const script = document.createElement('script');
  script.src = `questions/${selectedExam}/questionsDay${currentDay}.js`;
  script.onload = () => {
    console.log("✅ Questions loaded for", selectedExam, "Day", currentDay);

    if (window.questions && Array.isArray(window.questions) && window.questions.length > 0) {
      questions = window.questions;
      questionsLoaded = true;

      const btn = document.getElementById("start-btn");
      if (btn) {
        btn.disabled = false;
        btn.classList.remove("bg-gray-400");
        btn.classList.add("bg-blue-600", "hover:bg-blue-700");
      }
    } else {
      console.error("❌ window.questions is not properly loaded.");
    }
  };
  script.onerror = () => {
    console.error("❌ Failed to load questions script:", script.src);
  };
  document.head.appendChild(script);
})();

function waitForQuestionsThenStart() {
  if (!questionsLoaded || !questions.length) {
    alert("Questions are still loading. Please wait...");
    return;
  }
  startQuiz();
}

// === Start Quiz ===
function startQuiz() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-panel").classList.remove("hidden");
  sectionStartTime = Date.now();
  loadQuestion();
  startSectionTimer();
}

// === Timer Management ===
function startSectionTimer() {
  clearInterval(interval);
  const timerEl = document.getElementById("timer");

  interval = setInterval(() => {
    if (!sectionTimers[currentSection]) sectionTimers[currentSection] = 0;
    if (sectionTimers[currentSection] <= 0) {
      captureSectionTime();
      autoSwitchSection();
      return;
    }

    sectionTimers[currentSection]--;
    const min = Math.floor(sectionTimers[currentSection] / 60);
    const sec = sectionTimers[currentSection] % 60;
    if (timerEl) {
      timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function autoSwitchSection() {
  clearInterval(interval);
  if (currentSection === "Quant") currentSection = "VARC";
  else if (currentSection === "VARC") currentSection = "LRDI";
  else submitQuiz();

  sectionStartTime = Date.now();
  currentQuestionIndex = 0;
  loadQuestion();
  startSectionTimer();
}

function captureSectionTime() {
  const elapsed = Math.floor((Date.now() - sectionStartTime) / 1000);
  timeSpentPerSection[currentSection] += elapsed;
}

// === Load Current Question ===
function loadQuestion() {
  const sectionQs = questions.filter(q => q.section === currentSection);
  const question = sectionQs[currentQuestionIndex];
  if (!question) return;

  document.getElementById('section-name').textContent = currentSection;
  document.getElementById('question-number').textContent = currentQuestionIndex + 1;
  document.getElementById('passage-text').textContent = question.passage || '';
  document.getElementById('video-review').innerHTML = '';
  document.getElementById('question-text').textContent = question.q;
  document.getElementById('written-explanation').innerHTML = '';

  const container = document.getElementById('options-container');
  container.innerHTML = "";

  ["A", "B", "C", "D"].forEach(opt => {
    const div = document.createElement('div');
    div.className = "flex items-center gap-2";
    div.innerHTML = `
      <input type="radio" name="option" value="${opt}">
      <label>${question.options[opt]}</label>
      `;
    container.appendChild(div);
  });

  updateOverview();
}

// === Update Navigator Overview ===
function updateOverview() {
  const overview = document.getElementById('question-overview');
  overview.innerHTML = "";
  const sectionQs = questions.filter(q => q.section === currentSection);

  sectionQs.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = "text-sm rounded w-full mb-1 px-2 py-1";
    btn.textContent = i + 1;
    btn.onclick = () => {
      currentQuestionIndex = i;
      loadQuestion();
    };
    overview.appendChild(btn);
  });
}

// === Answer Handling ===
function saveAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
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

// === Submit Quiz ===
function submitQuiz() {
  clearInterval(interval);
  captureSectionTime();
  if (!confirm("Are you sure you want to submit?")) return;

  isSubmitted = true;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Login required to submit.");
    return;
  }

  // Submit to backend
  fetch("https://ultimate-backend-vyse.onrender.com/api/quiz/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.username,
      exam: selectedExam,
      day: currentDay,
      selectedAnswers,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showReviewLayout(); // load review after successful submit
    })
    .catch((err) => {
      console.error("❌ Submission error:", err);
      alert("Submission failed. Try again.");
    });
}

function unlockNextDay(progressKey) {
  const progress = JSON.parse(localStorage.getItem(progressKey) || "{}");
  const nextDay = parseInt(currentDay) + 1;
  if (!progress[`day${nextDay}`]) {
    progress[`day${nextDay}`] = { completed: false };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }
}

// === Review Layout ===
function showReviewLayout() {
  document.getElementById('control-buttons')?.classList.add('hidden');
  document.getElementById('timer')?.classList.add('hidden');
  loadReviewQuestion();
}

function loadReviewQuestion() {
  const sectionQs = questions.filter(q => q.section === currentSection);
  const question = sectionQs[currentQuestionIndex];
  if (!question) return;

  document.getElementById('section-name').textContent = currentSection;
  document.getElementById('question-number').textContent = currentQuestionIndex + 1;
  document.getElementById('passage-text').textContent = question.passage || '';
  document.getElementById('video-review').innerHTML = question.video ? `<iframe class='w-full h-48 rounded' src='${question.video}' frameborder='0' allowfullscreen></iframe>` : '';
  document.getElementById('question-text').textContent = question.q;
  document.getElementById('written-explanation').innerHTML = `<p class='text-sm'>${question.explanation}</p>`;

  const container = document.getElementById('options-container');
  container.innerHTML = "";

  ["A", "B", "C", "D"].forEach(opt => {
    const div = document.createElement('div');
    div.className = "flex items-center gap-2";

    let colorClass = "";
    if (question.correct === opt) {
      colorClass = "text-green-500 font-bold";
    } else if (selectedAnswers[currentSection]?.[currentQuestionIndex] === opt) {
      colorClass = "text-red-500 font-semibold";
    }

    div.innerHTML = `<input type='radio' disabled><label class='${colorClass}'>${question.options[opt]}</label>`;
    container.appendChild(div);
  });

  updateOverview();
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
