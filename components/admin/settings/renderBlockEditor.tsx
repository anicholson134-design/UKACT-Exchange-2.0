'use client'

import { ImageField } from '@/components/admin/settings/ImageField'
import { StringArrayField } from '@/components/admin/settings/StringArrayField'
import { ObjectArrayField } from '@/components/admin/settings/ObjectArrayField'
import type { BlockData } from '@/lib/blockLibrary'

const inp = 'w-full px-3 py-2 text-sm border border-stone/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-canopy/30'
const card = 'bg-white rounded-xl border border-stone/20 p-6 space-y-5'

type SetFn = (patch: Partial<BlockData>) => void

/** Renders the content editor for any block type in the shared library, given the full unified block state. */
export function renderBlockEditor(type: string, d: BlockData, set: SetFn): React.ReactNode {
  switch (type) {
    case 'home_hero':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Hero (Home)</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow text</label><input className={inp} value={d.home_hero_eyebrow} onChange={e => set({ home_hero_eyebrow: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Headline</label><input className={inp} value={d.home_hero_headline} onChange={e => set({ home_hero_headline: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Subtitle</label><textarea rows={3} className={inp} value={d.home_hero_subtitle} onChange={e => set({ home_hero_subtitle: e.target.value })} /></div>
            <ImageField label="Background Image" value={d.home_hero_bg_image} onChange={v => set({ home_hero_bg_image: v })} />
          </div>
        </section>
      )
    case 'mission':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Mission</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Pull Quote</label><textarea rows={3} className={inp} value={d.mission_quote} onChange={e => set({ mission_quote: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Body paragraph 1</label><textarea rows={4} className={inp} value={d.mission_body_1} onChange={e => set({ mission_body_1: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Body paragraph 2</label><textarea rows={4} className={inp} value={d.mission_body_2} onChange={e => set({ mission_body_2: e.target.value })} /></div>
            <ImageField label="Side Image" value={d.mission_image} onChange={v => set({ mission_image: v })} />
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-ink mb-1.5">Stat number</label><input className={inp} value={d.mission_stat_number} onChange={e => set({ mission_stat_number: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-ink mb-1.5">Stat label</label><input className={inp} value={d.mission_stat_label} onChange={e => set({ mission_stat_label: e.target.value })} /></div>
            </div>
          </div>
        </section>
      )
    case 'stats':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Stats Bar</h2>
          <div className={card}>
            <ObjectArrayField
              label="Stats"
              items={d.stats}
              onChange={v => set({ stats: v })}
              fields={[
                { key: 'value', label: 'Number', placeholder: '50' },
                { key: 'suffix', label: 'Suffix', placeholder: '+' },
                { key: 'label', label: 'Label', placeholder: 'Members' },
                { key: 'desc', label: 'Description', placeholder: 'Professional exchanges completed' },
              ]}
              itemLabel={(item, i) => item.label || `Stat ${i + 1}`}
            />
          </div>
        </section>
      )
    case 'how_it_works':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">How UKACT Works</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} value={d.howitworks_eyebrow} onChange={e => set({ howitworks_eyebrow: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.howitworks_heading} onChange={e => set({ howitworks_heading: e.target.value })} /></div>
            <ObjectArrayField
              label="Steps"
              items={d.howitworks_steps}
              onChange={v => set({ howitworks_steps: v })}
              fields={[
                { key: 'title', label: 'Title', placeholder: 'Register' },
                { key: 'desc', label: 'Description', type: 'textarea', placeholder: 'Step description…' },
              ]}
              itemLabel={(item, i) => item.title || `Step ${i + 1}`}
            />
          </div>
        </section>
      )
    case 'featured_listings':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Featured Listings</h2>
          <div className={card}>
            <p className="text-sm text-ink/60">
              Automatically shows the 3 most recent active placements. Nothing to configure here beyond
              whether the section appears — manage the placements themselves under <strong>Jobs</strong>.
            </p>
          </div>
        </section>
      )
    case 'testimonials':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Testimonials</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} value={d.testimonials_eyebrow} onChange={e => set({ testimonials_eyebrow: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.testimonials_heading} onChange={e => set({ testimonials_heading: e.target.value })} /></div>
            <ObjectArrayField
              label="Testimonials"
              items={d.testimonials}
              onChange={v => set({ testimonials: v })}
              fields={[
                { key: 'quote', label: 'Quote', type: 'textarea' },
                { key: 'name', label: 'Name', placeholder: 'Sarah Mitchell' },
                { key: 'role', label: 'Role', placeholder: 'Animal Unit Manager' },
                { key: 'collection', label: 'Collection', placeholder: 'Chester Zoo' },
                { key: 'avatar', label: 'Avatar', type: 'image' },
              ]}
              itemLabel={item => item.name || 'Testimonial'}
            />
          </div>
        </section>
      )
    case 'partners':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Partners Marquee</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Eyebrow</label><input className={inp} value={d.partners_eyebrow} onChange={e => set({ partners_eyebrow: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.partners_heading} onChange={e => set({ partners_heading: e.target.value })} /></div>
            <ObjectArrayField
              label="Partners"
              items={d.partners}
              onChange={v => set({ partners: v })}
              fields={[
                { key: 'name', label: 'Name', placeholder: 'Chester Zoo' },
                { key: 'logo', label: 'Logo', type: 'image' },
              ]}
              itemLabel={item => item.name || 'Partner'}
            />
          </div>
        </section>
      )
    case 'joining_hero':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Hero (Join UKACT)</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Title</label><input className={inp} value={d.joining_hero_title} onChange={e => set({ joining_hero_title: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Subtitle</label><textarea rows={2} className={inp} value={d.joining_hero_subtitle} onChange={e => set({ joining_hero_subtitle: e.target.value })} /></div>
            <ImageField label="Hero Image" value={d.joining_hero_image} onChange={v => set({ joining_hero_image: v })} />
          </div>
        </section>
      )
    case 'benefits':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Who It&apos;s For</h2>
          <div className={`${card} space-y-6`}>
            <div>
              <p className="text-xs font-medium text-ink/60 mb-2">For Staff</p>
              <StringArrayField label="Member benefits" values={d.keeper_benefits} onChange={v => set({ keeper_benefits: v })} placeholder="Access to placements at 80+ collections" />
            </div>
            <div>
              <p className="text-xs font-medium text-ink/60 mb-2">For Collections</p>
              <StringArrayField label="Collection benefits" values={d.collection_benefits} onChange={v => set({ collection_benefits: v })} placeholder="Host motivated staff" />
            </div>
          </div>
        </section>
      )
    case 'joining_steps':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Process Steps</h2>
          <div className={card}>
            <ObjectArrayField
              label="Steps"
              items={d.joining_steps}
              onChange={v => set({ joining_steps: v })}
              fields={[
                { key: 'title', label: 'Title', placeholder: 'Register' },
                { key: 'desc', label: 'Description', type: 'textarea' },
              ]}
              itemLabel={(item, i) => item.title || `Step ${i + 1}`}
            />
          </div>
        </section>
      )
    case 'faqs':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">FAQs</h2>
          <div className={card}>
            <ObjectArrayField
              label="FAQs"
              items={d.faqs}
              onChange={v => set({ faqs: v })}
              fields={[
                { key: 'q', label: 'Question', placeholder: 'Who can apply?' },
                { key: 'a', label: 'Answer', type: 'textarea' },
              ]}
              itemLabel={item => item.q || 'FAQ'}
            />
          </div>
        </section>
      )
    case 'contact_hero':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Hero (Contact)</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Heading</label><input className={inp} value={d.contact_hero_heading} onChange={e => set({ contact_hero_heading: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Body</label><textarea rows={3} className={inp} value={d.contact_hero_body} onChange={e => set({ contact_hero_body: e.target.value })} /></div>
          </div>
        </section>
      )
    case 'contact_details_form':
      return (
        <section key={type}>
          <h2 className="text-base font-semibold text-forest mb-4">Contact Details</h2>
          <div className={card}>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Email address</label><input className={inp} type="email" value={d.contact_email} onChange={e => set({ contact_email: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Location</label><input className={inp} value={d.contact_location} onChange={e => set({ contact_location: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-ink mb-1.5">Response time</label><input className={inp} value={d.contact_response_time} onChange={e => set({ contact_response_time: e.target.value })} /></div>
          </div>
        </section>
      )
    default:
      return null
  }
}
