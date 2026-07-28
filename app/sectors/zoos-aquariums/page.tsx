import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getSector } from '@/lib/sectors'
import { getSiteSettings, parseSetting } from '@/lib/getSiteSettings'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { SectorPage } from '@/components/sectors/SectorPage'

export const metadata: Metadata = { title: 'Animal Care Colleges' }

export default async function ZoosAquariumsPage() {
  const supabase = await createClient()
  const [settings, cmsItems] = await Promise.all([getSiteSettings(), getCmsNavItems()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }
  return (
    <SectorPage
      sector={getSector('zoos-aquariums', settings)!}
      profile={profile}
      cmsItems={cmsItems}
      logoUrl={settings["branding.logo_url"]}
      navConfig={parseSetting(settings["nav.items"], undefined)}
      navCustom={parseSetting(settings["nav.custom"], [])}
    />
  )
}
