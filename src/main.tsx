import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BandsProvider } from './contexts/Bands/BandsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BandsProvider>
      <App />
    </BandsProvider>
  </StrictMode>
)
