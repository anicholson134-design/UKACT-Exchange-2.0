import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Account Pending Approval' }

export default async function CandidatePendingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: candidate } = await supabase
    .from('candidate_profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (candidate?.status === 'approved') redirect('/candidate/dashboard')

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <CardTitle>Awaiting Approval</CardTitle>
          <CardDescription>
            Your account is under review. We&apos;ll notify you by email once you&apos;re approved and can start applying to placements.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
