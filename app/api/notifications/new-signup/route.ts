import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, newSignupAdminEmail, ADMIN_EMAIL, SITE_URL } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({
  role: z.enum(['candidate', 'employer']),
  userId: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  companyName: z.string().optional(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { role, userId, name, email, companyName } = parsed.data

  // This fires right after client-side signUp(), before any session may exist
  // (email confirmation can be required), so it can't be session-authenticated.
  // Guard against arbitrary spam by confirming a matching, freshly-created
  // profile actually exists before emailing the admin inbox.
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('id, role, created_at')
    .eq('id', userId)
    .eq('role', role)
    .single()

  const isRecent = profile && Date.now() - new Date(profile.created_at).getTime() < 5 * 60 * 1000
  if (!profile || !isRecent) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const reviewUrl = role === 'employer'
    ? `${SITE_URL}/admin/employers/${userId}`
    : `${SITE_URL}/admin/candidates?status=pending`

  const { subject, html } = newSignupAdminEmail({ role, name, email, companyName, reviewUrl })
  await sendEmail({ to: ADMIN_EMAIL, subject, html })

  return NextResponse.json({ success: true })
}
