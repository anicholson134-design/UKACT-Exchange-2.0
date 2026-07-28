'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'

type DonateSectionProps = {
  heading?: string
  body?: string
  bgImage?: string
}

export function DonateSection({ heading, body, bgImage }: DonateSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const donateHeading = heading || 'Help us support the next generation of animal care technicians'
  const donateBody = body || 'Every £5 donated helps UKACT run CPD events, develop resources, and ultimately improve animal welfare and student experience across the UK.'
  const donateBgImage = bgImage || '/CTA-bg.webp'

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-keep">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${donateBgImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/70 to-forest/40" />

          {/* Content */}
          <div className="relative z-10 px-8 md:px-16 py-16 md:py-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/30 mb-6">
              <Heart className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">Support UKACT</span>
            </div>

            <h2 className="display-md text-cream mb-4">
              {donateHeading}
            </h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-8 max-w-lg">
              {donateBody}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="https://www.paypal.com/donate"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30"
              >
                <Heart className="h-4 w-4" />
                Donate £5
              </Link>
              <Link
                href="/about/sponsors"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-cream font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Become a sponsor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
