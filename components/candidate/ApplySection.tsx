'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, Upload, Loader2, CheckCircle, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ApplySectionProps {
  jobId: string
  jobTitle: string
  isLoggedIn: boolean
  isCandidate: boolean
  alreadyApplied: boolean
  cvFilename: string | null
  cvUrl: string | null
}

export function ApplySection({
  jobId,
  jobTitle,
  isLoggedIn,
  isCandidate,
  alreadyApplied,
  cvFilename,
  cvUrl,
}: ApplySectionProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [considerations, setConsiderations] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [applied, setApplied] = useState(alreadyApplied)
  const [currentCvFilename, setCurrentCvFilename] = useState(cvFilename)
  const [currentCvUrl, setCurrentCvUrl] = useState(cvUrl)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('File must be under 5 MB'); return }
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/cv/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error ?? 'Upload failed')
    } else {
      setCurrentCvFilename(file.name)
      setCurrentCvUrl(data.url)
      toast.success('CV uploaded')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleApply() {
    if (!currentCvUrl) { toast.error('Please upload your CV before submitting'); return }
    setSubmitting(true)
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: jobId,
        cover_letter: coverLetter || undefined,
        considerations: considerations || undefined,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to submit application')
    } else {
      setApplied(true)
      setOpen(false)
      toast.success('Application submitted successfully!')
    }
    setSubmitting(false)
  }

  // Already applied
  if (applied) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center space-y-3">
        <CheckCircle className="h-9 w-9 text-green-600 mx-auto" />
        <p className="font-semibold text-green-800 text-lg">Application submitted</p>
        <p className="text-sm text-green-700 leading-relaxed">
          The collection will review your application and be in touch if successful.
        </p>
        <Link
          href="/candidate/applications"
          className="text-sm text-canopy hover:text-gold font-medium transition-colors block pt-1"
        >
          View your applications →
        </Link>
      </div>
    )
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-stone/20 bg-white p-6 space-y-4">
        <h3 className="font-display font-semibold text-xl text-forest">Apply for this placement</h3>
        <p className="text-sm text-ink/60 leading-relaxed">
          Create a free UKACT account or log in to apply.
        </p>
        <Button asChild className="w-full bg-gold hover:bg-gold-light text-cream">
          <Link href={`/register/candidate?next=${pathname}`}>
            Create account & apply <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/login?next=${pathname}`}>Log in to apply</Link>
        </Button>
      </div>
    )
  }

  // Employer / admin logged in
  if (!isCandidate) {
    return (
      <div className="rounded-2xl border border-stone/20 bg-mist p-6 text-center">
        <p className="text-sm text-ink/60">Only keeper accounts can apply for placements.</p>
      </div>
    )
  }

  // Candidate — show Apply button + dialog
  return (
    <>
      <div className="rounded-2xl border border-stone/20 bg-white p-6 space-y-4">
        <h3 className="font-display font-semibold text-xl text-forest">Ready to apply?</h3>
        <p className="text-sm text-ink/60 leading-relaxed">
          Submit your CV and a cover letter to the collection. Takes less than 2 minutes.
        </p>
        <Button
          onClick={() => setOpen(true)}
          className="w-full bg-gold hover:bg-gold-light text-cream font-semibold py-3"
          size="lg"
        >
          Apply for position <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-xs text-center text-ink/35">
          Your CV is only shared with this collection
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-forest pr-8">
              Apply for position
            </DialogTitle>
            <DialogDescription className="text-ink/60">
              {jobTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">

            {/* CV upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-forest">
                CV / Resume <span className="text-red-500">*</span>
              </label>
              {currentCvFilename ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-mist border border-stone/20">
                  <div className="w-9 h-9 rounded-lg bg-canopy/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-canopy" />
                  </div>
                  <span className="text-sm text-ink/70 truncate flex-1">{currentCvFilename}</span>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-xs text-gold hover:text-gold-light font-medium shrink-0 transition-colors"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-stone/40 text-sm text-ink/50 hover:border-gold/50 hover:text-gold hover:bg-gold/5 transition-all"
                >
                  {uploading
                    ? <Loader2 className="h-6 w-6 animate-spin" />
                    : <Upload className="h-6 w-6" />}
                  <span>{uploading ? 'Uploading…' : 'Click to upload your CV'}</span>
                  <span className="text-xs text-ink/30">PDF or Word document · Max 5 MB</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
              />
            </div>

            {/* Cover letter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-forest">
                Cover letter{' '}
                <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone/30 bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all resize-none placeholder:text-ink/30"
                placeholder="Tell the collection why you're interested in this exchange, what you hope to learn, and what you'll bring to the placement…"
              />
            </div>

            {/* Any other considerations */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-forest">
                Any other considerations{' '}
                <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={considerations}
                onChange={e => setConsiderations(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone/30 bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all resize-none placeholder:text-ink/30"
                placeholder="Availability dates, accessibility requirements, travel constraints or anything else the collection should know…"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={handleApply}
                disabled={submitting || uploading || !currentCvUrl}
                className="flex-1 bg-gold hover:bg-gold-light text-cream font-semibold"
                size="lg"
              >
                {submitting
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
                  : 'Submit application'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-center text-ink/35 pb-1">
              Your CV and application details are shared only with this collection.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
