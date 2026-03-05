import api from './axios'

export const usersApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/users/', { params })
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
  register: async (data) => {
    const response = await api.post('/users/', data)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/users/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
  getMyApiKeys: async () => {
    const response = await api.get('/users/me/api-keys')
    return response.data
  },
  createMyApiKey: async (data) => {
    const response = await api.post('/users/me/api-keys', data)
    return response.data
  },
  revokeApiKey: async (keyId) => {
    const response = await api.delete(`/users/me/api-keys/${keyId}`)
    return response.data
  },
}
