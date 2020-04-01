window.browser.notifications.create.callsFake((...args) => {
  console.log('create notifications:', ...args)
  return Promise.resolve(`${Date.now()}`)
})
