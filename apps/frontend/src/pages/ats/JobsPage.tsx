import { useState } from 'react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'Active' | 'Draft' | 'Closed';
  candidates: number;
  posted: string;
  description: string;
  requirements: string[];
  salary: string;
}

const JobsPage = () => {
  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      status: 'Active',
      candidates: 42,
      posted: '2025-09-15',
      description: 'We are looking for a Senior React Developer to join our growing team.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Node.js knowledge'],
      salary: '0,000 - 20,000'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      status: 'Active',
      candidates: 28,
      posted: '2025-09-10',
      description: 'Lead product strategy and development for our core platform.',
      requirements: ['3+ years PM experience', 'Agile methodology', 'Data-driven mindset'],
      salary: '00,000 - 40,000'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'Draft',
      candidates: 35,
      posted: '2025-09-08',
      description: 'Create beautiful and intuitive user experiences.',
      requirements: ['3+ years UX design', 'Figma expertise', 'User research skills'],
      salary: '0,000 - 10,000'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredJobs = filterStatus === 'All' 
    ? jobs 
    : jobs.filter(job => job.status === filterStatus);

  const statusColors = {
    'Active': { bg: '#dcfce7', text: '#166534' },
    'Draft': { bg: '#fef3c7', text: '#92400e' },
    'Closed': { bg: '#fee2e2', text: '#991b1b' }
  };

  const JobModal = ({ job, onClose }: { job: Job, onClose: () => void }) => (
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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>{job.title}</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b'
          }}>×</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
            <strong>Department:</strong> {job.department}
          </p>
          <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
            <strong>Location:</strong> {job.location}
          </p>
          <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
            <strong>Type:</strong> {job.type}
          </p>
          <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
            <strong>Salary:</strong> {job.salary}
          </p>
          <p style={{ margin: '0.5rem 0', color: '#64748b' }}>
            <strong>Candidates:</strong> {job.candidates}
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>{job.description}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Requirements</h3>
          <ul style={{ color: '#64748b', paddingLeft: '1.5rem' }}>
            {job.requirements.map((req, index) => (
              <li key={index} style={{ marginBottom: '0.25rem' }}>{req}</li>
            ))}
          </ul>
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
            Edit Job
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
            View Applications
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
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '2rem' }}>💼 Jobs Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}
          >
            + Create New Job
          </button>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontWeight: '500' }}>Filter by status:</span>
            {['All', 'Active', 'Draft', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  background: filterStatus === status ? '#e2e8f0' : 'transparent',
                  color: filterStatus === status ? '#1e293b' : '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedJob(job)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{job.title}</h3>
                <span style={{
                  background: statusColors[job.status].bg,
                  color: statusColors[job.status].text,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {job.status}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                  📍 {job.location}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                  🏢 {job.department}
                </p>
                <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                  💰 {job.salary}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '500' }}>
                  {job.candidates} candidates
                </span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  Posted {new Date(job.posted).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}

        {/* Create Job Modal Placeholder */}
        {showCreateModal && (
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
              maxWidth: '500px',
              width: '90%'
            }}>
              <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Create New Job</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Job creation form will be implemented here with all necessary fields.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer'
                }}>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
