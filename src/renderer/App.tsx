import React from 'react'
import logo from './assets/logo.svg'
import './App.css'
import { hot } from 'react-hot-loader/root'
import { remote } from 'electron'

const App: React.FC = () => {
  const electron = process.versions.electron
  const node = process.versions.node
  const platform = require('os').platform()
  const version = require('../../package.json').version

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    remote.shell.openExternal(e.currentTarget.href)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul className="App-info">
          <li>
            electron: <span>{electron}</span>
          </li>
          <li>
            node: <span>{node}</span>
          </li>
          <li>
            platform: <span>{platform}</span>
          </li>
          <li>
            version: <span>{version}</span>
          </li>
        </ul>
        <p>
          Edit <code>src/renderer/App.tsx</code> and save to reload.
        </p>
        <div>
          <a
            onClick={handleLinkClick}
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <a
            onClick={handleLinkClick}
            className="App-link"
            href="https://electronjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Electron
          </a>
        </div>
      </header>
    </div>
  )
}

export default hot(App)
