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
  function toggleStyleWidget(state) {
    if (state) {
      $(".home-content").fadeOut(function () {
        currentScreen = "style";
        toggleHome(true);
        $(".style-content").css("display", "flex").hide().fadeIn();
      });
    } else {
      $(".style-content").fadeOut(function () {
        $(".home-content").fadeIn();
      });
    }
  }
  $("#background-color").on("change", function () {
    console.log($(this).val());
  });
  $("body").on("click", ".widget", () => {
    console.log("heyo");
  });

  $("#close-toolbar").on("click", function () {
    window.api.send("closeWin", "data");
  });
  $("#add-widgets").on("click", function () {
    toggleSelectWidget(true);
  });
  $("#style-widgets").on("click", function () {
    window.api.send("toolbar", { task: "style" });
  });

  window.api.receive("fromMain", (data) => {
    toggleStyleWidget(true);
  });
  function toggleMovable(on) {
    if (on) {
      window.api.send("toolbar", {
        task: "move"
      });
      $("#move").css("background", "#dc3545");
      $("#move").html(`<i class="fa fa-lock fa-lg"></i><br /> Lock Widgets`);
    } else if (!on) {
      window.api.send("toolbar", {
        task: "lockMove"
      });
      $("#move").css("background", "#09527f");
      $("#move").html(
        `<i class="fa fa-arrows-alt fa-lg"></i><br /> Move Widgets`
      );
    }
  }

  $("#move").on("click", function () {
    if (canMove) {
      toggleMovable(true);
      canMove = false;
    } else {
      toggleMovable(false);
      canMove = true;
    }
  });
  $(".widget-choice").on("click", function () {
    window.api.send("toolbar", {
      task: "create",
      widgetNumber: $(this).attr("id")
    });
    toggleMovable(true);
    canMove = false;
  });
  $(".return-home").on("click", () => {
    alert(currentScreen);
    toggleHome(false);
    switch (currentScreen) {
      case "select widget":
        toggleSelectWidget(false);
        break;
      case "style":
        toggleStyleWidget(false);
        break;
    }
  });
});