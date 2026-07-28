'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { UserPlus, Building2, Handshake, ArrowRight } from 'lucide-react'

const CARDS = [
  {
    icon: UserPlus,
    title: 'Apply',
    desc: 'Ready to grow your skills? Start your keeper exchange application today.',
    cta: 'Apply Now',
    href: 'https://www.keeperexchange.org/joining-keep/',
  },
  {
    icon: Building2,
    title: 'Host a Keeper',
    desc: 'Open your doors to a visiting keeper and bring new expertise to your team.',
    cta: 'Become a Host Zoo',
    href: 'https://www.keeperexchange.org/joining-keep/',
  },
  {
    icon: Handshake,
    title: 'Partner with KEEP',
    desc: 'Explore sponsorship and partnership opportunities with our network.',
    cta: 'Get in Touch',
    href: 'https://www.keeperexchange.org/contact-us/',
  },
]

export function GetInvolved() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-keep">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-4">Get Involved</p>
          <h2 className="display-lg text-forest">Become Part of Europe&rsquo;s Keeper Community</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className="group relative rounded-2xl bg-card ring-1 ring-stone/30 p-8 flex flex-col items-start overflow-hidden"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px -12px rgba(28,43,30,0.18)' }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-sage/10 group-hover:bg-gold/15 transition-colors duration-500" />
              <div className="relative w-14 h-14 rounded-xl bg-forest flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <card.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="relative text-xl font-display font-semibold text-forest mb-3">{card.title}</h3>
              <p className="relative text-sm text-ink/60 leading-relaxed mb-8 flex-1">{card.desc}</p>
              <Link
                href={card.href}
                className="relative inline-flex items-center gap-2 text-sm font-semibold text-canopy group-hover:text-gold transition-colors duration-300"
              >
                {card.cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
