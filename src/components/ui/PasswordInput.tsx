import { useState } from 'react'

interface PasswordInputProps {
  id: string
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

/** Password input with show/hide toggle eye icon */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  required = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pr-11 rounded-lg text-gray-100 text-sm outline-none focus:ring-2 transition-all"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(162,133,57,0.2)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(162,133,57,0.5)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(162,133,57,0.08)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(162,133,57,0.2)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md transition-all hover:bg-white/10"
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          <i
            className={show ? 'fas fa-eye-slash' : 'fas fa-eye'}
            style={{ color: '#6b7280', fontSize: 14 }}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  )
}
