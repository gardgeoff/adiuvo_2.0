const { contextBridge, ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = [
      "closeWin",
      "toolbar",
      "board",
      "toMain",
      "boardStart"
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromToolbar", "fromBoard", "fromMain", "fromDash"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});
