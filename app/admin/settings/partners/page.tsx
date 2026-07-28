import { getSiteSettings, parseSetting, DEFAULT_PARTNERS_LIST } from '@/lib/getSiteSettings'
import { PartnersForm } from './PartnersForm'

export default async function PartnersSettingsPage() {
  const s = await getSiteSettings()
  return (
    <PartnersForm
      initial={{
        hero_title: s['partners.hero_title'],
        hero_subtitle: s['partners.hero_subtitle'],
        hero_image: s['partners.hero_image'],
        list: parseSetting(s['partners.list'], DEFAULT_PARTNERS_LIST),
        cta_heading: s['partners.cta_heading'],
        cta_body: s['partners.cta_body'],
      }}
    />
  )
}
