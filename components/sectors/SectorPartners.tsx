'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Partner { name: string }

export function SectorPartners({ partners }: { partners: Partner[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const doubled = [...partners, ...partners]

  return (
    <section ref={ref} className="section-padding-sm bg-sand overflow-hidden">
      <div className="container-keep mb-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-3">Our Partners</p>
          <h2 className="text-2xl font-display font-semibold text-forest">
            Trusted by leading organisations
          </h2>
        </motion.div>
      </div>

      {/* Marquee carousel */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-sand to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-sand to-transparent pointer-events-none" />

        <div
          className="flex gap-10 whitespace-nowrap py-4"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {doubled.map((p, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center h-16 px-8 bg-white rounded-xl border border-stone/20 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 shrink-0 group cursor-default"
            >
              <span className="text-sm font-semibold text-ink/50 group-hover:text-forest transition-colors whitespace-nowrap">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        {/* Second row — opposite direction */}
        <div
          className="flex gap-10 whitespace-nowrap py-4"
          style={{ animation: 'marquee 35s linear infinite reverse' }}
        >
          {[...doubled].reverse().map((p, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center h-16 px-8 bg-white rounded-xl border border-stone/20 shadow-sm shrink-0 hover:border-gold/30 transition-all duration-300 cursor-default group"
            >
              <span className="text-sm font-semibold text-ink/50 group-hover:text-forest transition-colors whitespace-nowrap">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
