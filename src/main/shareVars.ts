import { emitter, inflateData } from './utils'
import { store } from '../store'

const initGlobalShareVars = () => {
  const baseConfig = store.get('sync.baseconfig.d')

  let config: any = {}

  if (baseConfig) {
    config = inflateData<AppConfig>(baseConfig)
  }

  const shareVars = { ...config, isPinPanel: false } as ShareVars

  global.shareVars = new Proxy(shareVars, {
    set: (target, p: keyof ShareVars, value, receiver) => {
      emitter.emit(p, value)
      // TODO
      if (typeof target[p] === 'undefined') {
        return false
      }
      ;(target as any)[p] = value

      console.log('set ', p, '=', value)
      return true
    },
  })
}

export default initGlobalShareVars
