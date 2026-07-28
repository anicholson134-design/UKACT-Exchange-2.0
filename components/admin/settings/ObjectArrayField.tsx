'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export interface FieldDef {
  key: string
  label: string
  type?: 'text' | 'textarea' | 'image'
  placeholder?: string
}

interface Props {
  label: string
  items: Record<string, string>[]
  fields: FieldDef[]
  onChange: (items: Record<string, string>[]) => void
  newItem?: Record<string, string>
  itemLabel?: (item: Record<string, string>, i: number) => string
}

export function ObjectArrayField({ label, items, fields, onChange, newItem, itemLabel }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  function update(i: number, key: string, val: string) {
    const next = items.map((item, idx) => idx === i ? { ...item, [key]: val } : item)
    onChange(next)
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
    if (open === i) setOpen(null)
  }

  function add() {
    const blank = newItem ?? Object.fromEntries(fields.map(f => [f.key, '']))
    onChange([...items, blank])
    setOpen(items.length)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-stone/20 rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 bg-sand/30 cursor-pointer select-none"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-sm font-medium text-forest">
                {itemLabel ? itemLabel(item, i) : item[fields[0]?.key] || `Item ${i + 1}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); remove(i) }}
                  className="p-1 text-stone hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {open === i ? <ChevronUp className="h-4 w-4 text-stone" /> : <ChevronDown className="h-4 w-4 text-stone" />}
              </div>
            </div>

            {open === i && (
              <div className="px-4 py-4 space-y-3 bg-white">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium text-ink/60 mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={item[f.key] ?? ''}
                        onChange={e => update(i, f.key, e.target.value)}
                        rows={3}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30 resize-y"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item[f.key] ?? ''}
                        onChange={e => update(i, f.key, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-sm text-canopy hover:text-forest transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add {label.toLowerCase().replace(/s$/, '')}
        </button>
      </div>
    </div>
  )
}
