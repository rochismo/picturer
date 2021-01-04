import { app, BrowserWindow, nativeTheme, ipcMain, dialog } from "electron";
import ImageService from "./services/image.service";
const path = require("path");
try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
autoUpdater.logger = log;
autoUpdater.autoDownload = true;
autoUpdater.logger.transports.file.level = "info";
/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

let mainWindow;
let loading;
let isExitting = false;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  isExitting = true;
  app.quit(0);
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (loading) {
      if (loading.isMinimized()) loading.restore();
      loading.focus();
    } else if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Create myWindow, load the rest of the app, etc...
  //app.whenReady().then(displayautoUpdater);
  //app.on("activate", displayautoUpdater);
}

function loadError(error) {
  log.error(error);
  if (loading) {
    loading.webContents.send("update-not-found");
  }
  setTimeout(() => {
    if (!mainWindow) {
      createWindow();
    }

    if (loading) {
      loading.close();
    }
  }, 2000);
}

function createWindow() {
  /**
   * Initial window options
   */
  const imageService = new ImageService();
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,
      nodeIntegrationInWorker: true

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.on("add-image", async (_, url) => {
    const imageData = await imageService.add(url);
    mainWindow.webContents.send("image-added", imageData);
  });

  ipcMain.on("get-images", () => {
    mainWindow.webContents.send("all-images", imageService.getAll());
  });

  ipcMain.on("delete-image", (ev, id) => {
    imageService.remove(id);
  });

  ipcMain.on("update-image", async (ev, img) => {
    const updatedImage = await imageService.update(img);
    mainWindow.webContents.send(`updated-${img.id}`, updatedImage);
  });

  ipcMain.on("set-favorite", (ev, img) => {
    imageService.setFavorite(img);
  });
}

autoUpdater.on("error", loadError);
autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall(true, true);
});
autoUpdater.on("update-available", () => {
  loading.webContents.send("update-available");
});

autoUpdater.on("update-not-available", () => {
  loading.webContents.send("no-updates");
  setTimeout(() => {
    createWindow();
    loading.close();
  }, 2000);
});

autoUpdater.on("download-progress", ({ percent, transferred, total }) => {
  loading.webContents.send("downloading-update", percent);
});

app.on("ready", () => {
  if (process.env.NODE_ENV === "development") {
    return createWindow();
  }
  loading = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  loading.once("show", () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
  // We are done, load electron
  loading.on("close", () => {
    loading = null;
  });
  loading.loadURL(path.join(__statics, "load-bar/index.html"));
  loading.show();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
