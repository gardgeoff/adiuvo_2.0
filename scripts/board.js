$(function () {
  let blockWidget = `
  <div
    style="
    width: 120px; 
    height:120px;
    position:absolute;
    top: 0px;
    left: 0px;
    background:#09527f;
    color:white;
    display:flex;
    justify-content: center;
    align-items: center;
    "
    class="widget"
  >Widget 1</div>
`;
  let imageWidget = `<div
style="
width: 120px; 
height:120px;
position:absolute;
top: 0px;
left: 0px;

display: inline-block
"
class="widget resizable draggable"
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

  function frito(draggable, resizable) {
    if (draggable) {
      $(".draggable").draggable({});
    }
    if (resizable) {
      $(".resizable").resizable({});
    }
  }

  window.api.receive("fromMain", (data) => {
    console.log(data);
    if (data.task == "create") {
      if (data.widgetNumber == "add-widget-1") {
        $(".board-content").append(blockWidget);
      } else if (data.widgetNumber === "add-widget-2") {
        $(".board-content").append(imageWidget);
      }
    } else if (data.task == "move") {
      $(".widget")
        .draggable({
          grid: [30, 30],
          containment: ".board-content"
        })
        .resizable({
          grid: 30,
          containment: ".board-content",

          resize: function (e, element) {}
        });
      $(".widget").draggable("enable").resizable("enable");
    } else if (data.task == "lockMove") {
      console.log("lock it down!");
      $(".widget").draggable("disable").resizable("disable");
    }
  });
  $(".img-map").maphilight();
});
{
  /*  */
}
