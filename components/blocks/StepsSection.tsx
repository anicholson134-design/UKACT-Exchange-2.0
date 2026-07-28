interface Props {
  steps: { title: string; desc: string }[]
}

export function StepsSection({ steps }: Props) {
  return (
    <section className="section-padding bg-mist">
      <div className="container-keep">
        <div className="text-center mb-16">
          <p className="eyebrow mb-4">The Process</p>
          <h2 className="display-md text-forest">How to join</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-full bg-gold text-cream font-display font-bold text-xl flex items-center justify-center mx-auto mb-5">
                {i + 1}
              </div>
              <h3 className="font-display font-semibold text-lg text-forest mb-2">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
