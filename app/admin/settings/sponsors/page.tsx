import { getSiteSettings, parseSetting, DEFAULT_SPONSOR_TIERS } from '@/lib/getSiteSettings'
import { SponsorsForm } from './SponsorsForm'

export default async function SponsorsSettingsPage() {
  const s = await getSiteSettings()
  return (
    <SponsorsForm
      initial={{
        hero_title: s['sponsors.hero_title'],
        hero_subtitle: s['sponsors.hero_subtitle'],
        hero_image: s['sponsors.hero_image'],
        body: s['sponsors.body'],
        tiers: parseSetting(s['sponsors.tiers'], DEFAULT_SPONSOR_TIERS),
        cta_heading: s['sponsors.cta_heading'],
        cta_body: s['sponsors.cta_body'],
      }}
    />
  )
}
