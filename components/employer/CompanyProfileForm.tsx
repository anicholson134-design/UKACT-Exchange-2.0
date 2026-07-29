'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageField } from '@/components/admin/settings/ImageField'

interface CompanyProfileData {
  company_name: string
  logo_url: string
  description: string
  website: string
  location: string
}

export function CompanyProfileForm({ initial }: { initial: CompanyProfileData }) {
  const router = useRouter()
  const [d, setD] = useState(initial)
  const [loading, setLoading] = useState(false)
  const set = (key: keyof CompanyProfileData, val: string) => setD(prev => ({ ...prev, [key]: val }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/employer/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    })
    const result = await res.json()
    if (!res.ok) {
      toast.error(result.error ?? 'Failed to save profile')
    } else {
      toast.success('Collection profile updated')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <ImageField label="Collection logo" value={d.logo_url} onChange={v => set('logo_url', v)} />
        <p className="text-xs text-muted-foreground">
          Shown on your placement adverts across the site.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Collection name *</Label>
        <Input id="company_name" value={d.company_name} onChange={e => set('company_name', e.target.value)} required minLength={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">About your collection</Label>
        <textarea
          id="description"
          value={d.description}
          onChange={e => set('description', e.target.value)}
          rows={6}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          placeholder="A short description shown to candidates on your placement listings…"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" value={d.website} onChange={e => set('website', e.target.value)} placeholder="https://…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Address</Label>
          <Input id="location" value={d.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Chester Zoo, Cedar House, Chester, CH2 1LH" />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
