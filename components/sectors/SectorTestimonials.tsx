'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  quote: string
  name: string
  role: string
  image: string
}

export function SectorTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const prev = () => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(i => (i + 1) % testimonials.length)
  const t = testimonials[current]

  return (
    <section ref={ref} className="section-padding bg-cream overflow-hidden">
      <div className="container-keep">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-3">Voices from the Field</p>
          <h2 className="display-md text-forest">What our members say</h2>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl">

            {/* Photo side */}
            <div className="relative h-72 md:h-auto overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={t.image}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/60 to-transparent md:bg-gradient-to-r" />
            </div>

            {/* Quote side */}
            <div className="bg-forest px-8 md:px-12 py-12 flex flex-col justify-between">
              <Quote className="h-10 w-10 text-gold/30 mb-6" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45 }}
                  className="flex-1"
                >
                  <p className="text-cream/90 font-display italic text-xl md:text-2xl leading-relaxed mb-8">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-cream font-semibold">{t.name}</p>
                      <p className="text-sage/60 text-sm">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-10">
                <button onClick={prev} className="w-11 h-11 rounded-full border border-white/20 text-cream/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="p-2"
                    >
                      <span className={`block rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6 h-2' : 'bg-white/20 w-2 h-2'}`} />
                    </button>
                  ))}
                </div>
                <button onClick={next} className="w-11 h-11 rounded-full border border-white/20 text-cream/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
