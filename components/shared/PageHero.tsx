interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  image: string
  size?: 'sm' | 'md' | 'lg'
}

export function PageHero({ eyebrow, title, subtitle, image, size = 'md' }: PageHeroProps) {
  const heights = { sm: 'min-h-[40vh]', md: 'min-h-[55vh]', lg: 'min-h-[70vh]' }

  return (
    <section className={`relative flex items-end ${heights[size]} pt-32 pb-16 overflow-hidden bg-forest`}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/40 to-forest/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container-keep w-full">
        {eyebrow && (
          <p className="eyebrow text-gold mb-4">{eyebrow}</p>
        )}
        <h1 className="display-lg text-cream max-w-2xl mb-4">{title}</h1>
        {subtitle && (
          <p className="text-cream/70 text-lg max-w-xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
