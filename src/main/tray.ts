import { windows } from './WindowManager'
import path from 'path'
import {
  nativeImage,
  Tray,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  MenuItem,
  shell,
  app,
  clipboard,
  Rectangle,
} from 'electron'
// @ts-ignore
import Positioner from 'electron-positioner'
import { SCHEME } from '../consts'

export let positioner: Positioner | null
export let tray: Tray | null
export let bounds: Rectangle

const initTray = (mainWindow: BrowserWindow | null) => {
  positioner = new Positioner(mainWindow)

  const trayImgPath = path.join(__static, 'icons', 'tray.png')
  const trayImg = nativeImage.createFromPath(trayImgPath)
  tray = new Tray(trayImg)

  tray.setPressedImage(trayImgPath)

  // TODO some bugs
  tray.on('click', (event, _bounds) => {
    const text = clipboard.readText('clipboard')
    mainWindow?.webContents.send('search-word-message', { text })
    positioner.move('trayCenter', _bounds)
    mainWindow?.show()
    bounds = _bounds
  })

  const getTemplate = () => {
    const template: Array<MenuItemConstructorOptions | MenuItem> = [
      {
        label: '启用划词',
        accelerator: global.shareVars.enableInlineTranslator,
        type: 'checkbox',
        checked: global.shareVars.active,
        click: () => {
          global.shareVars.active = !global.shareVars.active
        },
      },
      {
        label: '设置',
        click: () => {
          const loadUrl = `${SCHEME}://-/iframe.html?sub=options.html`
          windows.add(loadUrl, 'options')
        },
      },
      {
        label: '快捷键',
        click: () => {
          const loadUrl = `${SCHEME}://-/shortcut.html`
          windows.add(loadUrl, 'shortcut', { width: 600, height: 400 })
        },
      },
      {
        label: '开机启动',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: (item) => {
          const { checked } = item
          app.setLoginItemSettings({ openAtLogin: checked })
        },
      },
      {
        label: '监听剪切板',
        type: 'checkbox',
        checked: global.shareVars.listenClipboard,
        click: (item) => {
          global.shareVars.listenClipboard = item.checked
        },
      },
      {
        type: 'separator',
      },
      {
        label: '检查更新',
        click: () => {
          // TODO
          shell.openExternal(
            'https://github.com/zenghongtu/saladict-desktop/releases',
          )
        },
      },
      {
        label: '反馈建议',
        click: () => {
          shell.openExternal(
            'https://github.com/zenghongtu/saladict-desktop/issues',
          )
        },
      },
      {
        label: '重启应用',
        click: () => {
          app.relaunch()
          app.quit()
        },
      },
      {
        label: '关于',
        role: 'about',
      },
      {
        label: '退出',
        role: 'quit',
        click: (item) => {
          app.quit()
        },
      },
    ]
    return template
  }

  tray.on('right-click', (event) => {
    const menu = Menu.buildFromTemplate(getTemplate())
    tray?.popUpContextMenu(menu)
  })

  return tray
}

export default initTray
