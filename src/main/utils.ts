import robot from 'robotjs'
import { clipboard } from 'electron'
import mitt from 'mitt'
import equal from 'fast-deep-equal/es6'
import pako from 'pako'

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
