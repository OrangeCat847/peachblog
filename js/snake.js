/*
 * Snake game in JavaScript
* Created by: Orangecat847
 */
(function(){
  const board = document.getElementById('game-board');
  const scoreSpan = document.getElementById('scoreDisplay');
  const GRID_SIZE = 20;
  let cellSize = 0;
  let snake = [];
  let food = { top: 0, left: 0 };
  let direction = 'right';
  let nextDirection = 'right';
  let score = 0;
  let gameInterval = null;
  let gameRunning = true;
  function initGameData() {
    snake = [{ top: 10, left: 10 }];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreSpan.textContent = '0';
    gameRunning = true;
  }
  function toPixel(gridPos) {
    return gridPos * cellSize;
  }
  function generateFood() {
    const maxAttempts = 300;
    for (let i = 0; i < maxAttempts; i++) {
      const pos = {
        top: Math.floor(Math.random() * GRID_SIZE),
        left: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!snake.some(seg => seg.top === pos.top && seg.left === pos.left)) {
        food = pos;
        return true;
      }
    }
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!snake.some(seg => seg.top === y && seg.left === x)) {
          food = { top: y, left: x };
          return true;
        }
      }
    }
    return false;
  }
  function render() {
    board.innerHTML = '';
    // 蛇
    snake.forEach((part, index) => {
      const el = document.createElement('div');
      el.className = 'snake-part';
      el.style.top = toPixel(part.top) + 'px';
      el.style.left = toPixel(part.left) + 'px';
      if (index === 0) {
        el.style.zIndex = '2';
      }
      board.appendChild(el);
    });
    const foodEl = document.createElement('div');
    foodEl.className = 'food';
    foodEl.style.top = toPixel(food.top) + 'px';
    foodEl.style.left = toPixel(food.left) + 'px';
    board.appendChild(foodEl);
  }
  function updateSizeAndRender() {
    const rect = board.getBoundingClientRect();
    const size = Math.floor(rect.width);
    cellSize = size / GRID_SIZE;
    render();
  }
  function moveSnake() {
    if (!gameRunning) return;

    const opposite = {
      'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left'
    };
    if (nextDirection && opposite[nextDirection] !== direction) {
      direction = nextDirection;
    }

    const head = { ...snake[0] };
    switch (direction) {
      case 'up': head.top--; break;
      case 'down': head.top++; break;
      case 'left': head.left--; break;
      case 'right': head.left++; break;
      default: return;
    }

    if (head.top < 0 || head.top >= GRID_SIZE || head.left < 0 || head.left >= GRID_SIZE) {
      gameOver();
      return;
    }

    const isEating = (head.top === food.top && head.left === food.left);
    const newSnake = [head, ...snake];
    if (!isEating) {
      newSnake.pop();
    }

    const headCollision = newSnake.slice(1).some(seg => seg.top === head.top && seg.left === head.left);
    if (headCollision) {
      gameOver();
      return;
    }

    snake = newSnake;

    if (isEating) {
      score++;
      scoreSpan.textContent = score;
      const success = generateFood();
      if (!success) {
        gameOver(true);
        return;
      }
    }

    updateSizeAndRender();
  }
  function gameOver(win = false) {
    if (!gameRunning) return;
    gameRunning = false;
    clearInterval(gameInterval);
    gameInterval = null;

    const overlay = document.createElement('div');
    overlay.className = 'gameover-overlay';

    const card = document.createElement('div');
    card.className = 'gameover-card';

    const title = document.createElement('h1');
    title.textContent = win ? 'Vic' : 'Game Over';

    const scoreMsg = document.createElement('div');
    scoreMsg.className = 'final-score';
    scoreMsg.textContent = `Score: ${score}`;

    const btn = document.createElement('button');
    btn.textContent = '↻ Try again';
    btn.addEventListener('click', function restart() {
      if (overlay.parentNode) overlay.remove();
      resetGame();
    });

    card.appendChild(title);
    card.appendChild(scoreMsg);
    card.appendChild(btn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }
  function resetGame() {
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = null;
    }
    initGameData();
    if (!generateFood()) {
      food = { top: 5, left: 5 };
    }
    updateSizeAndRender();
    gameInterval = setInterval(moveSnake, 180);
  }
  function handleKeydown(e) {
    const key = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
    }
    if (!gameRunning) return;

    const opposite = {
      'ArrowUp': 'down', 'ArrowDown': 'up', 'ArrowLeft': 'right', 'ArrowRight': 'left'
    };
    const mapDir = {
      'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right'
    };
    if (mapDir[key] && opposite[key] !== direction) {
      nextDirection = mapDir[key];
    }
  }
  let resizeTimeout = null;
  function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (gameRunning) {
        updateSizeAndRender();
      }
      resizeTimeout = null;
    }, 60);
  }
  function init() {
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', handleResize);

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (gameRunning) updateSizeAndRender();
      });
      ro.observe(board);
    }

    initGameData();
    if (!generateFood()) {
      food = { top: 5, left: 5 };
    }
    requestAnimationFrame(() => {
      updateSizeAndRender();
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(moveSnake, 180);
    });
  }

  init();
})();
