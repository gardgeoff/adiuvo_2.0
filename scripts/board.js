import Widget from "./Widget.js";
$(function () {
  let xGrid = 16;
  let yGrid = 9;
  for (var i = 0; i < yGrid; i++) {
    let newRow = `<div class="grid-row" id="row-${i}"></div>`;
    $("#render").append(newRow);
    for (var j = 0; j < xGrid; j++) {
      let newBox = `<div class="grid" ></div>`;
      $("#row-" + i).append(newBox);
    }
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

  window.api.receive("fromToolbar", (data) => {
    console.log(data);
    if (data.task == "create") {
      if (data.widgetNumber == "add-widget-1") {
        new Widget(Date.now(), {
          useDefault: true
        }).createWidget();
      } else if (data.widgetNumber === "add-widget-2") {
        new Widget(Date.now(), {
          widgetType: "image",
          useDefault: true
        }).createWidget();
      }
    } else if (data.task == "move") {
      $(".widget, .image-widget").draggable({
        grid: [30, 30],
        containment: ".board-content"
      });
      $(".widget").resizable({
        grid: 30,
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
    } else if (data.task == "lockMove") {
      console.log("lock it down!");
      $(".widget, .image-widget").draggable("disable");
      $(".widget").resizable("disable");
    } else if (data.task == "style") {
      $(".widget").addClass("stylable");
    }
  });
  $(document).on("click", ".stylable", function (e) {
    let id = $(this).attr("id");
    window.api.send("main", { toStyle: id });
  });
});
