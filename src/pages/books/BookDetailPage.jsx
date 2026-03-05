import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { useBook, useDeleteBook, useBorrows } from '../../hooks'
import { Button, Badge, Spinner } from '../../components/ui'
import { canManageBooks, canDeleteBooks } from '../../utils/permissions'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export const BookDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const { data: book, isLoading } = useBook(id)
  const { data: borrowsData } = useBorrows({ book_id: id })
  const deleteMutation = useDeleteBook()

  const borrows = borrowsData?.items || borrowsData || []

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Book deleted successfully')
      navigate('/books')
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

  if (!book) {
    return (
      <div className="empty-state">
        <p>Book not found</p>
        <Button onClick={() => navigate('/books')}>Back to Books</Button>
      </div>
    )
  }

  const borrowHistory = borrows.slice(0, 10)

  return (
    <div>
      <button
        className="btn btn-ghost mb-4"
        onClick={() => navigate('/books')}
      >
        <ArrowLeft size={18} />
        Back to Books
      </button>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{book.title}</h1>
            <div className="flex gap-2">
              {canManageBooks(user) && (
                <Button variant="secondary" onClick={() => navigate(`/books/${id}/edit`)}>
                  <Edit2 size={16} />
                  Edit
                </Button>
              )}
              {canDeleteBooks(user) && (
                <Button variant="danger" onClick={handleDelete}>
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Author: </span>
              <span>{book.author}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>ISBN: </span>
              <span>{book.isbn}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Genre: </span>
              <span>{book.genre}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Published Year: </span>
              <span>{book.published_year}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Availability: </span>
              <Badge variant={book.available_copies > 0 ? 'success' : 'error'}>
                {book.available_copies} / {book.total_copies} available
              </Badge>
            </div>
            {book.description && (
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Description: </span>
                <p style={{ marginTop: '0.5rem' }}>{book.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Borrow History
          </h2>
          {borrowHistory.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {borrowHistory.map((borrow) => (
                <div
                  key={borrow.id}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontWeight: 500 }}>{borrow.user_name}</span>
                    <Badge
                      variant={
                        borrow.status === 'returned'
                          ? 'success'
                          : borrow.status === 'overdue'
                          ? 'error'
                          : 'warning'
                      }
                    >
                      {borrow.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Borrowed: {format(new Date(borrow.borrowed_at), 'MMM d, yyyy')}
                    {borrow.returned_at && ` | Returned: ${format(new Date(borrow.returned_at), 'MMM d, yyyy')}`}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No borrow history</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage
