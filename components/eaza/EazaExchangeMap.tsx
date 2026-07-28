'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react'

const ZOOM_FACTOR = 1.5
const MIN_HALF_LON = 1.5
const MAX_HALF_LON = 180
const MIN_HALF_LAT = 1
const MAX_HALF_LAT = 90

interface ExchangeSite {
  name: string
  lon: number
  lat: number
  count: number
  intl?: boolean
}

// Real KEEP exchange data — name, longitude, latitude, number of exchanges
const DATA: ExchangeSite[] = [
  { name: 'RZSS Edinburgh Zoo', lon: -3.1863, lat: 55.9425, count: 2 },
  { name: 'Fife Zoo', lon: -3.0086, lat: 56.3159, count: 1 },
  { name: 'Northumberland Zoo', lon: -1.5900, lat: 55.1500, count: 2 },
  { name: 'Folly Farm', lon: -4.7135, lat: 51.7677, count: 5 },
  { name: 'Shepreth Wildlife Park', lon: 0.0170, lat: 52.1480, count: 4 },
  { name: "St Andrew's Aquarium", lon: -2.7967, lat: 56.3398, count: 3 },
  { name: 'White Post Farm', lon: -1.0660, lat: 53.1290, count: 2 },
  { name: 'Woburn Safari Park', lon: -0.6050, lat: 51.9880, count: 2 },
  { name: 'Puxton Park', lon: -2.8470, lat: 51.3480, count: 1 },
  { name: 'Welsh Mountain Zoo', lon: -3.7250, lat: 53.2950, count: 1 },
  { name: 'Becky Falls Woodland Park', lon: -3.7890, lat: 50.5860, count: 1 },
  { name: 'Hobbledown / Hobbledown Heath', lon: -0.2830, lat: 51.3250, count: 5 },
  { name: 'Tattershall Farm Park', lon: -0.2040, lat: 53.1080, count: 1 },
  { name: 'Lotherton Wildlife Park', lon: -1.3540, lat: 53.8260, count: 2 },
  { name: 'Mablethorpe Seal Sanctuary', lon: 0.2590, lat: 53.3430, count: 1 },
  { name: 'Flamingo Land', lon: -0.9090, lat: 54.2210, count: 2 },
  { name: 'Filey Bird Garden & Animal Park', lon: -0.2880, lat: 54.2070, count: 1 },
  { name: 'Drayton Manor Zoo', lon: -1.7160, lat: 52.6240, count: 1 },
  { name: 'Thrigby Wildlife Gardens', lon: 1.6600, lat: 52.6390, count: 1 },
  { name: 'Hertfordshire Zoo', lon: -0.0210, lat: 51.7500, count: 5 },
  { name: 'ZSL Whipsnade Zoo', lon: -0.5490, lat: 51.8670, count: 5 },
  { name: 'Paradise Wildlife Park', lon: -0.0240, lat: 51.7530, count: 2 },
  { name: 'Colchester Zoo', lon: 0.8670, lat: 51.8590, count: 5 },
  { name: 'Tilgate Nature Centre', lon: -0.1760, lat: 51.0980, count: 1 },
  { name: 'Chester Zoo', lon: -2.8858, lat: 53.2405, count: 27 },
  { name: 'Askham Bryan Wildlife & Conservation Park', lon: -1.1640, lat: 53.9110, count: 3 },
  { name: 'Beale Park', lon: -1.1350, lat: 51.5410, count: 1 },
  { name: 'Howletts Wild Animal Park', lon: 1.0620, lat: 51.2760, count: 8 },
  { name: 'Longleat Safari Park', lon: -2.2760, lat: 51.1740, count: 2 },
  { name: 'Drusillas Park', lon: 0.0310, lat: 50.8580, count: 1 },
  { name: 'Battersea Park Zoo', lon: -0.1570, lat: 51.4790, count: 4 },
  { name: 'Chessington World of Adventures', lon: -0.3204, lat: 51.3484, count: 5 },
  { name: 'Call of the Wild Zoo', lon: 0.7710, lat: 52.8270, count: 3 },
  { name: 'Sealife Adventure (Southend)', lon: 0.7120, lat: 51.5360, count: 1 },
  { name: 'Sealife Weymouth', lon: -2.4570, lat: 50.6090, count: 1 },
  { name: 'Wildwood Trust', lon: 0.9600, lat: 51.2630, count: 1 },
  { name: 'Tropical Butterfly House', lon: -1.1990, lat: 53.3390, count: 1 },
  { name: 'New Forest Wildlife Park', lon: -1.6650, lat: 50.8490, count: 3 },
  { name: 'West Midlands Safari Park', lon: -2.3340, lat: 52.3970, count: 8 },
  { name: 'Peak Wildlife Park', lon: -1.9850, lat: 52.9870, count: 2 },
  { name: 'Dudley Zoo', lon: -2.0830, lat: 52.5120, count: 3 },
  { name: 'East Park Animal Education Centre', lon: -2.0860, lat: 52.5920, count: 1 },
  { name: 'Sealife Birmingham', lon: -1.8980, lat: 52.4780, count: 1 },
  { name: 'Suffolk Owl Sanctuary', lon: 1.3360, lat: 52.1670, count: 1 },
  { name: 'Stratford Butterfly Farm', lon: -1.7060, lat: 52.1960, count: 1 },
  { name: 'Manor Farm HCC', lon: -1.2350, lat: 50.8830, count: 1 },
  { name: 'Fota Wildlife Park', lon: -8.3000, lat: 51.8910, count: 1, intl: true },
  { name: 'Branféré Zoo', lon: -2.4430, lat: 47.5640, count: 2, intl: true },
  { name: 'Bioparco di Roma', lon: 12.4810, lat: 41.9190, count: 3, intl: true },
  { name: "Save Vietnam's Wildlife", lon: 105.6100, lat: 20.2400, count: 1, intl: true },
  { name: 'Toucan Rescue Ranch', lon: -84.0370, lat: 10.0520, count: 3, intl: true },
  { name: 'San Diego Zoo', lon: -117.1490, lat: 32.7353, count: 2, intl: true },
]

