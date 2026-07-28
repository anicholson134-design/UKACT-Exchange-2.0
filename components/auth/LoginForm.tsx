'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', authData.user.id).single()

    const dest = profile?.role === 'admin' ? '/admin/dashboard'
      : profile?.role === 'employer' ? '/employer/dashboard'
      : '/candidate/dashboard'

    router.push(dest)
    router.refresh()
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-forest mb-2">Welcome back</h1>
        <p className="text-ink/50 text-sm">Sign in to your UKACT account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-forest">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl border border-stone/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all placeholder:text-ink/30"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-forest">Password</label>
            <Link href="/forgot-password" className="text-xs text-gold hover:text-gold-light transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              {...register('password')}
              className="w-full px-4 py-3 pr-11 rounded-xl border border-stone/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-canopy text-cream font-medium rounded-xl hover:bg-forest transition-colors duration-200 text-sm disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        Don't have an account?{' '}
        <Link href="/register/candidate" className="text-canopy hover:text-gold font-medium transition-colors">
          Join as a keeper
        </Link>{' '}
        or{' '}
        <Link href="/register/employer" className="text-canopy hover:text-gold font-medium transition-colors">
          register a collection
        </Link>
      </p>
    </div>
  )
}
