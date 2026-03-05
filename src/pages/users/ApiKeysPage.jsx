import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Copy, Check } from 'lucide-react'
import { useUser, useUserApiKeys, useCreateApiKey, useRevokeApiKey } from '../../hooks'
import { Button, Input, Modal, Badge, Spinner } from '../../components/ui'
import { canManageUsers } from '../../utils/permissions'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export const ApiKeysPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [copied, setCopied] = useState(false)

  const isOwnProfile = currentUser?.id === parseInt(id)

  const { data: user, isLoading: userLoading } = useUser(id)
  const { data: apiKeysData, isLoading: keysLoading } = useUserApiKeys(id)
  const createMutation = useCreateApiKey()
  const revokeMutation = useRevokeApiKey()

  const apiKeys = apiKeysData?.items || apiKeysData || []

  const handleCreate = async (data) => {
    try {
      const result = await createMutation.mutateAsync({ userId: id, data })
      setNewKey(result.api_key)
      toast.success('API key created successfully')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create API key')
    }
  }

  const handleRevoke = async (keyId) => {
    try {
      await revokeMutation.mutateAsync({ userId: id, keyId })
      toast.success('API key revoked successfully')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to revoke API key')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (userLoading || keysLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>API Keys</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Manage API keys for {user?.name}
          </p>
        </div>
        {(isOwnProfile || canManageUsers(currentUser)) && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Generate Key
          </Button>
        )}
      </div>

      {newKey && (
        <div
          className="card mb-4"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'var(--success)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.25rem' }}>
                API Key Created
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Copy this key now. You won't be able to see it again!
              </p>
              <code
                style={{
                  display: 'block',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              >
                {newKey}
              </code>
            </div>
            <Button variant="secondary" onClick={copyToClipboard}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      )}

      <div className="card">
        {apiKeys.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {apiKeys.map((key) => (
              <div
                key={key.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{key.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Created: {format(new Date(key.created_at), 'MMM d, yyyy')}
                    {key.expires_at && ` | Expires: ${format(new Date(key.expires_at), 'MMM d, yyyy')}`}
                  </div>
                  <code
                    style={{
                      display: 'block',
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {key.key_prefix}...
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={key.is_active ? 'success' : 'error'}>
                    {key.is_active ? 'Active' : 'Revoked'}
                  </Badge>
                  {key.is_active && (isOwnProfile || canManageUsers(currentUser)) && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRevoke(key.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state-description">No API keys found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate API Key"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleCreate({ name: 'New API Key' })}
              loading={createMutation.isPending}
            >
              Generate
            </Button>
          </>
        }
      >
        <Input
          label="Key Name"
          placeholder="Enter a name for this key"
          id="keyName"
        />
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          This will create a new API key that can be used to access the API.
        </p>
      </Modal>
    </div>
  )
}

export default ApiKeysPage
