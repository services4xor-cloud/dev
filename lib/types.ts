// Shared TypeScript interfaces for Bekenya.com

export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'INTERNSHIP'
export type JobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'FILLED'
export type JobTier = 'BASIC' | 'FEATURED' | 'PREMIUM'
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'
export type PaymentMethod = 'MPESA' | 'STRIPE' | 'FLUTTERWAVE' | 'PAYPAL'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export interface Job {
  id: string
  title: string
  company: string
  description: string
  location: string
  isRemote: boolean
  jobType: JobType
  salaryMin?: number
  salaryMax?: number
  currency: string
  skills: string[]
  country: string
  status: JobStatus
  tier: JobTier
  expiresAt: string
  createdAt: string
  logo?: string // emoji or URL
  isFeatured?: boolean
}

export interface JobListItem extends Pick<Job, 'id' | 'title' | 'company' | 'location' | 'isRemote' | 'jobType' | 'currency' | 'skills' | 'tier'> {
  salaryMin?: number
  salaryMax?: number
  logo: string
  posted: string // human-readable: "2 hours ago"
  isFeatured: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: UserRole
  avatarUrl?: string
  country: string
  createdAt: string
}

export interface Application {
  id: string
  jobId: string
  applicantId: string
  coverLetter?: string
  status: ApplicationStatus
  appliedAt: string
  job?: JobListItem
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  mpesaReceiptNumber?: string
  checkoutRequestId?: string
  stripePaymentId?: string
  createdAt: string
}

export interface MpesaStkResponse {
  success: boolean
  checkoutRequestId?: string
  message?: string
  error?: string
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
