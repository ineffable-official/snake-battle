class Game {
  constructor(roomId, playerId) {
    this.roomId = roomId;
    this.playerId = playerId;
  }

  update(ctx, width, height, baseColor) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);
  }

  grid(ctx, width, height, baseColor, blockSize) {
    ctx.fillStyle = baseColor;

    for (let index = 0; index < width; index++) {
      ctx.beginPath();
      ctx.moveTo(index * blockSize, 0);
      ctx.lineTo(index * blockSize, height);
      ctx.stroke();
    }

    for (let i = 0; i < height; i++) {
      ctx.lineWidth = 0.1;
      ctx.beginPath();
      ctx.moveTo(0, i * blockSize);
      ctx.lineTo(width, i * blockSize);
      ctx.stroke();
    }
  }

  gameover(ctx, x, y) {
    ctx.fillStyle = "black";
    ctx.font = "52px arial";
    var text = "Game Over!";
    ctx.fillText(text, x - ctx.measureText(text).width / 2, y);
  }

  start() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var width = window.innerWidth;
    var height = window.innerHeight;

    var blockSize = 25;

    ctx.canvas.width = width;
    ctx.canvas.height = height;

    var player = new Snake(
      "Faizun Musthofa",
      Math.floor(width / 2 / blockSize) * blockSize,
      Math.floor(height / 2 / blockSize) * blockSize,
      [],
      5
    );

    var foodX1 = Math.floor((Math.random() * width) / blockSize) * blockSize;
    var foodY1 = Math.floor((Math.random() * height) / blockSize) * blockSize;
    var foodSize = Math.floor(
      Math.random() * (2 * blockSize - blockSize) + blockSize
    );

    setInterval(() => {
      if (!player.dead) {
        this.update(ctx, width, height, "white");

        this.grid(ctx, width, height, "rgb(0,0,0)", blockSize);

        ctx.fillStyle = "green";
        ctx.fillRect(foodX1, foodY1, foodSize, foodSize);

        player.render(ctx, blockSize, "blue");
        player.body(ctx, blockSize, "blue");
        player.move();
        player.eventHandler(blockSize);
        player.score(ctx);
        player.void(width, height);

        player.eatself();

        player.ui(ctx, width, height, true);

        for (let fx = 0; fx < foodSize; fx++) {
          if (fx + foodX1 === player.x1 && fx + foodY1 === player.y1) {
            foodX1 =
              Math.floor((Math.random() * width) / blockSize) * blockSize;
            foodY1 =
              Math.floor((Math.random() * height) / blockSize) * blockSize;
            foodSize = Math.floor(
              Math.random() * (2 * blockSize - blockSize) + blockSize
            );

            player.snakeLength += 1;
          }
        }
      } else {
        this.gameover(ctx, width / 2, height / 2);
      }
    }, 150);
  }
}
