import robot from 'robotjs'
import { clipboard } from 'electron'

export const getSelectedText = () => {
  return new Promise<string>((resolve, reject) => {
    const lastText = clipboard.readText('clipboard')
    robot.keyTap('c', 'command')

    setTimeout(() => {
      const content = clipboard.readText('clipboard')
      clipboard.writeText(lastText)

      resolve(content)
    }, 100)
  })
}
