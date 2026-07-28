'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/admin/settings/branding', label: 'Branding' },
  { href: '/admin/settings/nav', label: 'Navigation' },
  { href: '/admin/settings/home', label: 'Homepage' },
  { href: '/admin/settings/auth', label: 'Sign In / Sign Up' },
  { href: '/admin/settings/joining', label: 'Join UKACT' },
  { href: '/admin/settings/contact', label: 'Contact' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-forest">Site Settings</h1>
        <p className="text-stone mt-1 text-sm">Edit page content — changes go live immediately on save.</p>
      </div>
      <div className="flex gap-8">
        <aside className="w-40 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone mb-2 px-3">Pages</p>
          <nav className="space-y-0.5">
            {nav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-canopy/10 text-canopy font-medium'
                    : 'text-stone hover:text-forest hover:bg-sand/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
