import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SectorHero } from '@/components/sectors/SectorHero'
import { SectorBenefits } from '@/components/sectors/SectorBenefits'
import { SectorMission } from '@/components/sectors/SectorMission'
import { SectorCaseStudy } from '@/components/sectors/SectorCaseStudy'
import { SectorLiveJobs } from '@/components/sectors/SectorLiveJobs'
import { SectorPartners } from '@/components/sectors/SectorPartners'
import { SectorTestimonials } from '@/components/sectors/SectorTestimonials'
import { SectorCTA } from '@/components/sectors/SectorCTA'
import type { SectorConfig } from '@/lib/sectors'
import type { CmsNavItem } from '@/lib/getCmsNavItems'

interface SectorPageProps {
  sector: SectorConfig
  profile: any
  cmsItems?: CmsNavItem[]
  logoUrl?: string
  navConfig?: { label: string; href: string; visible: boolean }[]
  navCustom?: { label: string; href: string; visible: boolean }[]
}

export function SectorPage({ sector, profile, cmsItems = [], logoUrl, navConfig, navCustom }: SectorPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} cmsItems={cmsItems} logoUrl={logoUrl} navConfig={navConfig} navCustom={navCustom} />
      <main className="flex-1">
        <SectorHero
          name={sector.name}
          tagline={sector.tagline}
          subtitle={sector.subtitle}
          heroPoster={sector.heroPoster}
          videoSrc={sector.videoSrc}
          cta={sector.cta}
        />
        <SectorBenefits benefits={sector.benefits} />
        <SectorMission {...sector.mission} />
        <SectorCaseStudy {...sector.caseStudy} />
        <SectorLiveJobs sectorTag={sector.sectorTag} />
        <SectorPartners partners={sector.partners} />
        <SectorTestimonials testimonials={sector.testimonials} />
        <SectorCTA {...sector.cta} />
      </main>
      <Footer />
    </div>
  )
}
