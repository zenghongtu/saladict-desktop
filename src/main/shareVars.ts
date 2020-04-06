import fs from 'fs'
import { emitter, inflateData } from './utils'
import { store } from '../store'

const initGlobalShareVars = () => {
  let baseConfig = store.get('sync.baseconfig.d')

  if (!baseConfig) {
    const defaultConfig = require('./defaultConfig.json')

    // TODO modify somethings
    fs.writeFileSync(store.path, JSON.stringify(defaultConfig), {
      encoding: 'utf8',
    })

    baseConfig = defaultConfig.sync.baseconfig.d
  }

  let config = inflateData<AppConfig>(baseConfig)

  const shareVars = {
    ...config,
    isPinPanel: false,
    selectedText: '',
    mainWindowId: 0,
  } as ShareVars

  global.shareVars = new Proxy(shareVars, {
    set: (target, p: keyof ShareVars, value, receiver) => {
      emitter.emit(p, value)

      // if (typeof target[p] === 'undefined' || typeof value === 'undefined') {
      //   return false
      // }
      ;(target as any)[p] = value

      console.log('set ', p, '=', value)
      return true
    },
  })
}

export default initGlobalShareVars
