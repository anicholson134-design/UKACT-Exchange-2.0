'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

const HEADLINE = "Connecting Europe's Zookeepers"

const FLOATING_LINES = [
  { x1: 10, y1: 20, x2: 32, y2: 42, dur: 9, del: 0 },
  { x1: 70, y1: 15, x2: 48, y2: 38, dur: 11, del: 1.5 },
  { x1: 20, y1: 75, x2: 45, y2: 55, dur: 10, del: 0.7 },
  { x1: 85, y1: 65, x2: 60, y2: 45, dur: 8, del: 2.2 },
  { x1: 55, y1: 85, x2: 42, y2: 60, dur: 12, del: 1 },
]

const NODES = [
  { x: 10, y: 20 }, { x: 32, y: 42 }, { x: 70, y: 15 }, { x: 48, y: 38 },
  { x: 20, y: 75 }, { x: 45, y: 55 }, { x: 85, y: 65 }, { x: 60, y: 45 }, { x: 55, y: 85 },
]

export function EazaHero() {
  const reduceMotion = useReducedMotion()
  const words = HEADLINE.split(' ')

  return (
    <section className="relative h-screen min-h-[680px] flex flex-col overflow-hidden bg-forest">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(74,103,65,0.55) 0%, transparent 70%)' }}
          animate={reduceMotion ? {} : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -right-1/4 w-[60%] h-[60%] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(184,147,90,0.35) 0%, transparent 70%)' }}
          animate={reduceMotion ? {} : { x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[50%] h-[50%] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(143,175,126,0.3) 0%, transparent 70%)' }}
          animate={reduceMotion ? {} : { x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating abstract connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
        {FLOATING_LINES.map((l, i) => (
          <motion.line
            key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#D4A96A"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0.6] }}
            transition={{ duration: 2, delay: 0.8 + i * 0.2, ease: 'easeOut' }}
          />
        ))}
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x} cy={n.y} r="0.5"
            fill="#D4A96A"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: reduceMotion ? 1 : [1, 1.6, 1] }}
            transition={{ duration: 3, delay: 1 + i * 0.15, repeat: reduceMotion ? 0 : Infinity, repeatDelay: 2 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-transparent to-forest" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 py-8">
        <div className="container-keep flex flex-col items-center text-center">
        <motion.p
          className="eyebrow text-gold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          EAZA Conference 2026
        </motion.p>

        <h1 className="display-xl text-cream max-w-4xl mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-cream/75 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          Sharing professional knowledge, improving animal welfare and strengthening conservation
          through international keeper exchanges.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          <Link
            href="https://www.keeperexchange.org/joining-keep/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-cream font-medium rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25"
          >
            Apply for an Exchange
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="https://www.keeperexchange.org/joining-keep/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-cream font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            Become a Host Zoo
          </Link>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-sage/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          {['Founded in 2020', '120+ Keeper Placements', 'Expanding Across Europe'].map((stat, i) => (
            <motion.span
              key={stat}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 + i * 0.15 }}
            >
              {i > 0 && <span className="w-1 h-1 rounded-full bg-gold/60" />}
              <span className="font-medium text-cream/90">{stat}</span>
            </motion.span>
          ))}
        </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="relative z-10 shrink-0 pb-6 flex flex-col items-center gap-1 text-cream/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={reduceMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
