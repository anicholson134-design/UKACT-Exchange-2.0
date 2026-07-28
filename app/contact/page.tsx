import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_CONTACT_BLOCKS } from '@/lib/getSiteSettings'
import { getBlockData, migrateLegacyBlockType } from '@/lib/blockLibrary'
import { renderBlock } from '@/components/blocks/renderBlock'
import type { Job } from '@/types'

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

  const blocks = parseSetting(s['contact.blocks'], DEFAULT_CONTACT_BLOCKS).map(t => migrateLegacyBlockType(t, 'contact'))
  const blockData = getBlockData(s)

  let featuredJobs: Job[] = []
  if (blocks.includes('featured_listings')) {
    const { data } = await supabase
      .from('jobs')
      .select('*, employer_profiles(company_name, logo_url, location)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3)
    featuredJobs = data ?? []
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <main className="flex-1">
        {blocks.map(type => renderBlock(type, blockData, featuredJobs))}
      </main>
      <Footer />
    </div>
  )
}
