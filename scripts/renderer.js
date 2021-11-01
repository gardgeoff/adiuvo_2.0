$(function () {
  const stateManager = {
    history: [],
    currentPage: "splash"
  };
  function startApp(state) {
    // setTimeout(() => {
    //   loadSplash();
    // }, 500);
    render(state);
  }

  function loadSplash() {
    stateManager.currentPage = "splash";
    $("#splash-logo").fadeIn("slow", function () {
      setTimeout(() => {
        $("#splash-container").fadeOut("slow", function () {
          $("#splash-logo").css("display", "none");

          render("verify");
        });
      }, 1000);
    });
  }
  function loadVerify() {
    stateManager.currentPage = "verify";
    $("#verify-container").css("display", "flex").hide().fadeIn("slow");
  }
  function loadBoardType() {
    stateManager.currentPage = "board";
    $("#board-type-container").css("display", "flex").hide().fadeIn("slow");
  }
  function loadDisplay() {
    window.location.href = "board.html";
  }
  function render(page) {
    stateManager.history.push(stateManager.currentPage);
    stateManager.currentPage = page;

    switch (page) {
      case "splash":
        loadSplash();
        break;
      case "verify":
        loadVerify();
        break;
      case "board":
        loadBoardType();
        break;
      case "display":
        loadDisplay();
    }
  }

  $("#verify-btn").on("click", function () {
    $(this)
      .html(`<div class="lds-dual-ring"></div>`)
      .css("background", "none")
      .attr("disabled", "true");

    $("#pi-id").attr("disabled", "true");

    setTimeout(() => {
      $("#verify-container").fadeOut("slow", function () {
        render("board");
      });
    }, 1000);
  });
  $("#salon-board").on("click", function () {
    window.location.href = "board.html";
  });

  startApp("display");
});
