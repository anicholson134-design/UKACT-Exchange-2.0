'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { DEFAULT_TESTIMONIALS } from '@/lib/getSiteSettings'

interface TestimonialItem { quote: string; name: string; role: string; collection: string; avatar: string }

export function TestimonialsSection({
  eyebrow = 'Keeper Stories',
  heading = 'Voices from the Field',
  testimonials = DEFAULT_TESTIMONIALS,
}: {
  eyebrow?: string
  heading?: string
  testimonials?: TestimonialItem[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [current, setCurrent] = useState(0)

  const items = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS
  const prev = () => setCurrent(i => (i - 1 + items.length) % items.length)
  const next = () => setCurrent(i => (i + 1) % items.length)

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: 'var(--forest)' }} ref={ref}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=40')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-forest/80" />

      <div className="relative z-10 container-keep">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="eyebrow text-gold mb-4">{eyebrow}</p>
          <h2 className="display-md text-cream">{heading}</h2>
        </motion.div>

        <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="text-center">
              <Quote className="h-10 w-10 text-gold/40 mx-auto mb-8" />
              <p className="text-cream/90 text-xl md:text-2xl font-display italic leading-relaxed mb-10">
                &quot;{items[current]?.quote}&quot;
              </p>
              <div className="flex items-center justify-center gap-4">
                {items[current]?.avatar && (
                  <img src={items[current].avatar} alt={items[current].name} className="w-14 h-14 rounded-full object-cover border-2 border-gold/30" />
                )}
                <div className="text-left">
                  <p className="text-cream font-semibold">{items[current]?.name}</p>
                  <p className="text-sage text-sm">{items[current]?.role} · {items[current]?.collection}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button onClick={prev} className="w-11 h-11 rounded-full border border-white/20 text-cream/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`p-2 rounded-full transition-all duration-300`}>
                  <span className={`block rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6 h-2' : 'bg-white/30 w-2 h-2'}`} />
                </button>
              ))}
            </div>
            <button onClick={next} className="w-11 h-11 rounded-full border border-white/20 text-cream/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
