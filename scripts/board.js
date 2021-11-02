$(function () {
  let blockWidget = `
  <div
    style=" 
    width:120px;
    height: 120px;
    position:absolute;
    top: 0px;
    left: 0px;
    background:#09527f;
    color:white;
    display:flex;
    justify-content: center;
    align-items: center;
    "
    class="widget widget-resize"
    id="block"
  >
  
  This is the directory widget
  </div>
`;
  let siteMapWidget = `
  <div
    style="
    position:absolute;
    top: 0px;
    left: 0px;
    display: inline-block
  "
  class="widget"
  ><img style="width:100%;" src="./resources/images/fp.png"></div>
`;
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
        $(".board-content").append(blockWidget);
      } else if (data.widgetNumber === "add-widget-2") {
        $(".board-content").append(siteMapWidget);
      }
    } else if (data.task == "move") {
      $(".widget").draggable({
        grid: [30, 30],
        containment: ".board-content"
      });
      $(".widget-resize").resizable({
        grid: 30,
        containment: ".board-content",

        resize: function (e, element) {}
      });
      $(".widget").draggable("enable");
      $(".widget-resize").resizable("enable");
    } else if (data.task == "lockMove") {
      console.log("lock it down!");
      $(".widget").draggable("disable");
      $(".widget-resize").resizable("disable");
    } else if (data.task == "style") {
      $(".widget").addClass("stylable");
    }
  });
  $(document).on("click", ".stylable", function (e) {
    let id = $(this).attr("id");
    window.api.send("main", { toStyle: id });
  });
});
