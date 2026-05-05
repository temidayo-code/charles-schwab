import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWallets } from '../../hooks/useWallets'
import { useOrders } from '../../hooks/useOrders'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import WalletCard from '../../components/dashboard/WalletCard'
import CryptoStatsChart from '../../components/dashboard/CryptoStatsChart'
import MarketOverviewChart from '../../components/dashboard/MarketOverviewChart'
import OrderTable from '../../components/dashboard/OrderTable'
import OnboardingSteps from '../../components/dashboard/OnboardingSteps'
import { sparklinePaths } from '../../data/mockSparklines'

const ONBOARDING_KEY = 'cs_onboarding_dismissed'

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [showOnboarding, setShowOnboarding] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== 'true',
  )

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const { wallets, loading: walletsLoading } = useWallets(user?.id)
  const { orders: sellOrders, loading: sellLoading } = useOrders(user?.id, 'sell')
  const { orders: buyOrders, loading: buyLoading } = useOrders(user?.id, 'buy')

  const handleDismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShowOnboarding(false)
  }

  if (!isAuthenticated) return null

  return (
    <DashboardLayout>
      <main
        className="flex-1 overflow-y-auto p-4 sm:p-6"
        style={{ backgroundColor: '#110b2d' }}
      >
          {/* Onboarding checklist — shown to new users */}
          {showOnboarding && (
            <OnboardingSteps onDismiss={handleDismissOnboarding} />
          )}

          {/* Row 1: Wallet cards (2×2) + Crypto Stats chart */}
          <div className="grid grid-cols-12 gap-4">
            {/* Wallet cards 2×2 */}
            <div className="col-span-12 lg:col-span-5">
              {walletsLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="rounded-2xl p-5 animate-pulse"
                      style={{ background: 'rgba(22,15,53,0.9)', height: '140px' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {wallets.map((wallet) => (
                    <WalletCard
                      key={wallet.id}
                      coin={wallet.coin}
                      symbol={wallet.symbol}
                      valueUsd={wallet.valueUsd}
                      change30d={wallet.change30d}
                      color={wallet.color}
                      sparklinePath={sparklinePaths[wallet.symbol] ?? sparklinePaths['BTC']}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Crypto Stats chart */}
            <div className="col-span-12 lg:col-span-7">
              <CryptoStatsChart />
            </div>
          </div>

          {/* Row 2: Market Overview + Sell Orders + Buy Orders */}
          <div className="grid grid-cols-12 gap-4 mt-4">
            {/* Market Overview */}
            <div className="col-span-12 lg:col-span-5">
              <MarketOverviewChart />
            </div>

            {/* Sell Orders */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
              <OrderTable
                type="sell"
                orders={sellOrders}
                title="Sell Order"
                loading={sellLoading}
              />
            </div>

            {/* Buy Orders */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <OrderTable
                type="buy"
                orders={buyOrders}
                title="Buy Order"
                loading={buyLoading}
              />
            </div>
          </div>
        </main>
    </DashboardLayout>
  )
}
