'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react'
import type { EmployerStatus } from '@/types'

interface EmployerApprovalFormProps {
  id: string
  currentStatus: EmployerStatus
}

export function EmployerApprovalForm({ id, currentStatus }: EmployerApprovalFormProps) {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  async function decide(action: 'approved' | 'rejected' | 'suspended') {
    if (action === 'rejected' && !reason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    setLoading(action)
    const res = await fetch(`/api/admin/employers/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, rejection_reason: reason || undefined }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error ?? 'Action failed')
    } else {
      toast.success(`Employer ${action}`)
      router.push('/admin/employers')
      router.refresh()
    }
    setLoading(null)
  }

  return (
    <div className="rounded-lg border bg-card p-6 space-y-5">
      <h2 className="font-semibold text-lg">Decision</h2>

      {currentStatus === 'pending' || currentStatus === 'rejected' ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Rejection reason{' '}
              <span className="text-muted-foreground font-normal">(required if rejecting)</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="Explain why the application was not approved…"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => decide('approved')}
              disabled={!!loading}
              className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              {loading === 'approved' ? 'Approving…' : 'Approve'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => decide('rejected')}
              disabled={!!loading}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              {loading === 'rejected' ? 'Rejecting…' : 'Reject'}
            </Button>
          </div>
        </>
      ) : currentStatus === 'approved' ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This employer is currently approved. You can suspend their account if needed.
          </p>
          <Button
            variant="outline"
            onClick={() => decide('suspended')}
            disabled={!!loading}
            className="gap-2"
          >
            <PauseCircle className="h-4 w-4" />
            {loading === 'suspended' ? 'Suspending…' : 'Suspend account'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This account is currently suspended.
          </p>
          <Button
            onClick={() => decide('approved')}
            disabled={!!loading}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4" />
            {loading === 'approved' ? 'Reinstating…' : 'Reinstate account'}
          </Button>
        </div>
      )}
    </div>
  )
}
