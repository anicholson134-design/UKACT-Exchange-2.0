'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroProps {
  eyebrow?: string
  headline?: string
  subtitle?: string
  bgImage?: string
}

export function HeroSection({
  eyebrow = "UK's First Zookeeper Exchange Programme",
  headline = 'Where Keepers Come to Grow.',
  subtitle = 'KEEP connects passionate keepers with world-class collections to develop skills, deepen expertise and strengthen conservation globally.',
  bgImage = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=1920&q=80',
}: HeroProps) {
  const words = headline.split(' ')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-forest">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={bgImage}
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* In production replace with real KEEP footage */}
      </video>

      {/* Fallback cinematic image while video loads */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-forest/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 container-keep w-full pb-16 md:pb-24">
        {/* Eyebrow */}
        <motion.p
          className="eyebrow text-gold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {eyebrow}
        </motion.p>

        {/* Headline — word by word */}
        <h1 className="display-xl text-cream max-w-3xl mb-6">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.5 + i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Sub-heading */}
        <motion.p
          className="text-cream/75 text-lg max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
        >
          {subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            Explore Placements
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/joining-keep"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-cream font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            Join KEEP
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-cream/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
