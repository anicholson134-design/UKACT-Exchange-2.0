'use client'

import { useState } from 'react'
import { SaveBar } from '@/components/admin/settings/SaveBar'
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  visible: boolean
}

interface Props {
  initial: {
    items: NavItem[]
    custom: NavItem[]
  }
}

export function NavForm({ initial }: Props) {
  const [items, setItems] = useState<NavItem[]>(initial.items)
  const [custom, setCustom] = useState<NavItem[]>(initial.custom)
  const [dragging, setDragging] = useState<number | null>(null)

  function toggleVisible(i: number) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, visible: !it.visible } : it))
  }

  function moveItem(from: number, to: number) {
    setItems(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  function addCustom() {
    setCustom(prev => [...prev, { label: '', href: '', visible: true }])
  }

  function updateCustom(i: number, field: keyof NavItem, val: string | boolean) {
    setCustom(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it))
  }

  function removeCustom(i: number) {
    setCustom(prev => prev.filter((_, idx) => idx !== i))
  }

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'nav.items': JSON.stringify(items),
        'nav.custom': JSON.stringify(custom),
      }),
    })
  }

  const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'

  return (
    <div className="max-w-xl space-y-8">
      {/* Built-in nav items */}
      <section>
        <h2 className="text-base font-semibold text-forest mb-1">Main navigation</h2>
        <p className="text-xs text-stone mb-4">Toggle items on/off and drag to reorder. Dropdown sub-items are managed automatically.</p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={item.label}
              draggable
              onDragStart={() => setDragging(i)}
              onDragOver={e => { e.preventDefault() }}
              onDrop={() => { if (dragging !== null && dragging !== i) { moveItem(dragging, i); setDragging(null) } }}
              onDragEnd={() => setDragging(null)}
              className={`flex items-center gap-3 bg-white rounded-xl border border-stone/20 px-4 py-3 cursor-grab transition-opacity ${dragging === i ? 'opacity-40' : ''}`}
            >
              <GripVertical className="h-4 w-4 text-stone/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-forest">{item.label}</p>
                <p className="text-xs text-stone font-mono truncate">{item.href}</p>
              </div>
              <button
                onClick={() => toggleVisible(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  item.visible
                    ? 'bg-canopy/10 text-canopy hover:bg-canopy/20'
                    : 'bg-stone/10 text-stone hover:bg-stone/20'
                }`}
              >
                {item.visible
                  ? <><Eye className="h-3.5 w-3.5" /> Visible</>
                  : <><EyeOff className="h-3.5 w-3.5" /> Hidden</>}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Custom links */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-forest">Custom links</h2>
            <p className="text-xs text-stone mt-0.5">Add extra top-level links to the nav bar.</p>
          </div>
          <button
            onClick={addCustom}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-canopy text-cream rounded-lg text-sm font-medium hover:bg-forest transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add link
          </button>
        </div>

        {custom.length === 0 && (
          <p className="text-sm text-stone text-center py-6 bg-white rounded-xl border border-stone/20 border-dashed">
            No custom links yet. Click &ldquo;Add link&rdquo; to create one.
          </p>
        )}

        <div className="space-y-3">
          {custom.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone">Custom link {i + 1}</span>
                <button onClick={() => removeCustom(i)} className="text-stone hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">Label</label>
                  <input className={inp} value={item.label} placeholder="Blog" onChange={e => updateCustom(i, 'label', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">URL</label>
                  <input className={inp} value={item.href} placeholder="/blog" onChange={e => updateCustom(i, 'href', e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={e => updateCustom(i, 'visible', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-ink">Visible in nav</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <SaveBar onSave={save} />
    </div>
  )
}
