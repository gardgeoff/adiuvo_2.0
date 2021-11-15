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
    window.api.send("toMain", { request: "id" });

    stateManager.currentPage = "verify";
    $("#verify-container").css("display", "flex").hide().fadeIn("slow");
    window.api.receive("fromMain", (data) => {
      console.log(data);
      if (data.registered) {
        render("display");
      } else {
        $("#board-id").html(data.id);
      }
    });
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
      case "display":
        loadDisplay();
    }
  }
  startApp("splash");
});
