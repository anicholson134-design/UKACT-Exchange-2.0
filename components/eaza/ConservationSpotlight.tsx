'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PawPrint, Leaf, Bird, Sparkles } from 'lucide-react'

export function ConservationSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section className="section-padding relative overflow-hidden bg-ink" ref={ref}>
      {/* Wildlife-inspired background graphics */}
      <PawPrint className="absolute -top-6 left-[6%] h-40 w-40 text-cream/[0.04] rotate-[-12deg]" />
      <Leaf className="absolute bottom-10 right-[8%] h-56 w-56 text-cream/[0.05] rotate-[18deg]" />
      <Bird className="absolute top-1/3 right-[20%] h-24 w-24 text-cream/[0.04] rotate-[8deg]" />
      <PawPrint className="absolute bottom-0 left-[28%] h-24 w-24 text-cream/[0.03] rotate-[20deg]" />

      <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-transparent to-forest/40" />

      <div className="container-keep relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
            </motion.span>
            <span className="text-xs font-bold text-gold uppercase tracking-[0.14em]">New</span>
          </motion.div>

          <motion.h2
            className="display-lg text-cream mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            KEEP Conservation
          </motion.h2>

          <motion.p
            className="text-cream/70 text-lg leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            KEEP is expanding beyond zoos and aquariums by supporting in-situ conservation
            projects. Experienced keepers share practical husbandry, welfare and animal
            management expertise directly with conservation teams working with wild populations.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
