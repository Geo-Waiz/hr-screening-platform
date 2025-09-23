import { useState, useEffect } from 'react'
import type { Job, Application, JobAnalytics } from '../types/jobs'
import { JobStatus, ApplicationStatus } from '../types/jobs'
import auditService from '../services/auditService'

// Mock data store - in real app this would be API calls
class DataStore {
  private jobs: Job[] = []
  private applications: Application[] = []
  private analytics: JobAnalytics[] = []

  // Job methods
  getJobs(): Job[] {
    return this.jobs
  }

  getJob(id: string): Job | undefined {
    return this.jobs.find(job => job.id === id)
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job {
    const job: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.jobs.push(job)
    return job
  }

  updateJob(id: string, updates: Partial<Job>): Job | null {
    const index = this.jobs.findIndex(job => job.id === id)
    if (index === -1) return null

    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
      updatedAt: new Date()
    }
    return this.jobs[index]
  }

  deleteJob(id: string): boolean {
    const index = this.jobs.findIndex(job => job.id === id)
    if (index === -1) return false

    this.jobs.splice(index, 1)
    return true
  }

  // Application methods
  getApplications(): Application[] {
    return this.applications
  }

  getApplicationsByJob(jobId: string): Application[] {
    return this.applications.filter(app => app.jobId === jobId)
  }

  getApplicationsByCandidate(candidateId: string): Application[] {
    return this.applications.filter(app => app.candidateId === candidateId)
  }

  createApplication(applicationData: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>): Application {
    const application: Application = {
      ...applicationData,
      id: `app_${Date.now()}`,
      appliedAt: new Date(),
      updatedAt: new Date()
    }
    this.applications.push(application)

    // Update job application count
    const job = this.getJob(application.jobId)
    if (job) {
      job.applicationCount++
    }

    return application
  }

  updateApplication(id: string, updates: Partial<Application>): Application | null {
    const index = this.applications.findIndex(app => app.id === id)
    if (index === -1) return null

    this.applications[index] = {
      ...this.applications[index],
      ...updates,
      updatedAt: new Date()
    }
    return this.applications[index]
  }

  // Analytics methods
  getJobAnalytics(jobId: string): JobAnalytics | undefined {
    return this.analytics.find(analytics => analytics.jobId === jobId)
  }

  calculateJobMetrics(jobId: string) {
    const applications = this.getApplicationsByJob(jobId)
    const job = this.getJob(jobId)
    
    if (!job) return null

    const totalApplications = applications.length
    const qualifiedApplications = applications.filter(app => 
      app.status !== ApplicationStatus.REJECTED && 
      app.status !== ApplicationStatus.WITHDRAWN
    ).length

    const interviews = applications.reduce((count, app) => 
      count + app.interviews.length, 0
    )

    const offers = applications.reduce((count, app) => 
      count + app.offers.length, 0
    )

    const hires = applications.filter(app => 
      app.status === ApplicationStatus.HIRED
    ).length

    return {
      totalApplications,
      qualifiedApplications,
      interviews,
      offers,
      hires,
      conversionRates: {
        viewToApplication: job.viewCount > 0 ? (totalApplications / job.viewCount) * 100 : 0,
        applicationToScreening: totalApplications > 0 ? (qualifiedApplications / totalApplications) * 100 : 0,
        screeningToInterview: qualifiedApplications > 0 ? (interviews / qualifiedApplications) * 100 : 0,
        interviewToOffer: interviews > 0 ? (offers / interviews) * 100 : 0,
        offerToHire: offers > 0 ? (hires / offers) * 100 : 0
      }
    }
  }

  // Search and filter methods
  searchJobs(query: string, filters?: {
    status?: JobStatus
    department?: string
    location?: string
    priority?: string
  }): Job[] {
    let filteredJobs = this.jobs

    // Text search
    if (query) {
      const searchLower = query.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.department.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.name.toLowerCase().includes(searchLower))
      )
    }

    // Apply filters
    if (filters) {
      if (filters.status) {
        filteredJobs = filteredJobs.filter(job => job.status === filters.status)
      }
      if (filters.department) {
        filteredJobs = filteredJobs.filter(job => job.department === filters.department)
      }
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => job.location.includes(filters.location!))
      }
      if (filters.priority) {
        filteredJobs = filteredJobs.filter(job => job.priority === filters.priority)
      }
    }

    return filteredJobs
  }
}

// Global data store instance
const dataStore = new DataStore()

