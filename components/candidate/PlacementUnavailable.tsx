import Link from 'next/link'
import { Search } from 'lucide-react'

export function PlacementUnavailable() {
  return (
    <section className="section-padding bg-cream text-center">
      <div className="container-keep max-w-lg">
        <Search className="h-10 w-10 text-stone mx-auto mb-6" strokeWidth={1.5} />
        <h1 className="font-display text-3xl font-semibold text-forest mb-3">
          This exchange is no longer available
        </h1>
        <p className="text-ink/60 leading-relaxed mb-8">
          This placement has been closed or is no longer accepting applications.
          Take a look at our current opportunities instead.
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-canopy text-cream font-medium rounded-xl hover:bg-forest transition-colors"
        >
          View all placements
        </Link>
      </div>
    </section>
  )
}
