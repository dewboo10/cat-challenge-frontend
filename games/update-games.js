const fs = require('fs');
const path = require('path');

// Template for the updated game structure
function getUpdatedGameTemplate(gameTitle, gameId, originalContent) {
  // Extract the game-specific content and logic
  const scriptContent = originalContent.match(/<script>([\s\S]*?)<\/script>/)?.[1] || '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${gameTitle} – BrainGames</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="/js/config.js"></script>
  <script src="components/auth-popup.js"></script>
  <script src="components/brain-game-utils.js"></script>
</head>
<body class="bg-white text-gray-800 min-h-screen flex items-center justify-center p-4">
<div class="max-w-2xl w-full bg-white shadow-xl p-6 border border-blue-200 rounded-xl text-center space-y-4 game-container">
  <h1 class="text-2xl font-bold text-blue-700">${gameTitle}</h1>
  <p>⏱ Time Left: <span id="timer">90</span>s | 🎯 Score: <span id="score">0</span></p>
  <p id="question" class="text-2xl font-semibold">Loading...</p>
  ${originalContent.includes('options') ? '<div id="options" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>' : ''}
  <button id="retryBtn" class="bg-green-600 text-white px-4 py-2 rounded font-semibold hidden">Retry</button>
</div>

<script>
const GAME_ID = '${gameId}';
${scriptContent}

window.onload = () => {
  initGameStats(GAME_ID);
  ${scriptContent.includes('generateQuestion') ? 'generateQuestion();' : 'loadQuestion();'}
  startTimer();
  document.getElementById("retryBtn").addEventListener("click", restartGame);
};
</script>
</body>
</html>`;
}

// Process all game files
const gamesDir = __dirname;
const gameFiles = fs.readdirSync(gamesDir).filter(file => 
  file.endsWith('.html') && file !== 'index.html'
);

gameFiles.forEach(file => {
  const filePath = path.join(gamesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract game title from filename
  const gameTitle = file
    .replace('.html', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Create game ID from filename
  const gameId = file.replace('.html', '');
  
  // Update the game file
  const updatedContent = getUpdatedGameTemplate(gameTitle, gameId, content);
  fs.writeFileSync(filePath, updatedContent);
  
  console.log(`Updated ${file}`);
}); 