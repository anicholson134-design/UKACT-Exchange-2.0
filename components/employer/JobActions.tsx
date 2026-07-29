'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export function JobActions({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function close() {
    if (!confirm('Close this placement? It will be taken off the site immediately.')) return
    setLoading(true)
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to close listing')
      setLoading(false)
    } else {
      toast.success('Listing closed')
      router.refresh()
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/employer/jobs/${id}`}>Edit</Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/employer/jobs/${id}/applicants`}>Applicants</Link>
      </Button>
      {status !== 'closed' && (
        <Button variant="ghost" size="sm" onClick={close} disabled={loading} className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10">
          <XCircle className="h-3.5 w-3.5" />
          {loading ? 'Closing…' : 'Close'}
        </Button>
      )}
    </div>
  )
}
