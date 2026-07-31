'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Message {
  id: string
  sender_id: string
  body: string
  read_at: string | null
  created_at: string
}

interface Props {
  applicationId: string
  currentUserId: string
  otherPartyName: string
}

export function MessageThread({ applicationId, currentUserId, otherPartyName }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/applications/${applicationId}/messages`)
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (!cancelled) setMessages(data) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [applicationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function send() {
    const trimmed = body.trim()
    if (!trimmed) return
    setSending(true)
    const res = await fetch(`/api/applications/${applicationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: trimmed }),
    })
    if (res.ok) {
      const message = await res.json()
      setMessages(prev => [...prev, message])
      setBody('')
    } else {
      toast.error('Failed to send message')
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col h-[420px] rounded-xl border overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No messages yet — say hello to {otherPartyName}.</p>
        ) : (
          messages.map(m => {
            const mine = m.sender_id === currentUserId
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'bg-primary text-primary-foreground' : 'bg-white border'}`}>
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p className={`text-[10px] mt-1 ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatDateTime(m.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={e => { e.preventDefault(); send() }}
        className="flex gap-2 p-3 border-t bg-background"
      >
        <textarea
          rows={1}
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder={`Message ${otherPartyName}…`}
          className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="sm" disabled={sending || !body.trim()} className="shrink-0 gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Send
        </Button>
      </form>
    </div>
  )
}
