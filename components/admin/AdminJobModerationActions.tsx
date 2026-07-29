'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Ban } from 'lucide-react'

export function AdminJobModerationActions({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function moderate(action: 'active' | 'rejected' | 'closed') {
    setLoading(action)
    const res = await fetch(`/api/admin/jobs/${id}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error ?? 'Action failed')
      setLoading(null)
    } else {
      toast.success(`Listing ${action === 'active' ? 'approved' : action}`)
      router.push('/admin/jobs')
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2">
      {status === 'pending_review' && (
        <>
          <Button onClick={() => moderate('active')} disabled={!!loading} className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4" />
            {loading === 'active' ? 'Approving…' : 'Approve'}
          </Button>
          <Button variant="destructive" onClick={() => moderate('rejected')} disabled={!!loading} className="gap-1.5">
            <XCircle className="h-4 w-4" />
            {loading === 'rejected' ? 'Rejecting…' : 'Reject'}
          </Button>
        </>
      )}
      {status === 'active' && (
        <Button variant="outline" onClick={() => moderate('closed')} disabled={!!loading} className="gap-1.5">
          <Ban className="h-4 w-4" />
          {loading === 'closed' ? 'Closing…' : 'Close listing'}
        </Button>
      )}
    </div>
  )
}
