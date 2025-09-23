import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Translations {
  // Navigation
  dashboa    candidates: 'Candidatos',
    pipeline: 'Pipeline',
    screening: 'Evaluación IA',
    socialScreening: 'Evaluación Social',
    assessments: 'Evaluaciones',
    templates: 'Plantillas',
    analytics: 'Análisis',
    reports: 'Reportes',
    settings: 'Configuración',ng
  jobs: string
  candidates: string
  pipeline: string
  screening: string
  socialScreening: string
  assessments: string
  templates: string
  analytics: string
  reports: string
  settings: string
  
  // Common
  welcome: string
  loading: string
  save: string
  cancel: string
  edit: string
  delete: string
  view: string
  search: string
  filter: string
  export: string
  import: string
  
  // Dashboard
  welcomeMessage: string
  platformSubtitle: string
  activeJobs: string
  totalCandidates: string
  aiScreenings: string
  interviewsScheduled: string
  recentActivity: string
  
  // Jobs
  jobPostings: string
  createJob: string
  jobTitle: string
  department: string
  location: string
  status: string
  active: string
  draft: string
  
  // Candidates
  candidateProfile: string
  resume: string
  experience: string
  skills: string
  moveForward: string
  schedule: string
  
  // Screening
  aiScreening: string
  screeningResults: string
  questions: string
  
  // Analytics
  performanceMetrics: string
  reports: string
  insights: string
}

const translations: Record<string, Translations> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    jobs: 'Jobs',
    candidates: 'Candidates',
    pipeline: 'Pipeline',
    screening: 'AI Screening',
    socialScreening: 'Social Screening',
    assessments: 'Assessments',
    templates: 'Templates',
    analytics: 'Analytics',
    reports: 'Reports',
    settings: 'Settings',
    
    // Common
    welcome: 'Welcome',
    loading: 'Loading',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    
    // Dashboard
    welcomeMessage: 'Welcome to wAIz HR Platform',
    platformSubtitle: 'Smart IT powered by AI - Your complete ATS and AI Screening solution',
    activeJobs: 'Active Jobs',
    totalCandidates: 'Total Candidates',
    aiScreenings: 'AI Screenings',
    interviewsScheduled: 'Interviews Scheduled',
    recentActivity: 'Recent Activity',
    
    // Jobs
    jobPostings: 'Job Postings',
    createJob: 'Create Job',
    jobTitle: 'Job Title',
    department: 'Department',
    location: 'Location',
    status: 'Status',
    active: 'Active',
    draft: 'Draft',
    
    // Candidates
    candidateProfile: 'Candidate Profile',
    resume: 'Resume',
    experience: 'Experience',
    skills: 'Skills',
    moveForward: 'Move Forward',
    schedule: 'Schedule',
    
    // Screening
    aiScreening: 'AI Screening',
    screeningResults: 'Screening Results',
    questions: 'Questions',
    
    // Analytics
    performanceMetrics: 'Performance Metrics',
    reports: 'Reports',
    insights: 'Insights'
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    jobs: 'Empleos',
    candidates: 'Candidatos',
    pipeline: 'Pipeline',
    screening: 'Evaluación IA',
    assessments: 'Evaluaciones',
    templates: 'Plantillas',
    analytics: 'Analíticas',
    reports: 'Reportes',
    settings: 'Configuración',
    
    // Common
    welcome: 'Bienvenido',
    loading: 'Cargando',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    
    // Dashboard
    welcomeMessage: 'Bienvenido a la Plataforma HR wAIz',
    platformSubtitle: 'IT Inteligente potenciado por IA - Su solución completa de ATS y Evaluación IA',
    activeJobs: 'Empleos Activos',
    totalCandidates: 'Total de Candidatos',
    aiScreenings: 'Evaluaciones IA',
    interviewsScheduled: 'Entrevistas Programadas',
    recentActivity: 'Actividad Reciente',
    
    // Jobs
    jobPostings: 'Ofertas de Empleo',
    createJob: 'Crear Empleo',
    jobTitle: 'Título del Empleo',
    department: 'Departamento',
    location: 'Ubicación',
    status: 'Estado',
    active: 'Activo',
    draft: 'Borrador',
    
    // Candidates
    candidateProfile: 'Perfil del Candidato',
    resume: 'Currículum',
    experience: 'Experiencia',
    skills: 'Habilidades',
    moveForward: 'Avanzar',
    schedule: 'Programar',
    
    // Screening
    aiScreening: 'Evaluación IA',
    screeningResults: 'Resultados de Evaluación',
    questions: 'Preguntas',
    
    // Analytics
    performanceMetrics: 'Métricas de Rendimiento',
    reports: 'Reportes',
    insights: 'Perspectivas'
  }
}

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en')

  const value = {
    language,
    setLanguage,
    t: translations[language]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}