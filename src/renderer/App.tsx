import React, { FunctionComponent, useEffect, useState } from 'react'
import './App.css'

import '../emulator/dist/core'
import '../saladict/assets/runtime.9e1a8283.js'
import '../saladict/assets/18.dcd4ca98.js'
import '../saladict/assets/1.a3eb564a.js'
import '../saladict/assets/3.49ec8a94.js'
import '../saladict/assets/background.a9679961.js'
import { remote } from 'electron'
import { AddressInfo } from 'net'

const addressInfo: AddressInfo = remote.getGlobal('addressInfo')

const App: FunctionComponent<{}> = () => {
  return (
    <div className="App">
      <iframe
        className="iframe"
        src={`http://${addressInfo.address}:${addressInfo.port}/quick-search.html`}
      ></iframe>
    </div>
  )
}

export default App
