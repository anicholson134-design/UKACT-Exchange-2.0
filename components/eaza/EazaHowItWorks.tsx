'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { UserPlus, Handshake, ArrowLeftRight, Home, HeartPulse, type LucideIcon } from 'lucide-react'

const STEPS: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: 'Apply', desc: "Submit your application and tell us about your experience and goals.", icon: UserPlus },
  { title: 'Matched', desc: 'Host collections will review applicants and pick a candidate to exchange with their collection.', icon: Handshake },
  { title: 'Exchange', desc: 'Spend time embedded in a new collection, learning hands-on.', icon: ArrowLeftRight },
  { title: 'Return Home', desc: "Bring new skills and perspective back to your home institution.", icon: Home },
  { title: 'Improve Welfare', desc: "Apply what you've learned to raise standards of animal care.", icon: HeartPulse },
]

export function EazaHowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding bg-mist" ref={ref}>
      <div className="container-keep">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-4">The Process</p>
          <h2 className="display-md text-forest">How It Works</h2>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-stone/30 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="relative mb-6 w-20 h-20 rounded-full bg-canopy flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.08, rotate: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <Icon className="h-7 w-7 text-cream" strokeWidth={1.5} />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-cream text-xs font-bold flex items-center justify-center font-display">
                      {i + 1}
                    </span>
                  </motion.div>
                  <h3 className="text-lg font-display font-semibold text-forest mb-2">{step.title}</h3>
                  <p className="text-sm text-ink/60 leading-relaxed max-w-[15rem]">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
