'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { formatContractType } from '@/lib/utils'
import type { Job } from '@/types'

const sectorImages: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80',
}

interface FeaturedListingsProps {
  jobs: Job[]
}

const placeholderJobs = [
  {
    id: '1',
    title: 'Primate Keeper Exchange',
    location: 'Chester Zoo, UK',
    contract_type: 'contract' as const,
    skills_required: ['Primates', 'Enrichment', 'Behavioural research'],
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=600&q=80',
  },
  {
    id: '2',
    title: 'Marine Mammal Specialist',
    location: 'SeaLife Brighton, UK',
    contract_type: 'full_time' as const,
    skills_required: ['Cetaceans', 'Pinniped', 'Training'],
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600&q=80',
  },
  {
    id: '3',
    title: 'Large Carnivore Exchange',
    location: 'Longleat Safari, UK',
    contract_type: 'contract' as const,
    skills_required: ['Big cats', 'Safety protocols', 'Diet prep'],
    image: 'https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=600&q=80',
  },
]

export function FeaturedListings({ jobs }: FeaturedListingsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const displayJobs = jobs.length > 0 ? jobs : placeholderJobs

  return (
    <section className="section-padding bg-cream" ref={ref}>
      <div className="container-keep">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              className="eyebrow mb-3"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
            >
              Latest Opportunities
            </motion.p>
            <motion.h2
              className="display-md text-forest"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              Featured Placements
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/listings"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-canopy hover:text-gold transition-colors link-underline"
            >
              View all placements <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job: any, i) => (
            <motion.div
              key={job.id}
              className="h-full"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/jobs/${job.id}`}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-stone/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-[16/9] overflow-hidden shrink-0">
                  <img
                    src={job.image ?? sectorImages.default}
                    alt={job.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(job.skills_required ?? []).slice(0, 2).map((s: string) => (
                      <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-mist text-moss border border-sage/20">
                        {s}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display font-semibold text-xl text-forest mb-3 group-hover:text-canopy transition-colors line-clamp-2">
                    {job.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-ink/50">
                    {(job.location || job.employer_profiles?.location) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location ?? job.employer_profiles?.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatContractType(job.contract_type)}
                    </span>
                  </div>

                  <div className="mt-auto pt-5 flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
                    View placement <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm font-medium text-canopy hover:text-gold transition-colors"
          >
            View all placements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
