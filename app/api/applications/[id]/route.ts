import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { applicationStatusSchema } from '@/lib/validations/application'
import { sendEmail, applicationStatusEmail } from '@/lib/email'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  // verify employer owns the job this application belongs to (admins can act on any)
  const { data: app } = await supabase
    .from('applications')
    .select('job_id, candidate_id, jobs(employer_id, title, employer_profiles(company_name))')
    .eq('id', id)
    .single()

  const jobEmployerId = (app?.jobs as any)?.employer_id
  if (!app || (!isAdmin && jobEmployerId !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = applicationStatusSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  // Admins updating another collection's application need the service-role
  // client — the "employer update application status" RLS policy only
  // permits the job's own employer.
  const client = isAdmin ? createAdminClient() : supabase

  const { data, error } = await client
    .from('applications')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const admin = createAdminClient()
  const jobInfo = app.jobs as any

  if (parsed.data.status && app?.candidate_id) {
    const { data: authUser } = await admin.auth.admin.getUserById(app.candidate_id)
    if (authUser?.user?.email) {
      const { subject, html } = applicationStatusEmail({
        jobTitle: jobInfo?.title ?? 'your placement',
        companyName: jobInfo?.employer_profiles?.company_name ?? 'the collection',
        status: parsed.data.status,
      })
      await sendEmail({ to: authUser.user.email, subject, html })
    }
  }

  // Accepting a candidate closes the door on everyone else still in the running.
  if (parsed.data.status === 'hired') {
    const { data: others } = await client
      .from('applications')
      .select('id, candidate_id')
      .eq('job_id', app.job_id)
      .neq('id', id)
      .not('status', 'in', '(rejected,hired)')

    if (others?.length) {
      await client.from('applications').update({ status: 'rejected' }).in('id', others.map(o => o.id))

      for (const other of others) {
        const { data: authUser } = await admin.auth.admin.getUserById(other.candidate_id)
        if (authUser?.user?.email) {
          const { subject, html } = applicationStatusEmail({
            jobTitle: jobInfo?.title ?? 'your placement',
            companyName: jobInfo?.employer_profiles?.company_name ?? 'the collection',
            status: 'rejected',
          })
          await sendEmail({ to: authUser.user.email, subject, html })
        }
      }
    }
  }

  return NextResponse.json(data)
}
