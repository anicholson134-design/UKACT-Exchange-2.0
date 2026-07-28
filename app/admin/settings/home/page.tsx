import { getSiteSettings, parseSetting, DEFAULT_STATS, DEFAULT_HOWITWORKS_STEPS, DEFAULT_TESTIMONIALS, DEFAULT_HOME_PARTNERS, DEFAULT_HOME_BLOCKS } from '@/lib/getSiteSettings'
import { HomeForm } from './HomeForm'

export default async function HomeSettingsPage() {
  const s = await getSiteSettings()
  return (
    <HomeForm
      initial={{
        blocks: parseSetting(s['home.blocks'], DEFAULT_HOME_BLOCKS),
        hero_eyebrow: s['home.hero_eyebrow'],
        hero_headline: s['home.hero_headline'],
        hero_subtitle: s['home.hero_subtitle'],
        hero_bg_image: s['home.hero_bg_image'],
        mission_quote: s['home.mission_quote'],
        mission_body_1: s['home.mission_body_1'],
        mission_body_2: s['home.mission_body_2'],
        mission_image: s['home.mission_image'],
        mission_stat_number: s['home.mission_stat_number'],
        mission_stat_label: s['home.mission_stat_label'],
        stats: parseSetting(s['home.stats'], DEFAULT_STATS).map(st => ({
          value: String(st.value), suffix: st.suffix, label: st.label, desc: st.desc,
        })),
        howitworks_eyebrow: s['home.howitworks_eyebrow'],
        howitworks_heading: s['home.howitworks_heading'],
        howitworks_steps: parseSetting(s['home.howitworks_steps'], DEFAULT_HOWITWORKS_STEPS),
        testimonials_eyebrow: s['home.testimonials_eyebrow'],
        testimonials_heading: s['home.testimonials_heading'],
        testimonials: parseSetting(s['home.testimonials'], DEFAULT_TESTIMONIALS),
        partners_eyebrow: s['home.partners_eyebrow'],
        partners_heading: s['home.partners_heading'],
        partners: parseSetting(s['home.partners'], DEFAULT_HOME_PARTNERS),
      }}
    />
  )
}
