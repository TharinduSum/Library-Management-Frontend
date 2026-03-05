export const PERMISSIONS = {
  BOOKS_READ: 'books:read',
  BOOKS_WRITE: 'books:write',
  BOOKS_DELETE: 'books:delete',
  BORROWS_READ: 'borrows:read',
  BORROWS_WRITE: 'borrows:write',
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  ROLES_READ: 'roles:read',
  ROLES_WRITE: 'roles:write',
  ROLES_DELETE: 'roles:delete',
  API_KEYS_READ: 'api_keys:read',
  API_KEYS_WRITE: 'api_keys:write',
}

export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false
  return user.permissions.includes(permission)
}

export const hasAnyPermission = (user, permissions) => {
  if (!user || !user.permissions) return false
  return permissions.some((p) => user.permissions.includes(p))
}

export const hasAllPermissions = (user, permissions) => {
  if (!user || !user.permissions) return false
  return permissions.every((p) => user.permissions.includes(p))
}

export const hasRole = (user, role) => {
  if (!user || !user.role) return false
  return user.role === role
}

export const isAdmin = (user) => hasRole(user, 'admin')
export const isLibrarian = (user) => hasRole(user, 'librarian')
export const isMember = (user) => hasRole(user, 'member')

export const canManageBooks = (user) =>
  hasPermission(user, PERMISSIONS.BOOKS_WRITE)
export const canDeleteBooks = (user) =>
  hasPermission(user, PERMISSIONS.BOOKS_DELETE)
export const canManageBorrows = (user) =>
  hasPermission(user, PERMISSIONS.BORROWS_WRITE)
export const canManageUsers = (user) =>
  hasPermission(user, PERMISSIONS.USERS_WRITE)
export const canManageRoles = (user) =>
  hasPermission(user, PERMISSIONS.ROLES_WRITE)
