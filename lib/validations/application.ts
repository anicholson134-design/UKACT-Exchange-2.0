import { z } from 'zod'

export const applicationSchema = z.object({
  job_id: z.string().uuid(),
  cover_letter: z.string().optional(),
  considerations: z.string().optional(),
})

export const applicationStatusSchema = z.object({
  status: z.enum(['submitted', 'reviewing', 'shortlisted', 'rejected', 'hired']),
  employer_notes: z.string().optional(),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
export type ApplicationStatusInput = z.infer<typeof applicationStatusSchema>
