import { app, BrowserWindow, ipcMain, Tray, nativeImage } from 'electron'
import initIpcHandler from './ipc'
import path from 'path'
import initTray from './tray'
import initSaladbowl from './saladbowl'
import initListener from './listener'
import Serve from 'electron-serve'
import { SCHEME } from '../consts'

global.shareVar = { isPinPanel: false }

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

if (process.env.NODE_ENV !== 'development') {
  app.dock.hide()
}

let mainWindow: BrowserWindow | null

let forceQuit = false

Serve({
  scheme: SCHEME,
  directory: app.getAppPath(),
})

const baseURL = `${SCHEME}://-`

async function createWindow(baseURL: string) {
  mainWindow = new BrowserWindow({
    width: 460,
    height: 560,
    minWidth: 460,
    minHeight: 560,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    useContentSize: true,
    frame: false,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      nodeIntegrationInSubFrames: true,
    },
  })

  mainWindow.setMenu(null)
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setVisibleOnAllWorkspaces(true)

  initIpcHandler(mainWindow, { baseURL })

  await mainWindow.loadURL(`${baseURL}/iframe.html?sub=quick-search.html`)

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
    if (!global.shareVar.isPinPanel) {
      mainWindow?.hide()
    }
  })

  // mainWindow.on('ready-to-show', () => {
  //   mainWindow?.show()
  // })

  return mainWindow
}

app.on('ready', async () => {
  const mainWindow = await createWindow(baseURL)

  initTray(mainWindow)
  // initSaladbowl()
  initListener(mainWindow)
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
    createWindow(baseURL)
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
