import { emitter } from './utils'
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

const trayLabelMap = {
  en: {
    options: 'Options',
    enableInlineTranslator: 'Enable Inline Translator',
    shortcut: 'Global Shortcuts',
    openAtLogin: 'Open at Login',
    listenClipboard: 'Listen Clipboard',
    checkUpdate: 'Check for Updates',
    issues: 'Issues',
    relaunch: 'Relaunch',
    about: 'About',
    quit: 'Quit',
  },
  'zh-CN': {
    enableInlineTranslator: '启用划词',
    options: '设置',
    shortcut: '全局快捷键',
    openAtLogin: '开机启动',
    listenClipboard: '监听剪切板',
    checkUpdate: '检查更新',
    issues: '反馈建议',
    relaunch: '重启应用',
    about: '关于',
    quit: '退出',
  },
}

export let positioner: Positioner | null
export let tray: Tray | null
export let bounds: Rectangle

let langCode: 'en' | 'zh-CN'

const initTray = (mainWindow: BrowserWindow | null) => {
  positioner = new Positioner(mainWindow)
  langCode = global.shareVars.langCode as typeof langCode

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
        label: trayLabelMap[langCode].options,
        click: () => {
          const loadUrl = `${SCHEME}://-/iframe.html?sub=options.html`
          windows.add(loadUrl, 'options')
        },
      },
      {
        label: trayLabelMap[langCode].shortcut,
        click: () => {
          const loadUrl = `${SCHEME}://-/shortcut.html`
          windows.add(loadUrl, 'shortcut', { width: 600, height: 400 })
        },
      },
      {
        type: 'separator',
      },
      {
        label: trayLabelMap[langCode].enableInlineTranslator,
        accelerator: global.shareVars.enableInlineTranslator,
        type: 'checkbox',
        checked: global.shareVars.active,
        click: () => {
          global.shareVars.active = !global.shareVars.active
        },
      },
      {
        label: trayLabelMap[langCode].listenClipboard,
        type: 'checkbox',
        checked: global.shareVars.listenClipboard,
        click: (item) => {
          global.shareVars.listenClipboard = item.checked
        },
      },
      {
        label: trayLabelMap[langCode].openAtLogin,
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: (item) => {
          const { checked } = item
          app.setLoginItemSettings({ openAtLogin: checked })
        },
      },
      {
        type: 'separator',
      },
      {
        label: trayLabelMap[langCode].checkUpdate,
        click: () => {
          // TODO
          shell.openExternal(
            'https://github.com/zenghongtu/saladict-desktop/releases',
          )
        },
      },
      {
        label: trayLabelMap[langCode].relaunch,
        click: () => {
          app.relaunch()
          app.quit()
        },
      },
      {
        label: trayLabelMap[langCode].issues,
        click: () => {
          shell.openExternal(
            'https://github.com/zenghongtu/saladict-desktop/issues',
          )
        },
      },
      {
        type: 'separator',
      },
      {
        label: trayLabelMap[langCode].about,
        role: 'about',
      },
      {
        label: trayLabelMap[langCode].quit,
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

  emitter.on('langCode', (lang: string) => {
    langCode = lang.startsWith('zh') ? 'zh-CN' : 'en'
  })

  return tray
}

export default initTray
