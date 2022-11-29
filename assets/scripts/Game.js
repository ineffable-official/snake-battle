import Snake from "./Snake.js";
import Player from "./Player.js";

class Game {
  constructor(roomId, player) {
    this.baseUrl = "http://localhost:8000/api";
    this.roomId = roomId;
    this.player = player;
    this.data = [];
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
    fetch(
      this.baseUrl +
        "/game_match?room_id=" +
        this.roomId +
        "&player_id=" +
        this.player.id,
      { method: "DELETE" }
    );
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

    var player;

    var foodList;

    this.data.forEach((d) => {
      if (d.player_id === this.player.id) {
        player = new Snake(
          this.player.name,
          JSON.parse(d.pos)[0],
          JSON.parse(d.pos)[1],
          [],
          d.length
        );
        foodList = JSON.parse(d.food_list);
      }
    });

    setInterval(() => {
      if (!player.dead) {
        this.update(ctx, width, height, "white");

        this.grid(ctx, width, height, "rgb(0,0,0)", blockSize);

        foodList.forEach((food) => {
          ctx.fillStyle = "green";
          ctx.fillRect(food[0], food[1], blockSize, blockSize);
        });

        this.data.forEach((d) => {
          var oponent = new Snake(
            "Oponent",
            JSON.parse(d.pos)[0],
            JSON.parse(d.pos)[1],
            [],
            d.length
          );

          oponent.render(ctx, blockSize, "red");
          oponent.body(ctx, blockSize, "red");
          oponent.move();
          oponent.void(width, height);
        });

        player.render(ctx, blockSize, "blue");
        player.body(ctx, blockSize, "blue");
        player.move();
        player.eventHandler(blockSize);
        player.score(ctx);
        player.void(width, height);

        player.eatself();

        player.ui(ctx, width, height, true);

        foodList.forEach((food) => {
          if (food[0] === player.x1 && food[1] === player.y1) {
            const fX1 =
              Math.floor((Math.random() * width) / blockSize) * blockSize;
            const fY1 =
              Math.floor((Math.random() * height) / blockSize) * blockSize;

            const findex = foodList.indexOf(food);

            foodList[findex] = [fX1, fY1];

            player.snakeLength += 1;
          }
        });

        var updateData = {
          room_id: this.roomId,
          player_id: this.player.id,
          pos: JSON.stringify([player.x1, player.y1]),
          length: player.length,
          food_list: JSON.stringify(foodList),
        };

        fetch(this.baseUrl + "/game_match", {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
      } else {
        this.gameover(ctx, width / 2, height / 2);
      }
    }, 150);
  }
}

export default Game;
