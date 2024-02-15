
const canvas = /**@type {HTMLCanvasElement} */ document.querySelector('#canvas');
const ctx = /** @type {CanvasRenderingContext2D} */ canvas.getContext("2d");

const canvas_width = canvas.width;
const canvas_height = canvas.height;

let gameLoop;
let gameSpeed = 80; //fps(?

const SNAKE_COLOR = "blue";
const BACKGROUND_COLOR = "white";
const GRID_COLOR = "gray";

const CELLSIZE = 20;

const UP = "up";
const RIGHT = "right";
const DOWN = "down";
const LEFT = "left";

const keysDict = {
  ArrowUp: UP,
  ArrowRight: RIGHT,
  ArrowDown: DOWN,
  ArrowLeft: LEFT,
}

const DIRECTIONS = {
  up: {
    x: 0,
    y: -1 * CELLSIZE,
  },
  right: {
    x: 1 * CELLSIZE,
    y: 0,
  },
  down: {
    x: 0,
    y: 1 * CELLSIZE,
  },
  left: {
    x: -1 * CELLSIZE,
    y: 0,
  },
}

let snake = [];
let snakeDirection = RIGHT;
let directionQueue = RIGHT;

function setBackground(color1, color2) {
  ctx.clearRect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = color1 ?? BACKGROUND_COLOR;
  ctx.strokeStyle = color2 ?? GRID_COLOR;

  ctx.fillRect(0, 0, canvas_width, canvas_height);

  for (var x = 0.5; x < canvas_width; x += CELLSIZE) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas_height);
  }

  for (var y = 0.5; y < canvas_height; y += CELLSIZE) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas_width, y);
  }

  ctx.stroke();
}

window.addEventListener('keydown', function ({ key }) {
  const newDirection = keysDict[key];

  if (
    !newDirection ||
    newDirection === RIGHT && snakeDirection === LEFT ||
    newDirection === LEFT && snakeDirection === RIGHT ||
    newDirection === UP && snakeDirection === DOWN ||
    newDirection === DOWN && snakeDirection === UP
  ) {
    return
  }

  directionQueue = newDirection;
});

function startSnake() {
  snake = [];
  for (let i = 1; i < 5; i++) {
    snake.push({
      x: i * CELLSIZE,
      y: 0
    })
  }
}

function renderSnake() {
  snake.forEach(({ x, y }) => drawCell(x, y));
}

function moveSnake() {
  const { x: headX, y: headY } = snake.at(0);
  snakeDirection = directionQueue;

  const { x, y } = DIRECTIONS[snakeDirection];

  const newHead = snake.pop();
  newHead.x = headX + x;
  newHead.y = headY + y;
  snake.unshift(newHead);
}

function update() {
  setBackground();
  moveSnake();
  renderSnake();

  const snakeHead = snake.at(0);

  if (snakeHead.x > canvas_width ||
    snakeHead.y > canvas_height ||
    snakeHead.x < 0 ||
    snakeHead.y < 0
  ) {
    newGame();
  }
}

function drawCell(x, y) {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.fillRect(x, y, CELLSIZE, CELLSIZE);
}

function gameOver() {
  clearInterval(gameLoop);
}

function newGame() {
  directionQueue = RIGHT;
  startSnake()
  update();

  if (gameLoop) {
    clearInterval(gameLoop);
  }

  gameLoop = setInterval(update, gameSpeed);
}

newGame();