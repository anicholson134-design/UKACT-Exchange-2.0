import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, formatContractType } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'
import type { Application } from '@/types'

interface ApplicationCardProps {
  application: Application
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const job = application.jobs
  const employer = job?.employer_profiles

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{job?.title ?? 'Unknown job'}</p>
            {employer && <p className="text-sm text-muted-foreground">{employer.company_name}</p>}
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {job?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
          )}
          {job?.contract_type && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatContractType(job.contract_type)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Applied {formatDate(application.created_at)}
        </p>
      </CardContent>
    </Card>
  )
}
