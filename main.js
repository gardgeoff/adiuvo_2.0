const { app, BrowserWindow, Menu } = require("electron");

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
  let toolBar = new BrowserWindow({
    width: 600,
    height: 360,
    frmae: false,
    autoHideMenuBar: true
  });
  toolbar.loadFile("toolbar.html");
}
function createWindow() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        role: "appMenu",
        submenu: [
          {
            label: "reset",
            click() {
              app.relaunch();
              app.exit();
            }
          }
        ]
      }
    ])
  );
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: true
    }
  });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
