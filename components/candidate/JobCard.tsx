import Link from 'next/link'
import { MapPin, Clock, Bookmark } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatSalary, formatContractType, formatDate } from '@/lib/utils'
import type { Job } from '@/types'

interface JobCardProps {
  job: Job
  href: string
  saved?: boolean
}

export function JobCard({ job, href, saved }: JobCardProps) {
  const image = job.image_url ?? job.employer_profiles?.logo_url

  return (
    <Card className="hover:shadow-md transition-shadow">
      {job.image_url && (
        <img src={job.image_url} alt={job.title} className="aspect-[16/9] w-full object-cover" />
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {!job.image_url && image && (
              <img src={image} alt="" className="h-9 w-9 rounded-md object-contain border shrink-0 bg-white" />
            )}
            <div className="flex-1 min-w-0">
              <Link href={href} className="font-semibold text-lg hover:text-primary line-clamp-1">
                {job.title}
              </Link>
              {job.employer_profiles && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.employer_profiles.company_name}
                </p>
              )}
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {(job.location || job.remote) && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.remote ? 'Remote' : job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatContractType(job.contract_type)}
          </span>
        </div>

        {(job.salary_min || job.salary_max) && (
          <p className="text-sm font-medium">{formatSalary(job.salary_min, job.salary_max)}</p>
        )}

        {job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills_required.slice(0, 4).map(skill => (
              <span key={skill} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5">
                {skill}
              </span>
            ))}
            {job.skills_required.length > 4 && (
              <span className="text-xs text-muted-foreground">+{job.skills_required.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">{formatDate(job.created_at)}</span>
          <Button size="sm" asChild>
            <Link href={href}>View job</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
