import { getSiteSettings, parseSetting, DEFAULT_KEEPER_BENEFITS, DEFAULT_COLLECTION_BENEFITS, DEFAULT_JOINING_STEPS, DEFAULT_FAQS } from '@/lib/getSiteSettings'
import { JoiningForm } from './JoiningForm'

export default async function JoiningSettingsPage() {
  const s = await getSiteSettings()
  return (
    <JoiningForm
      initial={{
        hero_title: s['joining.hero_title'],
        hero_subtitle: s['joining.hero_subtitle'],
        hero_image: s['joining.hero_image'],
        keeper_benefits: parseSetting(s['joining.keeper_benefits'], DEFAULT_KEEPER_BENEFITS),
        collection_benefits: parseSetting(s['joining.collection_benefits'], DEFAULT_COLLECTION_BENEFITS),
        steps: parseSetting(s['joining.steps'], DEFAULT_JOINING_STEPS),
        faqs: parseSetting(s['joining.faqs'], DEFAULT_FAQS),
      }}
    />
  )
}
