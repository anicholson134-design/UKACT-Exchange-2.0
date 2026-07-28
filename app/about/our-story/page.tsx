import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { OurStoryExperience } from '@/components/story/OurStoryExperience'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'A journey through wildlife conservation, education and global partnerships.',
}

export default async function OurStoryPage() {
  const supabase = await createClient()
  const settings = await getSiteSettings()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="relative bg-forest">
      {/* Navbar always floats above the experience */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar profile={profile as any} logoUrl={settings['branding.logo_url']} />
      </div>

      {/* The single continuous experience */}
      <OurStoryExperience />

      {/* Footer appears after the scroll journey ends */}
      <Footer />
    </div>
  )
}
