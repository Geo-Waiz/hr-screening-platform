import { useState } from 'react'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import ScreeningModule from './modules/screening/ScreeningModule'
import JobsModule from './modules/jobs/JobsModule'
import CandidatesModule from './modules/candidates/CandidatesModule'
import AnalyticsModule from './modules/analytics/AnalyticsModule'
import SocialScreeningModule from './modules/social-screening/SocialScreeningModule'

// Professional SVG Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
  </svg>
)

const JobsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6h-2V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM12 4h4v2h-4V4z" fill="currentColor"/>
  </svg>
)

const CandidatesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4c0-1.11-.89-2-2-2s-2 .89-2 2 .89 2 2 2 2-.89 2-2zm4 18v-6h2.5l-2.54-7.63A3.02 3.02 0 0 0 17.06 7H6.94c-1.4 0-2.6.93-2.9 2.37L1.5 16H4v6h16z" fill="currentColor"/>
  </svg>
)

const PipelineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
  </svg>
)

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.33 12.91c.09-.23.15-.47.15-.72 0-.9-.68-1.64-1.55-1.74-.11-.01-.22-.01-.33 0-.23-.81-.97-1.4-1.83-1.4-.25 0-.48.05-.7.13-.28-.61-.9-1.04-1.62-1.04-.69 0-1.29.39-1.58.97-.14-.02-.28-.04-.43-.04-1.38 0-2.5 1.12-2.5 2.5 0 .33.07.64.18.93-.81.23-1.4.97-1.4 1.83 0 .69.39 1.29.97 1.58-.02.14-.04.28-.04.43 0 1.38 1.12 2.5 2.5 2.5.33 0 .64-.07.93-.18.23.81.97 1.4 1.83 1.4.69 0 1.29-.39 1.58-.97.14.02.28.04.43.04 1.38 0 2.5-1.12 2.5-2.5 0-.33-.07-.64-.18-.93.81-.23 1.4-.97 1.4-1.83z" fill="currentColor"/>
  </svg>
)

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="currentColor"/>
  </svg>
)

const TemplatesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor"/>
    <path d="M14 2v6h6" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const AssessmentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
  </svg>
)

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="currentColor"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
  </svg>
)

const SocialIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
  </svg>
)

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
  </svg>
)

interface SidebarItem {
  id: string
  labelKey: keyof typeof import('./contexts/LanguageContext').Translations['prototype']
  icon: React.ComponentType
  section: string
}

