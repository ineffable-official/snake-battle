import Game from "./Game.js";
import Player from "./Player.js";
var baseUrl = "http://localhost:8000/api";

var message = "";

$(window).on("load", () => {
  // Load room list
  fetch(baseUrl + "/room", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      res.data.forEach((d) => {
        $("#room-list").append(`<option value="${d.id}">${d.name}</option>`);
      });
    })
    .catch((err) => {
      console.log(err);
      $("body").append(`<div id="message-toast"></div>`);

      $("#message-toast").text("Connection error, please try again later");
    });

  // Submit form
  $("#form-register").on("submit", (event) => {
    event.preventDefault();

    if ($("#player-name")[0].value === "") {
      $("body").append(`<div id="message-toast"></div>`);

      $("#message-toast").text("Player name can't be empty");

      setTimeout(() => {
        $("#message-toast").remove();
      }, 3000);
      return;
    }

    if ($("#room-list")[0].value === "") {
      $("body").append(`<div id="message-toast"></div>`);

      $("#message-toast").text("Please select room");

      setTimeout(() => {
        $("#message-toast").remove();
      }, 3000);
      return;
    }

    $("body").append(`<div id="message-toast"></div>`);

    $("#message-toast").text("Loading...");

    fetch(baseUrl + "/player?name=" + $("#player-name")[0].value, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        $("#message-toast").text("Added new player successfully");

        const player = new Player(parseInt(res.data.id), res.data.name);

        var foodList = [];

        var width = window.innerWidth;
        var height = window.innerHeight;

        var blockSize = 25;

        for (let f = 0; f < 5; f++) {
          var foodX1 =
            Math.floor((Math.random() * width) / blockSize) * blockSize;
          var foodY1 =
            Math.floor((Math.random() * height) / blockSize) * blockSize;
          var food = [];
          food.push(foodX1);
          food.push(foodY1);
          foodList.push(food);
        }

        const data = {
          room_id: parseInt($("#room-list")[0].value),
          player_id: player.id,
          pos: JSON.stringify([250, 250]),
          length: 4,
          food_list: JSON.stringify(foodList),
        };

        fetch(baseUrl + `/game_match`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .then((res) => {
            $("#message-toast").text(res.message);

            $(".box")[0].remove();
            $("body").append("<canvas id='canvas'></canvas>");

            fetch(baseUrl + "/game_match/match?room_id=" + res.data.room_id, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
            })
              .then((res2) => res2.json())
              .then((res2) => {
                $("#message-toast").remove();

                const game = new Game(res.data.room_id, player);
                game.data = res2.data;
                game.start();
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  $("#open-controls").on("click", () => {
    $("#controls").toggle();
  });
});
