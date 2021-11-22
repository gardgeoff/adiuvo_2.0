import Widget from "./Widget.js";

$(function () {
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
  toggleGrid();
  function isOverflown(element) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
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
  let siteMap = new Widget(Date.now(), {
    widgetType: "sitemap",
    top: "240px",
    left: "1500px",
    className: "sitemap"
  }).createWidget();
  window.api.send("toMain", { request: "directory" });
  window.api.receive("fromMain", (data) => {
    console.log(data);
    if (typeof data === "object") {
      directoryData = data;
      let directory = new Widget(Date.now(), {
        className: "directory",
        widgetType: "directory",
        directory: directoryData,
        left: "0px",
        top: "0px",
        width: "1530px",
        height: "910px"
      }).createWidget();
    } else if (data === "toggleGrid") {
      toggleGrid();
    }
  });

  window.api.receive("fromDash", (data) => {
    console.log(data.task);
    if (data.task === "create") {
      if (data.widgetNumber === "add-widget-1") {
        new Widget(Date.now(), {
          widgetType: "directory",
          directory: directoryData
        }).createWidget();
      } else if (data.widgetNumber === "add-widget-2") {
        new Widget(Date.now(), {
          widgetType: "image",
          useDefault: true
        }).createWidget();
      }
    }
    if (data.task === "move") {
      $(".widget, .image-widget").draggable({
        grid: [30, 30],
        containment: ".board-content"
      });
      $(".widget").resizable({
        grid: 10,
        containment: ".board-content"
      });
      $(".image-widget").resizable({
        grid: 30,
        containment: ".board-content",
        alsoResize: ".image-widget > image",
        aspectRatio: true
      });
      $(".widget, .image-widget").draggable("enable");
      $(".widget").resizable("enable");
    } else if (data.task === "lockMove") {
      console.log("lock it down!");
      $(".widget, .image-widget").draggable("disable");
      $(".widget").resizable("disable");
    } else if (data.task === "style") {
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
    }
  });
  $(document).on("click", ".stylable", function (e) {
    let id = $(this).attr("id");
    let font = rgba2hex($(this).css("color"));
    let bg = rgba2hex($(this).css("background-color"));
    window.api.send("board", { toStyle: id, fontColor: font, background: bg });
    styling = false;
    $(".widget").removeClass("stylable");
  });
  $("#filter-1").on("click", function () {
    $(".directory-item").hide(() => {
      $(".cat_1").show();
    });
  });
  $("#filter-2").on("click", function () {
    $(".directory-item").hide(() => {
      $(".cat_2").show();
    });
  });
  $("#filter-show").on("click", function () {
    $(".directory-item").show();
  });
  $(document).on("click", () => {
    interactCount++;
  });
  setInterval(() => {
    window.api.send("board", { touches: interactCount });
    interactCount = 0;
  }, 10000);
});
