import { useState, useEffect } from 'react'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import ScreeningModule from './modules/screening/ScreeningModule'
import JobsModule from './modules/jobs/JobsModule'
import CandidatesModule from './modules/candidates/CandidatesModule'
import AnalyticsModule from './modules/analytics/AnalyticsModule'
import ResumeModule from './modules/resumes/ResumeModule'
import SocialScreeningModule from './modules/social-screening/SocialScreeningModule'
import ATSModule from './modules/ats/ATSModule'

// Professional SVG Icons - Responsive sizes
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
  </svg>
)

const JobsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6h-2V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM12 4h4v2h-4V4zm8 15H4V8h16v11z" fill="currentColor"/>
  </svg>
)

const CandidatesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.999 2.999 0 0 0 17.09 7H14.9c-1.3 0-2.43.84-2.85 2.06L9.5 16H12v6h8z" fill="currentColor"/>
  </svg>
)

const BrainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 1.12.31 2.17.85 3.07-.54.27-.85.84-.85 1.43 0 .92.74 1.66 1.66 1.66.43 0 .82-.16 1.11-.44C9.36 14.46 10.64 15 12 15s2.64-.54 3.23-1.28c.29.28.68.44 1.11.44.92 0 1.66-.74 1.66-1.66 0-.59-.31-1.16-.85-1.43C17.69 10.17 18 9.12 18 8c0-3.31-2.69-6-6-6z" fill="currentColor"/>
  </svg>
)

const AnalyticsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/>
  </svg>
)

const ResumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z" fill="currentColor"/>
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SocialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
  </svg>
)

const ATSIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
  </svg>
)

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactElement
  section: string
}

