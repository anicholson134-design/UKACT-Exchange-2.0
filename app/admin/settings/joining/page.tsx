import { getSiteSettings, parseSetting, DEFAULT_JOINING_BLOCKS } from '@/lib/getSiteSettings'
import { getBlockData, migrateLegacyBlockType } from '@/lib/blockLibrary'
import { PageBlocksForm } from '@/components/admin/settings/PageBlocksForm'

export default async function JoiningSettingsPage() {
  const s = await getSiteSettings()
  const blocks = parseSetting(s['joining.blocks'], DEFAULT_JOINING_BLOCKS).map(t => migrateLegacyBlockType(t, 'joining'))
  return <PageBlocksForm blocksKey="joining.blocks" initialBlocks={blocks} initialData={getBlockData(s)} />
}
