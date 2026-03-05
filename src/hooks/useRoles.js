import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rolesApi } from '../api/roles'

export const useRoles = (params = {}) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => rolesApi.getAll(params),
  })
}

export const useRole = (id) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => rolesApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}
