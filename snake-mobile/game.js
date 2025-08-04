const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

canvas.width = 300;
canvas.height = 300;

const box = 20;
let snake = [{ x: 5 * box, y: 5 * box }];
let direction = null;
let food = createFood();
let score = 0;
let gameStarted = false;
let gameInterval;

function createFood() {
  const max = canvas.width / box;
  return {
    x: Math.floor(Math.random() * max) * box,
    y: Math.floor(Math.random() * max) * box
  };
}

function changeDirection(dir) {
  const opposite = {
    left: "right",
    right: "left",
    up: "down",
    down: "up"
  };

  if (dir !== opposite[direction]) {
    direction = dir;

    if (!gameStarted) {
      gameStarted = true;
      gameInterval = setInterval(updateGame, 150);
    }
  }
}

function updateGame() {
  // Calculate new head position based on current direction
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "left") head.x -= box;
  else if (direction === "right") head.x += box;
  else if (direction === "up") head.y -= box;
  else if (direction === "down") head.y += box;

  // Check if snake hits boundaries — game over
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height
  ) {
    gameOver();
    return;
  }

  // Add new head to snake body
  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    food = createFood(); // Create new food
    // Don't remove tail (snake grows)
  } else {
    // Remove tail (snake moves forward)
    snake.pop();
  }

  // Check self-collision **after** tail moves
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  // Draw everything after logic
  drawGame();
}

function drawGame() {
  // Clear background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach(part => {
    ctx.fillStyle = "#0f0";
    ctx.fillRect(part.x, part.y, box, box);
  });

  // Draw food as orange circle
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = "#ff6600";
  ctx.fill();
  ctx.closePath();
}

function gameOver() {
  clearInterval(gameInterval);
  alert("Game Over! Your score: " + score);
  location.reload();
}
