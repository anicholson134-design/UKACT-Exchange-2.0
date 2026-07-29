import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, jobDecisionEmail, SITE_URL } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({
  action: z.enum(['active', 'rejected', 'closed']),
})

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const adminClient = createAdminClient()

  const { data: job, error } = await adminClient
    .from('jobs')
    .update({
      status: parsed.data.action,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('title, slug, employer_id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await adminClient.from('audit_log').insert({
    actor_id: user.id,
    action: parsed.data.action,
    entity: 'jobs',
    entity_id: id,
  })

  if (job && (parsed.data.action === 'active' || parsed.data.action === 'rejected')) {
    const { data: authUser } = await adminClient.auth.admin.getUserById(job.employer_id)
    if (authUser?.user?.email) {
      const { subject, html } = jobDecisionEmail({
        approved: parsed.data.action === 'active',
        title: job.title,
        liveUrl: `${SITE_URL}/jobs/${job.slug}`,
      })
      await sendEmail({ to: authUser.user.email, subject, html })
    }
  }

  return NextResponse.json({ success: true })
}
