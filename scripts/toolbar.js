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
  function toggleStyleSelect(state) {
    if (state) {
      currentScreen = "style_select";
      $(".home-content").fadeOut("fast", function () {
        toggleHome(true);
        $(".style-click")
          .css("display", "flex")
          .hide()
          .fadeIn("fast", function () {
            window.api.send("toolbar", { task: "style" });
          });
      });
    } else {
      $(".style-click").fadeOut("fast", function () {
        $(".home-content").fadeIn();
      });
    }
  }
  $("#background-color").on("change", (e) => {
    console.log($(this).val());
  });
  $("#font-color").on("change", (e) => {
    console.log(this);
    console.log($(this).val());
  });
  $("#background-color").on("change", function () {
    console.log($(this).val());
  });
  $("#close-toolbar").on("click", function () {
    window.api.send("closeWin", "data");
  });
  $("#add-widgets").on("click", function () {
    toggleSelectWidget(true);
  });
  $("#style-widgets").on("click", function () {
    toggleStyleSelect(true);
  });

  window.api.receive("fromBoard", (data) => {
    $(".style-click").fadeOut("fast", function () {
      toggleStyleWidget(true);
      let bg = data.background;
      let font = data.fontColor;
      console.log(`bg ${bg} font ${font}`);
      // $("#font-color").val(font);
      // $("#background-color").val(bg);
    });
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
    toggleHome(false);
    switch (currentScreen) {
      case "select widget":
        toggleSelectWidget(false);
        break;
      case "style":
        toggleStyleWidget(false);
        break;
      case "style_select":
        toggleStyleSelect(false);
        break;
    }
  });
});
