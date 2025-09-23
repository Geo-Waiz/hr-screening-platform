import React from 'react'
import type { Translations } from '../../contexts/LanguageContext'

interface ScreeningModuleProps {
  t: Translations;
}

// Professional SVG Icons
const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m10-4h.01M12 21h.01"/>
  </svg>
)

const DesignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
)

const AnalyticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
    <polyline points="17,6 23,6 23,12"/>
  </svg>
)

const ClipboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
)

const ScreeningModule: React.FC<ScreeningModuleProps> = ({ t }) => {

  const screeningStats = [
    { label: t.aiAssessments, value: '156', change: '+12', icon: <BrainIcon />, color: '#4f46e5' },
    { label: t.autoScreened, value: '1,247', change: '+8%', icon: <TrendingUpIcon />, color: '#06d6a0' },
    { label: t.pendingReview, value: '43', change: '-5', icon: <ClipboardIcon />, color: '#f72585' },
    { label: t.passedScreening, value: '89', change: '+15%', icon: <CheckIcon />, color: '#06d6a0' }
  ]

  const recentScreenings = [
    { name: 'Sarah Chen', position: 'Senior React Developer', score: 94, status: t.passed, time: '2 ' + t.hoursAgo, skills: ['React', 'TypeScript', 'Node.js'] },
    { name: 'Marcus Johnson', position: 'Product Manager', score: 87, status: t.passed, time: '4 ' + t.hoursAgo, skills: ['Strategy', 'Analytics', 'Leadership'] },
    { name: 'Elena Rodriguez', position: 'UX Designer', score: 91, status: t.passed, time: '6 ' + t.hoursAgo, skills: ['Figma', 'Design Systems', 'User Research'] },
    { name: 'David Kim', position: 'Data Scientist', score: 76, status: t.review, time: '1 ' + t.dayAgo, skills: ['Python', 'ML', 'Statistics'] },
    { name: 'Lisa Wang', position: 'Frontend Developer', score: 82, status: t.passed, time: '2 ' + t.daysAgo, skills: ['Vue.js', 'CSS', 'JavaScript'] }
  ]

  const assessmentTemplates = [
    { name: t.frontendDeveloperAssessment, questions: 25, duration: '45 min', difficulty: t.intermediate, icon: <DesignIcon /> },
    { name: t.backendDeveloperAssessment, questions: 30, duration: '60 min', difficulty: t.advanced, icon: <SettingsIcon /> },
    { name: t.uiuxDesignerAssessment, questions: 20, duration: '40 min', difficulty: t.intermediate, icon: <DesignIcon /> },
    { name: t.productManagerAssessment, questions: 35, duration: '50 min', difficulty: t.advanced, icon: <AnalyticsIcon /> },
    { name: t.dataScientistAssessment, questions: 40, duration: '75 min', difficulty: t.expert, icon: <TrendingUpIcon /> }
  ]

  const renderOverview = () => (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {screeningStats.map((stat, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e9ecef',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: stat.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {stat.icon}
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: stat.change.startsWith('+') ? '#06d6a0' : '#f72585',
                background: stat.change.startsWith('+') ? '#06d6a015' : '#f7258515',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                {stat.change}
              </span>
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
              {stat.value}
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Screenings */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        <div style={{ padding: '24px 24px 0 24px', borderBottom: '1px solid #f8f9fa' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
            {t.recentAIScreenings}
          </h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#6c757d' }}>
            {t.latestCandidateAssessments}
          </p>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase' }}>{t.candidate}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase' }}>{t.position}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase' }}>{t.aiScore}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase' }}>{t.status}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase' }}>{t.skillsMatched}</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6c757d', textTransform: 'uppercase' }}>{t.time}</th>
              </tr>
            </thead>
            <tbody>
              {recentScreenings.map((screening, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        {screening.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{screening.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#495057' }}>{screening.position}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        background: '#e9ecef',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: screening.score + '%',
                          height: '100%',
                          background: screening.score >= 90 ? '#06d6a0' : screening.score >= 80 ? '#ffc107' : '#f72585',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>{screening.score}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      background: screening.status === t.passed ? '#06d6a015' : '#ffc10715',
                      color: screening.status === t.passed ? '#06d6a0' : '#ffc107',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {screening.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {screening.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} style={{
                          background: '#f8f9fa',
                          color: '#495057',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6c757d' }}>{screening.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment Templates */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        padding: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
            {t.aiAssessmentTemplates}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
            {t.preBuiltAssessmentTemplates}
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {assessmentTemplates.map((template, index) => (
            <div key={index} style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px' }}>{template.icon}</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                  {template.name}
                </h3>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '14px', color: '#6c757d' }}>
                <span>{template.questions} {t.questions}</span>
                <span>•</span>
                <span>{template.duration}</span>
                <span>•</span>
                <span>{template.difficulty}</span>
              </div>
              
              <button 
                onClick={() => {
                  alert(`${t.using} ${template.name} ${t.template}!\n\n${t.templateDetails}:\n- ${template.questions} ${t.questions}\n- ${t.duration}: ${template.duration}\n- ${t.difficulty}: ${template.difficulty}\n\n${t.thisWillLaunchAssessmentBuilder}`)
                }}
                style={{
                  width: '100%',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3b38d6'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#4f46e5'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {t.useTemplate}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {renderOverview()}
    </div>
  )
}

export default ScreeningModule
