'use client'

import { useState } from 'react'
import { SaveBar } from '@/components/admin/settings/SaveBar'
import { SectionBlocksField } from '@/components/admin/settings/SectionBlocksField'
import { renderBlockEditor } from '@/components/admin/settings/renderBlockEditor'
import { BLOCK_CATALOG, blockDataToSettings, type BlockData } from '@/lib/blockLibrary'

interface Props {
  /** site_settings key that stores this page's ordered block-type array, e.g. 'home.blocks' */
  blocksKey: string
  initialBlocks: string[]
  initialData: BlockData
}

/**
 * Shared page-composer form used by every page's settings screen (Home, Join UKACT, Contact, …).
 * The "Add section" picker offers every block in the site-wide library, not just this page's own —
 * block content is a shared resource, editable from wherever it's placed.
 */
export function PageBlocksForm({ blocksKey, initialBlocks, initialData }: Props) {
  const [blocks, setBlocks] = useState<string[]>(initialBlocks)
  const [d, setD] = useState<BlockData>(initialData)
  const set = (patch: Partial<BlockData>) => setD(prev => ({ ...prev, ...patch }))

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [blocksKey]: JSON.stringify(blocks),
        ...blockDataToSettings(d),
      }),
    })
  }

  return (
    <div className="max-w-2xl space-y-8">
      <SectionBlocksField catalog={BLOCK_CATALOG} value={blocks} onChange={setBlocks} />

      {/* Content is shared across repeated instances of the same block, so each type's editor is shown once. */}
      {[...new Set(blocks)].map(type => renderBlockEditor(type, d, set))}

      <SaveBar onSave={save} />
    </div>
  )
}
