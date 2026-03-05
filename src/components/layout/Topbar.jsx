import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Key, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-width)',
        right: 0,
        height: 'var(--topbar-height)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 1.5rem',
        zIndex: 999,
      }}
    >
      <div className="dropdown">
        <button
          className="btn btn-ghost"
          onClick={() => setIsOpen(!isOpen)}
          style={{ gap: '0.75rem' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ fontWeight: 500 }}>{user?.name || 'User'}</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => {
                navigate('/profile')
                setIsOpen(false)
              }}
            >
              <User size={16} />
              <span>Profile</span>
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                navigate('/profile?tab=api-keys')
                setIsOpen(false)
              }}
            >
              <Key size={16} />
              <span>API Keys</span>
            </div>
            <div
              className="dropdown-item"
              onClick={handleLogout}
              style={{ color: 'var(--error)' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          header {
            left: 0 !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Topbar
