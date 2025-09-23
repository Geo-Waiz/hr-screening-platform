import { useState, useEffect } from 'react'
import { useApplications } from '../../hooks/useDataIntegration'
import { ApplicationStatus } from '../../types/jobs'
import auditService from '../../services/auditService'

// Professional SVG Icons
const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13,2 13,9 20,9"/>
  </svg>
)

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
)

const ScreenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

// Translation interface
interface ScreeningModuleProps {
  t: {
    analytics: string
    [key: string]: string
  }
}

// Mock screening data
interface Screening {
  id: string
  candidateId: string
  candidateName: string
  jobId: string
  jobTitle: string
  type: 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'FINAL'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  date: Date
  duration: number // minutes
  interviewer: string
  feedback: string
  score: number // 1-10
  questions: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

const mockUser = {
  id: 'user_1',
  email: 'admin@company.com'
}

const ScreeningModule = ({ t }: ScreeningModuleProps) => {
  const [activeView, setActiveView] = useState<'overview' | 'scheduled' | 'completed' | 'analytics'>('overview')
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null)
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')

  const { applications } = useApplications()

  // Initialize with mock screenings
  useEffect(() => {
    const mockScreenings: Screening[] = [
      {
        id: 'screening_1',
        candidateId: 'candidate_1',
        candidateName: 'Sarah Chen',
        jobId: 'job_1',
        jobTitle: 'Senior Frontend Developer',
        type: 'TECHNICAL',
        status: 'SCHEDULED',
        date: new Date('2024-10-25T10:00:00'),
        duration: 90,
        interviewer: 'Alex Thompson',
        feedback: '',
        score: 0,
        questions: [
          'Explain React hooks and their lifecycle',
          'Code a custom hook for API calls',
          'Optimize a React component for performance'
        ],
        notes: 'Focus on React expertise and system design',
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date('2024-09-20')
      },
      {
        id: 'screening_2',
        candidateId: 'candidate_2',
        candidateName: 'Marcus Johnson',
        jobId: 'job_2',
        jobTitle: 'Product Manager',
        type: 'VIDEO',
        status: 'COMPLETED',
        date: new Date('2024-09-22T14:00:00'),
        duration: 60,
        interviewer: 'Lisa Wong',
        feedback: 'Strong product thinking, excellent communication skills. Great fit for the role.',
        score: 8,
        questions: [
          'How do you prioritize product features?',
          'Describe your experience with agile methodologies',
          'How do you handle stakeholder conflicts?'
        ],
        notes: 'Recommended for next round',
        createdAt: new Date('2024-09-18'),
        updatedAt: new Date('2024-09-22')
      },
      {
        id: 'screening_3',
        candidateId: 'candidate_3',
        candidateName: 'Elena Rodriguez',
        jobId: 'job_3',
        jobTitle: 'UX Designer',
        type: 'PHONE',
        status: 'COMPLETED',
        date: new Date('2024-09-21T11:00:00'),
        duration: 45,
        interviewer: 'Mike Davis',
        feedback: 'Impressive portfolio, strong design process understanding.',
        score: 9,
        questions: [
          'Walk through your design process',
          'How do you handle user feedback?',
          'Describe a challenging design project'
        ],
        notes: 'Excellent candidate, proceed to technical round',
        createdAt: new Date('2024-09-19'),
        updatedAt: new Date('2024-09-21')
      },
      {
        id: 'screening_4',
        candidateId: 'candidate_1',
        candidateName: 'Sarah Chen',
        jobId: 'job_1',
        jobTitle: 'Senior Frontend Developer',
        type: 'FINAL',
        status: 'SCHEDULED',
        date: new Date('2024-10-28T15:00:00'),
        duration: 120,
        interviewer: 'James Wilson (CTO)',
        feedback: '',
        score: 0,
        questions: [
          'System architecture discussion',
          'Leadership and mentoring experience',
          'Company culture fit'
        ],
        notes: 'Final round with leadership team',
        createdAt: new Date('2024-09-23'),
        updatedAt: new Date('2024-09-23')
      }
    ]
    setScreenings(mockScreenings)
  }, [])

  // Filter screenings
  const filteredScreenings = screenings.filter(screening => {
    const matchesDate = !dateFilter || screening.date.toISOString().split('T')[0] === dateFilter
    const matchesStatus = statusFilter === 'ALL' || screening.status === statusFilter
    const matchesType = typeFilter === 'ALL' || screening.type === typeFilter
    
    return matchesDate && matchesStatus && matchesType
  })

