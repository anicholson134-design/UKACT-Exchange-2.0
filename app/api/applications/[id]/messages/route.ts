import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { messageSchema } from '@/lib/validations/message'
import { sendEmail, newMessageEmail, SITE_URL } from '@/lib/email'

type Params = { params: Promise<{ id: string }> }

async function loadThreadContext(supabase: Awaited<ReturnType<typeof createClient>>, applicationId: string) {
  const { data: app } = await supabase
    .from('applications')
    .select('id, candidate_id, jobs(id, title, employer_id)')
    .eq('id', applicationId)
    .single()
  return app
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  const app = await loadThreadContext(supabase, id)
  const jobEmployerId = (app?.jobs as any)?.employer_id
  const isParticipant = app && (app.candidate_id === user.id || jobEmployerId === user.id)
  if (!app || (!isAdmin && !isParticipant)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const client = isAdmin ? createAdminClient() : supabase

  const { data: messages, error } = await client
    .from('messages')
    .select('id, sender_id, body, read_at, created_at')
    .eq('application_id', id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mark incoming messages as read now that the participant has viewed the thread.
  if (isParticipant) {
    const unreadIds = (messages ?? []).filter(m => m.sender_id !== user.id && !m.read_at).map(m => m.id)
    if (unreadIds.length) {
      await client.from('messages').update({ read_at: new Date().toISOString() }).in('id', unreadIds)
    }
  }

  return NextResponse.json(messages ?? [])
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const app = await loadThreadContext(supabase, id)
  const job = app?.jobs as any
  const jobEmployerId = job?.employer_id
  const isParticipant = app && (app.candidate_id === user.id || jobEmployerId === user.id)
  if (!app || !isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const parsed = messageSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { data: message, error } = await supabase
    .from('messages')
    .insert({ application_id: id, sender_id: user.id, body: parsed.data.body })
    .select('id, sender_id, body, read_at, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify the other participant.
  const isFromCandidate = user.id === app.candidate_id
  const recipientId = isFromCandidate ? jobEmployerId : app.candidate_id

  const admin = createAdminClient()
  const { data: authUser } = await admin.auth.admin.getUserById(recipientId)
  if (authUser?.user?.email) {
    const { data: senderProfile } = await admin.from('profiles').select('full_name').eq('id', user.id).single()
    const threadUrl = isFromCandidate
      ? `${SITE_URL}/employer/jobs/${job.id}/applicants`
      : `${SITE_URL}/candidate/applications`
    const { subject, html } = newMessageEmail({
      senderName: senderProfile?.full_name ?? 'Someone',
      jobTitle: job.title,
      preview: parsed.data.body,
      threadUrl,
    })
    await sendEmail({ to: authUser.user.email, subject, html })
  }

  return NextResponse.json(message, { status: 201 })
}
