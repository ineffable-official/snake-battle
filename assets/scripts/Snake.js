class Snake {
  constructor(playerName, x1, y1, snakePart, snakeLength) {
    this.playerName = playerName;
    this.x1 = x1;
    this.y1 = y1;
    this.x1_change = 0;
    this.y1_change = 0;
    this.snakePart = snakePart;
    this.baseLength = snakeLength;
    this.snakeLength = this.baseLength;
    this.dead = false;
  }

  render(ctx, blockSize, baseColor) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(this.x1, this.y1, blockSize, blockSize);
  }

  move() {
    this.x1 += this.x1_change;
    this.y1 += this.y1_change;
  }

  eventHandler(blockSize) {
    window.addEventListener("keydown", (event) => {
      if (event.key === "w") {
        this.x1_change = 0;
        this.y1_change = -blockSize;
      }
      if (event.key === "a") {
        this.x1_change = -blockSize;
        this.y1_change = 0;
      }
      if (event.key === "s") {
        this.x1_change = 0;
        this.y1_change = blockSize;
      }
      if (event.key === "d") {
        this.x1_change = blockSize;
        this.y1_change = 0;
      }
    });
  }

  body(ctx, blockSize, baseColor) {
    var snakeHead = [];
    snakeHead.push(this.x1);
    snakeHead.push(this.y1);
    this.snakePart.push(snakeHead);

    if (this.snakePart.length >= this.snakeLength) {
      this.snakePart.shift();
    }

    this.snakePart.forEach((s) => {
      ctx.fillStyle = baseColor;
      ctx.fillRect(s[0], s[1], blockSize, blockSize);
    });
  }

  eatself() {
    this.snakePart.forEach((s) => {
      if (this.x1_change !== 0 || this.y1_change !== 0) {
        if (this.x1 === s[0] && this.y1 === s[1]) {
          this.dead = true;
        }
      }
    });
  }

  score(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "15px arial";
    ctx.fillText(`Score: ${this.snakeLength - this.baseLength}`, 20, 20);
  }

  void(width, height) {
    if (this.x1 < 0 || this.x1 > width || this.y1 < 0 || this.y1 > height) {
      this.dead = true;
    }
  }

  ui(ctx, width, height, pos) {
    if (pos === true) {
      ctx.fillStyle = "black";
      ctx.font = "14px arial";
      ctx.fillText(`${this.x1}:${this.y1}`, width - 70, 20);
    }
  }
}
