import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { Cosmos } from './Figuras.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Cosmos />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
