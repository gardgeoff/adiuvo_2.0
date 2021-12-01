const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  globalShortcut
} = require("electron");
const path = require("path");
const fs = require("fs");
const { initializeApp } = require("firebase/app");
const {
  getDatabase,
  set,
  ref,
  onValue,
  get,
  child
} = require("firebase/database");
// const data = require("./scripts/directory.json");
const mesDoctors = require("./scripts/mesDoctors.json");
const mesVideos = require("./scripts/mesVideos.json");
const settings = require("./applicationSettings.json");
const firebaseConfig = {
  apiKey: "AIzaSyDvvfr7ozt5go6IxXaX4kP9HghFpDwON1Q",
  authDomain: "adiuvo-6733c.firebaseapp.com",
  projectId: "adiuvo-6733c",
  storageBucket: "adiuvo-6733c.appspot.com",
  messagingSenderId: "332106134019",
  appId: "1:332106134019:web:b56c003653edf1c7ee5436"
};

// Initialize Firebase
let registered;
const fbApp = initializeApp(firebaseConfig);
const db = getDatabase(fbApp);
let baseRef = `/pi_${settings.piid}`;
let registerRef = ref(db, `${baseRef}/registered`);
let widgetRef = ref(db, `/${baseRef}/widgets`);
let directoryRef = ref(db, `${baseRef}/directory`);

let restartRef = ref(db, `/${baseRef}/restart`);

let win, toolbar;
function createToolBar() {
  if (toolbar == undefined) {
    toolbar = new BrowserWindow({
      width: 600,
      height: 240,
      frame: false,
      title: "toolbar",
      resizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, "./preload.js")
      },
      alwaysOnTop: true
    });
    toolbar.loadFile("toolbar.html");
    toolbar.openDevTools();
  }
}
async function createWindow() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "file",
        submenu: [
          {
            label: "reset",
            click() {
              app.relaunch();
              app.exit();
            }
          },
          {
            label: "quit",
            click() {
              app.quit();
            }
          }
        ]
      },
      {
        label: "edit",
        submenu: [
          {
            label: "toolbar",
            click() {
              createToolBar();
            }
          },
          {
            label: "dev tools",
            click() {
              win.openDevTools();
            }
          }
        ]
      },
      {
        label: "view",
        submenu: [
          {
            label: "fullscreen",
            click() {
              win.setFullScreen(true);
            }
          },
          {
            label: "show / hide grid",
            click() {
              win.webContents.send("fromMain", "toggleGrid");
            }
          }
        ]
      }
    ])
  );

  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,

      preload: path.join(__dirname, "./preload.js")
    }
  });

  win.loadFile("index.html");
  win.openDevTools();
}
app.whenReady().then(() => {
  createWindow();
  onValue(restartRef, (snap) => {
    let falseTrue = snap.val();
    if (falseTrue) {
      app.relaunch();
      app.exit();
    }
  });

  onValue(directoryRef, (snap) => {
    let objDir = snap.val();
    win.webContents.send("fromDash", {
      task: "directory",
      directory: objDir
    });
  });
  onValue(registerRef, (snap) => {
    let values = snap.val();
    registered = values;
    win.webContents.send("fromMain", {
      id: settings.piid,
      registered: registered
    });
  });
  onValue(widgetRef, (snap) => {
    let value = snap.val();

    win.webContents.send("fromDash", { task: "style", widgets: value });
  });

  globalShortcut.register("f5", () => {
    if (toolbar) {
      toolbar.reload();
    }
    win.reload();
  });
  globalShortcut.register("escape", () => {
    win.setFullScreen(false);
  });
  ipcMain.on("boardStart", (e, args) => {
    if (settings.boardType === "mes") {
      win.webContents.send("fromMain", {
        doctors: mesDoctors,
        videos: mesVideos,
        boardType: settings.boardType
      });
    }
  });
  ipcMain.on("board", (e, args) => {
    if (args.touches) {
      let data = JSON.parse(fs.readFileSync("applicationSettings.json"));
      let totalCount = (data.interactCount += args.touches);
      data.interactCount = totalCount;
      fs.writeFile("applicationSettings.json", JSON.stringify(data), (err) => {
        if (err) throw err;
      });
    }
  });
  ipcMain.on("toMain", (e, args) => {
    if (args.request === "id") {
      win.webContents.send("fromMain", {
        id: settings.piid,
        registered: registered
      });
    }
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
/*
get(directoryref, snap => {
  let map = snap.val();
  let returnArr = []

  map.map(item => {
    let totalObj = {}
    


  })
}) 
*/
