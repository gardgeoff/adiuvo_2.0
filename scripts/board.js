import Widget from "./Widget.js";
$(function () {
  let playState = {
    doctorSelected: null,
    videosSelected: [],
    currentVid: "",
    screen: "overview",
    hideAll: false
  };

  let interactCount = 0;
  let currentVid;
  let xGrid = 16;
  let yGrid = 9;
  let gridOn = true;
  if (gridOn) {
    for (var i = 0; i < yGrid; i++) {
      let newRow = `<div class="grid-row" id="row-${i}"></div>`;
      $("#render").append(newRow);
      for (var j = 0; j < xGrid; j++) {
        let newBox = `<div class="grid" ></div>`;
        $("#row-" + i).append(newBox);
      }
    }
  }
  $(document).on("keydown", function (e) {
    if (e.key === "k") {
      console.log("heyo");
      $(".html-5-video-player")
        .removeClass("playing-mode")
        .addClass("paused-mode");
    }
  });
  // knuth shuffle
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex]
      ];
    }

    return array;
  }
  function selectVideo(param) {
    let urlString = `https://www.youtube.com/embed/${param}`;
    let width = "1320";
    let height = "720";
    if (playState.hideAll == true) {
      width = "1920px";
      height = "1080";
    }
    let options =
      "?modestbranding=1&rel=0&controls=0&autoplay=1&autohide=1&fs=0&enablejsapi=1";
    let iframeString = `<iframe
    width=${width}
    height=${height}
    allowfullscreen
    class="iframe"
    src="${urlString}${options}"
    ></iframe>`;
    playState.currentVid = param;
    $(".youtube").html(iframeString);
  }
  $(".v-full").on("click", function () {
    let test = document.getElementsByTagName("iframe")[0];
    if (playState.hideAll == false) {
      $("iframe").css({
        width: "1920px",
        height: "1080px"
      });
      $(".youtube").css({
        left: "0px",
        top: "0px"
      });
      $(".video-controls").css({
        right: "10px",
        bottom: "10px"
      });
      $(".board-nav").hide();
      $(".video-list").hide();
      $(".reset").hide();
      playState.hideAll = true;
    } else if (playState.hideAll == true) {
      $("iframe").css({
        width: "1320px",
        height: "720px"
      });
      $(".youtube").css({
        left: "280px",
        top: "30px"
      });
      $(".video-controls").css({
        right: "320px",
        bottom: "330px"
      });
      $(".board-nav").show();
      $(".video-list").show();
      $(".reset").show();
      playState.hideAll = false;
    }
  });
  $(".v-next").on("click", function () {
    let currentVid = playState.currentVid;
    console.log(currentVid);
    let videos = playState.videosSelected;
    let index = videos.findIndex((item) => {
      if (item.key != undefined) {
        return item.key == currentVid;
      }
    });

    if (playState.videosSelected[index + 1].key != undefined) {
      index++;
    }
    selectVideo(playState.videosSelected[index].key);
  });
  $(".v-prev").on("click", function () {
    let currentVid = playState.currentVid;
    let videos = playState.videosSelected;
    let index = videos.findIndex((item) => {
      if (item.key != undefined) {
        return item.key == currentVid;
      }
    });
    if (playState.videosSelected[index - 1].key != undefined) {
      index--;
    }
    selectVideo(playState.videosSelected[index].key);
  });
  function procedureSelect() {
    $(".doctor-images").fadeOut("slow", function () {
      $(".procedure-videos").fadeIn("slow");
      $(".start").fadeIn();
    });
  }

  function overview() {
    playState.doctorSelected = null;
    playState.screen = "overview";
    playState.videosSelected = [];
    clearTimeout(timeId);
    startTimer();
    $(".g-slide").css("border", "none");
    $(".empty").empty();
    $(".start").fadeOut("slow");
    $(".procedure-videos").fadeOut("slow", function () {
      $(".doctor-images").fadeIn("slow");
    });
  }
  function startPlaylist() {
    playState.screen = "videoPlayer";
    $(".procedure-videos").fadeOut("slow", function () {});
    $(".start").fadeOut("slow", function () {
      $(".video-list").css("display", "flex").hide().fadeIn("slow");
      playState.videosSelected.unshift({ name: "About", key: "FKdwndTViV0" });
      playState.videosSelected.push({
        name: "Aftercare",
        key: "IfaAiTRP_RE"
      });
      playState.videosSelected.map((item) => {
        $(".video-list").append(
          `<h3 key=${item.key} class="video-list-item">${item.name}</h3>`
        );
      });
      selectVideo(playState.videosSelected[0].key);
      $(".youtube").fadeIn("slow");
      $(".video-controls").fadeIn("slow");
      $(".mes-logo").fadeIn("slow");
    });
    $(".delete-item").remove();
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

  function instantiate() {
    window.api.send("boardStart", true);
  }
  window.api.receive("fromMain", (data) => {
    if (data === "toggleGrid") {
      toggleGrid();
    }

    if (data.boardType === "mes") {
      stageMes(data);
    }
  });
  let timeCounter = 5000;
  let timeId;
  function startTimer() {
    timeId = window.setTimeout(() => toggleScreenSaver(true), timeCounter);
  }
  function toggleScreenSaver(on) {
    if (on) {
      if (playState.screen === "overview") {
        playState.screen = "screensaver";

        $(".screensaver").css("z-index", 1000).animate(
          {
            opacity: 1
          },
          1000
        );
        $(".top-images").animate(
          {
            top: "25px"
          },
          1000
        );
        $(".bottom-images").animate(
          {
            bottom: "25px"
          },
          1000
        );
        $(".banner").animate(
          {
            height: "480px",
            top: "12%"
          },
          500
        );
      }
    } else {
      playState.screen = "overview";

      $(".banner").animate(
        {
          height: "0px",
          top: "35%"
        },
        500,
        function () {
          $(".top-images").animate(
            {
              top: "-500px"
            },
            1000
          );
          $(".bottom-images").animate(
            {
              bottom: "-500px"
            },
            1000
          );
          $(".screensaver").animate(
            {
              opacity: 0
            },
            1000,
            function () {
              $(".screensaver").css("z-index", -1);
            }
          );
        }
      );

      startTimer();
    }
  }
  startTimer();
  function stageMes(data) {
    let totalImages = [
      `<img class="insta"  src="./resources/images/slides/80r08ucx.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/di2ebmix.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/dr71ty5r.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/dvrm5h9u.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/ijk1slio.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/iwu2u19c.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/jnm1bnfi.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/mjx2wub9.bmp" alt="">`,
      `<img class="insta" src="./resources/images/slides/q8ipjzz4.bmp" alt="">`
    ];
    let awardImages = [
      `<img class="award" src="./resources/images/logos/2019logo.webp" alt="">`,
      `<img class="award" src="./resources/images/logos/2019readerslogo.webp" alt="">`,
      `<img class="award" src="./resources/images/logos/2020FavoriteReadersChoice-1024x1024-removebg-preview.png" alt="">`,
      `<img class="award" src="./resources/images/logos/2020WinnerReadersChoice-1024x1024-removebg-preview.png" alt="">`,
      `<img class="award" src="./resources/images/logos/bestbusiness2020.webp" alt="">`,
      `<img class="award" src="./resources/images/logos/emilhannabimd-tucson.webp" alt="">`,
      `<img class="award" src="./resources/images/logos/MicrosoftTeams-image-3-1024x846.png" alt="">`,
      `<img class="award" src="./resources/images/logos/ReadersChoice-BestOfTucsonAward-thumb-removebg-preview.png" alt="">`,
      `<img class="award" src="./resources/images/logos/threebestaward.webp" alt="">`,
      `<img class="award" src="./resources/images/logos/threebestaward2020.webp" alt="">`,
      `<img class="award" src="./resources/images/logos/top32020-1024x1024-removebg-preview.png" alt="">`
    ];

    shuffle(awardImages);
    let quality = "mqdefault";
    console.log(data);
    data.doctors.map((item) => {
      let src = `https://img.youtube.com/vi/${item.key}/${quality}.jpg`;
      let imgString = `
      <img 
        src="${src}"/>
      `;
      totalImages.push(imgString);
    });
    data.videos.map((item) => {
      let src = `https://img.youtube.com/vi/${item.key}/${quality}.jpg`;
      let imgString = `
      <img 
        src="${src}"/>
      `;
      totalImages.push(imgString);
    });
    shuffle(totalImages);
    let half = Math.ceil(totalImages.length / 2);

    let topGlideBase = `
    <div class="glide screen-top-glide">
      <div class="glide__track" data-glide-el="track">
        <ul class="tgs glide__slides"></ul>
      </div>
    </div>
    `;
    let bottomGlideBase = `
    <div class="glide screen-bottom-glide">
      <div class="glide__track" data-glide-el="track">
        <ul class="bgs glide__slides"></ul>
      </div>
    </div>
    `;
    $(".top-images").html(topGlideBase);
    $(".bottom-images").html(bottomGlideBase);

    totalImages.map((item) => {
      let topImage = `<li class="center-me glide__slide">${item}</li>`;
      $(".tgs").append(topImage);
    });
    awardImages.map((item) => {
      let bottomImage = `<li class="center-me glide__slide">${item}</li>`;
      $(".bgs").append(bottomImage);
    });

    new Glide(".screen-bottom-glide", {
      type: "carousel",
      perView: 5,
      autoplay: 0.1,
      animationDuration: 10000,
      animationTimingFunc: "linear"
    }).mount();
    new Glide(".screen-top-glide", {
      type: "carousel",
      perView: 5,
      autoplay: 0.1,
      animationDuration: 10000,
      direction: "rtl",
      animationTimingFunc: "linear"
    }).mount();
    let docImages = new Widget(Date.now(), {
      className: "doctor-images",
      widgetType: "mesImages",
      imageArr: data.doctors
    }).createWidget();
    if (data.doctors.length > 24) {
      $(".doctor-image-container").css({
        width: "240px"
      });
    }
    console.log(data.videos);
    let videoSlide = new Widget(Date.now(), {
      className: "procedure-videos",
      widgetType: "mesImages",
      imageArr: data.videos,
      hidden: true
    }).createWidget();
    let bottomImages = [
      {
        url: "https://img.youtube.com/vi/FKdwndTViV0/mqdefault.jpg?0.21588005185990977",
        key: "FKdwndTViV0"
      },
      "empty",
      {
        url: "https://img.youtube.com/vi/IfaAiTRP_RE/mqdefault.jpg?0.016445353745532576",
        key: "IfaAiTRP_RE"
      }
    ];
    bottomImages.map((item) => {
      !(item == "empty")
        ? $(".board-nav").append(
            `<img class="logo-img" key=${item.key} src="${item.url}"/>`
          )
        : $(".board-nav").append("<div class='empty'>");
    });
  }

  function addToPlayList(key, type) {
    $(".empty").append(
      `<div class="nav-entry">
        <i 
          key="${key}" 
          type="${type}" 
          class="delete-item fa 
          fa-times"></i>
        <img 
          class="logo-img" 
          key=${key} 
          src="https://img.youtube.com/vi/${key}/mqdefault.jpg"/>
      </div>`
    );
  }
  function reset() {
    $(".video-controls").fadeOut("slow");
    $(".mes-logo").fadeOut("slow");
    playState.screen = "overview";
    $(".reset").fadeOut("slow");
    $(".g-slide").css("border", "none");
    $(".video-list").fadeOut("slow");
    $(".video-list").empty();
    $(".youtube").fadeOut("slow", function () {
      playState.doctorSelected = null;
      playState.videosSelected = [];
      console.log(playState.videosSelected);
      playState.screen = "overview";
      $(".empty").empty();
      $(".doctor-images").fadeIn("slow");
    });
    clearTimeout(timeId);
    startTimer();
  }
  let slideCount = 0;
  $(".fa-circle-arrow-right").on("click", function () {
    $(this).attr("data-glide-dir", slideCount + 2);
  });
  window.api.receive("fromDash", (data) => {
    if (data.task === "style") {
      let selectors = data.widgets;
      let bg = "background";
      let font = "color";
      for (let item in selectors) {
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
      }
    } else if (data.task === "directory") {
      if ($(".directory").length) {
        $(".directory").remove();
      }

      let dir = [];

      for (let item in data.directory) {
        dir.push(data.directory[item]);
      }
      dir.shift();
      dir.sort((a, b) => a.number - b.number);

      let directory = new Widget(Date.now(), {
        className: "directory",
        widgetType: "directory",
        directory: dir,
        left: "0px",
        top: "0px",
        width: "1530px",
        height: "910px"
      }).createWidget();
    } else if (data.task === "updateDoc") {
      let docs = [];
      for (let item in data.docs) {
        docs.push(data.docs[item]);
      }

      $(".doctor-images").remove();
      new Widget(Date.now(), {
        className: "doctor-images",
        widgetType: "mesImages",
        imageArr: docs
      }).createWidget();
      if (docs.length > 24) {
        $(".doctor-image-container").css({ width: "240px" });
      }
    } else if (data.task == " updateProcedures") {
      let procedures = [];

      for (let item in data.procedures) {
        procedures.push(data.procedures[item]);
      }
      $(".procedure-videos").remove();
      new Widget(Date.now(), {
        className: "doctor-videos",
        widgetType: "mesImages",
        imageArr: procedures,
        hidden: true
      }).createWidget();
    }
  });
  $("body").on("click", ".doctor-img", function () {
    if (playState.doctorSelected === null) {
      let key = $(this).attr("key");
      let name = $(this).attr("name");
      playState.doctorSelected = { key, name };
      playState.videosSelected.push({ key, name });
      playState.screen = "video-select";
      procedureSelect();
      addToPlayList(playState.doctorSelected.key, "doctor");
    }
  });
  $("body").on("click", ".delete-item", function () {
    let type = $(this).attr("type");
    $(this).closest("div").remove();
    if (type === "doctor") {
      overview();
    } else if (type === "video") {
      let key = $(this).attr("key");
      $(".g-slide[key=" + key + "]").css("border", "none");
      playState.videosSelected = playState.videosSelected.filter(
        (item) => item.key != key
      );
    }
  });
  $("body").on("click", ".g-slide", function () {
    let key = $(this).attr("key");
    let name = $(this).attr("name");

    let alreadyExists = false;
    playState.videosSelected.filter((item) => {
      if (item.key === key) {
        alreadyExists = true;
      }
    });
    $(this).css("border", "4px solid #103E68");
    if (!alreadyExists) {
      addToPlayList(key, "video");
      playState.videosSelected.push({ key, name });
    }
  });
  $(".start").on("click", function () {
    startPlaylist();
  });
  $(".reset").on("click", function () {
    reset();
  });
  $("body").on("click", ".logo-img, .video-list-item", function () {
    console.log($(this).attr("key"));
    if (playState.screen === "videoPlayer") {
      let key = $(this).attr("key");
      console.log(key);
      selectVideo(key);
    }
  });
  $("body").on("click", ".video-list-item", function () {
    $(".video-list-item").css({ color: "black", textDecoration: "none" });
    $(this).css({ color: "#51b3d0", textDecoration: "underline" });
  });
  $(document).on("click", function () {
    if (playState.screen === "overview") {
      clearTimeout(timeId);
      startTimer();
    }
    if (playState.screen === "screensaver") {
      toggleScreenSaver(false);
    }
  });

  instantiate();
});
