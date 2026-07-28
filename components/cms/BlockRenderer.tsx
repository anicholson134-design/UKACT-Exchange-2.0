import Link from 'next/link'
import type { Block } from './BlockEditor'

function Heading({ data }: { data: Block['data'] }) {
  const Tag = (data.level ?? 'h2') as 'h1' | 'h2' | 'h3'
  const sizes = { h1: 'text-5xl md:text-6xl', h2: 'text-3xl md:text-4xl', h3: 'text-2xl md:text-3xl' }
  return (
    <Tag className={`font-display font-semibold text-forest leading-tight ${sizes[Tag]}`}>
      {data.text}
    </Tag>
  )
}

function TextBlock({ data }: { data: Block['data'] }) {
  return (
    <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-wrap">{data.text}</p>
  )
}

function ImageBlock({ data }: { data: Block['data'] }) {
  if (!data.src) return null
  return (
    <figure className="space-y-2">
      <div className="rounded-2xl overflow-hidden">
        <img src={data.src} alt={data.alt ?? ''} className="w-full object-cover" />
      </div>
      {data.caption && (
        <figcaption className="text-sm text-center text-ink/50 italic">{data.caption}</figcaption>
      )}
    </figure>
  )
}

function TwoCol({ data }: { data: Block['data'] }) {
  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <p className="text-ink/70 text-lg leading-relaxed whitespace-pre-wrap">{data.left_text}</p>
      {data.right_image && (
        <div className="rounded-2xl overflow-hidden aspect-[4/3]">
          <img src={data.right_image} alt={data.right_alt ?? ''} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}

function CTABlock({ data }: { data: Block['data'] }) {
  return (
    <div className="rounded-2xl bg-forest text-center px-8 py-12 space-y-4">
      <h3 className="font-display text-cream text-3xl font-semibold">{data.title}</h3>
      {data.body && <p className="text-cream/70 max-w-lg mx-auto">{data.body}</p>}
      {data.button_label && data.button_href && (
        <Link
          href={data.button_href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cream font-medium rounded-xl hover:bg-gold-light transition-colors mt-2"
        >
          {data.button_label}
        </Link>
      )}
    </div>
  )
}

function StatsBlock({ data }: { data: Block['data'] }) {
  const items = (data.items ?? []).filter((i: any) => i.value || i.label)
  if (!items.length) return null
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item: any, i: number) => (
        <div key={i} className="bg-mist rounded-2xl p-6 text-center border border-stone/20">
          <p className="font-display text-4xl font-bold text-gold mb-1">{item.value}</p>
          <p className="text-sm text-ink/60">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null

  return (
    <div className="space-y-10">
      {blocks.map(block => (
        <div key={block.id}>
          {block.type === 'heading' && <Heading data={block.data} />}
          {block.type === 'text' && <TextBlock data={block.data} />}
          {block.type === 'image' && <ImageBlock data={block.data} />}
          {block.type === 'two_col' && <TwoCol data={block.data} />}
          {block.type === 'cta' && <CTABlock data={block.data} />}
          {block.type === 'stats' && <StatsBlock data={block.data} />}
          {block.type === 'divider' && <hr className="border-stone/30" />}
        </div>
      ))}
    </div>
  )
}
