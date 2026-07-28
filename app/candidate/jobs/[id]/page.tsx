'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatSalary, formatContractType, formatDate } from '@/lib/utils'
import { MapPin, Clock, Globe, Building2 } from 'lucide-react'
import type { Job } from '@/types'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()
  const [job, setJob] = useState<Job | null>(null)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase
      .from('jobs')
      .select('*, employer_profiles(company_name, logo_url, location, website, description)')
      .eq('id', id)
      .single()
      .then(({ data }) => setJob(data))

    supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .maybeSingle()
      .then(({ data }) => { if (data) setApplied(true) })
  }, [id])

  async function apply() {
    setApplying(true)
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: id, cover_letter: coverLetter || undefined }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to apply')
    } else {
      toast.success('Application submitted!')
      setApplied(true)
      setShowForm(false)
    }
    setApplying(false)
  }

  if (!job) return <div className="py-20 text-center text-muted-foreground">Loading…</div>

  const emp = job.employer_profiles as (typeof job.employer_profiles & { website?: string; description?: string }) | undefined

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          {emp && <p className="text-lg text-muted-foreground mt-1">{emp.company_name}</p>}
        </div>
        <StatusBadge status={job.status} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {(job.location || job.remote) && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />{job.remote ? 'Remote' : job.location}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />{formatContractType(job.contract_type)}
        </span>
        {emp?.website && (
          <a href={emp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground">
            <Globe className="h-4 w-4" />Company website
          </a>
        )}
      </div>

      {(job.salary_min || job.salary_max) && (
        <p className="text-lg font-semibold">{formatSalary(job.salary_min, job.salary_max)}</p>
      )}

      {job.skills_required.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills_required.map(s => (
            <span key={s} className="text-sm bg-secondary text-secondary-foreground rounded-full px-3 py-1">{s}</span>
          ))}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>Job Description</CardTitle></CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">{job.description}</div>
        </CardContent>
      </Card>

      {emp?.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />About {emp.company_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{emp.description}</p>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">Posted {formatDate(job.created_at)}</p>

      {job.status === 'active' && (
        <div className="space-y-3">
          {applied ? (
            <p className="text-sm text-green-600 font-medium">✓ You have applied to this job</p>
          ) : showForm ? (
            <div className="space-y-3 border rounded-lg p-4">
              <label className="text-sm font-medium">Cover letter (optional)</label>
              <textarea
                rows={5}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
                placeholder="Tell the employer why you're a great fit…"
              />
              <div className="flex gap-2">
                <Button onClick={apply} disabled={applying}>
                  {applying ? 'Submitting…' : 'Submit application'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button size="lg" onClick={() => setShowForm(true)}>Apply now</Button>
          )}
        </div>
      )}
    </div>
  )
}
