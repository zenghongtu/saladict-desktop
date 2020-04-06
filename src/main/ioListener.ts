import ioHook from 'iohook'
import { app, BrowserWindow } from 'electron'
import { emitter, getSelectedText } from './utils'
import { Simulate } from 'react-dom/test-utils'
import click = Simulate.click

// for ioHook start or load
let hasRun = false

let isHolding = false
let mouseDownAt: number = 0

const initIOListener = (
  mainWin: BrowserWindow | null,
  saladbowlWin: BrowserWindow | null,
) => {
  ioHook.on('mousedown', (event) => {
    if (event.button === 1) {
      mouseDownAt = +new Date()
    } else {
      mouseDownAt = 0
    }
  })

  ioHook.on('keydown', (event) => {
    const keyName = Object.keys(event).find((_key) => event[_key] === true)

    if (keyName) {
      const _holding = global.shareVars.mode.holding

      if (
        (Object.keys(_holding) as (keyof typeof _holding)[])
          .filter((key) => _holding[key])
          .includes(keyName.slice(0, -3) as keyof typeof _holding)
      ) {
        isHolding = true
      }
    }
  })

  ioHook.on('keyup', () => {
    isHolding = false
  })

  // TODO compare x / y
  ioHook.on('mouseup', async (event) => {
    const { clicks, x, y } = event

    const {
      doubleClickDelay,
      mode,
      pinMode,
      bowlOffsetX,
      bowlOffsetY,
    } = global.shareVars

    if (
      (mouseDownAt && +new Date() - mouseDownAt >= doubleClickDelay) ||
      (mode.double && clicks >= 2) ||
      isHolding
    ) {
      const text = await getSelectedText()
      global.shareVars.selectedText = text || ''

      if (!text) {
        console.error('Get selected text failed!')
        return
      }

      mainWin?.webContents.send('search-word-message', { text })

      const _x = x + bowlOffsetX
      const _y = y + bowlOffsetY

      if (mode.direct || mode.holding) {
        mainWin?.setPosition(_x, _y)
        mainWin?.show()
        return
      }

      if (mode.icon) {
        saladbowlWin?.setPosition(_x, _y)
        saladbowlWin?.show()
        mainWin?.setPosition(_x + 40, _y)
        return
      }

      console.log(text, ' @', +new Date())
    }
  })

  const runHook = () => {
    if (!hasRun) {
      ioHook.start(false)
      hasRun = true
    } else {
      ioHook.load()
    }
  }

  const destroyHook = () => {
    ioHook.unload()
  }

  const restartHook = () => {
    ioHook.unload()
    ioHook.load()
  }

  emitter.on('active', (enable) => {
    enable ? runHook() : destroyHook()
  })

  if (global.shareVars.active) {
    runHook()
  }

  app.on('will-quit', () => {
    destroyHook()
  })
}

export default initIOListener
