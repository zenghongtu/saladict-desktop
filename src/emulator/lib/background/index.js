import { runtime } from './patches/runtime'
import { tabs } from './patches/tabs'

window.browser = new Proxy(window.parent.browser, {
  get: (...args) => {
    switch (args[1]) {
      case 'tabs':
        return tabs
      case 'runtime':
        return runtime
    }
    return Reflect.get(...args)
  }
})
