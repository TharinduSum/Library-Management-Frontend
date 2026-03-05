import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Key } from 'lucide-react'
import { useUsers, useRoles, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks'
import { Button, Input, Modal, Table, Badge, Spinner } from '../../components/ui'
import { UserForm } from '../../components/forms'
import { canManageUsers } from '../../utils/permissions'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const UsersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const { data, isLoading } = useUsers()
  const { data: rolesData } = useRoles()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const users = data?.items || data || []
  const roles = rolesData?.items || rolesData || []

  const columns = [
    {
      header: 'Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      render: (row) => (
        <Badge variant="info">{row.role_name || 'N/A'}</Badge>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Created',
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A',
    },
    {
      header: 'Actions',
      width: '140px',
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/users/${row.id}/api-keys`)
            }}
          >
            <Key size={16} />
          </button>
          {canManageUsers(user) && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingUser(row)
                  setIsModalOpen(true)
                }}
              >
                <Edit2 size={16} />
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--error)' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteUser(row)
                }}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  const handleSubmit = async (data) => {
    try {
      if (editingUser) {
        await updateMutation.mutateAsync({ id: editingUser.id, data })
        toast.success('User updated successfully')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('User created successfully')
      }
      setIsModalOpen(false)
      setEditingUser(null)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteUser.id)
      toast.success('User deleted successfully')
      setDeleteUser(null)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Delete failed')
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Users</h1>
        {canManageUsers(user) && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add User
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={users}
        emptyMessage="No users found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        title={editingUser ? 'Edit User' : 'Add User'}
      >
        <UserForm
          user={editingUser}
          roles={roles}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingUser(null)
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{deleteUser?.name}</strong>?
        </p>
      </Modal>
    </div>
  )
}

export default UsersPage
