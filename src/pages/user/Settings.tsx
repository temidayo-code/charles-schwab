import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

export default function Settings() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Security settings state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [smsAuthEnabled, setSmsAuthEnabled] = useState(false)
  const [emailAuthEnabled, setEmailAuthEnabled] = useState(true)
  const [identityVerificationEnabled, setIdentityVerificationEnabled] = useState(true)
  const [antiPhishingEnabled, setAntiPhishingEnabled] = useState(true)
  const [withdrawalWhitelistEnabled, setWithdrawalWhitelistEnabled] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0d0824' }}>
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: '#110b2d' }}
        >
          {/* Page heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Account Security</h2>
            <p className="text-sm text-gray-400 mt-1">Manage your security settings and authentication methods</p>
          </div>

          {/* Security status badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <i className="fas fa-times-circle text-sm" style={{ color: '#ef4444' }} />
              <span className="text-sm font-medium" style={{ color: '#ef4444' }}>2 FA</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)' }}
            >
              <i className="fas fa-exclamation-circle text-sm" style={{ color: '#fb923c' }} />
              <span className="text-sm font-medium" style={{ color: '#fb923c' }}>Identify Verification</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}
            >
              <i className="fas fa-check-circle text-sm" style={{ color: '#4ade80' }} />
              <span className="text-sm font-medium" style={{ color: '#4ade80' }}>Enable Anti-phising Code</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <i className="fas fa-times-circle text-sm" style={{ color: '#ef4444' }} />
              <span className="text-sm font-medium" style={{ color: '#ef4444' }}>Turn-on Withdrawal Whitelist</span>
            </div>
          </div>

          {/* 2 Factor Authentication Section */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">2 Factor Authentication</h3>
            <p className="text-sm text-gray-400 mb-6">
              Two-factor authentication is an enhanced security measure. Once enabled, you'll be required to give two types of identification when you log into
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Authentication */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fab fa-google text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Google Authentication</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                    style={{ background: twoFactorEnabled ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: twoFactorEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </div>
                </div>
              </div>

              {/* SMS Authentication */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-sms text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">SMS Authentication</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                    style={{ background: smsAuthEnabled ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setSmsAuthEnabled(!smsAuthEnabled)}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: smsAuthEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Email Authentication */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-envelope text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Email Authentication</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                    style={{ background: emailAuthEnabled ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setEmailAuthEnabled(!emailAuthEnabled)}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: emailAuthEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Device Management */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-mobile-alt text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Device Management</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(162,133,57,0.15)', color: '#a28539', border: '1px solid rgba(162,133,57,0.3)' }}
                  >
                    Manage
                  </button>
                </div>
              </div>

              {/* Login Password */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-key text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Login Password</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(162,133,57,0.15)', color: '#a28539', border: '1px solid rgba(162,133,57,0.3)' }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Address Management */}
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-map-marker-alt text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Address Management</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(162,133,57,0.15)', color: '#a28539', border: '1px solid rgba(162,133,57,0.3)' }}
                  >
                    Manage
                  </button>
                </div>
              </div>

              {/* Whitelist */}
              <div
                className="p-5 rounded-xl md:col-span-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-list-alt text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Whitelist on</h4>
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                    style={{ background: withdrawalWhitelistEnabled ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setWithdrawalWhitelistEnabled(!withdrawalWhitelistEnabled)}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: withdrawalWhitelistEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Account Activity */}
              <div
                className="p-5 rounded-xl md:col-span-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-history text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Account Activity</h4>
                      <p className="text-xs text-gray-500 mt-1">Last Signed In</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Suspended Account Activity?{' '}
                        <span style={{ color: '#ef4444' }}>Deactivated Account</span>
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                    style={{ background: 'rgba(162,133,57,0.15)', color: '#a28539', border: '1px solid rgba(162,133,57,0.3)' }}
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Verification Section */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Identify Verification</h3>
            <p className="text-sm text-gray-400 mb-6">
              Identify Verification is an enhanced security measure. Once enabled, you'll be required to give two types of identification when you log into
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-id-card text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Manage Identify Verification</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Used for withdrawal & Security verification</p>
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                    style={{ background: identityVerificationEnabled ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setIdentityVerificationEnabled(!identityVerificationEnabled)}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: identityVerificationEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Anti-phising Code Section */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">Anti-phising Code</h3>
            <p className="text-sm text-gray-400 mb-6">
              Identify Verification is an enhanced security measure. Once enabled, you'll be required to give two types of identification when you log into
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(162,133,57,0.15)' }}
                    >
                      <i className="fas fa-shield-alt text-lg" style={{ color: '#a28539' }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Enable Anti-phising Code</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Enable Anti-phising Code & Security verification</p>
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                    style={{ background: antiPhishingEnabled ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => setAntiPhishingEnabled(!antiPhishingEnabled)}
                  >
                    <div
                      className="w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: antiPhishingEnabled ? 'translateX(20px)' : 'translateX(0)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
