'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BlockEditor, type Block } from '@/components/cms/BlockEditor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Globe, Archive, FileText, Eye, Save, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const NAV_GROUPS = [
  { value: '', label: 'No group (top level)' },
  { value: 'about', label: 'About dropdown' },
  { value: 'sectors', label: 'Sectors dropdown' },
  { value: 'listings', label: 'Listings dropdown' },
]

interface PageData {
  id?: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  hero_image: string
  hero_title: string
  hero_subtitle: string
  meta_description: string
  content: Block[]
  show_in_nav: boolean
  nav_label: string
  nav_group: string
  nav_order: number
}

interface PageFormProps {
  initialData?: Partial<PageData>
}

export function PageForm({ initialData }: PageFormProps) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [form, setForm] = useState<PageData>({
    id: initialData?.id,
    slug: initialData?.slug ?? '',
    title: initialData?.title ?? '',
    status: initialData?.status ?? 'draft',
    hero_image: initialData?.hero_image ?? '',
    hero_title: initialData?.hero_title ?? '',
    hero_subtitle: initialData?.hero_subtitle ?? '',
    meta_description: initialData?.meta_description ?? '',
    content: (initialData?.content as Block[]) ?? [],
    show_in_nav: initialData?.show_in_nav ?? false,
    nav_label: initialData?.nav_label ?? '',
    nav_group: initialData?.nav_group ?? '',
    nav_order: initialData?.nav_order ?? 99,
  })

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function set(key: keyof PageData, val: any) {
    setForm(f => ({ ...f, [key]: val }))
  }

  // Auto-generate slug from title when creating
  function handleTitleChange(val: string) {
    set('title', val)
    if (!isEdit && !form.slug) {
      set('slug', val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  async function handleSave(status?: 'draft' | 'published' | 'archived') {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }

    setSaving(true)
    const payload = { ...form, status: status ?? form.status }

    const url = isEdit ? `/api/cms/pages/${form.id}` : '/api/cms/pages'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error?.fieldErrors ? 'Check your form fields' : (data.error ?? 'Failed to save'))
    } else {
      toast.success(status === 'published' ? 'Page published!' : 'Page saved')
      if (!isEdit) router.push(`/admin/cms/${data.id}`)
      else router.refresh()
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this page permanently? This cannot be undone.')) return
    setDeleting(true)
    const res = await fetch(`/api/cms/pages/${form.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Page deleted')
      router.push('/admin/cms')
    } else {
      toast.error('Failed to delete')
    }
    setDeleting(false)
  }

  const fieldClass = "w-full px-3 py-2.5 rounded-xl border border-stone/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all"

  return (
    <div className="max-w-5xl space-y-8">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            form.status === 'published' ? 'bg-green-100 text-green-800' :
            form.status === 'archived' ? 'bg-gray-100 text-gray-600' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {form.status === 'published' ? <Globe className="h-3 w-3" /> :
             form.status === 'archived' ? <Archive className="h-3 w-3" /> :
             <FileText className="h-3 w-3" />}
            {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
          </span>
          {form.status === 'published' && form.slug && (
            <Link href={`/p/${form.slug}`} target="_blank" className="flex items-center gap-1 text-xs text-canopy hover:text-gold transition-colors">
              <ExternalLink className="h-3 w-3" /> View live
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEdit && form.status !== 'archived' && (
            <Button variant="outline" size="sm" onClick={() => handleSave('archived')} disabled={saving}>
              <Archive className="h-4 w-4 mr-1.5" />Archive
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave('draft')} disabled={saving}>
            <Save className="h-4 w-4 mr-1.5" />Save draft
          </Button>
          <Button onClick={() => handleSave('published')} disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white">
            <Globe className="h-4 w-4 mr-1.5" />
            {saving ? 'Saving…' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">

        {/* Main content — 2 cols */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title + slug */}
          <div className="space-y-4 bg-white rounded-2xl border border-stone/20 p-6">
            <div className="space-y-2">
              <Label>Page title *</Label>
              <input
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Conservation in Practice"
                className={fieldClass + ' text-lg font-semibold'}
              />
            </div>
            <div className="space-y-2">
              <Label>URL slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/40 shrink-0">/p/</span>
                <input
                  value={form.slug}
                  onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="conservation-in-practice"
                  className={fieldClass + ' font-mono'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meta description</Label>
              <textarea rows={2} value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                placeholder="Brief description for search engines (150–160 characters)"
                className={fieldClass + ' resize-none'} />
            </div>
          </div>

          {/* Hero section */}
          <div className="space-y-4 bg-white rounded-2xl border border-stone/20 p-6">
            <h3 className="font-semibold text-forest">Hero section</h3>
            <div className="space-y-2">
              <Label>Background image URL</Label>
              <input value={form.hero_image} onChange={e => set('hero_image', e.target.value)}
                placeholder="https://… or /public/your-image.jpg"
                className={fieldClass} />
              {form.hero_image && (
                <img src={form.hero_image} alt="" className="h-24 w-full object-cover rounded-xl" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Hero title</Label>
              <input value={form.hero_title} onChange={e => set('hero_title', e.target.value)}
                placeholder="Large headline over the hero image"
                className={fieldClass} />
            </div>
            <div className="space-y-2">
              <Label>Hero subtitle</Label>
              <input value={form.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)}
                placeholder="Supporting text under the headline"
                className={fieldClass} />
            </div>
          </div>

          {/* Page content blocks */}
          <div className="space-y-4 bg-white rounded-2xl border border-stone/20 p-6">
            <h3 className="font-semibold text-forest">Page content</h3>
            <p className="text-sm text-ink/50">Add blocks to build the page body. Drag to reorder.</p>
            <BlockEditor value={form.content} onChange={blocks => set('content', blocks)} />
          </div>
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-4">

          {/* Navigation */}
          <div className="bg-white rounded-2xl border border-stone/20 p-5 space-y-4">
            <h3 className="font-semibold text-forest text-sm">Navigation</h3>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.show_in_nav}
                onChange={e => set('show_in_nav', e.target.checked)}
                className="w-4 h-4 accent-canopy"
              />
              <span className="text-sm">Show in navigation</span>
            </label>

            {form.show_in_nav && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Nav label</Label>
                  <input value={form.nav_label} onChange={e => set('nav_label', e.target.value)}
                    placeholder={form.title || 'Nav item label'}
                    className={fieldClass} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Nav group</Label>
                  <select value={form.nav_group} onChange={e => set('nav_group', e.target.value)}
                    className={fieldClass}>
                    {NAV_GROUPS.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Order (lower = first)</Label>
                  <input type="number" value={form.nav_order} onChange={e => set('nav_order', parseInt(e.target.value))}
                    className={fieldClass} />
                </div>
              </>
            )}
          </div>

          {/* Quick publish */}
          <div className="bg-white rounded-2xl border border-stone/20 p-5 space-y-3">
            <h3 className="font-semibold text-forest text-sm">Publish status</h3>
            {(['draft', 'published', 'archived'] as const).map(s => (
              <label key={s} className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="status" value={s} checked={form.status === s}
                  onChange={() => set('status', s)} className="accent-canopy" />
                <span className="text-sm capitalize">{s}</span>
              </label>
            ))}
          </div>

          {/* Danger zone */}
          {isEdit && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-5 space-y-3">
              <h3 className="font-semibold text-red-700 text-sm">Danger zone</h3>
              <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4 mr-1.5" />
                {deleting ? 'Deleting…' : 'Delete page permanently'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
