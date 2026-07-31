import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import { PageForm } from '@/components/cms/PageForm'
import { BackLink } from '@/components/shared/BackLink'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const admin = createAdminClient()
  const { data } = await admin.from('cms_pages').select('title').eq('id', id).single()
  return { title: data?.title ? `Edit: ${data.title}` : 'Edit Page' }
}

export default async function EditCmsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin/dashboard')

  const admin = createAdminClient()
  const { data: page } = await admin.from('cms_pages').select('*').eq('id', id).single()
  if (!page) notFound()

  return (
    <div className="space-y-6">
      <BackLink href="/admin/cms" label="Back to pages" />
      <div>
        <h1 className="text-3xl font-bold">Edit page</h1>
        <p className="text-muted-foreground mt-1">/p/{page.slug}</p>
      </div>
      <PageForm initialData={page as any} />
    </div>
  )
}
