'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CTAProps {
  headline: string
  body: string
  href: string
  label: string
}

export function SectorCTA({ headline, body, href, label }: CTAProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1])

  return (
    <section ref={ref} className="section-padding relative overflow-hidden bg-forest">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=70')` }}
        />
      </motion.div>

      {/* Sunlight */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,210,80,0.15) 0%, transparent 70%)' }} />

      <div className="absolute inset-0 bg-gradient-to-b from-forest/50 to-forest/80" />

      <div className="relative z-10 container-keep text-center">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-gold mb-6">Get Involved</p>
          <h2 className="display-md text-cream mb-6 leading-tight">{headline}</h2>
          <p className="text-cream/65 text-lg leading-relaxed mb-10">{body}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={href}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-gold text-cream font-semibold rounded-xl text-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/30"
            >
              {label}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-4 text-cream/70 hover:text-gold font-medium transition-colors text-sm"
            >
              Have a question? Get in touch
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
            {[
              ['Free to join', 'No membership fee for keepers'],
              ['Fully vetted', 'All collections approved by KEEP'],
              ['Est. 2014', 'A decade of keeper development'],
            ].map(([title, desc]) => (
              <div key={title} className="text-center">
                <p className="text-cream font-semibold text-sm">{title}</p>
                <p className="text-cream/40 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
