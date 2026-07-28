'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const notes = [
  { text: 'Facebook group, 2019', rotate: -2, x: -8 },
  { text: '1st CPD conference ✓', rotate: 1.5, x: 12 },
  { text: 'Halesowen College →', rotate: -1, x: -4 },
]

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StoryBeginning() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="relative bg-[#F5F0E0] overflow-hidden py-32 md:py-48">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
      }} />

      <div className="container-keep relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <FadeUp className="mb-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-gold/60" />
              <span className="eyebrow">Chapter One</span>
            </div>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — journal text */}
            <div className="space-y-8">
              <FadeUp>
                <h2 className="font-display text-forest leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  The Beginning
                </h2>
              </FadeUp>

              <FadeUp delay={0.1}>
                <p className="text-ink/70 text-lg leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  It started with a simple question asked in a Facebook group in 2019: <em>&quot;What if animal care staff could learn from each other?&quot;</em>
                </p>
              </FadeUp>

              <FadeUp delay={0.15}>
                <p className="text-ink/60 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  The idea was straightforward but powerful — instead of working in isolation, why not let staff across colleges and farm schools share knowledge directly with the people caring for different species every day.
                </p>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="text-ink/60 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  UKACT — UK Animal Care Technicians — grew from that group into the UK&apos;s professional membership association for animal care education. A community that said: <em>we believe in learning from each other.</em>
                </p>
              </FadeUp>

              {/* Handwritten notes */}
              <FadeUp delay={0.3}>
                <div className="flex flex-wrap gap-3 mt-8">
                  {notes.map((n, i) => (
                    <motion.div
                      key={i}
                      className="bg-yellow-100/80 px-4 py-2 shadow-md text-sm text-ink/70"
                      style={{
                        rotate: n.rotate,
                        fontFamily: 'Georgia, serif',
                        fontStyle: 'italic',
                        transform: `rotate(${n.rotate}deg) translateX(${n.x}px)`,
                      }}
                      whileHover={{ scale: 1.05, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {n.text}
                    </motion.div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Right — journal imagery */}
            <div className="relative h-[500px]">
              {/* Main image — tilted */}
              <FadeUp delay={0.2} className="absolute top-0 right-4 w-72">
                <motion.div
                  className="shadow-2xl overflow-hidden"
                  style={{ transform: 'rotate(2deg)' }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white p-3 pb-10">
                    <img
                      src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=85"
                      alt="Animal care technician at work"
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <p className="text-center text-xs text-ink/40 mt-3 italic" style={{ fontFamily: 'Georgia, serif' }}>
                      The first conversations — 2019
                    </p>
                  </div>
                </motion.div>
              </FadeUp>

              {/* Second image — overlapping */}
              <FadeUp delay={0.35} className="absolute bottom-0 left-0 w-56">
                <motion.div
                  className="shadow-xl overflow-hidden"
                  style={{ transform: 'rotate(-3deg)' }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white p-2.5 pb-8">
                    <img
                      src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=80"
                      alt="Wildlife"
                      className="w-full aspect-square object-cover"
                    />
                    <p className="text-center text-xs text-ink/40 mt-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
                      The mission begins
                    </p>
                  </div>
                </motion.div>
              </FadeUp>

              {/* Passport stamp */}
              <FadeUp delay={0.4} className="absolute top-48 left-16">
                <div
                  className="w-24 h-24 rounded-full border-4 border-red-800/40 flex items-center justify-center text-center opacity-60"
                  style={{ transform: 'rotate(-15deg)' }}
                >
                  <div>
                    <p className="text-red-800/70 text-xs font-bold uppercase tracking-wider">UKACT</p>
                    <p className="text-red-800/50 text-[8px] uppercase tracking-widest">Est. 2019</p>
                    <p className="text-red-800/50 text-[8px] uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>

          {/* Timeline entry */}
          <FadeUp delay={0.3} className="mt-24 border-t border-stone/30 pt-12">
            <div className="flex items-center gap-6">
              <div className="text-5xl font-display font-bold text-gold/30">2019</div>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
              <p className="text-ink/50 text-sm italic max-w-sm text-right" style={{ fontFamily: 'Georgia, serif' }}>
                &quot;A small idea with an enormous purpose.&quot;
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
