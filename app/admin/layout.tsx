import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/shared/Navbar'
import { getCmsNavItems } from '@/lib/getCmsNavItems'
import { getSiteSettings, parseSetting } from '@/lib/getSiteSettings'
import { LayoutDashboard, Building2, Briefcase, Users, BarChart3, FileText, Settings } from 'lucide-react'
import type { Profile } from '@/types'

const adminNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employers', label: 'Collections', icon: Building2 },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/candidates', label: 'Candidates', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  null,
  { href: '/admin/cms', label: 'Pages (CMS)', icon: FileText },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [cmsItems, settings] = await Promise.all([getCmsNavItems(), getSiteSettings()])

  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        profile={profile}
        cmsItems={cmsItems}
        logoUrl={settings['branding.logo_url']}
        navConfig={parseSetting(settings['nav.items'], undefined)}
        navCustom={parseSetting(settings['nav.custom'], [])}
      />
      <div className="flex flex-1 container mx-auto px-4 pt-24 md:pt-28 pb-12 gap-8">
        <aside className="w-48 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {adminNav.map((item, i) =>
              item === null
                ? <div key={i} className="my-2 border-t border-stone/20" />
                : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
            )}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
