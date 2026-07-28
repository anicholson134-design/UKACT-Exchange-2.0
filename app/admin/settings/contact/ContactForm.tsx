'use client'

import { useState } from 'react'
import { SaveBar } from '@/components/admin/settings/SaveBar'
import { SectionBlocksField, type BlockTypeDef } from '@/components/admin/settings/SectionBlocksField'
import { Image as ImageIcon, MessageSquare } from 'lucide-react'

interface ContactData {
  blocks: string[]
  hero_heading: string; hero_body: string
  email: string; location: string; response_time: string
}

const CATALOG: BlockTypeDef[] = [
  { type: 'hero', label: 'Hero', desc: 'Heading and body text', icon: ImageIcon },
  { type: 'details_form', label: 'Contact Details & Form', desc: 'Contact info and enquiry form', icon: MessageSquare },
]

export function ContactForm({ initial }: { initial: ContactData }) {
  const [d, setD] = useState<ContactData>(initial)
  const set = (key: keyof ContactData, val: unknown) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'contact.blocks': JSON.stringify(d.blocks),
        'contact.hero_heading': d.hero_heading, 'contact.hero_body': d.hero_body,
        'contact.email': d.email, 'contact.location': d.location, 'contact.response_time': d.response_time,
      }),
    })
  }

  const sections: Record<string, React.ReactNode> = {
    hero: (
      <section key="hero">
        <h2 className="text-base font-semibold text-forest mb-4">Hero</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.hero_heading} onChange={e => set('hero_heading', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={3} className={inp} value={d.hero_body} onChange={e => set('hero_body', e.target.value)} /></div>
        </div>
      </section>
    ),
    details_form: (
      <section key="details_form">
        <h2 className="text-base font-semibold text-forest mb-4">Contact Details</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Email address</label><input className={inp} type="email" value={d.email} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Location</label><input className={inp} value={d.location} onChange={e => set('location', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Response time</label><input className={inp} value={d.response_time} onChange={e => set('response_time', e.target.value)} /></div>
        </div>
      </section>
    ),
  }

  return (
    <div className="max-w-lg space-y-8">
      <SectionBlocksField catalog={CATALOG} value={d.blocks} onChange={v => set('blocks', v)} />

      {d.blocks.map(type => sections[type] ?? null)}

      <SaveBar onSave={save} />
    </div>
  )
}
