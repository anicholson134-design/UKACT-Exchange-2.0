'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { ObjectArrayField } from '@/components/admin/settings/ObjectArrayField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface TeamData {
  hero_title: string; hero_subtitle: string; hero_image: string
  members: Record<string, string>[]; cta_heading: string; cta_body: string
}

export function TeamForm({ initial }: { initial: TeamData }) {
  const [d, setD] = useState<TeamData>(initial)
  const set = (key: keyof TeamData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'team.hero_title': d.hero_title, 'team.hero_subtitle': d.hero_subtitle, 'team.hero_image': d.hero_image,
        'team.members': JSON.stringify(d.members),
        'team.cta_heading': d.cta_heading, 'team.cta_body': d.cta_body,
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
        <h2 className="text-base font-semibold text-forest mb-4">Team Members</h2>
        <div className={card}>
          <ObjectArrayField
            label="Members"
            items={d.members}
            onChange={v => set('members', v)}
            fields={[
              { key: 'name', label: 'Name', placeholder: 'Alice' },
              { key: 'role', label: 'Role / Title', placeholder: 'Director' },
              { key: 'bio', label: 'Bio', type: 'textarea' },
              { key: 'image_url', label: 'Photo URL', placeholder: '/KEEP-Alice-2-768x1032.avif' },
            ]}
            itemLabel={item => item.name || 'Member'}
          />
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Call to Action</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.cta_heading} onChange={e => set('cta_heading', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={3} className={inp} value={d.cta_body} onChange={e => set('cta_body', e.target.value)} /></div>
        </div>
      </section>

      <SaveBar onSave={save} />
    </div>
  )
}
