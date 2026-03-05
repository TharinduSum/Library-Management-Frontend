import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  ArrowRightLeft,
  Users,
  Shield,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { hasPermission, PERMISSIONS } from '../../utils/permissions'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', permission: null },
  { path: '/books', icon: BookOpen, label: 'Books', permission: PERMISSIONS.BOOKS_READ },
  { path: '/borrows', icon: ArrowRightLeft, label: 'Borrows', permission: PERMISSIONS.BORROWS_READ },
  { path: '/users', icon: Users, label: 'Users', permission: PERMISSIONS.USERS_READ },
  { path: '/roles', icon: Shield, label: 'Roles', permission: PERMISSIONS.ROLES_READ },
]

export const Sidebar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const filteredNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(user, item.permission)
  )

  return (
    <>
      <button
        className="btn btn-ghost mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1001,
          display: 'none',
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className="sidebar"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transition: 'transform var(--transition-normal)',
          transform: isOpen ? 'translateX(0)' : 'translateX(0)',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Library
          </h1>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none',
                }}
              >
                <item.icon size={20} />
                <span style={{ fontWeight: 500 }}>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={onLogout}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .sidebar {
            transform: translateX(${isOpen ? '0' : '-100%'}) !important;
          }
        }
      `}</style>
    </>
  )
}

export default Sidebar
