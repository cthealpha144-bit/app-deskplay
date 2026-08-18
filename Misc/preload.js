const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("deskplayAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getDisplays: () => ipcRenderer.invoke("get-displays"),
  setDisplay: (params) => ipcRenderer.invoke("set-display", params),
});
