export default class Widget {
  constructor(id, settings) {
    this.id = id;
    this.className = settings.className;
    this.useDefault = settings.useDefault;
    this.widgetType = settings.widgetType;
    this.width = settings.width;
    this.hidden = settings.hidden;
    this.height = settings.height;
    this.directory = settings.directory;
    this.imageArr = settings.imageArr;
    this.videos = settings.videos;
    this.xPos = settings.left;
    this.yPos = settings.top;
    this.isImage = settings.isImage;
    this.baseWidget = `<div class="${this.className}" id="${id}"></div>`;
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
      if (this.className === "doctor-images") {
        let totalImages = "";
        let count = 1;
        this.imageArr.map((item) => {
          console.log(item.name);
          let image = `<div style="margin: 10px" class="doctor-image-container"><img name="${item.name}" class="doctor-img" key=${item.key} src="https://img.youtube.com/vi/${item.key}/maxresdefault.jpg"/></div>`;
          totalImages += image;
        });

        console.log(totalImages);
        $("#" + this.id).html(totalImages);
        $("#" + this.id).css({
          display: "flex",
          flexFlow: " wrap",
          overflow: "hidden",
          position: "absolute",

          alignContent: "start"
        });
      } else if (this.className === "procedure-videos") {
        let glideBase = `
        <div class="glide vid-select-glide">
          <div class="glide__track" data-glide-el="track">
            <ul class="big-carousel glide__slides">

            </ul>
          </div>
          <div class="glide-controls glide__arrows" data-glide-el="controls">
            <button class="glide-arrow glide__arrow glide__arrow--left" data-glide-dir="<"><i class="fa fa-arrow-circle-left"></i></button>
            <button class="glide-arrow glide__arrow glide__arrow--right" data-glide-dir=">"><i class="fa fa-arrow-circle-right"></i></button>
          </div>
        </div>`;
        $("#" + this.id).append(glideBase);
        this.imageArr.map((item) => {
          let carouselSlide = `
          <li key=${item.key}  name="${item.name}" class="g-slide glide__slide">
            <img class="glide-image" src="https://img.youtube.com/vi/${item.key}/maxresdefault.jpg" />
          </li>`;
          $(".big-carousel").append(carouselSlide);
        });
        new Glide(".vid-select-glide", {
          focusAt: "center",
          perView: 3,
          peek: 100,
          startAt: 1
        }).mount();
      }
    } else {
      $("#" + this.id)
        .css({ width: "120px", height: "120px" })
        .addClass("widget");
    }
    $("#" + this.id).addClass(this.className);
    if (this.hidden) {
      $("#" + this.id).css("display", "none");
    }
    return this;
  }
}
