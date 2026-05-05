export interface DashNavItem {
  key: string
  label: string
  icon: string
  to: string
  hasChevron?: boolean
}

export const dashNavItems: DashNavItem[] = [
  { key: 'dashboard',   label: 'Dashboard',   icon: 'fas fa-th-large',     to: '/user/dashboard' },
  { key: 'wallet',      label: 'My Wallet',   icon: 'fas fa-wallet',       to: '/user/wallet',      hasChevron: true },
  { key: 'transaction', label: 'Transaction', icon: 'fas fa-exchange-alt', to: '/user/transactions' },
  { key: 'crypto',      label: 'Crypto',      icon: 'fas fa-coins',        to: '/user/crypto' },
  { key: 'exchange',    label: 'Exchange',    icon: 'fas fa-sync-alt',     to: '/user/exchange' },
  { key: 'settings',    label: 'Settings',    icon: 'fas fa-cog',          to: '/user/settings' },
]
