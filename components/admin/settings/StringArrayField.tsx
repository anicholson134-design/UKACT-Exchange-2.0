'use client'

import { Plus, Trash2 } from 'lucide-react'

interface Props {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function StringArrayField({ label, values, onChange, placeholder = 'Enter value…' }: Props) {
  function update(i: number, val: string) {
    const next = [...values]
    next[i] = val
    onChange(next)
  }
  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i))
  }
  function add() {
    onChange([...values, ''])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">{label}</label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={v}
              onChange={e => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-stone hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-sm text-canopy hover:text-forest transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add item
        </button>
      </div>
    </div>
  )
}
