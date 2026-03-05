import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Button } from '../ui'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role_id: z.number().min(1, 'Role is required'),
  is_active: z.boolean().default(true),
})

export const UserForm = ({ user, roles, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role_id: user.role_id,
          is_active: user.is_active,
        }
      : {
          name: '',
          email: '',
          password: '',
          role_id: '',
          is_active: true,
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      {!user && (
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
      )}
      <div className="form-group">
        <label className="label">Role</label>
        <select className="input" {...register('role_id', { valueAsNumber: true })}>
          <option value="">Select a role</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.role_id && <p className="error-text">{errors.role_id.message}</p>}
      </div>
      <div className="flex gap-3 justify-end mt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          {user ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

export default UserForm
