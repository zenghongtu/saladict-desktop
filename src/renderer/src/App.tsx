import { Route, Routes } from 'react-router-dom'
import { GlobalStyles } from './styles/GlobalStyles'
import { Suspense } from 'react'
import React from 'react'

const Panel = React.lazy(() => import('./pages/Panel'))
const Setting = React.lazy(() => import('./pages/Setting'))

function App() {
  return (
    <>
      <GlobalStyles />

      <GlobalStyles />
      <Routes>
        <Route
          path="/setting"
          element={
            <Suspense fallback={null}>
              <Setting />
            </Suspense>
          }
        />
        <Route
          path="/:page"
          element={
            <Suspense fallback={null}>
              <Panel />
            </Suspense>
          }
        />
      </Routes>
    </>
  )
}

export default App
