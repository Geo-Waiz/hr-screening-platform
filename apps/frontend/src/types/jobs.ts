// Job-related types
export interface Job {
  id: string
  title: string
  description: string
  shortDescription: string
  department: string
  location: string
  employmentType: JobEmploymentType
  experience: JobExperience
  salary: JobSalary
  skills: JobSkill[]
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  status: JobStatus
  priority: JobPriority
  visibility: JobVisibility
  publishedAt?: Date
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
  applicationCount: number
  viewCount: number
  shareCount: number
  hiringManager: HiringManager
  recruiter?: Recruiter
  approvals: JobApproval[]
  workflow: JobWorkflow
  customFields: CustomField[]
  seoMetadata: SEOMetadata
  integrations: JobIntegration[]
}

export const JobStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  CLOSED: 'CLOSED',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED'
} as const

export type JobStatus = typeof JobStatus[keyof typeof JobStatus]

export const JobPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const

export type JobPriority = typeof JobPriority[keyof typeof JobPriority]

export const JobEmploymentType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  TEMPORARY: 'TEMPORARY',
  INTERNSHIP: 'INTERNSHIP',
  FREELANCE: 'FREELANCE'
} as const

export type JobEmploymentType = typeof JobEmploymentType[keyof typeof JobEmploymentType]

export const JobExperience = {
  ENTRY_LEVEL: 'ENTRY_LEVEL',
  MID_LEVEL: 'MID_LEVEL',
  SENIOR_LEVEL: 'SENIOR_LEVEL',
  EXECUTIVE: 'EXECUTIVE'
} as const

export type JobExperience = typeof JobExperience[keyof typeof JobExperience]

export const JobVisibility = {
  PUBLIC: 'PUBLIC',
  INTERNAL: 'INTERNAL',
  PRIVATE: 'PRIVATE'
} as const

export type JobVisibility = typeof JobVisibility[keyof typeof JobVisibility]

export interface JobSalary {
  currency: string
  min?: number
  max?: number
  exact?: number
  period: 'HOURLY' | 'DAILY' | 'MONTHLY' | 'YEARLY'
  negotiable: boolean
  showSalary: boolean
}

export interface JobSkill {
  id: string
  name: string
  category: string
  required: boolean
  experience?: string
}

export interface HiringManager {
  id: string
  name: string
  email: string
  department: string
}

export interface Recruiter {
  id: string
  name: string
  email: string
}

export interface JobApproval {
  id: string
  approverType: 'HIRING_MANAGER' | 'HR' | 'EXECUTIVE'
  approverId: string
  approverName: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  timestamp?: Date
  comments?: string
}

export interface JobWorkflow {
  autoPublish: boolean
  requiresApproval: boolean
  approvalStages: JobApproval[]
  autoExpire: boolean
  expirationDays?: number
  autoArchive: boolean
  archiveDays?: number
}

export interface CustomField {
  id: string
  label: string
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN' | 'SELECT' | 'MULTISELECT'
  value: any
  required: boolean
  options?: string[]
}

export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

export interface JobIntegration {
  platform: string
  externalId?: string
  status: 'PENDING' | 'ACTIVE' | 'FAILED'
  lastSync?: Date
  settings: Record<string, any>
}

// Application-related types
export interface Application {
  id: string
  jobId: string
  candidateId: string
  status: ApplicationStatus
  stage: PipelineStage
  source: ApplicationSource
  appliedAt: Date
  updatedAt: Date
  assignedRecruiter?: string
  assignedHiringManager?: string
  customFields: Record<string, any>
  tags: string[]
  notes: ApplicationNote[]
  documents: ApplicationDocument[]
  screenings: ScreeningResult[]
  interviews: Interview[]
  offers: Offer[]
  workflow: ApplicationWorkflow
  timeline: ApplicationEvent[]
}

export const ApplicationStatus = {
  NEW: 'NEW',
  REVIEWING: 'REVIEWING',
  SCREENING: 'SCREENING',
  INTERVIEWING: 'INTERVIEWING',
  PENDING_DECISION: 'PENDING_DECISION',
  OFFER_EXTENDED: 'OFFER_EXTENDED',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  ON_HOLD: 'ON_HOLD'
} as const

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus]

