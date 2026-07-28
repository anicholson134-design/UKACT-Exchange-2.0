'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Menu, X, ChevronDown } from 'lucide-react'
import type { Profile } from '@/types'

import type { CmsNavItem } from '@/lib/getCmsNavItems'

interface NavbarProps {
  profile: Profile | null
  cmsItems?: CmsNavItem[]
  logoUrl?: string
  navConfig?: { label: string; href: string; visible: boolean }[]
  navCustom?: { label: string; href: string; visible: boolean }[]
}

const NAV_CHILDREN: Record<string, { label: string; href: string; desc: string }[]> = {
  'About': [
    { label: 'About KEEP', href: '/about', desc: 'Our mission and story' },
    { label: 'Our Story', href: '/about/our-story', desc: 'An immersive journey' },
    { label: 'Meet the Team', href: '/about/team', desc: 'The people behind KEEP' },
    { label: 'Sponsors', href: '/about/sponsors', desc: 'Those who make it possible' },
    { label: 'Partners', href: '/about/partners', desc: 'Our global network' },
  ],
  'Sectors': [
    { label: 'KEEP Conservation', href: '/sectors/conservation', desc: 'Wildlife & field conservation' },
    { label: 'KEEP Zoos & Aquariums', href: '/sectors/zoos-aquariums', desc: 'Excellence in animal care' },
    { label: 'KEEP Education', href: '/sectors/education', desc: 'Inspiring the next generation' },
    { label: 'KEEP Researchers', href: '/sectors/researchers', desc: 'Science that drives conservation' },
  ],
  'Listings': [
    { label: 'Current Placements', href: '/listings', desc: 'Available exchange opportunities' },
    { label: 'Other Opportunities', href: '/listings/other', desc: 'Volunteering & more' },
  ],
}

const DEFAULT_NAV_CONFIG = [
  { label: 'About', href: '/about', visible: true },
  { label: 'Sectors', href: '/sectors/conservation', visible: true },
  { label: 'Listings', href: '/listings', visible: true },
  { label: 'Joining KEEP', href: '/joining-keep', visible: true },
  { label: 'Contact', href: '/contact', visible: true },
]

export function Navbar({ profile, cmsItems = [], logoUrl = '/keep-logo.webp', navConfig, navCustom = [] }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const isHomePage = pathname === '/'

  // Build nav from config (or defaults), filtering hidden items
  const activeConfig = (navConfig ?? DEFAULT_NAV_CONFIG).filter(c => c.visible)
  const navItems = activeConfig.map(c => ({
    label: c.label,
    href: c.href,
    children: NAV_CHILDREN[c.label] ?? undefined,
  }))

  // Merge CMS nav items into their respective groups
  const mergedNavItems = navItems.map(item => {
    if (!item.children || cmsItems.length === 0) return item
    const groupCmsItems = cmsItems
      .filter(c => c.nav_group === item.label.toLowerCase() || c.nav_group === item.href.replace('/', ''))
      .map(c => ({
        label: c.nav_label ?? c.title,
        href: `/p/${c.slug}`,
        desc: c.title,
      }))
    if (!groupCmsItems.length) return item
    return { ...item, children: [...item.children, ...groupCmsItems] }
  })

  // Custom links + top-level CMS items (no group)
  const topLevelCmsItems = [
    ...navCustom.filter(c => c.visible).map(c => ({ label: c.label, href: c.href, children: undefined })),
    ...cmsItems.filter(c => !c.nav_group).map(c => ({ label: c.nav_label ?? c.title, href: `/p/${c.slug}`, children: undefined })),
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const dashboardHref =
    profile?.role === 'admin' ? '/admin/dashboard'
    : profile?.role === 'employer' ? '/employer/dashboard'
    : '/candidate/dashboard'

  const navBg = isHomePage
    ? scrolled ? 'glass' : 'bg-transparent'
    : scrolled ? 'glass-light border-b border-stone/20' : 'bg-cream/95 border-b border-stone/20'

  // On homepage the bg is always dark (transparent over video OR dark glass) — keep text cream
  // On other pages the bg is always light — use dark text
  const textColor = isHomePage ? 'text-cream' : 'text-forest'
  const iconColor = isHomePage ? 'text-cream' : 'text-forest'

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-keep">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={logoUrl}
                alt="KEEP"
                width={112}
                height={112}
                className="h-24 w-24 object-contain"
                priority
                unoptimized={logoUrl.startsWith('http')}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {[...mergedNavItems, ...topLevelCmsItems].map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${textColor} hover:text-gold`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 w-64 glass-light rounded-xl shadow-xl overflow-hidden"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex flex-col px-4 py-3 hover:bg-sand/60 transition-colors group"
                          >
                            <span className="text-sm font-medium text-forest group-hover:text-canopy">{child.label}</span>
                            <span className="text-xs text-stone mt-0.5">{child.desc}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="https://www.paypal.com/donate"
                target="_blank"
                className={`text-sm font-medium transition-colors duration-200 ${textColor} hover:text-gold link-underline`}
              >
                Donate £5
              </Link>

              {profile ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={dashboardHref}
                    className="px-4 py-2 text-sm font-medium bg-canopy text-cream rounded-lg hover:bg-forest transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`text-sm font-medium transition-colors ${textColor} hover:text-gold`}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${textColor} hover:text-gold`}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register/candidate"
                    className="px-4 py-2 text-sm font-medium bg-gold text-cream rounded-lg hover:bg-gold-light transition-colors duration-200"
                  >
                    Join KEEP
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-md ${iconColor}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-forest lg:hidden flex flex-col pt-20 px-6 pb-8 overflow-y-auto overflow-x-hidden"
          >
            <nav className="flex flex-col gap-1 mt-4">
              {[...mergedNavItems, ...topLevelCmsItems].map(item => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center py-3 text-lg font-medium text-cream border-b border-white/10"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 py-2 flex flex-col gap-1">
                      {item.children.map(child => (
                        <Link key={child.href} href={child.href} className="py-2 text-sm text-sage hover:text-cream transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              {profile ? (
                <>
                  <Link href={dashboardHref} className="w-full py-3 text-center bg-gold text-cream rounded-lg font-medium">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="w-full py-3 text-center text-cream/70 text-sm">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register/candidate" className="w-full py-3 text-center bg-gold text-cream rounded-lg font-medium">
                    Join KEEP
                  </Link>
                  <Link href="/login" className="w-full py-3 text-center text-cream/70 text-sm">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
