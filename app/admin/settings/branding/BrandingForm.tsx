'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/settings/ImageField'
import { SaveBar } from '@/components/admin/settings/SaveBar'

interface Props {
  initial: { logo_url: string; site_name: string }
}

export function BrandingForm({ initial }: Props) {
  const [logo, setLogo] = useState(initial.logo_url)
  const [name, setName] = useState(initial.site_name)

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'branding.logo_url': logo, 'branding.site_name': name }),
    })
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-base font-semibold text-forest mb-1">Branding</h2>
        <p className="text-sm text-stone">The logo and site name appear across every page.</p>
      </div>
      <div className="bg-white rounded-xl border border-stone/20 p-6 space-y-5">
        <ImageField label="Site Logo" value={logo} onChange={setLogo} />
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">Site Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30"
          />
        </div>
      </div>
      <SaveBar onSave={save} />
    </div>
  )
}
