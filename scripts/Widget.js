export default class Widget {
  constructor(id, settings) {
    this.id = id;
    this.className = settings.className;
    this.useDefault = settings.useDefault;
    this.widgetType = settings.widgetType;
    this.width = settings.width;
    this.height = settings.height;
    this.directory = settings.directory;
    this.doctors = settings.doctors;
    this.videos = settings.videos;
    this.xPos = settings.left;
    this.yPos = settings.top;
    this.movable = settings.movable;
    this.resizable = settings.resizable;
    this.isImage = settings.isImage;
    this.baseWidget = `<div class="${this.className}" id="${id}">Widget</div>`;
    this.defaultSettings = {
      width: "120px",
      height: "120px",
      top: "0px",
      left: "0px"
    };
  }
  setAsDefault() {
    this.width = this.defaultSettings.width;
    this.height = this.defaultSettings.height;
    this.yPos = this.defaultSettings.top;
    this.xPos = this.defaultSettings.left;
    return this;
  }
  createWidget() {
    $(".board-content").append(this.baseWidget);
    $("#" + this.id).css({
      top: this.yPos,
      left: this.xPos,
      width: this.width,
      height: this.height,
      // background: "#09527f",,
      background: "none",
      color: "white"
    });
    if (this.widgetType == "sitemap") {
      $("#" + this.id)
        .html('<img  style="width: 100%;" src="./resources/images/fp.png"/>')
        .css({
          display: "inline-block",
          position: "fixed"
          // background: "rgba(255, 255, 255, 0.281)"
        })
        .addClass("image-widget");
    } else if (this.widgetType == "directory") {
      let listString = "";

      this.directory.map((item) => {
        let flex = `<div class="${item.category} directory-item align-items-center justify-content-between"><h2>${item.number}</h2><div><ul><li>${item.name}</li><li>${item.owner}</li><li>${item.contact}</li></ul></div></div>`;
        let newLine = `<ul><li>${item.name}</li><li>${item.owner}</li><li>${item.contact}</li></ul>`;
        listString += flex;
      });
      $("#" + this.id)
        .html(listString)
        .addClass("widget")
        .css({
          fontSize: "16px !important",
          minWidth: "120px",
          display: "flex",
          alignItems: "start",
          flexFlow: "column wrap",
          overflow: "hidden",
          position: "absolute",
          justifyContent: "start",
          float: "left",
          alignContent: "start"
        });
      $("#" + this.id > "ul").css({
        padding: "5px"
      });
      let remainder = $("#" + this.id).height() % 120;
      let newHeight = $("#" + this.id).height() + (120 - remainder);
      $("#" + this.id).css("height", newHeight);
    } else if (this.widgetType === "mesImages") {
      let totalImages = "";
      let count = 1;
      this.doctors.map((item) => {
        let image = `<div style="margin: 10px" class="doctor-image-container"><img class="doctor-img" key=${item.key} src="https://img.youtube.com/vi/${item.key}/maxresdefault.jpg"/></div>`;
        totalImages += image;
      });

      console.log(totalImages);
      $("#" + this.id).html(totalImages);
      $("#" + this.id)
        .css({
          display: "flex",
          alignItems: "start",
          flexFlow: " wrap",
          overflow: "hidden",
          position: "absolute",
          justifyContent: "start",

          alignContent: "start"
        })
        .addClass("resizable")
        .addClass("sortable")
        .addClass("draggable");
    } else {
      $("#" + this.id)
        .css({ width: "120px", height: "120px" })
        .addClass("widget");
    }
    $("#" + this.id).addClass(this.className);
    return this;
  }
}
