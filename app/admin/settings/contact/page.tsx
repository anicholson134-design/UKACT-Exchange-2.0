import { getSiteSettings } from '@/lib/getSiteSettings'
import { ContactForm } from './ContactForm'

export default async function ContactSettingsPage() {
  const s = await getSiteSettings()
  return (
    <ContactForm
      initial={{
        hero_heading: s['contact.hero_heading'],
        hero_body: s['contact.hero_body'],
        email: s['contact.email'],
        location: s['contact.location'],
        response_time: s['contact.response_time'],
      }}
    />
  )
}
