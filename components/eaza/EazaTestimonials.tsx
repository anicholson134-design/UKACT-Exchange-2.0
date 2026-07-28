'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "I had a brilliant time at Noah's Ark, they are a great and friendly team that really put me at ease. They were all really knowledgeable and happy to share this with me. I think KEEP is a brilliant idea and practical learning is so important with animal care! Sharing knowledge is so important across the zoo world. Overall it was a brilliant experience and I will be recommending KEEP to everyone!",
    name: 'Holly',
    role: 'Keeper',
    collection: 'Becky Falls Woodland Park',
    avatar: '/Holly-Noahs-Ark-Zoo-Farm.webp',
  },
  {
    quote: 'It was a wonderful week in which I was able to work with many groups of different primate species.',
    name: 'Joanna',
    role: 'Keeper',
    collection: 'Bioparco di Roma',
    avatar: '/Arianna-Chester-Zoo.webp',
  },
  {
    quote: 'We look forward to welcoming more keepers as part of this fantastic initiative in the future and thank the KEEP team for making this project so beneficial to zookeepers.',
    name: "Battersea Park Children's Zoo",
    role: 'Collection',
    collection: "KEEP",
    avatar: '/Battersea-Park-Childrens-Zoo.webp',
  },
  
]

export function EazaTestimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCurrent(i => (i + 1) % TESTIMONIALS.length)

  return (
    <section className="section-padding relative overflow-hidden bg-forest" ref={ref}>
      <div className="container-keep relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow text-gold mb-4">Keeper Stories</p>
          <h2 className="display-md text-cream">Voices from the Network</h2>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-center"
            >
              <Quote className="h-10 w-10 text-gold/40 mx-auto mb-8" />
              <p className="text-cream/90 text-xl md:text-2xl font-display italic leading-relaxed mb-10">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={TESTIMONIALS[current].avatar}
                  alt={TESTIMONIALS[current].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold/30"
                />
                <div className="text-left">
                  <p className="text-cream font-semibold">{TESTIMONIALS[current].name}</p>
                  <p className="text-sage text-sm">
                    {TESTIMONIALS[current].role} · {TESTIMONIALS[current].collection}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-white/20 text-cream/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-gold w-6' : 'bg-white/30 w-2'}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-white/20 text-cream/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
