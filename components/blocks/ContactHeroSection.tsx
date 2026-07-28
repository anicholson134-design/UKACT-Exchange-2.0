interface Props {
  heading: string
  body: string
}

export function ContactHeroSection({ heading, body }: Props) {
  return (
    <section className="relative pt-36 pb-20 bg-forest overflow-hidden">
      <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=40')` }} />
      <div className="absolute inset-0 bg-forest/70" />
      <div className="relative z-10 container-keep">
        <p className="eyebrow text-gold mb-4">Get in Touch</p>
        <h1 className="display-lg text-cream max-w-xl mb-4">{heading}</h1>
        <p className="text-cream/70 text-lg max-w-lg leading-relaxed">{body}</p>
      </div>
    </section>
  )
}
