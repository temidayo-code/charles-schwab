import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { dashNavItems } from '../../data/navItems'

const WALLET_SUB = [
  { label: 'My Wallet', to: '/user/wallet' },
  { label: 'Account',   to: '/user/account' },
]

interface DashboardSidebarProps {
  /** Controlled open state (used on mobile) */
  open: boolean
  /** Called when the sidebar requests to close itself */
  onClose: () => void
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const location = useLocation()
  const isWalletActive =
    location.pathname.startsWith('/user/wallet') ||
    location.pathname.startsWith('/user/account')
  const [walletOpen, setWalletOpen] = useState(isWalletActive)

  return (
    <aside
      className={[
        // Always rendered; on desktop always visible, on mobile slides in/out
        'flex flex-col flex-shrink-0 h-screen overflow-y-auto z-30',
        'fixed md:relative',
        'transition-transform duration-300 ease-in-out',
        // Mobile: translate off-screen when closed, on-screen when open
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
      style={{
        width: '220px',
        backgroundColor: '#0d0824',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
      aria-label="Dashboard navigation"
    >
      {/* Logo + close button (mobile only) */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <img src="/img/logo.png" alt="Charles Schwab" className="h-8 w-auto" />
        {/* Close button — only visible on mobile */}
        <button
          onClick={onClose}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="Close sidebar"
        >
          <i className="fas fa-times text-sm" aria-hidden="true" />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 pt-5 pb-3">
        <p
          className="px-3 mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: '#6b7280' }}
        >
          Navigation
        </p>

        <ul className="space-y-0.5">
          {dashNavItems.map((item) => {
            if (item.key === 'wallet') {
              return (
                <li key={item.key}>
                  {/* Wallet parent row – toggles submenu */}
                  <button
                    onClick={() => setWalletOpen((o) => !o)}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isWalletActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                    ].join(' ')}
                    style={
                      isWalletActive
                        ? {
                            background: 'rgba(74,222,128,0.1)',
                            borderLeft: '3px solid #4ade80',
                            paddingLeft: '9px',
                          }
                        : {}
                    }
                  >
                    <i className={`${item.icon} w-4 text-center`} aria-hidden="true" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <i
                      className={`fas text-xs opacity-50 transition-transform duration-200 ${
                        walletOpen ? 'fa-chevron-down' : 'fa-chevron-right'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Submenu */}
                  {walletOpen && (
                    <ul className="mt-0.5 ml-7 space-y-0.5">
                      {WALLET_SUB.map((sub) => (
                        <li key={sub.to}>
                          <NavLink
                            to={sub.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                              [
                                'block px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                isActive
                                  ? 'text-white'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5',
                              ].join(' ')
                            }
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            }

            return (
              <li key={item.key}>
                <NavLink
                  to={item.to}
                  end={item.key === 'dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                    ].join(' ')
                  }
                  style={({ isActive }) =>
                    isActive
                      ? {
                          background: 'rgba(74,222,128,0.1)',
                          borderLeft: '3px solid #4ade80',
                          paddingLeft: '9px',
                        }
                      : {}
                  }
                >
                  <i className={`${item.icon} w-4 text-center`} aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {item.hasChevron && (
                    <i
                      className="fas fa-chevron-right text-xs opacity-50"
                      aria-hidden="true"
                    />
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>


      </nav>

      {/* Upgrade banner */}
      <div className="px-3 pb-5">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'rgba(162,133,57,0.08)',
            border: '1px solid rgba(162,133,57,0.2)',
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ background: 'rgba(162,133,57,0.15)' }}
          >
            <i
              className="fas fa-crown text-xs"
              style={{ color: '#c9a84c' }}
              aria-hidden="true"
            />
          </div>
          <p className="text-xs text-gray-400 leading-snug mb-3">
            For more features
            <br />
            <span className="font-semibold text-white">Upgrade to Pro</span>
          </p>
          <button
            className="w-full py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: '#a28539', color: '#0d0824' }}
          >
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  )
}
