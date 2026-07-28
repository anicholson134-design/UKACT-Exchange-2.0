'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
  candidateRegisterSchema,
  employerRegisterSchema,
  type CandidateRegisterInput,
  type EmployerRegisterInput,
} from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RegisterFormProps {
  type: 'candidate' | 'employer'
}

export function RegisterForm({ type }: RegisterFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const schema = type === 'candidate' ? candidateRegisterSchema : employerRegisterSchema
  const { register, handleSubmit, formState: { errors } } = useForm<
    CandidateRegisterInput | EmployerRegisterInput
  >({ resolver: zodResolver(schema) })

  async function onSubmit(data: CandidateRegisterInput | EmployerRegisterInput) {
    setLoading(true)

    const metadata: Record<string, string> = {
      role: type,
      full_name: data.full_name,
    }

    if (type === 'employer') {
      const emp = data as EmployerRegisterInput
      metadata.company_name = emp.company_name
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: metadata },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address. Click it to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>
            Back to login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {type === 'candidate' ? 'Find your next role' : 'Hire top talent'}
        </CardTitle>
        <CardDescription>
          Create your {type === 'candidate' ? 'candidate' : 'employer'} account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" {...register('full_name')} />
            {errors.full_name && <p className="text-sm text-destructive">{errors.full_name.message}</p>}
          </div>

          {type === 'employer' && (
            <div className="space-y-2">
              <Label htmlFor="company_name">Company name</Label>
              <Input id="company_name" {...register('company_name' as keyof EmployerRegisterInput)} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {type === 'candidate' ? (
            <>Looking to hire?{' '}
              <Link href="/register/employer" className="text-primary hover:underline">Register as employer</Link>
            </>
          ) : (
            <>Looking for work?{' '}
              <Link href="/register/candidate" className="text-primary hover:underline">Register as candidate</Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
