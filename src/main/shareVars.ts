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

  let saladictConfig = inflateData<AppConfig>(baseConfig)

  const { openSaladict, enableInlineTranslator, listenClipboard } =
    store.get('config') || {}
  const shareVars = {
    ...saladictConfig,
    isPinPanel: false,
    selectedText: '',
    mainWindowId: 0,
    openSaladict: openSaladict || DEFAULT_GLOBAL_SHORTCUTS['openSaladict'],
    enableInlineTranslator:
      enableInlineTranslator ||
      DEFAULT_GLOBAL_SHORTCUTS['enableInlineTranslator'],
    listenClipboard: listenClipboard || false,
  } as ShareVars

  const whitelist = ['openSaladict', 'listenClipboard']

  global.shareVars = new Proxy(shareVars, {
    set: (target, p: keyof ShareVars, value, receiver) => {
      // fix set undefined

      if (typeof target[p] === 'undefined' || typeof value === 'undefined') {
        console.warn(`set ${p} to undefined`)
        return true
      }

      emitter.emit(p, value)
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
