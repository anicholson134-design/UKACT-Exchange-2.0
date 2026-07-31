'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MessageThread } from '@/components/shared/MessageThread'
import { formatDate, formatContractType } from '@/lib/utils'
import { MapPin, Clock, MessageSquare } from 'lucide-react'
import type { Application } from '@/types'

interface ApplicationCardProps {
  application: Application
  currentUserId: string
  unreadCount?: number
}

export function ApplicationCard({ application, currentUserId, unreadCount = 0 }: ApplicationCardProps) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(unreadCount)
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
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            Applied {formatDate(application.created_at)}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setOpen(true); setUnread(0) }}
            className="relative gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Messages
            {!!unread && (
              <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-gold text-cream text-[10px] font-semibold flex items-center justify-center">
                {unread}
              </span>
            )}
          </Button>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-forest">
              {employer?.company_name ?? 'Collection'}
            </DialogTitle>
          </DialogHeader>
          <MessageThread
            applicationId={application.id}
            currentUserId={currentUserId}
            otherPartyName={employer?.company_name ?? 'the collection'}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
