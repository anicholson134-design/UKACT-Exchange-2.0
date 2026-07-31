import Link from 'next/link'
import { MapPin, Clock, CalendarClock, ArrowRight } from 'lucide-react'
import { formatPlacementLength, formatDate, isPastDeadline } from '@/lib/utils'
import type { Job } from '@/types'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=600&q=80'

interface JobCardProps {
  job: Job
  href: string
}

export function JobCard({ job, href }: JobCardProps) {
  const image = job.image_url ?? job.employer_profiles?.logo_url ?? DEFAULT_IMAGE
  const deadlinePassed = isPastDeadline(job.application_deadline)

  return (
    <Link
      href={href}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-stone/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden shrink-0 bg-mist">
        <img
          src={image}
          alt={job.title}
          className={`w-full h-full group-hover:scale-105 transition-transform duration-700 ${
            job.image_url ? 'object-cover' : 'object-contain p-4'
          }`}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Tags */}
        {job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills_required.slice(0, 2).map(s => (
              <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-mist text-moss border border-sage/20">
                {s}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display font-semibold text-xl text-forest mb-3 group-hover:text-canopy transition-colors line-clamp-2">
          {job.title}
        </h3>

        {job.employer_profiles?.company_name && (
          <p className="text-sm text-ink/50 mb-3 -mt-2">{job.employer_profiles.company_name}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink/50">
          {(job.location || job.employer_profiles?.location) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {job.location ?? job.employer_profiles?.location}
            </span>
          )}
          {formatPlacementLength(job) && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatPlacementLength(job)}
            </span>
          )}
          {job.application_deadline && (
            <span className={`flex items-center gap-1.5 ${deadlinePassed ? 'text-red-600' : ''}`}>
              <CalendarClock className="h-3.5 w-3.5" />
              {deadlinePassed ? 'Applications closed' : `Apply by ${formatDate(job.application_deadline)}`}
            </span>
          )}
        </div>

        <div className="mt-auto pt-5 flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
          View placement <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}
