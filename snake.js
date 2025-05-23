// Set up canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const unitSize = 25;
const screenWidth = canvas.width;
const screenHeight = canvas.height;
let score = 0;
let snakeBody = [{ x: 50, y: 50 }];
let direction = 'RIGHT';
let apple = { x: 0, y: 0 };
let gameRunning = true;
let gameInterval;

// Random number generator for placing the apple
function randomPosition() {
    return Math.floor(Math.random() * (screenWidth / unitSize)) * unitSize;
}


// Draw everything on the canvas
function drawGame() {
    ctx.clearRect(0, 0, screenWidth, screenHeight); // Clear canvas
    
    // Draw the snake
    snakeBody.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#FFFFFF' : '#FFA500'; // White for head, orange for body
        ctx.fillRect(segment.x, segment.y, unitSize, unitSize);
    });

     // Draw the apple as a circle
     ctx.beginPath();
     ctx.arc(apple.x + unitSize / 2, apple.y + unitSize / 2, unitSize / 2, 0, Math.PI * 2); // Circle
     ctx.fillStyle = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
     ctx.fill();

    // Update score display
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Handle the movement of the snake
function moveSnake() {
    const head = { ...snakeBody[0] };

    // Move head based on direction
    switch (direction) {
        case 'UP':
            head.y -= unitSize;
            break;
        case 'DOWN':
            head.y += unitSize;
            break;
        case 'LEFT':
            head.x -= unitSize;
            break;
        case 'RIGHT':
            head.x += unitSize;
            break;
    }

    // Wrap around the screen if snake goes out of bounds
    if (head.x < 0) head.x = screenWidth - unitSize;
    if (head.x >= screenWidth) head.x = 0;
    if (head.y < 0) head.y = screenHeight - unitSize;
    if (head.y >= screenHeight) head.y = 0;

    // Add new head to the snake's body
    snakeBody.unshift(head);

    // Check for apple collision
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        placeApple();
    } else {
        snakeBody.pop(); // Remove last segment (move snake)
    }
}

// Check for collisions with itself
function checkCollisions() {
    const head = snakeBody[0];
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i].x === head.x && snakeBody[i].y === head.y) {
            gameOver();
            return true;
        }
    }
    return false;
}

// Place apple at a random location
function placeApple() {
    apple.x = randomPosition();
    apple.y = randomPosition();
}

// End the game
function gameOver() {
    gameRunning = false;
    clearInterval(gameInterval); // Stop the game loop
    document.getElementById('gameOver').style.display = 'block';
}

// Handle key events for snake movement
function changeDirection(event) {
    const key = event.keyCode;

    if (key === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (key === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

// Initialize the game
function startGame() {
    placeApple(); // Place the first apple
    gameInterval = setInterval(() => {
        if (gameRunning) {
            moveSnake();
            if (checkCollisions()) return;
            drawGame();
        }
    }, 100); // Game updates every 100ms

    // Add event listener for controlling snake
    document.addEventListener('keydown', changeDirection);
}

// Start the game when the page loads
window.onload = startGame;
