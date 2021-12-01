import Widget from "./Widget.js";

$(function () {
  let playState = {
    doctorSelected: null,
    videosSelected: [],
    screen: "overview"
  };

  let interactCount = 0;
  let directoryData;
  let xGrid = 16;
  let yGrid = 9;
  let gridOn = true;
  let styling = false;
  if (gridOn) {
    for (var i = 0; i < yGrid; i++) {
      let newRow = `<div class="grid-row" id="row-${i}"></div>`;
      $("#render").append(newRow);
      for (var j = 0; j < xGrid; j++) {
        let newBox = `<div class="grid" ></div>`;
        $("#row-" + i).append(newBox);
      }
    }
  }
  function makeMovable() {
    $(".widget, .image-widget").draggable({
      grid: [30, 30],
      containment: ".board-content"
    });
    $(".widget").resizable({
      grid: 10,
      containment: ".board-content"
    });
  }

  function toggleGrid() {
    if (gridOn) {
      $(".grid").css("outline", "none");
      gridOn = false;
    } else {
      $(".grid").css("outline", "0.5px solid rgb(97, 97, 97)");
      gridOn = true;
    }
  }
  function videoSelect() {
    $(".doctor-images").fadeOut("slow", function () {
      $(".doctor-videos").fadeIn("slow");
      $(".start").fadeIn();
    });
  }
  function overview() {
    playState.doctorSelected = null;
    playState.screen = "overview";
    $(".empty").empty();
    $(".doctor-videos").fadeOut("slow", function () {
      $(".doctor-images").fadeIn("slow");
    });
  }
  function startPlaylist() {
    $(".doctor-videos").fadeOut("slow", function () {});
    $(".start").fadeOut("slow");
  }
  function videoPlayer() {}
  const rgba2hex = (rgba) =>
    `#${rgba
      .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((n, i) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, "0")
          .replace("NaN", "")
      )
      .join("")}`;

  function instantiate() {
    window.api.send("boardStart", true);
  }
  window.api.receive("fromMain", (data) => {
    if (data === "toggleGrid") {
      toggleGrid();
    }

    if (data.boardType === "mes") {
      stageMes(data);
    }
  });

  function stageMes(data) {
    let docImages = new Widget(Date.now(), {
      className: "doctor-images",
      widgetType: "mesImages",
      imageArr: data.doctors
    }).createWidget();
    let videoSlide = new Widget(Date.now(), {
      className: "doctor-videos",
      widgetType: "mesImages",
      imageArr: data.videos,
      hidden: true
    }).createWidget();
    $(".draggable").draggable({});
    let bottomImages = [
      "https://img.youtube.com/vi/FKdwndTViV0/mqdefault.jpg?0.21588005185990977",
      "empty",
      "https://img.youtube.com/vi/IfaAiTRP_RE/mqdefault.jpg?0.016445353745532576"
    ];
    bottomImages.map((item) => {
      !(item == "empty")
        ? $(".board-nav").append(`<img class="logo-img" src="${item}"/>`)
        : $(".board-nav").append("<div class='empty'>");
    });
    $(".draggable").draggable({});
  }
  function addToPlayList(key, type) {
    $(".empty").append(
      `<div class="nav-entry"><i key="${key}" type="${type}" class="delete-item fa fa-times"></i> <img class="logo-img" src="https://img.youtube.com/vi/${key}/mqdefault.jpg"/></div>`
    );
  }

  // all commands from the dashboard
  window.api.receive("fromDash", (data) => {
    if (data.task === "style") {
      let selectors = data.widgets;
      let bg = "background";
      let font = "color";
      for (let item in selectors) {
        console.log(item);
        let fontColor = selectors[item].fontColor;
        let bgColor = selectors[item].bgColor;

        if (item === "all") {
          $(`*`).css(font, fontColor);
        }
        if (item === "directory") {
          console.log(`styling directory`);
          $(".directory").css(font, fontColor);
          $(".directory").css(bg, bgColor);
        }
        if (item === "boardBg") {
          $("body").css(bg, bgColor);
        }
        // additional text color widgets go here!
      }
    } else if (data.task === "directory") {
      if ($(".directory").length) {
        $(".directory").remove();
      }

      let dir = [];
      console.log(data.directory);

      for (let item in data.directory) {
        dir.push(data.directory[item]);
      }
      console.log(dir);
      dir.shift();
      dir.sort((a, b) => a.number - b.number);

      let directory = new Widget(Date.now(), {
        className: "directory",
        widgetType: "directory",
        directory: dir,
        left: "0px",
        top: "0px",
        width: "1530px",
        height: "910px"
      }).createWidget();
      console.log(directory);
    }
  });
  $("body").on("click", ".doctor-img", function () {
    console.log("clicked");
    let key = $(this).attr("key");
    playState.doctorSelected = key;
    playState.screen = "video-select";
    videoSelect();
    addToPlayList(playState.doctorSelected, "doctor");
  });
  $("body").on("click", ".delete-item", function () {
    console.log("click");
    let type = $(this).attr("type");

    $(this).closest("div").remove();
    if (type === "doctor") {
      overview();
    } else if (type === "video") {
      let key = $(this).attr("key");
      playState.videosSelected = playState.videosSelected.filter(
        (item) => item != key
      );
      console.log(playState.videosSelected);
    }
  });
  $("body").on("click", ".g-slide", function () {
    let key = $(this).attr("key");
    console.log(key);
    addToPlayList(key, "video");

    playState.videosSelected.push(key);
    console.log(playState);
  });
  $(".start").on("click", function () {
    startPlaylist();
  });

  instantiate();
});
