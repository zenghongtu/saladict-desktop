import Store from 'electron-store'
import { app, remote } from 'electron'

export const store = new Store({
  accessPropertiesByDotNotation: false,
  watch: true,
  name: `${(app || remote.app).name}.config`,
})

export const triggerInputValueChangeEvent = (
  ele: HTMLInputElement,
  value: string,
) => {
  // @ts-ignore
  const nativeInputSet = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  ).set

  // @ts-ignore
  nativeInputSet.call(ele, value)

  const inputEvent = new Event('input', { bubbles: true })
  ele.dispatchEvent(inputEvent)
}
