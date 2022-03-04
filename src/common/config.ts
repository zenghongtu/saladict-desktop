import { app } from 'electron'
import Store from 'electron-store'

const store = new Store({
  name: 'saladict-config',
  defaults: {
    language: app.getLocale().includes('zh') ? 'zh' : 'en',
  },
})

export default store
