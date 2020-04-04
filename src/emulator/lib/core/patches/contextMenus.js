window.browser.menus.create.callsFake(() => Promise.resolve())
window.browser.menus.remove.callsFake(() => Promise.resolve())
window.browser.menus.removeAll.callsFake(() => Promise.resolve())

if (!window.browser.contextMenus) {
  window.browser.contextMenus = {}
}

Object.keys(window.browser.menus).forEach(key => {
  window.browser.contextMenus[key] = window.browser.menus[key]
})
