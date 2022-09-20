var baseUrl = "http://172.28.106.200:3000";

var message = "";

$(window).on("load", () => {
  // Load room list
  fetch(baseUrl + "/room", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((r) => r.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      $("body").append(`<div id="message-toast"></div>`);

      $("#message-toast").text("Connection error, please try again later");
    });

  // Submit form
  $("#form-register").on("submit", (event) => {
    event.preventDefault();

    if (event.target.children[0].value === "") {
      $("body").append(`<div id="message-toast"></div>`);

      $("#message-toast").text("Player name can't be empty");

      setTimeout(() => {
        $("#message-toast").remove();
      }, 3000);
      return;
    }

    if (event.target.children[1].value === "") {
      $("body").append(`<div id="message-toast"></div>`);

      $("#message-toast").text("Please select room");

      setTimeout(() => {
        $("#message-toast").remove();
      }, 3000);
      return;
    }
  });
});
