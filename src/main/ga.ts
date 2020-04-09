import { BrowserWindow } from 'electron'
import ua from 'universal-analytics'

let visitor: any = null

export const initGA = (mainWindow: BrowserWindow | null) => {
  visitor = ua('UA-160700616-2')

  mainWindow?.on('focus', () => {
    sendEvent()
  })
  sendPageView()
}

export const sendPageView = (path = '/') => {
  visitor?.pageview(path).send()
}

export const sendEvent = (category = 'window', action = 'focus') => {
  visitor?.event(category, action).send()
}
