import Store from 'electron-store'
import { app, remote } from 'electron'

export const store = new Store({
  accessPropertiesByDotNotation: true,
  watch: true,
  name: `${(app || remote.app).name}.config`,
})
