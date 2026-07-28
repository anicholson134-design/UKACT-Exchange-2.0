import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { getSiteSettings } from '@/lib/getSiteSettings'

export const metadata: Metadata = { title: 'Register as a Member' }
export const dynamic = 'force-dynamic'

export default async function CandidateRegisterPage() {
  const s = await getSiteSettings()

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] relative flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${s['auth.candidate_image']}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/80 via-forest/60 to-canopy/80" />
        <div className="relative z-10 p-10">
          <Link href="/" className="font-display font-bold text-2xl text-cream">UKACT</Link>
        </div>
        <div className="relative z-10 mt-auto p-10">
          <blockquote className="text-cream/90 text-xl font-display italic leading-relaxed mb-4">
            &quot;{s['auth.candidate_quote']}&quot;
          </blockquote>
          <p className="text-sage/70 text-sm">— {s['auth.candidate_quote_author']}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-cream">
        <div className="lg:hidden mb-10">
          <Link href="/" className="font-display font-bold text-2xl text-forest">UKACT</Link>
        </div>
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <RegisterForm type="candidate" />
        </div>
      </div>
    </div>
  )
}