const INTL_COUNT = DATA.filter(d => d.intl).length
const UK_COUNT = DATA.length - INTL_COUNT

// Initial view fitted to the data's own bounding box, with a little breathing
// room. Deterministic and independent of Plotly's internal fitbounds state,
// so the same numbers can be reused as the starting point for manual zoom.
const LONS = DATA.map(d => d.lon)
const LATS = DATA.map(d => d.lat)
const LON_PAD = (Math.max(...LONS) - Math.min(...LONS)) * 0.12
const LAT_PAD = (Math.max(...LATS) - Math.min(...LATS)) * 0.18
const INITIAL_LON_RANGE: [number, number] = [Math.min(...LONS) - LON_PAD, Math.max(...LONS) + LON_PAD]
const INITIAL_LAT_RANGE: [number, number] = [Math.min(...LATS) - LAT_PAD, Math.max(...LATS) + LAT_PAD]

// Mobile gets a portrait container so the map takes up more of the screen.
// The full network (UK to Vietnam/Costa Rica/USA) is landscape-shaped, so
// starting zoomed in on the UK/Europe cluster — and padding it out taller —
// gives a view whose proportions actually suit a portrait box. The far
// outliers are still reachable with the zoom-out button.
const FAR_OUTLIERS = new Set(["Save Vietnam's Wildlife", 'Toucan Rescue Ranch', 'San Diego Zoo'])
const NEAR_DATA = DATA.filter(d => !FAR_OUTLIERS.has(d.name))
const NEAR_LONS = NEAR_DATA.map(d => d.lon)
const NEAR_LATS = NEAR_DATA.map(d => d.lat)
const NEAR_LON_PAD = (Math.max(...NEAR_LONS) - Math.min(...NEAR_LONS)) * 0.15
const NEAR_LAT_PAD = (Math.max(...NEAR_LATS) - Math.min(...NEAR_LATS)) * 0.68
const MOBILE_LON_RANGE: [number, number] = [Math.min(...NEAR_LONS) - NEAR_LON_PAD, Math.max(...NEAR_LONS) + NEAR_LON_PAD]
const MOBILE_LAT_RANGE: [number, number] = [Math.min(...NEAR_LATS) - NEAR_LAT_PAD, Math.max(...NEAR_LATS) + NEAR_LAT_PAD]

