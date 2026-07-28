'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=500&q=80',
    caption: 'Chester Zoo — 2015',
    rotate: -4, x: -5, y: 0, z: 1, size: 'w-52',
  },
  {
    src: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&q=80',
    caption: 'Edinburgh — 2016',
    rotate: 3, x: 30, y: 40, z: 3, size: 'w-44',
  },
  {
    src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&q=80',
    caption: 'Longleat — 2017',
    rotate: -2, x: -20, y: 80, z: 2, size: 'w-60',
  },
  {
    src: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=500&q=80',
    caption: 'Chester Zoo — 2018',
    rotate: 5, x: 15, y: 20, z: 4, size: 'w-48',
  },
  {
    src: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=500&q=80',
    caption: 'Bristol Zoo — 2019',
    rotate: -3, x: -30, y: 60, z: 2, size: 'w-56',
  },
  {
    src: 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=500&q=80',
    caption: 'Paignton — 2020',
    rotate: 2, x: 20, y: 90, z: 5, size: 'w-40',
  },
]

function Photo({ photo, index }: { photo: typeof photos[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <motion.div
      ref={ref}
      className={`absolute ${photo.size} cursor-pointer`}
      style={{
        left: `${10 + (index % 3) * 28}%`,
        top: `${(Math.floor(index / 3)) * 45}%`,
        zIndex: photo.z,
      }}
      initial={{ opacity: 0, y: 60, rotate: photo.rotate + (index % 2 === 0 ? -8 : 8) }}
      animate={inView ? { opacity: 1, y: photo.y, rotate: photo.rotate } : {}}
      transition={{ duration: 1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, zIndex: 20, rotate: 0, transition: { duration: 0.3 } }}
    >
      {/* Photo card */}
      <div className="bg-white shadow-xl" style={{ padding: '10px 10px 40px 10px' }}>
        <img src={photo.src} alt={photo.caption} className="w-full aspect-[4/3] object-cover" style={{ filter: 'saturate(0.85) brightness(0.95)' }} />
        <p className="text-center text-xs text-ink/50 mt-2 italic" style={{ fontFamily: 'Georgia, serif' }}>
          {photo.caption}
        </p>
      </div>

      {/* Random tape/pin */}
      {index % 3 === 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-yellow-200/70 opacity-70 rotate-1" />
      )}
      {index % 3 === 1 && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-800/60" />
      )}
      {index % 3 === 2 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-blue-200/60 opacity-60 -rotate-2" />
      )}
    </motion.div>
  )
}

export function StoryExchanges() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#EDE8DC] py-32 md:py-48">
      <motion.div className="absolute inset-0 opacity-20" style={{ y: bgY,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
      }} />

      <div className="container-keep relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <motion.div
            className="mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow mb-4">Chapter Two</p>
            <h2 className="font-display text-forest" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Growing Through Exchanges
            </h2>
            <p className="text-ink/60 max-w-xl mx-auto mt-4 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              Each exchange left its mark. Keepers returned home transformed — carrying new techniques, new friendships and a deeper understanding of what conservation really means.
            </p>
          </motion.div>

          {/* Photo collage */}
          <div className="relative h-[700px] md:h-[800px]">
            {photos.map((photo, i) => (
              <Photo key={i} photo={photo} index={i} />
            ))}
          </div>

          {/* Stat row */}
          <motion.div
            className="mt-20 grid grid-cols-3 gap-8 border-t border-stone/30 pt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { n: '1,200+', label: 'Keepers placed' },
              { n: '80+', label: 'Partner collections' },
              { n: '10 yrs', label: 'Of growing together' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl font-bold text-gold/80 mb-2">{s.n}</p>
                <p className="text-ink/50 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
