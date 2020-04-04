import Store from 'electron-store'

export const store = new Store()

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
