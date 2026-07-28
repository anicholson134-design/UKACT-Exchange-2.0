'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const SCROLL_PAGES = 9

// Map connections from UK origin
const connections = [
  { x1: 388, y1: 108, x2: 345, y2: 114, year: '2015', country: 'Ireland' },
  { x1: 388, y1: 108, x2: 420, y2: 116, year: '2016', country: 'Germany' },
  { x1: 388, y1: 108, x2: 448, y2: 288, year: '2017', country: 'South Africa' },
  { x1: 388, y1: 108, x2: 688, y2: 308, year: '2018', country: 'Australia' },
  { x1: 388, y1: 108, x2: 148, y2: 156, year: '2019', country: 'USA' },
  { x1: 388, y1: 108, x2: 462, y2: 256, year: '2020', country: 'Kenya' },
  { x1: 388, y1: 108, x2: 634, y2: 240, year: '2021', country: 'Singapore' },
  { x1: 388, y1: 108, x2: 218, y2: 270, year: '2022', country: 'Brazil' },
  { x1: 388, y1: 108, x2: 718, y2: 340, year: '2023', country: 'New Zealand' },
  { x1: 388, y1: 108, x2: 680, y2: 160, year: '2024', country: 'Japan' },
]

// Ambient particles — fixed to avoid hydration mismatch
const particles = [
  { x: 12, y: 18, size: 3, dur: 6, del: 0 }, { x: 28, y: 72, size: 5, dur: 8, del: 1.2 },
  { x: 45, y: 35, size: 2, dur: 5, del: 2.5 }, { x: 62, y: 88, size: 4, dur: 7, del: 0.8 },
  { x: 78, y: 52, size: 3, dur: 6.5, del: 3 }, { x: 88, y: 20, size: 2, dur: 4.5, del: 1.5 },
  { x: 6, y: 60, size: 5, dur: 7.5, del: 4 }, { x: 35, y: 10, size: 3, dur: 5.5, del: 2 },
  { x: 55, y: 78, size: 4, dur: 6, del: 3.5 }, { x: 92, y: 65, size: 2, dur: 5, del: 0.5 },
  { x: 70, y: 40, size: 5, dur: 8, del: 1 }, { x: 20, y: 45, size: 3, dur: 7, del: 2.8 },
]

