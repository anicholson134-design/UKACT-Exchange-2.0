import { HeroSection } from '@/components/home/HeroSection'
import { MissionSection } from '@/components/home/MissionSection'
import { StatsSection } from '@/components/home/StatsSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { FeaturedListings } from '@/components/home/FeaturedListings'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PartnersSection } from '@/components/home/PartnersSection'
import { PageHero } from '@/components/shared/PageHero'
import { BenefitsSection } from '@/components/blocks/BenefitsSection'
import { StepsSection } from '@/components/blocks/StepsSection'
import { FaqsSection } from '@/components/blocks/FaqsSection'
import { ContactHeroSection } from '@/components/blocks/ContactHeroSection'
import { ContactDetailsFormBlock } from '@/components/blocks/ContactDetailsFormBlock'
import type { BlockData } from '@/lib/blockLibrary'
import type { Job } from '@/types'

/** Renders any block type from the shared library, given the site's block content and (if needed) live jobs. */
export function renderBlock(type: string, d: BlockData, jobs: Job[] = []): React.ReactNode {
  switch (type) {
    case 'home_hero':
      return <HeroSection key={type} eyebrow={d.home_hero_eyebrow} headline={d.home_hero_headline} subtitle={d.home_hero_subtitle} bgImage={d.home_hero_bg_image} />
    case 'mission':
      return <MissionSection key={type} quote={d.mission_quote} body1={d.mission_body_1} body2={d.mission_body_2} image={d.mission_image} statNumber={d.mission_stat_number} statLabel={d.mission_stat_label} />
    case 'stats':
      return <StatsSection key={type} stats={d.stats.map(st => ({ value: Number(st.value), suffix: st.suffix, label: st.label, desc: st.desc }))} />
    case 'how_it_works':
      return <HowItWorksSection key={type} eyebrow={d.howitworks_eyebrow} heading={d.howitworks_heading} steps={d.howitworks_steps} />
    case 'featured_listings':
      return <FeaturedListings key={type} jobs={jobs} />
    case 'testimonials':
      return <TestimonialsSection key={type} eyebrow={d.testimonials_eyebrow} heading={d.testimonials_heading} testimonials={d.testimonials} />
    case 'partners':
      return <PartnersSection key={type} eyebrow={d.partners_eyebrow} heading={d.partners_heading} partners={d.partners} />
    case 'joining_hero':
      return <PageHero key={type} eyebrow="Get Started" title={d.joining_hero_title} subtitle={d.joining_hero_subtitle} image={d.joining_hero_image} />
    case 'benefits':
      return <BenefitsSection key={type} keeperBenefits={d.keeper_benefits} collectionBenefits={d.collection_benefits} />
    case 'joining_steps':
      return <StepsSection key={type} steps={d.joining_steps} />
    case 'faqs':
      return <FaqsSection key={type} faqs={d.faqs} />
    case 'contact_hero':
      return <ContactHeroSection key={type} heading={d.contact_hero_heading} body={d.contact_hero_body} />
    case 'contact_details_form':
      return <ContactDetailsFormBlock key={type} email={d.contact_email} location={d.contact_location} responseTime={d.contact_response_time} />
    default:
      return null
  }
}
