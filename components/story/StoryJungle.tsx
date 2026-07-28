'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const wildlife = [
  {
    name: 'Jaguar',
    species: 'Panthera onca',
    status: 'Near Threatened',
    location: 'Central & South America',
    contribution: 'KEEP supported keeper training for jaguar enrichment programmes at three partner collections.',
    image: 'https://images.unsplash.com/photo-1554456854-55a089fd4cb2?w=600&q=85',
  },
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    status: 'Vulnerable',
    location: 'Sub-Saharan Africa',
    contribution: 'Exchange keepers trained in advanced elephant behaviour and social herd management.',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=85',
  },
  {
    name: 'Macaw',
    species: 'Ara macao',
    status: 'Least Concern',
    location: 'Central & South America',
    contribution: 'Avian husbandry exchanges improved breeding success rates by 40% across partner collections.',
    image: 'https://images.unsplash.com/photo-1503656142023-618e7d1f435a?w=600&q=85',
  },
]

const statusColour: Record<string, string> = {
  'Near Threatened': 'text-yellow-400',
  'Vulnerable': 'text-orange-400',
  'Least Concern': 'text-green-400',
  'Endangered': 'text-red-400',
}

export function StoryJungle() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  // Parallax layers
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  return (
    <section ref={sectionRef} className="relative bg-forest overflow-hidden">

      {/* ── Entrance transition ── */}
      <div className="relative h-[60vh] overflow-hidden flex items-end">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80')` }}
          />
          <div className="absolute inset-0 bg-forest/60" />
        </motion.div>

        <div className="relative z-10 container-keep pb-16 text-center w-full">
          <motion.p
            className="eyebrow text-gold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Chapter Five
          </motion.p>
          <motion.h2
            className="font-display text-cream"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Wildlife We Have Helped
          </motion.h2>
          <motion.p
            className="text-cream/60 mt-4 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Every exchange directly improves the lives of animals in collections worldwide.
          </motion.p>
        </div>
      </div>

      {/* ── Multi-layer parallax jungle ── */}
      <div className="relative h-[40vh] overflow-hidden">
        {/* Background mountains/mist */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=70')`,
            y: bgY,
          }}
        />
        {/* Midground trees */}
        <motion.div
          className="absolute inset-0"
          style={{ y: midY }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-forest via-transparent to-transparent" />
          <div
            className="absolute inset-0 bg-cover bg-bottom opacity-70"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1920&q=60')` }}
          />
        </motion.div>
        {/* Foreground leaves vignette */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: fgY }}
        >
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest to-transparent" />
        </motion.div>
      </div>

      {/* ── Wildlife Cards ── */}
      <div className="relative z-10 py-24">
        <div className="container-keep">
          <div className="space-y-24">
            {wildlife.map((animal, i) => (
              <motion.div
                key={animal.name}
                className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={i % 2 === 1 ? '[direction:ltr]' : ''}>
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <img
                      src={animal.image}
                      alt={animal.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className={`text-xs font-bold uppercase tracking-wider ${statusColour[animal.status] ?? 'text-sage'}`}>
                        ● {animal.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={i % 2 === 1 ? '[direction:ltr]' : ''} >
                  <p className="text-sage/60 text-sm italic mb-2">{animal.species}</p>
                  <h3 className="font-display text-cream text-4xl font-semibold mb-1">{animal.name}</h3>
                  <p className="text-gold/70 text-sm mb-6">{animal.location}</p>
                  <p className="text-cream/60 leading-relaxed mb-8">{animal.contribution}</p>
                  <div className="h-px w-16 bg-gold/30" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
