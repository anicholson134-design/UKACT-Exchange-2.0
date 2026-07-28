import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PageHero } from '@/components/shared/PageHero'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_SPONSOR_TIERS } from '@/lib/getSiteSettings'
import Link from 'next/link'

export const metadata = { title: 'Sponsors' }

const TIER_STYLES: Record<string, { border: string; label: string }> = {
  Platinum: { border: 'border-stone bg-gradient-to-br from-stone/20 to-transparent', label: 'text-stone' },
  Gold: { border: 'border-gold/40 bg-gradient-to-br from-gold/10 to-transparent', label: 'text-gold' },
  Silver: { border: 'border-sage/30 bg-gradient-to-br from-sage/10 to-transparent', label: 'text-moss' },
}

export default async function SponsorsPage() {
  const supabase = await createClient()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const tiers = parseSetting(s['sponsors.tiers'], DEFAULT_SPONSOR_TIERS)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <main className="flex-1">
        <PageHero
          eyebrow="Support"
          title={s['sponsors.hero_title']}
          subtitle={s['sponsors.hero_subtitle']}
          image={s['sponsors.hero_image']}
          size="sm"
        />

        <section className="section-padding bg-cream">
          <div className="container-keep max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-lg text-ink/60 max-w-2xl mx-auto leading-relaxed">{s['sponsors.body']}</p>
            </div>

            <div className="space-y-12">
              {tiers.map(t => {
                const style = TIER_STYLES[t.tier] ?? { border: 'border-stone/20 bg-white', label: 'text-stone' }
                return (
                  <div key={t.tier}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className={`text-xs font-bold uppercase tracking-widest ${style.label}`}>{t.tier} Sponsors</span>
                      <div className="flex-1 h-px bg-stone/30" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {t.sponsors.map(sp => (
                        <div key={sp.name} className={`rounded-xl border p-6 flex items-center justify-center min-h-[100px] ${style.border}`}>
                          <p className="font-display font-semibold text-center text-forest">{sp.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-padding bg-forest">
          <div className="container-keep text-center max-w-2xl">
            <p className="eyebrow text-gold mb-4">Partner With Us</p>
            <h2 className="display-md text-cream mb-6">{s['sponsors.cta_heading']}</h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-8">{s['sponsors.cta_body']}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-lg hover:bg-gold-light transition-all duration-300">
              Get in touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
