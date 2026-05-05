import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTransactions } from '../../hooks/useTransactions'
import type { Transaction } from '../../services/transactionService'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar'
import DashboardHeader from '../../components/dashboard/DashboardHeader'

// ─── Avatar placeholder ───────────────────────────────────────────────────────
const AVATAR_COLORS: Record<string, string> = {
  Marquezz:     '#a78bfa',
  Jack:         '#60a5fa',
  'Jarinas Tom':'#34d399',
  Jonathan:     '#f59e0b',
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const bg = AVATAR_COLORS[name] ?? '#6b7280'
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: `${bg}30`, color: bg, border: `1px solid ${bg}50` }}
    >
      {initials}
    </div>
  )
}

// ─── Coin icon ────────────────────────────────────────────────────────────────
function CoinIcon({ symbol, color }: { symbol: string; color: string }) {
  const icons: Record<string, string> = { BTC: 'fab fa-bitcoin', ETH: 'fab fa-ethereum' }
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}25` }}
    >
      {icons[symbol]
        ? <i className={`${icons[symbol]} text-xs`} style={{ color }} />
        : <span className="text-xs font-bold" style={{ color }}>{symbol[0]}</span>
      }
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Transaction['status'] }) {
  const map = {
    completed: { label: '✓ COMPLETED', bg: 'rgba(74,222,128,0.12)', color: '#4ade80', border: 'rgba(74,222,128,0.25)' },
    pending:   { label: 'PENDING',     bg: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: 'rgba(255,255,255,0.12)' },
    cancelled: { label: 'CANCELED',    bg: 'transparent',            color: '#f87171', border: 'transparent' },
  }
  const s = map[status]
  return (
    <span
      className="px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {s.label}
    </span>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) {
  return (
    <i
      className={`fas fa-sort${active ? (dir === 'asc' ? '-up' : '-down') : ''} text-xs ml-1`}
      style={{ color: active ? '#c9a84c' : '#4b5563' }}
    />
  )
}

type SortKey = 'txId' | 'date' | 'from' | 'to' | 'coin' | 'amount' | 'status'

// ─── Main component ───────────────────────────────────────────────────────────
export default function Transactions() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { transactions, loading } = useTransactions(user?.id)

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [sortOrder, setSortOrder] = useState<'Newest' | 'Oldest'>('Newest')

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function toggleRow(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        t.txId.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q) ||
        t.coin.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q),
    )
  }, [transactions, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'amount') cmp = a.amount - b.amount
      else if (sortKey === 'date') cmp = a.date.localeCompare(b.date)
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const cols: { key: SortKey; label: string; sortable?: boolean }[] = [
    { key: 'txId',   label: 'Transaction ID', sortable: true },
    { key: 'date',   label: 'Date',           sortable: true },
    { key: 'from',   label: 'Form',           sortable: true },
    { key: 'to',     label: 'To',             sortable: true },
    { key: 'coin',   label: 'Coin',           sortable: true },
    { key: 'amount', label: 'Amount',         sortable: true },
    { key: 'status', label: 'Status',         sortable: true },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0d0824' }}>
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#110b2d' }}>

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <i
                className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: '#4b5563' }}
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm text-gray-300 rounded-xl outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Get Report */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: 'rgba(162,133,57,0.15)', color: '#c9a84c', border: '1px solid rgba(162,133,57,0.3)' }}
              >
                <i className="fas fa-download text-xs" />
                Get Report
              </button>

              {/* Filter */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <i className="fas fa-sliders-h text-xs" />
                Filter
              </button>

              {/* Sort order */}
              <button
                onClick={() => setSortOrder((o) => (o === 'Newest' ? 'Oldest' : 'Newest'))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {sortOrder}
                <i className="fas fa-chevron-down text-xs" />
              </button>

              {/* More */}
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <i className="fas fa-ellipsis-v text-sm text-gray-400" />
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                {/* Head */}
                <thead>
                  <tr style={{ background: '#1a1040' }}>
                    {/* Checkbox col */}
                    <th className="w-10 px-4 py-3.5 text-left">
                      <div
                        className="w-4 h-4 rounded border flex items-center justify-center"
                        style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
                      >
                        <i className="fas fa-th text-xs" style={{ color: '#6b7280' }} />
                      </div>
                    </th>
                    {cols.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                        style={{ color: '#9ca3af' }}
                        onClick={() => col.sortable && toggleSort(col.key)}
                      >
                        {col.label}
                        {col.sortable && (
                          <SortIcon active={sortKey === col.key} dir={sortDir} />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        <i className="fas fa-spinner fa-spin mr-2" />
                        Loading transactions…
                      </td>
                    </tr>
                  ) : sorted.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    sorted.map((tx, i) => {
                      const isChecked = selected.has(tx.id)
                      return (
                        <tr
                          key={tx.id}
                          className="transition-colors hover:bg-white/[0.03] cursor-pointer"
                          style={{
                            background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                            borderTop: '1px solid rgba(255,255,255,0.04)',
                            borderLeft: isChecked ? '3px solid #4ade80' : '3px solid transparent',
                          }}
                          onClick={() => toggleRow(tx.id)}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-3.5">
                            <div
                              className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                              style={{
                                borderColor: isChecked ? '#4ade80' : 'rgba(255,255,255,0.2)',
                                background: isChecked ? '#4ade80' : 'rgba(255,255,255,0.05)',
                              }}
                            >
                              {isChecked && <i className="fas fa-check text-xs" style={{ color: '#0d0824', fontSize: '8px' }} />}
                            </div>
                          </td>

                          {/* TX ID */}
                          <td className="px-4 py-3.5 font-mono text-xs" style={{ color: '#9ca3af' }}>
                            {tx.txId}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <p className="text-xs font-medium text-white">{tx.date}</p>
                            <p className="text-xs text-gray-500">{tx.time}</p>
                          </td>

                          {/* From */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={tx.from} />
                              <span className="text-xs text-white whitespace-nowrap">{tx.from}</span>
                            </div>
                          </td>

                          {/* To */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={tx.to} />
                              <span className="text-xs text-white whitespace-nowrap">{tx.to}</span>
                            </div>
                          </td>

                          {/* Coin */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <CoinIcon symbol={tx.coinSymbol} color={tx.coinColor} />
                              <span className="text-xs font-medium text-white">{tx.coin}</span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3.5 text-xs font-semibold text-white whitespace-nowrap">
                            ${tx.amount.toFixed(2)}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={tx.status} />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#1a1040' }}
            >
              <p className="text-xs text-gray-500">
                Showing <span className="text-white font-medium">{sorted.length}</span> of{' '}
                <span className="text-white font-medium">{transactions.length}</span> transactions
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                    style={
                      p === 1
                        ? { background: 'rgba(74,222,128,0.15)', color: '#4ade80' }
                        : { color: '#6b7280', background: 'rgba(255,255,255,0.04)' }
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="w-7 h-7 rounded-lg text-xs text-gray-500 transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <i className="fas fa-chevron-right text-xs" />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
