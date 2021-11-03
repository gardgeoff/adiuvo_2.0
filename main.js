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
const firebaseConfig = {
  apiKey: "AIzaSyDvvfr7ozt5go6IxXaX4kP9HghFpDwON1Q",
  authDomain: "adiuvo-6733c.firebaseapp.com",
  projectId: "adiuvo-6733c",
  storageBucket: "adiuvo-6733c.appspot.com",
  messagingSenderId: "332106134019",
  appId: "1:332106134019:web:b56c003653edf1c7ee5436"
};

// Initialize Firebase

const fbApp = initializeApp(firebaseConfig);

const db = getDatabase(fbApp);
set(ref(db, "/pi_12314"), {
  name: "mypi"
});
let win, toolbar, slider;

function createToolBar() {
  if (toolbar == undefined) {
    toolbar = new BrowserWindow({
      width: 600,
      height: 180,
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
  ipcMain.on("main", (e, args) => {
    toolbar.focus();
    toolbar.webContents.send("fromMain", args);
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("toMain", (e, args) => {});
