import api from './axios'

export const authApi = {
  login: async (credentials) => {
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)
    
    const response = await api.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return response.data
  },
  loginJson: async (credentials) => {
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    })
    return response.data
  },
  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },
}
