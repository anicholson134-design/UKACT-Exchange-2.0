'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, type LucideIcon } from 'lucide-react'

export interface BlockTypeDef {
  type: string
  label: string
  desc: string
  icon: LucideIcon
}

interface Props {
  catalog: BlockTypeDef[]
  value: string[]
  onChange: (next: string[]) => void
}

/** Manages which sections from the shared block library appear on this page, in what order — types can repeat. */
export function SectionBlocksField({ catalog, value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const byType = Object.fromEntries(catalog.map(b => [b.type, b]))

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function add(type: string) {
    onChange([...value, type])
    setShowPicker(false)
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="bg-white rounded-xl border border-stone/20 p-6 space-y-3">
      <div>
        <h2 className="text-base font-semibold text-forest">Page Sections</h2>
        <p className="text-xs text-stone mt-0.5">Add, remove or reorder the sections on this page. Any section can be added more than once.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {value.map((type, i) => {
          const def = byType[type]
          if (!def) return null
          return (
            <motion.div
              key={`${type}-${i}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-stone/20 bg-mist/40"
            >
              <GripVertical className="h-4 w-4 text-stone shrink-0" />
              <def.icon className="h-4 w-4 text-moss shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-forest truncate">{def.label}</p>
                <p className="text-xs text-ink/40 truncate">{def.desc}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="p-1 rounded hover:bg-stone/20 disabled:opacity-30 transition-colors">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1}
                  className="p-1 rounded hover:bg-stone/20 disabled:opacity-30 transition-colors">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => remove(i)}
                  className="p-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {!value.length && (
        <p className="text-sm text-ink/40 text-center py-4">No sections — add one below.</p>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(v => !v)}
          disabled={!catalog.length}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-stone/30 text-sm text-ink/50 hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all disabled:opacity-40 disabled:hover:border-stone/30 disabled:hover:text-ink/50 disabled:hover:bg-transparent"
        >
          <Plus className="h-4 w-4" /> Add section
        </button>

        <AnimatePresence>
          {showPicker && catalog.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-stone/20 p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 z-20 max-h-96 overflow-y-auto"
            >
              {catalog.map(bt => (
                <button
                  key={bt.type}
                  type="button"
                  onClick={() => add(bt.type)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-mist transition-colors text-center"
                >
                  <bt.icon className="h-5 w-5 text-moss" strokeWidth={1.5} />
                  <span className="text-xs font-medium text-forest">{bt.label}</span>
                  <span className="text-[10px] text-ink/40">{bt.desc}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
