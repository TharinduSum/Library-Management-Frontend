import React from 'react'
import { BookOpen, Users, ArrowRightLeft, AlertCircle } from 'lucide-react'
import { useBooks, useBorrows, useUsers } from '../../hooks'
import { Spinner } from '../../components/ui'

export const DashboardPage = () => {
  const { data: booksData, isLoading: booksLoading } = useBooks()
  const { data: borrowsData, isLoading: borrowsLoading } = useBorrows()
  const { data: usersData, isLoading: usersLoading } = useUsers()

  const isLoading = booksLoading || borrowsLoading || usersLoading

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Spinner size="lg" />
      </div>
    )
  }

  const books = booksData?.items || booksData || []
  const borrows = borrowsData?.items || borrowsData || []
  const users = usersData?.items || usersData || []

  const totalBooks = books.length
  const totalUsers = users.length
  const activeBorrows = borrows.filter((b) => b.status === 'active').length
  const overdueBorrows = borrows.filter((b) => {
    if (b.status !== 'active') return false
    const dueDate = new Date(b.due_date)
    return dueDate < new Date()
  }).length

  const stats = [
    {
      label: 'Total Books',
      value: totalBooks,
      icon: BookOpen,
      color: 'var(--accent-primary)',
    },
    {
      label: 'Active Borrows',
      value: activeBorrows,
      icon: ArrowRightLeft,
      color: 'var(--info)',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'var(--success)',
    },
    {
      label: 'Overdue',
      value: overdueBorrows,
      icon: AlertCircle,
      color: 'var(--error)',
    },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Dashboard
      </h1>

      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Recent Books
          </h2>
          {books.slice(0, 5).map((book) => (
            <div
              key={book.id}
              className="flex items-center justify-between"
              style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{book.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {book.author}
                </div>
              </div>
              <span
                className="badge"
                style={{
                  background: book.available_copies > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  color: book.available_copies > 0 ? 'var(--success)' : 'var(--error)',
                }}
              >
                {book.available_copies}/{book.total_copies}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            Recent Borrows
          </h2>
          {borrows.slice(0, 5).map((borrow) => (
            <div
              key={borrow.id}
              style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontWeight: 500 }}>{borrow.book_title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {borrow.user_name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
