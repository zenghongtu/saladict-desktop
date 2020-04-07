import { DEFAULT_GLOBAL_SHORTCUTS } from './../consts'
import fs from 'fs'
import { emitter, inflateData } from './utils'
import { store } from '../store'
import { isString } from 'util'

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
    openSaladict:
      store.get('config.openSaladict') ||
      DEFAULT_GLOBAL_SHORTCUTS['openSaladict'],
  } as ShareVars

  const whitelist = ['openSaladict']

  global.shareVars = new Proxy(shareVars, {
    set: (target, p: keyof ShareVars, value, receiver) => {
      emitter.emit(p, value)

      // if (typeof target[p] === 'undefined' || typeof value === 'undefined') {
      //   return false
      // }
      ;(target as any)[p] = value

      if (isString(p) && whitelist.includes(p)) {
        store.set(`config.${p}`, value)
      }
      console.log('set ', p, '=', value)
      return true
    },
  })
}

export default initGlobalShareVars
