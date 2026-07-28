'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { StringArrayField } from '@/components/admin/settings/StringArrayField'
import { ObjectArrayField } from '@/components/admin/settings/ObjectArrayField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface JoiningData {
  hero_title: string; hero_subtitle: string; hero_image: string
  keeper_benefits: string[]; collection_benefits: string[]
  steps: Record<string, string>[]; faqs: Record<string, string>[]
}

export function JoiningForm({ initial }: { initial: JoiningData }) {
  const [d, setD] = useState<JoiningData>(initial)
  const set = (key: keyof JoiningData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'joining.hero_title': d.hero_title, 'joining.hero_subtitle': d.hero_subtitle, 'joining.hero_image': d.hero_image,
        'joining.keeper_benefits': JSON.stringify(d.keeper_benefits),
        'joining.collection_benefits': JSON.stringify(d.collection_benefits),
        'joining.steps': JSON.stringify(d.steps),
        'joining.faqs': JSON.stringify(d.faqs),
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
        <h2 className="text-base font-semibold text-forest mb-4">Keeper Benefits</h2>
        <div className={card}>
          <StringArrayField label="Benefits (for keepers)" values={d.keeper_benefits} onChange={v => set('keeper_benefits', v)} placeholder="Access to placements at 80+ collections" />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Collection Benefits</h2>
        <div className={card}>
          <StringArrayField label="Benefits (for collections)" values={d.collection_benefits} onChange={v => set('collection_benefits', v)} placeholder="Host motivated keepers" />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">How to Join Steps</h2>
        <div className={card}>
          <ObjectArrayField
            label="Steps"
            items={d.steps}
            onChange={v => set('steps', v)}
            fields={[
              { key: 'title', label: 'Title', placeholder: 'Register' },
              { key: 'desc', label: 'Description', type: 'textarea' },
            ]}
            itemLabel={(item, i) => item.title || `Step ${i + 1}`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">FAQs</h2>
        <div className={card}>
          <ObjectArrayField
            label="FAQs"
            items={d.faqs}
            onChange={v => set('faqs', v)}
            fields={[
              { key: 'q', label: 'Question', placeholder: 'Who can apply?' },
              { key: 'a', label: 'Answer', type: 'textarea' },
            ]}
            itemLabel={item => item.q || 'FAQ'}
          />
        </div>
      </section>

      <SaveBar onSave={save} />
    </div>
  )
}
