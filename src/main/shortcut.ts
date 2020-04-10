import { emitter } from './utils'
import { globalShortcut, BrowserWindow } from 'electron'
import { positioner, bounds } from './tray'

const initShortcuts = (mainWin: BrowserWindow | null) => {
  const registerOpenSaladict = (value?: string) => {
    globalShortcut.register(value || global.shareVars['openSaladict'], () => {
      if (bounds) {
        positioner.move('trayCenter', bounds)
      }
      mainWin?.show()
      mainWin?.focus()
    })
  }

  const registerEnableInlineTranslator = (value?: string) => {
    globalShortcut.register(
      value || global.shareVars['enableInlineTranslator'],
      () => {
        global.shareVars['active'] = !global.shareVars['active']
      },
    )
  }

  emitter.on('openSaladict', (value) => {
    registerOpenSaladict(value)
  })

  emitter.on('enableInlineTranslator', (value) => {
    registerEnableInlineTranslator(value)
  })

  registerOpenSaladict()
  registerEnableInlineTranslator()
}

export default initShortcuts
