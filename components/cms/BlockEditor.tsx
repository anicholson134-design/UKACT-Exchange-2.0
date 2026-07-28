'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, GripVertical, Type, Image as ImageIcon, AlignLeft, Columns, Megaphone, Minus, Upload, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface Block {
  id: string
  type: 'heading' | 'text' | 'image' | 'two_col' | 'cta' | 'divider' | 'stats'
  data: Record<string, any>
}

const blockTypes = [
  { type: 'heading', label: 'Heading', icon: Type, desc: 'Section title' },
  { type: 'text', label: 'Text', icon: AlignLeft, desc: 'Paragraph of text' },
  { type: 'image', label: 'Image', icon: ImageIcon, desc: 'Full-width image' },
  { type: 'two_col', label: 'Two columns', icon: Columns, desc: 'Text + image side by side' },
  { type: 'cta', label: 'Call to action', icon: Megaphone, desc: 'Button with headline' },
  { type: 'stats', label: 'Stats row', icon: Type, desc: 'Up to 4 statistics' },
  { type: 'divider', label: 'Divider', icon: Minus, desc: 'Horizontal rule' },
] as const

function newBlock(type: Block['type']): Block {
  const id = Math.random().toString(36).slice(2)
  const defaults: Record<Block['type'], Record<string, any>> = {
    heading: { text: 'New heading', level: 'h2' },
    text: { text: 'Write your content here…' },
    image: { src: '', alt: '', caption: '' },
    two_col: { left_text: 'Write text here…', right_image: '', right_alt: '' },
    cta: { title: 'Ready to get started?', body: '', button_label: 'Get started', button_href: '/joining-keep' },
    stats: { items: [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }] },
    divider: {},
  }
  return { id, type, data: defaults[type] }
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/cms/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) toast.error(data.error ?? 'Upload failed')
    else { onChange(data.url); toast.success('Image uploaded') }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste image URL or upload below"
        className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-stone/30 hover:bg-mist transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        {value && <img src={value} alt="" className="h-8 w-12 object-cover rounded" />}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}

function BlockEditor_({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  block: Block
  onChange: (data: Record<string, any>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const update = (key: string, val: any) => onChange({ ...block.data, [key]: val })

  return (
    <div className="group border border-stone/20 rounded-xl overflow-hidden bg-white">
      {/* Block header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-mist border-b border-stone/20">
        <GripVertical className="h-4 w-4 text-stone shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider text-ink/50 flex-1">
          {blockTypes.find(t => t.type === block.type)?.label ?? block.type}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded hover:bg-stone/20 disabled:opacity-30 transition-colors">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded hover:bg-stone/20 disabled:opacity-30 transition-colors">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 hover:text-red-600 transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Block fields */}
      <div className="p-4 space-y-3">
        {block.type === 'heading' && (
          <div className="space-y-2">
            <div className="flex gap-2">
              {(['h1', 'h2', 'h3'] as const).map(l => (
                <button key={l} onClick={() => update('level', l)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${block.data.level === l ? 'bg-canopy text-cream' : 'border border-stone/30 hover:bg-mist'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <input type="text" value={block.data.text ?? ''} onChange={e => update('text', e.target.value)}
              placeholder="Heading text"
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30" />
          </div>
        )}

        {block.type === 'text' && (
          <textarea rows={5} value={block.data.text ?? ''} onChange={e => update('text', e.target.value)}
            placeholder="Write your text here…"
            className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-y" />
        )}

        {block.type === 'image' && (
          <>
            <label className="text-xs font-medium text-ink/60">Image</label>
            <ImageUploader value={block.data.src ?? ''} onChange={v => update('src', v)} />
            <input type="text" value={block.data.alt ?? ''} onChange={e => update('alt', e.target.value)}
              placeholder="Alt text (for accessibility)"
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
            <input type="text" value={block.data.caption ?? ''} onChange={e => update('caption', e.target.value)}
              placeholder="Caption (optional)"
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
          </>
        )}

        {block.type === 'two_col' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink/60">Left — text</label>
              <textarea rows={5} value={block.data.left_text ?? ''} onChange={e => update('left_text', e.target.value)}
                placeholder="Left column text"
                className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-y" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink/60">Right — image</label>
              <ImageUploader value={block.data.right_image ?? ''} onChange={v => update('right_image', v)} />
              <input type="text" value={block.data.right_alt ?? ''} onChange={e => update('right_alt', e.target.value)}
                placeholder="Image alt text"
                className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
            </div>
          </div>
        )}

        {block.type === 'cta' && (
          <>
            <input type="text" value={block.data.title ?? ''} onChange={e => update('title', e.target.value)}
              placeholder="Headline"
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gold/30" />
            <textarea rows={2} value={block.data.body ?? ''} onChange={e => update('body', e.target.value)}
              placeholder="Supporting text (optional)"
              className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={block.data.button_label ?? ''} onChange={e => update('button_label', e.target.value)}
                placeholder="Button label"
                className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
              <input type="text" value={block.data.button_href ?? ''} onChange={e => update('button_href', e.target.value)}
                placeholder="Button link (e.g. /joining-keep)"
                className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
            </div>
          </>
        )}

        {block.type === 'stats' && (
          <div className="grid grid-cols-2 gap-3">
            {(block.data.items ?? []).map((item: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <input type="text" value={item.value ?? ''} onChange={e => {
                  const items = [...block.data.items]
                  items[i] = { ...items[i], value: e.target.value }
                  update('items', items)
                }} placeholder={`Stat ${i + 1} value (e.g. 1,200+)`}
                  className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gold/30" />
                <input type="text" value={item.label ?? ''} onChange={e => {
                  const items = [...block.data.items]
                  items[i] = { ...items[i], label: e.target.value }
                  update('items', items)
                }} placeholder={`Stat ${i + 1} label (e.g. Keepers placed)`}
                  className="w-full px-3 py-2 rounded-lg border border-stone/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
              </div>
            ))}
          </div>
        )}

        {block.type === 'divider' && (
          <p className="text-xs text-ink/40 text-center">— Divider —</p>
        )}
      </div>
    </div>
  )
}

export function BlockEditor({ value, onChange }: { value: Block[]; onChange: (blocks: Block[]) => void }) {
  const [showPicker, setShowPicker] = useState(false)

  function addBlock(type: Block['type']) {
    onChange([...value, newBlock(type)])
    setShowPicker(false)
  }

  function updateBlock(id: string, data: Record<string, any>) {
    onChange(value.map(b => b.id === id ? { ...b, data } : b))
  }

  function deleteBlock(id: string) {
    onChange(value.filter(b => b.id !== id))
  }

  function moveBlock(id: string, dir: -1 | 1) {
    const idx = value.findIndex(b => b.id === id)
    if (idx < 0) return
    const next = [...value]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {value.map((block, i) => (
          <motion.div
            key={block.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <BlockEditor_
              block={block}
              onChange={data => updateBlock(block.id, data)}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, -1)}
              onMoveDown={() => moveBlock(block.id, 1)}
              isFirst={i === 0}
              isLast={i === value.length - 1}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add block button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(v => !v)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-stone/30 text-sm text-ink/50 hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all"
        >
          <Plus className="h-4 w-4" /> Add block
        </button>

        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-stone/20 p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 z-20"
            >
              {blockTypes.map(bt => (
                <button
                  key={bt.type}
                  type="button"
                  onClick={() => addBlock(bt.type as Block['type'])}
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