export const ApplicationSource = {
  DIRECT: 'DIRECT',
  REFERRAL: 'REFERRAL',
  JOB_BOARD: 'JOB_BOARD',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  RECRUITER: 'RECRUITER',
  AGENCY: 'AGENCY',
  CAREER_FAIR: 'CAREER_FAIR',
  OTHER: 'OTHER'
} as const

export type ApplicationSource = typeof ApplicationSource[keyof typeof ApplicationSource]

export interface PipelineStage {
  id: string
  name: string
  order: number
  type: 'APPLICATION' | 'SCREENING' | 'INTERVIEW' | 'DECISION' | 'OFFER'
  automated: boolean
  requirements?: string[]
}

export interface ApplicationNote {
  id: string
  authorId: string
  authorName: string
  content: string
  type: 'PUBLIC' | 'PRIVATE' | 'SYSTEM'
  createdAt: Date
  tags?: string[]
}

export interface ApplicationDocument {
  id: string
  name: string
  type: 'RESUME' | 'COVER_LETTER' | 'PORTFOLIO' | 'CERTIFICATE' | 'OTHER'
  url: string
  uploadedAt: Date
  size: number
  mimeType: string
}

export interface ScreeningResult {
  id: string
  type: 'AI_SCREENING' | 'MANUAL_SCREENING' | 'ASSESSMENT'
  score?: number
  maxScore?: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  result?: 'PASS' | 'FAIL' | 'INCONCLUSIVE'
  details: Record<string, any>
  completedAt?: Date
  completedBy?: string
}

export interface Interview {
  id: string
  type: 'PHONE' | 'VIDEO' | 'IN_PERSON' | 'TECHNICAL' | 'PANEL'
  scheduledAt: Date
  duration: number
  interviewers: Interviewer[]
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  feedback?: InterviewFeedback[]
  recording?: string
  notes?: string
}

export interface Interviewer {
  id: string
  name: string
  email: string
  role: string
}

export interface InterviewFeedback {
  interviewerId: string
  rating: number
  comments: string
  recommendation: 'HIRE' | 'NO_HIRE' | 'MAYBE'
  submittedAt: Date
}

export interface Offer {
  id: string
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'WITHDRAWN'
  salary: JobSalary
  startDate: Date
  benefits: string[]
  terms: string[]
  expiresAt: Date
  sentAt?: Date
  respondedAt?: Date
  notes?: string
}

export interface ApplicationWorkflow {
  autoAdvance: boolean
  notifications: NotificationRule[]
  deadlines: WorkflowDeadline[]
  approvals: WorkflowApproval[]
}

export interface NotificationRule {
  trigger: string
  recipients: string[]
  template: string
  enabled: boolean
}

export interface WorkflowDeadline {
  stage: string
  days: number
  action: 'NOTIFY' | 'ADVANCE' | 'REJECT'
}

export interface WorkflowApproval {
  stage: string
  approverRole: string
  required: boolean
}

export interface ApplicationEvent {
  id: string
  type: string
  description: string
  timestamp: Date
  userId?: string
  userName?: string
  metadata?: Record<string, any>
}

// Analytics and Reporting types
export interface JobAnalytics {
  jobId: string
  period: 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'
  startDate: Date
  endDate: Date
  metrics: JobMetrics
  trends: JobTrend[]
  demographics: JobDemographics
  performance: JobPerformance
}

export interface JobMetrics {
  views: number
  applications: number
  qualifiedApplications: number
  interviews: number
  offers: number
  hires: number
  conversionRates: ConversionRates
  timeToFill: number
  timeToHire: number
  costPerHire: number
  qualityOfHire: number
}

export interface ConversionRates {
  viewToApplication: number
  applicationToScreening: number
  screeningToInterview: number
  interviewToOffer: number
  offerToHire: number
}

export interface JobTrend {
  date: Date
  metric: string
  value: number
  change: number
}

export interface JobDemographics {
  sourceBreakdown: Record<string, number>
  locationBreakdown: Record<string, number>
  experienceBreakdown: Record<string, number>
  skillsBreakdown: Record<string, number>
}

export interface JobPerformance {
  ranking: number
  benchmarkComparison: Record<string, number>
  recommendations: string[]
  alerts: PerformanceAlert[]
}

export interface PerformanceAlert {
  type: 'LOW_APPLICATIONS' | 'HIGH_DROPOUT' | 'SLOW_HIRING' | 'BUDGET_EXCEEDED'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  actionItems: string[]
}