import { $ } from "custom-electron-titlebar/common/dom";

export default class Widget {
  constructor(id, settings) {
    this.id = id;
    this.useDefault = settings.useDefault;
    this.widgetType = settings.widgetType;
    this.width = settings.width;
    this.height = settings.height;
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
        .html(
          '<img  style="width: 100%;" src="./resources/images/AdiuvoLogo.png"/>'
        )
        .css("display", "inline-block")
        .css("background", "rgba(255, 255, 255, 0.281")
        .addClass("image-widget");
    } else {
      $("#" + this.id)
        .css({ width: "120px", height: "120px" })
        .addClass("widget");
    }
    return this;
  }
}
