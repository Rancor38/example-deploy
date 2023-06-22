document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const gridSize = 20;
  const boardSize = 400;
  const snakeSpeed = 150;
  let snakeDirection = "right";
  let snake = [{ x: 0, y: 0 }];
  let food = { x: 0, y: 0 };
  let score = 0;
  let gameLoop;
  let gameStarted = false;

  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const closeModalBtn = document.getElementById("close-modal-btn");

  function createSnake() {
    snake.forEach((segment) => {
      const snakeElement = document.createElement("div");
      snakeElement.style.left = segment.x + "px";
      snakeElement.style.top = segment.y + "px";
      snakeElement.classList.add("snake");
      gameBoard.appendChild(snakeElement);
    });
  }

  function createFood() {
    const foodElement = document.createElement("div");
    foodElement.style.left = food.x + "px";
    foodElement.style.top = food.y + "px";
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);
  }

  function generateFoodPosition() {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * gridSize) * gridSize,
        y: Math.floor(Math.random() * gridSize) * gridSize,
      };
    } while (
      snake.some(
        (segment) => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
      )
    );

    food = newFoodPosition;
  }

  function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch (snakeDirection) {
      case "up":
        head.y -= gridSize;
        break;
      case "down":
        head.y += gridSize;
        break;
      case "left":
        head.x -= gridSize;
        break;
      case "right":
        head.x += gridSize;
        break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById("score").textContent = score;
      generateFoodPosition();
    } else {
      snake.pop();
    }
  }

  function checkCollision() {
    const head = snake[0];

    if (
      head.x < 0 ||
      head.x >= boardSize ||
      head.y < 0 ||
      head.y >= boardSize ||
      snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      gameOver();
    }
  }

  function changeDirection(event) {
    if (!gameStarted) {
      startGame();
      gameStarted = true;
    }

    const keyPressed = event.keyCode;

    switch (keyPressed) {
      case 37:
        if (snakeDirection !== "right") {
          snakeDirection = "left";
        }
        break;
      case 38:
        if (snakeDirection !== "down") {
          snakeDirection = "up";
        }
        break;
      case 39:
        if (snakeDirection !== "left") {
          snakeDirection = "right";
        }
        break;
      case 40:
        if (snakeDirection !== "up") {
          snakeDirection = "down";
        }
        break;
    }
  }

  function gameOver() {
    clearInterval(gameLoop);
    modalMessage.textContent = "Game Over! Your score: " + score;
    modal.style.display = "block";
    snake = [{ x: 0, y: 0 }];
    snakeDirection = "right";
    score = 0;
    document.getElementById("score").textContent = score;
    gameStarted = false;
  }

  function game() {
    gameBoard.innerHTML = "";
    moveSnake();
    checkCollision();
    createSnake();
    createFood();
  }

  function startGame() {
    generateFoodPosition();
    gameBoard.innerHTML = "";
    createSnake();
    // createFood();
    gameLoop = setInterval(game, snakeSpeed);
  }

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  document.addEventListener("keydown", changeDirection);
});
