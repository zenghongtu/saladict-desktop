import './style.scss'

const iframe = document.createElement('iframe')
const query = new URLSearchParams(window.location.search)

iframe.src = `/${query.get('redirect')}?${+new Date()}`
document.body.appendChild(iframe)
