import Link from 'next/link'
import { Heart, Mail, MapPin } from 'lucide-react'

const footerNav = [
  {
    heading: 'Opportunities',
    links: [
      { label: 'Current Placements', href: '/listings' },
      { label: 'Join UKACT', href: '/joining-ukact' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', href: 'https://www.ukact.org/contact-8' },
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display font-bold text-2xl text-cream">
              UKACT
            </Link>
            <p className="mt-4 text-sm text-sage/70 leading-relaxed max-w-xs">
              The national network for UK Animal Care Technicians. Connecting staff across
              animal management colleges and farm schools to develop skills and raise welfare standards.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-sage/50">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              United Kingdom
            </div>
            <Link
              href="mailto:info@ukact.keeperexchange.org"
              className="mt-2 flex items-center gap-2 text-sm text-sage/50 hover:text-gold transition-colors"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              info@ukact.keeperexchange.org
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
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
            © {new Date().getFullYear()} UKACT – UK Animal Care Technicians.
            All rights reserved.
          </p>
          <p className="text-xs text-sage/30 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-gold/50" /> for animal welfare
          </p>
        </div>
      </div>
    </footer>
  )
}
