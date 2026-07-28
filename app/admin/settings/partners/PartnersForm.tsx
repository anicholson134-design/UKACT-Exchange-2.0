'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface Partner { name: string; location: string; specialisms: string[] }
interface PartnersData {
  hero_title: string; hero_subtitle: string; hero_image: string
  list: Partner[]; cta_heading: string; cta_body: string
}

export function PartnersForm({ initial }: { initial: PartnersData }) {
  const [d, setD] = useState<PartnersData>(initial)
  const set = (key: keyof PartnersData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  function updatePartner(i: number, field: keyof Partner, val: string | string[]) {
    set('list', d.list.map((p, idx) => idx === i ? { ...p, [field]: val } : p))
  }
  function removePartner(i: number) { set('list', d.list.filter((_, idx) => idx !== i)) }
  function addPartner() { set('list', [...d.list, { name: '', location: '', specialisms: [] }]) }

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'partners.hero_title': d.hero_title, 'partners.hero_subtitle': d.hero_subtitle, 'partners.hero_image': d.hero_image,
        'partners.list': JSON.stringify(d.list),
        'partners.cta_heading': d.cta_heading, 'partners.cta_body': d.cta_body,
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
        <h2 className="text-base font-semibold text-forest mb-4">Partner Collections</h2>
        <div className="space-y-3">
          {d.list.map((p, i) => (
            <div key={i} className={card + ' !space-y-3'}>
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <input className={inp} value={p.name} onChange={e => updatePartner(i, 'name', e.target.value)} placeholder="Chester Zoo" />
                  <input className={inp} value={p.location} onChange={e => updatePartner(i, 'location', e.target.value)} placeholder="Chester, UK" />
                  <input className={inp}
                    value={(p.specialisms ?? []).join(', ')}
                    onChange={e => updatePartner(i, 'specialisms', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Primates, Large Mammals (comma-separated)"
                  />
                </div>
                <button type="button" onClick={() => removePartner(i)} className="p-2 text-stone hover:text-red-500 mt-1"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addPartner} className="flex items-center gap-1.5 text-sm text-canopy hover:text-forest">
            <Plus className="h-4 w-4" />Add partner
          </button>
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
