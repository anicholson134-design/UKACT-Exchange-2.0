import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const profileSchema = z.object({
  company_name: z.string().min(2),
  logo_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
})

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'employer') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  // Only these columns are ever written here — status/reviewed_* are additionally
  // guarded DB-side by the protect_reviewed_status trigger regardless.
  const { data, error } = await supabase
    .from('employer_profiles')
    .update(parsed.data)
    .eq('id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
