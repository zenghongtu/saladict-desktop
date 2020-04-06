import { BrowserWindow } from 'electron'

let saladbowlWindow: BrowserWindow | null

const initSaladbowl = (mainWindow: BrowserWindow | null) => {
  saladbowlWindow = new BrowserWindow({
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    maxWidth: 30,
    maxHeight: 30,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    acceptFirstMouse: true,
    hasShadow: false,
    transparent: true,
    frame: false,
    show: false,
    skipTaskbar: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  saladbowlWindow.setMenu(null)
  saladbowlWindow.setMenuBarVisibility(false)
  saladbowlWindow.setVisibleOnAllWorkspaces(true)

  saladbowlWindow.loadFile('./saladbowl.html')

  // saladbowlWindow.on('ready-to-show', () => {
  //   saladbowlWindow?.show()
  // })

  saladbowlWindow.on('closed', () => {
    saladbowlWindow = null
  })

  saladbowlWindow.on('blur', () => {
    saladbowlWindow?.hide()
  })

  return saladbowlWindow
}

export default initSaladbowl
