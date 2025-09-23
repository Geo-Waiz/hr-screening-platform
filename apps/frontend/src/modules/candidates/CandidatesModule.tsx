import { useState } from 'react'
import type { Translations } from '../../contexts/LanguageContext'
import { UsersIcon, ClipboardIcon, CalendarIcon, TargetIcon, SearchIcon } from '../../components/ProfessionalIcons'

// Additional Professional SVG Icons
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
)

interface CandidatesModuleProps {
  t?: Translations
}

const CandidatesModule = ({ t = {} as Translations }: CandidatesModuleProps) => {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [showBulkActions, setShowBulkActions] = useState(false)

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      position: 'Senior React Developer',
      stage: 'Technical Interview',
      score: 8.5,
      applied: '2024-09-15',
      experience: '5+ years',
      skills: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      email: 'marcus.j@email.com',
      position: 'Product Manager',
      stage: 'Final Interview',
      score: 9.2,
      applied: '2024-09-12',
      experience: '7+ years',
      skills: ['Product Strategy', 'Agile', 'Analytics']
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      email: 'elena.r@email.com',
      position: 'UX Designer',
      stage: 'Offer Extended',
      score: 8.8,
      applied: '2024-09-10',
      experience: '4+ years',
      skills: ['Figma', 'User Research', 'Prototyping']
    }
  ])

  // Filter candidates based on search and stage
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter
    return matchesSearch && matchesStage
  })

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Applied': return { bg: '#eff6ff', text: '#1d4ed8' }
      case 'Phone Screen': return { bg: '#fef3c7', text: '#92400e' }
      case 'Technical Interview': return { bg: '#f3e8ff', text: '#7c3aed' }
      case 'Final Interview': return { bg: '#fef2f2', text: '#dc2626' }
      case 'Offer Extended': return { bg: '#dcfce7', text: '#166534' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  // Candidate actions
  const handleViewProfile = (candidateId: number) => {
    const candidate = candidates.find(c => c.id === candidateId)
    if (candidate) {
      alert(`Viewing Profile for ${candidate.name}\n\nEmail: ${candidate.email}\nPosition: ${candidate.position}\nStage: ${candidate.stage}\nScore: ${candidate.score}/10\nExperience: ${candidate.experience}\nSkills: ${candidate.skills.join(', ')}`)
    }
  }

  const handleMoveForward = (candidateId: number) => {
    const candidate = candidates.find(c => c.id === candidateId)
    if (candidate) {
      const stages = ['Applied', 'Phone Screen', 'Technical Interview', 'Final Interview', 'Offer Extended', 'Hired']
      const currentIndex = stages.indexOf(candidate.stage)
      const nextStage = stages[currentIndex + 1] || 'Hired'
      
      if (window.confirm(t.moveCandidate.replace('{name}', candidate.name).replace('{currentStage}', candidate.stage).replace('{nextStage}', nextStage))) {
        setCandidates(prev => prev.map(c => 
          c.id === candidateId ? { ...c, stage: nextStage } : c
        ))
        alert(`${candidate.name} moved to ${nextStage}`)
      }
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedCandidates.length === 0) {
      alert(t.pleaseSelectCandidates)
      return
    }
    
    const candidateNames = selectedCandidates.map(id => 
      candidates.find(c => c.id === id)?.name
    ).join(', ')

    switch (action) {
      case 'move':
        alert(t.bulkMoving.replace('{names}', candidateNames))
        break
      case 'reject':
        if (window.confirm(t.areYouSureRejectCandidates.replace('{count}', selectedCandidates.length.toString()))) {
          alert(`Rejected candidates: ${candidateNames}`)
          setSelectedCandidates([])
        }
        break
      case 'email':
        alert(t.sendingBulkEmail.replace('{names}', candidateNames))
        break
      default:
        alert(t.actionSelected.replace('{action}', action).replace('{names}', candidateNames))
    }
  }

  const toggleCandidateSelection = (candidateId: number) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const selectAllCandidates = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([])
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id))
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
          {t.candidates}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          {t.manageCandidatesDescription}
        </p>
      </div>

      {/* Quick Stats */}
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
          placeholder={`${t.search} ${t.candidates}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#ffffff'
          }}
        >
          <option value="all">{t.allStages}</option>
          <option value="Applied">Applied</option>
          <option value="Phone Screen">Phone Screen</option>
          <option value="Technical Interview">Technical Interview</option>
          <option value="Final Interview">Final Interview</option>
          <option value="Offer Extended">Offer Extended</option>
        </select>

        <button
          onClick={() => setShowBulkActions(!showBulkActions)}
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
          Bulk Actions ({selectedCandidates.length})
        </button>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedCandidates.length > 0 && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            Bulk Actions ({selectedCandidates.length} selected)
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleBulkAction('move')}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Move Stage
            </button>
            <button
              onClick={() => handleBulkAction('email')}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Send Email
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Candidates', value: candidates.length.toString(), icon: <UsersIcon />, color: '#3b82f6' },
          { label: 'Active Pipeline', value: filteredCandidates.length.toString(), icon: <ClipboardIcon />, color: '#10b981' },
          { label: 'Interview Ready', value: candidates.filter(c => c.stage.includes('Interview')).length.toString(), icon: <CalendarIcon />, color: '#f59e0b' },
          { label: 'Offers Extended', value: candidates.filter(c => c.stage === 'Offer Extended').length.toString(), icon: <TargetIcon />, color: '#8b5cf6' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
          >
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

      {/* Candidates List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
              Active Candidates ({filteredCandidates.length})
            </h2>
            <button
              onClick={selectAllCandidates}
              style={{
                background: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {selectedCandidates.length === filteredCandidates.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <SearchIcon width={48} height={48} color="#9ca3af" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No candidates found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <div key={candidate.id} style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'grid',
              gridTemplateColumns: '40px 2fr 1fr 1fr 1fr',
              gap: '20px',
              alignItems: 'center',
              background: selectedCandidates.includes(candidate.id) ? '#f8fafc' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={selectedCandidates.includes(candidate.id)}
                onChange={() => toggleCandidateSelection(candidate.id)}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              
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
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>
                      {candidate.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {candidate.email}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Applied for: {candidate.position}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {candidate.skills.map((skill, idx) => (
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
                </div>
              </div>
              
              <div>
                <span style={{
                  ...getStageColor(candidate.stage),
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: getStageColor(candidate.stage).bg,
                  color: getStageColor(candidate.stage).text
                }}>
                  {candidate.stage}
                </span>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: candidate.score >= 8 ? '#10b981' : candidate.score >= 6 ? '#f59e0b' : '#6b7280',
                  marginBottom: '2px'
                }}>
                  {candidate.score}/10
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Score
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleViewProfile(candidate.id)}
                  style={{
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dbeafe'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#eff6ff'
                  }}
                >
                  <EyeIcon /> View Profile
                </button>
                <button 
                  onClick={() => handleMoveForward(candidate.id)}
                  style={{
                    background: '#f0fdf4',
                    color: '#166534',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dcfce7'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f0fdf4'
                  }}
                >
                  Move Forward <ArrowRightIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CandidatesModule
