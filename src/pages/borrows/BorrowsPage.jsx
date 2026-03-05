import React, { useState } from 'react'
import { Plus, RotateCcw } from 'lucide-react'
import { useBorrows, useBooks, useCreateBorrow, useReturnBook } from '../../hooks'
import { Button, Modal, Table, Badge, Spinner } from '../../components/ui'
import { BorrowForm } from '../../components/forms'
import { canManageBorrows } from '../../utils/permissions'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export const BorrowsPage = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = useAuthStore((state) => state.user)

  const { data, isLoading } = useBorrows({ status: statusFilter })
  const { data: booksData } = useBooks()
  const createMutation = useCreateBorrow()
  const returnMutation = useReturnBook()

  const borrows = data?.items || data || []
  const books = booksData?.items || booksData || []

  const columns = [
    {
      header: 'Book',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.book_title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.book_isbn}
          </div>
        </div>
      ),
    },
    {
      header: 'User',
      accessor: 'user_name',
    },
    {
      header: 'Borrowed',
      render: (row) => format(new Date(row.borrowed_at), 'MMM d, yyyy'),
    },
    {
      header: 'Due Date',
      render: (row) => format(new Date(row.due_date), 'MMM d, yyyy'),
    },
    {
      header: 'Status',
      render: (row) => {
        const isOverdue =
          row.status === 'active' && new Date(row.due_date) < new Date()
        return (
          <Badge variant={isOverdue ? 'error' : row.status === 'returned' ? 'success' : 'warning'}>
            {isOverdue ? 'overdue' : row.status}
          </Badge>
        )
      },
    },
    {
      header: 'Actions',
      width: '100px',
      render: (row) =>
        row.status === 'active' && canManageBorrows(user) ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleReturn(row.id)}
          >
            <RotateCcw size={14} />
            Return
          </Button>
        ) : null,
    },
  ]

  const handleSubmit = async (data) => {
    try {
      await createMutation.mutateAsync(data)
      toast.success('Book borrowed successfully')
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Borrow failed')
    }
  }

  const handleReturn = async (id) => {
    try {
      await returnMutation.mutateAsync(id)
      toast.success('Book returned successfully')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Return failed')
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Borrows</h1>
        {canManageBorrows(user) && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Borrow Book
          </Button>
        )}
      </div>

      <div className="search-input mb-4">
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={borrows}
        emptyMessage="No borrows found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Borrow Book"
      >
        <BorrowForm
          books={books}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default BorrowsPage
