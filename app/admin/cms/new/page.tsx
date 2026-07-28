import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageForm } from '@/components/cms/PageForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Page' }

export default async function NewCmsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin/dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New page</h1>
        <p className="text-muted-foreground mt-1">Build a new page with the block editor</p>
      </div>
      <PageForm />
    </div>
  )
}
