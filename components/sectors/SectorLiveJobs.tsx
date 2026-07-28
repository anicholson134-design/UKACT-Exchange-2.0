'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowRight, Briefcase } from 'lucide-react'
import { formatContractType, formatDate } from '@/lib/utils'
import type { Job } from '@/types'

export function SectorLiveJobs({ sectorTag }: { sectorTag: string }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs?page=1')
      .then(r => r.json())
      .then(data => {
        // Filter by sector tag or show all if no matches
        const all: Job[] = data.jobs ?? []
        const filtered = all.filter((j: Job) =>
          j.skills_required?.some(s => s.toLowerCase().includes(sectorTag.toLowerCase()))
        )
        setJobs(filtered.length > 0 ? filtered.slice(0, 4) : all.slice(0, 4))
      })
      .finally(() => setLoading(false))
  }, [sectorTag])

  return (
    <section className="section-padding bg-cream">
      <div className="container-keep">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Live Opportunities</p>
            <h2 className="display-md text-forest">Current Placements</h2>
          </div>
          <Link href="/listings" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-canopy hover:text-gold transition-colors">
            View all placements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone/20 p-6 animate-pulse">
                <div className="h-4 bg-stone/20 rounded w-3/4 mb-3" />
                <div className="h-3 bg-stone/10 rounded w-1/2 mb-4" />
                <div className="h-3 bg-stone/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/jobs/${job.id}`}
                  className="group block bg-white rounded-2xl border border-stone/20 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <h3 className="font-display font-semibold text-xl text-forest group-hover:text-canopy transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                      Live
                    </span>
                  </div>

                  {(job.employer_profiles as any)?.company_name && (
                    <p className="text-sm text-ink/50 mb-3">{(job.employer_profiles as any).company_name}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-ink/50 mb-4">
                    {job.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> {job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {formatContractType(job.contract_type)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" /> Posted {formatDate(job.created_at)}
                    </span>
                  </div>

                  {job.skills_required?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills_required.slice(0, 3).map(s => (
                        <span key={s} className="text-xs px-2.5 py-0.5 rounded-full bg-mist text-moss border border-sage/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
                    View placement <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-stone/20 bg-white">
            <Briefcase className="h-10 w-10 text-stone mx-auto mb-4" strokeWidth={1} />
            <h3 className="font-display text-2xl text-forest mb-2">No placements live yet</h3>
            <p className="text-ink/50 mb-6">New opportunities are added regularly — set up an alert to be notified.</p>
            <Link href="/register/candidate" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-cream font-medium rounded-lg text-sm hover:bg-gold-light transition-colors">
              Get notified of new placements
            </Link>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/listings" className="inline-flex items-center gap-2 text-sm font-medium text-canopy hover:text-gold transition-colors">
            View all placements <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
