import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { router } from '@/app/routes'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root nao encontrado no DOM.')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>,
)
