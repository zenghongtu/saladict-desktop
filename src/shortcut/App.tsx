import React, { FunctionComponent, useEffect, useState } from 'react'
import './App.css'
import { remote, ipcRenderer } from 'electron'
import { DEFAULT_GLOBAL_SHORTCUTS } from '../consts'

const App: FunctionComponent<{}> = () => {
  const [shortcuts, setShortcuts] = useState({
    openSaladict: DEFAULT_GLOBAL_SHORTCUTS['openSaladict'],
    enableInlineTranslator: DEFAULT_GLOBAL_SHORTCUTS['enableInlineTranslator'],
  })

  useEffect(() => {
    const {
      openSaladict: openSaladictHotkey,
      enableInlineTranslator: enableInlineTranslatorHotkey,
    } = remote.getGlobal('shareVars')

    setShortcuts({
      openSaladict: openSaladictHotkey,
      enableInlineTranslator: enableInlineTranslatorHotkey,
    })
  }, [])

  const keyCodeMap = {
    35: 'End',
    36: 'Home',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    45: 'Insert',
    46: 'Delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'",
  }

  const handleKeydown = async (
    name: string,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    let keyName: string

    const keyValue = []
    if (e.metaKey) {
      keyValue.push('CommandOrControl')
    }

    if (e.ctrlKey) {
      keyValue.push('Ctrl')
    }
    if (e.altKey) {
      keyValue.push('Alt')
    }
    if (e.shiftKey) {
      keyValue.push('Shift')
    }

    const keyCode = e.keyCode as keyof typeof keyCodeMap
    if (keyCodeMap[keyCode]) {
      keyValue.push(keyCodeMap[keyCode])
    } else {
      return
    }
    keyName = keyValue.join('+')

    await ipcRenderer.invoke('update-shortcut-message', {
      name,
      value: keyName,
    })

    setShortcuts({ ...shortcuts, [name]: keyName })
  }

  return (
    <div className="app">
      <form>
        <div className="group">
          <input
            type="text"
            value={shortcuts.openSaladict}
            onKeyDown={handleKeydown.bind(null, 'openSaladict')}
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Open Saladict</label>
        </div>
        <div className="group">
          <input
            type="text"
            value={shortcuts.enableInlineTranslator}
            onKeyDown={handleKeydown.bind(null, 'enableInlineTranslator')}
          />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label>Enable Inline Translator</label>
        </div>
      </form>
    </div>
  )
}

export default App
