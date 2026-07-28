'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Simplified world country positions on an 800x450 viewBox
const exchanges = [
  { id: 'uk', cx: 370, cy: 110, label: 'United Kingdom', year: '2019', focus: 'Where it began', desc: 'UKACT founded as a Facebook group — now spanning 120+ colleges and 130+ farm schools' },
  { id: 'ie', cx: 348, cy: 112, label: 'Ireland', year: '2020', focus: 'BIAZA Partnership', desc: 'BIAZA — the British & Irish Association of Zoos and Aquariums — becomes a key UKACT partner' },
  { id: 'us', cx: 150, cy: 155, label: 'United States', year: '2021', focus: 'ABMA Partnership', desc: 'Connections with The Animal Behavior Management Alliance bring international best practice home' },
  { id: 'global', cx: 500, cy: 200, label: 'Global Network', year: '2022', focus: 'IRKA Partnership', desc: "The International Rhino Keeper Association joins UKACT's growing list of partner organisations" },
]

function WorldMapSVG() {
  return (
    <svg viewBox="0 0 800 420" className="w-full" style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.18))' }}>
      {/* Simple world landmass shapes */}
      {/* North America */}
      <path d="M80,80 L200,75 L240,100 L260,140 L250,180 L230,200 L200,220 L180,260 L160,280 L140,270 L120,240 L100,200 L80,160 L60,120 Z" fill="#2D4A32" opacity="0.5" />
      {/* South America */}
      <path d="M160,280 L220,270 L250,290 L260,320 L250,360 L230,390 L200,400 L175,385 L160,360 L150,330 L155,300 Z" fill="#2D4A32" opacity="0.5" />
      {/* Europe */}
      <path d="M330,80 L420,75 L440,95 L435,115 L415,125 L390,120 L365,130 L345,125 L330,110 Z" fill="#2D4A32" opacity="0.5" />
      {/* Africa */}
      <path d="M360,140 L430,135 L460,155 L470,200 L465,250 L450,290 L430,320 L400,335 L375,325 L355,295 L345,255 L340,210 L345,170 Z" fill="#2D4A32" opacity="0.5" />
      {/* Asia */}
      <path d="M440,75 L680,70 L720,90 L740,120 L720,150 L680,165 L640,160 L600,180 L560,175 L520,190 L490,185 L460,165 L445,140 L440,110 Z" fill="#2D4A32" opacity="0.5" />
      {/* Australia */}
      <path d="M630,265 L720,260 L750,280 L755,315 L740,345 L710,360 L680,355 L655,335 L640,305 L630,280 Z" fill="#2D4A32" opacity="0.5" />
      {/* UK island */}
      <ellipse cx="372" cy="112" rx="12" ry="18" fill="#4A6741" opacity="0.7" />
    </svg>
  )
}

export function StoryWorldMap() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState<number>(0)
  const inView = useInView(sectionRef, { once: true, margin: '-15%' })

  useEffect(() => {
    if (!inView) return
    const ctx = gsap.context(() => {
      exchanges.forEach((_, i) => {
        gsap.delayedCall(i * 0.5, () => setRevealed(i + 1))
      })
    })
    return () => ctx.revert()
  }, [inView])

  const activeExchange = revealed > 0 ? exchanges[revealed - 1] : null

  return (
    <section ref={sectionRef} className="relative bg-forest overflow-hidden py-24 md:py-36">
      {/* Stars/texture */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="container-keep relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="eyebrow text-gold mb-4">Chapter Three</p>
          <h2 className="font-display text-cream" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Connected to the Wider World
          </h2>
          <p className="text-cream/60 mt-4 max-w-lg mx-auto leading-relaxed">
            From a Facebook group in 2019, UKACT has grown into the UK's national network for animal care education — connected to the wider world through partnerships with international bodies like BIAZA, ABMA and IRKA.
          </p>
        </motion.div>

        {/* Map + connections */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative">
            <WorldMapSVG />

            {/* Connection lines and dots overlay */}
            <svg
              viewBox="0 0 800 420"
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
            >
              {/* Lines from UK to each exchange */}
              {exchanges.slice(1, revealed).map((ex, i) => (
                <motion.line
                  key={ex.id}
                  x1={exchanges[0].cx} y1={exchanges[0].cy}
                  x2={ex.cx} y2={ex.cy}
                  stroke="#B8935A"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              ))}

              {/* Dots */}
              {exchanges.slice(0, revealed).map((ex, i) => (
                <g key={ex.id}>
                  {/* Pulsing ring */}
                  <motion.circle
                    cx={ex.cx} cy={ex.cy} r="12"
                    fill="none" stroke="#B8935A" strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    style={{ transformOrigin: `${ex.cx}px ${ex.cy}px` }}
                  />
                  {/* Dot */}
                  <motion.circle
                    cx={ex.cx} cy={ex.cy} r="5"
                    fill={i === revealed - 1 ? '#D4A96A' : '#B8935A'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'backOut' }}
                  />
                  {/* Year label */}
                  <motion.text
                    x={ex.cx + 8} y={ex.cy - 8}
                    fontSize="8" fill="#D4A96A" opacity="0.8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.3 }}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {ex.year}
                  </motion.text>
                </g>
              ))}
            </svg>
          </div>

          {/* Active exchange info card */}
          <div className="mt-10 min-h-[100px] flex items-center justify-center">
            {activeExchange && (
              <motion.div
                key={activeExchange.id}
                className="glass rounded-2xl px-8 py-6 max-w-xl w-full text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="eyebrow text-gold">{activeExchange.year}</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span className="text-sage/70 text-xs">{activeExchange.focus}</span>
                </div>
                <h3 className="font-display text-cream text-2xl mb-2">{activeExchange.label}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">{activeExchange.desc}</p>
              </motion.div>
            )}
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {exchanges.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${i < revealed ? 'bg-gold w-6' : 'bg-white/10 w-2'}`}
              />
            ))}
          </div>
          <p className="text-center text-cream/40 text-xs mt-3">{revealed} of {exchanges.length} milestones revealed</p>
        </div>
      </div>
    </section>
  )
}
