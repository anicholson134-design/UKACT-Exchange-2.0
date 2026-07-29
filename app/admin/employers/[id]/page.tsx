import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect, notFound } from 'next/navigation'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils'
import { EmployerApprovalForm } from '@/components/admin/EmployerApprovalForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Review Collection' }

export default async function AdminEmployerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: emp } = await admin
    .from('employer_profiles')
    .select('id, company_name, status, company_size, industry, website, description, location, rejection_reason, reviewed_at')
    .eq('id', id)
    .single()

  if (!emp) notFound()

  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, created_at')
    .eq('id', id)
    .single()

  const { data: userData } = await admin.auth.admin.getUserById(id)
  const email = userData?.user?.email

  const details = [
    ['Industry', emp.industry],
    ['Company size', emp.company_size],
    ['Location', emp.location],
    ['Website', emp.website],
    ['Contact name', profile?.full_name],
    ['Email', email],
    ['Registered', profile?.created_at ? formatDate(profile.created_at) : null],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{emp.company_name}</h1>
          {profile?.full_name && (
            <p className="text-muted-foreground mt-1">{profile.full_name}</p>
          )}
        </div>
        <StatusBadge status={emp.status} />
      </div>

      {/* Collection details */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-lg">Collection Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {details.map(([label, value]) => (
            <div key={label}>
              <p className="text-muted-foreground">{label}</p>
              <p className="font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
        {emp.description && (
          <div>
            <p className="text-muted-foreground text-sm mb-1">Description</p>
            <p className="text-sm whitespace-pre-wrap">{emp.description}</p>
          </div>
        )}
        {emp.rejection_reason && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            <strong>Previous rejection reason:</strong> {emp.rejection_reason}
          </div>
        )}
      </div>

      {/* Decision form — client component for the approve/reject actions */}
      <EmployerApprovalForm id={id} currentStatus={emp.status} />
    </div>
  )
}
