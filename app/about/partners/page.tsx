import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PageHero } from '@/components/shared/PageHero'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_PARTNERS_LIST } from '@/lib/getSiteSettings'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export const metadata = { title: 'Partners' }

export default async function PartnersPage() {
  const supabase = await createClient()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const partners = parseSetting(s['partners.list'], DEFAULT_PARTNERS_LIST)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <main className="flex-1">
        <PageHero
          eyebrow="Our Network"
          title={s['partners.hero_title']}
          subtitle={s['partners.hero_subtitle']}
          image={s['partners.hero_image']}
          size="sm"
        />

        <section className="section-padding bg-cream">
          <div className="container-keep">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map(p => (
                <div key={p.name} className="bg-white rounded-2xl p-6 border border-stone/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-display font-semibold text-xl text-forest mb-2">{p.name}</h3>
                  <p className="flex items-center gap-1.5 text-sm text-ink/50 mb-4">
                    <MapPin className="h-3.5 w-3.5" /> {p.location}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(p.specialisms ?? []).map((sp: string) => (
                      <span key={sp} className="text-xs px-2.5 py-1 rounded-full bg-mist text-moss border border-sage/20 font-medium">{sp}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding-sm bg-mist">
          <div className="container-keep text-center max-w-xl">
            <h2 className="display-md text-forest mb-4">{s['partners.cta_heading']}</h2>
            <p className="text-ink/60 text-lg mb-8 leading-relaxed">{s['partners.cta_body']}</p>
            <Link href="/joining-keep" className="inline-flex items-center gap-2 px-6 py-3 bg-canopy text-cream font-medium rounded-lg hover:bg-forest transition-all duration-300">
              Register your collection
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
