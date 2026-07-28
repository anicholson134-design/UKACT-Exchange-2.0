interface Props {
  faqs: { q: string; a: string }[]
}

export function FaqsSection({ faqs }: Props) {
  return (
    <section className="section-padding bg-cream">
      <div className="container-keep max-w-3xl">
        <div className="text-center mb-12">
          <p className="eyebrow mb-4">Common Questions</p>
          <h2 className="display-md text-forest">FAQs</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white rounded-xl border border-stone/20 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <span className="font-display font-semibold text-forest pr-4 min-w-0">{faq.q}</span>
                <span className="text-gold text-xl font-light shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-ink/60 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
