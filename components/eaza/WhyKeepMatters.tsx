'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const steps = 50
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span>{count}{suffix}</span>
}

const STATS = [
  { kind: 'count' as const, value: 120, suffix: '+', label: 'Successful Exchanges' },
  { kind: 'count' as const, value: 100, suffix: '%', label: 'Volunteer Led' },
  { kind: 'count' as const, value: 2020, suffix: '', label: 'Founded' },
  { kind: 'text' as const, value: 'Growing', suffix: '', label: 'Across Europe' },
]

export function WhyKeepMatters() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding-sm bg-forest relative overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <div className="container-keep relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow text-gold mb-4">Why KEEP Matters</p>
          <h2 className="display-md text-cream">Impact you can measure</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-2xl px-6 py-10 flex flex-col items-center text-center cursor-default"
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, borderColor: 'rgba(184,147,90,0.4)' }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-gold mb-3">
                {stat.kind === 'count'
                  ? <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
                  : stat.value}
              </div>
              <p className="text-cream/80 font-medium text-sm md:text-base tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
