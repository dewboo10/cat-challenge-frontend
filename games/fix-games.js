const fs = require('fs');
const path = require('path');

// Fix common issues in game files
function fixGameFile(content) {
  return content
    // Remove duplicate window.onload
    .replace(/window\.onload[\s\S]*?};(\s*window\.onload[\s\S]*?};)/g, '$1')
    // Remove duplicate API_BASE and auth variables
    .replace(/const API_BASE[\s\S]*?const isLoggedIn[\s\S]*?;/g, '')
    // Fix submitScore to submitGameScore
    .replace(/submitScore\(/g, 'submitGameScore(')
    // Remove duplicate fetchStats
    .replace(/function fetchStats[\s\S]*?}/g, '')
    // Fix sequence/question id mismatch
    .replace(/getElementById\("sequence"\)/g, 'getElementById("question")')
    // Fix loadPattern to generateQuestion for consistency
    .replace(/function loadPattern/g, 'function generateQuestion')
    .replace(/loadPattern\(\)/g, 'generateQuestion()')
    // Fix timeLeft to 90 seconds consistently
    .replace(/timeLeft = 180/g, 'timeLeft = 90')
    // Add missing game-container class
    .replace(/class="max-w-2xl[\s\S]*?rounded-xl text-center space-y-4"/, '$& game-container');
}

// Process all game files
const gamesDir = __dirname;
const gameFiles = fs.readdirSync(gamesDir).filter(file => 
  file.endsWith('.html') && file !== 'index.html'
);

gameFiles.forEach(file => {
  const filePath = path.join(gamesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the game file
  const fixedContent = fixGameFile(content);
  fs.writeFileSync(filePath, fixedContent);
  
  console.log(`Fixed ${file}`);
}); 