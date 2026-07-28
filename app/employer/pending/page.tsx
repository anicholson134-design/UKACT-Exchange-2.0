import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Account Pending Approval' }

export default async function PendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: emp } = await supabase
    .from('employer_profiles')
    .select('status, company_name, rejection_reason')
    .eq('id', user.id)
    .single()

  if (emp?.status === 'approved') redirect('/employer/dashboard')

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <CardTitle>
            {emp?.status === 'rejected' ? 'Application Rejected' : 'Awaiting Approval'}
          </CardTitle>
          <CardDescription>
            {emp?.status === 'rejected'
              ? 'Your employer account was not approved.'
              : `Your account for ${emp?.company_name ?? 'your company'} is under review. We'll notify you by email once approved.`}
          </CardDescription>
        </CardHeader>
        {emp?.rejection_reason && (
          <CardContent>
            <div className="text-sm bg-destructive/10 text-destructive rounded-md p-3">
              <strong>Reason:</strong> {emp.rejection_reason}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
