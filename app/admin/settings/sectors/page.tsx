import { getSiteSettings } from '@/lib/getSiteSettings'
import { parseSetting } from '@/lib/getSiteSettings'
import { getSector } from '@/lib/sectors'
import { SectorsForm } from './SectorsForm'

const SECTOR_IDS = ['conservation', 'zoos-aquariums', 'education', 'researchers'] as const

export default async function SectorsSettingsPage() {
  const s = await getSiteSettings()

  const sectorsData = SECTOR_IDS.map(id => {
    const base = getSector(id)!
    const prefix = `sector.${id}.`
    return {
      id,
      name: s[`${prefix}name`] ?? base.name,
      tagline: s[`${prefix}tagline`] ?? base.tagline,
      subtitle: s[`${prefix}subtitle`] ?? base.subtitle,
      hero_image: s[`${prefix}hero_image`] ?? base.heroPoster,
      mission_headline: s[`${prefix}mission_headline`] ?? base.mission.headline,
      mission_body: s[`${prefix}mission_body`] ?? base.mission.body,
      mission_image: s[`${prefix}mission_image`] ?? base.mission.image,
      cta_headline: s[`${prefix}cta_headline`] ?? base.cta.headline,
      cta_body: s[`${prefix}cta_body`] ?? base.cta.body,
      benefits: parseSetting(s[`${prefix}benefits`], base.benefits),
      partners: parseSetting(s[`${prefix}partners`], base.partners),
      case_title: s[`${prefix}case_title`] ?? base.caseStudy.title,
      case_body: s[`${prefix}case_body`] ?? base.caseStudy.body,
      case_stat: s[`${prefix}case_stat`] ?? base.caseStudy.stat,
      case_stat_label: s[`${prefix}case_stat_label`] ?? base.caseStudy.statLabel,
      case_quote: s[`${prefix}case_quote`] ?? base.caseStudy.quote,
      case_quote_author: s[`${prefix}case_quote_author`] ?? base.caseStudy.quoteAuthor,
      testimonials: parseSetting(s[`${prefix}testimonials`], base.testimonials),
    }
  })

  return <SectorsForm initial={sectorsData} />
}
