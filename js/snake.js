const board = document.getElementById('game-board');
const boardSize = board.getBoundingClientRect();
const snake = [{top: 200, left: 200}];
const food = {top: 100, left: 100};
let direction = 'right';
let gameInterval;

function drawSnake() {
  snake.forEach(part => {
    const snakeElement = document.createElement('div');
    snakeElement.style.top = part.top + 'px';
    snakeElement.style.left = part.left + 'px';
    snakeElement.classList.add('snake-part');
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  const foodElement = document.createElement('div');
  foodElement.style.top = food.top + 'px';
  foodElement.style.left = food.left + 'px';
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

function moveSnake() {
  let head = { top: snake[0].top, left: snake[0].left };

  switch(direction) {
    case 'up':
      head.top -= 20;
      break;
    case 'down':
      head.top += 20;
      break;
    case 'left':
      head.left -= 20;
      break;
    case 'right':
      head.left += 20;
      break;
  }

  if(head.top < 0 || head.top >= boardSize.height || head.left < 0 || head.left >= boardSize.width) {
    clearInterval(gameInterval);
    alert('GAME OVER');
    return;
  }

  snake.unshift(head);

  if(head.top === food.top && head.left === food.left) {
    createFood();
  } else {
    snake.pop();
  }

  updateBoard();
}

function updateBoard() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
}

function createFood() {
  food.top = Math.floor(Math.random() * (boardSize.height / 20)) * 20;
  food.left = Math.floor(Math.random() * (boardSize.width / 20)) * 20;
}

function changeDirection(event) {
  switch(event.keyCode) {
    case 37:
      if(direction !== 'right') direction = 'left';
      break;
    case 38:
      if(direction !== 'down') direction = 'up';
      break;
    case 39:
      if(direction !== 'left') direction = 'right';
      break;
    case 40:
      if(direction !== 'up') direction = 'down';
      break;
  }
}

document.addEventListener('keydown', changeDirection);
gameInterval = setInterval(moveSnake, 300);
drawSnake();
drawFood();
