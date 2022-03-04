import os from 'os'
import { join } from 'path'
import { app, BrowserWindow, session } from 'electron'
import remoteMain from '@electron/remote/main'
import serve from 'electron-serve'
import initTray from './tray'
import { windows } from './WindowManager'

remoteMain.initialize()

serve({
  isCorsEnabled: false,
  directory: join(__dirname, '..', 'saladict'),
})

app.commandLine.appendSwitch('disable-site-isolation-trials')
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let mainWindow: BrowserWindow | null = null
let forceQuit = false

async function createWindow() {
  mainWindow = await windows.add('quick-search.html', {
    title: 'Saladict',
    width: 400,
    height: 550,
  })

  if (!mainWindow) {
    return
  }

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

  initTray(mainWindow)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', (e) => {
  forceQuit = true
})

app.on('browser-window-created', (ev, win) => {
  remoteMain.enable(win.webContents)
})

app.on('second-instance', () => {
  if (mainWindow) {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
