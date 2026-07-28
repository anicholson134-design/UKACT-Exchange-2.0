import Link from 'next/link'
import { Globe, Mail } from 'lucide-react'

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.24h4.56V23H.22V8.24zM8.35 8.24h4.37v2.02h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v8.1h-4.56v-7.18c0-1.71-.03-3.92-2.39-3.92-2.39 0-2.76 1.87-2.76 3.8v7.3H8.35V8.24z" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/keeper-educational-exchange-programme/', Icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/keep_exchange/', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/ZooKEEPX/', Icon: FacebookIcon },
]

export function EazaFooter() {
  return (
    <footer className="bg-forest">
      <div className="container-keep py-16 md:py-20 text-center">
        <p className="font-display text-2xl text-cream mb-3">KEEP</p>
        <p className="display-md text-cream mb-4">Thank you for connecting with us at this year&rsquo;s EAZA Conference</p>
        <p className="text-sage/70 text-sm mb-10">
          Volunteer-led &bull; Not-for-profit &bull; Founded 2020
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-10 text-sm">
          <Link href="https://www.keeperexchange.org/" className="inline-flex items-center gap-2 text-cream/80 hover:text-gold transition-colors">
            <Globe className="h-4 w-4" />
            keeperexchange.org
          </Link>
          <Link href="mailto:info@keeperexchange.org" className="inline-flex items-center gap-2 text-cream/80 hover:text-gold transition-colors">
            <Mail className="h-4 w-4" />
            info@keeperexchange.org
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4">
          {SOCIALS.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full border border-white/15 text-cream/60 hover:text-gold hover:border-gold/40 flex items-center justify-center transition-colors"
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-keep py-6 text-center">
          <p className="text-xs text-sage/40">
            {`© ${new Date().getFullYear()} KEEP – Keeper Exchange and Education Programme. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
