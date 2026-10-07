import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/800.css'
import '@fontsource/press-start-2p/400.css'
import '@fontsource/caveat/400.css'
import '@fontsource/caveat/700.css'

import './index.css'
import './site.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
