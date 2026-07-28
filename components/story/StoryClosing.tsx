'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const lines = [
  'Every exchange creates knowledge.',
  'Every conversation raises standards.',
  'Every partnership improves animal welfare.',
  'Our story is still being written.',
]

export function StoryClosing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1])
  const lightOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.6, 0.9])

  return (
    <section ref={ref} className="relative bg-forest overflow-hidden">
      {/* Jungle clearing background */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=2000&q=90')` }}
        />
      </motion.div>

      {/* Sunlight breaking through */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: lightOpacity,
          background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(255,220,100,0.25) 0%, transparent 70%)',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/60 to-forest/90" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">

        {/* Light rays from above */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-64 opacity-20"
          style={{ background: 'linear-gradient(to bottom, rgba(255,220,100,0.8), transparent)', transform: 'translateX(-50%) scaleX(80)', transformOrigin: 'top' }}
        />

        <motion.p
          className="eyebrow text-gold mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          The Story Continues
        </motion.p>

        {/* The four lines */}
        <div className="space-y-4 mb-16 max-w-2xl">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              className={`font-display text-cream leading-tight ${i === lines.length - 1 ? 'text-gold' : 'text-cream/90'}`}
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {i === lines.length - 1 ? <em>{line}</em> : line}
            </motion.p>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/joining-ukact"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-cream font-semibold rounded-xl text-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/30"
          >
            Become Part of the Story
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
        </motion.div>

        {/* Secondary actions */}
        <motion.div
          className="flex items-center gap-8 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1 }}
        >
          <Link href="/listings" className="text-cream/50 hover:text-gold text-sm font-medium transition-colors">
            Browse Placements
          </Link>
          <span className="w-px h-4 bg-white/20" />
          <Link href="/about/sponsors" className="text-cream/50 hover:text-gold text-sm font-medium transition-colors">
            Support UKACT
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
