import Link from 'next/link'
import { Check, UserCircle, Building2 } from 'lucide-react'

interface Props {
  keeperBenefits: string[]
  collectionBenefits: string[]
}

export function BenefitsSection({ keeperBenefits, collectionBenefits }: Props) {
  return (
    <section className="section-padding bg-cream">
      <div className="container-keep">
        <div className="text-center mb-16">
          <p className="eyebrow mb-4">Who It&apos;s For</p>
          <h2 className="display-md text-forest">Built for the animal care community</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-stone/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-moss" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-forest">For Staff</h3>
                <p className="text-sm text-ink/50">Develop your expertise</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {keeperBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink/70">
                  <Check className="h-4 w-4 text-moss mt-0.5 shrink-0" />{b}
                </li>
              ))}
            </ul>
            <Link href="/register/candidate" className="block w-full py-3 text-center bg-canopy text-cream font-medium rounded-xl hover:bg-forest transition-colors">
              Register as a Member
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center">
                <Building2 className="h-6 w-6 text-moss" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-forest">For Collections</h3>
                <p className="text-sm text-ink/50">Share and receive expertise</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {collectionBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-ink/70">
                  <Check className="h-4 w-4 text-moss mt-0.5 shrink-0" />{b}
                </li>
              ))}
            </ul>
            <Link href="/register/employer" className="block w-full py-3 text-center bg-gold text-cream font-medium rounded-xl hover:bg-gold-light transition-colors">
              Register Your Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
