'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type MissionSectionProps = {
  quote?: string
  body1?: string
  body2?: string
  image?: string
  statNumber?: string
  statLabel?: string
}

export function MissionSection({
  quote,
  body1,
  body2,
  image,
  statNumber,
  statLabel,
}: MissionSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  const missionQuote = quote || 'UKACT exists to connect staff across animal care education — sharing knowledge to raise welfare standards, one institution at a time.'
  const missionBody1 = body1 || "What began as a Facebook group in 2019 has grown into the UK's leading network for animal care technicians — connecting staff across animal management colleges and farm schools who care for animal collections in education settings."
  const missionBody2 = body2 || 'The result is a stronger, better-connected sector — and students and animals who benefit from staff who are constantly learning.'
  const missionImage = image || '/alicephoto-768x1032.jpg'
  const missionStatNumber = statNumber || '6+'
  const missionStatLabel = statLabel || 'Years connecting animal care staff'

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-keep">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Large editorial quote — 7 cols */}
          <div className="lg:col-span-7">
            <motion.p
              className="eyebrow mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Our Mission
            </motion.p>
            <motion.h2
              className="display-lg text-forest leading-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              "{missionQuote}"
            </motion.h2>

            <motion.p
              className="mt-8 text-lg text-ink/70 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {missionBody1}
            </motion.p>

            <motion.p
              className="mt-4 text-lg text-ink/70 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {missionBody2}
            </motion.p>
          </div>

          {/* Image + accent — 5 cols */}
          <div className="lg:col-span-5">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={missionImage}
                  alt="Animal care technician working with animals"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating accent card */}
              <motion.div
                className="absolute bottom-0 left-0 lg:-bottom-6 lg:-left-6 glass-light rounded-xl p-5 shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <p className="text-3xl font-display font-bold text-forest">{missionStatNumber}</p>
                <p className="text-sm text-ink/60 mt-0.5">{missionStatLabel}</p>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
