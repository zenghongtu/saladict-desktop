import React, { useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'

const IframeStyled = styled.iframe`
  width: 100%;
  height: 100%;
`

const menuBarBtnActionMap: Record<string, () => void> = {
  1: () => {
    window.bridge.openWindow('options')
  },
  3: () => {
    window.bridge.openWindow('notebook')
  },
}

const Panel = () => {
  const { page } = useParams<{ page: string }>()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  console.log('page: ', page)

  const handleIframeLoad = () => {
    const btns = iframeRef.current?.contentDocument?.querySelectorAll(
      '.dictPanel-Head button.menuBar-Btn',
    )
    // btns?.forEach((item, idx) => {
    //   const action = menuBarBtnActionMap[idx]
    //   if (action) {
    //     item.addEventListener('click', (ev) => {
    //       ev.stopPropagation()
    //       ev.preventDefault()
    //       action.call(null)
    //     })
    //   }
    // })
  }

  return (
    <IframeStyled
      ref={iframeRef}
      onLoad={handleIframeLoad}
      frameBorder="0"
      scrolling="no"
      src={`app://-/${page}`}
    ></IframeStyled>
  )
}

export default Panel
