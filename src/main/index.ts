import { app, BrowserWindow, ipcMain, Tray, nativeImage } from 'electron'
import initServe from './serve'
import { AddressInfo } from 'net'
import initIpcHandler from './ipc'
import path from 'path'
import initTray from './tray'
import initSaladbowl from './saladbowl'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.dock.hide()

let mainWindow: BrowserWindow | null

let forceQuit = false

async function createWindow(address: AddressInfo) {
  mainWindow = new BrowserWindow({
    width: 460,
    height: 560,
    minWidth: 460,
    minHeight: 560,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    useContentSize: true,
    // frame: false,
    show: false,
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

  mainWindow.on('close', (event) => {
    if (forceQuit) {
      app.quit()
    } else {
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.on('blur', () => {
    mainWindow?.hide()
  })

  mainWindow.on('ready-to-show', () => {})

  initIpcHandler(mainWindow, { baseURL })

  return mainWindow
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
  initTray(mainWindow)
  initSaladbowl()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', (e) => {
  forceQuit = true
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
