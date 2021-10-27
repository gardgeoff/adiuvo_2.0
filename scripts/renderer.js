$(function () {
  let renderString = `  <div class="" id="styling-settings">
          <div class="style-group">
            <i class="close-settings right-corner fa fa-times"></i>
            <label>Font Color</label>
            <input class="font-color" type="color" />
          </div>
          <div class="style-group">
            <label>Background Color</label>
            <input class="bg-color" type="color" />
          </div>
        </div>
        <div widgetName="hello-widget" class="widget" id="directory-widget">
          <div class="p3">
            <h1>This is a widget</h1>
            <i class="widget-style fa fa-cog"></i>
            <h3>Drag me around!</h3>
            <h3>Width: <span id="widget-width"></span></h3>
            <h3>Height: <span id="widget-height"></span></h3>
          </div>
        </div>
        <div id="image-widget" class="widget">
          <i class="widget-style fa fa-cog"></i>
        </div>

        <div id="sitemap-widget" class="widget">
          <img class="img-map" src="./resources/images/fp.png" usemap="#map" />
          <map name="map">
            <area
              shape="poly"
              coords="112,314,166,315,165,269,118,269,114,288,111,289"
              nohref="nohref"
            />
            <area
              shape="poly"
              coords="73,356,78,333,79,300,72,294,20,294,20,357"
              nohref="nohref"
            />
            <area shape="rect" coords="111,319,166,365" nohref="nohref" />
            <area
              shape="poly"
              coords="73,361,22,361,21,361,20,406,79,405,79,394,78,383"
              nohref="nohref"
            />
          </map>
        </div>`;
  let currentScreen;
  let editMode = true;
  let xGrid = 16;
  let yGrid = 9;
  const stylingState = {
    widgetSelected: "",
    widgetBgColor: "",
    widgetFontColor: ""
  };

  $("body").on("click", ".grid", function (e) {
    console.log(e);
  });

  const defaultSetup = [
    {
      id: "sitemap-widget",
      posX: 1416,
      posY: 240
    },
    {
      id: "directory-widget",
      width: 840,
      height: 720,
      posX: 0,
      posY: 120,
      resizable: true
    },
    {
      id: "image-widget",
      width: 240,
      height: 240,
      resizable: true
    }
  ];
  function runDefault(options, string) {
    console.log(string);
    $("#inner-render").html(string);
    options.map((item) => {
      let selector = item.id;
      let fromTop = item.posY;
      let fromLeft = item.posX;
      if (item.width && item.height) {
        $("#" + selector).css("width", item.width);
        $("#" + selector).css("height", item.height);
      }
      if (item.resizable) {
        $("#" + selector).addClass("resizable");
      }
      $("#" + selector).addClass("draggable");
      $("#" + selector).css("top", fromTop);
      $("#" + selector).css("left", fromLeft);
    });
  }
  runDefault(defaultSetup);
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
  function createStyleWindow() {
    $("#styling-settings").fadeIn("fast", function () {
      $(".bg-color").val(stylingState.widgetBgColor);
      $(".font-color").val(stylingState.widgetFontColor);
    });
  }
  function closeStyleWindow() {
    $("#styling-settings").fadeOut("fast", function () {
      stylingState.widgetSelected = "";
      stylingState.widgetBgColor = "";
      stylingState.widgetFontColor = "";
    });
  }

  $(".draggable").draggable({
    grid: [30, 30],
    containment: "#inner-render"
  });
  $(".resizable").resizable({
    grid: 30,
    containment: "#inner-render",
    resize: function (e, element) {
      console.log(e);
      let currentHeight = element.size.height;
      let currentWidth = element.size.width;
      $("#widget-width").html(currentWidth);
      $("#widget-height").html(currentHeight);
    }
  });
  for (var i = 0; i < yGrid; i++) {
    let newRow = `<div class="row" id="row-${i}"></div>`;
    $("#render").append(newRow);
    for (var j = 0; j < xGrid; j++) {
      let newBox = `<div class="grid" ></div>`;
      $("#row-" + i).append(newBox);
    }
  }
  // jquery listeners
  $(".bg-color").on("change", function () {
    let widget = stylingState.widgetSelected;
    let currentColor = $(this).val();
    $("#" + widget).css("backgroundColor", currentColor);
  });
  $(".font-color").on("change", function () {
    let widget = stylingState.widgetSelected;
    let currentColor = $(this).val();
    $("#" + widget).css("color", currentColor);
  });

  $(".widget-style").on("click", function () {
    stylingState.widgetSelected = $(this).closest(".widget").attr("id");
    stylingState.widgetBgColor = rgba2hex(
      $(this).closest(".widget").css("backgroundColor")
    );
    stylingState.widgetFontColor = rgba2hex(
      $(this).closest(".widget").css("color")
    );
    createStyleWindow();
  });
  $(".close-settings").on("click", function () {
    closeStyleWindow();
  });
  $("html").on("keydown", function (e) {
    if (e.key === "Escape") {
      remote.getCurrentWindow().isFullScreen(false);
    }
  });

  // Global function calls
  $(".img-map").maphilight();
});
