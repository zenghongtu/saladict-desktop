import ioHook from 'iohook'
import { app } from 'electron'

let mouseDownAt: number = 0

const initListener = () => {
  ioHook.on('mousedown', (event) => {
    mouseDownAt = +new Date()
  })

  ioHook.on('mouseup', (event) => {
    if (+new Date() - mouseDownAt > 500) {
      console.log('Hello', +new Date())
    }
  })

  ioHook.start(false)

  app.on('will-quit', (event) => {
    ioHook.unload()
  })
}

export default initListener
