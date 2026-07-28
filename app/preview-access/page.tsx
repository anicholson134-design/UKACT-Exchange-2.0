'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function PreviewAccessPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/preview-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-forest">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=60')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/80 to-forest" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/keep-logo.webp" alt="KEEP" width={80} height={80} className="object-contain" />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold/15 border border-gold/30 mx-auto mb-5">
            <Lock className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>

          <h1 className="font-display text-cream text-2xl font-semibold text-center mb-1">
            Preview Access
          </h1>
          <p className="text-cream/50 text-sm text-center mb-8">
            This site is password protected
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/15 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60 transition-colors"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-gold text-cream font-medium rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Checking…' : 'Enter site'}
            </button>
          </form>
        </div>

        <p className="text-center text-cream/25 text-xs mt-6">
          KEEP – Zookeeper Exchange Programme
        </p>
      </div>
    </div>
  )
}