export function OurStoryExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Background layers
  const bg1Ref = useRef<HTMLDivElement>(null) // Forest canopy
  const bg2Ref = useRef<HTMLDivElement>(null) // Warm descent
  const bg3Ref = useRef<HTMLDivElement>(null) // Dark map bg
  const bg4Ref = useRef<HTMLDivElement>(null) // Cinematic stories
  const bg5Ref = useRef<HTMLDivElement>(null) // Dense jungle
  const bg6Ref = useRef<HTMLDivElement>(null) // Clearing

  // Colour tint overlays that morph the mood
  const tint1Ref = useRef<HTMLDivElement>(null) // warm amber
  const tint2Ref = useRef<HTMLDivElement>(null) // deep indigo/map
  const tint3Ref = useRef<HTMLDivElement>(null) // green jungle
  const tint4Ref = useRef<HTMLDivElement>(null) // golden clearing

  // Content layers
  const heroRef = useRef<HTMLDivElement>(null)
  const chapter1Ref = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement>(null)
  const mapLayerRef = useRef<HTMLDivElement>(null)
  const quote1Ref = useRef<HTMLDivElement>(null)
  const quote2Ref = useRef<HTMLDivElement>(null)
  const wildlife1Ref = useRef<HTMLDivElement>(null)
  const wildlife2Ref = useRef<HTMLDivElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)

  // SVG line refs
  const lineRefs = useRef<(SVGLineElement | null)[]>([])

  // Floating leaves
  const leavesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // ── Lenis smooth scroll ──────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    const rafId = gsap.ticker.add((time: number) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)

    // ── Set all non-hero layers invisible ────────────────────────
    const hiddenLayers = [
      bg2Ref.current, bg3Ref.current, bg4Ref.current, bg5Ref.current, bg6Ref.current,
      tint1Ref.current, tint2Ref.current, tint3Ref.current, tint4Ref.current,
      chapter1Ref.current, photosRef.current, mapLayerRef.current,
      quote1Ref.current, quote2Ref.current,
      wildlife1Ref.current, wildlife2Ref.current,
      closingRef.current,
    ]
    gsap.set(hiddenLayers, { opacity: 0 })

    // Set map lines
    lineRefs.current.forEach(line => {
      if (!line) return
      const len = Math.sqrt(
        Math.pow(+line.getAttribute('x2')! - +line.getAttribute('x1')!, 2) +
        Math.pow(+line.getAttribute('y2')! - +line.getAttribute('y1')!, 2)
      )
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
    })

    // ── Master timeline (duration = 10 arbitrary units, scrubbed) ─
    const tl = gsap.timeline({ defaults: { ease: 'none' } })

    // ─ 0-1: HERO — forest canopy, title visible
    tl.to(bg1Ref.current, { scale: 1.15, duration: 2 }, 0)

    // ─ 0.8-1.5: TRANSITION 1→2 — warm amber tint bleeds in, camera descends
    tl.to(tint1Ref.current, { opacity: 1, duration: 0.6 }, 0.8)
    tl.to(heroRef.current, { opacity: 0, y: -80, duration: 0.5 }, 0.9)
    tl.to(bg2Ref.current, { opacity: 1, duration: 0.7 }, 1.0)
    tl.to(bg1Ref.current, { opacity: 0, duration: 0.6 }, 1.2)

    // ─ 1.4-2.8: THE BEGINNING — journal text, photos emerge
    tl.to(chapter1Ref.current, { opacity: 1, duration: 0.5 }, 1.4)
    tl.to(bg2Ref.current, { scale: 1.1, duration: 1.5 }, 1.4)

    // Photos drift in mid-chapter
    tl.to(photosRef.current, { opacity: 1, duration: 0.5 }, 2.0)

    // ─ 2.6-3.2: TRANSITION 2→3 — deep indigo, map emerges from beneath collage
    tl.to(chapter1Ref.current, { opacity: 0, y: -50, duration: 0.4 }, 2.6)
    tl.to(photosRef.current, { opacity: 0, y: -60, scale: 0.92, duration: 0.5 }, 2.7)
    tl.to(tint2Ref.current, { opacity: 1, duration: 0.5 }, 2.7)
    tl.to(bg3Ref.current, { opacity: 1, duration: 0.6 }, 2.8)
    tl.to(bg2Ref.current, { opacity: 0, duration: 0.5 }, 3.0)
    tl.to(tint1Ref.current, { opacity: 0, duration: 0.4 }, 3.0)
    tl.to(mapLayerRef.current, { opacity: 1, duration: 0.5 }, 3.0)

    // ─ 3.0-5.0: WORLD MAP — lines animate one by one
    lineRefs.current.forEach((line, i) => {
      if (!line) return
      tl.to(line, { strokeDashoffset: 0, duration: 0.18 }, 3.2 + i * 0.16)
    })

    // ─ 4.8-5.5: TRANSITION 3→4 — stories emerge
    tl.to(mapLayerRef.current, { opacity: 0, y: -40, duration: 0.5 }, 4.9)
    tl.to(tint2Ref.current, { opacity: 0, duration: 0.4 }, 5.0)
    tl.to(bg4Ref.current, { opacity: 1, duration: 0.6 }, 4.9)
    tl.to(bg3Ref.current, { opacity: 0, duration: 0.5 }, 5.2)
    tl.to(quote1Ref.current, { opacity: 1, duration: 0.5 }, 5.0)

    // ─ 5.5-6.2: STORY 2
    tl.to(quote1Ref.current, { opacity: 0, x: -60, duration: 0.4 }, 5.6)
    tl.to(quote2Ref.current, { opacity: 1, duration: 0.5 }, 5.7)

    // ─ 6.0-6.8: TRANSITION 4→5 — jungle closes in
    tl.to(quote2Ref.current, { opacity: 0, duration: 0.4 }, 6.1)
    tl.to(tint3Ref.current, { opacity: 1, duration: 0.6 }, 6.0)
    tl.to(bg5Ref.current, { opacity: 1, duration: 0.6 }, 6.1)
    tl.to(bg4Ref.current, { opacity: 0, duration: 0.5 }, 6.4)
    tl.to(wildlife1Ref.current, { opacity: 1, duration: 0.5 }, 6.4)

    // ─ 7.0-7.8: ANIMAL 2
    tl.to(wildlife1Ref.current, { opacity: 0, x: -40, duration: 0.4 }, 7.0)
    tl.to(wildlife2Ref.current, { opacity: 1, duration: 0.5 }, 7.1)

    // ─ 7.8-8.5: TRANSITION 5→6 — jungle clears, light breaks
    tl.to(wildlife2Ref.current, { opacity: 0, duration: 0.4 }, 7.8)
    tl.to(tint3Ref.current, { opacity: 0, duration: 0.6 }, 7.8)
    tl.to(bg6Ref.current, { opacity: 1, duration: 0.8 }, 7.8)
    tl.to(bg5Ref.current, { opacity: 0, duration: 0.6 }, 8.1)
    tl.to(tint4Ref.current, { opacity: 1, duration: 0.7 }, 8.0)
    tl.to(closingRef.current, { opacity: 1, duration: 0.6 }, 8.2)
    tl.to(bg6Ref.current, { scale: 1.06, duration: 1 }, 8.2)

    // ── ScrollTrigger scrubs the master timeline ─────────────────
    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
      animation: tl,
    })

    return () => {
      gsap.ticker.remove(rafId)
      lenis.destroy()
      ScrollTrigger.killAll()
      tl.kill()
    }
  }, [])

  const layerBase = 'absolute inset-0 w-full h-full'
  const imgBase = `${layerBase} object-cover`

  return (
    <div ref={wrapperRef} style={{ height: `${SCROLL_PAGES * 100}vh` }}>

      {/* ── PINNED STAGE ─────────────────────────────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-forest">

        {/* ── BACKGROUND ENVIRONMENTS ─── */}

        {/* BG1: Forest canopy — opens the film */}
        <div ref={bg1Ref} className={`${layerBase} will-change-transform`}>
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=90" alt="" className={`${imgBase} scale-110`} style={{ objectPosition: 'center 30%' }} />
        </div>

        {/* BG2: Warmer forest floor — beginning chapter */}
        <div ref={bg2Ref} className={`${layerBase} will-change-transform`}>
          <img src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1920&q=85" alt="" className={imgBase} />
        </div>

        {/* BG3: Dark mysterious — map chapter */}
        <div ref={bg3Ref} className={`${layerBase} will-change-transform`}>
          <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80" alt="" className={`${imgBase} brightness-40`} />
        </div>

        {/* BG4: Cinematic animal portrait — stories */}
        <div ref={bg4Ref} className={`${layerBase} will-change-transform`}>
          <img src="https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=1920&q=90" alt="" className={imgBase} />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/50 to-transparent" />
        </div>

        {/* BG5: Dense jungle — wildlife */}
        <div ref={bg5Ref} className={`${layerBase} will-change-transform`}>
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=85" alt="" className={`${imgBase} scale-110`} />
        </div>

        {/* BG6: Clearing — closing */}
        <div ref={bg6Ref} className={`${layerBase} will-change-transform`}>
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=90" alt="" className={imgBase} style={{ objectPosition: 'center 60%' }} />
          <div className="absolute inset-0 bg-forest/40" />
        </div>

        {/* ── COLOUR TINT OVERLAYS ─────────────────────────── */}

        {/* Warm amber — beginning */}
        <div ref={tint1Ref} className={`${layerBase} pointer-events-none`}
          style={{ background: 'linear-gradient(135deg, rgba(184,147,90,0.35) 0%, rgba(28,43,30,0.6) 100%)' }} />

        {/* Deep indigo — map */}
        <div ref={tint2Ref} className={`${layerBase} pointer-events-none`}
          style={{ background: 'linear-gradient(180deg, rgba(15,20,30,0.85) 0%, rgba(28,43,30,0.9) 100%)' }} />

        {/* Green jungle */}
        <div ref={tint3Ref} className={`${layerBase} pointer-events-none`}
          style={{ background: 'linear-gradient(180deg, rgba(28,43,30,0.7) 0%, rgba(20,40,20,0.85) 100%)' }} />

        {/* Golden clearing */}
        <div ref={tint4Ref} className={`${layerBase} pointer-events-none`}
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(255,210,80,0.18) 0%, rgba(28,43,30,0.65) 100%)' }} />

        {/* Permanent dark gradient at bottom — grounds every scene */}
        <div className={`${layerBase} pointer-events-none`}
          style={{ background: 'linear-gradient(to top, rgba(28,43,30,0.7) 0%, transparent 40%)' }} />

        {/* ── AMBIENT PARTICLES (always visible) ──────────── */}
        <div className={`${layerBase} pointer-events-none overflow-hidden`}>
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gold/20"
              style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
              animate={{ y: [0, -40, 0], opacity: [0.1, 0.5, 0.1], x: [0, 8, 0] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Ambient light ray */}
        <div className={`${layerBase} pointer-events-none overflow-hidden`}>
          <motion.div
            className="absolute top-0 left-[38%] origin-top"
            style={{ width: 1, height: '100%', background: 'linear-gradient(to bottom, rgba(255,220,100,0.3), transparent 60%)', transform: 'rotate(-6deg) scaleX(80)' }}
            animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [60, 90, 60] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 left-[60%] origin-top"
            style={{ width: 1, height: '100%', background: 'linear-gradient(to bottom, rgba(255,220,100,0.15), transparent 40%)', transform: 'rotate(4deg) scaleX(40)' }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, delay: 3, ease: 'easeInOut' }}
          />
        </div>

        {/* ── CONTENT LAYERS ───────────────────────────────── */}

        {/* HERO */}
        <div ref={heroRef} className={`${layerBase} flex flex-col items-center justify-end pb-24 md:pb-32 text-center px-6`}>
          <motion.p className="eyebrow text-gold mb-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            Keeper Exchange and Education Programme
          </motion.p>
          <motion.h1
            className="text-cream font-display font-bold"
            style={{ fontSize: 'clamp(4rem, 13vw, 11rem)', lineHeight: 0.95, letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
            Our Story
          </motion.h1>
          <motion.p className="text-cream/60 text-lg mt-6 max-w-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
            A journey through wildlife conservation, education and global partnerships
          </motion.p>
          <motion.div className="absolute bottom-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
            <span className="text-cream/30 text-xs tracking-[0.3em] uppercase">Scroll</span>
            <motion.div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent"
              animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
          </motion.div>
        </div>

        {/* CHAPTER 1 — THE BEGINNING */}
        <div ref={chapter1Ref} className={`${layerBase} flex items-center px-8 md:px-20 lg:px-32`}>
          <div className="max-w-xl">
            <p className="eyebrow text-gold mb-5">The Beginning · 2014</p>
            <h2 className="font-display text-cream mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05 }}>
              A simple question that changed everything
            </h2>
            <p className="text-cream/65 text-lg leading-relaxed mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              <em>"What if keepers could learn from each other?"</em>
            </p>
            <p className="text-cream/55 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              In a Cambridge staffroom in 2014, that question became KEEP — the UK's first official Zookeeper Exchange Programme. The idea was radical in its simplicity: instead of courses and textbooks, let keepers learn by doing, inside the world's best collections.
            </p>
            <div className="flex gap-3 mt-8">
              {['Cambridge, 2014', '1st exchange ✓', 'Chester Zoo →'].map((note, i) => (
                <div key={i} className="bg-amber-50/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 text-cream/60 text-xs"
                  style={{ transform: `rotate(${[-2, 1.5, -1][i]}deg)`, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PHOTO COLLAGE */}
        <div ref={photosRef} className={`${layerBase} flex items-center justify-center`}>
          <div className="relative w-full h-full">
            {[
              { src: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=500&q=80', cap: 'Chester Zoo 2015', l: '10%', t: '15%', r: -3, s: 'w-52' },
              { src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&q=80', cap: 'Edinburgh 2016', l: '35%', t: '8%', r: 2.5, s: 'w-44' },
              { src: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=500&q=80', cap: 'Longleat 2017', l: '60%', t: '18%', r: -2, s: 'w-56' },
              { src: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=500&q=80', cap: 'Bristol 2018', l: '18%', t: '50%', r: 3, s: 'w-48' },
              { src: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?w=500&q=80', cap: 'Paignton 2019', l: '50%', t: '52%', r: -1.5, s: 'w-52' },
            ].map((p, i) => (
              <motion.div
                key={i}
                className={`absolute ${p.s} shadow-2xl`}
                style={{ left: p.l, top: p.t, transform: `rotate(${p.r}deg)`, zIndex: i + 1 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <div className="bg-white p-2 pb-8">
                  <img src={p.src} alt={p.cap} className="w-full aspect-[4/3] object-cover" style={{ filter: 'saturate(0.8) brightness(0.95)' }} />
                  <p className="text-center text-[10px] text-ink/50 mt-2 italic" style={{ fontFamily: 'Georgia, serif' }}>{p.cap}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WORLD MAP */}
        <div ref={mapLayerRef} className={`${layerBase} flex flex-col items-center justify-center px-8`}>
          <div className="text-center mb-8">
            <p className="eyebrow text-gold mb-3">Growing Around the World</p>
            <h2 className="font-display text-cream text-4xl md:text-5xl">A Network Built on Trust</h2>
          </div>
          <div className="relative w-full max-w-3xl">
            {/* Simple world map SVG */}
            <svg viewBox="0 0 800 420" className="w-full opacity-80">
              {/* Continents */}
              <path d="M80,80 L200,75 L250,110 L260,160 L240,210 L200,240 L170,270 L150,260 L120,230 L90,180 L75,130 Z" fill="#4A6741" opacity="0.45" />
              <path d="M160,270 L230,265 L255,295 L260,340 L240,385 L205,400 L178,385 L162,355 L153,320 L158,295 Z" fill="#4A6741" opacity="0.45" />
              <path d="M330,78 L425,74 L442,95 L438,118 L415,126 L388,120 L362,128 L342,122 L330,108 Z" fill="#4A6741" opacity="0.45" />
              <ellipse cx="370" cy="112" rx="14" ry="20" fill="#8FAF7E" opacity="0.65" />
              <path d="M358,138 L432,133 L462,155 L472,205 L466,252 L450,292 L428,322 L398,336 L372,326 L352,296 L342,254 L338,210 L343,170 Z" fill="#4A6741" opacity="0.45" />
              <path d="M442,72 L685,68 L722,88 L742,118 L720,150 L682,166 L640,162 L600,182 L560,177 L520,192 L490,186 L460,166 L442,138 L440,108 Z" fill="#4A6741" opacity="0.45" />
              <path d="M628,262 L722,258 L752,278 L756,316 L740,346 L710,360 L682,356 L656,336 L638,306 L628,280 Z" fill="#4A6741" opacity="0.45" />
              {/* Connection lines */}
              {connections.map((c, i) => (
                <line
                  key={c.country}
                  ref={el => { lineRefs.current[i] = el }}
                  x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
                  stroke="#B8935A" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8"
                />
              ))}
              {/* Origin dot — UK */}
              <circle cx="388" cy="108" r="6" fill="#D4A96A" />
              <motion.circle cx="388" cy="108" r="12" fill="none" stroke="#D4A96A" strokeWidth="1"
                animate={{ r: [12, 22, 12], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }} />
              {/* Destination dots */}
              {connections.map((c, i) => (
                <g key={c.country}>
                  <circle cx={c.x2} cy={c.y2} r="4" fill="#8FAF7E" opacity="0.9" />
                  <text x={c.x2 + 6} y={c.y2 - 4} fontSize="7" fill="#D4A96A" opacity="0.9" fontFamily="var(--font-inter)">{c.year}</text>
                </g>
              ))}
            </svg>
          </div>
          <div className="flex gap-8 mt-6 text-center">
            {[['24', 'Countries'], ['80+', 'Collections'], ['1,200+', 'Keepers']].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-gold text-3xl font-bold">{n}</p>
                <p className="text-cream/50 text-xs mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QUOTE 1 */}
        <div ref={quote1Ref} className={`${layerBase} flex items-end px-8 md:px-20 pb-24 md:pb-32`}>
          <div className="max-w-lg">
            <div className="text-gold/30 mb-4" style={{ fontSize: '5rem', fontFamily: 'Georgia', lineHeight: 0.5 }}>"</div>
            <blockquote className="font-display text-cream italic leading-snug mb-6"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
              Three weeks. That is all it took to completely change how I approach animal care.
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-gold/50" />
              <div>
                <p className="text-cream text-sm font-semibold">Sarah Mitchell</p>
                <p className="text-sage/60 text-xs">Senior Keeper · Chester Zoo</p>
              </div>
            </div>
          </div>
        </div>

        {/* QUOTE 2 */}
        <div ref={quote2Ref} className={`${layerBase} flex items-end justify-end px-8 md:px-20 pb-24 md:pb-32`}>
          <div className="max-w-lg text-right">
            <div className="text-gold/30 mb-4 text-right" style={{ fontSize: '5rem', fontFamily: 'Georgia', lineHeight: 0.5 }}>"</div>
            <blockquote className="font-display text-cream italic leading-snug mb-6"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
              KEEP gave me access to knowledge I could never have learned from a textbook or training course.
            </blockquote>
            <div className="flex items-center justify-end gap-3">
              <div>
                <p className="text-cream text-sm font-semibold">James Hartley</p>
                <p className="text-sage/60 text-xs">Marine Specialist · SeaLife Brighton</p>
              </div>
              <div className="w-8 h-px bg-gold/50" />
            </div>
          </div>
        </div>

        {/* WILDLIFE 1 */}
        <div ref={wildlife1Ref} className={`${layerBase} flex items-center px-8 md:px-20`}>
          <div className="glass rounded-2xl p-8 max-w-md">
            <p className="text-sage/60 text-sm italic mb-1">Panthera onca</p>
            <h3 className="font-display text-cream text-4xl font-semibold mb-2">Jaguar</h3>
            <p className="text-gold/70 text-xs font-bold uppercase tracking-wider mb-4">● Near Threatened · Central & South America</p>
            <p className="text-cream/65 leading-relaxed text-sm">
              KEEP keeper exchanges have supported jaguar enrichment programme development at three partner collections, directly improving daily care and behavioural wellbeing.
            </p>
          </div>
        </div>

        {/* WILDLIFE 2 */}
        <div ref={wildlife2Ref} className={`${layerBase} flex items-center justify-end px-8 md:px-20`}>
          <div className="glass rounded-2xl p-8 max-w-md">
            <p className="text-sage/60 text-sm italic mb-1">Loxodonta africana</p>
            <h3 className="font-display text-cream text-4xl font-semibold mb-2">African Elephant</h3>
            <p className="text-gold/70 text-xs font-bold uppercase tracking-wider mb-4">● Vulnerable · Sub-Saharan Africa</p>
            <p className="text-cream/65 leading-relaxed text-sm">
              Exchange keepers trained in advanced elephant behaviour returned with social herd management techniques that transformed care at multiple UK collections.
            </p>
          </div>
        </div>

        {/* CLOSING */}
        <div ref={closingRef} className={`${layerBase} flex flex-col items-center justify-center text-center px-8`}>
          {/* Sunlight burst */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: 2, height: '45%', background: 'linear-gradient(to bottom, rgba(255,210,80,0.5), transparent)', transform: 'translateX(-50%) scaleX(120)', transformOrigin: 'top', opacity: 0.6 }} />
          <p className="eyebrow text-gold mb-12">The Story Continues</p>
          <div className="space-y-3 mb-14 max-w-2xl">
            {[
              ['Every exchange creates knowledge.', false],
              ['Every project creates hope.', false],
              ['Every partnership protects wildlife.', false],
              ['Our story is still being written.', true],
            ].map(([line, isGold]) => (
              <motion.p key={line as string}
                className={`font-display leading-tight ${isGold ? 'text-gold italic' : 'text-cream/90'}`}
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}>
                {line as string}
              </motion.p>
            ))}
          </div>
          <Link href="/joining-keep"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-cream font-semibold rounded-xl text-lg hover:bg-gold-light transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/30">
            Become Part of the Story
            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
          <div className="flex items-center gap-8 mt-8">
            <Link href="/listings" className="text-cream/40 hover:text-gold text-sm transition-colors">Browse Placements</Link>
            <span className="w-px h-4 bg-white/15" />
            <Link href="/about/sponsors" className="text-cream/40 hover:text-gold text-sm transition-colors">Support KEEP</Link>
          </div>
        </div>

        {/* Foreground vignette — always present */}
        <div className={`${layerBase} pointer-events-none`}
          style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(20,35,20,0.4) 100%)' }} />

      </div>
    </div>
  )
}
