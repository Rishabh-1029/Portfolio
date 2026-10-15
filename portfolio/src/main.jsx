import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Section links can leave #projects in the address bar. On a fresh page load,
// clear that stale fragment so the portfolio opens at the home section. The
// in-app case study back link still navigates to /#projects as intended.
if (window.location.pathname === '/' && window.location.hash === '#projects') {
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${window.location.search}`,
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
