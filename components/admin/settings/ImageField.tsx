'use client'

import { useRef, useState } from 'react'

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
}

export function ImageField({ label, value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function upload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/cms/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) onChange(json.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      {value && (
        <div className="mb-2 w-32 h-20 rounded-lg overflow-hidden border border-stone/20 bg-sand/30">
          <img src={value} alt="" className="w-full h-full object-contain p-1" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Image URL or upload file"
          className="flex-1 px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3 py-2 text-sm bg-sand border border-stone/30 rounded-lg hover:bg-sand/70 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }}
        />
      </div>
    </div>
  )
}
