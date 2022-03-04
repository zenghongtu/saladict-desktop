import { join } from 'path'
import {
  shell,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  app,
} from 'electron'

const defaultWinOptions: BrowserWindowConstructorOptions = {
  width: 1400,
  height: 800,
  show: false,
  resizable: true,
  webPreferences: {
    contextIsolation: false,
    preload: join(__dirname, '../preload/index.cjs'),
    webSecurity: false,
  },
}

class WindowManager {
  private windows: { [key: string]: BrowserWindow }

  constructor() {
    this.windows = {}
  }

  async add(page: string, options?: BrowserWindowConstructorOptions) {
    const _options = Object.assign({}, defaultWinOptions, options)

    if (this.focus(page)) return null

    const window = (this.windows[page] = new BrowserWindow(_options))

    if (app.isPackaged) {
      window.loadFile(join(__dirname, '../renderer/index.html'), {
        hash: page,
      })
    } else {
      const pkg = await import('../../package.json')
      const url = `http://${pkg.env.HOST || '127.0.0.1'}:${
        pkg.env.PORT
      }/#/${page}`

      console.log('url: ', url)
      window.loadURL(url)
      window.webContents.openDevTools()
    }

    const title = _options.title || page

    window.setTitle(title)
    window.on('ready-to-show', () => {
      window.show()
      window.focus()
    })

    window.on('closed', () => {
      delete this.windows[page]
    })

    window.webContents.on('new-window', (event, url) => {
      event.preventDefault()
    })

    window.setMenu(null)
    window.setMenuBarVisibility(false)
    window.setVisibleOnAllWorkspaces(true)

    console.log('window: ', window)
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
