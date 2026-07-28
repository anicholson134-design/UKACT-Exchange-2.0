import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PageHero } from '@/components/shared/PageHero'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_ABOUT_TIMELINE, DEFAULT_ABOUT_VALUES, DEFAULT_ABOUT_STATS } from '@/lib/getSiteSettings'
import type { Profile } from '@/types'

export const metadata = { title: 'About UKACT' }

export default async function AboutPage() {
  const supabase = await createClient()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const timeline = parseSetting(s['about.timeline'], DEFAULT_ABOUT_TIMELINE)
  const values = parseSetting(s['about.values'], DEFAULT_ABOUT_VALUES)
  const stats = parseSetting(s['about.stats'], DEFAULT_ABOUT_STATS)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <main className="flex-1">
        <PageHero
          eyebrow="About UKACT"
          title={s['about.hero_title']}
          subtitle={s['about.hero_subtitle']}
          image={s['about.hero_image']}
        />

        <section className="section-padding bg-cream">
          <div className="container-keep max-w-4xl text-center">
            <p className="eyebrow mb-6">{s['about.intro_eyebrow']}</p>
            <h2 className="display-md text-forest mb-8">{s['about.intro_heading']}</h2>
            <p className="text-lg text-ink/70 leading-relaxed mb-6">{s['about.intro_body_1']}</p>
            <p className="text-lg text-ink/70 leading-relaxed">{s['about.intro_body_2']}</p>
          </div>
        </section>

        <section className="section-padding bg-mist">
          <div className="container-keep">
            <div className="text-center mb-16">
              <p className="eyebrow mb-4">Our Journey</p>
              <h2 className="display-md text-forest">A Decade of Growth</h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-stone/40 hidden md:block" />
              <div className="space-y-12">
                {timeline.map((item) => (
                  <div key={item.year} className="flex gap-8 md:gap-12 items-start">
                    <div className="shrink-0 w-16 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-gold border-4 border-cream relative z-10" />
                      <span className="text-sm font-bold text-gold mt-2 font-display">{item.year}</span>
                    </div>
                    <div className="pb-2">
                      <h3 className="font-display font-semibold text-xl text-forest mb-2">{item.title}</h3>
                      <p className="text-ink/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-cream">
          <div className="container-keep">
            <div className="text-center mb-16">
              <p className="eyebrow mb-4">What We Believe</p>
              <h2 className="display-md text-forest">Our Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(v => (
                <div key={v.title} className="bg-white rounded-2xl p-8 border border-stone/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <span className="text-3xl mb-4 block">{v.emoji}</span>
                  <h3 className="font-display font-semibold text-xl text-forest mb-3">{v.title}</h3>
                  <p className="text-ink/60 leading-relaxed text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding-sm bg-forest">
          <div className="container-keep">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="font-display text-4xl font-bold text-gold mb-1">{stat.number}</p>
                  <p className="text-sage/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
