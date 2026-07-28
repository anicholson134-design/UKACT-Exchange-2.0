import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { PageHero } from '@/components/shared/PageHero'
import { createClient } from '@/lib/supabase/server'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting, DEFAULT_KEEPER_BENEFITS, DEFAULT_COLLECTION_BENEFITS, DEFAULT_JOINING_STEPS, DEFAULT_FAQS, DEFAULT_JOINING_BLOCKS } from '@/lib/getSiteSettings'
import Link from 'next/link'
import { Check, UserCircle, Building2 } from 'lucide-react'

export const metadata = { title: 'Join UKACT' }

export default async function JoiningUkactPage() {
  const supabase = await createClient()
  const [cmsItems, s] = await Promise.all([getCmsNavItems(), getSiteSettings()])
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  const keeperBenefits = parseSetting<string[]>(s['joining.keeper_benefits'], DEFAULT_KEEPER_BENEFITS)
  const collectionBenefits = parseSetting<string[]>(s['joining.collection_benefits'], DEFAULT_COLLECTION_BENEFITS)
  const steps = parseSetting(s['joining.steps'], DEFAULT_JOINING_STEPS)
  const faqs = parseSetting(s['joining.faqs'], DEFAULT_FAQS)

  const blocks: Record<string, React.ReactNode> = {
    hero: (
      <PageHero
        key="hero"
        eyebrow="Get Started"
        title={s['joining.hero_title']}
        subtitle={s['joining.hero_subtitle']}
        image={s['joining.hero_image']}
      />
    ),
    benefits: (
      <section key="benefits" className="section-padding bg-cream">
        <div className="container-keep">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">Who It&apos;s For</p>
            <h2 className="display-md text-forest">Built for the animal care community</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-stone/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-moss" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl text-forest">For Staff</h3>
                  <p className="text-sm text-ink/50">Develop your expertise</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {keeperBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink/70">
                    <Check className="h-4 w-4 text-moss mt-0.5 shrink-0" />{b}
                  </li>
                ))}
              </ul>
              <Link href="/register/candidate" className="block w-full py-3 text-center bg-canopy text-cream font-medium rounded-xl hover:bg-forest transition-colors">
                Register as a Member
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-stone/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-moss" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl text-forest">For Institutions</h3>
                  <p className="text-sm text-ink/50">Share and receive expertise</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {collectionBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink/70">
                    <Check className="h-4 w-4 text-moss mt-0.5 shrink-0" />{b}
                  </li>
                ))}
              </ul>
              <Link href="/register/employer" className="block w-full py-3 text-center bg-gold text-cream font-medium rounded-xl hover:bg-gold-light transition-colors">
                Register Your Institution
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    steps: (
      <section key="steps" className="section-padding bg-mist">
        <div className="container-keep">
          <div className="text-center mb-16">
            <p className="eyebrow mb-4">The Process</p>
            <h2 className="display-md text-forest">How to join</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-gold text-cream font-display font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold text-lg text-forest mb-2">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    faqs: (
      <section key="faqs" className="section-padding bg-cream">
        <div className="container-keep max-w-3xl">
          <div className="text-center mb-12">
            <p className="eyebrow mb-4">Common Questions</p>
            <h2 className="display-md text-forest">FAQs</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-stone/20 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-display font-semibold text-forest pr-4 min-w-0">{faq.q}</span>
                  <span className="text-gold text-xl font-light shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-ink/60 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile as any} cmsItems={cmsItems} logoUrl={s["branding.logo_url"]} navConfig={parseSetting(s["nav.items"], undefined)} navCustom={parseSetting(s["nav.custom"], [])} />
      <main className="flex-1">
        {parseSetting(s['joining.blocks'], DEFAULT_JOINING_BLOCKS).map(type => blocks[type] ?? null)}
      </main>
      <Footer />
    </div>
  )
}
