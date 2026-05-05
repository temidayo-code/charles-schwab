import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

export default function Account() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'Profile' | 'Security' | 'Notifications' | 'Billing'>('Profile')

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
            <h2 className="text-xl font-bold text-white">Account</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences</p>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {(['Profile', 'Security', 'Notifications', 'Billing'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeTab === tab
                    ? { background: 'rgba(74,222,128,0.12)', color: '#fff', borderLeft: 'none' }
                    : { color: '#6b7280' }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Avatar card */}
              <div
                className="rounded-2xl p-6 flex flex-col items-center text-center"
                style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-4"
                  style={{ background: 'rgba(162,133,57,0.2)', color: '#c9a84c' }}
                >
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : 'JS'}
                </div>
                <h3 className="text-base font-semibold text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'Jonathan Smith'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{user?.role ?? 'Admin'}</p>
                <p className="text-xs text-gray-600 mt-1">{user?.email ?? 'demo@schwab.com'}</p>

                <button
                  className="mt-5 w-full py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                  style={{ background: 'rgba(162,133,57,0.15)', color: '#c9a84c', border: '1px solid rgba(162,133,57,0.3)' }}
                >
                  <i className="fas fa-camera mr-2 text-xs" />
                  Change Photo
                </button>

                {/* Stats */}
                <div className="w-full mt-6 space-y-3">
                  {[
                    { label: 'Account Balance', value: `$${(user?.balance ?? 125430.5).toLocaleString()}`, icon: 'fa-wallet', color: '#4ade80' },
                    { label: 'Currency', value: user?.currency ?? 'USD', icon: 'fa-dollar-sign', color: '#a78bfa' },
                    { label: 'Member Since', value: 'Jan 2024', icon: 'fa-calendar', color: '#60a5fa' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: `${stat.color}18` }}
                        >
                          <i className={`fas ${stat.icon} text-xs`} style={{ color: stat.color }} />
                        </div>
                        <span className="text-xs text-gray-400">{stat.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile form */}
              <div
                className="lg:col-span-2 rounded-2xl p-6"
                style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <h3 className="text-base font-semibold text-white mb-5">Personal Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', value: user?.firstName ?? 'Jonathan', type: 'text' },
                    { label: 'Last Name', value: user?.lastName ?? 'Smith', type: 'text' },
                    { label: 'Email Address', value: user?.email ?? 'demo@schwab.com', type: 'email' },
                    { label: 'Phone Number', value: '+1 (555) 000-0000', type: 'tel' },
                    { label: 'Date of Birth', value: '1990-01-15', type: 'date' },
                    { label: 'Country', value: 'United States', type: 'text' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs text-gray-500 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                      />
                    </div>
                  ))}

                  {/* Address – full width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5">Address</label>
                    <input
                      type="text"
                      defaultValue="123 Main Street, New York, NY 10001"
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    className="px-5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                    style={{ color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: '#4ade80', color: '#0d0824' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div
              className="max-w-xl rounded-2xl p-6"
              style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="text-base font-semibold text-white mb-5">Change Password</h3>
              <div className="space-y-4">
                {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                  <div key={label}>
                    <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(74,222,128,0.4)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                  </div>
                ))}
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 mt-2"
                  style={{ background: '#4ade80', color: '#0d0824' }}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div
              className="max-w-xl rounded-2xl p-6"
              style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="text-base font-semibold text-white mb-5">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive updates via email', on: true },
                  { label: 'Push Notifications', desc: 'Browser push alerts', on: true },
                  { label: 'Trade Alerts', desc: 'Notify on order fills', on: false },
                  { label: 'Price Alerts', desc: 'Notify on price targets', on: true },
                  { label: 'Security Alerts', desc: 'Login and account changes', on: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div
                      className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
                      style={{ background: item.on ? '#4ade80' : 'rgba(255,255,255,0.1)' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full bg-white shadow transition-transform"
                        style={{ transform: item.on ? 'translateX(20px)' : 'translateX(0)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Billing' && (
            <div
              className="max-w-xl rounded-2xl p-6"
              style={{ background: 'rgba(22,15,53,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <h3 className="text-base font-semibold text-white mb-5">Billing Information</h3>
              <div
                className="flex items-center gap-4 p-4 rounded-xl mb-5"
                style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(74,222,128,0.15)' }}
                >
                  <i className="fas fa-check text-sm" style={{ color: '#4ade80' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Free Plan</p>
                  <p className="text-xs text-gray-500 mt-0.5">You are currently on the free plan</p>
                </div>
                <button
                  className="ml-auto px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background: '#a28539', color: '#0d0824' }}
                >
                  Upgrade
                </button>
              </div>
              <p className="text-xs text-gray-500">No payment methods on file.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
