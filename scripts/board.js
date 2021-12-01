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
  let gridOn = false;
  let styling = false;
  for (var i = 0; i < yGrid; i++) {
    let newRow = `<div class="grid-row" id="row-${i}"></div>`;
    $("#render").append(newRow);
    for (var j = 0; j < xGrid; j++) {
      let newBox = `<div class="grid" ></div>`;
      $("#row-" + i).append(newBox);
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
    $(".doctor-images").css("display", "none");
  }
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
      doctors: data.doctors
    }).createWidget();
    $(".draggable").draggable({});
    let vidImage = new Widget(Date.now(), {
      className: "video-images",
      widgetType: "mesImages",
      doctors: data.videos
    });
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
  });

  instantiate();
});
