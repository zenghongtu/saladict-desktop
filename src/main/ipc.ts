import { BrowserWindow, ipcMain } from 'electron'
import { windows } from './WindowManager'
import { getChangeKeys, inflateData } from './utils'
import { unlessAppConfigFields } from '../consts'

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
  mainWin: BrowserWindow,
  { baseURL }: { baseURL: string },
) => {
  ipcMain.handle('sala-extension-message', async (event, action) => {
    const { type, payload } = action

    if (type === 'OPEN_URL') {
      const url = payload.url
      const loadUrl = `${baseURL}/iframe.html?sub=${url}`
      windows.add(loadUrl, url.split('.html')[0])
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
}

export default initIpcHandler
