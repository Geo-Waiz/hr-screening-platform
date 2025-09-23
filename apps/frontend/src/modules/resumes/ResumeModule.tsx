import { FileTextIcon, FolderIcon, BrainIcon, TargetIcon, SearchIcon, CheckIcon, XIcon, RefreshIcon } from "../../components/ProfessionalIcons"
import { useState, useRef } from 'react'
import type { Translations } from '../../contexts/LanguageContext'

interface ResumeModuleProps {
  t: Translations
}

// Additional professional SVG icons
const InboxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface Resume {
  id: string
  fileName: string
  candidateName: string
  email: string
  phone: string
  uploadDate: Date
  fileSize: number
  aiAnalysis: {
    processed: boolean
    skills: string[]
    experience: string[]
    education: string[]
    keywords: string[]
    jobMatch: {
      jobTitle: string
      matchScore: number
      alignedSkills: string[]
      missingSkills: string[]
    }
    summary: string
    recommendation: 'accept' | 'reject' | 'review'
    confidence: number
  }
  socialScreening: {
    status: 'pending' | 'completed' | 'not-started'
    platforms: string[]
    riskScore?: number
  }
  status: 'uploaded' | 'processing' | 'analyzed' | 'accepted' | 'rejected'
}

interface Job {
  id: string
  title: string
  requiredSkills: string[]
  keywords: string[]
  department: string
}

