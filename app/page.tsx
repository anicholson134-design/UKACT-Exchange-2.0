import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_HOME_BLOCKS } from '@/lib/getSiteSettings'
import { getBlockData, migrateLegacyBlockType } from '@/lib/blockLibrary'
import { renderBlock } from '@/components/blocks/renderBlock'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import type { Profile, Job } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])

  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const blocks = parseSetting(s['home.blocks'], DEFAULT_HOME_BLOCKS).map(t => migrateLegacyBlockType(t, 'home'))
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
      <Navbar
        profile={profile}
        cmsItems={cmsItems}
        logoUrl={s['branding.logo_url']}
        navConfig={parseSetting(s['nav.items'], undefined)}
        navCustom={parseSetting(s['nav.custom'], [])}
      />
      <main className="flex-1">
        {blocks.map(type => renderBlock(type, blockData, featuredJobs))}
      </main>
      <Footer />
    </div>
  )
}
