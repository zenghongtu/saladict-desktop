import { DEFAULT_GLOBAL_SHORTCUTS } from './../consts'
import fs from 'fs'
import { emitter, inflateData, deflateData } from './utils'
import { store } from '../store'
import { isString } from 'util'
import { app } from 'electron'

const initGlobalShareVars = () => {
  let baseConfig = store.get('sync.baseconfig.d')

  let saladictConfig: AppConfig

  if (!baseConfig) {
    const defaultConfig = require('./defaultConfig.json')

    const lang = app.getLocale().startsWith('zh') ? 'zh-CN' : 'en'

    baseConfig = defaultConfig.sync.baseconfig.d

    saladictConfig = inflateData<AppConfig>(baseConfig)

    // modify lang
    saladictConfig.langCode = lang

    defaultConfig.sync.baseconfig.d = deflateData(saladictConfig)

    fs.writeFileSync(store.path, JSON.stringify(defaultConfig), {
      encoding: 'utf8',
    })
  } else {
    saladictConfig = inflateData<AppConfig>(baseConfig)
  }


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

  const configKeys = [
    'openSaladict',
    'enableInlineTranslator',
    'listenClipboard',
  ]

  global.shareVars = new Proxy(shareVars, {
    set: (target, p: keyof ShareVars, value, receiver) => {
      // fix set undefined

      if (typeof target[p] === 'undefined' || typeof value === 'undefined') {
        console.warn(`set ${p} to undefined`)
        return true
      }

      emitter.emit(p, value)
      ;(target as any)[p] = value

      if (isString(p) && configKeys.includes(p)) {
        store.set(`config.${p}`, value)
      }
      console.log('set ', p, '=', value)
      return true
    },
  })
}

export default initGlobalShareVars
