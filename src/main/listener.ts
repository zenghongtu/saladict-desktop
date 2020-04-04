import ioHook from 'iohook'
import { app } from 'electron'
import { getSelectedText } from './utils'

let mouseDownAt: number = 0

const initListener = () => {
  ioHook.on('mousedown', (event) => {
    mouseDownAt = +new Date()
  })

  ioHook.on('mouseup', async (event) => {
    const { clicks, x, y } = event

    if (+new Date() - mouseDownAt > 500 || clicks >= 2) {
      const text = await getSelectedText()
      console.log(text, '  ', +new Date())
    }
  })

  ioHook.start(false)

  app.on('will-quit', (event) => {
    ioHook.unload()
  })
}

export default initListener
