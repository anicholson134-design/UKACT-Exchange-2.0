import { getSiteSettings, parseSetting, DEFAULT_CONTACT_BLOCKS } from '@/lib/getSiteSettings'
import { getBlockData, migrateLegacyBlockType } from '@/lib/blockLibrary'
import { PageBlocksForm } from '@/components/admin/settings/PageBlocksForm'

export default async function ContactSettingsPage() {
  const s = await getSiteSettings()
  const blocks = parseSetting(s['contact.blocks'], DEFAULT_CONTACT_BLOCKS).map(t => migrateLegacyBlockType(t, 'contact'))
  return <PageBlocksForm blocksKey="contact.blocks" initialBlocks={blocks} initialData={getBlockData(s)} />
}
