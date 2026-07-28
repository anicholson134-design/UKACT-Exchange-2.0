'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play } from 'lucide-react'
import Link from 'next/link'

interface SectorHeroProps {
  name: string
  tagline: string
  subtitle: string
  heroPoster: string
  videoSrc?: string
  cta: { href: string; label: string }
}

export function SectorHero({ name, tagline, subtitle, heroPoster, videoSrc, cta }: SectorHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const words = name.split(' ')

  return (
    <section ref={ref} className="relative h-[100vh] min-h-[600px] overflow-hidden bg-forest">
      {/* Video / image background */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY, scale: bgScale }}>
        {videoSrc ? (
          <video
            autoPlay muted loop playsInline
            poster={heroPoster}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroPoster}')` }}
          />
        )}
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-forest/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/60 via-transparent to-transparent" />

      {/* Ambient light ray */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 origin-top opacity-15"
          style={{ width: 1, height: '100%', background: 'linear-gradient(to bottom, rgba(255,220,100,0.8), transparent 60%)', transform: 'rotate(-5deg) scaleX(70)' }} />
      </div>

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end container-keep pb-20 md:pb-28"
        style={{ y: textY, opacity }}
      >
        <motion.p
          className="eyebrow text-gold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          UKACT Sectors
        </motion.p>

        <h1
          className="text-cream font-display font-bold mb-5 leading-none"
          style={{ fontSize: 'clamp(3rem, 9vw, 8rem)', letterSpacing: '-0.03em' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.2em]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-xl font-display italic text-gold/90 mb-3 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          {tagline}
        </motion.p>

        <motion.p
          className="text-cream/65 text-lg max-w-lg leading-relaxed mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <Link
            href={cta.href}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30"
          >
            {cta.label}
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-cream font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            Browse placements
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-cream/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
