'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageThread } from '@/components/shared/MessageThread'
import { FileText, Mail, ChevronDown, Eye, MessageSquare } from 'lucide-react'
import type { ApplicationStatus } from '@/types'

interface EnrichedApplication {
  id: string
  created_at: string
  status: ApplicationStatus
  cv_url: string | null
  cvSignedUrl: string | null
  cover_letter: string | null
  considerations: string | null
  candidate_id: string
  profile: { id: string; full_name: string; avatar_url: string | null } | null
  email: string | null
  unreadCount?: number
}

interface Props {
  applications: EnrichedApplication[]
  currentUserId?: string
  enableMessaging?: boolean
}

export function ApplicantTable({ applications: initial, currentUserId, enableMessaging = true }: Props) {
  const router = useRouter()
  const [applications, setApplications] = useState(initial)
  const [selected, setSelected] = useState<EnrichedApplication | null>(null)

  async function updateStatus(id: string, status: ApplicationStatus) {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) { toast.error('Failed to update status'); return }

    if (status === 'hired') {
      // Accepting this candidate auto-rejects every other still-open applicant server-side —
      // refresh so the rest of the table picks up their new status too.
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : (a.status === 'rejected' || a.status === 'hired') ? a : { ...a, status: 'rejected' }))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev)
      toast.success('Candidate accepted — other applicants notified they were unsuccessful')
      router.refresh()
      return
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : prev)
    toast.success('Status updated')
  }

  if (!applications.length) {
    return <p className="text-muted-foreground text-sm py-10 text-center">No applications yet.</p>
  }

  return (
    <>
      <div className="rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Applicant</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Applied</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">CV</th>
              <th className="text-left px-4 py-3 font-medium">Update</th>
              <th className="text-left px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => {
              const name = app.profile?.full_name ?? 'Unknown'
              return (
                <tr key={app.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">

                  {/* Applicant name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={app.profile?.avatar_url ?? ''} />
                        <AvatarFallback className="text-xs bg-mist text-moss">
                          {name !== 'Unknown' ? name.slice(0, 2).toUpperCase() : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">
                    {app.email ? (
                      <a
                        href={`mailto:${app.email}`}
                        className="flex items-center gap-1.5 text-canopy hover:text-gold transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[180px]">{app.email}</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(app.created_at)}
                  </td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>

                  {/* CV download */}
                  <td className="px-4 py-3">
                    {app.cvSignedUrl ? (
                      <a
                        href={app.cvSignedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-canopy hover:text-gold transition-colors font-medium"
                      >
                        <FileText className="h-4 w-4" />
                        View CV
                      </a>
                    ) : app.cv_url ? (
                      <a
                        href={app.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-canopy hover:text-gold transition-colors font-medium"
                      >
                        <FileText className="h-4 w-4" />
                        View CV
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">No CV</span>
                    )}
                  </td>

                  {/* Status update dropdown */}
                  <td className="px-4 py-3">
                    <Select
                      value={app.status}
                      onValueChange={v => updateStatus(app.id, v as ApplicationStatus)}
                    >
                      <SelectTrigger className="w-34 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* View details */}
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelected(app)
                        if (app.unreadCount) {
                          setApplications(prev => prev.map(a => a.id === app.id ? { ...a, unreadCount: 0 } : a))
                        }
                      }}
                      className="relative gap-1.5 text-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                      {!!app.unreadCount && (
                        <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-gold text-cream text-[10px] font-semibold flex items-center justify-center">
                          {app.unreadCount}
                        </span>
                      )}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Application detail modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-forest">
                  {selected.profile?.full_name ?? 'Applicant'}&apos;s Application
                </DialogTitle>
                {selected.email && (
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-1.5 text-sm text-canopy hover:text-gold transition-colors mt-1"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {selected.email}
                  </a>
                )}
              </DialogHeader>

              <div className="space-y-5 pt-2">

                {/* Status + CV row */}
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-mist border border-stone/20">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={selected.status} />
                    <span className="text-xs text-ink/50">Applied {formatDate(selected.created_at)}</span>
                  </div>
                  {(selected.cvSignedUrl || selected.cv_url) && (
                    <a
                      href={selected.cvSignedUrl ?? selected.cv_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-canopy hover:text-gold transition-colors shrink-0"
                    >
                      <FileText className="h-4 w-4" />
                      Download CV
                    </a>
                  )}
                </div>

                {/* Cover letter */}
                {selected.cover_letter ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-forest">Cover letter</p>
                    <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-wrap bg-cream/60 border border-stone/20 rounded-xl p-4">
                      {selected.cover_letter}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-forest">Cover letter</p>
                    <p className="text-sm text-ink/40 italic">No cover letter provided</p>
                  </div>
                )}

                {/* Considerations */}
                {selected.considerations ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-forest">Other considerations</p>
                    <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-wrap bg-cream/60 border border-stone/20 rounded-xl p-4">
                      {selected.considerations}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-forest">Other considerations</p>
                    <p className="text-sm text-ink/40 italic">None provided</p>
                  </div>
                )}

                {/* Update status from modal */}
                <div className="space-y-2 pt-1">
                  <p className="text-sm font-semibold text-forest">Update status</p>
                  <Select
                    value={selected.status}
                    onValueChange={v => updateStatus(selected.id, v as ApplicationStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Messages */}
                {enableMessaging && currentUserId && (
                  <div className="space-y-2 pt-1">
                    <p className="text-sm font-semibold text-forest flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" /> Messages
                    </p>
                    <MessageThread
                      applicationId={selected.id}
                      currentUserId={currentUserId}
                      otherPartyName={selected.profile?.full_name ?? 'the applicant'}
                    />
                  </div>
                )}

                {/* Quick email button */}
                {selected.email && (
                  <a
                    href={`mailto:${selected.email}?subject=Your UKACT application`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-canopy/30 text-sm font-medium text-canopy hover:bg-canopy hover:text-cream transition-all"
                  >
                    <Mail className="h-4 w-4" />
                    Email {selected.profile?.full_name?.split(' ')[0] ?? 'applicant'}
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
