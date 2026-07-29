import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CompanyProfileForm } from '@/components/employer/CompanyProfileForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Company Profile' }

export default async function EmployerProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: emp } = await supabase
    .from('employer_profiles')
    .select('company_name, logo_url, description, website, location')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Company Profile</h1>
        <p className="text-muted-foreground mt-1">
          This appears alongside your placement adverts — including your logo.
        </p>
      </div>

      <CompanyProfileForm
        initial={{
          company_name: emp?.company_name ?? '',
          logo_url: emp?.logo_url ?? '',
          description: emp?.description ?? '',
          website: emp?.website ?? '',
          location: emp?.location ?? '',
        }}
      />
    </div>
  )
}
