'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { ObjectArrayField } from '@/components/admin/settings/ObjectArrayField'
import { StringArrayField } from '@/components/admin/settings/StringArrayField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

type SectorData = {
  id: string; name: string; tagline: string; subtitle: string; hero_image: string
  mission_headline: string; mission_body: string; mission_image: string
  cta_headline: string; cta_body: string
  benefits: Record<string, string>[]; partners: Record<string, string>[]
  case_title: string; case_body: string; case_stat: string; case_stat_label: string
  case_quote: string; case_quote_author: string
  testimonials: Record<string, string>[]
}

const LABELS: Record<string, string> = {
  conservation: 'Conservation',
  'zoos-aquariums': 'Zoos & Aquariums',
  education: 'Education',
  researchers: 'Researchers',
}

export function SectorsForm({ initial }: { initial: SectorData[] }) {
  const [sectors, setSectors] = useState<SectorData[]>(initial)
  const [active, setActive] = useState(initial[0]?.id ?? 'conservation')

  function update(sectorId: string, key: keyof SectorData, val: unknown) {
    setSectors(prev => prev.map(s => s.id === sectorId ? { ...s, [key]: val } : s))
  }

  async function save() {
    const patch: Record<string, string> = {}
    for (const s of sectors) {
      const prefix = `sector.${s.id}.`
      patch[`${prefix}name`] = s.name
      patch[`${prefix}tagline`] = s.tagline
      patch[`${prefix}subtitle`] = s.subtitle
      patch[`${prefix}hero_image`] = s.hero_image
      patch[`${prefix}mission_headline`] = s.mission_headline
      patch[`${prefix}mission_body`] = s.mission_body
      patch[`${prefix}mission_image`] = s.mission_image
      patch[`${prefix}cta_headline`] = s.cta_headline
      patch[`${prefix}cta_body`] = s.cta_body
      patch[`${prefix}benefits`] = JSON.stringify(s.benefits)
      patch[`${prefix}partners`] = JSON.stringify(s.partners)
      patch[`${prefix}case_title`] = s.case_title
      patch[`${prefix}case_body`] = s.case_body
      patch[`${prefix}case_stat`] = s.case_stat
      patch[`${prefix}case_stat_label`] = s.case_stat_label
      patch[`${prefix}case_quote`] = s.case_quote
      patch[`${prefix}case_quote_author`] = s.case_quote_author
      patch[`${prefix}testimonials`] = JSON.stringify(s.testimonials)
    }
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  }

  const sector = sectors.find(s => s.id === active)!
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  return (
    <div className="max-w-2xl space-y-6">
      {/* Sector tabs */}
      <div className="flex gap-2 flex-wrap">
        {sectors.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === s.id ? 'bg-canopy text-cream' : 'bg-sand text-stone hover:text-forest'
            }`}
          >
            {LABELS[s.id] ?? s.id}
          </button>
        ))}
      </div>

      {sector && (
        <>
          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Hero</h2>
            <div className={card}>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Name</label><input className={inp} value={sector.name} onChange={e => update(active, 'name', e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Tagline</label><input className={inp} value={sector.tagline} onChange={e => update(active, 'tagline', e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Subtitle</label><textarea rows={2} className={inp} value={sector.subtitle} onChange={e => update(active, 'subtitle', e.target.value)} /></div>
              <ImageField label="Hero Image" value={sector.hero_image} onChange={v => update(active, 'hero_image', v)} />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Benefits</h2>
            <div className={card}>
              <ObjectArrayField
                label="Benefits"
                items={sector.benefits}
                onChange={v => update(active, 'benefits', v)}
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'Field Experience' },
                  { key: 'desc', label: 'Description', type: 'textarea' },
                ]}
                itemLabel={item => item.title || 'Benefit'}
              />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Mission</h2>
            <div className={card}>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Headline</label><input className={inp} value={sector.mission_headline} onChange={e => update(active, 'mission_headline', e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={5} className={inp} value={sector.mission_body} onChange={e => update(active, 'mission_body', e.target.value)} /></div>
              <ImageField label="Mission Image" value={sector.mission_image} onChange={v => update(active, 'mission_image', v)} />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Case Study</h2>
            <div className={card}>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Title</label><input className={inp} value={sector.case_title} onChange={e => update(active, 'case_title', e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={5} className={inp} value={sector.case_body} onChange={e => update(active, 'case_body', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-ink mb-1.5">Stat</label><input className={inp} value={sector.case_stat} onChange={e => update(active, 'case_stat', e.target.value)} /></div>
                <div><label className="block text-sm font-medium text-ink mb-1.5">Stat label</label><input className={inp} value={sector.case_stat_label} onChange={e => update(active, 'case_stat_label', e.target.value)} /></div>
              </div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Pull quote</label><textarea rows={3} className={inp} value={sector.case_quote} onChange={e => update(active, 'case_quote', e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Quote author</label><input className={inp} value={sector.case_quote_author} onChange={e => update(active, 'case_quote_author', e.target.value)} /></div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Partners</h2>
            <div className={card}>
              <StringArrayField
                label="Partner names"
                values={sector.partners.map(p => p.name)}
                onChange={names => update(active, 'partners', names.map(name => ({ name })))}
                placeholder="Chester Zoo"
              />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Testimonials</h2>
            <div className={card}>
              <ObjectArrayField
                label="Testimonials"
                items={sector.testimonials}
                onChange={v => update(active, 'testimonials', v)}
                fields={[
                  { key: 'quote', label: 'Quote', type: 'textarea' },
                  { key: 'name', label: 'Name', placeholder: 'Sarah Mitchell' },
                  { key: 'role', label: 'Role', placeholder: 'Animal Unit Manager · Further Education College' },
                  { key: 'image', label: 'Avatar URL', placeholder: 'https://…' },
                ]}
                itemLabel={item => item.name || 'Testimonial'}
              />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-forest mb-4">Call to Action</h2>
            <div className={card}>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Headline</label><input className={inp} value={sector.cta_headline} onChange={e => update(active, 'cta_headline', e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={3} className={inp} value={sector.cta_body} onChange={e => update(active, 'cta_body', e.target.value)} /></div>
            </div>
          </section>
        </>
      )}

      <SaveBar onSave={save} />
    </div>
  )
}
