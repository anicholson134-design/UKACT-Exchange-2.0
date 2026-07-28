'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function EazaNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass' : 'bg-transparent'}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-keep">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="https://www.keeperexchange.org/" className="flex items-center gap-2">
            <Image
              src="/keep-logo.webp"
              alt="KEEP"
              width={96}
              height={96}
              className="h-14 w-14 md:h-16 md:w-16 object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="https://www.keeperexchange.org/"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-cream/80 hover:text-gold transition-colors duration-200"
            >
              Visit full website
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://www.keeperexchange.org/joining-keep/"
              className="inline-flex items-center px-4 md:px-5 py-2 md:py-2.5 text-sm font-medium bg-gold text-cream rounded-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
