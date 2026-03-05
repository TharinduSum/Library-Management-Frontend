import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../../hooks'
import { Button, Input, Modal, Table, Badge, Spinner } from '../../components/ui'
import { BookForm } from '../../components/forms'
import { canManageBooks, canDeleteBooks } from '../../utils/permissions'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export const BooksPage = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [deleteBook, setDeleteBook] = useState(null)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const { data, isLoading } = useBooks({ search })
  const createMutation = useCreateBook()
  const updateMutation = useUpdateBook()
  const deleteMutation = useDeleteBook()

  const books = data?.items || data || []

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.isbn}
          </div>
        </div>
      ),
    },
    { header: 'Author', accessor: 'author' },
    { header: 'Genre', accessor: 'genre' },
    {
      header: 'Available',
      render: (row) => (
        <Badge variant={row.available_copies > 0 ? 'success' : 'error'}>
          {row.available_copies}/{row.total_copies}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex gap-2">
          {canManageBooks(user) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation()
                setEditingBook(row)
                setIsModalOpen(true)
              }}
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDeleteBooks(user) && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--error)' }}
              onClick={(e) => {
                e.stopPropagation()
                setDeleteBook(row)
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ]

  const handleSubmit = async (data) => {
    try {
      if (editingBook) {
        await updateMutation.mutateAsync({ id: editingBook.id, data })
        toast.success('Book updated successfully')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Book created successfully')
      }
      setIsModalOpen(false)
      setEditingBook(null)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteBook.id)
      toast.success('Book deleted successfully')
      setDeleteBook(null)
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Books</h1>
        {canManageBooks(user) && (
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add Book
          </Button>
        )}
      </div>

      <div className="search-input mb-4">
        <Search size={18} className="search-input-icon" />
        <Input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      <Table
        columns={columns}
        data={books}
        onRowClick={(row) => navigate(`/books/${row.id}`)}
        emptyMessage="No books found"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBook(null)
        }}
        title={editingBook ? 'Edit Book' : 'Add Book'}
      >
        <BookForm
          book={editingBook}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingBook(null)
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        title="Delete Book"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteBook(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{deleteBook?.title}</strong>?
        </p>
      </Modal>
    </div>
  )
}

export default BooksPage
