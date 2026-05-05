import { useState } from 'react'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * Shared shell for all dashboard pages.
 * Manages the mobile sidebar open/close state and passes it down.
 */
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0d0824' }}>

      {/* Mobile overlay — tap to close */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen((o) => !o)} />
        {children}
      </div>
    </div>
  )
}
