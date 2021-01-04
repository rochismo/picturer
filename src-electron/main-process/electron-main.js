import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import ImageService from './services/image.service';
try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }
if (process.env.NODE_ENV === 'production') {
  require('update-electron-app')()
}
/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
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
      nodeIntegrationInWorker: true,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  
  ipcMain.on('add-image', async (_, url) => {
    const imageData = await imageService.add(url)
    mainWindow.webContents.send("image-added", imageData);
  });

  ipcMain.on('get-images', () => {
    mainWindow.webContents.send("all-images", imageService.getAll())
  })

  ipcMain.on("delete-image", (ev, id) => {
    imageService.remove(id);
  })

  ipcMain.on("update-image", async (ev, img) => {
    const updatedImage = await imageService.update(img);
    mainWindow.webContents.send(`updated-${img.id}`, updatedImage)
  });

  ipcMain.on("set-favorite", (ev, img) => {
    imageService.setFavorite(img);
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
