'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface AuthPanelData {
  login_image: string; login_quote: string; login_quote_author: string
  candidate_image: string; candidate_quote: string; candidate_quote_author: string
  employer_image: string; employer_quote: string; employer_quote_author: string
}

export function AuthPanelForm({ initial }: { initial: AuthPanelData }) {
  const [d, setD] = useState<AuthPanelData>(initial)
  const set = (key: keyof AuthPanelData, val: string) => setD(prev => ({ ...prev, [key]: val }))

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'auth.login_image': d.login_image,
        'auth.login_quote': d.login_quote,
        'auth.login_quote_author': d.login_quote_author,
        'auth.candidate_image': d.candidate_image,
        'auth.candidate_quote': d.candidate_quote,
        'auth.candidate_quote_author': d.candidate_quote_author,
        'auth.employer_image': d.employer_image,
        'auth.employer_quote': d.employer_quote,
        'auth.employer_quote_author': d.employer_quote_author,
      }),
    })
  }

  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
  const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

  const sections: { heading: string; imgKey: keyof AuthPanelData; quoteKey: keyof AuthPanelData; authorKey: keyof AuthPanelData; desc: string }[] = [
    { heading: 'Sign In', imgKey: 'login_image', quoteKey: 'login_quote', authorKey: 'login_quote_author', desc: 'Shown beside the login form.' },
    { heading: 'Candidate Sign Up', imgKey: 'candidate_image', quoteKey: 'candidate_quote', authorKey: 'candidate_quote_author', desc: 'Shown beside the member registration form.' },
    { heading: 'Collection Sign Up', imgKey: 'employer_image', quoteKey: 'employer_quote', authorKey: 'employer_quote_author', desc: 'Shown beside the collection registration form.' },
  ]

  return (
    <div className="max-w-2xl space-y-8">
      <p className="text-sm text-stone">
        The image and quote shown on the panel beside each of these forms.
      </p>

      {sections.map(sec => (
        <section key={sec.heading}>
          <h2 className="text-base font-semibold text-forest mb-1">{sec.heading}</h2>
          <p className="text-xs text-stone mb-4">{sec.desc}</p>
          <div className={card}>
            <ImageField label="Background image" value={d[sec.imgKey]} onChange={v => set(sec.imgKey, v)} />
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Quote</label>
              <textarea
                rows={3}
                className={inp}
                value={d[sec.quoteKey]}
                onChange={e => set(sec.quoteKey, e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Attribution</label>
              <input
                className={inp}
                value={d[sec.authorKey]}
                onChange={e => set(sec.authorKey, e.target.value)}
                placeholder="Name, role, collection"
              />
            </div>
          </div>
        </section>
      ))}

      <SaveBar onSave={save} />
    </div>
  )
}
