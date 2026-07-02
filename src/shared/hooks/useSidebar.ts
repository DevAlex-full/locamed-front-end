import { useState, useCallback } from 'react'

// =============================================================================
// useSidebar — Gerencia estado de abertura da sidebar mobile
// =============================================================================
//
// A sidebar desktop e sempre visivel (CSS).
// A sidebar mobile usa este hook para abrir/fechar via hamburger button.
// O estado e local ao AppLayout — nao precisa de contexto global.
// =============================================================================

export interface UseSidebarReturn {
  isOpen: boolean
  open:   () => void
  close:  () => void
  toggle: () => void
}

export function useSidebar(): UseSidebarReturn {
  const [isOpen, setIsOpen] = useState(false)

  const open   = useCallback(() => setIsOpen(true),        [])
  const close  = useCallback(() => setIsOpen(false),       [])
  const toggle = useCallback(() => setIsOpen((v) => !v),   [])

  return { isOpen, open, close, toggle }
}