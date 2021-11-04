export default class Widget {
  constructor(id, settings) {
    this.id = id;
    this.useDefault = settings.useDefault;
    this.widgetType = settings.widgetType;
    this.width = settings.width;
    this.height = settings.height;
    this.directory = settings.directory;
    this.xPos = settings.left;
    this.yPos = settings.top;
    this.movable = settings.movable;
    this.resizable = settings.resizable;
    this.isImage = settings.isImage;
    this.baseWidget = `<div id="${id}">Widget</div>`;
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
      background: "#09527f",
      color: "white"
    });
    if (this.widgetType == "image") {
      $("#" + this.id)
        .html('<img  style="width: 100%;" src="./resources/images/fp.png"/>')
        .css({
          display: "inline-block",
          position: "fixed",
          background: "rgba(255, 255, 255, 0.281)"
        })
        .addClass("image-widget");
    } else if (this.widgetType == "directory") {
      let listString = "";

      this.directory.map((item) => {
        let newLine = `<ul><li>${item.name}</li><li>${item.owner}</li><li>${item.phone}</li></ul>`;
        console.log(newLine);
        listString += newLine;
      });
      console.log(listString);

      $("#" + this.id)
        .html(listString)
        .addClass("widget")
        .css({
          fontSize: "16px !important",
          minWidth: "120px",
          width: "120px",
          height: "120px",
          display: "flex",
          alignItems: "center",
          flexFlow: "column wrap",
          overflow: "hidden",
          justifyContent: "center",
          float: "left"
        });

      $("#" + this.id > "ul").css({
        padding: "5px"
      });
      let remainder = $("#" + this.id).height() % 120;
      let newHeight = $("#" + this.id).height() + (120 - remainder);
      $("#" + this.id).css("height", newHeight);
    } else {
      $("#" + this.id)
        .css({ width: "120px", height: "120px" })
        .addClass("widget");
    }
    return this;
  }
}
