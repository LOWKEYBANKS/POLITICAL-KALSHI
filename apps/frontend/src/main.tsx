// 🧠 MAIN ENTRY POINT - POLITICAL WARFARE INITIALIZATION
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './services/socket'

// ⚡ INITIALIZE PSYCHOLOGICAL WARFARE PLATFORM
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
          },
          success: {
            style: {
              background: '#065f46',
              border: '1px solid #10b981',
            },
          },
          error: {
            style: {
              background: '#7f1d1d', 
              border: '1px solid #ef4444',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
