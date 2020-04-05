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
} from 'electron'
// @ts-ignore
import Positioner from 'electron-positioner'

let positioner: Positioner | null
let tray: Tray | null

const initTray = (mainWindow: BrowserWindow | null) => {
  positioner = new Positioner(mainWindow)

  const trayImgPath = path.join(__static, 'icons', 'tray.png')
  const trayImg = nativeImage.createFromPath(trayImgPath)
  tray = new Tray(trayImg)

  tray.setPressedImage(trayImgPath)

  tray.on('click', (event, bounds) => {
    const text = clipboard.readText('clipboard')
    mainWindow?.webContents.send('search-word-message', { text })
    positioner.move('trayCenter', bounds)
    mainWindow?.show()
  })

  const template: Array<MenuItemConstructorOptions | MenuItem> = [
    {
      label: '反馈建议',
      click: () => {
        shell.openExternal(
          'https://github.com/zenghongtu/saladict-desktop/issues',
        )
      },
    },
    {
      label: '关于',
      role: 'about',
    },
    {
      label: '退出',
      click: (item) => {
        app.quit()
      },
    },
  ]

  const menu = Menu.buildFromTemplate(template)

  tray.on('right-click', (event) => {
    tray?.popUpContextMenu(menu)
  })

  return tray
}

export default initTray
