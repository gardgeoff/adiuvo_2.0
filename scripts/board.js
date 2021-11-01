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

  function frito(draggable, resizable) {
    if (draggable) {
      $(".draggable").draggable({
        grid: [30, 30],
        containment: ".board-content"
      });
    }
    if (resizable) {
      $(".resizable").resizable({
        grid: 30,
        containment: ".board-content",

        resize: function (e, element) {}
      });
    }
  }

  $(".board-content").on("mousedown", function (e) {
    if (e.which == 3) {
      console.log("right mouse click");
      let x = e.pageX;
      let y = e.pageY;
      console.log(`x: ${x} y:${y}`);
      x = Math.ceil(x / 120) * 120;
      y = Math.ceil(y / 120) * 120;
      console.log(`x: ${x} y:${y}`);
      console.log(x);
      let newWidget = `
      <div
        style="
        width: 120px; 
    
        position:absolute;
        top: ${y - 120}px;
        left: ${x - 120}px;
        
        display: inline-block
        "
        class="widget resizable draggable"
      ><img style="width:100%;" src="./resources/images/AdiuvoLogo.png"></div>
    `;
      $(this).append(newWidget);
      frito(true, true);
    }
  });

  $(".img-map").maphilight();
});
