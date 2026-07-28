import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PageHero } from '@/components/shared/PageHero'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_TEAM_MEMBERS } from '@/lib/getSiteSettings'

export const metadata = { title: 'Meet the Team' }

export default async function TeamPage() {
  const supabase = await createClient()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const members = parseSetting(s['team.members'], DEFAULT_TEAM_MEMBERS)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <main className="flex-1">
        <PageHero
          eyebrow="Our People"
          title={s['team.hero_title']}
          subtitle={s['team.hero_subtitle']}
          image={s['team.hero_image']}
          size="sm"
        />

        <section className="section-padding bg-cream">
          <div className="container-keep">
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {members.map(member => (
                <div key={member.name} className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-5">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-forest mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-gold mb-3">{member.role}</p>
                  <p className="text-sm text-ink/60 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding-sm bg-mist">
          <div className="container-keep text-center max-w-2xl">
            <h2 className="display-md text-forest mb-4">{s['team.cta_heading']}</h2>
            <p className="text-ink/60 text-lg mb-8">{s['team.cta_body']}</p>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-lg hover:bg-gold-light transition-all duration-300">
              Get in touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
