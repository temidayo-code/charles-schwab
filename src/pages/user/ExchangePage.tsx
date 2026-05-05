import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useOrders } from '../../hooks/useOrders'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Coin {
  symbol: string
  name: string
  color: string
  price: number
  change24h: number
  volume24h: string
  marketCap: string
  buyPrice: number
  sellPrice: number
  rate: number
}

// ─── Static coin data ─────────────────────────────────────────────────────────

const COINS: Coin[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    color: '#f7931a',
    price: 9542.39,
    change24h: 1.64,
    volume24h: '$47.22B',
    marketCap: '$219.24B',
    buyPrice: 8420.5,
    sellPrice: 8420.5,
    rate: 43474.5,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    color: '#627eea',
    price: 3241.18,
    change24h: 2.31,
    volume24h: '$21.44B',
    marketCap: '$389.12B',
    buyPrice: 3240.0,
    sellPrice: 3242.0,
    rate: 3241.18,
  },
  {
    symbol: 'DASH',
    name: 'Dash',
    color: '#008de4',
    price: 45662.05,
    change24h: -0.87,
    volume24h: '$8.11B',
    marketCap: '$72.44B',
    buyPrice: 45660.0,
    sellPrice: 45664.0,
    rate: 43474.5,
  },
  {
    symbol: 'LTC',
    name: 'Lite Coin',
    color: '#bfbbbb',
    price: 182.44,
    change24h: 0.55,
    volume24h: '$3.22B',
    marketCap: '$12.88B',
    buyPrice: 182.0,
    sellPrice: 183.0,
    rate: 182.44,
  },
]

// ─── TradingView Widget ───────────────────────────────────────────────────────

function TradingViewChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Remove previous widget
    if (widgetRef.current) {
      widgetRef.current.remove()
      widgetRef.current = null
    }

    const div = document.createElement('div')
    div.className = 'tradingview-widget-container__widget'
    div.style.height = '100%'
    div.style.width = '100%'
    containerRef.current.appendChild(div)
    widgetRef.current = div

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}USDT`,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(17, 11, 45, 0)',
      gridColor: 'rgba(255, 255, 255, 0.04)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
    })
    containerRef.current.appendChild(script)

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove()
        widgetRef.current = null
      }
      script.remove()
    }
  }, [symbol])

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container"
      style={{ height: '100%', width: '100%' }}
    />
  )
}

// ─── Order Book Panel ─────────────────────────────────────────────────────────

interface OrderBookProps {
  type: 'sell' | 'buy'
  orders: { price: number; amount: number; total: number }[]
  loading: boolean
}

function OrderBook({ type, orders, loading }: OrderBookProps) {
  const isBuy = type === 'buy'
  const accentColor = isBuy ? '#4ade80' : '#f87171'

  return (
    <div
      className="rounded-2xl p-4 flex flex-col"
      style={{
        background: isBuy ? 'rgba(74,222,128,0.05)' : 'rgba(22,15,53,0.9)',
        border: isBuy
          ? '1px solid rgba(74,222,128,0.15)'
          : '1px solid rgba(255,255,255,0.07)',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">
          {isBuy ? 'Buy Order' : 'Sell Order'}
        </h3>
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="More options"
        >
          <i className="fas fa-ellipsis-h text-xs" aria-hidden="true" />
        </button>
      </div>

      {/* Column headers */}
      <div
        className="grid grid-cols-3 pb-2 mb-1"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {['Price', 'Amount', 'Total'].map((h, i) => (
          <span
            key={h}
            className={`text-xs font-medium ${i > 0 ? 'text-right' : ''}`}
            style={{ color: '#6b7280' }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="py-4 text-center text-gray-500 text-xs">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="py-4 text-center text-gray-500 text-xs">No orders</div>
        ) : (
          orders.slice(0, 8).map((order, i) => (
            <div
              key={i}
              className="grid grid-cols-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <span className="text-xs font-medium" style={{ color: accentColor }}>
                {order.price.toFixed(2)}
              </span>
              <span className="text-xs text-right text-gray-300">{order.amount}</span>
              <span className="text-xs text-right text-gray-300">
                ${order.total.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* View All */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
          style={
            isBuy
              ? {
                  background: 'rgba(22,15,53,0.8)',
                  color: '#4ade80',
                  border: '1px solid rgba(74,222,128,0.2)',
                }
              : {
                  background: 'rgba(255,255,255,0.06)',
                  color: '#9ca3af',
                  border: '1px solid rgba(255,255,255,0.08)',
                }
          }
        >
          View All
          <i className="fas fa-external-link-alt text-xs" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

// ─── Quick Trade Panel ────────────────────────────────────────────────────────

interface QuickTradeProps {
  coin: Coin
}

function QuickTradePanel({ coin }: QuickTradeProps) {
  const [amountBtc, setAmountBtc] = useState('785.66')
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [agreed, setAgreed] = useState(false)

  const fee = parseFloat(amountBtc) * 0.01 || 0
  const priceBpl = parseFloat(amountBtc) / coin.rate || 0
  const totalBpl = priceBpl + fee / coin.rate

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{
        background: 'rgba(22,15,53,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Quick Trade</h3>
          <p className="text-xs text-gray-500 mt-0.5">Lorem ipsum dolor sit amet,</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#d1d5db',
          }}
        >
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: `${coin.color}33`, color: coin.color }}
          >
            {coin.symbol.charAt(0)}
          </div>
          {coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} {coin.symbol}
          <i className="fas fa-chevron-down text-xs opacity-60" aria-hidden="true" />
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        {[
          { label: 'Amount BTC', value: amountBtc, onChange: setAmountBtc, editable: true },
          {
            label: 'Price BPL',
            value: priceBpl.toFixed(6),
            onChange: () => {},
            editable: false,
          },
          { label: 'Fee (1%)', value: fee.toFixed(6), onChange: () => {}, editable: false },
          {
            label: 'Total BPL',
            value: totalBpl.toFixed(6),
            onChange: () => {},
            editable: false,
          },
        ].map(({ label, value, onChange, editable }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="text-xs text-gray-400">{label}</span>
            {editable ? (
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs font-semibold text-white bg-transparent outline-none text-right w-28"
                aria-label={label}
              />
            ) : (
              <span className="text-xs font-semibold text-white">{value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Buy / Sell buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTab('buy')}
          className="py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            background:
              tab === 'buy'
                ? 'linear-gradient(135deg,#7c3aed,#a855f7)'
                : 'rgba(124,58,237,0.15)',
            color: tab === 'buy' ? '#fff' : '#a855f7',
            border: tab === 'buy' ? 'none' : '1px solid rgba(168,85,247,0.3)',
          }}
        >
          Buy
          <i className="fas fa-arrow-up text-xs" aria-hidden="true" />
        </button>
        <button
          onClick={() => setTab('sell')}
          className="py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            background:
              tab === 'sell'
                ? 'linear-gradient(135deg,#16a34a,#4ade80)'
                : 'rgba(74,222,128,0.1)',
            color: tab === 'sell' ? '#0d0824' : '#4ade80',
            border: tab === 'sell' ? 'none' : '1px solid rgba(74,222,128,0.25)',
          }}
        >
          Sell
          <i className="fas fa-arrow-down text-xs" aria-hidden="true" />
        </button>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-yellow-500 cursor-pointer flex-shrink-0"
        />
        <span className="text-xs text-gray-400 leading-relaxed">
          I have read and agree to Terms of Service
        </span>
      </label>
    </div>
  )
}

// ─── Coin Info Sidebar ────────────────────────────────────────────────────────

function CoinInfoPanel({ coin }: { coin: Coin }) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{
        background: 'rgba(22,15,53,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">About</h3>
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
          aria-label="More options"
        >
          <i className="fas fa-ellipsis-h text-xs" aria-hidden="true" />
        </button>
      </div>

      {/* Coin icon + name */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
          style={{
            background: `${coin.color}22`,
            border: `2px solid ${coin.color}55`,
            color: coin.color,
          }}
        >
          {coin.symbol.charAt(0)}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white">{coin.name}</p>
          <p className="text-xs text-gray-500">{coin.symbol}</p>
        </div>
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          1 {coin.symbol} ={' '}
          <span className="text-white font-semibold">
            {coin.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </span>
        </p>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed">
        {coin.name} is a leading cryptocurrency known for its decentralized protocol and
        open-source nature. It operates as a peer-to-peer digital currency enabling fast,
        low-cost transactions globally.
      </p>

      {/* Read More */}
      <button
        className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{
          background: 'transparent',
          border: `1px solid ${coin.color}55`,
          color: coin.color,
        }}
      >
        Read More
        <i className="fas fa-external-link-alt text-xs" aria-hidden="true" />
      </button>
    </div>
  )
}

// ─── ExchangePage ─────────────────────────────────────────────────────────────

export default function ExchangePage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [activeCoin, setActiveCoin] = useState<Coin>(COINS[0])

  const { orders: sellOrders, loading: sellLoading } = useOrders(user?.id, 'sell')
  const { orders: buyOrders, loading: buyLoading } = useOrders(user?.id, 'buy')

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <DashboardLayout>
      <main
        className="flex-1 overflow-y-auto p-4 sm:p-6"
        style={{ backgroundColor: '#110b2d' }}
      >
        {/* ── Page title + coin tabs ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h1 className="text-lg font-bold text-white">Coin Details</h1>

          {/* Coin selector tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {COINS.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => setActiveCoin(coin)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={
                  activeCoin.symbol === coin.symbol
                    ? {
                        background: `${coin.color}22`,
                        border: `1px solid ${coin.color}55`,
                        color: coin.color,
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#9ca3af',
                      }
                }
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    background: `${coin.color}33`,
                    color: coin.color,
                  }}
                >
                  {coin.symbol.charAt(0)}
                </div>
                {coin.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main grid: chart area + right sidebar ── */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── Left / Center: Chart + Order Books ── */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-4">

            {/* Chart card */}
            <div
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: 'rgba(17,11,45,0.95)',
                border: '1px solid rgba(255,255,255,0.07)',
                minHeight: '420px',
              }}
            >
              {/* Chart toolbar */}
              <div
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-bold text-white">Coin chart</h2>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>
                      Price{' '}
                      <span className="text-white font-semibold">
                        ${activeCoin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </span>
                    <span>
                      24h change{' '}
                      <span
                        className="font-semibold"
                        style={{ color: activeCoin.change24h >= 0 ? '#4ade80' : '#f87171' }}
                      >
                        {activeCoin.change24h >= 0 ? '+' : ''}
                        {activeCoin.change24h.toFixed(2)}%
                      </span>
                    </span>
                    <span className="hidden sm:inline">
                      Volume (24h){' '}
                      <span className="text-white font-semibold">{activeCoin.volume24h}</span>
                    </span>
                    <span className="hidden md:inline">
                      Market Cap{' '}
                      <span className="text-white font-semibold">{activeCoin.marketCap}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Buy / Sell price badges */}
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#a855f7' }}
                    />
                    <span style={{ color: '#a855f7' }}>Buy</span>
                    <span className="text-white">
                      ${activeCoin.buyPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#4ade80' }}
                    />
                    <span style={{ color: '#4ade80' }}>Sell</span>
                    <span className="text-white">
                      ${activeCoin.sellPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </span>

                  {/* Get Report */}
                  <button
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#d1d5db' }}
                  >
                    <i className="fas fa-file-alt text-xs" aria-hidden="true" />
                    Get Report
                  </button>

                  {/* Currency selector */}
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg,#a28539,#c9a84c)',
                      color: '#0d0824',
                    }}
                  >
                    USD ($ US Dollar)
                    <i className="fas fa-chevron-down text-xs" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* TradingView chart */}
              <div className="flex-1" style={{ minHeight: '360px' }}>
                <TradingViewChart symbol={activeCoin.symbol} />
              </div>
            </div>

            {/* ── Order books row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OrderBook type="sell" orders={sellOrders} loading={sellLoading} />
              <OrderBook type="buy" orders={buyOrders} loading={buyLoading} />
            </div>
          </div>

          {/* ── Right sidebar: Coin info + Quick Trade ── */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
            <CoinInfoPanel coin={activeCoin} />
            <QuickTradePanel coin={activeCoin} />
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}
