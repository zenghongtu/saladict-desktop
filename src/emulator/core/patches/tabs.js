window.browser.tabs.create.callsFake(({ url }) => {
  if (!url) {
    return Promise.reject(new Error('invalid url'))
  }
  window.open(url)
  return Promise.resolve({
    active: true,
    url: url,
    id: `${Date.now()}`
  })
})
window.browser.tabs.query.callsFake(() => Promise.resolve([]))
window.browser.tabs.highlight.callsFake(() => Promise.resolve())
window.browser.tabs.sendMessage.callsFake(() => Promise.resolve())
