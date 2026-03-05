import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      apiKey: null,

      login: (token, refreshToken, user) => {
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          apiKey: null,
        })
      },

      setToken: (token) => {
        set({ token })
      },

      setUser: (user) => {
        set({ user })
      },

      setApiKey: (apiKey) => {
        set({ apiKey })
      },

      hasPermission: (permission) => {
        const { user } = get()
        if (!user || !user.permissions) return false
        return user.permissions.includes(permission)
      },

      hasRole: (role) => {
        const { user } = get()
        if (!user || !user.role) return false
        return user.role === role
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        apiKey: state.apiKey,
      }),
    }
  )
)
