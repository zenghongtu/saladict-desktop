import os from 'os'
import { join } from 'path'
import { app, BrowserWindow, session } from 'electron'
import remoteMain from '@electron/remote/main'
import serve from 'electron-serve'

remoteMain.initialize()

const loadURL = serve({
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

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    title: 'PPet',
    // frame: false,
    // autoHideMenuBar: true,
    hasShadow: true,
    // skipTaskbar: true,
    // transparent: true,
    // minimizable: false,
    // maximizable: false,
    resizable: true,
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      preload: join(__dirname, '../preload/index.cjs'),
      webSecurity: false,
    },
  })

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

    win.loadURL(url)
    win.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  app.quit()
})

app.on('browser-window-created', (ev, win) => {
  remoteMain.enable(win.webContents)
})

app.on('second-instance', () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
