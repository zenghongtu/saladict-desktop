import { shell, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

const defaultWinOptions: BrowserWindowConstructorOptions = {
  width: 1400,
  height: 800,
  show: false,
  webPreferences: {
    webSecurity: false,
    nodeIntegrationInSubFrames: true,
    nodeIntegration: true,
  },
}

class WindowManager {
  private windows: { [key: string]: BrowserWindow }

  constructor() {
    this.windows = {}
  }

  add(
    loadUrl: string,
    windowID = loadUrl,
    options?: BrowserWindowConstructorOptions,
  ) {
    const _options = Object.assign(defaultWinOptions, options)

    if (this.focus(windowID)) return

    const window = (this.windows[windowID] = new BrowserWindow(_options))

    window.loadURL(loadUrl)

    const title = windowID.endsWith('.html') ? windowID.split('.')[0] : windowID

    window.setTitle(title)
    window.on('ready-to-show', () => {
      window.show()
    })

    window.on('closed', () => {
      delete this.windows[windowID]
    })

    window.webContents.on('new-window', (event, url) => {
      event.preventDefault()
    })

    return window
  }

  /**
   * return true if the window can focus and execute focus()
   * @param windowID
   */
  focus(windowID: string): boolean {
    if (this.windows[windowID]) {
      this.windows[windowID].focus()
      return true
    }
    return false
  }

  get(windowID: string) {
    return this.windows[windowID] || null
  }

  getAll() {
    return this.windows
  }

  close(windowID: string) {
    if (this.windows[windowID]) {
      this.windows[windowID].close()
    }
  }

  closeAll() {
    Object.values(this.windows).forEach((win) => win.close())
  }
}

export default WindowManager

export const windows = new WindowManager()
