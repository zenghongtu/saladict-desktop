import _ from 'lodash'
import sinon from 'sinon'
import {
  makeListener,
  msgPageListeners,
  msgBgListeners,
  runtimeSendMessage,
  connectPageListeners,
  connectBgListeners,
  runtimeConnect
} from '../../helpers'

window[msgPageListeners] = window[msgPageListeners] || new Set()
window[msgBgListeners] = window[msgBgListeners] || new Set()

window[connectPageListeners] = window[connectPageListeners] || new Set()
window[connectBgListeners] = window[connectBgListeners] || new Set()

window.browser.runtime.id = `Extension_ID_${Date.now()}`
window.browser.runtime.getURL.callsFake(path => path)
window.browser.runtime.getPlatformInfo.callsFake(() => Promise.resolve({}))
window.browser.runtime.getManifest.callsFake(() => Promise.resolve({}))
window.browser.runtime.reload.callsFake(() => window.location.reload(true))

window.browser.runtime.onStartup._listeners.forEach(listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  setTimeout(listener, 0)
})

window.browser.runtime.onInstalled._listeners.forEach(listener => {
  if (!_.isFunction(listener)) {
    throw new TypeError('Wrong argument type')
  }
  // delay startup calls
  listener({ reason: 'install' })
})

// sinon-chrome onMessage only has getters
const onMessage = makeListener(window[msgPageListeners])
window.browser.runtime.onMessage.addListener = onMessage.addListener
window.browser.runtime.onMessage.hasListener = onMessage.hasListener
window.browser.runtime.onMessage.removeListener = onMessage.removeListener

window.browser.runtime.sendMessage._sender = sinon.stub().callsFake(() => ({}))
const sendMessage = runtimeSendMessage(window[msgBgListeners])
sendMessage._sender.callsFake(window.browser.runtime.sendMessage._sender)
window.browser.runtime.sendMessage.callsFake(sendMessage)

// sinon-chrome onMessage only has getters
const onConnect = makeListener(window[connectPageListeners])
window.browser.runtime.onConnect.addListener = onConnect.addListener
window.browser.runtime.onConnect.hasListener = onConnect.hasListener
window.browser.runtime.onConnect.removeListener = onConnect.removeListener

window.browser.runtime.connect.callsFake(
  runtimeConnect(window[connectBgListeners])
)
