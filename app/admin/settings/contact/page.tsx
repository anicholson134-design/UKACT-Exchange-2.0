import { getSiteSettings, parseSetting, DEFAULT_CONTACT_BLOCKS } from '@/lib/getSiteSettings'
import { ContactForm } from './ContactForm'

export default async function ContactSettingsPage() {
  const s = await getSiteSettings()
  return (
    <ContactForm
      initial={{
        blocks: parseSetting(s['contact.blocks'], DEFAULT_CONTACT_BLOCKS),
        hero_heading: s['contact.hero_heading'],
        hero_body: s['contact.hero_body'],
        email: s['contact.email'],
        location: s['contact.location'],
        response_time: s['contact.response_time'],
      }}
    />
  )
}
