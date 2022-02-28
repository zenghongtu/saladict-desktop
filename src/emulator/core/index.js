import browser from 'sinon-chrome/webextensions'

window.chrome = window.browser = browser

const modules = import.meta.glob('./patches/*.js')
for (const path in modules) {
  modules[path]()
}