const MainApp = () => {
  const { language, setLanguage, t } = useLanguage()
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', labelKey: 'dashboard' as any, icon: DashboardIcon, section: 'MAIN' },
    { id: 'jobs', labelKey: 'jobs' as any, icon: JobsIcon, section: 'ATS SYSTEM' },
    { id: 'candidates', labelKey: 'candidates' as any, icon: CandidatesIcon, section: 'ATS SYSTEM' },
    { id: 'pipeline', labelKey: 'pipeline' as any, icon: PipelineIcon, section: 'ATS SYSTEM' },
    { id: 'screening', labelKey: 'screening' as any, icon: BrainIcon, section: 'AI SCREENING' },
    { id: 'social-screening', labelKey: 'socialScreening' as any, icon: SocialIcon, section: 'AI SCREENING' },
    { id: 'assessments', labelKey: 'assessments' as any, icon: AssessmentsIcon, section: 'AI SCREENING' },
    { id: 'templates', labelKey: 'templates' as any, icon: TemplatesIcon, section: 'AI SCREENING' },
    { id: 'analytics', labelKey: 'analytics' as any, icon: AnalyticsIcon, section: 'ANALYTICS' },
    { id: 'reports', labelKey: 'reports' as any, icon: ReportsIcon, section: 'ANALYTICS' },
    { id: 'settings', labelKey: 'settings' as any, icon: SettingsIcon, section: 'SETTINGS' }
  ]

  const groupedItems = sidebarItems.reduce((acc: Record<string, SidebarItem[]>, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  const renderContent = () => {
    switch (activeModule) {
      case 'jobs':
        return <JobsModule t={t} />
      case 'candidates':
      case 'pipeline':
        return <CandidatesModule t={t} />
      case 'screening':
      case 'assessments':
      case 'templates':
        return <ScreeningModule t={t} />
      case 'social-screening':
        return <SocialScreeningModule t={t} />
      case 'analytics':
      case 'reports':
        return <AnalyticsModule t={t} />
      case 'settings':
        return (
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
              <SettingsIcon /> {t.settings}
            </h1>
            <p style={{ margin: 0, fontSize: '16px', color: '#6c757d' }}>
              {language === 'en' ? 'Configure your ATS preferences and integrations' : 'Configure sus preferencias de ATS e integraciones'}
            </p>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '2rem', 
              marginTop: '2rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center' as const
            }}>
              <div style={{ fontSize: '4rem' }}>🚧</div>
            </div>
          </div>
        )
      default:
        return (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                {t.welcomeMessage}
              </h1>
              <p style={{ margin: 0, fontSize: '16px', color: '#6c757d' }}>
                {t.platformSubtitle}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              {[
                { labelKey: 'activeJobs', value: '24', icon: JobsIcon, color: '#4f46e5' },
                { labelKey: 'totalCandidates', value: '2,847', icon: CandidatesIcon, color: '#06d6a0' },
                { labelKey: 'aiScreenings', value: '1,456', icon: BrainIcon, color: '#7c3aed' },
                { labelKey: 'interviewsScheduled', value: '89', icon: AnalyticsIcon, color: '#ffc107' }
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: stat.color + '15',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      marginBottom: '16px'
                    }}>
                      <IconComponent />
                    </div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                      {stat.value}
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>
                      {t[stat.labelKey as keyof typeof t] as string}
                    </p>
                  </div>
                )
              })}
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              padding: '24px'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
                {t.recentActivity}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { action: language === 'en' ? 'New application received' : 'Nueva aplicación recibida', candidate: 'Sarah Chen', position: 'Senior React Developer', time: language === 'en' ? '2 minutes ago' : 'hace 2 minutos' },
                  { action: language === 'en' ? 'AI screening completed' : 'Evaluación IA completada', candidate: 'Marcus Johnson', position: 'Product Manager', time: language === 'en' ? '15 minutes ago' : 'hace 15 minutos' },
                  { action: language === 'en' ? 'Interview scheduled' : 'Entrevista programada', candidate: 'Elena Rodriguez', position: 'UX Designer', time: language === 'en' ? '1 hour ago' : 'hace 1 hora' },
                  { action: language === 'en' ? 'Offer extended' : 'Oferta extendida', candidate: 'David Kim', position: 'Data Scientist', time: language === 'en' ? '3 hours ago' : 'hace 3 horas' }
                ].map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#4f46e5'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                        {activity.action}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>
                        {activity.candidate} - {activity.position}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      background: '#f5f7fa'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '280px',
        background: '#ffffff',
        borderRight: '1px solid #e9ecef',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed' as const,
        height: '100vh',
        zIndex: 1000
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #f8f9fa',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            w
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>wAIz</div>
              <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '500' }}>Smart IT powered by AI</div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#6c757d',
              padding: '4px'
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '24px 0', overflowY: 'auto' as const }}>
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} style={{ marginBottom: '32px' }}>
              {!sidebarCollapsed && (
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#6c757d',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                  paddingLeft: '24px'
                }}>
                  {section}
                </div>
              )}
              <div>
                {items.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: sidebarCollapsed ? '12px 24px' : '12px 24px',
                        background: activeModule === item.id ? '#4f46e515' : 'transparent',
                        border: 'none',
                        borderLeft: activeModule === item.id ? '3px solid #4f46e5' : '3px solid transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: activeModule === item.id ? '600' : '500',
                        color: activeModule === item.id ? '#4f46e5' : '#495057',
                        textAlign: 'left' as const,
                        transition: 'all 0.2s ease',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        <IconComponent />
                      </span>
                      {!sidebarCollapsed && <span>{t[item.labelKey as keyof typeof t] as string}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Language Switcher & User Profile */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #f8f9fa'
        }}>
          {/* Language Switcher */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <GlobeIcon />
              {!sidebarCollapsed && (
                <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '500' }}>
                  {language === 'en' ? 'Language' : 'Idioma'}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  background: language === 'en' ? '#4f46e5' : '#f8f9fa',
                  color: language === 'en' ? 'white' : '#6c757d',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                style={{
                  background: language === 'es' ? '#4f46e5' : '#f8f9fa',
                  color: language === 'es' ? 'white' : '#6c757d',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ES
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              JD
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>John Doe</div>
                <div style={{ fontSize: '11px', color: '#6c757d' }}>HR Manager</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{
          padding: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  )
}

export default App

export default App
