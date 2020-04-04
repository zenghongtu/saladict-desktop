import { app, BrowserWindow, ipcMain } from 'electron'
import initServe from './serve'
import { AddressInfo } from 'net'
import initIpcHandler from './ipc'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow: BrowserWindow | null

async function createWindow(address: AddressInfo) {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      nodeIntegrationInSubFrames: true,
    },
  })

  const baseURL = `http://${address.address}:${address.port}`

  mainWindow.loadURL(baseURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  initIpcHandler(mainWindow, { baseURL })
}

app.on('ready', async () => {
  // TODO
  const address = await initServe()
  if (address) {
    global.addressInfo = address
    createWindow(address)
  } else {
    // TODO
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow(global.addressInfo)
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