const ResumeModule = ({ t }: ResumeModuleProps) => {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      fileName: 'sarah_chen_resume.pdf',
      candidateName: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1-555-123-4567',
      uploadDate: new Date('2024-09-20'),
      fileSize: 245760,
      aiAnalysis: {
        processed: true,
        skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'MongoDB', 'Redux', 'Jest'],
        experience: ['Senior Frontend Developer at TechCorp (3 years)', 'Full Stack Developer at StartupXYZ (2 years)'],
        education: ['BS Computer Science, Stanford University'],
        keywords: ['frontend', 'javascript', 'agile', 'remote', 'startup', 'scalable'],
        jobMatch: {
          jobTitle: 'Senior React Developer',
          matchScore: 92,
          alignedSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
          missingSkills: ['GraphQL', 'Docker']
        },
        summary: 'Highly qualified frontend developer with 5+ years experience. Strong React and TypeScript skills. Experience with modern frameworks and cloud platforms.',
        recommendation: 'accept',
        confidence: 0.94
      },
      socialScreening: {
        status: 'not-started',
        platforms: ['LinkedIn', 'GitHub', 'Twitter']
      },
      status: 'analyzed'
    },
    {
      id: '2',
      fileName: 'marcus_johnson_cv.pdf',
      candidateName: 'Marcus Johnson',
      email: 'marcus.j@email.com',
      phone: '+1-555-987-6543',
      uploadDate: new Date('2024-09-19'),
      fileSize: 189440,
      aiAnalysis: {
        processed: true,
        skills: ['Product Strategy', 'Agile', 'Analytics', 'SQL', 'Roadmap Planning'],
        experience: ['Product Manager at BigTech (4 years)', 'Business Analyst at ConsultingFirm (2 years)'],
        education: ['MBA Harvard Business School', 'BS Engineering MIT'],
        keywords: ['product', 'strategy', 'growth', 'analytics', 'leadership'],
        jobMatch: {
          jobTitle: 'Product Manager',
          matchScore: 89,
          alignedSkills: ['Product Strategy', 'Agile', 'Analytics'],
          missingSkills: ['A/B Testing', 'User Research']
        },
        summary: 'Experienced product manager with strong analytical background. Proven track record in product strategy and team leadership.',
        recommendation: 'accept',
        confidence: 0.91
      },
      socialScreening: {
        status: 'completed',
        platforms: ['LinkedIn', 'Twitter'],
        riskScore: 15
      },
      status: 'accepted'
    }
  ])

  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior React Developer',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'Docker'],
      keywords: ['frontend', 'javascript', 'react', 'typescript', 'responsive'],
      department: 'Engineering'
    },
    {
      id: '2',
      title: 'Product Manager',
      requiredSkills: ['Product Strategy', 'Agile', 'Analytics', 'A/B Testing', 'User Research'],
      keywords: ['product', 'strategy', 'growth', 'analytics', 'roadmap'],
      department: 'Product'
    }
  ])

  const [selectedJob, setSelectedJob] = useState<string>('1')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dragActive, setDragActive] = useState(false)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter resumes based on search and status
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.aiAnalysis.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || resume.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const newResume: Resume = {
          id: Date.now().toString(),
          fileName: file.name,
          candidateName: 'Processing...',
          email: '',
          phone: '',
          uploadDate: new Date(),
          fileSize: file.size,
          aiAnalysis: {
            processed: false,
            skills: [],
            experience: [],
            education: [],
            keywords: [],
            jobMatch: {
              jobTitle: '',
              matchScore: 0,
              alignedSkills: [],
              missingSkills: []
            },
            summary: '',
            recommendation: 'review',
            confidence: 0
          },
          socialScreening: {
            status: 'not-started',
            platforms: []
          },
          status: 'processing'
        }

        setResumes(prev => [...prev, newResume])

        // Simulate AI processing
        setTimeout(() => {
          setResumes(prev => prev.map(r => 
            r.id === newResume.id 
              ? { 
                  ...r, 
                  candidateName: `Candidate ${newResume.id}`,
                  email: `candidate${newResume.id}@email.com`,
                  phone: '+1-555-000-0000',
                  status: 'analyzed',
                  aiAnalysis: {
                    ...r.aiAnalysis,
                    processed: true,
                    skills: ['JavaScript', 'Python', 'Communication'],
                    experience: ['Software Developer (2 years)'],
                    education: ['BS Computer Science'],
                    keywords: ['development', 'programming', 'software'],
                    jobMatch: {
                      jobTitle: jobs.find(j => j.id === selectedJob)?.title || '',
                      matchScore: Math.floor(Math.random() * 40) + 60,
                      alignedSkills: ['JavaScript'],
                      missingSkills: ['React', 'TypeScript']
                    },
                    summary: 'Entry-level developer with potential. Requires additional training in required technologies.',
                    recommendation: 'review',
                    confidence: 0.75
                  }
                } 
              : r
          ))
        }, 3000)
      } else {
        alert(t.pleaseUploadPdfOnly)
      }
    })
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  // Resume actions
  const handleAcceptResume = (resumeId: string) => {
    setResumes(prev => prev.map(r => 
      r.id === resumeId ? { ...r, status: 'accepted' } : r
    ))
    alert(`${t.resumeAccepted} ${t.candidateAddedToPipeline}`)
  }

  const handleRejectResume = (resumeId: string) => {
    if (window.confirm(t.areYouSureReject)) {
      setResumes(prev => prev.map(r => 
        r.id === resumeId ? { ...r, status: 'rejected' } : r
      ))
    }
  }

  const handleSocialScreening = (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId)
    if (resume) {
      alert(`${t.startingSocialScreening} ${resume.candidateName}...\n\n${t.socialScreeningDetails}\n- LinkedIn profile\n- Public social media\n- Professional references\n- Background verification\n\n${t.resultsAvailable24h}.`)
      
      setResumes(prev => prev.map(r => 
        r.id === resumeId 
          ? { 
              ...r, 
              socialScreening: { 
                ...r.socialScreening, 
                status: 'pending' 
              } 
            } 
          : r
      ))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return { bg: '#eff6ff', text: '#1d4ed8' }
      case 'processing': return { bg: '#fef3c7', text: '#92400e' }
      case 'analyzed': return { bg: '#f3e8ff', text: '#7c3aed' }
      case 'accepted': return { bg: '#dcfce7', text: '#166534' }
      case 'rejected': return { bg: '#fef2f2', text: '#dc2626' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'accept': return '#10b981'
      case 'reject': return '#ef4444'
      case 'review': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
          <FileTextIcon /> {t.resumeManager}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          {t.uploadAnalyzeResumes}
        </p>
      </div>

      {/* Upload Section */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {t.uploadResume}
          </h2>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              background: '#ffffff'
            }}
          >
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#4f46e5' : '#d1d5db'}`,
            borderRadius: '8px',
            padding: '48px 24px',
            textAlign: 'center',
            background: dragActive ? '#f8fafc' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}><FolderIcon /></div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
            {dragActive ? t.dropFilesHere : t.uploadResumeFiles}
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b' }}>
            {t.dragDropPdf}
          </p>
          <button
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
            {t.chooseFiles}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder={t.searchByNameEmailSkills}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#ffffff'
          }}
        >
          <option value="all">{t.allStatus}</option>
          <option value="uploaded">{t.uploaded}</option>
          <option value="processing">{t.processing}</option>
          <option value="analyzed">{t.analyzed}</option>
          <option value="accepted">{t.accepted}</option>
          <option value="rejected">{t.rejected}</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: t.totalResumes, value: resumes.length.toString(), icon: <FileTextIcon />, color: '#3b82f6' },
          { label: t.aiAnalyzed, value: resumes.filter(r => r.aiAnalysis.processed).length.toString(), icon: <BrainIcon />, color: '#8b5cf6' },
          { label: t.accepted, value: resumes.filter(r => r.status === 'accepted').length.toString(), icon: <CheckIcon />, color: '#10b981' },
          { label: t.avgMatchScore, value: Math.round(resumes.filter(r => r.aiAnalysis.processed).reduce((sum, r) => sum + r.aiAnalysis.jobMatch.matchScore, 0) / resumes.filter(r => r.aiAnalysis.processed).length || 0) + '%', icon: <TargetIcon />, color: '#f59e0b' }
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

      {/* Resume List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {t.uploadedResumes} ({filteredResumes.length})
          </h2>
        </div>

        {filteredResumes.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#9ca3af', display: 'flex', justifyContent: 'center' }}>
              <InboxIcon />
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>{t.noResumesFound}</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {t.uploadResumesOrAdjust}
            </p>
          </div>
        ) : (
          filteredResumes.map((resume) => (
            <div key={resume.id} style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedResume(resume)}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: '20px', alignItems: 'center' }}>
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
                      {resume.candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {resume.candidateName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {resume.fileName} • {(resume.fileSize / 1024).toFixed(1)}KB
                      </div>
                    </div>
                  </div>
                  {resume.aiAnalysis.processed && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {resume.aiAnalysis.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} style={{
                          background: '#f1f5f9',
                          color: '#6b7280',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                      {resume.aiAnalysis.skills.length > 3 && (
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>
                          +{resume.aiAnalysis.skills.length - 3} {t.more}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Analysis */}
                <div style={{ textAlign: 'center' }}>
                  {resume.status === 'processing' ? (
                    <div>
                      <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '600' }}>Processing...</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>AI Analysis</div>
                    </div>
                  ) : resume.aiAnalysis.processed ? (
                    <div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: resume.aiAnalysis.jobMatch.matchScore >= 80 ? '#10b981' : 
                               resume.aiAnalysis.jobMatch.matchScore >= 60 ? '#f59e0b' : '#ef4444',
                        marginBottom: '2px'
                      }}>
                        {resume.aiAnalysis.jobMatch.matchScore}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {t.jobMatch}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Pending Analysis
                    </div>
                  )}
                </div>

                {/* Status */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    ...getStatusColor(resume.status),
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: getStatusColor(resume.status).bg,
                    color: getStatusColor(resume.status).text
                  }}>
                    {resume.status.charAt(0).toUpperCase() + resume.status.slice(1)}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {resume.aiAnalysis.processed && resume.status === 'analyzed' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAcceptResume(resume.id)
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
                        <CheckIcon /> {t.accept}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRejectResume(resume.id)
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
                        <XIcon /> {t.reject}
                      </button>
                    </>
                  )}
                  
                  {resume.status === 'accepted' && resume.socialScreening.status === 'not-started' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSocialScreening(resume.id)
                      }}
                      style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      <SearchIcon /> {t.socialScreeningAction}
                    </button>
                  )}

                  {resume.socialScreening.status === 'pending' && (
                    <span style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <RefreshIcon /> Screening...
                    </span>
                  )}

                  {resume.socialScreening.status === 'completed' && (
                    <span style={{
                      background: resume.socialScreening.riskScore && resume.socialScreening.riskScore < 30 ? '#dcfce7' : '#fef3c7',
                      color: resume.socialScreening.riskScore && resume.socialScreening.riskScore < 30 ? '#166534' : '#92400e',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Risk: {resume.socialScreening.riskScore}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resume Detail Modal */}
      {selectedResume && (
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
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '600' }}>
                {selectedResume.candidateName} - AI Analysis
              </h3>
              <button
                onClick={() => setSelectedResume(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <XIcon />
              </button>
            </div>

            {selectedResume.aiAnalysis.processed ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      {t.jobMatchAnalysis}
                    </h4>
                    <div style={{
                      background: selectedResume.aiAnalysis.jobMatch.matchScore >= 80 ? '#dcfce7' : 
                                 selectedResume.aiAnalysis.jobMatch.matchScore >= 60 ? '#fef3c7' : '#fef2f2',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: getRecommendationColor(selectedResume.aiAnalysis.recommendation) }}>
                        {selectedResume.aiAnalysis.jobMatch.matchScore}% Match
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {t.for} {selectedResume.aiAnalysis.jobMatch.jobTitle}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <strong>{t.alignedSkills}:</strong>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {selectedResume.aiAnalysis.jobMatch.alignedSkills.map((skill, idx) => (
                          <span key={idx} style={{
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>{t.missingSkills}:</strong>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {selectedResume.aiAnalysis.jobMatch.missingSkills.map((skill, idx) => (
                          <span key={idx} style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      {t.aiRecommendation}
                    </h4>
                    <div style={{
                      background: getRecommendationColor(selectedResume.aiAnalysis.recommendation) + '15',
                      color: getRecommendationColor(selectedResume.aiAnalysis.recommendation),
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      fontSize: '14px'
                    }}>
                      {selectedResume.aiAnalysis.recommendation}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                      {t.confidence}: {Math.round(selectedResume.aiAnalysis.confidence * 100)}%
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      {t.aiSummary}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      color: '#374151', 
                      lineHeight: '1.6',
                      background: '#f8fafc',
                      padding: '12px',
                      borderRadius: '8px'
                    }}>
                      {selectedResume.aiAnalysis.summary}
                    </p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      {t.skillsExtracted}
                    </h4>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {selectedResume.aiAnalysis.skills.map((skill, idx) => (
                        <span key={idx} style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      Experience
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#374151' }}>
                      {selectedResume.aiAnalysis.experience.map((exp, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{exp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      {t.education}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#374151' }}>
                      {selectedResume.aiAnalysis.education.map((edu, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', color: '#9ca3af', display: 'flex', justifyContent: 'center' }}>
                  <ClockIcon />
                </div>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  {t.aiAnalysisInProgress}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeModule