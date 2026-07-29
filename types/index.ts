export type UserRole = 'candidate' | 'employer' | 'admin'
export type CandidateStatus = 'pending' | 'approved'
export type EmployerStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type JobStatus = 'draft' | 'pending_review' | 'active' | 'closed' | 'rejected'
export type ApplicationStatus = 'submitted' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
export type ContractType = 'full_time' | 'part_time' | 'contract' | 'internship'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  avatar_url: string | null
  phone: string | null
  email_verified_at: string | null
  created_at: string
  updated_at: string
}

export interface CandidateProfile {
  id: string
  headline: string | null
  summary: string | null
  location: string | null
  cv_url: string | null
  cv_filename: string | null
  linkedin_url: string | null
  skills: string[]
  years_exp: number | null
  status: CandidateStatus
  reviewed_by: string | null
  reviewed_at: string | null
}

export interface EmployerProfile {
  id: string
  company_name: string
  company_size: string | null
  industry: string | null
  website: string | null
  logo_url: string | null
  description: string | null
  location: string | null
  status: EmployerStatus
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
}

export interface Job {
  id: string
  employer_id: string
  title: string
  description: string
  location: string | null
  remote: boolean
  contract_type: ContractType
  salary_min: number | null
  salary_max: number | null
  skills_required: string[]
  status: JobStatus
  image_url: string | null
  expires_at: string | null
  application_deadline: string | null
  created_at: string
  updated_at: string
  employer_profiles?: Pick<EmployerProfile, 'company_name' | 'logo_url' | 'location'>
}

export interface Application {
  id: string
  job_id: string
  candidate_id: string
  cover_letter: string | null
  cv_url: string | null
  status: ApplicationStatus
  employer_notes: string | null
  created_at: string
  updated_at: string
  jobs?: Pick<Job, 'title' | 'location' | 'contract_type'> & {
    employer_profiles?: Pick<EmployerProfile, 'company_name' | 'logo_url'>
  }
  candidate_profiles?: Pick<CandidateProfile, 'cv_url'> & {
    profiles?: Pick<Profile, 'full_name' | 'avatar_url'>
  }
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile }
      candidate_profiles: { Row: CandidateProfile }
      employer_profiles: { Row: EmployerProfile }
      jobs: { Row: Job }
      applications: { Row: Application }
    }
  }
}
