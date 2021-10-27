const { app, BrowserWindow } = require("electron");

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
function createWindow() {
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
