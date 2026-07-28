'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import { DEFAULT_STATS } from '@/lib/getSiteSettings'

interface StatItem { value: number; suffix: string; label: string; desc: string }

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span>{count.toLocaleString()}{suffix}</span>
}

export function StatsSection({ stats = DEFAULT_STATS }: { stats?: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding-sm bg-forest" ref={ref}>
      <div className="container-keep">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-forest px-4 md:px-8 py-10 flex flex-col items-center text-center" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="font-display text-4xl md:text-5xl font-bold text-gold mb-2">
                <CountUp target={Number(stat.value)} suffix={stat.suffix} inView={inView} />
              </div>
              <p className="text-cream font-semibold text-lg mb-1">{stat.label}</p>
              <p className="text-sage/70 text-sm">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
