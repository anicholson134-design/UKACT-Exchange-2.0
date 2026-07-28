'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, UserRound, Building2 } from 'lucide-react'

const KEEPER_BENEFITS = [
  'Browse opportunities',
  'Upload CV once',
  'Track applications',
  'Gain CPD',
  "Learn from Europe's leading collections",
]

const HOST_BENEFITS = [
  'Post placements',
  'Manage applications',
  'Reach verified keepers',
  'Share expertise',
  'Build international partnerships',
]

export function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-keep">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-4">Benefits</p>
          <h2 className="display-md text-forest">Built for Keepers and Collections</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { heading: 'For Keepers', icon: UserRound, items: KEEPER_BENEFITS, accent: 'canopy' },
            { heading: 'For Host Zoos', icon: Building2, items: HOST_BENEFITS, accent: 'forest' },
          ].map((card, i) => (
            <motion.div
              key={card.heading}
              className="relative rounded-3xl p-8 md:p-10 bg-forest overflow-hidden"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-6">
                  <card.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                </div>
                <p className="eyebrow text-gold mb-2">{card.heading === 'For Keepers' ? 'Keepers' : 'Host Zoos'}</p>
                <h3 className="text-2xl md:text-3xl font-display font-semibold text-cream mb-6">
                  {card.heading}
                </h3>
                <ul className="space-y-3.5">
                  {card.items.map(item => (
                    <li key={item} className="flex items-center gap-3 text-cream/80">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-gold" />
                      </span>
                      <span className="text-[0.95rem]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
