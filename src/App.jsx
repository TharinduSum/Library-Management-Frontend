import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { BooksPage } from './pages/books/BooksPage'
import { BookDetailPage } from './pages/books/BookDetailPage'
import { BorrowsPage } from './pages/borrows/BorrowsPage'
import { UsersPage } from './pages/users/UsersPage'
import { ApiKeysPage } from './pages/users/ApiKeysPage'
import { RolesPage } from './pages/roles/RolesPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { PERMISSIONS } from './utils/permissions'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        
        <Route
          path="/books"
          element={
            <ProtectedRoute permission={PERMISSIONS.BOOKS_READ}>
              <BooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute permission={PERMISSIONS.BOOKS_READ}>
              <BookDetailPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/borrows"
          element={
            <ProtectedRoute permission={PERMISSIONS.BORROWS_READ}>
              <BorrowsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/users"
          element={
            <ProtectedRoute permission={PERMISSIONS.USERS_READ}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id/api-keys"
          element={
            <ProtectedRoute permission={PERMISSIONS.API_KEYS_READ}>
              <ApiKeysPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/roles"
          element={
            <ProtectedRoute permission={PERMISSIONS.ROLES_READ}>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
