import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CvUploader } from '@/components/candidate/CvUploader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My CV' }

export default async function CvPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('candidate_profiles')
    .select('cv_url, cv_filename')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My CV</h1>
        <p className="text-muted-foreground mt-1">Upload your CV to apply to jobs quickly</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>CV Document</CardTitle>
          <CardDescription>PDF or Word format, max 5 MB. Shared only when you apply.</CardDescription>
        </CardHeader>
        <CardContent>
          <CvUploader currentCvFilename={data?.cv_filename ?? null} onUploadComplete={() => {}} />
        </CardContent>
      </Card>
    </div>
  )
}
