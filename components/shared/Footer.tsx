import Link from 'next/link'
import { Heart, Mail, MapPin } from 'lucide-react'

const footerNav = [
  {
    heading: 'About',
    links: [
      { label: 'About KEEP', href: '/about' },
      { label: 'Meet the Team', href: '/about/team' },
      { label: 'Sponsors', href: '/about/sponsors' },
      { label: 'Partners', href: '/about/partners' },
    ],
  },
  {
    heading: 'Opportunities',
    links: [
      { label: 'Current Placements', href: '/listings' },
      { label: 'Other Opportunities', href: '/listings/other' },
      { label: 'Joining KEEP', href: '/joining-keep' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Donate', href: 'https://www.paypal.com/donate' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: 'var(--forest)' }}>
      {/* Main footer */}
      <div className="container-keep py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display font-bold text-2xl text-cream">
              KEEP
            </Link>
            <p className="mt-4 text-sm text-sage/70 leading-relaxed max-w-xs">
              The UK's first official Zookeeper Exchange Programme. Connecting keepers with
              collections to develop skills and advance conservation.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-sage/50">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Cambridge, CB24
            </div>
            <Link
              href="mailto:info@keeperexchange.org"
              className="mt-2 flex items-center gap-2 text-sm text-sage/50 hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              info@keeperexchange.org
            </Link>
          </div>

          {/* Nav columns */}
          {footerNav.map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-sage/50 mb-5">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-sage/70 hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-keep py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sage/40">
            © {new Date().getFullYear()} KEEP – Keeper Exchange and Education Programme.
            All rights reserved.
          </p>
          <p className="text-xs text-sage/30 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-gold/50" /> for conservation
          </p>
        </div>
      </div>
    </footer>
  )
}
