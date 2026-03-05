import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuthStore } from '../../store/authStore'

export const AppShell = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar onLogout={handleLogout} />
      <Topbar />
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          marginTop: 'var(--topbar-height)',
          padding: '2rem',
          minHeight: 'calc(100vh - var(--topbar-height))',
        }}
      >
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          main {
            margin-left: 0 !important;
            padding: 1rem !important;
            padding-top: 4rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AppShell
