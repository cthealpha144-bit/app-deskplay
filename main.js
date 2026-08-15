const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 725,
    minHeight: 500,
    resizable: true,
    title: "DeskPlay",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile("displays.html");
}

ipcMain.handle("get-app-version", () => app.getVersion());

ipcMain.handle("check-for-updates", async () => {
  try {
    const result = await autoUpdater.checkForUpdates();

    if (!result || !result.updateInfo) {
      return {
        status: "up-to-date",
        version: app.getVersion(),
      };
    }

    const latestVersion = result.updateInfo.version;

    if (latestVersion === app.getVersion()) {
      return {
        status: "up-to-date",
        version: app.getVersion(),
      };
    }

    return {
      status: "update-available",
      version: latestVersion,
    };
  } catch (error) {
    console.error("Update check failed:", error);

    return {
      status: "error",
      message: error.message,
    };
  }
});

app.whenReady().then(() => {
  createWindow();

  // Automatically check when DeskPlay starts
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall(false, true);
});
