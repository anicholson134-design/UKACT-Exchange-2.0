'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURES = [
  {
    emoji: '🦁',
    title: 'Exchange Knowledge',
    desc: 'Professional keeper placements.',
  },
  {
    emoji: '🌍',
    title: 'Improve Conservation',
    desc: 'Sharing husbandry and welfare expertise.',
  },
  {
    emoji: '🤝',
    title: 'Build Networks',
    desc: 'Connecting accredited collections across Europe.',
  },
]

export function WhatIsKeep() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-keep">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — statement */}
          <div className="lg:col-span-6">
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              What is KEEP
            </motion.p>
            <motion.h2
              className="display-lg text-forest leading-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              A volunteer-led,{' '}
              <em className="text-gradient not-italic">not-for-profit</em> organisation.
            </motion.h2>
            <motion.p
              className="mt-8 text-lg text-ink/70 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              KEEP connects professional zookeepers with accredited zoological collections for
              short-term placements across Europe.
            </motion.p>
          </div>

          {/* Right — feature cards */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative glass-light rounded-2xl p-6 md:p-7 flex items-start gap-5 cursor-default overflow-hidden"
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-transparent transition-all duration-500" />
                <div className="relative shrink-0 w-14 h-14 rounded-xl bg-forest flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {f.emoji}
                </div>
                <div className="relative">
                  <h3 className="text-lg font-display font-semibold text-forest mb-1">{f.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