  // Calculate metrics
  const metrics = {
    totalScreenings: screenings.length,
    scheduledScreenings: screenings.filter(s => s.status === 'SCHEDULED').length,
    completedScreenings: screenings.filter(s => s.status === 'COMPLETED').length,
    averageScore: screenings.filter(s => s.score > 0).length > 0 
      ? Math.round(screenings.filter(s => s.score > 0).reduce((sum, s) => sum + s.score, 0) / screenings.filter(s => s.score > 0).length * 10) / 10
      : 0,
    upcomingToday: screenings.filter(s => 
      s.status === 'SCHEDULED' && 
      s.date.toDateString() === new Date().toDateString()
    ).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return { bg: '#eff6ff', text: '#1d4ed8' }
      case 'IN_PROGRESS': return { bg: '#fef3c7', text: '#92400e' }
      case 'COMPLETED': return { bg: '#dcfce7', text: '#166534' }
      case 'CANCELLED': return { bg: '#fee2e2', text: '#dc2626' }
      case 'NO_SHOW': return { bg: '#f3f4f6', text: '#6b7280' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHONE': return ScreenIcon
      case 'VIDEO': return ScreenIcon  
      case 'ONSITE': return DocumentIcon
      case 'TECHNICAL': return ScreenIcon
      case 'FINAL': return StarIcon
      default: return DocumentIcon
    }
  }

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Screening Management</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Schedule and manage candidate interviews and assessments</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveView('analytics')}
            style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AnalyticsIcon /> {t.analytics}
          </button>
          <button
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + Schedule Interview
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Screenings', value: metrics.totalScreenings, icon: DocumentIcon, color: '#4f46e5' },
          { label: 'Completed', value: metrics.completedScreenings, icon: DocumentIcon, color: '#10b981' },
          { label: 'Scheduled', value: metrics.scheduledScreenings, icon: DocumentIcon, color: '#f59e0b' },
          { label: 'Average Score', value: `${metrics.averageScore}/10`, icon: StarIcon, color: '#f59e0b' },
          { label: 'This Week', value: metrics.thisWeekScreenings, icon: DocumentIcon, color: '#8b5cf6' }
        ].map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.transform = 'translateY(-2px)'
            target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.transform = 'translateY(0)'
            target.style.boxShadow = 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: metric.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: metric.color
              }}>
                <IconComponent />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>
                  {metric.value}
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {metric.label}
                </p>
              </div>
            </div>
          </div>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="ALL">All Types</option>
            <option value="PHONE">Phone</option>
            <option value="VIDEO">Video</option>
            <option value="ONSITE">Onsite</option>
            <option value="TECHNICAL">Technical</option>
            <option value="FINAL">Final</option>
          </select>
        </div>
      </div>

      {/* Screenings List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 100px 150px 100px 80px 120px',
          gap: '16px',
          padding: '16px 20px',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280'
        }}>
          <div>CANDIDATE & JOB</div>
          <div>TYPE</div>
          <div>STATUS</div>
          <div>DATE & TIME</div>
          <div>INTERVIEWER</div>
          <div>SCORE</div>
          <div>ACTIONS</div>
        </div>

        {filteredScreenings.map((screening) => (
          <div key={screening.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 100px 150px 100px 80px 120px',
            gap: '16px',
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = '#f9fafb'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.backgroundColor = 'transparent'
          }}
          onClick={() => setSelectedScreening(screening)}>
            <div>
              <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
                {screening.candidateName}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {screening.jobTitle}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '16px' }}>{getTypeIcon(screening.type)}</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>{screening.type}</span>
            </div>
            <div>
              <span style={{
                ...getStatusColor(screening.status),
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: getStatusColor(screening.status).bg,
                color: getStatusColor(screening.status).text
              }}>
                {screening.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#1f2937', fontWeight: '500' }}>
                {screening.date.toLocaleDateString()}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                {screening.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {screening.interviewer}
            </div>
            <div style={{ textAlign: 'center' }}>
              {screening.score > 0 && (
                <span style={{
                  background: screening.score >= 7 ? '#dcfce7' : screening.score >= 5 ? '#fef3c7' : '#fee2e2',
                  color: screening.score >= 7 ? '#166534' : screening.score >= 5 ? '#92400e' : '#dc2626',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {screening.score}/10
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '500'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle view details
                }}
              >
                View
              </button>
              {screening.status === 'SCHEDULED' && (
                <button
                  style={{
                    background: '#f0fdf4',
                    color: '#166534',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle start interview
                  }}
                >
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredScreenings.length === 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '40px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', color: '#9ca3af' }}>
            <DocumentIcon />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            No screenings found
          </h3>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Schedule your first interview to get started with candidate screening.
          </p>
        </div>
      )}
    </div>
  )
}

export default ScreeningModule