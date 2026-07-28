import { getSiteSettings, parseSetting, DEFAULT_TEAM_MEMBERS } from '@/lib/getSiteSettings'
import { TeamForm } from './TeamForm'

export default async function TeamSettingsPage() {
  const s = await getSiteSettings()
  return (
    <TeamForm
      initial={{
        hero_title: s['team.hero_title'],
        hero_subtitle: s['team.hero_subtitle'],
        hero_image: s['team.hero_image'],
        members: parseSetting(s['team.members'], DEFAULT_TEAM_MEMBERS),
        cta_heading: s['team.cta_heading'],
        cta_body: s['team.cta_body'],
      }}
    />
  )
}
