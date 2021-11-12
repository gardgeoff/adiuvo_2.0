const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  globalShortcut
} = require("electron");
const path = require("path");
const { initializeApp } = require("firebase/app");
const { getDatabase, set, ref, onValue } = require("firebase/database");
const data = require("./scripts/directory.json");
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
const registerRef = ref(db, `/pi_${settings.piid}/registered`);
const fontColorRef = ref(db, `/pi_${settings.piid}/`);

let win, toolbar, slider;
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
  onValue(registerRef, (snap) => {
    let values = snap.val();
    registered = values;
    win.webContents.send("fromMain", {
      id: settings.piid,
      registered: registered
    });
  });
  onValue(fontColorRef, (snap) => {
    let value = snap.val();
    win.webContents.send("fromDash", { task: "fontColor", color: value });
    console.log(`Font color: ${value}`);
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
  ipcMain.on("closeWin", (e, args) => {
    toolbar.close();
    toolbar = undefined;
  });
  ipcMain.on("toolbar", (e, args) => {
    win.focus();
    win.webContents.send("fromToolbar", args);
  });
  ipcMain.on("board", (e, args) => {
    toolbar.focus();
    toolbar.webContents.send("fromBoard", args);
  });
  ipcMain.on("toMain", (e, args) => {
    if (args.request === "id") {
      console.log("requesting id, sending id");
      win.webContents.send("fromMain", {
        id: settings.piid,
        registered: registered
      });
    } else if (args.request === "directory") {
      win.webContents.send("fromMain", data);
    }
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
