import { useState } from 'react'
import type { Translations } from '../../contexts/LanguageContext'

interface AnalyticsModuleProps {
  t: Translations
}

// Professional SVG Icons
const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
)

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
)

const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const AnalyticsModule = ({ t }: AnalyticsModuleProps) => {
  const [timeRange, setTimeRange] = useState('30d')

  const analytics = {
    overview: {
      totalApplications: 1247,
      hireRate: 12.5,
      timeToHire: 18.5,
      costPerHire: 3250
    },
    pipeline: [
      { stage: t.applied, count: 156, percentage: 100 },
      { stage: t.phoneScreen, count: 89, percentage: 57 },
      { stage: t.technical, count: 45, percentage: 29 },
      { stage: t.finalInterview, count: 23, percentage: 15 },
      { stage: t.offer, count: 12, percentage: 8 }
    ],
    sources: [
      { name: t.companyWebsite, applications: 456, percentage: 37 },
      { name: t.linkedin, applications: 312, percentage: 25 },
      { name: t.indeed, applications: 234, percentage: 19 },
      { name: t.referrals, applications: 156, percentage: 12 },
      { name: t.other, applications: 89, percentage: 7 }
    ]
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AnalyticsIcon />
          {t.analyticsReports}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          {t.insightsPerformanceMetrics}
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: '7d', label: t.timeRange7d },
            { key: '30d', label: t.timeRange30d },
            { key: '90d', label: t.timeRange90d },
            { key: '1y', label: t.timeRange1y }
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              style={{
                background: timeRange === range.key ? '#4f46e5' : '#f3f4f6',
                color: timeRange === range.key ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { 
            label: t.totalApplications, 
            value: analytics.overview.totalApplications.toLocaleString(), 
            icon: <DocumentIcon />, 
            color: '#3b82f6',
            trend: '+12%'
          },
          { 
            label: t.hireRate, 
            value: `${analytics.overview.hireRate}%`, 
            icon: <TargetIcon />, 
            color: '#10b981',
            trend: '+2.3%'
          },
          { 
            label: t.avgTimeToHire, 
            value: `${analytics.overview.timeToHire} days`, 
            icon: <ClockIcon />, 
            color: '#f59e0b',
            trend: '-1.5 days'
          },
          { 
            label: t.costPerHire, 
            value: `$${analytics.overview.costPerHire.toLocaleString()}`, 
            icon: <DollarIcon />, 
            color: '#8b5cf6',
            trend: '-$150'
          }
        ].map((metric, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: metric.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                {metric.icon}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                  {metric.value}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                  {metric.label}
                </p>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '500' }}>
              {metric.trend} {t.vsLastPeriod}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Pipeline Funnel */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {t.hiringPipelineFunnel}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.pipeline.map((stage, index) => (
              <div key={stage.stage} style={{ position: 'relative' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {stage.stage}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {stage.count} {t.candidates} ({stage.percentage}%)
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${stage.percentage}%`,
                    height: '100%',
                    background: `hsl(${220 + index * 40}, 70%, 50%)`,
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Sources */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {t.applicationSources}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.sources.map((source, index) => (
              <div key={source.name}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {source.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {source.percentage}%
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    background: '#f3f4f6',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${source.percentage}%`,
                      height: '100%',
                      background: `hsl(${index * 60}, 70%, 50%)`,
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '40px' }}>
                    {source.applications}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsModule
