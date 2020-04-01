import sinon from 'sinon'
import { msgPageListeners, runtimeSendMessage } from '../../helpers'

// Assuming all tab messages are sent to the tab that is under development
// Filter out messages if you need to narrow down
const _sendMessage = runtimeSendMessage(window.parent[msgPageListeners])
function sendTabMessage (tabId, message) {
  if (typeof tabId !== 'string') {
    return Promise.reject(new TypeError('Wrong argument type'))
  }
  return _sendMessage(message)
}
sendTabMessage._sender = sinon.stub().callsFake(() => ({}))
_sendMessage._sender.callsFake(sendTabMessage._sender)

export const tabs = new Proxy(window.parent.browser.tabs, {
  get: (...args) => {
    if (args[1] === 'sendMessage') {
      return sendTabMessage
    }
    return Reflect.get(...args)
  }
})
