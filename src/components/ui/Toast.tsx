import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10)
    // Auto-dismiss
    const exitTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(exitTimer)
    }
  }, [duration, onClose])

  const isSuccess = type === 'success'

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl transition-all duration-300"
      style={{
        minWidth: '300px',
        maxWidth: '420px',
        background: isSuccess
          ? 'linear-gradient(135deg, rgba(22,15,53,0.98) 0%, rgba(17,11,45,0.98) 100%)'
          : 'linear-gradient(135deg, rgba(22,15,53,0.98) 0%, rgba(17,11,45,0.98) 100%)',
        border: isSuccess
          ? '1px solid rgba(74,222,128,0.35)'
          : '1px solid rgba(248,113,113,0.35)',
        boxShadow: isSuccess
          ? '0 8px 32px rgba(74,222,128,0.15), 0 2px 8px rgba(0,0,0,0.4)'
          : '0 8px 32px rgba(248,113,113,0.15), 0 2px 8px rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.96)',
      }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isSuccess ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
          border: isSuccess ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(248,113,113,0.3)',
        }}
      >
        <i
          className={isSuccess ? 'fas fa-check text-sm' : 'fas fa-times text-sm'}
          style={{ color: isSuccess ? '#4ade80' : '#f87171' }}
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-snug">
          {isSuccess ? 'Success' : 'Error'}
        </p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9ca3af' }}>
          {message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <i className="fas fa-times text-xs text-gray-500" aria-hidden="true" />
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl"
        style={{
          background: isSuccess
            ? 'linear-gradient(90deg, #4ade80, #22c55e)'
            : 'linear-gradient(90deg, #f87171, #ef4444)',
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}
