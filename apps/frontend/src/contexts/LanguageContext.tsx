import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Translations {
  // Navigation
  dashboard: string
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
  create: string
  language: string
  
  // Time
  minutesAgo: string
  hoursAgo: string
  dayAgo: string
  daysAgo: string
  
  // Activities
  newApplication: string
  aiCompleted: string
  interviewScheduled: string
  offerExtended: string
  
  // Jobs
  postJob: string
  
  // Users
  hrManager: string
  
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
  insights: string
  
  // Resumes
  resumes: string
  resumeManager: string
  uploadResume: string
  parseResume: string
  resumeAnalysis: string
  resumeUpload: string
  resumeProcessing: string
  candidateName: string
  fileName: string
  uploadDate: string
  fileSize: string
  aiAnalysis: string
  processed: string
  pending: string
  uploaded: string
  analyzing: string
  accepted: string
  rejected: string
  reviewRequired: string
  
  // Additional Resume Module translations
  uploadAnalyzeResumes: string
  dropFilesHere: string
  uploadResumeFiles: string
  dragDropPdf: string
  chooseFiles: string
  searchByNameEmailSkills: string
  allStatus: string
  processing: string
  analyzed: string
  totalResumes: string
  aiAnalyzed: string
  avgMatchScore: string
  uploadedResumes: string
  noResumesFound: string
  uploadResumesOrAdjust: string
  jobMatch: string
  pendingAnalysis: string
  accept: string
  reject: string
  socialScreeningAction: string
  screeningAction: string
  risk: string
  jobMatchAnalysis: string
  match: string
  for: string
  alignedSkills: string
  missingSkills: string
  aiRecommendation: string
  confidence: string
  aiSummary: string
  skillsExtracted: string
  education: string
  aiAnalysisInProgress: string
  areYouSureReject: string
  resumeAccepted: string
  candidateAddedToPipeline: string
  startingSocialScreening: string
  socialScreeningDetails: string
  resultsAvailable24h: string
  pleaseUploadPdfOnly: string
  more: string
  
  // Jobs Module translations
  manageJobsDescription: string
  allJobs: string
  applications: string
  actions: string
  
  // Candidates Module translations
  manageCandidatesDescription: string
  allStages: string
  pleaseSelectCandidates: string
  areYouSureRejectCandidates: string
  bulkMoving: string
  featureComingSoon: string
  sendingBulkEmail: string
  moveCandidate: string
  actionSelected: string
  
  // Analytics Module translations
  analyticsReports: string
  insightsPerformanceMetrics: string
  timeRange7d: string
  timeRange30d: string
  timeRange90d: string
  timeRange1y: string
  totalApplications: string
  hireRate: string
  avgTimeToHire: string
  costPerHire: string
  vsLastPeriod: string
  hiringPipelineFunnel: string
  applicationSources: string
  companyWebsite: string
  linkedin: string
  indeed: string
  referrals: string
  other: string
  applied: string
  phoneScreen: string
  technical: string
  finalInterview: string
  offer: string
  
  // Social Screening Module translations
  comprehensiveSocialAnalysis: string
  startNewScreening: string
  enterCandidateName: string
  startScreening: string
  allScreenings: string
  notStarted: string
  inProgress: string
  completed: string
  flagged: string
  totalScreenings: string
  noScreeningsFound: string
  startNewScreeningAbove: string
  started: string
  socialMediaAnalysis: string
  verified: string
  unverified: string
  followers: string
  sentiment: string
  lastActivity: string
  riskFactors: string
  backgroundCheck: string
  criminalRecord: string
  clear: string
  employment: string
  references: string
  aiAnalysisSummary: string
  recommendation: string
  approve: string
  positiveIndicators: string
  redFlags: string
  referenceFeedback: string
  positive: string
  neutral: string
  negative: string
  riskScore: string
  
  // ATS Module translations
  advancedATSSystem: string
  comprehensiveWorkflowManagement: string
  activeWorkflows: string
  automatedProcessesRunning: string
  talentPoolCandidates: string
  acrossTalentPools: string
  complianceScore: string
  gdprEeocAdaCompliance: string
  apiIntegrations: string
  connectedHRTools: string
  workflowManagement: string
  createManageWorkflows: string
  customWorkflowBuilder: string
  automatedTriggers: string
  stepConditions: string
  teamAssignments: string
  talentPoolSegmentation: string
  segmentBySkillsExperience: string
  smartSegmentation: string
  targetedCommunication: string
  poolAnalytics: string
  autoCategorization: string
  complianceTracking: string
  ensureCompliance: string
  complianceMonitoring: string
  violationAlerts: string
  auditTrails: string
  policyEnforcement: string
  connectHRTools: string
  hrmsIntegration: string
  assessmentTools: string
  backgroundChecks: string
  communicationPlatforms: string
  
  // ATS content descriptions
  advancedWorkflowFeatures: string
  segmentTalentBySkills: string
  hrToolsIntegrationPlatform: string
  workflows: string
  talentPools: string
  compliance: string
  integrations: string
  
  // Screening Module translations
  aiAssessments: string
  autoScreened: string
  pendingReview: string
  passedScreening: string
  recentAIScreenings: string
  latestCandidateAssessments: string
  candidate: string
  position: string
  aiScore: string
  skillsMatched: string
  time: string
  passed: string
  review: string
  aiAssessmentTemplates: string
  preBuiltAssessmentTemplates: string
  frontendDeveloperAssessment: string
  backendDeveloperAssessment: string
  uiuxDesignerAssessment: string
  productManagerAssessment: string
  dataScientistAssessment: string
  intermediate: string
  advanced: string
  expert: string
  useTemplate: string
  using: string
  template: string
  templateDetails: string
  duration: string
  difficulty: string
  thisWillLaunchAssessmentBuilder: string
}

