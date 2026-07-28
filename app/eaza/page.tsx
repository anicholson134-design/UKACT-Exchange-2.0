import type { Metadata } from 'next'
import { MotionConfig } from 'framer-motion'
import { SmoothScroll } from '@/components/story/SmoothScroll'
import { EazaNav } from '@/components/eaza/EazaNav'
import { EazaHero } from '@/components/eaza/EazaHero'
import { EazaExchangeMap } from '@/components/eaza/EazaExchangeMap'
import { WhatIsKeep } from '@/components/eaza/WhatIsKeep'
import { WhyKeepMatters } from '@/components/eaza/WhyKeepMatters'
import { EazaHowItWorks } from '@/components/eaza/EazaHowItWorks'
import { ConservationSpotlight } from '@/components/eaza/ConservationSpotlight'
import { BenefitsSection } from '@/components/eaza/BenefitsSection'
import { EazaTestimonials } from '@/components/eaza/EazaTestimonials'
import { EazaGallery } from '@/components/eaza/EazaGallery'
import { GetInvolved } from '@/components/eaza/GetInvolved'
import { EazaFooter } from '@/components/eaza/EazaFooter'

export const metadata: Metadata = {
  title: "Connecting Europe's Zookeepers",
  description: "Learn how KEEP connects professional zookeepers across Europe through international exchanges that improve animal welfare and conservation.",
  robots: { index: true, follow: true },
}

export default function EazaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col min-h-screen bg-cream">
        <SmoothScroll />
        <EazaNav />
        <main className="flex-1">
          <EazaHero />
          <EazaExchangeMap />
          <WhatIsKeep />
          <WhyKeepMatters />
          <EazaHowItWorks />
          <ConservationSpotlight />
          <BenefitsSection />
          <EazaTestimonials />
          <EazaGallery />
          <GetInvolved />
        </main>
        <EazaFooter />
      </div>
    </MotionConfig>
  )
}
