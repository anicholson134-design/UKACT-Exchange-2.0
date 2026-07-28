'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Shield, Users, TrendingUp, Heart, Layers, Award, BookOpen, Lightbulb, Megaphone, Monitor, Microscope, Database, FileText, Network } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Globe, Shield, Users, TrendingUp, Heart, Layers, Award,
  BookOpen, Lightbulb, Megaphone, Monitor, Microscope, Database, FileText, Network,
}

interface Benefit {
  icon: string
  title: string
  desc: string
}

export function SectorBenefits({ benefits }: { benefits: Benefit[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="section-padding bg-cream">
      <div className="container-keep">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-3">Why Join</p>
          <h2 className="display-md text-forest">Four reasons to get involved</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = iconMap[b.icon] ?? Globe
            return (
              <motion.div
                key={b.title}
                className="group bg-white rounded-2xl p-8 border border-stone/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                initial={{ opacity: 0, y: 36 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-14 h-14 rounded-xl bg-mist flex items-center justify-center mb-5 group-hover:bg-canopy/10 transition-colors">
                  <Icon className="h-6 w-6 text-moss" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-xl text-forest mb-3">{b.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{b.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