const translations = {
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
    create: 'Create',
    language: 'Language',
    
    // Time
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    dayAgo: 'day ago',
    daysAgo: 'days ago',
    
    // Activities
    newApplication: 'New Application',
    aiCompleted: 'AI Screening Completed',
    interviewScheduled: 'Interview Scheduled',
    offerExtended: 'Offer Extended',
    
    // Jobs
    postJob: 'Post Job',
    
    // Users
    hrManager: 'HR Manager',
    
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
    insights: 'Insights',
    
    // Resumes
    resumes: 'Resumes',
    resumeManager: 'Resume Manager',
    uploadResume: 'Upload Resume',
    parseResume: 'Parse Resume',
    resumeAnalysis: 'Resume Analysis',
    resumeUpload: 'Resume Upload',
    resumeProcessing: 'Resume Processing',
    candidateName: 'Candidate Name',
    fileName: 'File Name',
    uploadDate: 'Upload Date',
    fileSize: 'File Size',
    aiAnalysis: 'AI Analysis',
    processed: 'Processed',
    pending: 'Pending',
    uploaded: 'Uploaded',
    analyzing: 'Analyzing',
    accepted: 'Accepted',
    rejected: 'Rejected',
    reviewRequired: 'Review Required',
    
    // Additional Resume Module translations
    uploadAnalyzeResumes: 'Upload, analyze, and manage candidate resumes with AI-powered matching and social screening',
    dropFilesHere: 'Drop files here',
    uploadResumeFiles: 'Upload Resume Files',
    dragDropPdf: 'Drag and drop PDF files or click to browse',
    chooseFiles: 'Choose Files',
    searchByNameEmailSkills: 'Search by name, email, or skills...',
    allStatus: 'All Status',
    processing: 'Processing',
    analyzed: 'Analyzed',
    totalResumes: 'Total Resumes',
    aiAnalyzed: 'AI Analyzed',
    avgMatchScore: 'Avg Match Score',
    uploadedResumes: 'Uploaded Resumes',
    noResumesFound: 'No resumes found',
    uploadResumesOrAdjust: 'Upload resumes or adjust your search criteria',
    jobMatch: 'Job Match',
    pendingAnalysis: 'Pending Analysis',
    accept: 'Accept',
    reject: 'Reject',
    socialScreeningAction: 'Social Screening',
    screeningAction: 'Screening...',
    risk: 'Risk',
    jobMatchAnalysis: 'Job Match Analysis',
    match: 'Match',
    for: 'for',
    alignedSkills: 'Aligned Skills',
    missingSkills: 'Missing Skills',
    aiRecommendation: 'AI Recommendation',
    confidence: 'Confidence',
    aiSummary: 'AI Summary',
    skillsExtracted: 'Skills Extracted',
    education: 'Education',
    aiAnalysisInProgress: 'AI analysis in progress...',
    areYouSureReject: 'Are you sure you want to reject this resume?',
    resumeAccepted: 'Resume accepted! Candidate will be added to the pipeline.',
    candidateAddedToPipeline: 'Candidate will be added to the pipeline.',
    startingSocialScreening: 'Starting social media screening for',
    socialScreeningDetails: 'This will check:\n- LinkedIn profile\n- Public social media\n- Professional references\n- Background verification',
    resultsAvailable24h: 'Results will be available in 24-48 hours.',
    pleaseUploadPdfOnly: 'Please upload PDF files only',
    more: 'more',
    
    // Jobs Module translations
    manageJobsDescription: 'Manage job postings and track applications',
    allJobs: 'All Jobs',
    applications: 'Applications',
    actions: 'Actions',
    
    // Candidates Module translations
    manageCandidatesDescription: 'Track and manage candidate applications through the hiring pipeline',
    allStages: 'All Stages',
    pleaseSelectCandidates: 'Please select candidates first',
    areYouSureRejectCandidates: 'Are you sure you want to reject {count} candidates?',
    bulkMoving: 'Bulk moving candidates: {names}\nThis feature is coming soon!',
    featureComingSoon: 'This feature is coming soon!',
    sendingBulkEmail: 'Sending bulk email to: {names}\nThis feature is coming soon!',
    moveCandidate: 'Move {name} from "{currentStage}" to "{nextStage}"?',
    actionSelected: 'Action "{action}" selected for: {names}',
    
    // Analytics Module translations
    analyticsReports: 'Analytics & Reports',
    insightsPerformanceMetrics: 'Insights and performance metrics for your hiring process',
    timeRange7d: '7d',
    timeRange30d: '30d',
    timeRange90d: '90d',
    timeRange1y: '1y',
    totalApplications: 'Total Applications',
    hireRate: 'Hire Rate',
    avgTimeToHire: 'Avg Time to Hire',
    costPerHire: 'Cost per Hire',
    vsLastPeriod: 'vs last period',
    hiringPipelineFunnel: 'Hiring Pipeline Funnel',
    applicationSources: 'Application Sources',
    companyWebsite: 'Company Website',
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    referrals: 'Referrals',
    other: 'Other',
    applied: 'Applied',
    phoneScreen: 'Phone Screen',
    technical: 'Technical',
    finalInterview: 'Final Interview',
    offer: 'Offer',
    
    // Social Screening Module translations
    comprehensiveSocialAnalysis: 'Comprehensive social media analysis and background verification for candidates',
    startNewScreening: 'Start New Screening',
    enterCandidateName: 'Enter candidate name...',
    startScreening: 'Start Screening',
    allScreenings: 'All Screenings',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    completed: 'Completed',
    flagged: 'Flagged',
    totalScreenings: 'Total Screenings',
    noScreeningsFound: 'No screenings found',
    startNewScreeningAbove: 'Start a new social screening process above',
    started: 'Started',
    socialMediaAnalysis: 'Social Media Analysis',
    verified: 'Verified',
    unverified: 'Unverified',
    followers: 'Followers',
    sentiment: 'Sentiment',
    lastActivity: 'Last Activity',
    riskFactors: 'Risk Factors',
    backgroundCheck: 'Background Check',
    criminalRecord: 'Criminal Record',
    clear: 'CLEAR',
    employment: 'Employment',
    references: 'References',
    aiAnalysisSummary: 'AI Analysis Summary',
    recommendation: 'Recommendation',
    approve: 'Approve',
    positiveIndicators: 'Positive Indicators',
    redFlags: 'Red Flags',
    referenceFeedback: 'Reference Feedback',
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
    riskScore: 'Risk Score',
    
    // ATS Module translations
    advancedATSSystem: 'Advanced ATS System',
    comprehensiveWorkflowManagement: 'Comprehensive workflow management, compliance tracking, and talent segmentation',
    activeWorkflows: 'Active Workflows',
    automatedProcessesRunning: 'Automated processes running',
    talentPoolCandidates: 'Talent Pool Candidates',
    acrossTalentPools: 'Across',
    complianceScore: 'Compliance Score',
    gdprEeocAdaCompliance: 'GDPR, EEOC, ADA compliance',
    apiIntegrations: 'API Integrations',
    connectedHRTools: 'Connected HR tools',
    workflowManagement: 'Workflow Management',
    createManageWorkflows: 'Create and manage recruitment workflows with automated steps',
    customWorkflowBuilder: 'Custom workflow builder',
    automatedTriggers: 'Automated triggers',
    stepConditions: 'Step conditions',
    teamAssignments: 'Team assignments',
    talentPoolSegmentation: 'Talent Pool Segmentation',
    segmentBySkillsExperience: 'Segment candidates by skills, experience, and job level',
    smartSegmentation: 'Smart segmentation',
    targetedCommunication: 'Targeted communication',
    poolAnalytics: 'Pool analytics',
    autoCategorization: 'Auto-categorization',
    complianceTracking: 'Compliance Tracking',
    ensureCompliance: 'Ensure GDPR, EEOC, and ADA compliance across all processes',
    complianceMonitoring: 'Compliance monitoring',
    violationAlerts: 'Violation alerts',
    auditTrails: 'Audit trails',
    policyEnforcement: 'Policy enforcement',
    connectHRTools: 'Connect with HR tools and external systems',
    hrmsIntegration: 'HRMS integration',
    assessmentTools: 'Assessment tools',
    backgroundChecks: 'Background checks',
    communicationPlatforms: 'Communication platforms',
    
    // ATS content descriptions
    advancedWorkflowFeatures: 'Advanced workflow management system with all your requested features!',
    segmentTalentBySkills: 'Segment talent by skills, experience, and job level as requested!',
    hrToolsIntegrationPlatform: 'HR tools integration platform with API middleware ready!',
    workflows: 'Workflows',
    talentPools: 'Talent Pools',
    compliance: 'Compliance',
    integrations: 'Integrations',
    
    // Screening Module translations
    aiAssessments: 'AI Assessments',
    autoScreened: 'Auto-Screened',
    pendingReview: 'Pending Review',
    passedScreening: 'Passed Screening',
    recentAIScreenings: 'Recent AI Screenings',
    latestCandidateAssessments: 'Latest candidate assessments and screening results',
    candidate: 'Candidate',
    position: 'Position',
    aiScore: 'AI Score',
    skillsMatched: 'Skills Matched',
    time: 'Time',
    passed: 'Passed',
    review: 'Review',
    aiAssessmentTemplates: 'AI Assessment Templates',
    preBuiltAssessmentTemplates: 'Pre-built assessment templates for different roles',
    frontendDeveloperAssessment: 'Frontend Developer Assessment',
    backendDeveloperAssessment: 'Backend Developer Assessment',
    uiuxDesignerAssessment: 'UI/UX Designer Assessment',
    productManagerAssessment: 'Product Manager Assessment',
    dataScientistAssessment: 'Data Scientist Assessment',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    useTemplate: 'Use Template',
    using: 'Using',
    template: 'template',
    templateDetails: 'Template Details',
    duration: 'Duration',
    difficulty: 'Difficulty',
    thisWillLaunchAssessmentBuilder: 'This will launch the assessment builder.',
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    jobs: 'Empleos',
    candidates: 'Candidatos',
    pipeline: 'Pipeline',
    screening: 'Evaluación IA',
    socialScreening: 'Evaluación Social',
    assessments: 'Evaluaciones',
    templates: 'Plantillas',
    analytics: 'Análisis',
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
    create: 'Crear',
    language: 'Idioma',
    
    // Time
    minutesAgo: 'minutos atrás',
    hoursAgo: 'horas atrás',
    dayAgo: 'día atrás',
    daysAgo: 'días atrás',
    
    // Activities
    newApplication: 'Nueva Aplicación',
    aiCompleted: 'Evaluación IA Completada',
    interviewScheduled: 'Entrevista Programada',
    offerExtended: 'Oferta Extendida',
    
    // Jobs
    postJob: 'Publicar Empleo',
    
    // Users
    hrManager: 'Gerente de RRHH',
    
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
    insights: 'Perspectivas',
    
    // Resumes
    resumes: 'Currículums',
    resumeManager: 'Gestor de Currículums',
    uploadResume: 'Subir Currículum',
    parseResume: 'Analizar Currículum',
    resumeAnalysis: 'Análisis de Currículum',
    resumeUpload: 'Subida de Currículum',
    resumeProcessing: 'Procesamiento de Currículum',
    candidateName: 'Nombre del Candidato',
    fileName: 'Nombre del Archivo',
    uploadDate: 'Fecha de Subida',
    fileSize: 'Tamaño del Archivo',
    aiAnalysis: 'Análisis IA',
    processed: 'Procesado',
    pending: 'Pendiente',
    uploaded: 'Subido',
    analyzing: 'Analizando',
    accepted: 'Aceptado',
    rejected: 'Rechazado',
    reviewRequired: 'Revisión Requerida',
    
    // Additional Resume Module translations
    uploadAnalyzeResumes: 'Carga, analiza y gestiona currículums de candidatos con emparejamiento IA y evaluación social',
    dropFilesHere: 'Soltar archivos aquí',
    uploadResumeFiles: 'Subir Archivos de Currículum',
    dragDropPdf: 'Arrastra y suelta archivos PDF o haz clic para navegar',
    chooseFiles: 'Elegir Archivos',
    searchByNameEmailSkills: 'Buscar por nombre, email o habilidades...',
    allStatus: 'Todos los Estados',
    processing: 'Procesando',
    analyzed: 'Analizado',
    totalResumes: 'Total de Currículums',
    aiAnalyzed: 'Analizados por IA',
    avgMatchScore: 'Puntuación Promedio',
    uploadedResumes: 'Currículums Subidos',
    noResumesFound: 'No se encontraron currículums',
    uploadResumesOrAdjust: 'Sube currículums o ajusta tus criterios de búsqueda',
    jobMatch: 'Coincidencia de Trabajo',
    pendingAnalysis: 'Análisis Pendiente',
    accept: 'Aceptar',
    reject: 'Rechazar',
    socialScreeningAction: 'Evaluación Social',
    screeningAction: 'Evaluando...',
    risk: 'Riesgo',
    jobMatchAnalysis: 'Análisis de Coincidencia de Trabajo',
    match: 'Coincidencia',
    for: 'para',
    alignedSkills: 'Habilidades Alineadas',
    missingSkills: 'Habilidades Faltantes',
    aiRecommendation: 'Recomendación IA',
    confidence: 'Confianza',
    aiSummary: 'Resumen IA',
    skillsExtracted: 'Habilidades Extraídas',
    education: 'Educación',
    aiAnalysisInProgress: 'Análisis IA en progreso...',
    areYouSureReject: '¿Estás seguro de que quieres rechazar este currículum?',
    resumeAccepted: '¡Currículum aceptado! El candidato será agregado al pipeline.',
    candidateAddedToPipeline: 'El candidato será agregado al pipeline.',
    startingSocialScreening: 'Iniciando evaluación de redes sociales para',
    socialScreeningDetails: 'Esto verificará:\n- Perfil de LinkedIn\n- Redes sociales públicas\n- Referencias profesionales\n- Verificación de antecedentes',
    resultsAvailable24h: 'Los resultados estarán disponibles en 24-48 horas.',
    pleaseUploadPdfOnly: 'Por favor, sube solo archivos PDF',
    more: 'más',
    
    // Jobs Module translations
    manageJobsDescription: 'Gestionar ofertas de trabajo y hacer seguimiento de aplicaciones',
    allJobs: 'Todos los Empleos',
    applications: 'Aplicaciones',
    actions: 'Acciones',
    
    // Candidates Module translations
    manageCandidatesDescription: 'Hacer seguimiento y gestionar aplicaciones de candidatos a través del proceso de contratación',
    allStages: 'Todas las Etapas',
    pleaseSelectCandidates: 'Por favor selecciona candidatos primero',
    areYouSureRejectCandidates: '¿Estás seguro de que quieres rechazar {count} candidatos?',
    bulkMoving: 'Moviendo candidatos en masa: {names}\n¡Esta función estará disponible pronto!',
    featureComingSoon: '¡Esta función estará disponible pronto!',
    sendingBulkEmail: 'Enviando email masivo a: {names}\n¡Esta función estará disponible pronto!',
    moveCandidate: '¿Mover {name} de "{currentStage}" a "{nextStage}"?',
    actionSelected: 'Acción "{action}" seleccionada para: {names}',
    
    // Analytics Module translations
    analyticsReports: 'Análisis y Reportes',
    insightsPerformanceMetrics: 'Perspectivas y métricas de rendimiento para su proceso de contratación',
    timeRange7d: '7d',
    timeRange30d: '30d',
    timeRange90d: '90d',
    timeRange1y: '1a',
    totalApplications: 'Total de Aplicaciones',
    hireRate: 'Tasa de Contratación',
    avgTimeToHire: 'Tiempo Promedio de Contratación',
    costPerHire: 'Costo por Contratación',
    vsLastPeriod: 'vs período anterior',
    hiringPipelineFunnel: 'Embudo del Pipeline de Contratación',
    applicationSources: 'Fuentes de Aplicaciones',
    companyWebsite: 'Sitio Web de la Empresa',
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    referrals: 'Referencias',
    other: 'Otros',
    applied: 'Aplicado',
    phoneScreen: 'Entrevista Telefónica',
    technical: 'Técnica',
    finalInterview: 'Entrevista Final',
    offer: 'Oferta',
    
    // Social Screening Module translations
    comprehensiveSocialAnalysis: 'Análisis integral de redes sociales y verificación de antecedentes para candidatos',
    startNewScreening: 'Iniciar Nueva Evaluación',
    enterCandidateName: 'Ingrese nombre del candidato...',
    startScreening: 'Iniciar Evaluación',
    allScreenings: 'Todas las Evaluaciones',
    notStarted: 'No Iniciado',
    inProgress: 'En Progreso',
    completed: 'Completado',
    flagged: 'Marcado',
    totalScreenings: 'Total de Evaluaciones',
    noScreeningsFound: 'No se encontraron evaluaciones',
    startNewScreeningAbove: 'Inicie un nuevo proceso de evaluación social arriba',
    started: 'Iniciado',
    socialMediaAnalysis: 'Análisis de Redes Sociales',
    verified: 'Verificado',
    unverified: 'No Verificado',
    followers: 'Seguidores',
    sentiment: 'Sentimiento',
    lastActivity: 'Última Actividad',
    riskFactors: 'Factores de Riesgo',
    backgroundCheck: 'Verificación de Antecedentes',
    criminalRecord: 'Registro Criminal',
    clear: 'LIMPIO',
    employment: 'Empleo',
    references: 'Referencias',
    aiAnalysisSummary: 'Resumen del Análisis IA',
    recommendation: 'Recomendación',
    approve: 'Aprobar',
    positiveIndicators: 'Indicadores Positivos',
    redFlags: 'Señales de Alerta',
    referenceFeedback: 'Comentarios de Referencias',
    positive: 'Positivo',
    neutral: 'Neutral',
    negative: 'Negativo',
    riskScore: 'Puntuación de Riesgo',
    
    // ATS Module translations
    advancedATSSystem: 'Sistema ATS Avanzado',
    comprehensiveWorkflowManagement: 'Gestión integral de flujos de trabajo, seguimiento de cumplimiento y segmentación de talento',
    activeWorkflows: 'Flujos de Trabajo Activos',
    automatedProcessesRunning: 'Procesos automatizados en ejecución',
    talentPoolCandidates: 'Candidatos del Pool de Talento',
    acrossTalentPools: 'En',
    complianceScore: 'Puntuación de Cumplimiento',
    gdprEeocAdaCompliance: 'Cumplimiento GDPR, EEOC, ADA',
    apiIntegrations: 'Integraciones API',
    connectedHRTools: 'Herramientas de RRHH conectadas',
    workflowManagement: 'Gestión de Flujos de Trabajo',
    createManageWorkflows: 'Crear y gestionar flujos de trabajo de reclutamiento con pasos automatizados',
    customWorkflowBuilder: 'Constructor de flujos personalizados',
    automatedTriggers: 'Disparadores automatizados',
    stepConditions: 'Condiciones de pasos',
    teamAssignments: 'Asignaciones de equipo',
    talentPoolSegmentation: 'Segmentación de Pool de Talento',
    segmentBySkillsExperience: 'Segmentar candidatos por habilidades, experiencia y nivel de trabajo',
    smartSegmentation: 'Segmentación inteligente',
    targetedCommunication: 'Comunicación dirigida',
    poolAnalytics: 'Análisis de pools',
    autoCategorization: 'Categorización automática',
    complianceTracking: 'Seguimiento de Cumplimiento',
    ensureCompliance: 'Asegurar el cumplimiento de GDPR, EEOC y ADA en todos los procesos',
    complianceMonitoring: 'Monitoreo de cumplimiento',
    violationAlerts: 'Alertas de violación',
    auditTrails: 'Pistas de auditoría',
    policyEnforcement: 'Aplicación de políticas',
    connectHRTools: 'Conectar con herramientas de RRHH y sistemas externos',
    hrmsIntegration: 'Integración HRMS',
    assessmentTools: 'Herramientas de evaluación',
    backgroundChecks: 'Verificación de antecedentes',
    communicationPlatforms: 'Plataformas de comunicación',
    
    // ATS content descriptions  
    advancedWorkflowFeatures: '¡Sistema avanzado de gestión de flujos de trabajo con todas las funciones solicitadas!',
    segmentTalentBySkills: '¡Segmenta el talento por habilidades, experiencia y nivel de trabajo según lo solicitado!',
    hrToolsIntegrationPlatform: '¡Plataforma de integración de herramientas de RRHH con middleware API listo!',
    workflows: 'Flujos de Trabajo',
    talentPools: 'Pools de Talento',
    compliance: 'Cumplimiento',
    integrations: 'Integraciones',
    
    // Screening Module translations
    aiAssessments: 'Evaluaciones IA',
    autoScreened: 'Auto-Evaluado',
    pendingReview: 'Revisión Pendiente',
    passedScreening: 'Evaluación Aprobada',
    recentAIScreenings: 'Evaluaciones IA Recientes',
    latestCandidateAssessments: 'Últimas evaluaciones de candidatos y resultados de selección',
    candidate: 'Candidato',
    position: 'Posición',
    aiScore: 'Puntuación IA',
    skillsMatched: 'Habilidades Coincidentes',
    time: 'Tiempo',
    passed: 'Aprobado',
    review: 'Revisión',
    aiAssessmentTemplates: 'Plantillas de Evaluación IA',
    preBuiltAssessmentTemplates: 'Plantillas de evaluación predefinidas para diferentes roles',
    frontendDeveloperAssessment: 'Evaluación de Desarrollador Frontend',
    backendDeveloperAssessment: 'Evaluación de Desarrollador Backend',
    uiuxDesignerAssessment: 'Evaluación de Diseñador UI/UX',
    productManagerAssessment: 'Evaluación de Gerente de Producto',
    dataScientistAssessment: 'Evaluación de Científico de Datos',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    expert: 'Experto',
    useTemplate: 'Usar Plantilla',
    using: 'Usando',
    template: 'plantilla',
    templateDetails: 'Detalles de la Plantilla',
    duration: 'Duración',
    difficulty: 'Dificultad',
    thisWillLaunchAssessmentBuilder: 'Esto lanzará el constructor de evaluaciones.',
  }
}

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en')

  const t = translations[language as keyof typeof translations] as Translations

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}