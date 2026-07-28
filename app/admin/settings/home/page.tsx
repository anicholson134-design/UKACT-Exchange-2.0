import { getSiteSettings, parseSetting, DEFAULT_HOME_BLOCKS } from '@/lib/getSiteSettings'
import { getBlockData, migrateLegacyBlockType } from '@/lib/blockLibrary'
import { PageBlocksForm } from '@/components/admin/settings/PageBlocksForm'

export default async function HomeSettingsPage() {
  const s = await getSiteSettings()
  const blocks = parseSetting(s['home.blocks'], DEFAULT_HOME_BLOCKS).map(t => migrateLegacyBlockType(t, 'home'))
  return <PageBlocksForm blocksKey="home.blocks" initialBlocks={blocks} initialData={getBlockData(s)} />
}
