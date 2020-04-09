import { BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { windows } from './WindowManager'
import { getChangeKeys, inflateData } from './utils'
import { unlessAppConfigFields } from '../consts'
import { sendPageView } from './ga'

const updateShareVars = (keys: (keyof AppConfig)[], data: AppConfig) => {
  keys.forEach((key) => {
    // only change, not add
    if (typeof global.shareVars[key] !== 'undefined') {
      // @ts-ignore
      global.shareVars[key] = data[key]
    }
  })
}

const initIpcHandler = (
  mainWin: BrowserWindow | null,
  { baseURL }: { baseURL: string },
) => {
  ipcMain.handle('sala-extension-message', async (event, action) => {
    const { type, payload } = action

    if (type === 'OPEN_URL') {
      const url = payload.url
      const loadUrl = `${baseURL}/iframe.html?sub=${url}`
      windows.add(loadUrl, url.split('.html')[0])
      sendPageView(url)
    } else if (type === 'PIN_STATE') {
      global.shareVars.isPinPanel = payload
    }

    return new Promise((resolve, reject) => {
      resolve('hello')
    })
  })

  ipcMain.on('sala-config-change-message', async (event, configData) => {
    const config = inflateData<AppConfig>(configData)

    const changeKeys = getChangeKeys(global.shareVars, config, [
      ...unlessAppConfigFields,
      'isPinPanel',
    ]) as (keyof AppConfig)[]

    updateShareVars(changeKeys, config)
  })

  ipcMain.on('show-shortcut-window-message', (event) => {
    windows.add(`${baseURL}/shortcut.html`, 'shortcut', {
      width: 600,
      height: 400,
    })
  })

  ipcMain.handle('update-shortcut-message', (event, { name, value }) => {
    const prevShortcut = global.shareVars[name]
    if (prevShortcut) {
      globalShortcut.unregister(prevShortcut)
    }

    global.shareVars[name] = value

    return Promise.resolve()
  })
}

export default initIpcHandler
