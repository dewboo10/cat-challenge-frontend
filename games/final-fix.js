const fs = require('fs');
const path = require('path');

// Final fixes for game files
function finalFixGameFile(content) {
  return content
    // Remove broken function fragments
    .replace(/\/user\?username=.*?};/gs, '')
    // Remove duplicate submitGameScore
    .replace(/function submitGameScore[\s\S]*?}/g, '')
    // Fix loadQuestion to generateQuestion
    .replace(/loadQuestion\(\)/g, 'generateQuestion()')
    // Add transition classes to buttons
    .replace(/hover:bg-blue-100 px-4 py-2 rounded"/g, 'hover:bg-blue-100 px-4 py-2 rounded transition-colors"')
    // Fix game ID in submitGameScore calls
    .replace(/submitGameScore\("[\w-]+"/g, 'submitGameScore(GAME_ID');
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
  const fixedContent = finalFixGameFile(content);
  fs.writeFileSync(filePath, fixedContent);
  
  console.log(`Fixed ${file}`);
}); 