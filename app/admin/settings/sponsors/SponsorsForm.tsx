'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface Tier { tier: string; sponsors: { name: string }[] }
interface SponsorsData {
  hero_title: string; hero_subtitle: string; hero_image: string
  body: string; tiers: Tier[]; cta_heading: string; cta_body: string
}

export function SponsorsForm({ initial }: { initial: SponsorsData }) {
  const [d, setD] = useState<SponsorsData>(initial)
  const set = (key: keyof SponsorsData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  function updateTierName(i: number, name: string) {
    const tiers = d.tiers.map((t, idx) => idx === i ? { ...t, tier: name } : t)
    set('tiers', tiers)
  }
  function updateSponsorName(ti: number, si: number, name: string) {
    const tiers = d.tiers.map((t, idx) => idx === ti
      ? { ...t, sponsors: t.sponsors.map((s, sidx) => sidx === si ? { name } : s) }
      : t)
    set('tiers', tiers)
  }
  function addSponsor(ti: number) {
    const tiers = d.tiers.map((t, idx) => idx === ti ? { ...t, sponsors: [...t.sponsors, { name: '' }] } : t)
    set('tiers', tiers)
  }
  function removeSponsor(ti: number, si: number) {
    const tiers = d.tiers.map((t, idx) => idx === ti
      ? { ...t, sponsors: t.sponsors.filter((_, sidx) => sidx !== si) }
      : t)
    set('tiers', tiers)
  }
  function addTier() { set('tiers', [...d.tiers, { tier: 'New Tier', sponsors: [] }]) }
  function removeTier(i: number) { set('tiers', d.tiers.filter((_, idx) => idx !== i)) }

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'sponsors.hero_title': d.hero_title, 'sponsors.hero_subtitle': d.hero_subtitle, 'sponsors.hero_image': d.hero_image,
        'sponsors.body': d.body, 'sponsors.tiers': JSON.stringify(d.tiers),
        'sponsors.cta_heading': d.cta_heading, 'sponsors.cta_body': d.cta_body,
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
          <div><label className="block text-sm font-medium text-ink mb-1.5">Intro body</label><textarea rows={3} className={inp} value={d.body} onChange={e => set('body', e.target.value)} /></div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Sponsor Tiers</h2>
        <div className="space-y-4">
          {d.tiers.map((tier, ti) => (
            <div key={ti} className={card + ' !space-y-3'}>
              <div className="flex items-center gap-3">
                <input className={inp} value={tier.tier} onChange={e => updateTierName(ti, e.target.value)} placeholder="Tier name" />
                <button type="button" onClick={() => removeTier(ti)} className="p-2 text-stone hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2 pl-2">
                {tier.sponsors.map((s, si) => (
                  <div key={si} className="flex gap-2">
                    <input className={inp} value={s.name} onChange={e => updateSponsorName(ti, si, e.target.value)} placeholder="Sponsor name" />
                    <button type="button" onClick={() => removeSponsor(ti, si)} className="p-2 text-stone hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addSponsor(ti)} className="flex items-center gap-1.5 text-sm text-canopy hover:text-forest">
                  <Plus className="h-3.5 w-3.5" />Add sponsor
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addTier} className="flex items-center gap-1.5 text-sm text-canopy hover:text-forest">
            <Plus className="h-4 w-4" />Add tier
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
