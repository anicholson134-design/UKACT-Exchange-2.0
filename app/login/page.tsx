import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const metadata: Metadata = { title: 'Sign In' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const s = await getSiteSettings()

  return (
    <div className="min-h-screen flex">
      {/* Left — cinematic image panel */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${s['auth.login_image']}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/80 via-forest/60 to-canopy/80" />

        {/* Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="font-display font-bold text-2xl text-cream">UKACT</Link>
        </div>

        {/* Quote */}
        <div className="relative z-10 mt-auto p-10">
          <blockquote className="text-cream/90 text-xl font-display italic leading-relaxed mb-4">
            &quot;{s['auth.login_quote']}&quot;
          </blockquote>
          <p className="text-sage/70 text-sm">— {s['auth.login_quote_author']}</p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-cream">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="font-display font-bold text-2xl text-forest">UKACT</Link>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
