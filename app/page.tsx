import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { MissionSection } from '@/components/home/MissionSection'
import { StatsSection } from '@/components/home/StatsSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { FeaturedListings } from '@/components/home/FeaturedListings'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PartnersSection } from '@/components/home/PartnersSection'
import type { Profile } from '@/types'
import { parseSetting, DEFAULT_STATS, DEFAULT_HOWITWORKS_STEPS, DEFAULT_TESTIMONIALS, DEFAULT_HOME_PARTNERS } from '@/lib/getSiteSettings'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])

  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        profile={profile}
        cmsItems={cmsItems}
        logoUrl={s['branding.logo_url']}
        navConfig={parseSetting(s['nav.items'], undefined)}
        navCustom={parseSetting(s['nav.custom'], [])}
      />
      <main className="flex-1">
        <HeroSection
          eyebrow={s['home.hero_eyebrow']}
          headline={s['home.hero_headline']}
          subtitle={s['home.hero_subtitle']}
          bgImage={s['home.hero_bg_image']}
        />
        <MissionSection
          quote={s['home.mission_quote']}
          body1={s['home.mission_body_1']}
          body2={s['home.mission_body_2']}
          image={s['home.mission_image']}
          statNumber={s['home.mission_stat_number']}
          statLabel={s['home.mission_stat_label']}
        />
        <StatsSection stats={parseSetting(s['home.stats'], DEFAULT_STATS)} />
        <HowItWorksSection
          eyebrow={s['home.howitworks_eyebrow']}
          heading={s['home.howitworks_heading']}
          steps={parseSetting(s['home.howitworks_steps'], DEFAULT_HOWITWORKS_STEPS)}
        />
        <FeaturedListings jobs={featuredJobs ?? []} />
        <TestimonialsSection
          eyebrow={s['home.testimonials_eyebrow']}
          heading={s['home.testimonials_heading']}
          testimonials={parseSetting(s['home.testimonials'], DEFAULT_TESTIMONIALS)}
        />
        <PartnersSection
          eyebrow={s['home.partners_eyebrow']}
          heading={s['home.partners_heading']}
          partners={parseSetting(s['home.partners'], DEFAULT_HOME_PARTNERS)}
        />
      </main>
      <Footer />
    </div>
  )
}