function bucket(n: number): { label: string; color: string } {
  if (n >= 20) return { label: '20+', color: '#7A4A1E' }
  if (n >= 10) return { label: '10–19', color: '#B8935A' }
  if (n >= 5) return { label: '5–9', color: '#D4A96A' }
  if (n >= 2) return { label: '2–4', color: '#E4C68C' }
  return { label: '1', color: '#F0E3C8' }
}

const BUCKET_ORDER = ['20+', '10–19', '5–9', '2–4', '1']
const BUCKET_SIZE: Record<string, number> = { '20+': 24, '10–19': 18, '5–9': 14, '2–4': 10, '1': 7 }
const BUCKET_COLOR: Record<string, string> = { '20+': '#7A4A1E', '10–19': '#B8935A', '5–9': '#D4A96A', '2–4': '#E4C68C', '1': '#F0E3C8' }

export function EazaExchangeMap() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const plotlyRef = useRef<typeof import('plotly.js-geo-dist-min').default | null>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-10%' })
  const [loaded, setLoaded] = useState(false)

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const Plotly = plotlyRef.current
    const plotEl = plotRef.current
    if (!Plotly || !plotEl) return
    const fullLayout = (plotEl as unknown as { _fullLayout?: { geo?: { lonaxis?: { range?: [number, number] }; lataxis?: { range?: [number, number] } } } })._fullLayout
    const geo = fullLayout?.geo
    const lonRange = geo?.lonaxis?.range
    const latRange = geo?.lataxis?.range
    if (!lonRange || !latRange) return

    const factor = direction === 'in' ? 1 / ZOOM_FACTOR : ZOOM_FACTOR
    const lonMid = (lonRange[0] + lonRange[1]) / 2
    const latMid = (latRange[0] + latRange[1]) / 2
    const lonHalf = Math.min(Math.max(((lonRange[1] - lonRange[0]) / 2) * factor, MIN_HALF_LON), MAX_HALF_LON)
    const latHalf = Math.min(Math.max(((latRange[1] - latRange[0]) / 2) * factor, MIN_HALF_LAT), MAX_HALF_LAT)

    // Clip to valid domain bounds — an out-of-range lataxis (beyond ±90) breaks
    // Plotly's basemap rendering entirely (land/ocean disappear), so zooming
    // out near the poles must stop at the pole rather than overshoot it.
    const newLonRange: [number, number] = [Math.max(lonMid - lonHalf, -180), Math.min(lonMid + lonHalf, 180)]
    const newLatRange: [number, number] = [Math.max(latMid - latHalf, -90), Math.min(latMid + latHalf, 90)]

    Plotly.relayout(plotEl, {
      'geo.lonaxis.range': newLonRange,
      'geo.lataxis.range': newLatRange,
    })
  }, [])

  useEffect(() => {
    const plotEl = plotRef.current
    if (!inView || !plotEl) return
    let cancelled = false
    let plotly: typeof import('plotly.js-geo-dist-min').default | null = null
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    // Matches the `sm:` breakpoint below, where the container switches from
    // portrait back to landscape.
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 640

    import('plotly.js-geo-dist-min').then((mod) => {
      if (cancelled) return
      const Plotly = mod.default
      plotly = Plotly
      plotlyRef.current = Plotly

      const groups: Record<string, { lon: number[]; lat: number[]; text: string[]; color: string }> = {}
      BUCKET_ORDER.forEach(l => { groups[l] = { lon: [], lat: [], text: [], color: '' } })

      DATA.forEach(site => {
        const b = bucket(site.count)
        groups[b.label].lon.push(site.lon)
        groups[b.label].lat.push(site.lat)
        groups[b.label].text.push(`${site.name} (${site.count})`)
        groups[b.label].color = b.color
      })

      const traces = BUCKET_ORDER.filter(l => groups[l].lon.length > 0).map(l => ({
        type: 'scattergeo',
        mode: 'markers',
        name: l,
        lon: groups[l].lon,
        lat: groups[l].lat,
        text: groups[l].text,
        hoverinfo: 'text',
        marker: {
          color: groups[l].color,
          size: BUCKET_SIZE[l],
          line: { color: '#1C2B1E', width: 0.75 },
          opacity: 0.92,
        },
      }))

      const layout = {
        geo: {
          scope: 'world',
          projection: { type: 'natural earth' },
          lonaxis: { range: isMobileViewport ? MOBILE_LON_RANGE : INITIAL_LON_RANGE },
          lataxis: { range: isMobileViewport ? MOBILE_LAT_RANGE : INITIAL_LAT_RANGE },
          showland: true,
          landcolor: '#F0EDE6',
          showocean: true,
          oceancolor: '#DCE6DC',
          showcountries: true,
          countrycolor: '#FDFAF5',
          countrywidth: 0.6,
          showcoastlines: true,
          coastlinecolor: '#C4B49A',
          resolution: 50,
          bgcolor: 'transparent',
        },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        showlegend: false,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'var(--font-inter), sans-serif' },
        autosize: true,
      }

      Plotly.newPlot(plotEl, traces as never, layout as never, {
        responsive: true,
        displaylogo: false,
        displayModeBar: false,
        // Wheel/trackpad zoom stays off so the map never traps desktop scroll,
        // but touch devices get pinch-to-zoom since there's no scroll conflict.
        scrollZoom: isTouchDevice,
      }).then(() => {
        if (!cancelled) setLoaded(true)
      })
    })

    return () => {
      cancelled = true
      plotlyRef.current = null
      if (plotly) plotly.purge(plotEl)
    }
  }, [inView])

  return (
    <section className="section-padding bg-mist" ref={sectionRef}>
      <div className="container-keep">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-4">Our Network</p>
          <h2 className="display-md text-forest mb-4">KEEP Exchange Network</h2>
          <p className="text-ink/60 max-w-xl mx-auto leading-relaxed">
            {UK_COUNT} UK collections and {INTL_COUNT} international partners have taken part in
            exchanges so far — zoom, pan and hover any marker to explore the network.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-3xl overflow-hidden bg-card ring-1 ring-stone/30 shadow-xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Aspect ratios are tuned to match what Plotly actually renders for
              each lon/lat range (measured empirically), so the map fills the
              card edge-to-edge instead of leaving letterboxed margins.
              touch-none stops the browser's own pinch-to-zoom from hijacking
              the gesture here, so a pinch zooms the map (via Plotly's touch
              handling) instead of the whole page. */}
          <div ref={plotRef} className="w-full touch-none aspect-[0.68/1] sm:aspect-[3.64/1]" />

          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <Loader2 className="h-6 w-6 text-canopy animate-spin" />
            </div>
          )}

          {loaded && (
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleZoom('in')}
                aria-label="Zoom in"
                className="w-9 h-9 rounded-full bg-card/95 ring-1 ring-stone/40 shadow-md text-forest hover:text-gold hover:ring-gold/40 flex items-center justify-center transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom('out')}
                aria-label="Zoom out"
                className="w-9 h-9 rounded-full bg-card/95 ring-1 ring-stone/40 shadow-md text-forest hover:text-gold hover:ring-gold/40 flex items-center justify-center transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Custom legend — consistent styling across all breakpoints */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
          {BUCKET_ORDER.map(label => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="rounded-full shrink-0"
                style={{
                  background: BUCKET_COLOR[label],
                  width: `${8 + BUCKET_SIZE[label] * 0.3}px`,
                  height: `${8 + BUCKET_SIZE[label] * 0.3}px`,
                }}
              />
              <span className="text-sm text-ink/60">{label} exchange{label !== '1' ? 's' : ''}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-ink/40 mt-4">
          Numbers in brackets show total exchanges involving each collection.
        </p>
      </div>
    </section>
  )
}
