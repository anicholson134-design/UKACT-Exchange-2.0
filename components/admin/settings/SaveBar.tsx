'use client'

import { useState } from 'react'

interface Props {
  onSave: () => Promise<void>
}

export function SaveBar({ onSave }: Props) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function save() {
    setState('saving')
    try {
      await onSave()
      setState('saved')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 4000)
    }
  }

  return (
    <div className="flex items-center gap-4 pt-6 mt-8 border-t border-stone/20">
      <button
        onClick={save}
        disabled={state === 'saving'}
        className="px-6 py-2.5 bg-canopy text-cream text-sm font-medium rounded-lg hover:bg-forest transition-colors disabled:opacity-50"
      >
        {state === 'saving' ? 'Saving…' : 'Save Changes'}
      </button>
      {state === 'saved' && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
      {state === 'error' && <span className="text-sm text-red-600 font-medium">Failed to save. Try again.</span>}
    </div>
  )
}
