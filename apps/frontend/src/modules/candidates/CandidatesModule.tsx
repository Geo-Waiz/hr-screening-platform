import { useState, useEffect } from 'react'
import { useJobs, useApplications, integrationService } from '../../hooks/useDataIntegration'
import { ApplicationStatus, JobStatus } from '../../types/jobs'
import auditService from '../../services/auditService'

// Professional SVG Icons
const CandidatesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
)

const PipelineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13,2 13,9 20,9"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
)

// Translation interface
interface CandidatesModuleProps {
  t: {
    dashboard: string
    totalCandidates: string
    analytics: string
    pipeline: string
    overview: string
    [key: string]: string
  }
}

// Mock candidate data
interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  experience: string
  skills: string[]
  resume: string
  portfolio?: string
  source: string
  status: 'ACTIVE' | 'INACTIVE' | 'HIRED' | 'BLACKLISTED'
  createdAt: Date
  updatedAt: Date
  tags: string[]
  notes: string[]
  socialProfiles: {
    linkedin?: string
    github?: string
    website?: string
  }
}

const mockUser = {
  id: 'user_1',
  email: 'admin@company.com'
}

const CandidatesModule = ({ t }: CandidatesModuleProps) => {
  const [activeView, setActiveView] = useState<'overview' | 'candidates' | 'pipeline' | 'analytics'>('overview')
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [skillsFilter, setSkillsFilter] = useState<string>('ALL')

  const { jobs } = useJobs()
  const { applications, getApplicationsByCandidate, updateApplicationStatus } = useApplications()

  // Initialize with mock candidates
  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: 'candidate_1',
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        experience: 'Senior Level (5+ years)',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        resume: '/resumes/sarah-chen.pdf',
        portfolio: 'https://sarahchen.dev',
        source: 'Job Board',
        status: 'ACTIVE',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-20'),
        tags: ['Frontend', 'Full-Stack', 'Senior'],
        notes: ['Excellent React skills', 'Strong portfolio', 'Available immediately'],
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/sarahchen',
          github: 'https://github.com/sarahchen',
          website: 'https://sarahchen.dev'
        }
      },
      {
        id: 'candidate_2',
        firstName: 'Marcus',
        lastName: 'Johnson',
        email: 'marcus.j@email.com',
        phone: '+1 (555) 234-5678',
        location: 'New York, NY',
        experience: 'Mid Level (3-5 years)',
        skills: ['Product Management', 'Agile', 'Data Analysis', 'SQL', 'Tableau'],
        resume: '/resumes/marcus-johnson.pdf',
        source: 'Referral',
        status: 'ACTIVE',
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-18'),
        tags: ['Product', 'Analytics', 'Leadership'],
        notes: ['Strong analytical background', 'Great communication skills'],
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/marcusjohnson'
        }
      },
      {
        id: 'candidate_3',
        firstName: 'Elena',
        lastName: 'Rodriguez',
        email: 'elena.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        location: 'Remote',
        experience: 'Mid Level (3-5 years)',
        skills: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
        resume: '/resumes/elena-rodriguez.pdf',
        portfolio: 'https://elena-ux.com',
        source: 'Direct Application',
        status: 'ACTIVE',
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date('2024-09-22'),
        tags: ['UX', 'Design', 'Research'],
        notes: ['Impressive portfolio', 'Strong user research background'],
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/elenarodriguez',
          website: 'https://elena-ux.com'
        }
      },
      {
        id: 'candidate_4',
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Seattle, WA',
        experience: 'Senior Level (5+ years)',
        skills: ['Data Science', 'Machine Learning', 'Python', 'R', 'TensorFlow'],
        resume: '/resumes/david-kim.pdf',
        source: 'LinkedIn',
        status: 'HIRED',
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date('2024-09-15'),
        tags: ['Data Science', 'ML', 'Senior'],
        notes: ['Exceptional ML background', 'PhD in Computer Science', 'Successfully hired'],
        socialProfiles: {
          linkedin: 'https://linkedin.com/in/davidkim',
          github: 'https://github.com/davidkim'
        }
      }
    ]
    setCandidates(mockCandidates)
  }, [])

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'ALL' || candidate.status === statusFilter
    const matchesSkills = skillsFilter === 'ALL' || candidate.skills.some(skill => 
      skill.toLowerCase().includes(skillsFilter.toLowerCase())
    )
    
    return matchesSearch && matchesStatus && matchesSkills
  })

  // Calculate metrics
  const metrics = {
    totalCandidates: candidates.length,
    activeCandidates: candidates.filter(c => c.status === 'ACTIVE').length,
    hiredCandidates: candidates.filter(c => c.status === 'HIRED').length,
    totalApplications: applications?.length || 0,
    averageApplicationsPerCandidate: candidates.length > 0 ? Math.round((applications?.length || 0) / candidates.length) : 0
  }

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Candidate Management</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Manage candidates and track their progress through your hiring pipeline</p>
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
            onClick={() => setActiveView('pipeline')}
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
            <PipelineIcon /> {t.pipeline}
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
            + Add Candidate
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: t.totalCandidates, value: metrics.totalCandidates, icon: CandidatesIcon, color: '#4f46e5' },
          { label: 'Active Candidates', value: metrics.activeCandidates, icon: CandidatesIcon, color: '#10b981' },
          { label: 'Hired Candidates', value: metrics.hiredCandidates, icon: CandidatesIcon, color: '#059669' },
          { label: 'Total Applications', value: metrics.totalApplications, icon: DocumentIcon, color: '#8b5cf6' },
          { label: 'Avg Applications', value: metrics.averageApplicationsPerCandidate, icon: AnalyticsIcon, color: '#06b6d4' }
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

      {/* Filters and Search */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search candidates by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
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
            <option value="ACTIVE">Active</option>
            <option value="HIRED">Hired</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>
          <select
            value={skillsFilter}
            onChange={(e) => setSkillsFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="ALL">All Skills</option>
            <option value="React">React</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '20px',
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
          }}
          onClick={() => setSelectedCandidate(candidate)}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                {candidate.firstName[0]}{candidate.lastName[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                  {candidate.location} • {candidate.experience}
                </p>
              </div>
              <span style={{
                background: candidate.status === 'ACTIVE' ? '#dcfce7' : 
                           candidate.status === 'HIRED' ? '#dbeafe' : '#f3f4f6',
                color: candidate.status === 'ACTIVE' ? '#166534' : 
                       candidate.status === 'HIRED' ? '#1e40af' : '#6b7280',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {candidate.status}
              </span>
            </div>

            {/* Contact Info */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                📧 {candidate.email}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                📞 {candidate.phone}
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {candidate.skills.slice(0, 4).map((skill, index) => (
                  <span key={index} style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 4 && (
                  <span style={{
                    color: '#6b7280',
                    fontSize: '10px',
                    padding: '2px 6px'
                  }}>
                    +{candidate.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  flex: 1,
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle view profile
                }}
              >
                View Profile
              </button>
              <button
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle contact
                }}
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', color: '#9ca3af' }}>
            <SearchIcon />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            No candidates found
          </h3>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Try adjusting your search criteria or add new candidates to your database.
          </p>
        </div>
      )}
    </div>
  )
}

export default CandidatesModule