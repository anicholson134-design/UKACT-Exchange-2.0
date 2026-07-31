'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { jobSchema, type JobInput } from '@/lib/validations/job'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageField } from '@/components/admin/settings/ImageField'
import { DateRangeCalendar } from '@/components/employer/DateRangeCalendar'
import type { Job } from '@/types'

interface JobFormProps {
  job?: Job
  employerLocation?: string | null
  redirectTo?: string
}

export function JobForm({ job, employerLocation, redirectTo = '/employer/jobs' }: JobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>(job?.skills_required ?? [])
  const [imageUrl, setImageUrl] = useState(job?.image_url ?? '')
  const [flexible, setFlexible] = useState(job?.flexible_dates ?? false)
  const [flexDuration, setFlexDuration] = useState(job?.flexible_duration_days ? String(job.flexible_duration_days) : '')
  const [startDate, setStartDate] = useState(job?.start_date ?? '')
  const [endDate, setEndDate] = useState(job?.expires_at ? job.expires_at.split('T')[0] : '')

  const { register, handleSubmit, formState: { errors } } = useForm<JobInput>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: job
      ? {
          title: job.title,
          description: job.description,
          location: job.location ?? employerLocation ?? '',
          application_deadline: job.application_deadline ? job.application_deadline.split('T')[0] : '',
          skills_required: job.skills_required,
        }
      : {
          location: employerLocation ?? '',
          skills_required: [],
        },
  })

  function addSkill() {
    const s = skillInput.trim()
    if (s && !skills.includes(s)) {
      const next = [...skills, s]
      setSkills(next)
    }
    setSkillInput('')
  }

  function removeSkill(s: string) {
    setSkills(prev => prev.filter(x => x !== s))
  }

  async function onSubmit(data: JobInput) {
    setLoading(true)
    const method = job ? 'PATCH' : 'POST'
    const url = job ? `/api/jobs/${job.id}` : '/api/jobs'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        skills_required: skills,
        image_url: imageUrl || null,
        start_date: startDate || null,
        expires_at: endDate || null,
        flexible_dates: flexible,
        flexible_duration_days: flexible && flexDuration ? Number(flexDuration) : null,
        // Always set contract_type to 'contract' for exchanges
        contract_type: 'contract',
        remote: false,
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      toast.error(result.error ?? 'Failed to save listing')
    } else {
      toast.success(job ? 'Listing updated' : 'Listing submitted for review')
      router.push(redirectTo)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Placement title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g. Carnivore Keeper"
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          {...register('description')}
          rows={8}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
          placeholder="Describe the placement, what the keeper will learn, daily responsibilities, species involved…"
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      {/* Exchange dates */}
      <div className="space-y-3">
        <Label>Exchange dates *</Label>
        <div className="inline-flex rounded-lg border border-input p-1 bg-muted/40">
          <button
            type="button"
            onClick={() => setFlexible(false)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${!flexible ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}
          >
            Fixed dates
          </button>
          <button
            type="button"
            onClick={() => setFlexible(true)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${flexible ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}
          >
            Flexible
          </button>
        </div>

        {flexible && (
          <div className="space-y-1.5 max-w-[160px]">
            <span className="text-xs text-muted-foreground">Exchange length (days)</span>
            <Input
              type="number"
              min={1}
              value={flexDuration}
              onChange={e => setFlexDuration(e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
        )}

        <DateRangeCalendar startDate={startDate} endDate={endDate} onChange={(s, e) => { setStartDate(s); setEndDate(e) }} />

        <p className="text-xs text-muted-foreground">
          {flexible
            ? 'Select the window candidates can choose their dates within — click a start day, then an end day.'
            : 'Click your start date, then your end date.'}
        </p>
      </div>

      {/* Application deadline */}
      <div className="space-y-2">
        <Label htmlFor="application_deadline">Application deadline</Label>
        <Input
          id="application_deadline"
          type="date"
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore
          {...register('application_deadline')}
        />
        <p className="text-xs text-muted-foreground">
          Last day candidates can apply. Leave blank to accept applications until the placement starts.
        </p>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Collection address</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="e.g. Chester Zoo, Cedar House, Caughall Road, Chester, CH2 1LH"
        />
        <p className="text-xs text-muted-foreground">
          Pre-filled from your collection profile. Update if the keeper should report to a different address.
        </p>
      </div>

      {/* Placement photo */}
      <div className="space-y-2">
        <ImageField label="Placement photo" value={imageUrl} onChange={setImageUrl} />
        <p className="text-xs text-muted-foreground">
          Shown on the placement card and detail page. Falls back to your collection&apos;s logo if left blank.
        </p>
      </div>

      {/* Required skills / experience */}
      <div className="space-y-2">
        <Label>Requirements &amp; experience</Label>
        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            placeholder="e.g. 1 year experience, Carnivores"
          />
          <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
        </div>
        <p className="text-xs text-muted-foreground">Press Enter or click Add after each requirement. Click a tag to remove it.</p>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.map(s => (
              <span
                key={s}
                onClick={() => removeSkill(s)}
                className="cursor-pointer text-xs bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                {s} ×
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : job ? 'Save changes' : 'Submit for review'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
