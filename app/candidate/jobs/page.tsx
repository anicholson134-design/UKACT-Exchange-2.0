import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JobCard } from '@/components/candidate/JobCard'
import { Pagination } from '@/components/shared/Pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import type { Job } from '@/types'

export const metadata: Metadata = { title: 'Browse Jobs' }

const PAGE_SIZE = 20

export default async function CandidateJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const page = Number(params.page ?? 1)
  const q = params.q ?? ''

  let query = supabase
    .from('jobs')
    .select('*, employer_profiles(company_name, logo_url, location)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (q) query = query.ilike('title', `%${q}%`)

  const { data: jobs, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Jobs</h1>
        <p className="text-muted-foreground mt-1">{count ?? 0} opportunities available</p>
      </div>
      <form className="flex gap-2 max-w-lg">
        <Input name="q" defaultValue={q} placeholder="Search job titles…" className="flex-1" />
        <Button type="submit">Search</Button>
      </form>
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4">
          {(jobs as Job[]).map(job => (
            <JobCard key={job.id} job={job} href={`/jobs/${job.id}`} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12 text-center">No jobs match your search.</p>
      )}
      <Pagination page={page} totalPages={totalPages} />
    </div>
  )
}
