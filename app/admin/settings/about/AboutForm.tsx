'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { ObjectArrayField } from '@/components/admin/settings/ObjectArrayField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface AboutData {
  hero_title: string; hero_subtitle: string; hero_image: string
  intro_eyebrow: string; intro_heading: string; intro_body_1: string; intro_body_2: string
  timeline: Record<string, string>[]; stats: Record<string, string>[]; values: Record<string, string>[]
}

export function AboutForm({ initial }: { initial: AboutData }) {
  const [d, setD] = useState<AboutData>(initial)
  const set = (key: keyof AboutData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'about.hero_title': d.hero_title, 'about.hero_subtitle': d.hero_subtitle, 'about.hero_image': d.hero_image,
        'about.intro_eyebrow': d.intro_eyebrow, 'about.intro_heading': d.intro_heading,
        'about.intro_body_1': d.intro_body_1, 'about.intro_body_2': d.intro_body_2,
        'about.timeline': JSON.stringify(d.timeline),
        'about.stats': JSON.stringify(d.stats),
        'about.values': JSON.stringify(d.values),
      }),
    })
  }

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Hero</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Title</label><input className={inp} value={d.hero_title} onChange={e => set('hero_title', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Subtitle</label><textarea rows={2} className={inp} value={d.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} /></div>
          <ImageField label="Hero Image" value={d.hero_image} onChange={v => set('hero_image', v)} />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Introduction</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} value={d.intro_eyebrow} onChange={e => set('intro_eyebrow', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.intro_heading} onChange={e => set('intro_heading', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body paragraph 1</label><textarea rows={4} className={inp} value={d.intro_body_1} onChange={e => set('intro_body_1', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body paragraph 2</label><textarea rows={4} className={inp} value={d.intro_body_2} onChange={e => set('intro_body_2', e.target.value)} /></div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Stats Band</h2>
        <div className={card}>
          <ObjectArrayField
            label="Stats"
            items={d.stats}
            onChange={v => set('stats', v)}
            fields={[
              { key: 'number', label: 'Number', placeholder: '1,200+' },
              { key: 'label', label: 'Label', placeholder: 'Keepers Placed' },
            ]}
            itemLabel={item => item.label || 'Stat'}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Timeline</h2>
        <div className={card}>
          <ObjectArrayField
            label="Timeline events"
            items={d.timeline}
            onChange={v => set('timeline', v)}
            fields={[
              { key: 'year', label: 'Year', placeholder: '2014' },
              { key: 'title', label: 'Title', placeholder: 'KEEP Founded' },
              { key: 'desc', label: 'Description', type: 'textarea' },
            ]}
            itemLabel={item => `${item.year ?? ''} – ${item.title ?? ''}`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Values</h2>
        <div className={card}>
          <ObjectArrayField
            label="Values"
            items={d.values}
            onChange={v => set('values', v)}
            fields={[
              { key: 'emoji', label: 'Emoji', placeholder: '🌿' },
              { key: 'title', label: 'Title', placeholder: 'Conservation First' },
              { key: 'desc', label: 'Description', type: 'textarea' },
            ]}
            itemLabel={item => `${item.emoji ?? ''} ${item.title ?? ''}`}
          />
        </div>
      </section>

      <SaveBar onSave={save} />
    </div>
  )
}
