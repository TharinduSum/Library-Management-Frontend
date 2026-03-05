import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRoles, useCreateRole } from '../../hooks'
import { Button, Modal, Table, Spinner } from '../../components/ui'
import { RoleForm } from '../../components/forms'
import { canManageRoles } from '../../utils/permissions'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export const RolesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const user = useAuthStore((state) => state.user)

  const { data, isLoading } = useRoles()
  const createMutation = useCreateRole()

  const roles = data?.items || data || []

  const columns = [
    {
      header: 'Name',
      render: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span style={{ color: 'var(--text-secondary)' }}>
          {row.description || 'N/A'}
        </span>
      ),
    },
  ]

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Role created successfully')
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed')
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Roles</h1>
        {canManageRoles(user) && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add Role
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={roles}
        emptyMessage="No roles found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Role"
      >
        <RoleForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default RolesPage
