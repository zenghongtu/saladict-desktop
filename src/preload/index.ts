import { contextBridge } from 'electron'
import electron from '@electron/remote'

import '@src/emulator/core/index'

const openWindow = (page: string) => {
  console.log('page: ', page)
}

window.bridge = {
  openWindow,
}
