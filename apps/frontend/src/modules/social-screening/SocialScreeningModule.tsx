import { useState } from 'react'
import type { Translations } from '../../contexts/LanguageContext'

interface SocialScreeningModuleProps {
  t: Translations
}

// Professional SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FlagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 15S6 13 8 13 12 15 12 15 14 13 16 13 20 15 20 15V3S18 1 16 1 12 3 12 3 10 1 8 1 4 3 4 3V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const XMarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C10.35 21 2 12.65 2 2.08C2 1.48 2.48 1 3.08 1H6.08C6.68 1 7.16 1.48 7.16 2.08C7.16 4.08 7.56 6 8.28 7.76C8.44 8.12 8.36 8.56 8.08 8.84L6.84 10.08C8.36 13.24 10.76 15.64 13.92 17.16L15.16 15.92C15.44 15.64 15.88 15.56 16.24 15.72C18 16.44 19.92 16.84 21.92 16.84C22.52 16.84 23 17.32 23 17.92H22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface SocialProfile {
  platform: string
  url: string
  verified: boolean
  followers: number
  riskFactors: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  lastActivity: Date
}

interface BackgroundCheck {
  criminalRecord: {
    status: 'clear' | 'pending' | 'issues'
    details: string[]
  }
  education: {
    verified: boolean
    institutions: string[]
    details: string
  }
  employment: {
    verified: boolean
    companies: string[]
    details: string
  }
  references: {
    contacted: number
    positive: number
    neutral: number
    negative: number
    comments: string[]
  }
}

interface SocialScreeningData {
  id: string
  candidateId: string
  candidateName: string
  status: 'not-started' | 'in-progress' | 'completed' | 'flagged'
  startDate: Date
  completionDate?: Date
  overallRiskScore: number
  socialProfiles: SocialProfile[]
  backgroundCheck: BackgroundCheck
  aiAnalysis: {
    summary: string
    redFlags: string[]
    positiveIndicators: string[]
    recommendation: 'approve' | 'review' | 'reject'
    confidence: number
  }
  manualReview: {
    required: boolean
    assignedTo?: string
    notes: string
    decision?: 'approve' | 'reject'
  }
}

