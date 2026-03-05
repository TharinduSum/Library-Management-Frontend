import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users'

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params),
  })
}

export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => usersApi.getMe(),
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useMyApiKeys = () => {
  return useQuery({
    queryKey: ['myApiKeys'],
    queryFn: () => usersApi.getMyApiKeys(),
  })
}

export const useCreateMyApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.createMyApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApiKeys'] })
    },
  })
}

export const useRevokeMyApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApiKeys'] })
    },
  })
}

export const useUserApiKeys = (userId) => {
  return useQuery({
    queryKey: ['userApiKeys', userId],
    queryFn: () => usersApi.getMyApiKeys(),
    enabled: !!userId,
  })
}

export const useCreateApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.createMyApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApiKeys'] })
      queryClient.invalidateQueries({ queryKey: ['userApiKeys'] })
    },
  })
}

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: usersApi.revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApiKeys'] })
      queryClient.invalidateQueries({ queryKey: ['userApiKeys'] })
    },
  })
}
