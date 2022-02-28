import styled from 'styled-components'
import { GlobalStyles } from './styles/GlobalStyles'

function App() {
  return (
    <>
      <GlobalStyles />
      <iframe
        frameBorder="0"
        scrolling="no"
        className="iframe"
        src={`app://-/quick-search.html`}
      ></iframe>
    </>
  )
}

export default App
