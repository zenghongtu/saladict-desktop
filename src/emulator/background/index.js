import { runtime } from './patches/runtime'
import { tabs } from './patches/tabs'

// Object.defineProperties(window, {
//   __SALADICT_QUICK_SEARCH_PAGE__: { get: () => false, set: () => {} },
//   __SALADICT_POPUP_PAGE__: { get: () => true, set: () => {} },
//   // __SALADICT_SELECTION_LOADED__: { get: () => true, set: () => {} },
// })

window.chrome = window.browser = new Proxy(window.parent.browser, {
  get: (...args) => {
    switch (args[1]) {
      case 'tabs':
        return tabs
      case 'runtime':
        return runtime
    }
    return Reflect.get(...args)
  },
})
