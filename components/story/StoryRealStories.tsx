'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const stories = [
  {
    image: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1400&q=90',
    quote: 'A few weeks of shared practice. That is all it took to completely change how I approach animal care.',
    name: 'Sarah Mitchell',
    role: 'Animal Unit Manager · Further Education College',
    side: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1400&q=90',
    quote: 'UKACT gave me access to knowledge I could never have learned from a textbook.',
    name: 'James Hartley',
    role: 'Head of Animal Care · Agricultural College',
    side: 'right',
  },
  {
    image: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=1400&q=90',
    quote: 'The connections I built through UKACT have shaped my entire career in animal care.',
    name: 'Emma Clarke',
    role: 'Animal Care Technician',
    side: 'left',
  },
]

function StoryCard({ story, index }: { story: typeof stories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1])
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden flex items-center">
      {/* Full bleed image with parallax */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <img src={story.image} alt="" className="w-full h-full object-cover" />
      </motion.div>

      {/* Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-${story.side === 'left' ? 'r' : 'l'} from-forest/90 via-forest/60 to-transparent`} />

      {/* Text */}
      <motion.div
        className={`relative z-10 container-keep w-full ${story.side === 'right' ? 'flex justify-end' : ''}`}
        style={{ y: textY, opacity }}
      >
        <div className="max-w-lg">
          <div className="text-gold/60 mb-6" style={{ fontSize: '6rem', fontFamily: 'Georgia', lineHeight: 0.5 }}>"</div>
          <blockquote
            className="text-cream font-display italic leading-snug mb-8"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            {story.quote}
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-gold/50" />
            <div>
              <p className="text-cream font-semibold text-sm">{story.name}</p>
              <p className="text-sage/70 text-xs">{story.role}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function StoryRealStories() {
  return (
    <section className="relative">
      <div className="bg-forest py-20 text-center">
        <motion.p
          className="eyebrow text-gold mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Chapter Four
        </motion.p>
        <motion.h2
          className="font-display text-cream"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Real Stories
        </motion.h2>
      </div>

      {stories.map((story, i) => (
        <StoryCard key={i} story={story} index={i} />
      ))}
    </section>
  )
}
