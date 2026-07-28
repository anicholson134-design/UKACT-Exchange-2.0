import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const pageSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  title: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  hero_image: z.string().optional().nullable(),
  hero_title: z.string().optional().nullable(),
  hero_subtitle: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  content: z.array(z.any()).default([]),
  show_in_nav: z.boolean().default(false),
  nav_label: z.string().optional().nullable(),
  nav_group: z.string().optional().nullable(),
  nav_order: z.number().int().default(99),
})

async function requireAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function GET() {
  const supabase = await createClient()
  const user = await requireAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('cms_pages')
    .select('id, slug, title, status, show_in_nav, nav_group, nav_order, updated_at, published_at')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await requireAdmin(supabase)
  if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const parsed = pageSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('cms_pages')
    .insert({
      ...parsed.data,
      created_by: user.id,
      updated_by: user.id,
      published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
