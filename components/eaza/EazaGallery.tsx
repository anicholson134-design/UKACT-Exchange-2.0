'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

// Tile size is intentionally biased by source resolution: the higher-res
// assets (500x500 webp, 768x768 png) get the larger "tall" tiles, while the
// 206x206 certificate photos stay in smaller tiles so they're upscaled less.
const IMAGES = [
  { src: '/westmids_certificate.jpg', category: 'Keepers', tall: false },
  { src: '/Arianna-Chester-Zoo.webp', category: 'Zoos', tall: true },
  { src: '/Tiger_certificate.jpg', category: 'Training', tall: false },
  { src: '/Holly-Noahs-Ark-Zoo-Farm.webp', category: 'Zoos', tall: true },
  { src: '/rhino_certificate.jpg', category: 'Keepers', tall: false },
  { src: '/chester_primate_keepers.jpg', category: 'Conservation', tall: false },
  { src: '/Joanna-National-Marine-Aquarium-NMA-Plymouth.webp', category: 'Animals', tall: true },
  { src: '/Panda_certificate.jpg', category: 'Training', tall: false },
  { src: '/11FB22FD-17CE-4DA1-93F1-5361F0B15763-2-min-1-768x768.png', category: 'Keepers', tall: true },
  { src: '/Giraffe_certificate.jpg', category: 'Keeper', tall: false },
]

export function EazaGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding bg-sand" ref={ref}>
      <div className="container-keep">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-4">Gallery</p>
          <h2 className="display-md text-forest">Keepers, Animals &amp; Collections</h2>
        </motion.div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              className={`relative block w-full rounded-2xl overflow-hidden break-inside-avoid ${img.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
            >
              <Image
                src={img.src}
                alt={img.category}
                fill
                quality={95}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
