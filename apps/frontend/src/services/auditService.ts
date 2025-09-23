import type { AuditEvent, AuditFilter, AuditSummary } from '../types/audit'
import { AuditAction, EntityType } from '../types/audit'

class AuditService {
  private events: AuditEvent[] = []
  
  // Core audit logging
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    }
    
    this.events.push(auditEvent)
    
    // In a real application, this would save to a database
    console.log('Audit Event:', auditEvent)
    
    // Store in localStorage for persistence in demo
    this.persistEvents()
  }

  // Job-specific audit methods
  async logJobCreated(jobId: string, jobData: any, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.CREATE,
      entityType: EntityType.JOB,
      entityId: jobId,
      metadata: {
        jobTitle: jobData.title,
        department: jobData.department,
        location: jobData.location
      }
    })
  }

  async logJobUpdated(jobId: string, changes: any, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.UPDATE,
      entityType: EntityType.JOB,
      entityId: jobId,
      changes: Object.keys(changes).map(field => ({
        field,
        oldValue: changes[field].old,
        newValue: changes[field].new
      }))
    })
  }

  async logJobStatusChanged(jobId: string, oldStatus: string, newStatus: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.STATUS_CHANGE,
      entityType: EntityType.JOB,
      entityId: jobId,
      changes: [{
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus
      }],
      metadata: {
        statusTransition: `${oldStatus} → ${newStatus}`
      }
    })
  }

  async logJobDeleted(jobId: string, jobTitle: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.DELETE,
      entityType: EntityType.JOB,
      entityId: jobId,
      metadata: {
        jobTitle,
        deletedAt: new Date().toISOString()
      }
    })
  }

  // Application-specific audit methods
  async logApplicationCreated(applicationId: string, candidateId: string, jobId: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.CREATE,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      metadata: {
        candidateId,
        jobId,
        source: 'DIRECT'
      }
    })
  }

  async logApplicationStatusChanged(applicationId: string, oldStatus: string, newStatus: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.STATUS_CHANGE,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      changes: [{
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus
      }]
    })
  }

  async logCandidateAssigned(applicationId: string, oldAssignee: string | null, newAssignee: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.ASSIGN,
      entityType: EntityType.APPLICATION,
      entityId: applicationId,
      changes: [{
        field: 'assignedRecruiter',
        oldValue: oldAssignee,
        newValue: newAssignee
      }]
    })
  }

  // Interview-specific audit methods
  async logInterviewScheduled(interviewId: string, applicationId: string, scheduledAt: Date, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.SCHEDULE,
      entityType: EntityType.INTERVIEW,
      entityId: interviewId,
      metadata: {
        applicationId,
        scheduledAt: scheduledAt.toISOString()
      }
    })
  }

  async logInterviewCompleted(interviewId: string, rating: number, recommendation: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.UPDATE,
      entityType: EntityType.INTERVIEW,
      entityId: interviewId,
      metadata: {
        rating,
        recommendation,
        completedAt: new Date().toISOString()
      }
    })
  }

  // Assessment-specific audit methods
  async logAssessmentStarted(assessmentId: string, candidateId: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.CREATE,
      entityType: EntityType.ASSESSMENT,
      entityId: assessmentId,
      metadata: {
        candidateId,
        startedAt: new Date().toISOString()
      }
    })
  }

  async logAssessmentCompleted(assessmentId: string, score: number, result: string, userId: string, userEmail: string): Promise<void> {
    await this.logEvent({
      userId,
      userEmail,
      action: AuditAction.UPDATE,
      entityType: EntityType.ASSESSMENT,
      entityId: assessmentId,
      metadata: {
        score,
        result,
        completedAt: new Date().toISOString()
      }
    })
  }

  // Query and reporting methods
  async getEvents(filter?: AuditFilter): Promise<AuditEvent[]> {
    let filteredEvents = [...this.events]

    if (filter) {
      if (filter.startDate) {
        filteredEvents = filteredEvents.filter(event => event.timestamp >= filter.startDate!)
      }
      if (filter.endDate) {
        filteredEvents = filteredEvents.filter(event => event.timestamp <= filter.endDate!)
      }
      if (filter.userId) {
        filteredEvents = filteredEvents.filter(event => event.userId === filter.userId)
      }
      if (filter.action) {
        filteredEvents = filteredEvents.filter(event => event.action === filter.action)
      }
      if (filter.entityType) {
        filteredEvents = filteredEvents.filter(event => event.entityType === filter.entityType)
      }
      if (filter.entityId) {
        filteredEvents = filteredEvents.filter(event => event.entityId === filter.entityId)
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async getEventsByEntity(entityType: EntityType, entityId: string): Promise<AuditEvent[]> {
    return this.getEvents({ entityType, entityId })
  }

  async getUserActivity(userId: string, days: number = 30): Promise<AuditEvent[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    return this.getEvents({ userId, startDate })
  }

  async getAuditSummary(days: number = 30): Promise<AuditSummary> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const events = await this.getEvents({ startDate })
    
    const userActions: Record<string, number> = {}
    const entityChanges: Record<string, number> = {}
    
    events.forEach(event => {
      userActions[event.userEmail] = (userActions[event.userEmail] || 0) + 1
      entityChanges[event.entityType] = (entityChanges[event.entityType] || 0) + 1
    })

    const criticalActions = [AuditAction.DELETE, AuditAction.APPROVE, AuditAction.REJECT] as const
    const criticalEvents = events.filter(event => 
      (criticalActions as readonly string[]).includes(event.action)
    )

    return {
      totalEvents: events.length,
      userActions,
      entityChanges,
      recentActivity: events.slice(0, 10),
      criticalEvents: criticalEvents.slice(0, 5)
    }
  }

  // Compliance and security methods
  async detectAnomalousActivity(userId: string): Promise<string[]> {
    const userEvents = await this.getUserActivity(userId, 7)
    const anomalies: string[] = []

    // Check for unusual activity patterns
    const actionsPerDay = userEvents.reduce((acc, event) => {
      const day = event.timestamp.toDateString()
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const avgActionsPerDay = Object.values(actionsPerDay).reduce((a, b) => a + b, 0) / Object.keys(actionsPerDay).length

    Object.entries(actionsPerDay).forEach(([day, count]) => {
      if (count > avgActionsPerDay * 3) {
        anomalies.push(`Unusual high activity on ${day}: ${count} actions`)
      }
    })

    // Check for rapid status changes
    const statusChanges = userEvents.filter(event => event.action === AuditAction.STATUS_CHANGE)
    if (statusChanges.length > 50) {
      anomalies.push(`High number of status changes: ${statusChanges.length}`)
    }

    // Check for after-hours activity
    const afterHoursEvents = userEvents.filter(event => {
      const hour = event.timestamp.getHours()
      return hour < 8 || hour > 18
    })
    
    if (afterHoursEvents.length > userEvents.length * 0.3) {
      anomalies.push(`High after-hours activity: ${afterHoursEvents.length} events`)
    }

    return anomalies
  }

  async exportAuditLog(filter?: AuditFilter): Promise<string> {
    const events = await this.getEvents(filter)
    
    const csvHeader = 'Timestamp,User,Action,Entity Type,Entity ID,Changes,Metadata\n'
    const csvRows = events.map(event => {
      const changes = event.changes?.map(c => `${c.field}: ${c.oldValue} → ${c.newValue}`).join('; ') || ''
      const metadata = JSON.stringify(event.metadata || {})
      
      return `${event.timestamp.toISOString()},${event.userEmail},${event.action},${event.entityType},${event.entityId},"${changes}","${metadata}"`
    }).join('\n')

    return csvHeader + csvRows
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  private persistEvents(): void {
    try {
      localStorage.setItem('auditEvents', JSON.stringify(this.events))
    } catch (error) {
      console.warn('Failed to persist audit events:', error)
    }
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('auditEvents')
      if (stored) {
        this.events = JSON.parse(stored).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }))
      }
    } catch (error) {
      console.warn('Failed to load audit events:', error)
      this.events = []
    }
  }

  constructor() {
    this.loadEvents()
  }
}

// Global instance
export const auditService = new AuditService()
export default auditService