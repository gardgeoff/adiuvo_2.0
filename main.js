const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  globalShortcut
} = require("electron");

const path = require("path");

let win, toolbar, slider;
const template = [
  {
    label: "View",
    submenu: [
      {
        label: "Edit Mode",
        click() {
          enterEdit();
        }
      }
    ]
  }
];
function createToolBar() {
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
  });
  ipcMain.on("toolbar", (e, args) => {
    console.log("hey");
    win.webContents.send("fromMain", args);
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("toMain", (e, args) => {});
