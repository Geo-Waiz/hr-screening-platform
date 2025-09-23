// Audit System Types
export interface AuditEvent {
  id: string
  timestamp: Date
  userId: string
  userEmail: string
  action: AuditAction
  entityType: EntityType
  entityId: string
  changes?: AuditChange[]
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
}

export interface AuditChange {
  field: string
  oldValue: any
  newValue: any
}

export const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  ARCHIVE: 'ARCHIVE',
  RESTORE: 'RESTORE',
  ASSIGN: 'ASSIGN',
  UNASSIGN: 'UNASSIGN',
  STATUS_CHANGE: 'STATUS_CHANGE',
  SCHEDULE: 'SCHEDULE',
  CANCEL: 'CANCEL'
} as const

export type AuditAction = typeof AuditAction[keyof typeof AuditAction]

export const EntityType = {
  JOB: 'JOB',
  CANDIDATE: 'CANDIDATE',
  APPLICATION: 'APPLICATION',
  INTERVIEW: 'INTERVIEW',
  ASSESSMENT: 'ASSESSMENT',
  USER: 'USER',
  COMPANY: 'COMPANY',
  PIPELINE: 'PIPELINE',
  TEMPLATE: 'TEMPLATE',
  WORKFLOW: 'WORKFLOW'
} as const

export type EntityType = typeof EntityType[keyof typeof EntityType]

export interface AuditFilter {
  startDate?: Date
  endDate?: Date
  userId?: string
  action?: AuditAction
  entityType?: EntityType
  entityId?: string
}

export interface AuditSummary {
  totalEvents: number
  userActions: Record<string, number>
  entityChanges: Record<string, number>
  recentActivity: AuditEvent[]
  criticalEvents: AuditEvent[]
}