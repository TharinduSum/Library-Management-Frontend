import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { hasPermission } from '../utils/permissions'
import { Spinner } from './ui/Spinner'

export const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, user, token } = useAuthStore()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spinner size="lg" />
      </div>
    )
  }

  if (permission && !hasPermission(user, permission)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
