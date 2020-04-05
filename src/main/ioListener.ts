import ioHook from 'iohook'
import { app, BrowserWindow } from 'electron'
import { getSelectedText } from './utils'

let mouseDownAt: number = 0

const initIOListener = (mainWin: BrowserWindow | null) => {
  ioHook.on('mousedown', (event) => {
    mouseDownAt = +new Date()
  })

  ioHook.on('mouseup', async (event) => {
    const { clicks, x, y } = event

    if (+new Date() - mouseDownAt > 500 || clicks >= 2) {
      const text = await getSelectedText()

      if (!text) {
        return
      }

      mainWin?.webContents.send('search-word-message', { text })
      mainWin?.setPosition(x + 10, y + 10)
      mainWin?.show()
      console.log(text, ' @', +new Date())
    }
  })

  ioHook.start(false)

  app.on('will-quit', (event) => {
    ioHook.unload()
  })
}

export default initIOListener
