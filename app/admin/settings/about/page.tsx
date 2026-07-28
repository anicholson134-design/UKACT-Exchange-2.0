import { getSiteSettings, parseSetting, DEFAULT_ABOUT_TIMELINE, DEFAULT_ABOUT_STATS, DEFAULT_ABOUT_VALUES } from '@/lib/getSiteSettings'
import { AboutForm } from './AboutForm'

export default async function AboutSettingsPage() {
  const s = await getSiteSettings()
  return (
    <AboutForm
      initial={{
        hero_title: s['about.hero_title'],
        hero_subtitle: s['about.hero_subtitle'],
        hero_image: s['about.hero_image'],
        intro_eyebrow: s['about.intro_eyebrow'],
        intro_heading: s['about.intro_heading'],
        intro_body_1: s['about.intro_body_1'],
        intro_body_2: s['about.intro_body_2'],
        timeline: parseSetting(s['about.timeline'], DEFAULT_ABOUT_TIMELINE),
        stats: parseSetting(s['about.stats'], DEFAULT_ABOUT_STATS),
        values: parseSetting(s['about.values'], DEFAULT_ABOUT_VALUES),
      }}
    />
  )
}
