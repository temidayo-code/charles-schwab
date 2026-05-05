import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import SectionBackground from '../ui/SectionBackground'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
})

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } },
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroStats = [
  { value: '500K+', label: 'Active Traders' },
  { value: '$2B+',  label: 'Daily Volume' },
  { value: '0.0',   label: 'Pips Spread' },
  { value: '24/7',  label: 'Support' },
]

const trustItems = [
  { icon: 'fas fa-shield-alt', text: 'Regulated & Licensed' },
  { icon: 'fas fa-lock',       text: 'Funds Protected up to $1,000,000' },
  { icon: 'fas fa-bolt',       text: '211ms Execution' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroBadge() {
  return (
    <div
      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border"
      style={{
        background: 'rgba(162,133,57,0.15)',
        borderColor: 'rgba(162,133,57,0.4)',
        color: '#a28539',
      }}
    >
      <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: '#a28539' }} />
      Trusted CFD Trading Platform Since 2017
    </div>
  )
}

function HeroHeadline() {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
      <span className="block">Trade Smarter with</span>
      <span
        className="block mt-2"
        style={{
          background: 'linear-gradient(90deg, #a28539, #d4af6a, #2b1978)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Charles Schwab
      </span>
    </h1>
  )
}

function HeroStatsRow() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-8 py-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {heroStats.map((stat, i) => (
        <motion.div key={stat.label} className="flex items-center gap-8" variants={fadeUp(0.4 + i * 0.1)}>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#a28539' }}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
          {i < heroStats.length - 1 && (
            <div className="w-px h-12" style={{ backgroundColor: 'rgba(162,133,57,0.3)' }} />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

function TrustBar() {
  return (
    <p className="text-sm text-gray-500 mt-2">
      {trustItems.map((item, i) => (
        <span key={item.text}>
          <Icon name={`${item.icon} mr-1`} style={{ color: '#a28539' }} />
          {item.text}
          {i < trustItems.length - 1 && <span> &nbsp;·&nbsp; </span>}
        </span>
      ))}
    </p>
  )
}

// ─── HeroSection ──────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <SectionBackground withOrbs>
      <div className="relative z-10 px-4 py-24 mx-auto max-w-4xl sm:px-6 lg:px-8 text-center space-y-8">
        <motion.div {...fadeUp(0)}>
          <HeroBadge />
        </motion.div>

        <motion.div {...fadeUp(0.15)}>
          <HeroHeadline />
        </motion.div>

        <motion.p
          className="max-w-2xl mx-auto text-xl text-gray-300 leading-relaxed"
          {...fadeUp(0.25)}
        >
          Access global markets — Stocks, Forex, Gold, Oil, Indices and Crypto — with ultra-fast
          execution, tight spreads, and institutional-grade security.
        </motion.p>

        <HeroStatsRow />

        <motion.div className="flex flex-wrap justify-center gap-4 mt-4" {...fadeUp(0.55)}>
          <Button variant="ghost-gold" to="/register" className="text-lg">
            Start Trading Now <Icon name="fas fa-arrow-right ml-2" />
          </Button>
        </motion.div>

        <motion.div {...fadeUp(0.65)}>
          <TrustBar />
        </motion.div>
      </div>
    </SectionBackground>
  )
}
