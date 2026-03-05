import api from './axios'

export const booksApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/books/', { params })
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/books/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post('/books/', data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.patch(`/books/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },
}
