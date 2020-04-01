import browser from 'sinon-chrome/webextensions'

window.browser = browser

const req = require.context('./patches', false, /\.js$/)
req.keys().map(req)
