import { getSiteSettings, parseSetting } from '@/lib/getSiteSettings'
import { NavForm } from './NavForm'

export default async function NavSettingsPage() {
  const s = await getSiteSettings()

  const items = parseSetting<{ label: string; href: string; visible: boolean }[]>(
    s['nav.items'],
    []
  )
  const custom = parseSetting<{ label: string; href: string; visible: boolean }[]>(
    s['nav.custom'],
    []
  )

  return <NavForm initial={{ items, custom }} />
}
