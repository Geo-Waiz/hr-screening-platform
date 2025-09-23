import { useState, useEffect } from 'react'
import { useJobs, useApplications } from '../../hooks/useDataIntegration'

// Professional SVG Icons
const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
)

const JobsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="6" y1="8" x2="14" y2="8"/>
    <line x1="6" y1="12" x2="14" y2="12"/>
    <line x1="6" y1="16" x2="10" y2="16"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13,2 13,9 20,9"/>
  </svg>
)

const CandidatesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

// Translation interface
interface AnalyticsModuleProps {
  t: {
    [key: string]: string
  }
}

interface AnalyticsData {
  totalJobs: number
  totalApplications: number
  totalCandidates: number
  totalInterviews: number
  conversionRates: {
    applicationToInterview: number
    interviewToOffer: number
    offerToHire: number
  }
  timeToHire: number
  popularSkills: { skill: string; count: number }[]
  applicationSources: { source: string; count: number }[]
  hiringTrends: { month: string; hires: number; applications: number }[]
}

const AnalyticsModule = ({ t }: AnalyticsModuleProps) => {
  const [activeView, setActiveView] = useState<'overview' | 'hiring' | 'performance' | 'trends'>('overview')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  const { jobs } = useJobs()
  const { applications } = useApplications()

  // Generate analytics data
  useEffect(() => {
    const mockAnalytics: AnalyticsData = {
      totalJobs: jobs?.length || 24,
      totalApplications: applications?.length || 156,
      totalCandidates: 89,
      totalInterviews: 45,
      conversionRates: {
        applicationToInterview: 28.8, // 45/156
        interviewToOffer: 66.7, // 30/45
        offerToHire: 83.3 // 25/30
      },
      timeToHire: 18, // days
      popularSkills: [
        { skill: 'React', count: 42 },
        { skill: 'TypeScript', count: 38 },
        { skill: 'Node.js', count: 34 },
        { skill: 'Python', count: 29 },
        { skill: 'AWS', count: 25 },
        { skill: 'Product Management', count: 18 },
        { skill: 'UX Design', count: 16 },
        { skill: 'Data Science', count: 14 }
      ],
      applicationSources: [
        { source: 'Job Boards', count: 62 },
        { source: 'LinkedIn', count: 34 },
        { source: 'Referrals', count: 28 },
        { source: 'Direct Applications', count: 22 },
        { source: 'Recruiters', count: 10 }
      ],
      hiringTrends: [
        { month: 'Jun', hires: 8, applications: 45 },
        { month: 'Jul', hires: 12, applications: 52 },
        { month: 'Aug', hires: 6, applications: 38 },
        { month: 'Sep', hires: 10, applications: 48 },
        { month: 'Oct', hires: 14, applications: 56 }
      ]
    }
    setAnalytics(mockAnalytics)
  }, [jobs, applications])

  if (!analytics) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px', color: '#9ca3af' }}>
            <AnalyticsIcon />
          </div>
          <p style={{ color: '#6b7280' }}>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Analytics Dashboard</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Comprehensive insights into your hiring performance</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <DocumentIcon /> Export Report
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { 
            label: 'Total Jobs', 
            value: analytics.totalJobs, 
            icon: JobsIcon, 
            color: '#4f46e5',
            change: '+12%',
            trend: 'up'
          },
          { 
            label: 'Total Applications', 
            value: analytics.totalApplications, 
            icon: DocumentIcon, 
            color: '#10b981',
            change: '+28%',
            trend: 'up'
          },
          { 
            label: 'Total Candidates', 
            value: analytics.totalCandidates, 
            icon: CandidatesIcon, 
            color: '#f59e0b',
            change: '+15%',
            trend: 'up'
          },
          { 
            label: 'Total Interviews', 
            value: analytics.totalInterviews, 
            icon: TargetIcon, 
            color: '#ef4444',
            change: '+8%',
            trend: 'up'
          },
          { 
            label: 'Avg. Time to Hire', 
            value: `${analytics.timeToHire} days`, 
            icon: ClockIcon, 
            color: '#8b5cf6',
            change: '-3 days',
            trend: 'down'
          },
          { 
            label: 'Application → Interview', 
            value: `${analytics.conversionRates.applicationToInterview.toFixed(1)}%`, 
            icon: TrendingUpIcon, 
            color: '#06b6d4',
            change: '+2.1%',
            trend: 'up'
          }
        ].map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <div key={index} style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.transform = 'translateY(-4px)'
            target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLElement
            target.style.transform = 'translateY(0)'
            target.style.boxShadow = 'none'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: metric.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: metric.color
              }}>
                <IconComponent />
              </div>
              <span style={{
                background: metric.trend === 'up' ? '#dcfce7' : '#fee2e2',
                color: metric.trend === 'up' ? '#166534' : '#dc2626',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {metric.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700', color: '#1f2937' }}>
              {metric.value}
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
              {metric.label}
            </p>
          </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Hiring Trends Chart */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            <TrendingUpIcon /> Hiring Trends
          </h3>
          <div style={{ height: '280px', display: 'flex', alignItems: 'end', gap: '16px', padding: '20px 0' }}>
            {analytics.hiringTrends.map((data, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                  <div style={{
                    width: '20px',
                    height: `${(data.hires / 14) * 200}px`,
                    background: '#4f46e5',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '10px'
                  }} />
                  <div style={{
                    width: '20px',
                    height: `${(data.applications / 56) * 200}px`,
                    background: '#06b6d4',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '10px'
                  }} />
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {data.month}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#4f46e5', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Hires</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', background: '#06b6d4', borderRadius: '2px' }} />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Applications</span>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            <TargetIcon /> Conversion Funnel
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { stage: 'Applications', count: analytics.totalApplications, percentage: 100, color: '#4f46e5' },
              { stage: 'Interviews', count: analytics.totalInterviews, percentage: analytics.conversionRates.applicationToInterview, color: '#06b6d4' },
              { stage: 'Offers', count: 30, percentage: analytics.conversionRates.interviewToOffer, color: '#10b981' },
              { stage: 'Hires', count: 25, percentage: analytics.conversionRates.offerToHire, color: '#f59e0b' }
            ].map((stage, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <div style={{
                  background: stage.color + '15',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  border: `1px solid ${stage.color}25`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {stage.stage}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: stage.color }}>
                      {stage.count}
                    </span>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    {stage.percentage.toFixed(1)}% conversion
                  </div>
                </div>
                {index < 3 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#6b7280',
                    fontSize: '12px'
                  }}>
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills and Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Popular Skills */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            🔥 Popular Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.popularSkills.map((skill, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#1f2937',
                  minWidth: '120px'
                }}>
                  {skill.skill}
                </span>
                <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '4px', height: '8px', position: 'relative' }}>
                  <div style={{
                    background: '#4f46e5',
                    height: '100%',
                    borderRadius: '4px',
                    width: `${(skill.count / analytics.popularSkills[0].count) * 100}%`
                  }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', minWidth: '30px' }}>
                  {skill.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Application Sources */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            📍 Application Sources
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.applicationSources.map((source, index) => {
              const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
              const color = colors[index % colors.length]
              return (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: color
                  }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#1f2937',
                    minWidth: '120px'
                  }}>
                    {source.source}
                  </span>
                  <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '4px', height: '8px', position: 'relative' }}>
                    <div style={{
                      background: color,
                      height: '100%',
                      borderRadius: '4px',
                      width: `${(source.count / analytics.applicationSources[0].count) * 100}%`
                    }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: color, minWidth: '30px' }}>
                    {source.count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsModule