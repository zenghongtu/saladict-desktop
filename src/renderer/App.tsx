import React, { FunctionComponent, useEffect, useState } from 'react'
import './App.css'

import { remote } from 'electron'
import { AddressInfo } from 'net'

const addressInfo: AddressInfo = remote.getGlobal('addressInfo')

const App: FunctionComponent<{}> = () => {
  return (
    <div className="app">
      <iframe
        frameBorder="0"
        scrolling="no"
        className="iframe"
        src={`http://${addressInfo.address}:${addressInfo.port}/quick-search.html`}
      ></iframe>
    </div>
  )
}

export default App
