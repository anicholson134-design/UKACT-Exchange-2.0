'use client'

import { useState } from 'react'
import { Mail, MapPin, Clock, Send } from 'lucide-react'

interface Props {
  email: string
  location: string
  responseTime: string
}

export function ContactDetailsFormBlock({ email, location, responseTime }: Props) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: MapPin, label: 'Location', value: location, href: null },
    { icon: Clock, label: 'Response time', value: responseTime, href: null },
  ]

  return (
    <section className="section-padding bg-cream">
      <div className="container-keep">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h2 className="font-display font-semibold text-2xl text-forest mb-6">Contact details</h2>
              <div className="space-y-5">
                {contactItems.map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-moss" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink/40 mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-forest hover:text-gold transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-sm text-forest">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-mist p-6 border border-stone/20">
              <h3 className="font-display font-semibold text-forest mb-2">Looking to join UKACT?</h3>
              <p className="text-sm text-ink/60 mb-4 leading-relaxed">For registration enquiries, visit our Join UKACT page for full details and the application process.</p>
              <a href="/joining-ukact" className="text-sm font-medium text-canopy hover:text-gold transition-colors link-underline">Learn about joining →</a>
            </div>
          </div>

          <div className="lg:col-span-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center bg-white rounded-2xl border border-stone/20 p-12">
                <div className="w-16 h-16 rounded-full bg-mist flex items-center justify-center mb-6">
                  <Send className="h-7 w-7 text-moss" />
                </div>
                <h3 className="font-display font-semibold text-2xl text-forest mb-2">Message sent</h3>
                <p className="text-ink/60">Thank you for getting in touch. We&apos;ll be in contact within a few working days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone/20 p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-forest">Full name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-stone/30 bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-forest">Email address</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-stone/30 bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-forest">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-stone/30 bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all text-ink/70">
                    <option>General enquiry</option>
                    <option>Membership registration</option>
                    <option>Collection registration</option>
                    <option>Sponsorship</option>
                    <option>Media / press</option>
                    <option>Technical support</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-forest">Message</label>
                  <textarea required rows={6} className="w-full px-4 py-3 rounded-xl border border-stone/30 bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all resize-y" placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-xl hover:bg-gold-light transition-all duration-300 disabled:opacity-60">
                  <Send className="h-4 w-4" />
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
