'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CvUploaderProps {
  currentCvFilename: string | null
  onUploadComplete: (url: string, filename: string) => void
}

export function CvUploader({ currentCvFilename, onUploadComplete }: CvUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      toast.error('Only PDF and Word documents are accepted')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be smaller than 5 MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/cv/upload', { method: 'POST', body: formData })
    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? 'Upload failed')
    } else {
      toast.success('CV uploaded successfully')
      onUploadComplete(data.url, file.name)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      {currentCvFilename && (
        <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm truncate">{currentCvFilename}</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</>
        ) : (
          <><Upload className="h-4 w-4 mr-2" />{currentCvFilename ? 'Replace CV' : 'Upload CV'}</>
        )}
      </Button>
      <p className="text-xs text-muted-foreground">PDF or Word document, max 5 MB</p>
    </div>
  )
}
