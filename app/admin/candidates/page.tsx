import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { CandidateActions } from '@/components/admin/CandidateActions'
import type { Metadata } from 'next'
import type { CandidateStatus } from '@/types'

export const metadata: Metadata = { title: 'Candidates' }

export default async function AdminCandidatesPage({
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

  const { data: profiles } = await admin
    .from('profiles')
    .select('id, full_name, created_at')
    .eq('role', 'candidate')
    .order('created_at', { ascending: false })
    .limit(100)

  const ids = (profiles ?? []).map(p => p.id)

  const { data: candidateProfiles } = ids.length
    ? await admin.from('candidate_profiles').select('id, status').in('id', ids)
    : { data: [] as { id: string; status: CandidateStatus }[] }

  const statusMap: Record<string, CandidateStatus> =
    Object.fromEntries((candidateProfiles ?? []).map(c => [c.id, c.status]))

  // Emails live in auth.users, not profiles — fetch them in one bulk admin call.
  const { data: userList } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailMap: Record<string, string> =
    Object.fromEntries((userList?.users ?? []).map(u => [u.id, u.email ?? '']))

  const candidates = (profiles ?? [])
    .map(p => ({
      ...p,
      status: statusMap[p.id] ?? 'approved' as CandidateStatus,
      email: emailMap[p.id] ?? '',
    }))
    .filter(c => !statusFilter || c.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <div className="flex gap-2">
          <Button variant={!statusFilter ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/candidates">All</Link>
          </Button>
          <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/candidates?status=pending">Pending</Link>
          </Button>
          <Button variant={statusFilter === 'approved' ? 'default' : 'outline'} size="sm" asChild>
            <Link href="/admin/candidates?status=approved">Approved</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-xs">{c.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {c.full_name}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.email || 'N/A'}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3"><CandidateActions id={c.id} status={c.status} /></td>
              </tr>
            ))}
            {!candidates.length && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
