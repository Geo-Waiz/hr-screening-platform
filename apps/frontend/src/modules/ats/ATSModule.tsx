import { useState, useEffect } from 'react'
import { Translations } from '../../contexts/LanguageContext'

// Professional SVG Icons
const WorkflowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
  </svg>
)

const CandidatesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4c0-1.11-.89-2-2-2s-2 .89-2 2 .89 2 2 2 2-.89 2-2zm4 18v-6h2.5l-2.54-7.63A3.02 3.02 0 0 0 17.06 7H6.94c-1.4 0-2.6.93-2.9 2.37L1.5 16H4v6h16z" fill="currentColor"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/>
  </svg>
)

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor"/>
    <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const BoltIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z" fill="currentColor"/>
  </svg>
)

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
  </svg>
)

// Enhanced ATS interfaces for comprehensive functionality
interface WorkflowStep {
  id: string
  name: string
  type: 'MANUAL' | 'AUTOMATED' | 'CONDITIONAL'
  conditions: string[]
  actions: string[]
  assignee?: string
  duration: number // in days
  required: boolean
  notifications: string[]
}

interface Workflow {
  id: string
  name: string
  description: string
  category: 'RECRUITING' | 'ONBOARDING' | 'COMPLIANCE' | 'ASSESSMENT'
  steps: WorkflowStep[]
  isActive: boolean
  triggers: string[]
  createdAt: Date
  updatedAt: Date
}

interface TalentPool {
  id: string
  name: string
  description: string
  criteria: {
    skills: string[]
    experience: string
    jobLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE'
    certifications: string[]
    location: string[]
  }
  candidateCount: number
  lastUpdated: Date
  communicationTemplates: string[]
}

interface ComplianceRule {
  id: string
  name: string
  type: 'GDPR' | 'EEOC' | 'ADA' | 'CUSTOM'
  description: string
  requirements: string[]
  checkpoints: string[]
  violations: number
  lastCheck: Date
  isActive: boolean
}

interface APIIntegration {
  id: string
  name: string
  provider: string
  type: 'HRMS' | 'PAYROLL' | 'BACKGROUND_CHECK' | 'ASSESSMENT' | 'COMMUNICATION'
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
  lastSync: Date
  dataPoints: string[]
  config: Record<string, any>
}

interface ResumeData {
  id: string
  candidateId: string
  fileName: string
  uploadDate: Date
  extractedData: {
    name: string
    email: string
    phone: string
    skills: string[]
    experience: string[]
    education: string[]
    certifications: string[]
    keywords: string[]
  }
  processingStatus: 'PENDING' | 'PROCESSED' | 'ERROR'
  confidence: number
}

interface ATSModuleProps {
  t: Translations
}

