import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeImage,
  shell,
  Tray,
} from 'electron'
import { menubar } from 'menubar'
import { join } from 'path'
import { config } from '@src/common'

import trayIcon from '../../static/icons/tray.png'

const langs = {
  zh: {
    openAtLogin: '开机启动',
    language: '语言',
    debug: '调试',
    feedback: '反馈',
    about: '关于',
    quit: '退出',
  },
  en: {
    openAtLogin: 'Open At Login',
    language: 'Language',
    debug: 'Debug',
    feedback: 'Feedback',
    about: 'About',
    quit: 'Quit',
  },
} as const

type LangType = keyof typeof langs

let tray: Tray

const initTray = async (mainWindow: BrowserWindow) => {
  if (!tray) {
    tray = new Tray(nativeImage.createFromDataURL(trayIcon))
  }

  const handleClickLangRadio = (lang: LangType) => {
    config.set('language', lang)

    // mainWindow.webContents.executeJavaScript(`window.setLanguage('${lang}')`)
  }

  const getTemplate = (): Array<MenuItemConstructorOptions | MenuItem> => {
    const lang = config.get('language') as LangType

    const cl = langs[lang]

    return [
      {
        label: cl.language,
        type: 'submenu',
        submenu: [
          {
            label: '简体中文',
            type: 'radio',
            checked: lang === 'zh',
            click: handleClickLangRadio.bind(null, 'zh'),
          },
          {
            label: 'English',
            type: 'radio',
            checked: lang === 'en',
            click: handleClickLangRadio.bind(null, 'en'),
          },
        ],
      },

      {
        label: cl.debug,
        accelerator: 'CmdOrCtrl+d',
        click: () => {
          mainWindow.webContents.openDevTools({ mode: 'undocked' })
        },
      },
      {
        label: cl.openAtLogin,
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
        label: cl.feedback,
        click: () => {
          shell.openExternal(
            'https://github.com/zenghongtu/saladict-desktop/issues',
          )
        },
      },
      {
        label: cl.about,
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: cl.quit,
        click: (item) => {
          app.quit()
        },
      },
    ]
  }

  tray.on('click', (event, _bounds) => {
    mainWindow?.show()
  })

  tray.on('right-click', (event) => {
    const menu = Menu.buildFromTemplate(getTemplate())
    tray?.popUpContextMenu(menu)
  })
}

export default initTray
