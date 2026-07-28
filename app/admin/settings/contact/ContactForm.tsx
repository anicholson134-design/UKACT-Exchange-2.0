'use client'

import { useState } from 'react'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface ContactData {
  hero_heading: string; hero_body: string
  email: string; location: string; response_time: string
}

export function ContactForm({ initial }: { initial: ContactData }) {
  const [d, setD] = useState<ContactData>(initial)
  const set = (key: keyof ContactData, val: string) => setD(prev => ({ ...prev, [key]: val }))
  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'contact.hero_heading': d.hero_heading, 'contact.hero_body': d.hero_body,
        'contact.email': d.email, 'contact.location': d.location, 'contact.response_time': d.response_time,
      }),
    })
  }

  return (
    <div className="max-w-lg space-y-8">
      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Hero</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.hero_heading} onChange={e => set('hero_heading', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={3} className={inp} value={d.hero_body} onChange={e => set('hero_body', e.target.value)} /></div>
        </div>
      </section>
      <section>
        <h2 className="text-base font-semibold text-forest mb-4">Contact Details</h2>
        <div className={card}>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Email address</label><input className={inp} type="email" value={d.email} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Location</label><input className={inp} value={d.location} onChange={e => set('location', e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-ink mb-1.5">Response time</label><input className={inp} value={d.response_time} onChange={e => set('response_time', e.target.value)} /></div>
        </div>
      </section>
      <SaveBar onSave={save} />
    </div>
  )
}
