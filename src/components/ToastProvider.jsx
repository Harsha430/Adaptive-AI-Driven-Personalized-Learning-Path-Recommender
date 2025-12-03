import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2)
    const entry = { id, type: toast.type || 'info', message: toast.message }
    setToasts((prev) => [...prev, entry])
    setTimeout(() => remove(id), toast.duration ?? 2500)
  }, [remove])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-[92vw] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md border px-4 py-3 shadow-sm text-sm bg-white ${
              t.type === 'success' ? 'border-green-200 text-green-800' :
              t.type === 'error' ? 'border-red-200 text-red-800' :
              'border-gray-200 text-gray-800'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}


