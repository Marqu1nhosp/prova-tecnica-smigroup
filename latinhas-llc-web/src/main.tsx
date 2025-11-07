import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import { DemandsPage } from './page/Demand'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemandsPage />
  </StrictMode>,
)
