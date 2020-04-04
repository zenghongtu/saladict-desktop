import { BrowserWindow, ipcMain } from 'electron'
import { windows } from './WindowManager'

const initIpcHandler = (
  mainWin: BrowserWindow,
  { baseURL }: { baseURL: string },
) => {
  ipcMain.handle('sala-extension-message', async (event, action) => {
    const { type, payload } = action

    if (type === 'OPEN_URL') {
      const loadUrl = `${baseURL}/${payload.url}`
      windows.add(loadUrl, payload.url)
    }

    return new Promise((resolve, reject) => {
      resolve('hello')
    })
  })
}

export default initIpcHandler