// Custom hooks for data management with audit logging
export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setJobs(dataStore.getJobs())
  }, [])

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userEmail: string) => {
    setLoading(true)
    try {
      const job = dataStore.createJob(jobData)
      setJobs(dataStore.getJobs())
      
      // Log audit event
      await auditService.logJobCreated(job.id, jobData, userId, userEmail)
      
      return job
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateJob = async (id: string, updates: Partial<Job>, userId: string, userEmail: string) => {
    setLoading(true)
    try {
      const oldJob = dataStore.getJob(id)
      const updatedJob = dataStore.updateJob(id, updates)
      
      if (updatedJob && oldJob) {
        setJobs(dataStore.getJobs())
        
        // Calculate changes for audit log
        const changes: Record<string, { old: any, new: any }> = {}
        Object.keys(updates).forEach(key => {
          const oldValue = (oldJob as any)[key]
          const newValue = (updates as any)[key]
          if (oldValue !== newValue) {
            changes[key] = { old: oldValue, new: newValue }
          }
        })
        
        // Log audit event
        if (Object.keys(changes).length > 0) {
          await auditService.logJobUpdated(id, changes, userId, userEmail)
        }
        
        return updatedJob
      }
      throw new Error('Job not found')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id: string, userId: string, userEmail: string) => {
    setLoading(true)
    try {
      const job = dataStore.getJob(id)
      if (!job) throw new Error('Job not found')
      
      const success = dataStore.deleteJob(id)
      if (success) {
        setJobs(dataStore.getJobs())
        
        // Log audit event
        await auditService.logJobDeleted(id, job.title, userId, userEmail)
        
        return true
      }
      throw new Error('Failed to delete job')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchJobs = (query: string, filters?: any) => {
    return dataStore.searchJobs(query, filters)
  }

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    searchJobs,
    refreshJobs: () => setJobs(dataStore.getJobs())
  }
}

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setApplications(dataStore.getApplications())
  }, [])

  const createApplication = async (
    applicationData: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>,
    userId: string,
    userEmail: string
  ) => {
    setLoading(true)
    try {
      const application = dataStore.createApplication(applicationData)
      setApplications(dataStore.getApplications())
      
      // Log audit event
      await auditService.logApplicationCreated(
        application.id,
        application.candidateId,
        application.jobId,
        userId,
        userEmail
      )
      
      return application
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (
    id: string,
    newStatus: ApplicationStatus,
    userId: string,
    userEmail: string
  ) => {
    setLoading(true)
    try {
      const application = dataStore.getApplications().find(app => app.id === id)
      if (!application) throw new Error('Application not found')
      
      const oldStatus = application.status
      const updatedApplication = dataStore.updateApplication(id, { status: newStatus })
      
      if (updatedApplication) {
        setApplications(dataStore.getApplications())
        
        // Log audit event
        await auditService.logApplicationStatusChanged(
          id,
          oldStatus,
          newStatus,
          userId,
          userEmail
        )
        
        return updatedApplication
      }
      throw new Error('Failed to update application')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application status')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getApplicationsByJob = (jobId: string) => {
    return dataStore.getApplicationsByJob(jobId)
  }

  const getApplicationsByCandidate = (candidateId: string) => {
    return dataStore.getApplicationsByCandidate(candidateId)
  }

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplicationStatus,
    getApplicationsByJob,
    getApplicationsByCandidate,
    refreshApplications: () => setApplications(dataStore.getApplications())
  }
}

export const useJobAnalytics = () => {
  const getJobMetrics = (jobId: string) => {
    return dataStore.calculateJobMetrics(jobId)
  }

  const getDashboardMetrics = () => {
    const jobs = dataStore.getJobs()
    const applications = dataStore.getApplications()
    
    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === JobStatus.ACTIVE).length,
      totalApplications: applications.length,
      avgApplicationsPerJob: jobs.length > 0 ? Math.round(applications.length / jobs.length) : 0,
      conversionRate: applications.length > 0 ? 
        (applications.filter(app => app.status === ApplicationStatus.HIRED).length / applications.length) * 100 : 0
    }
  }

  const getPerformanceMetrics = () => {
    const jobs = dataStore.getJobs()
    const applications = dataStore.getApplications()
    
    const jobPerformance = jobs.map(job => {
      const jobApplications = applications.filter(app => app.jobId === job.id)
      const metrics = dataStore.calculateJobMetrics(job.id)
      
      return {
        jobId: job.id,
        title: job.title,
        department: job.department,
        applications: jobApplications.length,
        views: job.viewCount,
        conversionRate: job.viewCount > 0 ? (jobApplications.length / job.viewCount) * 100 : 0,
        metrics
      }
    }).sort((a, b) => b.applications - a.applications)
    
    return jobPerformance
  }

  return {
    getJobMetrics,
    getDashboardMetrics,
    getPerformanceMetrics
  }
}

// Integration service for cross-module communication
export const integrationService = {
  // Notify other modules when a job status changes
  onJobStatusChange: (jobId: string, oldStatus: JobStatus, newStatus: JobStatus) => {
    // Trigger analytics update
    console.log(`Job ${jobId} status changed from ${oldStatus} to ${newStatus}`)
    
    // Update related applications if job is closed
    if (newStatus === JobStatus.CLOSED || newStatus === JobStatus.EXPIRED) {
      const applications = dataStore.getApplicationsByJob(jobId)
      applications.forEach(app => {
        if (app.status === ApplicationStatus.NEW || app.status === ApplicationStatus.REVIEWING) {
          dataStore.updateApplication(app.id, { status: ApplicationStatus.REJECTED })
        }
      })
    }
  },

  // Handle application lifecycle events
  onApplicationSubmitted: (_applicationId: string, jobId: string) => {
    // Update job application count
    const job = dataStore.getJob(jobId)
    if (job) {
      dataStore.updateJob(jobId, { applicationCount: job.applicationCount + 1 })
    }
  },

  // Calculate candidate pipeline movement
  getCandidatePipeline: (candidateId: string) => {
    const applications = dataStore.getApplicationsByCandidate(candidateId)
    return applications.map(app => {
      const job = dataStore.getJob(app.jobId)
      return {
        applicationId: app.id,
        jobTitle: job?.title || 'Unknown Job',
        status: app.status,
        stage: app.stage,
        timeline: app.timeline
      }
    })
  },

  // Generate cross-module reports
  generateComprehensiveReport: () => {
    const jobs = dataStore.getJobs()
    const applications = dataStore.getApplications()
    
    return {
      summary: {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === JobStatus.ACTIVE).length,
        totalApplications: applications.length,
        totalCandidates: new Set(applications.map(app => app.candidateId)).size
      },
      jobPerformance: jobs.map(job => ({
        id: job.id,
        title: job.title,
        status: job.status,
        applications: applications.filter(app => app.jobId === job.id).length,
        metrics: dataStore.calculateJobMetrics(job.id)
      })),
      pipeline: applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
}

export default dataStore