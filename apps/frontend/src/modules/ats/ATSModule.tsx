import { useState, useEffect } from 'react'
import type { Translations } from '../../contexts/LanguageContext'

interface ATSModuleProps {
  t: Translations
}

// Professional SVG Icons
const WorkflowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

const TalentPoolIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const ComplianceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const IntegrationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9"/>
    <rect x="14" y="3" width="7" height="5"/>
    <rect x="14" y="12" width="7" height="9"/>
    <rect x="3" y="16" width="7" height="5"/>
  </svg>
)

const BuildingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/>
    <path d="M10 6h4"/>
    <path d="M10 10h4"/>
    <path d="M10 14h4"/>
    <path d="M10 18h4"/>
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
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BuildingIcon />
          {t.advancedATSSystem}
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#64748b' }}>
          {t.comprehensiveWorkflowManagement}
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
            label: t.activeWorkflows, 
            value: `${metrics.activeWorkflows}/${metrics.totalWorkflows}`, 
            icon: <WorkflowIcon />, 
            color: '#3b82f6',
            desc: t.automatedProcessesRunning
          },
          { 
            label: t.talentPoolCandidates, 
            value: metrics.totalCandidatesInPools.toLocaleString(), 
            icon: <TalentPoolIcon />, 
            color: '#10b981',
            desc: `${t.acrossTalentPools} ${metrics.totalTalentPools} ${t.talentPools.toLowerCase()}`
          },
          { 
            label: t.complianceScore, 
            value: `${metrics.complianceScore}%`, 
            icon: <ComplianceIcon />, 
            color: '#8b5cf6',
            desc: t.gdprEeocAdaCompliance
          },
          { 
            label: t.apiIntegrations, 
            value: `${metrics.connectedIntegrations}/${apiIntegrations.length}`, 
            icon: <IntegrationIcon />, 
            color: '#f59e0b',
            desc: t.connectedHRTools
          }
        ].map((metric, index) => (
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
              fontSize: '20px',
              marginBottom: '16px'
            }}>
              {metric.icon}
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
        ))}
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
            title: t.workflowManagement,
            description: t.createManageWorkflows,
            icon: <WorkflowIcon />,
            color: '#3b82f6',
            features: [t.customWorkflowBuilder, t.automatedTriggers, t.stepConditions, t.teamAssignments]
          },
          {
            id: 'talent-pools',
            title: t.talentPoolSegmentation,
            description: t.segmentBySkillsExperience,
            icon: <TalentPoolIcon />,
            color: '#10b981',
            features: [t.smartSegmentation, t.targetedCommunication, t.poolAnalytics, t.autoCategorization]
          },
          {
            id: 'compliance',
            title: t.complianceTracking,
            description: t.ensureCompliance,
            icon: <ComplianceIcon />,
            color: '#8b5cf6',
            features: [t.complianceMonitoring, t.violationAlerts, t.auditTrails, t.policyEnforcement]
          },
          {
            id: 'integrations',
            title: t.apiIntegrations,
            description: t.connectHRTools,
            icon: <IntegrationIcon />,
            color: '#f59e0b',
            features: [t.hrmsIntegration, t.assessmentTools, t.backgroundChecks, t.communicationPlatforms]
          }
        ].map((card, index) => (
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
                fontSize: '18px'
              }}>
                {card.icon}
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
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeView) {
      case 'workflows':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <WorkflowIcon /> {t.workflowManagement}
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{t.advancedWorkflowFeatures}</p>
        </div>
      case 'talent-pools':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <TalentPoolIcon /> {t.talentPoolSegmentation}
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{t.segmentTalentBySkills}</p>
        </div>
      case 'compliance':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ComplianceIcon /> {t.complianceTracking}
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{t.gdprEeocAdaCompliance}</p>
        </div>
      case 'integrations':
        return <div style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <IntegrationIcon /> {t.apiIntegrations}
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{t.hrToolsIntegrationPlatform}</p>
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
          { id: 'dashboard', label: t.dashboard, icon: <DashboardIcon /> },
          { id: 'workflows', label: t.workflows, icon: <WorkflowIcon /> },
          { id: 'talent-pools', label: t.talentPools, icon: <TalentPoolIcon /> },
          { id: 'compliance', label: t.compliance, icon: <ComplianceIcon /> },
          { id: 'integrations', label: t.integrations, icon: <IntegrationIcon /> }
        ].map((tab) => (
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
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}

export default ATSModule
