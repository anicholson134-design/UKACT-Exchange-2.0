'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

interface CaseStudyProps {
  label: string
  title: string
  body: string
  image: string
  stat: string
  statLabel: string
  quote: string
  quoteAuthor: string
}

export function SectorCaseStudy({ label, title, body, image, stat, statLabel, quote, quoteAuthor }: CaseStudyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  return (
    <section ref={ref} className="section-padding bg-forest overflow-hidden">
      <div className="container-keep">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow text-gold mb-3">{label}</p>
          <h2 className="display-md text-cream max-w-3xl mx-auto">{title}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Image — 3 cols */}
          <motion.div
            ref={imgRef}
            className="lg:col-span-3 rounded-2xl overflow-hidden aspect-[16/10] relative"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              style={{ scale: imgScale }}
            />
            {/* Stat overlay */}
            <div className="absolute bottom-5 left-5 glass rounded-xl px-5 py-4">
              <p className="font-display text-4xl font-bold text-gold leading-none">{stat}</p>
              <p className="text-cream/70 text-sm mt-1">{statLabel}</p>
            </div>
          </motion.div>

          {/* Text — 2 cols */}
          <div className="lg:col-span-2 space-y-7">
            <motion.p
              className="text-cream/65 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {body}
            </motion.p>

            {/* Pull quote */}
            <motion.div
              className="border-l-2 border-gold/50 pl-5"
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <p className="text-cream/80 italic font-display text-lg leading-relaxed mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                &quot;{quote}&quot;
              </p>
              <p className="text-sage/60 text-sm">— {quoteAuthor}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
