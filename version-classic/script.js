// Constants and variables
const BUTTONS = document.querySelector('.buttons');
const RED_BUTTON = document.querySelector('.red');
const GREEN_BUTTON = document.querySelector('.green');
const BLUE_BUTTON = document.querySelector('.blue');
const YELLOW_BUTTON = document.querySelector('.yellow');
const START_BUTTON = document.getElementById('startgame');
const RESET_BUTTON = document.getElementById('resetgame');
const BANNER = document.querySelector('.message');
const SCORE_DISPLAY = document.querySelector('.score');

const BUTTON_ELEMENTS = [RED_BUTTON, GREEN_BUTTON, BLUE_BUTTON, YELLOW_BUTTON];
const SOUND_FAIL = 'sounds/fail.mp3';

let solution = [];
let playerSolution = [];
let score = 0;
let gameOver = true;
let solutionPlaying = false;
let timeout = 650;

// Initialize event listeners
initializeEventListeners();

// Event listeners for game buttons
function initializeEventListeners() {
  BUTTONS.addEventListener('click', handleButtonClick);
  START_BUTTON.addEventListener('click', handleStartButtonClick);
  RESET_BUTTON.addEventListener('click', handleResetButtonClick);
}

// Game button click handler
function handleButtonClick(e) {
  if (e.target.classList.contains('button') && !solutionPlaying && !gameOver) {
    playMove(e.target);
    playerSolution.push(parseInt(e.target.dataset.id));
    checkPlayerSolution();
  }
}

// Start button click handler
function handleStartButtonClick(e) {
  e.preventDefault();
  if (gameOver) {
    resetGame();
    gameOver = false;
    generateNextMove();
  }
}

// Reset button click handler
function handleResetButtonClick(e) {
  e.preventDefault();
  if (!solutionPlaying) {
    resetGame();
  }
}

// Reset the game
function resetGame() {
  BANNER.innerHTML = 'Simon';
  gameOver = true;
  solution = [];
  playerSolution = [];
  score = 0;
  timeout = 650;
  updateScore();
}

// Animate button press and play sound
function playMove(button) {
  button.classList.add('press');
  new Audio(button.dataset.sound).play();
  setTimeout(() => {
    button.classList.remove('press');
  }, 300);
}

// Generate next move in the solution
function generateNextMove() {
  BANNER.innerHTML = 'Simon';
  solution.push(Math.floor((Math.random() * 4) + 1));
  timeout -= 25;
  animateSolution();
}

// Animate the solution sequence
function animateSolution() {
  let index = 0;
  solutionPlaying = true;
  const interval = setInterval(() => {
    playMove(BUTTON_ELEMENTS[solution[index] - 1]);
    index++;
    if (index >= solution.length) {
      clearInterval(interval);
      solutionPlaying = false;
    }
  }, timeout);
}

// Check the player's solution against the game-generated solution
function checkPlayerSolution() {
  let failed = false;
  solutionPlaying = true;

  for (let i = 0; i < playerSolution.length; i++) {
    if (playerSolution[i] !== solution[i]) {
      failed = true;
      BANNER.innerHTML = 'Sorry!';
      setTimeout(() => new Audio(SOUND_FAIL).play(), 700);
      setTimeout(introAnimation, 500);
      setTimeout(checkHighScore, 3000);
      setTimeout(resetGame, 3000);
      break;
    }
  }

  if (!failed && playerSolution.length === solution.length) {
    if (arraysEqual(playerSolution, solution)) {
      score++;
      updateScore();
      BANNER.innerHTML = 'Good!';
      setTimeout(generateNextMove, 1000);
    }
    playerSolution = [];
  }

  solutionPlaying = false;
}

// Update the scoreboard text on the page
function updateScore() {
  SCORE_DISPLAY.innerHTML = score < 10 ? '0' + score : score;
}

// Intro animation (flash the board 3 times)
function introAnimation() {
  let flashes = 0;
  const flashInterval = setInterval(() => {
    flashButtons();
    flashes++;
    if (flashes >= 3) clearInterval(flashInterval);
  }, 500);
}

// Flash all buttons
function flashButtons() {
  BUTTON_ELEMENTS.forEach(button => {
    button.classList.add('press');
    setTimeout(() => button.classList.remove('press'), 300);
  });
}

// Check for a new high score
function checkHighScore() {
  // Assuming topScores is an array of high score objects sorted in descending order
  if (score > topScores[0].score) {
    const newName = window.prompt('You earned a new high score! Enter your name for the leaderboard:');
    firebase.database().ref('HighScores/1').set({ name: newName, score });
  }
}

// Compare two arrays
function arraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// Run intro animation
introAnimation();