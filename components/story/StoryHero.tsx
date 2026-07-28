'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function StoryHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0.85])

  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    const chars = titleRef.current.querySelectorAll('.char')
    gsap.fromTo(chars,
      { opacity: 0, y: 60, rotateX: -40 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: 'power3.out',
        delay: 0.4,
      }
    )
  }, [])

  return (
    <section ref={containerRef} className="relative h-[160vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background jungle */}
        <motion.div
          ref={bgRef}
          className="absolute inset-0"
          style={{ y: bgY, scale: bgScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=2000&q=90')` }}
          />
        </motion.div>

        {/* Light rays */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-px h-full opacity-20"
            style={{ background: 'linear-gradient(to bottom, rgba(255,220,120,0.8), transparent 70%)', transform: 'rotate(-8deg) scaleX(60)', transformOrigin: 'top' }}
          />
          <div
            className="absolute top-0 left-1/2 w-px h-full opacity-15"
            style={{ background: 'linear-gradient(to bottom, rgba(255,220,120,0.6), transparent 60%)', transform: 'rotate(4deg) scaleX(40)', transformOrigin: 'top' }}
          />
          <div
            className="absolute top-0 right-1/3 w-px h-full opacity-10"
            style={{ background: 'linear-gradient(to bottom, rgba(255,220,120,0.5), transparent 50%)', transform: 'rotate(-3deg) scaleX(30)', transformOrigin: 'top' }}
          />
        </div>

        {/* Floating particles — fixed positions to avoid hydration mismatch */}
        {[
          { w: 4, h: 4, l: 15, t: 20, dur: 5, del: 0 },
          { w: 6, h: 6, l: 35, t: 60, dur: 7, del: 1 },
          { w: 3, h: 3, l: 55, t: 30, dur: 4.5, del: 2 },
          { w: 5, h: 5, l: 70, t: 75, dur: 6, del: 0.5 },
          { w: 4, h: 4, l: 80, t: 45, dur: 5.5, del: 1.5 },
          { w: 7, h: 7, l: 25, t: 80, dur: 8, del: 3 },
          { w: 3, h: 3, l: 90, t: 15, dur: 4, del: 2.5 },
          { w: 5, h: 5, l: 10, t: 55, dur: 6.5, del: 0.8 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold/30 pointer-events-none"
            style={{ width: p.w, height: p.h, left: `${p.l}%`, top: `${p.t}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
          />
        ))}

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayOpacity,
            background: 'linear-gradient(to bottom, rgba(28,43,30,0.5) 0%, rgba(28,43,30,0.85) 100%)',
          }}
        />

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ y: textY, opacity }}
        >
          <motion.p
            className="eyebrow text-gold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Keeper Exchange and Education Programme
          </motion.p>

          <h1
            ref={titleRef}
            className="text-cream mb-6 overflow-hidden"
            style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontFamily: 'var(--font-playfair)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', perspective: '600px' }}
          >
            {'Our Story'.split('').map((char, i) => (
              <span key={i} className="char inline-block" style={{ opacity: 0 }}>
                {char === ' ' ? ' ' : char}
              </span>
            ))}
          </h1>

          <motion.p
            className="text-cream/70 text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            A journey through wildlife conservation, education and global partnerships
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <span className="text-cream/40 text-xs tracking-[0.2em] uppercase">Scroll to begin</span>
            <motion.div
              className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: 'top' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
