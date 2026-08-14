const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    minWidth: 600,
    minHeight: 400,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
}

// IPC listener to send the current version string to the frontend
ipcMain.handle("get-app-version", () => app.getVersion());

app.whenReady().then(() => {
  createWindow();

  // Automatically check for updates on startup
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Automatically install and restart when an update is ready
autoUpdater.on("update-downloaded", () => {
  // Gracefully quit the app and run the installer immediately
  autoUpdater.quitAndInstall(false, true);
});
