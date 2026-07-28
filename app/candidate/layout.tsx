import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings } from '@/lib/getSiteSettings'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import type { Profile } from '@/types'

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [cmsItems, settings] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} cmsItems={cmsItems} logoUrl={settings['branding.logo_url']} />
      <main className="flex-1 container mx-auto px-4 pt-24 md:pt-28 pb-12">{children}</main>
      <Footer />
    </div>
  )
}

