$(function () {
  let currentScreen = "home";
  let canMove = true;
  function toggleHome(state) {
    if (state) {
      $(".return-home").fadeIn();
    } else {
      $(".return-home").fadeOut();
    }
  }
  function toggleSelectWidget(state) {
    if (state) {
      $(".home-content").fadeOut(function () {
        currentScreen = "select widget";
        toggleHome(true);
        $(".widget-choice").fadeIn();
      });
    } else {
      $(".widget-choice").fadeOut(function () {
        $(".home-content").fadeIn();
      });
    }
  }
  console.log(`jquery loaded`);

  $("#close-toolbar").on("click", function () {
    window.api.send("closeWin", "data");
  });
  $("#add-widgets").on("click", function () {
    toggleSelectWidget(true);
  });
  $("#move").on("click", function () {
    if (canMove) {
      window.api.send("toolbar", {
        task: "move"
      });
      $(this).css("border", "4px solid #073755");
      canMove = false;
    } else {
      window.api.send("toolbar", {
        task: "lockMove"
      });
      canMove = true;
      $(this).css("border", "1px solid #09527f");
    }
  });
  $(".widget-choice").on("click", function () {
    window.api.send("toolbar", {
      task: "create",
      widgetNumber: $(this).attr("id")
    });
  });
  $(".return-home").on("click", () => {
    toggleHome(false);
    switch (currentScreen) {
      case "select widget":
        toggleSelectWidget(false);
        break;
    }
  });
});
