'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface MissionProps {
  headline: string
  body: string
  image: string
}

export function SectorMission({ headline, body, image }: MissionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={ref} className="section-padding bg-mist overflow-hidden">
      <div className="container-keep">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-center">

          {/* Image with parallax */}
          <motion.div
            ref={imgRef}
            className="relative rounded-2xl overflow-hidden aspect-[4/5] order-2 lg:order-1"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={image}
              alt=""
              className="w-full h-[115%] object-cover object-center absolute inset-0"
              style={{ y: imgY }}
            />
            {/* Accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-transparent" />
          </motion.div>

          {/* Text */}
          <div className="order-1 lg:order-2 space-y-7">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              Our Mission
            </motion.p>

            <motion.h2
              className="display-md text-forest leading-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {headline}
            </motion.h2>

            <motion.p
              className="text-ink/65 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {body}
            </motion.p>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <div className="h-px w-12 bg-gold/50" />
              <span className="text-sm text-ink/40 italic" style={{ fontFamily: 'Georgia, serif' }}>
                Est. 2014 · Cambridge, UK
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