const MainApp = () => {
  const { language, setLanguage, t } = useLanguage()
  const [activeModule, setActiveModule] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: t.dashboard, icon: <DashboardIcon />, section: 'MAIN' },
    { id: 'jobs', label: t.jobs, icon: <JobsIcon />, section: 'ATS SYSTEM' },
    { id: 'candidates', label: t.candidates, icon: <CandidatesIcon />, section: 'ATS SYSTEM' },
    { id: 'resumes', label: t.resumes, icon: <ResumeIcon />, section: 'ATS SYSTEM' },
    { id: 'ats', label: 'ATS', icon: <ATSIcon />, section: 'ATS SYSTEM' },
    { id: 'screening', label: t.screening, icon: <BrainIcon />, section: 'AI SCREENING' },
    { id: 'socialScreening', label: t.socialScreening, icon: <SocialIcon />, section: 'AI SCREENING' },
    { id: 'analytics', label: t.analytics, icon: <AnalyticsIcon />, section: 'ANALYTICS' },
    { id: 'reports', label: t.reports, icon: <AnalyticsIcon />, section: 'ANALYTICS' }
  ]

  const groupedItems = sidebarItems.reduce((acc: Record<string, SidebarItem[]>, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {})

  const handleNavClick = (moduleId: string) => {
    setActiveModule(moduleId)
    if (isMobile) {
      setMobileMenuOpen(false)
    }
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'jobs':
        return <JobsModule t={t} />
      case 'candidates':
        return <CandidatesModule t={t} />
      case 'resumes':
        return <ResumeModule t={t} />
      case 'ats':
        return <ATSModule t={t} />
      case 'screening':
        return <ScreeningModule t={t} />
      case 'socialScreening':
        return <SocialScreeningModule t={t} />
      case 'analytics':
      case 'reports':
        return <AnalyticsModule t={t} />
      default:
        return (
          <div>
            <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
              <h1 style={{ 
                margin: '0 0 8px 0', 
                fontSize: isMobile ? '20px' : '24px', 
                fontWeight: '700', 
                color: '#2c3e50' 
              }}>
                {t.welcome}
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: isMobile ? '14px' : '16px', 
                color: '#6c757d',
                lineHeight: '1.5'
              }}>
                Smart IT powered by AI - Your complete ATS and AI Screening solution
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: isMobile ? '12px' : '16px', 
              marginBottom: isMobile ? '16px' : '24px' 
            }}>
              {[
                { label: t.activeJobs, value: '24', icon: <JobsIcon />, color: '#4f46e5' },
                { label: t.totalCandidates, value: '2,847', icon: <CandidatesIcon />, color: '#06d6a0' },
                { label: 'AI Screenings', value: '1,456', icon: <BrainIcon />, color: '#7c3aed' },
                { label: 'Interviews', value: '89', icon: <DashboardIcon />, color: '#ffc107' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: '#ffffff',
                  borderRadius: '8px',
                  padding: isMobile ? '16px' : '20px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: isMobile ? '36px' : '40px',
                    height: isMobile ? '36px' : '40px',
                    borderRadius: '8px',
                    background: stat.color + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    marginBottom: '12px'
                  }}>
                    {stat.icon}
                  </div>
                  <h3 style={{ 
                    margin: '0 0 4px 0', 
                    fontSize: isMobile ? '20px' : '24px', 
                    fontWeight: '700', 
                    color: '#2c3e50' 
                  }}>
                    {stat.value}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: isMobile ? '12px' : '14px', 
                    color: '#6c757d', 
                    fontWeight: '500' 
                  }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              padding: isMobile ? '16px' : '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                margin: '0 0 12px 0', 
                fontSize: isMobile ? '16px' : '18px', 
                fontWeight: '700', 
                color: '#2c3e50' 
              }}>
                {t.recentActivity}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { action: t.newApplication, candidate: 'Sarah Chen', position: 'Senior React Developer', time: '2 ' + t.minutesAgo },
                  { action: t.aiCompleted, candidate: 'Marcus Johnson', position: 'Product Manager', time: '15 ' + t.minutesAgo },
                  { action: t.interviewScheduled, candidate: 'Elena Rodriguez', position: 'UX Designer', time: '1 ' + t.hoursAgo },
                  { action: t.offerExtended, candidate: 'David Kim', position: 'Data Scientist', time: '3 ' + t.hoursAgo }
                ].map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '8px' : '12px',
                    padding: isMobile ? '12px' : '14px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    flexDirection: isMobile ? 'column' : 'row'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#4f46e5',
                      flexShrink: 0,
                      marginTop: isMobile ? '4px' : '0'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontSize: isMobile ? '13px' : '14px', 
                        fontWeight: '600', 
                        color: '#2c3e50', 
                        marginBottom: '2px' 
                      }}>
                        {activity.action}
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '11px' : '12px', 
                        color: '#6c757d' 
                      }}>
                        {activity.candidate} - {activity.position}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: isMobile ? '10px' : '12px', 
                      color: '#6c757d',
                      alignSelf: isMobile ? 'flex-end' : 'center'
                    }}>
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
      background: '#f5f7fa',
      overflow: 'hidden'
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: '#ffffff',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 1001
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              w
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#2c3e50' }}>wAIz</div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#6c757d'
            }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      )}

      {/* Sidebar/Mobile Menu */}
      <div style={{
        width: isMobile ? (mobileMenuOpen ? '100%' : '0') : (sidebarCollapsed ? '60px' : '240px'),
        background: '#ffffff',
        borderRight: '1px solid #e9ecef',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        overflow: 'hidden',
        top: isMobile ? '56px' : '0'
      }}>
        {/* Desktop Header */}
        {!isMobile && (
          <div style={{
            padding: sidebarCollapsed ? '16px 8px' : '16px',
            borderBottom: '1px solid #f8f9fa',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700'
            }}>
              w
            </div>
            {!sidebarCollapsed && (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50' }}>wAIz</div>
                <div style={{ fontSize: '10px', color: '#6c757d', fontWeight: '500' }}>Smart IT powered by AI</div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#6c757d',
                padding: '4px'
              }}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        )}

        {/* Language Switcher */}
        {(isMobile ? mobileMenuOpen : !sidebarCollapsed) && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f8f9fa'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px'
            }}>
              <GlobeIcon />
              <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600' }}>
                {t.language}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  background: language === 'en' ? '#4f46e5' : 'transparent',
                  color: language === 'en' ? 'white' : '#6c757d',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                style={{
                  padding: '4px 8px',
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  background: language === 'es' ? '#4f46e5' : 'transparent',
                  color: language === 'es' ? 'white' : '#6c757d',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ES
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} style={{ marginBottom: '20px' }}>
              {(isMobile ? mobileMenuOpen : !sidebarCollapsed) && (
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#6c757d',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  paddingLeft: '16px'
                }}>
                  {section}
                </div>
              )}
              <div>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: (isMobile || !sidebarCollapsed) ? '10px 16px' : '10px 18px',
                      background: activeModule === item.id ? '#4f46e515' : 'transparent',
                      border: 'none',
                      borderLeft: activeModule === item.id ? '3px solid #4f46e5' : '3px solid transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: activeModule === item.id ? '600' : '500',
                      color: activeModule === item.id ? '#4f46e5' : '#495057',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      justifyContent: (isMobile || !sidebarCollapsed) ? 'flex-start' : 'center'
                    }}
                  >
                    {item.icon}
                    {(isMobile ? mobileMenuOpen : !sidebarCollapsed) && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile */}
        {(isMobile ? mobileMenuOpen : true) && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid #f8f9fa'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '6px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                JD
              </div>
              {(isMobile ? mobileMenuOpen : !sidebarCollapsed) && (
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#2c3e50' }}>John Doe</div>
                  <div style={{ fontSize: '10px', color: '#6c757d' }}>{t.hrManager}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0' : (sidebarCollapsed ? '60px' : '240px'),
        marginTop: isMobile ? '56px' : '0',
        transition: 'margin-left 0.3s ease',
        overflow: 'auto'
      }}>
        <div style={{
          padding: isMobile ? '16px' : '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {renderContent()}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '56px',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

function AppWithLanguageProvider() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  )
}

export default AppWithLanguageProvider