const SocialScreeningModule: React.FC<SocialScreeningModuleProps> = ({ t }) => {
  const [screenings, setScreenings] = useState<SocialScreeningData[]>([
    {
      id: '1',
      candidateId: '1',
      candidateName: 'Sarah Chen',
      status: 'completed',
      startDate: new Date('2024-09-18'),
      completionDate: new Date('2024-09-20'),
      overallRiskScore: 15,
      socialProfiles: [
        {
          platform: 'LinkedIn',
          url: 'linkedin.com/in/sarahchen',
          verified: true,
          followers: 2847,
          riskFactors: [],
          sentiment: 'positive',
          lastActivity: new Date('2024-09-19')
        },
        {
          platform: 'GitHub',
          url: 'github.com/sarahchen',
          verified: true,
          followers: 456,
          riskFactors: [],
          sentiment: 'positive',
          lastActivity: new Date('2024-09-20')
        },
        {
          platform: 'Twitter',
          url: 'twitter.com/sarahchen_dev',
          verified: false,
          followers: 1234,
          riskFactors: ['Political opinions'],
          sentiment: 'neutral',
          lastActivity: new Date('2024-09-15')
        }
      ],
      backgroundCheck: {
        criminalRecord: {
          status: 'clear',
          details: ['No criminal history found']
        },
        education: {
          verified: true,
          institutions: ['Stanford University'],
          details: 'BS Computer Science verified with institution'
        },
        employment: {
          verified: true,
          companies: ['TechCorp', 'StartupXYZ'],
          details: 'All employment history verified'
        },
        references: {
          contacted: 3,
          positive: 3,
          neutral: 0,
          negative: 0,
          comments: [
            'Excellent technical skills and team player',
            'Highly reliable and professional',
            'Strong problem-solving abilities'
          ]
        }
      },
      aiAnalysis: {
        summary: 'Candidate shows strong professional presence across platforms. Active in tech community with positive contributions. No significant risk factors identified.',
        redFlags: [],
        positiveIndicators: [
          'Active GitHub contributions',
          'Professional LinkedIn presence',
          'Positive references',
          'Clean background check'
        ],
        recommendation: 'approve',
        confidence: 0.94
      },
      manualReview: {
        required: false,
        notes: 'Low risk candidate with strong digital footprint'
      }
    },
    {
      id: '2',
      candidateId: '2',
      candidateName: 'Marcus Johnson',
      status: 'in-progress',
      startDate: new Date('2024-09-21'),
      overallRiskScore: 0,
      socialProfiles: [
        {
          platform: 'LinkedIn',
          url: 'linkedin.com/in/marcusjohnson',
          verified: true,
          followers: 5632,
          riskFactors: [],
          sentiment: 'positive',
          lastActivity: new Date('2024-09-21')
        }
      ],
      backgroundCheck: {
        criminalRecord: {
          status: 'pending',
          details: []
        },
        education: {
          verified: false,
          institutions: ['Harvard Business School', 'MIT'],
          details: 'Verification in progress'
        },
        employment: {
          verified: false,
          companies: ['BigTech', 'ConsultingFirm'],
          details: 'Verification in progress'
        },
        references: {
          contacted: 0,
          positive: 0,
          neutral: 0,
          negative: 0,
          comments: []
        }
      },
      aiAnalysis: {
        summary: 'Screening in progress. Initial analysis shows professional LinkedIn presence.',
        redFlags: [],
        positiveIndicators: ['Professional LinkedIn presence'],
        recommendation: 'review',
        confidence: 0.6
      },
      manualReview: {
        required: false,
        notes: ''
      }
    }
  ])

  const [selectedScreening, setSelectedScreening] = useState<SocialScreeningData | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // Filter screenings
  const filteredScreenings = screenings.filter(screening => {
    if (filterStatus === 'all') return true
    return screening.status === filterStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return { bg: '#f3f4f6', text: '#6b7280' }
      case 'in-progress': return { bg: '#fef3c7', text: '#92400e' }
      case 'completed': return { bg: '#dcfce7', text: '#166534' }
      case 'flagged': return { bg: '#fef2f2', text: '#dc2626' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const getRiskColor = (score: number) => {
    if (score <= 20) return '#10b981' // Green - Low risk
    if (score <= 50) return '#f59e0b' // Yellow - Medium risk
    return '#ef4444' // Red - High risk
  }

  const handleStartScreening = (candidateId: string, candidateName: string) => {
    const newScreening: SocialScreeningData = {
      id: Date.now().toString(),
      candidateId,
      candidateName,
      status: 'in-progress',
      startDate: new Date(),
      overallRiskScore: 0,
      socialProfiles: [],
      backgroundCheck: {
        criminalRecord: { status: 'pending', details: [] },
        education: { verified: false, institutions: [], details: '' },
        employment: { verified: false, companies: [], details: '' },
        references: { contacted: 0, positive: 0, neutral: 0, negative: 0, comments: [] }
      },
      aiAnalysis: {
        summary: 'Screening initiated. Gathering data from various sources...',
        redFlags: [],
        positiveIndicators: [],
        recommendation: 'review',
        confidence: 0
      },
      manualReview: {
        required: false,
        notes: ''
      }
    }

    setScreenings(prev => [...prev, newScreening])

    // Simulate screening process
    setTimeout(() => {
      setScreenings(prev => prev.map(s => 
        s.id === newScreening.id 
          ? {
              ...s,
              status: 'completed',
              completionDate: new Date(),
              overallRiskScore: Math.floor(Math.random() * 30) + 10,
              socialProfiles: [
                {
                  platform: 'LinkedIn',
                  url: `linkedin.com/in/${candidateName.toLowerCase().replace(' ', '')}`,
                  verified: true,
                  followers: Math.floor(Math.random() * 5000) + 500,
                  riskFactors: [],
                  sentiment: 'positive',
                  lastActivity: new Date()
                }
              ],
              aiAnalysis: {
                ...s.aiAnalysis,
                summary: 'Screening completed. Professional online presence detected with minimal risk factors.',
                recommendation: 'approve',
                confidence: 0.85
              }
            }
          : s
      ))
    }, 5000)
  }

  const handleManualReview = (screeningId: string, decision: 'approve' | 'reject', notes: string) => {
    setScreenings(prev => prev.map(s => 
      s.id === screeningId 
        ? {
            ...s,
            manualReview: {
              ...s.manualReview,
              decision,
              notes
            }
          }
        : s
    ))
    alert(`Manual review completed: ${decision.toUpperCase()}`)
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SearchIcon />
          {t.socialScreening}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          {t.comprehensiveSocialAnalysis}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
          {t.startNewScreening}
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={t.enterCandidateName}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                handleStartScreening(Date.now().toString(), e.currentTarget.value.trim())
                e.currentTarget.value = ''
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement
              if (input?.value.trim()) {
                handleStartScreening(Date.now().toString(), input.value.trim())
                input.value = ''
              }
            }}
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {t.startScreening}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '24px' }}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#ffffff'
          }}
        >
          <option value="all">{t.allScreenings}</option>
          <option value="not-started">{t.notStarted}</option>
          <option value="in-progress">{t.inProgress}</option>
          <option value="completed">{t.completed}</option>
          <option value="flagged">{t.flagged}</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: t.totalScreenings, value: screenings.length.toString(), icon: <SearchIcon />, color: '#3b82f6' },
          { label: t.completed, value: screenings.filter(s => s.status === 'completed').length.toString(), icon: <CheckmarkIcon />, color: '#10b981' },
          { label: t.inProgress, value: screenings.filter(s => s.status === 'in-progress').length.toString(), icon: <ClockIcon />, color: '#f59e0b' },
          { label: t.flagged, value: screenings.filter(s => s.status === 'flagged').length.toString(), icon: <FlagIcon />, color: '#ef4444' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: stat.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                {stat.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                  {stat.value}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screenings List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {t.screeningResults} ({filteredScreenings.length})
          </h2>
        </div>

        {filteredScreenings.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#9ca3af', display: 'flex', justifyContent: 'center' }}>
              <SearchIcon />
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>{t.noScreeningsFound}</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {t.startNewScreeningAbove}
            </p>
          </div>
        ) : (
          filteredScreenings.map((screening) => (
            <div key={screening.id} style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedScreening(screening)}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr', gap: '20px', alignItems: 'center' }}>
                {/* Candidate Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {screening.candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {screening.candidateName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {t.started}: {screening.startDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {screening.socialProfiles.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {screening.socialProfiles.map((profile, idx) => (
                        <span key={idx} style={{
                          background: '#f1f5f9',
                          color: '#6b7280',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {profile.platform}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    ...getStatusColor(screening.status),
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: getStatusColor(screening.status).bg,
                    color: getStatusColor(screening.status).text
                  }}>
                    {screening.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Risk Score */}
                <div style={{ textAlign: 'center' }}>
                  {screening.status === 'completed' ? (
                    <div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: getRiskColor(screening.overallRiskScore),
                        marginBottom: '2px'
                      }}>
                        {screening.overallRiskScore}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {t.riskScore}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {t.pending}
                    </div>
                  )}
                </div>

                {/* AI Recommendation */}
                <div style={{ textAlign: 'center' }}>
                  {screening.status === 'completed' && (
                    <span style={{
                      background: screening.aiAnalysis.recommendation === 'approve' ? '#dcfce7' : 
                                 screening.aiAnalysis.recommendation === 'reject' ? '#fef2f2' : '#fef3c7',
                      color: screening.aiAnalysis.recommendation === 'approve' ? '#166534' : 
                             screening.aiAnalysis.recommendation === 'reject' ? '#dc2626' : '#92400e',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {screening.aiAnalysis.recommendation.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {screening.status === 'completed' && !screening.manualReview.decision && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleManualReview(screening.id, 'approve', 'Approved after review')
                        }}
                        style={{
                          background: '#f0fdf4',
                          color: '#166534',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        <CheckmarkIcon /> {t.approve}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleManualReview(screening.id, 'reject', 'Rejected after review')
                        }}
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        <XMarkIcon /> {t.reject}
                      </button>
                    </>
                  )}

                  {screening.manualReview.decision && (
                    <span style={{
                      background: screening.manualReview.decision === 'approve' ? '#dcfce7' : '#fef2f2',
                      color: screening.manualReview.decision === 'approve' ? '#166534' : '#dc2626',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {screening.manualReview.decision.toUpperCase()}D
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Screening Detail Modal */}
      {selectedScreening && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '900px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '600' }}>
                {selectedScreening.candidateName} - {t.socialScreeningDetails}
              </h3>
              <button
                onClick={() => setSelectedScreening(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <XMarkIcon />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left Column - Social Profiles */}
              <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                  {t.socialMediaAnalysis}
                </h4>
                
                {selectedScreening.socialProfiles.length > 0 ? (
                  selectedScreening.socialProfiles.map((profile, idx) => (
                    <div key={idx} style={{
                      background: '#f8fafc',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong>{profile.platform}</strong>
                        <span style={{
                          background: profile.verified ? '#dcfce7' : '#fef3c7',
                          color: profile.verified ? '#166534' : '#92400e',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {profile.verified ? t.verified : t.unverified}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
                        {profile.url}
                      </p>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {t.followers}: {profile.followers.toLocaleString()} • 
                        {t.sentiment}: {profile.sentiment} • 
                        {t.lastActivity}: {profile.lastActivity.toLocaleDateString()}
                      </div>
                      {profile.riskFactors.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <strong style={{ fontSize: '12px', color: '#dc2626' }}>{t.riskFactors}:</strong>
                          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                            {profile.riskFactors.map((factor, i) => (
                              <span key={i} style={{
                                background: '#fef2f2',
                                color: '#dc2626',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px'
                              }}>
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    No social profiles analyzed yet
                  </p>
                )}

                <h4 style={{ margin: '24px 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                  {t.backgroundCheck}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <strong>{t.criminalRecord}:</strong>
                    <span style={{
                      marginLeft: '8px',
                      color: selectedScreening.backgroundCheck.criminalRecord.status === 'clear' ? '#166534' : 
                             selectedScreening.backgroundCheck.criminalRecord.status === 'pending' ? '#92400e' : '#dc2626'
                    }}>
                      {selectedScreening.backgroundCheck.criminalRecord.status === 'clear' ? t.clear : 
                       selectedScreening.backgroundCheck.criminalRecord.status === 'pending' ? t.pending.toUpperCase() : 
                       selectedScreening.backgroundCheck.criminalRecord.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <strong>{t.education}:</strong>
                    <span style={{
                      marginLeft: '8px',
                      color: selectedScreening.backgroundCheck.education.verified ? '#166534' : '#92400e'
                    }}>
                      {selectedScreening.backgroundCheck.education.verified ? t.verified.toUpperCase() : t.pending.toUpperCase()}
                    </span>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}>
                    <strong>{t.employment}:</strong>
                    <span style={{
                      marginLeft: '8px',
                      color: selectedScreening.backgroundCheck.employment.verified ? '#166534' : '#92400e'
                    }}>
                      {selectedScreening.backgroundCheck.employment.verified ? t.verified.toUpperCase() : t.pending.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - AI Analysis */}
              <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                  {t.aiAnalysisSummary}
                </h4>
                
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.6', color: '#374151' }}>
                    {selectedScreening.aiAnalysis.summary}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      background: selectedScreening.aiAnalysis.recommendation === 'approve' ? '#dcfce7' : 
                                 selectedScreening.aiAnalysis.recommendation === 'reject' ? '#fef2f2' : '#fef3c7',
                      color: selectedScreening.aiAnalysis.recommendation === 'approve' ? '#166534' : 
                             selectedScreening.aiAnalysis.recommendation === 'reject' ? '#dc2626' : '#92400e',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {selectedScreening.aiAnalysis.recommendation.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {t.confidence}: {Math.round(selectedScreening.aiAnalysis.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {selectedScreening.aiAnalysis.positiveIndicators.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckmarkIcon /> {t.positiveIndicators}
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#374151' }}>
                      {selectedScreening.aiAnalysis.positiveIndicators.map((indicator, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScreening.aiAnalysis.redFlags.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FlagIcon /> {t.redFlags}
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#374151' }}>
                      {selectedScreening.aiAnalysis.redFlags.map((flag, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScreening.backgroundCheck.references.contacted > 0 && (
                  <div>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PhoneIcon /> {t.referenceFeedback}
                    </h5>
                    <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                      <span style={{ color: '#166534' }}>{t.positive}: {selectedScreening.backgroundCheck.references.positive}</span> • 
                      <span style={{ color: '#92400e' }}> {t.neutral}: {selectedScreening.backgroundCheck.references.neutral}</span> • 
                      <span style={{ color: '#dc2626' }}> {t.negative}: {selectedScreening.backgroundCheck.references.negative}</span>
                    </div>
                    {selectedScreening.backgroundCheck.references.comments.length > 0 && (
                      <div style={{ fontSize: '13px', color: '#374151' }}>
                        {selectedScreening.backgroundCheck.references.comments.map((comment, idx) => (
                          <div key={idx} style={{
                            background: '#f8fafc',
                            padding: '8px',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            borderLeft: '3px solid #3b82f6'
                          }}>
                            "{comment}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocialScreeningModule