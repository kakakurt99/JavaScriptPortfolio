const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Define paddle and ball properties
const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
let leftPaddleY = (canvas.height - paddleHeight) / 2, rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2, ballSpeedX = 2, ballSpeedY = 2;

// Drawing functions for paddles and ball
function drawPaddle(x, y) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, ballSize, ballSize);
}

// Update game state (move ball and paddles)
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

    // Ball collision with paddles
    if (ballX <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight || 
        ballX + ballSize >= canvas.width - paddleWidth && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds (reset position)
    if (ballX <= 0 || ballX + ballSize >= canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX; // reset ball speed
    }

    // Clear canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);
    drawBall(ballX, ballY);

    requestAnimationFrame(update); // Keep the game loop going
}

// Control paddles with keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') rightPaddleY -= 20;
    if (e.key === 'ArrowDown') rightPaddleY += 20;
    if (e.key === 'w') leftPaddleY -= 20;
    if (e.key === 's') leftPaddleY += 20;
});

// Start the game loop
update();