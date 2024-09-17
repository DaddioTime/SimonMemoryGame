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

const SOUND_RED = document.getElementById('sound-red');
const SOUND_GREEN = document.getElementById('sound-green');
const SOUND_BLUE = document.getElementById('sound-blue');
const SOUND_YELLOW = document.getElementById('sound-yellow');
const SOUND_FAIL = document.getElementById('sound-fail');

const BUTTON_ELEMENTS = [RED_BUTTON, GREEN_BUTTON, BLUE_BUTTON, YELLOW_BUTTON];
const SOUNDS = [SOUND_RED, SOUND_GREEN, SOUND_BLUE, SOUND_YELLOW];

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
    // Initialize audio on user interaction for iOS
    SOUNDS.forEach(sound => {
      sound.play();
      sound.pause();
      sound.currentTime = 0;
    });
    SOUND_FAIL.play();
    SOUND_FAIL.pause();
    SOUND_FAIL.currentTime = 0;

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
  playSound(button.dataset.color);
  setTimeout(() => {
    button.classList.remove('press');
  }, 300);
}

// Play sound based on color
function playSound(color) {
  const soundElement = document.getElementById(`sound-${color}`);
  soundElement.currentTime = 0;
  soundElement.play();
}

// Generate next move in the solution
function generateNextMove() {
  BANNER.innerHTML = 'Simon';
  solution.push(Math.floor(Math.random() * 4) + 1);
  timeout = Math.max(300, timeout - 25);
  animateSolution();
}

// Animate the solution sequence
function animateSolution() {
  let index = 0;
  solutionPlaying = true;
  const interval = setInterval(() => {
    const button = BUTTON_ELEMENTS[solution[index] - 1];
    playMove(button);
    index++;
    if (index >= solution.length) {
      clearInterval(interval);
      solutionPlaying = false;
    }
  }, timeout);
}

// Check the player's solution against the game-generated solution
function checkPlayerSolution() {
  const currentMoveIndex = playerSolution.length - 1;
  if (playerSolution[currentMoveIndex] !== solution[currentMoveIndex]) {
    BANNER.innerHTML = 'Sorry!';
    playFailSequence();
  } else if (playerSolution.length === solution.length) {
    score++;
    updateScore();
    BANNER.innerHTML = 'Good!';
    playerSolution = [];
    setTimeout(generateNextMove, 1000);
  }
}

// Play fail sequence
function playFailSequence() {
  solutionPlaying = true;
  SOUND_FAIL.currentTime = 0;
  SOUND_FAIL.play();
  flashButtons();
  setTimeout(() => {
    resetGame();
    solutionPlaying = false;
  }, 2000);
}

// Update the scoreboard text on the page
function updateScore() {
  SCORE_DISPLAY.innerHTML = score < 10 ? '0' + score : score;
}

// Flash all buttons
function flashButtons() {
  BUTTON_ELEMENTS.forEach(button => {
    button.classList.add('press');
    setTimeout(() => button.classList.remove('press'), 300);
  });
}