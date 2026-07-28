import { createAdminClient } from '@/lib/supabase/admin'

export interface CmsNavItem {
  id: string
  slug: string
  title: string
  nav_label: string | null
  nav_group: string | null
  nav_order: number
}

export async function getCmsNavItems(): Promise<CmsNavItem[]> {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('cms_pages')
      .select('id, slug, title, nav_label, nav_group, nav_order')
      .eq('status', 'published')
      .eq('show_in_nav', true)
      .order('nav_order', { ascending: true })

    return (data ?? []) as CmsNavItem[]
  } catch {
    // If table doesn't exist yet, return empty
    return []
  }
}