const ATSModule = ({ t }: ATSModuleProps) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'workflows' | 'compliance' | 'talent-pools' | 'integrations' | 'resume-parser' | 'settings'>('dashboard')
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [talentPools, setTalentPools] = useState<TalentPool[]>([])
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([])
  const [apiIntegrations, setAPIIntegrations] = useState<APIIntegration[]>([])
  const [resumeData, setResumeData] = useState<ResumeData[]>([])

  // Initialize with comprehensive mock data
  useEffect(() => {
    // Mock Workflows
    const mockWorkflows: Workflow[] = [
      {
        id: 'wf_1',
        name: 'Standard Recruitment Workflow',
        description: 'Complete recruitment process from application to hire',
        category: 'RECRUITING',
        steps: [
          {
            id: 'step_1',
            name: 'Application Review',
            type: 'MANUAL',
            conditions: ['Application submitted'],
            actions: ['Screen resume', 'Check requirements'],
            assignee: 'HR Recruiter',
            duration: 2,
            required: true,
            notifications: ['candidate', 'hiring_manager']
          },
          {
            id: 'step_2',
            name: 'Phone Screening',
            type: 'MANUAL',
            conditions: ['Application approved'],
            actions: ['Schedule call', 'Conduct interview'],
            assignee: 'HR Recruiter',
            duration: 3,
            required: true,
            notifications: ['candidate']
          },
          {
            id: 'step_3',
            name: 'Technical Assessment',
            type: 'AUTOMATED',
            conditions: ['Phone screening passed'],
            actions: ['Send assessment link', 'Evaluate results'],
            duration: 5,
            required: true,
            notifications: ['candidate', 'technical_lead']
          },
          {
            id: 'step_4',
            name: 'Final Interview',
            type: 'MANUAL',
            conditions: ['Assessment score >= 70%'],
            actions: ['Schedule interview', 'Conduct interview'],
            assignee: 'Hiring Manager',
            duration: 7,
            required: true,
            notifications: ['candidate', 'hiring_manager']
          }
        ],
        isActive: true,
        triggers: ['New Application'],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-20')
      },
      {
        id: 'wf_2',
        name: 'Compliance Check Workflow',
        description: 'Automated compliance verification for all candidates',
        category: 'COMPLIANCE',
        steps: [
          {
            id: 'comp_1',
            name: 'GDPR Consent Verification',
            type: 'AUTOMATED',
            conditions: ['Application submitted'],
            actions: ['Check consent', 'Log compliance'],
            duration: 1,
            required: true,
            notifications: ['compliance_officer']
          },
          {
            id: 'comp_2',
            name: 'Background Check',
            type: 'AUTOMATED',
            conditions: ['Offer extended'],
            actions: ['Initiate background check', 'Verify credentials'],
            duration: 10,
            required: true,
            notifications: ['hr_manager']
          }
        ],
        isActive: true,
        triggers: ['Application Submitted', 'Offer Extended'],
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-15')
      }
    ]

    // Mock Talent Pools
    const mockTalentPools: TalentPool[] = [
      {
        id: 'pool_1',
        name: 'Senior React Developers',
        description: 'Experienced React developers with 5+ years',
        criteria: {
          skills: ['React', 'TypeScript', 'Redux', 'Node.js'],
          experience: '5+ years',
          jobLevel: 'SENIOR',
          certifications: ['AWS Certified Developer'],
          location: ['Remote', 'San Francisco', 'New York']
        },
        candidateCount: 247,
        lastUpdated: new Date(),
        communicationTemplates: ['Senior Developer Newsletter', 'Exclusive Opportunities']
      },
      {
        id: 'pool_2',
        name: 'Data Science Professionals',
        description: 'Data scientists and ML engineers',
        criteria: {
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
          experience: '3+ years',
          jobLevel: 'MID',
          certifications: ['Google Cloud ML Engineer', 'AWS ML Specialty'],
          location: ['Remote', 'Seattle', 'Boston']
        },
        candidateCount: 156,
        lastUpdated: new Date(),
        communicationTemplates: ['Data Science Insights', 'AI/ML Opportunities']
      },
      {
        id: 'pool_3',
        name: 'Entry Level Graduates',
        description: 'Recent graduates and entry-level candidates',
        criteria: {
          skills: ['JavaScript', 'Python', 'Git', 'Communication'],
          experience: '0-2 years',
          jobLevel: 'ENTRY',
          certifications: ['CS Degree', 'Coding Bootcamp'],
          location: ['Any']
        },
        candidateCount: 892,
        lastUpdated: new Date(),
        communicationTemplates: ['Graduate Program Info', 'Entry Level Opportunities']
      }
    ]

    // Mock Compliance Rules
    const mockComplianceRules: ComplianceRule[] = [
      {
        id: 'comp_1',
        name: 'GDPR Data Protection',
        type: 'GDPR',
        description: 'Ensure candidate data protection compliance',
        requirements: [
          'Explicit consent for data processing',
          'Right to data deletion',
          'Data breach notification within 72 hours'
        ],
        checkpoints: ['Application submission', 'Data retention review'],
        violations: 0,
        lastCheck: new Date(),
        isActive: true
      },
      {
        id: 'comp_2',
        name: 'Equal Opportunity Employment',
        type: 'EEOC',
        description: 'Fair hiring practices compliance',
        requirements: [
          'No discrimination based on protected characteristics',
          'Reasonable accommodations for disabilities',
          'Record keeping for compliance reporting'
        ],
        checkpoints: ['Job posting review', 'Interview feedback', 'Hiring decision'],
        violations: 0,
        lastCheck: new Date(),
        isActive: true
      }
    ]

    // Mock API Integrations
    const mockAPIIntegrations: APIIntegration[] = [
      {
        id: 'api_1',
        name: 'BambooHR',
        provider: 'BambooHR',
        type: 'HRMS',
        status: 'CONNECTED',
        lastSync: new Date(),
        dataPoints: ['Employee records', 'Time off', 'Performance reviews'],
        config: { apiKey: '***', endpoint: 'https://api.bamboohr.com' }
      },
      {
        id: 'api_2',
        name: 'HackerRank',
        provider: 'HackerRank',
        type: 'ASSESSMENT',
        status: 'CONNECTED',
        lastSync: new Date(),
        dataPoints: ['Coding assessments', 'Skill scores', 'Interview feedback'],
        config: { apiKey: '***', endpoint: 'https://api.hackerrank.com' }
      },
      {
        id: 'api_3',
        name: 'Checkr',
        provider: 'Checkr',
        type: 'BACKGROUND_CHECK',
        status: 'DISCONNECTED',
        lastSync: new Date('2024-09-15'),
        dataPoints: ['Background checks', 'Criminal records', 'Employment verification'],
        config: { apiKey: '***', endpoint: 'https://api.checkr.com' }
      }
    ]

    // Mock Resume Data
    const mockResumeData: ResumeData[] = [
      {
        id: 'resume_1',
        candidateId: 'candidate_1',
        fileName: 'sarah_chen_resume.pdf',
        uploadDate: new Date(),
        extractedData: {
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com',
          phone: '+1-555-123-4567',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'MongoDB'],
          experience: ['Senior Frontend Developer at TechCorp', 'Full Stack Developer at StartupXYZ'],
          education: ['BS Computer Science, Stanford University'],
          certifications: ['AWS Certified Developer', 'React Certification'],
          keywords: ['frontend', 'javascript', 'agile', 'remote', 'startup']
        },
        processingStatus: 'PROCESSED',
        confidence: 0.95
      }
    ]

    setWorkflows(mockWorkflows)
    setTalentPools(mockTalentPools)
    setComplianceRules(mockComplianceRules)
    setAPIIntegrations(mockAPIIntegrations)
    setResumeData(mockResumeData)
  }, [])

  // Calculate comprehensive metrics
  const metrics = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.isActive).length,
    totalTalentPools: talentPools.length,
    totalCandidatesInPools: talentPools.reduce((sum, pool) => sum + pool.candidateCount, 0),
    complianceScore: Math.round((complianceRules.filter(r => r.violations === 0).length / complianceRules.length) * 100),
    connectedIntegrations: apiIntegrations.filter(api => api.status === 'CONNECTED').length,
    processedResumes: resumeData.filter(r => r.processingStatus === 'PROCESSED').length,
    automationSavings: '24.5 hrs/week'
  }

  const renderDashboard = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>
          <DashboardIcon /> {t.dashboard} - Advanced ATS System
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#64748b' }}>
          Comprehensive workflow management, compliance tracking, and talent segmentation
        </p>
      </div>

      {/* Advanced Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        {[
          { 
            label: t.activeJobs, 
            value: `${metrics.activeWorkflows}/${metrics.totalWorkflows}`, 
            icon: WorkflowIcon, 
            color: '#3b82f6',
            desc: 'Automated processes running'
          },
          { 
            label: t.totalCandidates, 
            value: metrics.totalCandidatesInPools.toLocaleString(), 
            icon: CandidatesIcon, 
            color: '#10b981',
            desc: `Across ${metrics.totalTalentPools} talent pools`
          },
          { 
            label: 'Compliance Score', 
            value: `${metrics.complianceScore}%`, 
            icon: ShieldIcon, 
            color: '#8b5cf6',
            desc: 'GDPR, EEOC, ADA compliance'
          },
          { 
            label: 'API Integrations', 
            value: `${metrics.connectedIntegrations}/${apiIntegrations.length}`, 
            icon: LinkIcon, 
            color: '#f59e0b',
            desc: 'Connected HR tools'
          },
          { 
            label: 'Processed Resumes', 
            value: metrics.processedResumes.toString(), 
            icon: DocumentIcon, 
            color: '#06b6d4',
            desc: 'AI-extracted data ready'
          },
          { 
            label: 'Automation Savings', 
            value: metrics.automationSavings, 
            icon: BoltIcon, 
            color: '#ef4444',
            desc: 'Time saved by workflows'
          }
        ].map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: metric.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: metric.color,
                marginBottom: '16px'
              }}>
                <IconComponent />
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                {metric.value}
              </h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                {metric.label}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
                {metric.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Navigation Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px' 
      }}>
        {[
          {
            id: 'workflows',
            title: 'Workflow Management',
            description: 'Create and manage recruitment workflows with automated steps',
            icon: WorkflowIcon,
            color: '#3b82f6',
            features: ['Custom workflow builder', 'Automated triggers', 'Step conditions', 'Team assignments']
          },
          {
            id: 'talent-pools',
            title: 'Talent Pool Segmentation',
            description: 'Segment candidates by skills, experience, and job level',
            icon: CandidatesIcon,
            color: '#10b981',
            features: ['Smart segmentation', 'Targeted communication', 'Pool analytics', 'Auto-categorization']
          },
          {
            id: 'compliance',
            title: 'Compliance Tracking',
            description: 'Ensure GDPR, EEOC, and ADA compliance across all processes',
            icon: ShieldIcon,
            color: '#8b5cf6',
            features: ['Compliance monitoring', 'Violation alerts', 'Audit trails', 'Policy enforcement']
          },
          {
            id: 'integrations',
            title: 'API Integrations',
            description: 'Connect with HR tools and external systems',
            icon: LinkIcon,
            color: '#f59e0b',
            features: ['HRMS integration', 'Assessment tools', 'Background checks', 'Communication platforms']
          },
          {
            id: 'resume-parser',
            title: 'Resume Parser',
            description: 'AI-powered resume parsing and keyword extraction',
            icon: DocumentIcon,
            color: '#06b6d4',
            features: ['AI extraction', 'Keyword tagging', 'Skill identification', 'Structured database']
          }
        ].map((card, index) => {
          const IconComponent = card.icon
          return (
            <div key={index} 
              onClick={() => setActiveView(card.id as any)}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: card.color + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color
                }}>
                  <IconComponent />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                  {card.title}
                </h3>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
                {card.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {card.features.map((feature, idx) => (
                  <span key={idx} style={{
                    background: '#f8fafc',
                    color: '#64748b',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case 'workflows':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px' }}>🔄 Workflow Management</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Advanced workflow management system coming soon...</p>
        </div>
      case 'talent-pools':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px' }}>👥 Talent Pool Segmentation</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Advanced talent segmentation features coming soon...</p>
        </div>
      case 'compliance':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px' }}>🛡️ Compliance Tracking</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>GDPR, EEOC, and ADA compliance features coming soon...</p>
        </div>
      case 'integrations':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px' }}>🔗 API Integrations</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>HR tools integration platform coming soon...</p>
        </div>
      case 'resume-parser':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px' }}>📄 Resume Parser</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>AI-powered resume parsing system coming soon...</p>
        </div>
      default:
        return renderDashboard()
    }
  }

  return (
    <div>
      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        background: '#f8fafc',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        {[
          { id: 'dashboard', label: t.dashboard, icon: DashboardIcon },
          { id: 'workflows', label: 'Workflows', icon: WorkflowIcon },
          { id: 'talent-pools', label: 'Talent Pools', icon: CandidatesIcon },
          { id: 'compliance', label: 'Compliance', icon: ShieldIcon },
          { id: 'integrations', label: 'Integrations', icon: LinkIcon },
          { id: 'resume-parser', label: 'Resume Parser', icon: DocumentIcon }
        ].map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              style={{
                background: activeView === tab.id ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeView === tab.id ? '600' : '500',
                color: activeView === tab.id ? '#1e293b' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: activeView === tab.id ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              <IconComponent />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}

export default ATSModule