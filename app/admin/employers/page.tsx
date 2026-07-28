import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Employer Management' }

export default async function AdminEmployersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const statusFilter = params.status

  const admin = createAdminClient()

  let query = admin
    .from('employer_profiles')
    .select('id, company_name, status, industry, location')
    .order('company_name')

  if (statusFilter) query = query.eq('status', statusFilter)

  const { data: employers } = await query

  // Fetch contact names separately — avoids ambiguous FK join (id + reviewed_by both ref profiles)
  const ids = (employers ?? []).map((e: any) => e.id)
  const { data: profilesData } = ids.length
    ? await admin.from('profiles').select('id, full_name, created_at').in('id', ids)
    : { data: [] as any[] }

  const profileMap: Record<string, { full_name: string; created_at: string }> =
    Object.fromEntries((profilesData ?? []).map((p: any) => [p.id, p]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employers</h1>
        <div className="flex gap-2">
          <Button variant={!statusFilter ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/employers">All</Link>
          </Button>
          <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/employers?status=pending">Pending</Link>
          </Button>
          <Button variant={statusFilter === 'approved' ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/employers?status=approved">Approved</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Company</th>
              <th className="text-left px-4 py-3 font-medium">Contact</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {(employers ?? []).map((emp: any) => (
              <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{emp.company_name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {profileMap[emp.id]?.full_name ?? 'N/A'}
                </td>
                <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">
                  {profileMap[emp.id] ? formatDate(profileMap[emp.id].created_at) : 'N/A'}
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/employers/${emp.id}`}>Review</Link>
                  </Button>
                </td>
              </tr>
            ))}
            {!employers?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No employers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
