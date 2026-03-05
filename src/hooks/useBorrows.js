import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { borrowsApi } from '../api/borrows'

export const useBorrows = (params = {}) => {
  return useQuery({
    queryKey: ['borrows', params],
    queryFn: () => borrowsApi.getAll(params),
  })
}

export const useBorrow = (id) => {
  return useQuery({
    queryKey: ['borrow', id],
    queryFn: () => borrowsApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateBorrow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: borrowsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export const useReturnBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: borrowsApi.returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
