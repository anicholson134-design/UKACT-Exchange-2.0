'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { StringArrayField } from '@/components/admin/settings/StringArrayField'
import { ObjectArrayField } from '@/components/admin/settings/ObjectArrayField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface HomeData {
  hero_eyebrow: string; hero_headline: string; hero_subtitle: string; hero_bg_image: string
  mission_quote: string; mission_body_1: string; mission_body_2: string; mission_image: string
  mission_stat_number: string; mission_stat_label: string
  stats: Record<string, string>[]
  howitworks_eyebrow: string; howitworks_heading: string; howitworks_steps: Record<string, string>[]
  testimonials_eyebrow: string; testimonials_heading: string; testimonials: Record<string, string>[]
  partners_eyebrow: string; partners_heading: string; partners: Record<string, string>[]
}

export function HomeForm({ initial }: { initial: HomeData }) {
  const [d, setD] = useState<HomeData>(initial)
  const set = (key: keyof HomeData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const field = (key: keyof HomeData) => ({
    value: d[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
  })

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'home.hero_eyebrow': d.hero_eyebrow, 'home.hero_headline': d.hero_headline,
        'home.hero_subtitle': d.hero_subtitle, 'home.hero_bg_image': d.hero_bg_image,
        'home.mission_quote': d.mission_quote, 'home.mission_body_1': d.mission_body_1,
        'home.mission_body_2': d.mission_body_2, 'home.mission_image': d.mission_image,
        'home.mission_stat_number': d.mission_stat_number, 'home.mission_stat_label': d.mission_stat_label,
        'home.stats': JSON.stringify(d.stats),
        'home.howitworks_eyebrow': d.howitworks_eyebrow, 'home.howitworks_heading': d.howitworks_heading,
        'home.howitworks_steps': JSON.stringify(d.howitworks_steps),
        'home.testimonials_eyebrow': d.testimonials_eyebrow, 'home.testimonials_heading': d.testimonials_heading,
        'home.testimonials': JSON.stringify(d.testimonials),
        'home.partners_eyebrow': d.partners_eyebrow, 'home.partners_heading': d.partners_heading,
        'home.partners': JSON.stringify(d.partners),
      }),
    })
  }

  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  return (
    <div className="max-w-2xl space-y-8">

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Hero Section</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow text</label><input className={inp} {...field('hero_eyebrow')} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Headline</label><input className={inp} {...field('hero_headline')} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Subtitle</label><textarea rows={3} className={inp} value={d.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} /></div>
          <ImageField label="Background Image" value={d.hero_bg_image} onChange={v => set('hero_bg_image', v)} />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Mission Section</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Pull Quote</label><textarea rows={3} className={inp} value={d.mission_quote} onChange={e => set('mission_quote', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body paragraph 1</label><textarea rows={4} className={inp} value={d.mission_body_1} onChange={e => set('mission_body_1', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body paragraph 2</label><textarea rows={4} className={inp} value={d.mission_body_2} onChange={e => set('mission_body_2', e.target.value)} /></div>
          <ImageField label="Side Image" value={d.mission_image} onChange={v => set('mission_image', v)} />
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-ink mb-1.5">Stat number</label><input className={inp} {...field('mission_stat_number')} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Stat label</label><input className={inp} {...field('mission_stat_label')} /></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Stats Bar</h2>
        <div className={card}>
          <ObjectArrayField
            label="Stats"
            items={d.stats}
            onChange={v => set('stats', v)}
            fields={[
              { key: 'value', label: 'Number', placeholder: '50' },
              { key: 'suffix', label: 'Suffix', placeholder: '+' },
              { key: 'label', label: 'Label', placeholder: 'Members' },
              { key: 'desc', label: 'Description', placeholder: 'Professional exchanges completed' },
            ]}
            itemLabel={(item, i) => item.label || `Stat ${i + 1}`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">How UKACT Works</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} {...field('howitworks_eyebrow')} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} {...field('howitworks_heading')} /></div>
          <ObjectArrayField
            label="Steps"
            items={d.howitworks_steps}
            onChange={v => set('howitworks_steps', v)}
            fields={[
              { key: 'title', label: 'Title', placeholder: 'Register' },
              { key: 'desc', label: 'Description', type: 'textarea', placeholder: 'Step description…' },
            ]}
            itemLabel={(item, i) => item.title || `Step ${i + 1}`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Testimonials</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} {...field('testimonials_eyebrow')} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} {...field('testimonials_heading')} /></div>
          <ObjectArrayField
            label="Testimonials"
            items={d.testimonials}
            onChange={v => set('testimonials', v)}
            fields={[
              { key: 'quote', label: 'Quote', type: 'textarea' },
              { key: 'name', label: 'Name', placeholder: 'Sarah Mitchell' },
              { key: 'role', label: 'Role', placeholder: 'Animal Unit Manager' },
              { key: 'collection', label: 'Collection', placeholder: 'Chester Zoo' },
              { key: 'avatar', label: 'Avatar', type: 'image' },
            ]}
            itemLabel={item => item.name || 'Testimonial'}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Partners Marquee</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} {...field('partners_eyebrow')} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} {...field('partners_heading')} /></div>
          <StringArrayField
            label="Partner names"
            values={d.partners.map(p => p.name)}
            onChange={names => set('partners', names.map(name => ({ name })))}
            placeholder="Chester Zoo"
          />
        </div>
      </section>

      <SaveBar onSave={save} />
    </div>
  )
}
