import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '../api/books'

export const useBooks = (params = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.getAll(params),
  })
}

export const useBook = (id) => {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: booksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => booksApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      queryClient.invalidateQueries({ queryKey: ['book', id] })
    },
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: booksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
