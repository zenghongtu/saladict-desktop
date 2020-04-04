import './style.scss'
import { useEffect } from 'react'

const iframe = document.createElement('iframe')
const query = new URLSearchParams(window.location.search)

window.browser.runtime.onInstalled._listeners.forEach((listener) => {
  // delay startup calls
  listener({ reason: '' })
})

const redirectUrl = query.get('redirect')

iframe.src = `/${redirectUrl}?direct=true`

document.body.appendChild(iframe)

if (redirectUrl?.startsWith('quick-search')) {
  setTimeout(() => {
    const c = iframe.contentWindow?.document.querySelector(
      '#root > div > div.dictPanel-Head > header > button:nth-child(8)',
    )
    c.style.display = 'none'
    const d = iframe.contentWindow?.document.querySelector(
      '#root > div > div.dictPanel-Head > header > button:nth-child(9)',
    )
    d.style.display = 'none'

    const ele = iframe.contentWindow?.document.querySelector(
      '#root > div > div.dictPanel-Head > header > button:nth-child(6)',
    ) as Element

    ele.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      const inputEle = iframe.contentWindow?.document.querySelector(
        '#root > div > div.dictPanel-Head > header > div.menuBar-SearchBox_Wrap > input',
      ) as HTMLInputElement
      window.browser.runtime.sendMessage({
        type: 'OPEN_URL',
        payload: {
          url:
            'word-editor.html?word=' + encodeURIComponent(inputEle.value || ''),
          self: true,
        },
      })
    })
  }, 500)
}

if (redirectUrl?.startsWith('word-editor')) {
  const word = decodeURIComponent(query.get('word') || '')

  setTimeout(() => {
    const ele = iframe.contentWindow?.document.querySelector(
      '#wordEditorNote_Word',
    ) as HTMLInputElement

    // @ts-ignore
    const nativeInputSet = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set

    // @ts-ignore
    nativeInputSet.call(ele, word)

    const inputEvent = new Event('input', { bubbles: true })
    ele.dispatchEvent(inputEvent)

    iframe.contentWindow?.document
      .querySelector(
        '#root > div > div > div > div > footer > button:nth-child(1)',
      )
      ?.click()
  }, 1000)
}
