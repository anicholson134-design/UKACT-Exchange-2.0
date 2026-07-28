import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_CONTACT_BLOCKS } from '@/lib/getSiteSettings'
import { ContactClient } from './ContactClient'

export const metadata = { title: 'Contact UKACT' }

export default async function ContactPage() {
  const supabase = await createClient()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <ContactClient
        blocks={parseSetting(s['contact.blocks'], DEFAULT_CONTACT_BLOCKS)}
        heroHeading={s['contact.hero_heading']}
        heroBody={s['contact.hero_body']}
        email={s['contact.email']}
        location={s['contact.location']}
        responseTime={s['contact.response_time']}
      />
      <Footer />
    </div>
  )
}
