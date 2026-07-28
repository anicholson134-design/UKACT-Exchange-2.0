import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Plus, Globe, FileText, Archive, Eye, Edit } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'CMS Pages' }

const statusConfig = {
  published: { label: 'Published', class: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', class: 'bg-yellow-100 text-yellow-800' },
  archived: { label: 'Archived', class: 'bg-gray-100 text-gray-600' },
}

export default async function CmsPagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin/dashboard')

  const admin = createAdminClient()
  const { data: pages } = await admin
    .from('cms_pages')
    .select('id, slug, title, status, show_in_nav, nav_group, updated_at, published_at')
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground mt-1">{pages?.length ?? 0} pages · Manage site content</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/new"><Plus className="h-4 w-4 mr-2" />New page</Link>
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {(['published', 'draft', 'archived'] as const).map(s => {
          const count = pages?.filter(p => p.status === s).length ?? 0
          const Icon = s === 'published' ? Globe : s === 'draft' ? FileText : Archive
          return (
            <div key={s} className="rounded-xl border bg-white p-4 flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{s}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pages table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">In nav</th>
              <th className="text-left px-4 py-3 font-medium">Updated</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(pages ?? []).map(page => {
              const sc = statusConfig[page.status as keyof typeof statusConfig] ?? statusConfig.draft
              return (
                <tr key={page.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{page.title}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">/p/{page.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${sc.class}`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {page.show_in_nav
                      ? <span className="text-xs text-green-600 font-medium">✓ {page.nav_group}</span>
                      : <span className="text-xs text-muted-foreground">Hidden</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(page.updated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {page.status === 'published' && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/p/${page.slug}`} target="_blank"><Eye className="h-3.5 w-3.5" /></Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/cms/${page.id}`}><Edit className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {!pages?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                  No pages yet.{' '}
                  <Link href="/admin/cms/new" className="text-primary hover:underline">Create your first page</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
