import api from './axios'

export const rolesApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/roles/', { params })
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/roles/', data)
    return response.data
  },
}
