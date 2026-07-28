'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, Search, Handshake, TrendingUp, type LucideIcon } from 'lucide-react'
import { DEFAULT_HOWITWORKS_STEPS } from '@/lib/getSiteSettings'

const ICONS: LucideIcon[] = [UserPlus, Search, Handshake, TrendingUp]

interface StepItem { title: string; desc: string }

export function HowItWorksSection({
  eyebrow = 'The Process',
  heading = 'How KEEP Works',
  steps = DEFAULT_HOWITWORKS_STEPS,
}: {
  eyebrow?: string
  heading?: string
  steps?: StepItem[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding bg-mist" ref={ref}>
      <div className="container-keep">
        <div className="text-center mb-16">
          <motion.p className="eyebrow mb-4" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
            {eyebrow}
          </motion.p>
          <motion.h2 className="display-md text-forest" initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            {heading}
          </motion.h2>
        </div>

        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-stone to-transparent" />
          {steps.map((step, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-cream border border-stone/30 flex items-center justify-center shadow-sm">
                    <Icon className="h-7 w-7 text-moss" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-cream text-xs font-bold flex items-center justify-center font-display">{i + 1}</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-forest mb-3">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
