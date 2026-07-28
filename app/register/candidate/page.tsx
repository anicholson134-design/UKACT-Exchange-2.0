import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Register as a Member' }

export default function CandidateRegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] relative flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=1200&q=85')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-forest/80 via-forest/60 to-canopy/80" />
        <div className="relative z-10 p-10">
          <Link href="/" className="font-display font-bold text-2xl text-cream">UKACT</Link>
        </div>
        <div className="relative z-10 mt-auto p-10">
          <blockquote className="text-cream/90 text-xl font-display italic leading-relaxed mb-4">
            &quot;Joining UKACT was the single best thing I did for my career in animal care.&quot;
          </blockquote>
          <p className="text-sage/70 text-sm">— James Hartley, Head of Animal Care, Agricultural College</p>
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
