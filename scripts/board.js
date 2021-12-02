import Widget from "./Widget.js";

$(function () {
  let playState = {
    doctorSelected: null,
    videosSelected: [],
    screen: "overview"
  };
  let interactCount = 0;
  let xGrid = 16;
  let yGrid = 9;
  let gridOn = true;

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

  function selectVideo(param) {
    let urlString = `https://www.youtube.com/embed/${param}`;
    let options =
      "?modestbranding=1&rel=0&controls=0&autoplay=1&autohide=1&fs=0&";
    let iframeString = `<iframe
    width="1320"
    height="720"
    src="${urlString}${options}"
    ></iframe>`;
    $(".youtube").html(iframeString);
  }
  function videoSelect() {
    $(".doctor-images").fadeOut("slow", function () {
      $(".doctor-videos").fadeIn("slow");
      $(".start").fadeIn();
    });
  }
  function adjustLogo(direction) {
    if (direction === "center") {
      $(".mes-logo")
        .css({
          position: "fixed",
          textAlign: "center",
          top: "120px",
          width: "300px",
          right: "840px"
        })
        .fadeIn("slow");
    }
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
    playState.screen = "videoPlayer";
    $(".doctor-videos").fadeOut("slow", function () {});
    $(".start").fadeOut("slow", function () {
      $(".video-list").css("display", "flex").hide().fadeIn("slow");
      playState.videosSelected.unshift({ name: "About", key: "FKdwndTViV0" });
      playState.videosSelected.push({
        name: "Aftercare",
        key: "IfaAiTRP_RE"
      });
      playState.videosSelected.map((item) => {
        $(".video-list").append(
          `<h3 key=${item.key} class="video-list-item">${item.name}</h3>`
        );
      });
      selectVideo(playState.videosSelected[0].key);
      $(".youtube").fadeIn("slow");
    });
    $(".delete-item").remove();
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
      {
        url: "https://img.youtube.com/vi/FKdwndTViV0/mqdefault.jpg?0.21588005185990977",
        key: "FKdwndTViV0"
      },
      "empty",
      {
        url: "https://img.youtube.com/vi/IfaAiTRP_RE/mqdefault.jpg?0.016445353745532576",
        key: "IfaAiTRP_RE"
      }
    ];
    bottomImages.map((item) => {
      !(item == "empty")
        ? $(".board-nav").append(
            `<img class="logo-img" key=${item.key} src="${item.url}"/>`
          )
        : $(".board-nav").append("<div class='empty'>");
    });
    $(".draggable").draggable({});
  }
  function addToPlayList(key, type) {
    $(".empty").append(
      `<div class="nav-entry">
        <i 
          key="${key}" 
          type="${type}" 
          class="delete-item fa 
          fa-times"></i>
        <img 
          class="logo-img" 
          key=${key} 
          src="https://img.youtube.com/vi/${key}/mqdefault.jpg"/>
      </div>`
    );
  }
  function reset() {
    playState.screen = "overview";
    $(".reset").fadeOut("slow");
    $(".video-list").fadeOut("slow");
    $(".youtube").fadeOut("slow", function () {
      playState.doctorSelected = null;
      playState.videosSelected = [];
      playState.screen = "overview";
      $(".empty").empty();
      $(".doctor-images").fadeIn("slow");
    });
  }
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
    if (playState.doctorSelected === null) {
      let key = $(this).attr("key");
      let name = $(this).attr("name");
      playState.doctorSelected = { key, name };
      playState.videosSelected.push({ key, name });
      playState.screen = "video-select";
      videoSelect();
      addToPlayList(playState.doctorSelected.key, "doctor");
    }
  });
  $("body").on("click", ".delete-item", function () {
    console.log("click");
    let type = $(this).attr("type");
    $(this).closest("div").remove();
    if (type === "doctor") {
      overview();
    } else if (type === "video") {
      let key = $(this).attr("key");
      $(".g-slide[key=" + key + "]").css("border", "none");
      playState.videosSelected = playState.videosSelected.filter(
        (item) => item.key != key
      );
    }
  });
  $("body").on("click", ".g-slide", function () {
    let key = $(this).attr("key");
    let name = $(this).attr("name");
    console.log(key);

    let alreadyExists = false;
    playState.videosSelected.filter((item) => {
      if (item.key === key) {
        alreadyExists = true;
      }
    });
    $(this).css("border", "5px solid black");
    if (!alreadyExists) {
      console.log("pushing");
      addToPlayList(key, "video");
      playState.videosSelected.push({ key, name });
    }
  });
  $(".start").on("click", function () {
    startPlaylist();
  });
  $(".reset").on("click", function () {
    reset();
  });
  $("body").on("click", ".logo-img, .video-list-item", function () {
    console.log($(this).attr("key"));
    if (playState.screen === "videoPlayer") {
      let key = $(this).attr("key");
      console.log(key);
      selectVideo(key);
    }
  });
  $("body").on("click", ".video-list-item", function () {
    $(".video-list-item").css({ color: "black", textDecoration: "none" });
    $(this).css({ color: "#51b3d0", textDecoration: "underline" });
  });

  instantiate();
});
