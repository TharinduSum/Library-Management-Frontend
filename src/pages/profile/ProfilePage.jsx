import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { User as UserIcon, Key } from 'lucide-react'
import { useUser } from '../../hooks'
import { Spinner } from '../../components/ui'
import { ApiKeysPage } from '../users/ApiKeysPage'

export const ProfilePage = () => {
  const [searchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const { data: user, isLoading } = useUser()

  useEffect(() => {
    if (tab === 'api-keys') {
    }
  }, [tab])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (tab === 'api-keys' && user) {
    return <ApiKeysPage id={user.id} />
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Profile
      </h1>

      <div className="card" style={{ maxWidth: '500px' }}>
        <div className="flex items-center gap-4 mb-6">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UserIcon size={32} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Role</span>
            <p style={{ fontWeight: 500 }}>{user?.role_name || 'N/A'}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</span>
            <p style={{ fontWeight: 500 }}>{user?.is_active ? 'Active' : 'Inactive'}</p>
          </div>
          {user?.created_at && (
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Member Since</span>
              <p style={{ fontWeight: 500 }}>
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <a
            href="?tab=api-keys"
            className="btn btn-secondary"
            style={{ display: 'inline-flex' }}
          >
            <Key size={18} />
            Manage API Keys
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
