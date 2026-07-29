import { z } from 'zod'

export const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().optional(),
  start_date: z.string().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  skills_required: z.array(z.string()).default([]),
  image_url: z.string().optional().nullable(),
})

export type JobInput = z.infer<typeof jobSchema>
