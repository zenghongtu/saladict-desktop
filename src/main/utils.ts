import robot from 'robotjs'
import { clipboard } from 'electron'
import mitt from 'mitt'
import equal from 'fast-deep-equal/es6'
import pako from 'pako'

export const getSelectedText = () => {
  return new Promise<string>((resolve, reject) => {
    const lastText = clipboard.readText('clipboard')

    const platform = process.platform

    if (platform === 'darwin') {
      robot.keyTap('c', 'command')
    } else {
      robot.keyTap('c', 'control')
    }

    setTimeout(() => {
      const content = clipboard.readText('clipboard') || ''
      clipboard.writeText(lastText)

      resolve(content)
    }, 100)
  })
}

export const watchClipboard = ({
  watchDelay = 1000,
  onTextChange = (text: string) => {},
}) => {
  let lastText = clipboard.readText()

  const intervalId = setInterval(() => {
    const text = clipboard.readText()

    if (lastText !== text) {
      onTextChange(text)
      lastText = text
    }
  }, watchDelay)

  return () => clearInterval(intervalId)
}

export const getChangeKeys = (a: any, b: any, blacklist: string[] = []) => {
  return Object.keys(a).filter((key) => {
    return !blacklist.includes(key) && !equal(a[key], b[key])
  })
}

export let inflateData: <T = any>(data: pako.Data) => T

inflateData = (data: pako.Data) => {
  const config = pako.inflate(data, {
    to: 'string',
  })
  return JSON.parse(config)
}

export const emitter = mitt()
