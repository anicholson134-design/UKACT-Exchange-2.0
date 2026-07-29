'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Job } from '@/types'

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState('pending_review')
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/jobs?status=${filter}`)
      .then(r => r.json())
      .then(data => setJobs(data.jobs ?? []))
  }, [filter])

  async function moderate(jobId: string, action: 'active' | 'rejected' | 'closed') {
    setLoading(jobId)
    const res = await fetch(`/api/admin/jobs/${jobId}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (res.ok) {
      toast.success(`Job ${action}`)
      setJobs(prev => prev.filter(j => j.id !== jobId))
    } else {
      toast.error('Action failed')
    }
    setLoading(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jobs Moderation</h1>
        <div className="flex gap-2">
          {(['pending_review', 'active', 'rejected'] as const).map(s => (
            <Button key={s} size="sm" variant={filter === s ? 'default' : 'outline'} onClick={() => setFilter(s)}>
              {s === 'pending_review' ? 'Pending' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Posted</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/jobs/${job.id}`} className="hover:underline hover:text-primary">
                    {job.title}
                  </Link>
                  {(job as any).employer_profiles?.company_name && (
                    <p className="text-xs text-muted-foreground font-normal">{(job as any).employer_profiles.company_name}</p>
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(job.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {job.status === 'pending_review' && (
                      <>
                        <Button size="sm" onClick={() => moderate(job.id, 'active')} disabled={loading === job.id}>
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => moderate(job.id, 'rejected')} disabled={loading === job.id}>
                          Reject
                        </Button>
                      </>
                    )}
                    {job.status === 'active' && (
                      <Button size="sm" variant="outline" onClick={() => moderate(job.id, 'closed')} disabled={loading === job.id}>
                        Close
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!jobs.length && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No jobs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
