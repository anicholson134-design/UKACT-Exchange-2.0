'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { DEFAULT_HOME_PARTNERS } from '@/lib/getSiteSettings'

interface PartnerItem { name: string }

export function PartnersSection({
  eyebrow = 'Our Network',
  heading = 'Trusted by Leading Collections',
  partners = DEFAULT_HOME_PARTNERS,
}: {
  eyebrow?: string
  heading?: string
  partners?: PartnerItem[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const names = (partners.length > 0 ? partners : DEFAULT_HOME_PARTNERS).map(p => p.name)

  return (
    <section className="section-padding-sm bg-sand" ref={ref}>
      <div className="container-keep">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-2xl font-display font-semibold text-forest">{heading}</h2>
        </motion.div>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-12 whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
            {[...names, ...names].map((name, i) => (
              <span key={i} className="text-sm font-semibold text-ink/40 uppercase tracking-widest shrink-0 hover:text-moss transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
