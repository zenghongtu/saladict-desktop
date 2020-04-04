import './style.scss'
import { triggerInputValueChangeEvent } from './utils'
import { remote } from 'electron'

const loadIframe = async (src: string) => {
  const iframe = document.createElement('iframe')

  iframe.src = src

  return new Promise<HTMLIFrameElement>((resolve, reject) => {
    iframe.onload = function () {
      resolve(iframe)
    }

    iframe.onerror = function (error) {
      reject(error)
    }
    document.body.appendChild(iframe)
  })
}

let iframe: HTMLIFrameElement

const querySelectorFromIframe = (selector: string, wrap = iframe) => {
  return wrap.contentWindow?.document.querySelector(selector)
}

const handleQuickSearchPage = () => {
  const dictHeadELe = querySelectorFromIframe(
    '#root > div > div.dictPanel-Head > header',
  )

  if (!dictHeadELe) {
    return
  }

  ;(dictHeadELe.querySelector(
    'button:nth-child(8)',
  ) as HTMLButtonElement).style.display = 'none'
  ;(dictHeadELe.querySelector(
    'button:nth-child(9)',
  ) as HTMLButtonElement).style.visibility = 'hidden'
  ;(dictHeadELe.querySelector(
    'button:nth-child(6)',
  ) as HTMLButtonElement).addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    const inputEle = dictHeadELe.querySelector(
      'div.menuBar-SearchBox_Wrap > input',
    ) as HTMLInputElement

    // @ts-ignore
    window.browser.runtime.sendMessage({
      type: 'OPEN_URL',
      payload: {
        url:
          'word-editor.html?word=' + encodeURIComponent(inputEle.value || ''),
        self: true,
      },
    })
  })
}

const handleWordEditorPage = (text: string) => {
  const word = decodeURIComponent(text || '')

  setTimeout(() => {
    const ele = querySelectorFromIframe(
      '#wordEditorNote_Word',
    ) as HTMLInputElement

    // @ts-ignore
    triggerInputValueChangeEvent(ele, word)
    ;(querySelectorFromIframe(
      '#root > div > div > div > div > footer > button:nth-child(1)',
    ) as HTMLButtonElement).click()
  }, 500)
}

;(() => {
  const currentVersion = remote.app.getVersion()

  if ((localStorage.getItem('VERSION') || '') < currentVersion) {
    // @ts-ignore
    window.browser.runtime.onInstalled._listeners.forEach((listener) => {
      listener({ reason: '' })
    })

    localStorage.setItem('VERSION', currentVersion)
  }
})()

const main = async () => {
  const query = new URLSearchParams(window.location.search)

  const redirectUrl = query.get('redirect') || ''

  if (!redirectUrl) {
    return
  }

  const src = `/${redirectUrl}?direct=true`

  iframe = await loadIframe(src)

  if (redirectUrl.startsWith('quick-search')) {
    handleQuickSearchPage()
  } else if (redirectUrl.startsWith('word-editor')) {
    handleWordEditorPage(query.get('word') || '')
  }
}

main()
