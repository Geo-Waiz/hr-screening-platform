import React, { useState } from 'react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  avatar?: string;
  resume: string;
  appliedDate: string;
  lastContact: string;
  rating: number;
  notes: string;
  skills: string[];
  experience: string;
  salary: string;
}

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior React Developer',
      stage: 'Interview',
      resume: 'sarah_johnson_resume.pdf',
      appliedDate: '2025-09-15',
      lastContact: '2025-09-18',
      rating: 4.5,
      notes: 'Strong technical background, excellent communication skills.',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      experience: '6 years',
      salary: '15,000'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      position: 'Product Manager',
      stage: 'Offer',
      resume: 'michael_chen_resume.pdf',
      appliedDate: '2025-09-10',
      lastContact: '2025-09-19',
      rating: 4.8,
      notes: 'Outstanding product vision and leadership experience.',
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
      experience: '8 years',
      salary: '30,000'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      position: 'UX Designer',
      stage: 'Screening',
      resume: 'emily_rodriguez_resume.pdf',
      appliedDate: '2025-09-12',
      lastContact: '2025-09-17',
      rating: 4.2,
      notes: 'Creative designer with strong portfolio.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      experience: '4 years',
      salary: '5,000'
    },
    {
      id: '4',
      name: 'David Park',
      email: 'david.park@email.com',
      phone: '+1 (555) 321-0987',
      position: 'Senior React Developer',
      stage: 'Applied',
      resume: 'david_park_resume.pdf',
      appliedDate: '2025-09-16',
      lastContact: '2025-09-16',
      rating: 3.8,
      notes: 'Recent graduate with promising portfolio.',
      skills: ['React', 'JavaScript', 'CSS', 'Git'],
      experience: '2 years',
      salary: '5,000'
    }
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [draggedCandidate, setDraggedCandidate] = useState<string | null>(null);

  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  
  const stageColors = {
    'Applied': { bg: '#f3f4f6', text: '#374151' },
    'Screening': { bg: '#dbeafe', text: '#1d4ed8' },
    'Interview': { bg: '#fef3c7', text: '#d97706' },
    'Offer': { bg: '#dcfce7', text: '#16a34a' },
    'Hired': { bg: '#d1fae5', text: '#059669' },
    'Rejected': { bg: '#fee2e2', text: '#dc2626' }
  };

  const handleDragStart = (candidateId: string) => {
    setDraggedCandidate(candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (draggedCandidate) {
      setCandidates(candidates.map(candidate =>
        candidate.id === draggedCandidate
          ? { ...candidate, stage: newStage as Candidate['stage'] }
          : candidate
      ));
      setDraggedCandidate(null);
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
  };

  const CandidateModal = ({ candidate, onClose }: { candidate: Candidate, onClose: () => void }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '700px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>{candidate.name}</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b'
          }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Contact Information</h3>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Email:</strong> {candidate.email}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Phone:</strong> {candidate.phone}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Position:</strong> {candidate.position}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Experience:</strong> {candidate.experience}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Expected Salary:</strong> {candidate.salary}
            </p>
          </div>

          <div>
            <h3 style={{ color: '#1e293b', marginBottom: '1rem' }}>Application Details</h3>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Applied:</strong> {new Date(candidate.appliedDate).toLocaleDateString()}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Last Contact:</strong> {new Date(candidate.lastContact).toLocaleDateString()}
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Current Stage:</strong> 
              <span style={{
                background: stageColors[candidate.stage].bg,
                color: stageColors[candidate.stage].text,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                marginLeft: '0.5rem'
              }}>
                {candidate.stage}
              </span>
            </p>
            <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
              <strong>Rating:</strong> {getRatingStars(candidate.rating)} ({candidate.rating}/5)
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {candidate.skills.map((skill, index) => (
              <span key={index} style={{
                background: '#e2e8f0',
                color: '#475569',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Notes</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>{candidate.notes}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Schedule Interview
          </button>
          <button style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Move to Next Stage
          </button>
          <button style={{
            background: '#f8fafc',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Download Resume
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '2rem' }}>👥 Candidate Pipeline</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              background: '#f8fafc',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Export Candidates
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Add Candidate
            </button>
          </div>
        </div>

        {/* Pipeline Board */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          minHeight: '500px'
        }}>
          {stages.map(stage => (
            <div
              key={stage}
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '1rem',
                border: '2px dashed #e2e8f0'
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>
                  {stage}
                </h3>
                <span style={{
                  background: stageColors[stage as keyof typeof stageColors].bg,
                  color: stageColors[stage as keyof typeof stageColors].text,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {candidates.filter(c => c.stage === stage).length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {candidates
                  .filter(candidate => candidate.stage === stage)
                  .map(candidate => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={() => handleDragStart(candidate.id)}
                      onClick={() => setSelectedCandidate(candidate)}
                      style={{
                        background: 'white',
                        borderRadius: '6px',
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: draggedCandidate === candidate.id ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.9rem' }}>
                          {candidate.name}
                        </h4>
                        <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.8rem' }}>
                          {candidate.position}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {getRatingStars(candidate.rating)}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {new Date(candidate.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Candidate Details Modal */}
        {selectedCandidate && (
          <CandidateModal 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
