import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U'

  return (
    <header
      className="flex items-center gap-3 px-4 sm:px-6 flex-shrink-0"
      style={{
        height: '64px',
        backgroundColor: '#0d0824',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        aria-label="Open navigation"
      >
        <i className="fas fa-bars text-sm" aria-hidden="true" />
      </button>
      {/* Page title */}
      <h1 className="text-xl font-bold text-white flex-shrink-0">Dashboard</h1>

      {/* Search */}
      <div className="flex-1 max-w-sm mx-4">
        <div className="relative">
          <i
            className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: '#6b7280' }}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-gray-300 rounded-full outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Mail */}
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="Mail"
        >
          <i className="fas fa-envelope text-sm text-gray-400" aria-hidden="true" />
        </button>

        {/* Bell with dot */}
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="Notifications"
        >
          <i className="fas fa-bell text-sm text-gray-400" aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#4ade80' }}
            aria-hidden="true"
          />
        </button>

        {/* Divider */}
        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* User */}
        <div className="flex items-center gap-2.5">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'rgba(162,133,57,0.25)', color: '#c9a84c' }}
            >
              {initials}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
              {user?.role ?? 'Member'}
            </p>
          </div>
          <button
            onClick={logout}
            className="ml-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Log out"
            title="Log out"
          >
            <i className="fas fa-sign-out-alt" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
