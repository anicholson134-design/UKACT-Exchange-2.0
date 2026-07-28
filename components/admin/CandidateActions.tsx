'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckCircle, RotateCcw, Trash2 } from 'lucide-react'
import type { CandidateStatus } from '@/types'

export function CandidateActions({ id, status }: { id: string; status: CandidateStatus }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function setStatus(next: 'pending' | 'approved') {
    setLoading(next)
    const res = await fetch(`/api/admin/candidates/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error ?? 'Action failed')
    } else {
      toast.success(next === 'approved' ? 'Candidate approved' : 'Candidate set back to pending')
      router.refresh()
    }
    setLoading(null)
  }

  async function remove() {
    if (!confirm('Delete this candidate account permanently? This cannot be undone.')) return
    setLoading('delete')
    const res = await fetch(`/api/admin/candidates/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error ?? 'Delete failed')
      setLoading(null)
    } else {
      toast.success('Candidate deleted')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {status === 'pending' ? (
        <Button
          size="sm"
          onClick={() => setStatus('approved')}
          disabled={!!loading}
          className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          {loading === 'approved' ? 'Approving…' : 'Approve'}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStatus('pending')}
          disabled={!!loading}
          className="gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {loading === 'pending' ? 'Reverting…' : 'Set to pending'}
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={remove}
        disabled={!!loading}
        className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {loading === 'delete' ? 'Deleting…' : 'Delete'}
      </Button>
    </div>
  )
}
