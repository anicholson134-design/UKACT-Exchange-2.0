import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ContractType, ApplicationStatus, EmployerStatus, JobStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return 'Salary not specified'
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

export function formatContractType(type: ContractType): string {
  const map: Record<ContractType, string> = {
    full_time: 'Full Time',
    part_time: 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
  }
  return map[type]
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

export function isPastDeadline(date: string | null | undefined): boolean {
  if (!date) return false
  return new Date(date).getTime() < Date.now()
}

/** Placement length, e.g. "14 days" for short exchanges or "3 months" for longer ones. */
export function formatDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const days = Math.round(ms / (1000 * 60 * 60 * 24))
  if (days < 28) return `${days} day${days !== 1 ? 's' : ''}`
  const months = Math.round(days / 30.44)
  return `${months} month${months !== 1 ? 's' : ''}`
}

interface PlacementDates {
  start_date: string | null
  expires_at: string | null
  flexible_dates?: boolean
  flexible_duration_days?: number | null
}

/**
 * Fixed placements show their computed duration ("14 days"); flexible ones
 * show the offered length plus the window candidates can pick within
 * ("2 days, flexible within 1 Sep – 30 Sep 2026").
 */
export function formatPlacementLength(job: PlacementDates): string | null {
  if (!job.start_date || !job.expires_at) return null
  if (job.flexible_dates && job.flexible_duration_days) {
    const start = new Date(job.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    const end = new Date(job.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const n = job.flexible_duration_days
    return `${n} day${n !== 1 ? 's' : ''}, flexible within ${start} – ${end}`
  }
  return formatDuration(job.start_date, job.expires_at)
}

export function applicationStatusColor(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    submitted: 'bg-blue-100 text-blue-800',
    reviewing: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-100 text-green-800',
  }
  return map[status]
}

export function jobStatusColor(status: JobStatus): string {
  const map: Record<JobStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return map[status]
}

export function employerStatusColor(status: EmployerStatus): string {
  const map: Record<EmployerStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-gray-100 text-gray-800',
  }
  return map[status]
}

