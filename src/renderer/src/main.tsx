import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import manifest from '@src/saladict/manifest.json'

const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = src
    s.onerror = function (err) {
      reject(err)
    }
    s.onload = function () {
      resolve(true)
    }

    document.body.appendChild(s)
  })
}

// add manifest.json background script
Promise.resolve(manifest.background.scripts)
  .then((scripts) => {
    const promises = scripts
      .filter((src) => !src.includes('browser-polyfill'))
      .map((src) => loadScript(`app://-/${src}`))

    return Promise.all(promises)
  })
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root'),
    )
  })
