import { Food } from "./food";

const eventTypes: { [key: string]: string } = {
  KEYDOWN: "keydown"
};
export class Game {
  _gameCanvas: HTMLCanvasElement;
  _app: HTMLElement;
  _context: CanvasRenderingContext2D;
  _food: Food;
  _width: number;
  _height: number;
  _snake: Food[] = [];
  _speed: number = 3;
  _interval: any;
  _gameOverInterval: any;
  _direction: string = "right";
  _speedX: number = 0;
  _speedY: number = 0;
  _size: number = 3;
  _fps: number = 0;
  _delta;
  _vw = 10;
  _vh = 10;
  _score = 0;
  _lastCalledTime: number;
  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._app = document.getElementById("app");
    this._gameCanvas = document.createElement("canvas");
    this._gameCanvas.classList.add("game");
    this._app.appendChild(this._gameCanvas);
    this._gameCanvas.width = this._width;
    this._gameCanvas.height = this._height;
    this._food = { x: 1, y: 1, w: 10, h: 10, color: "#39FF14" };
    this._setContext();
    this._initSnake();
    this._initLoop();
  }

  _initLoop() {
    this._interval = setInterval(() => {
      this._clearScreen();
      this._drawFood(this._food);
      this._renderSnake();
      this._attachEvents();
      this._controlSnake();
      this._showScore();
      this._requestAnimFrame();
      this._showFps();
    }, 1000 / 15);
  }

  _setContext() {
    this._context = this._gameCanvas.getContext("2d");
  }

  _clearScreen() {
    this._context.clearRect(0, 0, this._width, this._height);
  }

  _drawFood(food: Food) {
    this._context.fillStyle = food.color;
    this._context.fillRect(
      food.x * this._vw,
      food.y * this._vh,
      food.w,
      food.h
    );
  }

  drawSnake(food: Food) {
    if (food != undefined) {
      this._context.fillStyle = food.color;
      this._context.fillRect(
        food.x * this._vw,
        food.y * this._vh,
        food.w,
        food.h
      );
    }
  }

  _renderSnake() {
    for (let i = 0; i <= this._snake.length; i++) {
      this.drawSnake(this._snake[i]);
    }
  }

  _initSnake() {
    for (let i = this._size - 1; i >= 0; i--) {
      let _block: Food = {
        x: i,
        y: 0,
        w: this._vw,
        h: this._vh,
        color: "#39FF14"
      };
      this._snake.push(_block);
    }
  }

  _checkCollission(x, y, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (x == arr[i].x && y == arr[i].y) {
        return true;
      }
    }
    return false;
  }

  _showScore() {
    this._context.font = "30px Arial";
    this._context.fillStyle = "#000";
    this._context.shadowColor = "#000";
    this._context.shadowBlur = 4;
    this._context.fillText(`Score: ${this._score}`, 10, 50);
  }

  _showFps() {
    this._context.font = "18px Arial";
    this._context.fillStyle = "#000";
    this._context.shadowColor = "#000";
    this._context.shadowBlur = 4;
    this._context.fillText(`FPS: ${Math.floor(this._fps)}`, 550, 50);
  }

  _showGameOver() {
    this._context.font = "30px Arial";
    this._context.fillStyle = "red";
    this._context.fillText(
      "Game Over",
      this._width / 2 - 90,
      this._height / 2 - 15
    );
  }

  _controlSnake() {
    let snakeX = this._snake[0].x;
    let snakeY = this._snake[0].y;
    const snakeW = this._snake[0].w;
    const snakeH = this._snake[0].h;
    const color = this._snake[0].color;
    if (this._direction == "left") {
      snakeX--;
    } else if (this._direction == "right") {
      snakeX++;
    } else if (this._direction == "up") {
      snakeY--;
    } else if (this._direction == "down") {
      snakeY++;
    }
    const newHead: Food = {
      x: snakeX,
      y: snakeY,
      w: snakeW,
      h: snakeH,
      color: color
    };
    if (
      this._checkCollission(snakeX, snakeY, this._snake) ||
      snakeX * this._vw >= this._width ||
      snakeY * this._vh >= this._height ||
      snakeX < 0 ||
      snakeY < 0
    ) {
      this._gameOver();
    }
    if (this._food.x == snakeX && this._food.y == snakeY) {
      this._spawnFood();
      const newHead: Food = {
        x: snakeX,
        y: snakeY,
        w: snakeW,
        h: snakeH,
        color: color
      };
      this._score++;
    } else {
      this._snake.pop();
      const newHead: Food = {
        x: snakeX,
        y: snakeY,
        w: snakeW,
        h: snakeH,
        color: color
      };
    }

    this._snake.unshift(newHead);
  }

  _gameOver() {
    clearInterval(this._interval);
    this._showGameOver();
    window.removeEventListener(eventTypes.KEYDOWN, () => {});
  }

  _spawnFood() {
    this._food.x = Math.floor(Math.random() * (this._width / this._vw - 1) + 1);
    this._food.y = Math.floor(
      Math.random() * (this._height / this._vh - 1) + 1
    );
    this._drawFood(this._food);
  }

  _attachEvents() {
    window.addEventListener(eventTypes.KEYDOWN, evt => {
      switch (evt.keyCode) {
        case 37:
          this._direction = "left";
          this._speedX = -this._speed;
          this._speedY = 0;
          break;
        case 38:
          this._direction = "up";
          this._speedX = 0;
          this._speedY = -this._speed;
          break;
        case 39:
          this._direction = "right";
          this._speedX = this._speed;
          this._speedY = 0;
          break;
        case 40:
          this._direction = "down";
          this._speedX = 0;
          this._speedY = this._speed;
          break;
      }
    });
  }

  _requestAnimFrame() {
    if (!this._lastCalledTime) {
      this._lastCalledTime = Date.now();
      this._fps = 0;
      return;
    }
    this._delta = (Date.now() - this._lastCalledTime) / 1000;
    this._lastCalledTime = Date.now();
    this._fps = 1 / this._delta;
  }

  _blinkSnake() {
    for (let i = 0; i < this._snake.length; i++) {
      this._context.fillStyle = "#fff";
      this._context.fillRect(
        this._snake[i].x,
        this._snake[i].y,
        this._snake[i].w,
        this._snake[i].h
      );
    }
  }
}
