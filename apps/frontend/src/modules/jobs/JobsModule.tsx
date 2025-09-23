import { useState } from 'react'
import type { Translations } from '../../contexts/LanguageContext'

interface JobsModuleProps {
  t?: Translations
}

const JobsModule = ({ t = {} as Translations }: JobsModuleProps) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showNewJobForm, setShowNewJobForm] = useState(false)

  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Remote',
      status: 'Active',
      applications: 42,
      salary: '$120k - $150k'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'San Francisco, CA',
      status: 'Active',
      applications: 28,
      salary: '$130k - $160k'
    }
  ]

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'all') return true
    return job.status.toLowerCase() === activeFilter
  })

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
        {t.jobs}
      </h1>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>
        {t.manageJobsDescription}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { key: 'all', label: t.allJobs },
          { key: 'active', label: t.active },
          { key: 'draft', label: t.draft }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            style={{
              background: activeFilter === filter.key ? '#4f46e5' : '#f3f4f6',
              color: activeFilter === filter.key ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            {t.jobs}
          </h2>
          <button 
            onClick={() => setShowNewJobForm(true)}
            style={{
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            + {t.postJob}
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{t.jobTitle}</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{t.department}</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{t.location}</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{t.status}</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{t.applications}</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: '600', color: '#1e293b' }}>{job.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{job.salary}</div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                  {job.department}
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                  {job.location}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    background: job.status === 'Active' ? '#dcfce7' : '#fef3c7',
                    color: job.status === 'Active' ? '#166534' : '#92400e',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {job.status === 'Active' ? t.active : t.draft}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '14px', color: '#6b7280' }}>
                  {job.applications}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {t.view}
                    </button>
                    <button style={{
                      background: '#f3f4f6',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {t.edit}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewJobForm && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>
              {t.postJob}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {t.jobTitle}
              </label>
              <input
                type="text"
                placeholder="e.g. Senior React Developer"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => setShowNewJobForm(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  alert('Job creation feature coming soon!')
                  setShowNewJobForm(false)
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {t.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobsModule
