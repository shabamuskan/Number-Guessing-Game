// Game state
let targetNumber;
let attempts;
let gameOver;
let currentDifficulty = 'medium';
let maxNumber = 100;
let guesses = [];
let bestScore = localStorage.getItem('bestScore') || null;
const MAX_ATTEMPTS = 7;

// DOM elements
const guessInput = document.getElementById('guess-input');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');
const remainingDisplay = document.getElementById('remaining');
const bestScoreDisplay = document.getElementById('best-score');
const rangeDisplay = document.getElementById('range-display');
const attemptsWarning = document.getElementById('attempts-warning');
const newGameBtn = document.getElementById('new-game-btn');
const guessHistory = document.getElementById('guess-history');
const guessList = document.getElementById('guess-list');

// Initialize game
function initGame() {
    if (bestScore) {
        bestScoreDisplay.textContent = bestScore;
    }
    newGame();
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Update active button
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Set max number based on difficulty
    switch (difficulty) {
        case 'easy':
            maxNumber = 50;
            break;
        case 'medium':
            maxNumber = 100;
            break;
        case 'hard':
            maxNumber = 200;
            break;
    }
    
    guessInput.max = maxNumber;
    rangeDisplay.textContent = `Guess a number between 1 and ${maxNumber}`;
    newGame();
}

function newGame() {
    targetNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    gameOver = false;
    guesses = [];
    
    updateDisplay();
    feedback.textContent = `Make your first guess! You have ${MAX_ATTEMPTS} attempts.`;
    feedback.className = 'feedback neutral';
    guessInput.value = '';
    guessInput.disabled = false;
    newGameBtn.style.display = 'none';
    guessHistory.style.display = 'none';
    
    // Remove animations
    document.querySelector('.game-container').classList.remove('celebration', 'game-over-shake');
}

function makeGuess() {
    if (gameOver) return;
    
    const guess = parseInt(guessInput.value);
    
    // Validate input
    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
        feedback.textContent = `Please enter a number between 1 and ${maxNumber}`;
        feedback.className = 'feedback neutral';
        return;
    }
    
    attempts++;
    guesses.push(guess);
    updateDisplay();
    updateGuessHistory();
    
    if (guess === targetNumber) {
        // Correct guess!
        feedback.textContent = `🎉 Congratulations! You guessed it in ${attempts} attempts!`;
        feedback.className = 'feedback correct';
        gameOver = true;
        guessInput.disabled = true;
        newGameBtn.style.display = 'inline-block';
        
        // Add celebration animation
        document.querySelector('.game-container').classList.add('celebration');
        
        // Update best score
        const currentScore = calculateScore();
        if (!bestScore || currentScore > bestScore) {
            bestScore = currentScore;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
        
    } else if (attempts >= MAX_ATTEMPTS) {
        // Game over - no more attempts
        feedback.textContent = `💀 Game Over! The number was ${targetNumber}. Better luck next time!`;
        feedback.className = 'feedback game-over';
        gameOver = true;
        guessInput.disabled = true;
        newGameBtn.style.display = 'inline-block';
        
        // Add shake animation
        document.querySelector('.game-container').classList.add('game-over-shake');
        
    } else if (guess < targetNumber) {
        const remaining = MAX_ATTEMPTS - attempts;
        feedback.textContent = `📈 Too low! Try a higher number. ${remaining} attempts left.`;
        feedback.className = 'feedback too-low';
    } else {
        const remaining = MAX_ATTEMPTS - attempts;
        feedback.textContent = `📉 Too high! Try a lower number. ${remaining} attempts left.`;
        feedback.className = 'feedback too-high';
    }
    
    guessInput.value = '';
    guessInput.focus();
}

function calculateScore() {
    const baseScore = 1000;
    const penalty = (attempts - 1) * 100;
    const difficultyBonus = currentDifficulty === 'easy' ? 0 : 
                            currentDifficulty === 'medium' ? 200 : 400;
    return Math.max(100, baseScore - penalty + difficultyBonus);
}

function updateDisplay() {
    attemptsDisplay.textContent = attempts;
    const remaining = MAX_ATTEMPTS - attempts;
    remainingDisplay.textContent = remaining;
    
    // Update attempts warning color
    if (remaining <= 2 && remaining > 0) {
        attemptsWarning.style.color = '#ff6b6b';
        attemptsWarning.textContent = `⚠️ Only ${remaining} attempts remaining!`;
    } else if (remaining > 0) {
        attemptsWarning.style.color = '#4ecdc4';
        attemptsWarning.textContent = `You have ${remaining} attempts remaining`;
    } else {
        attemptsWarning.textContent = 'No attempts remaining';
    }
}

function updateGuessHistory() {
    if (guesses.length > 0) {
        guessHistory.style.display = 'block';
        guessList.innerHTML = guesses.map(guess => 
            `<span class="guess-item">${guess}</span>`
        ).join('');
    }
}

// Event listeners
guessInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        makeGuess();
    }
});

// Initialize the game
initGame();